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

  // Close the mobile drawer whenever the route changes
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  // Lock body scroll when modal or mobile drawer is open
  useEffect(() => {
    const isLocked = isLogoutModalOpen || isSidebarOpen;
    document.body.style.overflow = isLocked ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isLogoutModalOpen, isSidebarOpen]);

  // Close modal on Escape key
  useEffect(() => {
    if (!isLogoutModalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsLogoutModalOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isLogoutModalOpen]);

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
    <div className="app">
            {/* ADD THIS STYLE BLOCK */}
      <style>{`
        @media (max-width: 1024px) {
          /* Top Bar */
          .mobile-topbar { display: flex !important; position: sticky; top: 0; z-index: 40; background: #fff; padding: 12px 16px; align-items: center; justify-content: space-between; border-bottom: 1px solid #e2e8f0; }
          
          /* Sidebar Container */
          .sidebar { position: fixed !important; top: 0 !important; left: 0 !important; bottom: auto !important; height: 100vh !important; width: 260px !important; transform: translateX(-100%) !important; z-index: 50 !important; background: #0f172a !important; padding: 24px 16px !important; display: flex !important; flex-direction: column !important; }
          .sidebar.mobile-open { transform: translateX(0) !important; }
          
          /* Inside the Sidebar - Force Vertical Stacking */
          .sidebar .brand { display: block !important; color: #fff !important; font-size: 20px !important; font-weight: 800 !important; margin-bottom: 32px !important; }
          .sidebar-nav { display: flex !important; flex-direction: column !important; gap: 4px !important; flex: 1 !important; width: 100% !important; margin: 0 !important; justify-content: flex-start !important; }
          
          /* Links */
          .sidebar a, .sidebar-logout { display: flex !important; flex-direction: row !important; align-items: center !important; justify-content: flex-start !important; gap: 12px !important; padding: 12px 14px !important; font-size: 14px !important; width: 100% !important; background: transparent !important; color: var(--sidebar-text) !important; border-radius: 8px !important; }
          .sidebar a.active { background: var(--primary) !important; color: #fff !important; }
          
          /* Backdrop */
          .sidebar-backdrop.visible { display: block !important; opacity: 1 !important; pointer-events: auto !important; }
        }
      `}</style>
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
        <div style={{ width: '40px' }} /> {/* Spacer to center the brand */}
      </header>

      {/* MOBILE BACKDROP */}
      <div
        className={`sidebar-backdrop${isSidebarOpen ? ' visible' : ''}`}
        onClick={() => setIsSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* SIDEBAR */}
      <aside className={`sidebar${isSidebarOpen ? ' mobile-open' : ''}`}>
        <div className="brand">TalentScreen</div>

        <nav className="sidebar-nav">
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>

          {isEmployer ? (
            <>
              <NavLink to="/vacancies" className={({ isActive }) => (isActive ? 'active' : '')}>
                <Briefcase size={18} />
                <span>My Vacancies</span>
              </NavLink>
              <NavLink to="/employer/create-vacancy" className={({ isActive }) => (isActive ? 'active' : '')}>
                <Plus size={18} />
                <span>Create Vacancy</span>
              </NavLink>
              <NavLink to="/employer/ranking" className={({ isActive }) => (isActive ? 'active' : '')}>
                <Users size={18} />
                <span>Screening &amp; Ranking</span>
              </NavLink>
              <NavLink to="/internships" className={({ isActive }) => (isActive ? 'active' : '')}>
                <GraduationCap size={18} />
                <span>Manage Internships</span>
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/vacancies" className={({ isActive }) => (isActive ? 'active' : '')}>
                <Briefcase size={18} />
                <span>Find Vacancies</span>
              </NavLink>
              <NavLink to="/applications" className={({ isActive }) => (isActive ? 'active' : '')}>
                <FileText size={18} />
                <span>My Applications</span>
              </NavLink>
              <NavLink to="/internships" className={({ isActive }) => (isActive ? 'active' : '')}>
                <GraduationCap size={18} />
                <span>Internship Portal</span>
              </NavLink>
              <NavLink to="/profile" className={({ isActive }) => (isActive ? 'active' : '')}>
                <User size={18} />
                <span>My Profile</span>
              </NavLink>
            </>
          )}
        </nav>

              <div className="sidebar-footer">
        <button className="sidebar-logout" onClick={handleLogoutClick}>
          <LogOut size={18} />
          <span>Sign out</span>
        </button>
      </div>
      </aside>

<main 
  className="main" 
  style={{ 
    width: '100%', 
    maxWidth: '100vw', 
    overflowX: 'hidden', 
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column'
  }}
>
  <div style={{ width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>
    <Outlet />
  </div>
</main>

      {/* LOGOUT CONFIRMATION MODAL */}
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