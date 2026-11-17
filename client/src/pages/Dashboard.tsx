import { useState, useEffect } from 'react';
import { getLoggedInUser } from '../api/mockData';
import { api } from '../api/api';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend
} from 'recharts';

interface ChartData {
  name: string;
  count?: number;
  value?: number;
}

interface EmployerStats {
  totalVacancies: number;
  totalApplications: number;
  shortlisted: number;
  interviews: number;
  chartData: ChartData[];
}

interface ApplicantStats {
  totalApplications: number;
  shortlisted: number;
  interviews: number;
  chartData: ChartData[];
}

export default function Dashboard() {
  const user = getLoggedInUser();
  const isEmployer = user.role === 'EMPLOYER';
  const navigate = useNavigate();
  
  const [employerStats, setEmployerStats] = useState<EmployerStats | null>(null);
  const [applicantStats, setApplicantStats] = useState<ApplicantStats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (isEmployer) {
          const data = await api.getEmployerStats();
          setEmployerStats(data);
        } else {
          const data = await api.getApplicantStats();
          setApplicantStats(data);
        }
      } catch {
        console.error("Failed to load stats");
      }
    };
    fetchStats();
  }, [isEmployer]);

  // Colors for the charts
  const BAR_COLORS = ['#0f766e', '#0ea5e9', '#f59e0b', '#8b5cf6', '#10b981', '#059669', '#ef4444'];
  const PIE_COLORS = ['#0ea5e9', '#f59e0b', '#0f766e', '#8b5cf6', '#ef4444'];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p style={{ color: 'var(--muted)' }}>Welcome back, {user.name}</p>
        </div>
        {isEmployer && (
          <button className="btn" onClick={() => navigate('/employer/create-vacancy')}>
            Create Vacancy
          </button>
        )}
      </div>

      {/* KPI Cards */}
      <div className="stat-grid">
        <div className="card">
          <div className="stat-label">{isEmployer ? 'Active Vacancies' : 'Applications Sent'}</div>
          <div className="stat-value">{isEmployer ? (employerStats?.totalVacancies ?? '...') : (applicantStats?.totalApplications ?? '...')}</div>
        </div>
        <div className="card">
          <div className="stat-label">{isEmployer ? 'Total Applicants' : 'Shortlisted'}</div>
          <div className="stat-value">{isEmployer ? (employerStats?.totalApplications ?? '...') : (applicantStats?.shortlisted ?? '...')}</div>
        </div>
        <div className="card">
          <div className="stat-label">{isEmployer ? 'Shortlisted' : 'Interviews'}</div>
          <div className="stat-value">{isEmployer ? (employerStats?.shortlisted ?? '...') : (applicantStats?.interviews ?? '...')}</div>
        </div>
        <div className="card">
          <div className="stat-label">{isEmployer ? 'Interviews Scheduled' : 'Notifications'}</div>
          <div className="stat-value">{isEmployer ? (employerStats?.interviews ?? '...') : '0'}</div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <h2>{isEmployer ? 'Application Funnel' : 'Application Status Breakdown'}</h2>
        <p style={{ color: 'var(--muted)', fontSize: '13px', marginBottom: '24px' }}>
          {isEmployer 
            ? "A visual breakdown of where your applicants are in the recruitment process."
            : "A visual breakdown of the current status of all your job applications."}
        </p>
        
        <div style={{ height: '300px', width: '100%' }}>
          {isEmployer && employerStats?.chartData ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={employerStats.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted)', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--muted)', fontSize: 12 }} allowDecimals={false} />
                <Tooltip cursor={{ fill: 'var(--bg)' }} contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={60}>
                  {employerStats.chartData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : applicantStats?.chartData && applicantStats.chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={applicantStats.chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {applicantStats.chartData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--muted)' }}>
              No application data to display yet.
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <h2>Recent Activity</h2>
        <p style={{ color: 'var(--muted)', marginTop: '12px' }}>
          {isEmployer 
            ? "Your dashboard is now synced with your live database. Use the sidebar to manage vacancies, screen applicants, and track interviews." 
            : "Keep your profile updated to ensure you get the best matches. Use the sidebar to find vacancies and track your applications."}
        </p>
      </div>
    </div>
  );
}