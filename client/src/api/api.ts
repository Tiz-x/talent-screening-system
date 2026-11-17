const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:10000';

export const api = {
  // 1. Register User
  register: async (name: string, email: string, password: string, role: string) => {
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role }),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Registration failed');
    }
    return res.json();
  },

  // 2. Login User
  login: async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Login failed');
    }
    return res.json(); // Returns { token, user }
  },

  // 3. Save Applicant Profile
  saveApplicantProfile: async (profileData: {
    qualification: string;
    skills: string[];
    experienceYrs: number;
    cvUrl: string | null;
  }) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/api/profile/applicant`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(profileData),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Failed to save profile');
    }
    return res.json();
  },

  // 4. Create Vacancy
  createVacancy: async (vacancyData: {
   title: string;
    companyName: string;
    location: string;
    workMode: string;
    salary: string;
    type: string;
    description: string;
    deadline: string;
    minQualification: string;
    requiredSkills: string[];
    requiredYears: number;
    weights: { qual: number; skills: number; exp: number; certs: number };
  }) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/api/vacancies`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(vacancyData),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Failed to create vacancy');
    }
    return res.json();
  },

  // 5. Get Vacancies
  getVacancies: async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/api/vacancies`, {
      headers: { 
        'Authorization': `Bearer ${token}` 
      },
    });
    if (!res.ok) throw new Error('Failed to fetch vacancies');
    return res.json();
  },

  // 6. Apply for Vacancy
  applyForVacancy: async (vacancyId: string) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/api/applications`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ vacancyId }),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Failed to apply');
    }
    return res.json();
  },

  // 7. Run Screening
  runScreening: async (vacancyId: string) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/api/vacancies/${vacancyId}/screen`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to run screening');
    return res.json();
  },

  // 8. Create Internship
  createInternship: async (data: {
    title: string;
    companyName: string;
    description: string;
    location: string;
    duration: string;
    deadline: string;
  }) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/api/internships`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create internship');
    return res.json();
  },

  // 9. Get Internships
  getInternships: async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/api/internships`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch internships');
    return res.json();
  },

  // 10. Apply for Internship
  applyForInternship: async (internshipId: string) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/api/internships/${internshipId}/apply`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Failed to apply');
    }
    return res.json();
  },

    // 11. Get My Applications
  getMyApplications: async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/api/applications/my`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch applications');
    return res.json();
  },

  // 13. Get Employer Dashboard Stats
  getEmployerStats: async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/api/dashboard/employer`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  },



    // 14. Get Applicant Dashboard Stats
  getApplicantStats: async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/api/dashboard/applicant`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  },

    // 16. Update Application Status
  updateApplicationStatus: async (applicationId: string, status: string) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/api/applications/${applicationId}/status`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update status');
    return res.json();
  },

  // 17. Get My Profile
  getMyProfile: async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/api/profile/applicant`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch profile');
    return res.json();
  },


 // 18. Upload CV
  uploadCV: async (file: File) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('cv', file);

    const res = await fetch(`${API_URL}/api/upload/cv`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }, // Don't set Content-Type, let the browser do it for FormData
      body: formData,
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Failed to upload CV');
    }
    return res.json();
  },

    // 19. Get Internship Applicants
  getInternshipApplicants: async (internshipId: string) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/api/internships/${internshipId}/applicants`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch applicants');
    return res.json();
  },


    // 20. Get My Internship Applications
  getMyInternshipApplications: async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/api/internships/my`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch internship applications');
    return res.json();
  },

    // 21. Schedule Interview
  scheduleInterview: async (data: {
    applicationId: string;
    date: string;
    time: string;
    mode: string;
    link: string;
    notes: string;
  }) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/api/interviews`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to schedule interview');
    return res.json();
  },


};