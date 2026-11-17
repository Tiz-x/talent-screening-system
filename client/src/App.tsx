import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing'; // <-- Import Landing Page
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard'; 
import Vacancies from './pages/Vacancies';
import EmployerVacancies from './pages/EmployerVacancies';
import Applications from './pages/Applications';
import Profile from './pages/Profile';
import EmployerRanking from './pages/EmployerRanking';
import CreateVacancy from './pages/CreateVacancy';
import Internships from './pages/Internships';
import EmployerInternships from './pages/EmployerInternships';
import InternshipApplicants from './pages/InternshipApplicants';
import { getLoggedInUser } from './api/mockData';

// 1. This component acts as a gatekeeper
const ProtectedRoute = () => {
  const token = localStorage.getItem('token');
  
  // If there is no token, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If there is a token, render the Layout (which includes the Sidebar and the Outlet for pages)
  return <Layout />;
};

function App() {
  const user = getLoggedInUser();
  const isEmployer = user.role === 'EMPLOYER';

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} /> {/* <-- New Landing Page */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} /> {/* <-- Moved Dashboard here */}
          
          <Route path="/vacancies" element={isEmployer ? <EmployerVacancies /> : <Vacancies />} />
          <Route path="/employer/create-vacancy" element={<CreateVacancy />} />
          <Route path="/employer/ranking" element={<EmployerRanking />} />
          
          <Route path="/applications" element={<Applications />} />
          <Route path="/profile" element={<Profile />} />

          <Route path="/internships" element={isEmployer ? <EmployerInternships /> : <Internships />} />
          <Route path="/internships/:internshipId/applicants" element={<InternshipApplicants />} />
        </Route>
        
        {/* Catch-all redirect for unknown URLs */}
        <Route path="*" element={<Navigate to="/" replace />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;