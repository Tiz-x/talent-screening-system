import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Briefcase, FileText, User, LogOut, Users, Plus,
  GraduationCap, AlertTriangle, Menu, X,
} from 'lucide-react';
import { getLoggedInUser } from '../api/mockData';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getLoggedInUser();
  const isEmployer = user.role === 'EMPLOYER';

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const isLocked = isLogoutModalOpen || isSidebarOpen;
    document.body.style.overflow = isLocked ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isLogoutModalOpen, isSidebarOpen]);

  const handleLogoutClick = () => setIsLogoutModalOpen(true);

  const confirmLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    setIsLogoutModalOpen(false);
    navigate('/login');
  };

    return (
    /* 1. Force the app wrapper to be a block container, not flex */
    <div className="app" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100vw', overflowX: 'hidden' }}>
      
      {/* MOBILE TOP BAR */}
      <header className="mobile-topbar">
        <button
          className="icon-btn"
          aria-label="Toggle menu"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <span className="mobile-brand">TalentScreen</span>
        <div style={{ width: '40px' }} />
      </header>

      {/* MOBILE BACKDROP */}
      <div
        className={`sidebar-backdrop${isSidebarOpen ? ' visible' : ''}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* 2. Create a wrapper for the Sidebar and Main content */}
      <div style={{ display: 'flex', flex: 1, width: '100%', minWidth: 0 }}>
        
        {/* SIDEBAR */}
        <aside className={`sidebar${isSidebarOpen ? ' mobile-open' : ''}`}>
          <div className="brand">TalentScreen</div>
          <nav className="sidebar-nav">
            <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>
              <LayoutDashboard size={18} /><span>Dashboard</span>
            </NavLink>
            {isEmployer ? (
              <>
                <NavLink to="/vacancies" className={({ isActive }) => (isActive ? 'active' : '')}>
                  <Briefcase size={18} /><span>My Vacancies</span>
                </NavLink>
                <NavLink to="/employer/create-vacancy" className={({ isActive }) => (isActive ? 'active' : '')}>
                  <Plus size={18} /><span>Create Vacancy</span>
                </NavLink>
                <NavLink to="/employer/ranking" className={({ isActive }) => (isActive ? 'active' : '')}>
                  <Users size={18} /><span>Screening &amp; Ranking</span>
                </NavLink>
                <NavLink to="/internships" className={({ isActive }) => (isActive ? 'active' : '')}>
                  <GraduationCap size={18} /><span>Manage Internships</span>
                </NavLink>
              </>
            ) : (
              <>
                <NavLink to="/vacancies" className={({ isActive }) => (isActive ? 'active' : '')}>
                  <Briefcase size={18} /><span>Find Vacancies</span>
                </NavLink>
                <NavLink to="/applications" className={({ isActive }) => (isActive ? 'active' : '')}>
                  <FileText size={18} /><span>My Applications</span>
                </NavLink>
                <NavLink to="/internships" className={({ isActive }) => (isActive ? 'active' : '')}>
                  <GraduationCap size={18} /><span>Internship Portal</span>
                </NavLink>
                <NavLink to="/profile" className={({ isActive }) => (isActive ? 'active' : '')}>
                  <User size={18} /><span>My Profile</span>
                </NavLink>
              </>
            )}
          </nav>
          <div className="sidebar-footer">
            <button className="sidebar-logout" onClick={handleLogoutClick}>
              <LogOut size={18} /><span>Sign out</span>
            </button>
          </div>
        </aside>

        {/* 3. MAIN CONTENT: Forced inline styles to guarantee it takes full width */}
        <main 
          className="main" 
          style={{ flex: 1, width: '100%', minWidth: 0, padding: '24px 16px' }}
        >
          <Outlet />
        </main>
        
      </div>

 
      {/* LOGOUT MODAL */}
      {isLogoutModalOpen && (
        <div
          className="modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsLogoutModalOpen(false);
          }}
        >
          <div className="card modal-card" role="dialog" aria-modal="true">
            <div className="modal-body">
              <div className="modal-icon-wrap">
                <AlertTriangle size={32} />
              </div>
              <h2 className="modal-title">Sign Out</h2>
              <p className="modal-text">Are you sure you want to sign out of your account?</p>
            </div>
            <div className="modal-actions">
              <button className="btn btn-outline modal-btn" onClick={() => setIsLogoutModalOpen(false)}>
                Cancel
              </button>
              <button className="btn btn-danger modal-btn" onClick={confirmLogout}>
                Yes, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}