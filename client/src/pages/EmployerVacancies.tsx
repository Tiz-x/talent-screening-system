import { useState, useEffect } from 'react';
import { api } from '../api/api';
import { useNavigate } from 'react-router-dom';
import { Users, MapPin, Briefcase, Calendar, CircleDollarSign} from 'lucide-react';
import Spinner from '../components/Spinner'; 

interface Vacancy {
  id: string;
  title: string;
  companyName: string;
  location: string;
  workMode: string;
  salary: string;
  type: string;
  deadline: string;
  _count?: {
    applications: number;
  };
}

export default function EmployerVacancies() {
  const navigate = useNavigate();
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await api.getVacancies();
        setVacancies(data);
      } catch {
        console.error("Failed to load vacancies");
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (isLoading) return <Spinner />;

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

      {vacancies.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Briefcase size={48} style={{ color: 'var(--border)', margin: '0 auto 16px auto' }} />
          <h2 style={{ marginBottom: '8px' }}>No vacancies yet</h2>
          <p style={{ color: 'var(--muted)', marginBottom: '24px' }}>You haven't posted any jobs. Create one to start receiving applications.</p>
          <button className="btn" onClick={() => navigate('/employer/create-vacancy')}>Create your first vacancy</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {vacancies.map((job) => (
            <div key={job.id} className="card" style={{ display: 'flex', padding: 0, overflow: 'hidden' }}>
              
              {/* LEFT SIDE: Job Details */}
              <div style={{ flex: 1, padding: '24px 32px' }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                  <span className="badge" style={{ background: 'var(--primary-soft)', color: 'var(--primary)' }}>{job.type}</span>
                  <span className="badge" style={{ background: '#e0f2fe', color: '#0284c7' }}>{job.workMode}</span>
                </div>
                
                <h2 style={{ color: 'var(--text)', marginBottom: '4px', fontSize: '22px', fontWeight: '700' }}>{job.title}</h2>
                <p style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '14px', marginBottom: '20px' }}>{job.companyName}</p>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', color: 'var(--muted)', fontSize: '13px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={16} /> {job.location}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CircleDollarSign size={16} /> {job.salary || 'Not disclosed'}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={16} /> Apply by {new Date(job.deadline).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              {/* RIGHT SIDE: Stats & Actions */}
              <div style={{ 
                background: 'var(--bg)', 
                padding: '24px 32px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '32px', 
                borderLeft: '1px solid var(--border)' 
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text)', lineHeight: '1' }}>
                    {job._count?.applications || 0}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px', fontWeight: '600' }}>
                    Applicants
                  </div>
                </div>
                
                <button 
                  className="btn" 
                  onClick={() => navigate('/employer/ranking')}
                  style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <Users size={18} /> View & Screen
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}