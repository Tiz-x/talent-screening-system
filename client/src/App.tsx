import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard'; 
import Vacancies from './pages/Vacancies';
import EmployerVacancies from './pages/EmployerVacancies';
import Applications from './pages/Applications';
import Profile from './pages/Profile';
import EmployerRanking from './pages/EmployerRanking';
import CreateVacancy from './pages/CreateVacancy';
import Internships from './pages/Internships';
import EmployerInternships from './pages/EmployerInternships';
import { getLoggedInUser } from './api/mockData';

function App() {
  const user = getLoggedInUser();
  const isEmployer = user.role === 'EMPLOYER';

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          
          <Route path="vacancies" element={isEmployer ? <EmployerVacancies /> : <Vacancies />} />
          <Route path="employer/create-vacancy" element={<CreateVacancy />} />
          <Route path="employer/ranking" element={<EmployerRanking />} />
          
          <Route path="applications" element={<Applications />} />
          <Route path="profile" element={<Profile />} />

          <Route path="internships" element={isEmployer ? <EmployerInternships /> : <Internships />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;