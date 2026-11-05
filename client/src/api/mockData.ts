export type Role = 'APPLICANT' | 'EMPLOYER';

export const getLoggedInUser = () => {
  const savedRole = (localStorage.getItem('userRole') as Role) || 'APPLICANT';
  return {
    id: '1',
    name: savedRole === 'EMPLOYER' ? 'TechNova HR' : 'John Doe',
    email: savedRole === 'EMPLOYER' ? 'hr@technova.com' : 'john@aaua.edu.ng',
    role: savedRole,
  };
};

export const mockVacancies = [
  {
    id: 'v1',
    title: 'Frontend Developer Intern',
    company: 'TechNova Solutions',
    location: 'Akungba, Ondo State',
    type: 'Internship',
    status: 'PUBLISHED',
    deadline: '2026-12-31',
    minQualification: 'BSC',
    requiredSkills: ['React', 'TypeScript', 'CSS'],
    requiredYears: 1,
  },
  {
    id: 'v2',
    title: 'Junior Backend Engineer',
    company: 'DataSphere',
    location: 'Remote',
    type: 'Full-time',
    status: 'PUBLISHED',
    deadline: '2026-11-15',
    minQualification: 'HND',
    requiredSkills: ['Node.js', 'Express', 'PostgreSQL'],
    requiredYears: 2,
  }
];

export const mockApplicants = [
  {
    id: 'a1',
    name: 'Alice Johnson',
    qualification: 'BSC',
    skills: ['React', 'TypeScript', 'CSS', 'HTML'],
    yearsExp: 2,
    certs: ['Meta Frontend'],
    totalScore: 84.5,
    skillsScore: 100,
    expScore: 100,
    qualScore: 80,
    certsScore: 50,
    status: 'SHORTLISTED',
  },
  {
    id: 'a2',
    name: 'Bob Smith',
    qualification: 'HND',
    skills: ['React', 'CSS'],
    yearsExp: 1,
    certs: [],
    totalScore: 54.0,
    skillsScore: 66.6,
    expScore: 50,
    qualScore: 60,
    certsScore: 0,
    status: 'UNDER_REVIEW',
  },
];

export const mockApplications = [
  {
    id: 'app1',
    vacancyId: 'v1',
    jobTitle: 'Frontend Developer Intern',
    company: 'TechNova Solutions',
    dateApplied: '2026-10-15',
    status: 'INTERVIEW',
    history: [
      { status: 'Submitted', date: '2026-10-15', note: 'Application received' },
      { status: 'Under Review', date: '2026-10-17', note: 'Employer reviewing application' },
      { status: 'Shortlisted', date: '2026-10-20', note: 'You have been shortlisted for the next stage' },
      { status: 'Assessment', date: '2026-10-22', note: 'Aptitude test completed' },
      { status: 'Interview', date: '2026-10-25', note: 'Interview scheduled for Oct 30, 2026 at 10:00 AM (Virtual)' },
    ]
  }
];

export const mockInternships = [
  {
    id: 'int1',
    title: 'Software Engineering Intern',
    company: 'TechNova Solutions',
    location: 'Akungba (Hybrid)',
    duration: '6 Months',
    deadline: '2026-12-15',
    description: 'Join our engineering team to build real-world web applications.',
    status: 'PUBLISHED'
  },
  {
    id: 'int2',
    title: 'HR & Recruitment Intern',
    company: 'PeopleFirst Consulting',
    location: 'Remote',
    duration: '3 Months',
    deadline: '2026-11-30',
    description: 'Learn the ropes of talent acquisition and HR management.',
    status: 'PUBLISHED'
  }
];