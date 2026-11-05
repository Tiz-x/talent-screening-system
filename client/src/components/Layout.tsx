import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Briefcase, FileText, User, LogOut, Users, Plus, GraduationCap } from 'lucide-react';
import { getLoggedInUser } from '../api/mockData';

export default function Layout() {
  const navigate = useNavigate();
  const user = getLoggedInUser();
  const isEmployer = user.role === 'EMPLOYER';

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand" style={{ color: '#ffffff', fontSize: '20px', letterSpacing: '-0.5px' }}>
          TalentScreen
        </div>
        
        <nav style={{ marginTop: '24px' }}>
          <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
            <LayoutDashboard size={18} style={{ display: 'inline', marginRight: '12px', verticalAlign: 'text-bottom' }} />
            Dashboard
          </NavLink>
          
          {isEmployer ? (
            <>
              <NavLink to="/vacancies" className={({ isActive }) => isActive ? 'active' : ''}>
                <Briefcase size={18} style={{ display: 'inline', marginRight: '12px', verticalAlign: 'text-bottom' }} />
                My Vacancies
              </NavLink>
              <NavLink to="/employer/create-vacancy" className={({ isActive }) => isActive ? 'active' : ''}>
                <Plus size={18} style={{ display: 'inline', marginRight: '12px', verticalAlign: 'text-bottom' }} />
                Create Vacancy
              </NavLink>
              <NavLink to="/employer/ranking" className={({ isActive }) => isActive ? 'active' : ''}>
                <Users size={18} style={{ display: 'inline', marginRight: '12px', verticalAlign: 'text-bottom' }} />
                Screening & Ranking
              </NavLink>
              <NavLink to="/internships" className={({ isActive }) => isActive ? 'active' : ''}>
                <GraduationCap size={18} style={{ display: 'inline', marginRight: '12px', verticalAlign: 'text-bottom' }} />
                Manage Internships
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/vacancies" className={({ isActive }) => isActive ? 'active' : ''}>
                <Briefcase size={18} style={{ display: 'inline', marginRight: '12px', verticalAlign: 'text-bottom' }} />
                Find Vacancies
              </NavLink>
              <NavLink to="/applications" className={({ isActive }) => isActive ? 'active' : ''}>
                <FileText size={18} style={{ display: 'inline', marginRight: '12px', verticalAlign: 'text-bottom' }} />
                My Applications
              </NavLink>
              <NavLink to="/internships" className={({ isActive }) => isActive ? 'active' : ''}>
                <GraduationCap size={18} style={{ display: 'inline', marginRight: '12px', verticalAlign: 'text-bottom' }} />
                Internship Portal
              </NavLink>
              <NavLink to="/profile" className={({ isActive }) => isActive ? 'active' : ''}>
                <User size={18} style={{ display: 'inline', marginRight: '12px', verticalAlign: 'text-bottom' }} />
                My Profile
              </NavLink>
            </>
          )}
        </nav>

        <div style={{ marginTop: 'auto', position: 'absolute', bottom: '24px', width: '200px' }}>
          <div style={{ padding: '0 12px', marginBottom: '16px', fontSize: '13px', color: 'var(--sidebar-text)' }}>
            Logged in as <br /> 
            <strong style={{ color: '#ffffff', fontSize: '14px' }}>{user.name}</strong>
            <br />
            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {user.role}
            </span>
          </div>
          <button 
            onClick={handleLogout} 
            style={{ 
              background: 'transparent', border: 'none', color: 'var(--sidebar-text)', 
              display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', 
              padding: '10px 12px', width: '100%', borderRadius: '6px', 
              fontFamily: 'inherit', fontSize: '14px'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <LogOut size={18} /> Sign out
          </button>
        </div>
      </aside>

      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}