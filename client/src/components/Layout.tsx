import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Briefcase, FileText, User, LogOut, Users, Plus, GraduationCap, AlertTriangle } from 'lucide-react';
import { getLoggedInUser } from '../api/mockData';

export default function Layout() {
  const navigate = useNavigate();
  const user = getLoggedInUser();
  const isEmployer = user.role === 'EMPLOYER';
  
  // Modal State
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    setIsLogoutModalOpen(false);
    navigate('/login');
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand" style={{ color: '#ffffff', fontSize: '20px', letterSpacing: '-0.5px' }}>
          TalentScreen
        </div>
        
        <nav style={{ marginTop: '24px' }}>
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
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

        {/* User Profile / Logout at the bottom */}
        <div style={{ marginTop: 'auto', position: 'absolute', bottom: '24px', width: '200px' }}>
          {/* <div style={{ padding: '0 12px', marginBottom: '16px', fontSize: '13px', color: 'var(--sidebar-text)' }}>
            Logged in as <br /> 
            <strong style={{ color: '#ffffff', fontSize: '14px' }}>{user.name}</strong>
            <br />
            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {user.role}
            </span>
          </div> */}
          <button 
            onClick={handleLogoutClick} // <-- Open modal
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

      {/* LOGOUT CONFIRMATION MODAL */}
      {isLogoutModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div className="card" style={{ width: '100%', maxWidth: '400px', padding: 0, overflow: 'hidden', animation: 'fadeIn 0.2s ease-out' }}>
            
            <div style={{ padding: '24px', textAlign: 'center' }}>
              <div style={{ background: 'var(--danger-soft)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                <AlertTriangle size={32} style={{ color: 'var(--danger)' }} />
              </div>
              <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>Sign Out</h2>
              <p style={{ color: 'var(--muted)', fontSize: '14px' }}>
                Are you sure you want to sign out of your account?
              </p>
            </div>

            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', background: 'var(--bg)', display: 'flex', gap: '12px' }}>
              <button className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setIsLogoutModalOpen(false)}>
                Cancel
              </button>
              <button className="btn btn-danger" style={{ flex: 1, justifyContent: 'center' }} onClick={confirmLogout}>
                Yes, Sign Out
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}