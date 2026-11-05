import { getLoggedInUser } from '../api/mockData';

export default function Dashboard() {
  const user = getLoggedInUser();
  const isEmployer = user.role === 'EMPLOYER';

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p style={{ color: 'var(--muted)' }}>Welcome back, {user.name}</p>
        </div>
        <button className="btn">{isEmployer ? 'Create Vacancy' : 'Upload CV'}</button>
      </div>

      <div className="stat-grid">
        <div className="card">
          <div className="stat-label">{isEmployer ? 'Active Vacancies' : 'Applications Sent'}</div>
          <div className="stat-value">{isEmployer ? '2' : '3'}</div>
        </div>
        <div className="card">
          <div className="stat-label">{isEmployer ? 'Total Applicants' : 'Shortlisted'}</div>
          <div className="stat-value">{isEmployer ? '14' : '1'}</div>
        </div>
        <div className="card">
          <div className="stat-label">{isEmployer ? 'Interviews Scheduled' : 'Interviews'}</div>
          <div className="stat-value">1</div>
        </div>
        <div className="card">
          <div className="stat-label">Notifications</div>
          <div className="stat-value">2</div>
        </div>
      </div>

      <div className="card">
        <h2>Recent Activity</h2>
        <p style={{ color: 'var(--muted)', marginTop: '12px' }}>No recent activity to display yet.</p>
      </div>
    </div>
  );
}