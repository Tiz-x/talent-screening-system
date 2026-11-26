import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { calculateScore } from './services/screening';
import { sendEmail } from './services/email'; // <-- Import Email Service
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

const app = express();
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is missing');
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

app.use(cors());
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.send('Talent Screening API is running smoothly!');
});

// --- MIDDLEWARE ---
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret', (err: any, user: any) => {
    if (err) return res.status(403).json({ error: 'Invalid token.' });
    req.user = user;
    next();
  });
};

// --- AUTH ROUTES ---

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role },
    });

    res.status(201).json({ message: 'User created successfully', userId: user.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '1d' } 
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// --- PROFILE ROUTES ---

app.post('/api/profile/applicant', authenticateToken, async (req: any, res: any) => {
  try {
    const { qualification, skills, experienceYrs, cvUrl, additionalInfo } = req.body;
    const userId = req.user.userId;

    const profile = await prisma.applicantProfile.upsert({
      where: { userId },
      update: { qualification, skills, experienceYrs, cvUrl, additionalInfo },
      create: { userId, qualification, skills, experienceYrs, cvUrl, additionalInfo },
    });

    res.status(200).json({ message: 'Profile saved successfully', profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save profile' });
  }
});

// --- VACANCY ROUTES ---

app.post('/api/vacancies', authenticateToken, async (req: any, res: any) => {
  try {
    if (req.user.role !== 'EMPLOYER') {
      return res.status(403).json({ error: 'Only employers can create vacancies' });
    }

    const { 
      title, companyName, location, workMode, salary, type, description, 
      deadline, minQualification, requiredSkills, requiredYears, weights 
    } = req.body;

    const vacancy = await prisma.vacancy.create({
      data: {
        employerId: req.user.userId,
        title, companyName, location, workMode, salary, type, description,
        deadline: new Date(deadline),
        minQualification, requiredSkills,
        requiredYears: parseInt(requiredYears),
        weights, status: 'PUBLISHED'
      }
    });

    res.status(201).json({ message: 'Vacancy created successfully', vacancy });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create vacancy' });
  }
});


// GET ALL VACANCIES
app.get('/api/vacancies', authenticateToken, async (req: any, res: any) => {
  try {
    let whereClause: any = { status: 'PUBLISHED' };

    // If the user is an Employer, only show THEIR vacancies
    if (req.user.role === 'EMPLOYER') {
      whereClause = { 
        ...whereClause, 
        employerId: req.user.userId 
      };
      
      // If they want to see expired jobs too (for screening past applicants)
      if (req.query.all !== 'true') {
        whereClause.deadline = { gte: new Date() };
      }
    } else {
      // If the user is an Applicant, only show jobs that haven't expired
      whereClause.deadline = { gte: new Date() };
    }

    const vacancies = await prisma.vacancy.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { applications: true } 
        }
      }
    });
    res.status(200).json(vacancies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch vacancies' });
  }
});


// APPLY FOR A VACANCY
app.post('/api/applications', authenticateToken, async (req: any, res: any) => {
  try {
    if (req.user.role !== 'APPLICANT') {
      return res.status(403).json({ error: 'Only applicants can apply' });
    }

    const { vacancyId } = req.body;
    const applicantId = req.user.userId;

    const vacancy = await prisma.vacancy.findUnique({ where: { id: vacancyId } });
    if (!vacancy) return res.status(404).json({ error: 'Vacancy not found' });
    
    if (new Date(vacancy.deadline) < new Date()) {
      return res.status(400).json({ error: 'The application deadline for this job has passed.' });
    }

    const existingApp = await prisma.application.findUnique({
      where: { vacancyId_applicantId: { vacancyId, applicantId } }
    });

    if (existingApp) {
      return res.status(400).json({ error: 'You have already applied for this job' });
    }

    const application = await prisma.application.create({
      data: { vacancyId, applicantId, status: 'SUBMITTED' }
    });

    // --- EMAIL NOTIFICATION: Application Received ---
    const applicant = await prisma.user.findUnique({ where: { id: applicantId } });
    if (applicant) {
      await sendEmail(
        applicant.email,
        `Application Received: ${vacancy.title}`,
        `<p>Hi ${applicant.name},</p>
         <p>Your application for <strong>${vacancy.title}</strong> at <strong>${vacancy.companyName}</strong> has been received successfully.</p>
         <p>You can track your status on your dashboard.</p>`
      );
    }

    res.status(201).json({ message: 'Application submitted successfully', application });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to submit application' });
  }
});

// --- SCREENING ENGINE ROUTE ---

app.get('/api/vacancies/:vacancyId/screen', authenticateToken, async (req: any, res: any) => {
  try {
    if (req.user.role !== 'EMPLOYER') {
      return res.status(403).json({ error: 'Only employers can run screening' });
    }

    const { vacancyId } = req.params;

    const vacancy = await prisma.vacancy.findUnique({ where: { id: vacancyId } });
    if (!vacancy) return res.status(404).json({ error: 'Vacancy not found' });

    const applications = await prisma.application.findMany({
      where: { vacancyId },
      include: {
        applicant: { include: { applicantProfile: true } }
      }
    });

    const results = applications.map((app) => {
      const profile = app.applicant.applicantProfile;
      
      if (!profile) {
        return {
          applicationId: app.id, 
          applicantName: app.applicant.name,
          profile: null,
          knockedOut: true, reason: 'Profile incomplete', totalScore: 0, breakdown: null,
          status: app.status
        };
      }

      const scoreResult = calculateScore(vacancy, profile);

      return {
        applicationId: app.id, 
        applicantName: app.applicant.name, 
        status: app.status,
        profile: {
          qualification: profile.qualification,
          skills: profile.skills,
          experienceYrs: profile.experienceYrs,
          cvUrl: profile.cvUrl,
          additionalInfo: profile.additionalInfo
        },
        ...scoreResult
      };
    });

    results.sort((a, b) => {
      if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
      if (b.breakdown?.skillsScore !== a.breakdown?.skillsScore) {
         return (b.breakdown?.skillsScore || 0) - (a.breakdown?.skillsScore || 0);
      }
      return (b.breakdown?.expScore || 0) - (a.breakdown?.expScore || 0);
    });

    res.status(200).json({ vacancyTitle: vacancy.title, results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Screening failed' });
  }
});

// --- INTERNSHIP ROUTES ---

app.post('/api/internships', authenticateToken, async (req: any, res: any) => {
  try {
    if (req.user.role !== 'EMPLOYER') return res.status(403).json({ error: 'Only employers can post internships' });
    
    const { title, companyName, description, location, duration, deadline } = req.body;

    const internship = await prisma.internship.create({
      data: {
        employerId: req.user.userId,
        title, companyName, description, location, duration,
        deadline: new Date(deadline), status: 'PUBLISHED'
      }
    });
    res.status(201).json({ message: 'Internship created', internship });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create internship' });
  }
});

app.get('/api/internships', authenticateToken, async (req, res) => {
  try {
    const internships = await prisma.internship.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json(internships);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch internships' });
  }
});

app.post('/api/internships/:internshipId/apply', authenticateToken, async (req: any, res: any) => {
  try {
    if (req.user.role !== 'APPLICANT') return res.status(403).json({ error: 'Only applicants can apply' });

    const { internshipId } = req.params;
    const applicantId = req.user.userId;

    const existing = await prisma.internshipApplication.findUnique({
      where: { internshipId_applicantId: { internshipId, applicantId } }
    });

    if (existing) return res.status(400).json({ error: 'You already applied for this internship' });

    const application = await prisma.internshipApplication.create({
      data: { internshipId, applicantId }
    });
    res.status(201).json({ message: 'Applied successfully', application });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to apply' });
  }
});

app.get('/api/internships/my', authenticateToken, async (req: any, res: any) => {
  try {
    if (req.user.role !== 'APPLICANT') {
      return res.status(403).json({ error: 'Only applicants can view their applications' });
    }

    const applications = await prisma.internshipApplication.findMany({
      where: { applicantId: req.user.userId },
      include: { internship: true },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch internship applications' });
  }
});

app.get('/api/internships/:internshipId/applicants', authenticateToken, async (req: any, res: any) => {
  try {
    if (req.user.role !== 'EMPLOYER') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { internshipId } = req.params;

    const applications = await prisma.internshipApplication.findMany({
      where: { internshipId },
    });

    const results = await Promise.all(applications.map(async (app) => {
      const user = await prisma.user.findUnique({
        where: { id: app.applicantId },
        include: { applicantProfile: true }
      });
      return {
        applicationId: app.id,
        status: app.status,
        applicantName: user?.name || 'Unknown',
        email: user?.email || 'N/A',
        profile: user?.applicantProfile || null
      };
    }));

    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch internship applicants' });
  }
});

// --- DASHBOARD ROUTES ---

app.get('/api/applications/my', authenticateToken, async (req: any, res: any) => {
  try {
    if (req.user.role !== 'APPLICANT') {
      return res.status(403).json({ error: 'Only applicants can view their applications' });
    }

    const applications = await prisma.application.findMany({
      where: { applicantId: req.user.userId },
      include: { vacancy: true },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

app.get('/api/dashboard/employer', authenticateToken, async (req: any, res: any) => {
  try {
    if (req.user.role !== 'EMPLOYER') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const totalVacancies = await prisma.vacancy.count({
      where: { employerId: req.user.userId }
    });

    const applications = await prisma.application.findMany({
      where: { vacancy: { employerId: req.user.userId } },
      select: { status: true }
    });

    const chartData = [
      { name: 'Submitted', count: applications.filter(a => a.status === 'SUBMITTED').length },
      { name: 'Under Review', count: applications.filter(a => a.status === 'UNDER_REVIEW').length },
      { name: 'Shortlisted', count: applications.filter(a => a.status === 'SHORTLISTED').length },
      { name: 'Assessment', count: applications.filter(a => a.status === 'ASSESSMENT').length },
      { name: 'Interview', count: applications.filter(a => a.status === 'INTERVIEW').length },
      { name: 'Selected', count: applications.filter(a => a.status === 'SELECTED').length },
      { name: 'Rejected', count: applications.filter(a => a.status === 'REJECTED').length },
    ];

    res.status(200).json({ 
      totalVacancies, 
      totalApplications: applications.length,
      shortlisted: applications.filter(a => a.status === 'SHORTLISTED').length,
      interviews: applications.filter(a => a.status === 'INTERVIEW').length,
      chartData 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

app.get('/api/dashboard/applicant', authenticateToken, async (req: any, res: any) => {
  try {
    if (req.user.role !== 'APPLICANT') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const applications = await prisma.application.findMany({
      where: { applicantId: req.user.userId },
      select: { status: true }
    });

    const totalApplications = applications.length;
    const shortlisted = applications.filter(a => a.status === 'SHORTLISTED' || a.status === 'INTERVIEW' || a.status === 'SELECTED').length;
    const interviews = applications.filter(a => a.status === 'INTERVIEW').length;

    const chartData = [
      { name: 'Submitted', value: applications.filter(a => a.status === 'SUBMITTED').length },
      { name: 'Under Review', value: applications.filter(a => a.status === 'UNDER_REVIEW').length },
      { name: 'Shortlisted', value: applications.filter(a => a.status === 'SHORTLISTED').length },
      { name: 'Interview', value: applications.filter(a => a.status === 'INTERVIEW').length },
      { name: 'Rejected', value: applications.filter(a => a.status === 'REJECTED').length },
    ].filter(item => item.value > 0);

    res.status(200).json({ totalApplications, shortlisted, interviews, chartData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// --- PROFILE & UPLOAD ROUTES ---

app.get('/api/profile/applicant', authenticateToken, async (req: any, res: any) => {
  try {
    const profile = await prisma.applicantProfile.findUnique({
      where: { userId: req.user.userId }
    });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found. Please complete your profile first.' });
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

app.post('/api/upload/cv', authenticateToken, upload.single('cv'), async (req: any, res: any) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: 'image', folder: 'talent_screening_cvs' },
      async (error, result) => {
        if (error || !result) {
          console.error(error);
          return res.status(500).json({ error: 'Cloudinary upload failed' });
        }

        const updatedProfile = await prisma.applicantProfile.upsert({
          where: { userId: req.user.userId },
          update: { cvUrl: result.secure_url },
          create: { 
            userId: req.user.userId, 
            qualification: 'BSC', skills: [], experienceYrs: 0, cvUrl: result.secure_url 
          },
        });

        res.status(200).json({ message: 'CV uploaded successfully', cvUrl: result.secure_url, profile: updatedProfile });
      }
    );

    uploadStream.end(req.file.buffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to upload CV' });
  }
});

// --- INTERVIEW & STATUS ROUTES ---

app.post('/api/interviews', authenticateToken, async (req: any, res: any) => {
  try {
    if (req.user.role !== 'EMPLOYER') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { applicationId, date, time, mode, link, notes } = req.body;

    const interview = await prisma.interview.create({
      data: { applicationId, date: new Date(date), time, mode, link, notes }
    });

    await prisma.application.update({
      where: { id: applicationId },
      data: { status: 'INTERVIEW' }
    });

    // --- EMAIL NOTIFICATION: Interview Scheduled ---
    const appDetails = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { applicant: true, vacancy: true }
    });

    if (appDetails) {
      await sendEmail(
        appDetails.applicant.email,
        `Interview Scheduled: ${appDetails.vacancy.title}`,
        `<p>Hi ${appDetails.applicant.name},</p>
         <p>An interview has been scheduled for your application.</p>
         <p><strong>Date:</strong> ${new Date(date).toLocaleDateString()}</p>
         <p><strong>Time:</strong> ${time}</p>
         <p><strong>Mode:</strong> ${mode}</p>
         <p><strong>Link/Address:</strong> ${link}</p>
         ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}`
      );
    }

    res.status(201).json({ message: 'Interview scheduled successfully', interview });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to schedule interview' });
  }
});

app.patch('/api/applications/:applicationId/status', authenticateToken, async (req: any, res: any) => {
  try {
    if (req.user.role !== 'EMPLOYER') {
      return res.status(403).json({ error: 'Only employers can update statuses' });
    }

    const { applicationId } = req.params;
    const { status } = req.body;

    const validStatuses = ['UNDER_REVIEW', 'SHORTLISTED', 'ASSESSMENT', 'INTERVIEW', 'SELECTED', 'REJECTED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const updatedApp = await prisma.application.update({
      where: { id: applicationId },
      data: { status: status }
    });

    // --- EMAIL NOTIFICATION: Status Updated ---
    const appDetails = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { applicant: true, vacancy: true }
    });

    if (appDetails) {
      await sendEmail(
        appDetails.applicant.email,
        `Update on your application for ${appDetails.vacancy.title}`,
        `<p>Hi ${appDetails.applicant.name},</p>
         <p>Your application status has been updated to: <strong>${status.replace('_', ' ')}</strong>.</p>
         <p>Log in to view more details.</p>`
      );
    }

    res.status(200).json({ message: 'Status updated', application: updatedApp });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// --- START SERVER ---
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});