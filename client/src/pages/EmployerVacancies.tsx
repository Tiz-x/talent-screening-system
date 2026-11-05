import { mockVacancies } from '../api/mockData';
import { useNavigate } from 'react-router-dom';
import { Users, MapPin, Briefcase, Calendar } from 'lucide-react';

export default function EmployerVacancies() {
  const navigate = useNavigate();

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>My Vacancies</h1>
          <p style={{ color: 'var(--muted)' }}>Manage your job postings and view candidates</p>
        </div>
        <button className="btn" onClick={() => navigate('/employer/create-vacancy')}>
          + Create New Vacancy
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {mockVacancies.map((job) => (
          <div key={job.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ color: 'var(--primary)', marginBottom: '4px' }}>{job.title}</h2>
              <div style={{ display: 'flex', gap: '16px', color: 'var(--muted)', fontSize: '13px', marginTop: '8px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={14} /> {job.location}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Briefcase size={14} /> {job.type}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={14} /> Deadline: {job.deadline}
                </span>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <div className="card" style={{ padding: '12px 24px', textAlign: 'center', background: 'var(--bg)' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text)' }}>12</div>
                <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Applicants</div>
              </div>
              <button 
                className="btn" 
                onClick={() => navigate('/employer/ranking')}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Users size={16} /> View & Screen
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}