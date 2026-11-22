import { useState, useEffect } from 'react';
import { api } from '../api/api';
import { useNavigate } from 'react-router-dom';
import { Users, MapPin, Briefcase, Calendar, CircleDollarSign } from 'lucide-react';
import Spinner from '../components/Spinner';
import './EmployerVacancies.css';

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
        const data = await api.getVacancies(true);
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
        <div className="card ev-empty">
          <Briefcase size={48} className="ev-empty-icon" />
          <h2 style={{ marginBottom: '8px' }}>No vacancies yet</h2>
          <p style={{ color: 'var(--muted)', marginBottom: '24px' }}>
            You haven't posted any jobs. Create one to start receiving applications.
          </p>
          <button className="btn" onClick={() => navigate('/employer/create-vacancy')}>
            Create your first vacancy
          </button>
        </div>
      ) : (
        <div className="ev-list">
          {vacancies.map((job) => (
            <div key={job.id} className="card ev-card">

              {/* LEFT SIDE: Job Details */}
              <div className="ev-card-main">
                <div className="ev-badges">
                  <span className="badge ev-badge-type">{job.type}</span>
                  <span className="badge ev-badge-mode">{job.workMode}</span>
                </div>

                <h2 className="ev-title">{job.title}</h2>
                <p className="ev-company">{job.companyName}</p>

                <div className="ev-meta">
                  <span>
                    <MapPin size={16} /> {job.location}
                  </span>
                  <span>
                    <CircleDollarSign size={16} /> {job.salary || 'Not disclosed'}
                  </span>
                  <span>
                    <Calendar size={16} /> Apply by {new Date(job.deadline).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* RIGHT SIDE: Stats & Actions */}
              <div className="ev-card-side">
                <div className="ev-stat">
                  <div className="ev-stat-value">{job._count?.applications || 0}</div>
                  <div className="ev-stat-label">Applicants</div>
                </div>

                <button
                  className="btn ev-btn"
                  onClick={() => navigate('/employer/ranking')}
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