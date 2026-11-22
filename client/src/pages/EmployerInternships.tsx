import { useState, useEffect } from 'react';
import { api } from '../api/api';
import { Plus, User, X, Save, Calendar, MapPin, Clock, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './EmployerInternships.css';

interface Internship {
  id: string;
  title: string;
  companyName: string;
  location: string;
  duration: string;
  deadline: string;
  status?: string;
}

export default function EmployerInternships() {
  const navigate = useNavigate();
  const [internships, setInternships] = useState<Internship[]>([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [title, setTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [duration, setDuration] = useState('');
  const [deadline, setDeadline] = useState('');

  const fetchInternships = async () => {
    try {
      const data = await api.getInternships();
      setInternships(data);
    } catch { 
      console.error("Failed to load"); 
    }
  };

  useEffect(() => {
    fetchInternships();
  }, []);

  const handlePostInternship = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await api.createInternship({
        title, companyName, description, location, duration, deadline
      });
      setIsModalOpen(false);
      setTitle(''); setCompanyName(''); setDescription(''); setLocation(''); setDuration(''); setDeadline('');
      fetchInternships();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Failed to post internship');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Manage Internships</h1>
          <p style={{ color: 'var(--muted)' }}>Post and review internship applications (No automated ranking)</p>
        </div>
        <button className="btn" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} /> Post Internship
        </button>
      </div>

      {internships.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)' }}>
          No internships posted yet. Click "Post Internship" to create one.
        </div>
      ) : (
        <div className="ei-grid">
          {internships.map((internship) => (
            <div key={internship.id} className="card ei-card">
              <div>
                <div className="ei-card-head">
                  <div className="ei-card-head-main">
                    <h2>{internship.title}</h2>
                    <p className="ei-company">{internship.companyName}</p>
                    <div className="ei-location">
                      <MapPin size={14} /> {internship.location}
                    </div>
                  </div>
                  <span className="badge badge-selected ei-active-badge">
                    <ShieldCheck size={12} /> Active
                  </span>
                </div>

                <div className="ei-meta">
                  <span>
                    <Clock size={14} /> {internship.duration}
                  </span>
                  <span>
                    <Calendar size={14} /> {new Date(internship.deadline).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="ei-card-footer">
                <button 
                  className="btn btn-outline" 
                  onClick={() => navigate(`/internships/${internship.id}/applicants`)}
                >
                  <User size={16} /> Review Applicants
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* POST INTERNSHIP MODAL */}
      {isModalOpen && (
        <div 
          className="ei-modal-overlay"
          onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false); }}
        >
          <div className="card ei-modal">
            
            {/* Modal Header */}
            <div className="ei-modal-header">
              <div>
                <h2>Post New Internship</h2>
                <p>Fill in the details for the internship listing.</p>
              </div>
              <button 
                type="button"
                className="ei-modal-close" 
                onClick={() => setIsModalOpen(false)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <form onSubmit={handlePostInternship} className="ei-modal-form">
              <div className="ei-modal-body">
                {error && (
                  <div className="ei-modal-error">
                    {error}
                  </div>
                )}

                <div className="field">
                  <label>Internship Title <span className="ei-required">*</span></label>
                  <input type="text" className="input" placeholder="e.g. Software Engineering Intern" value={title} onChange={e => setTitle(e.target.value)} required />
                </div>

                <div className="field">
                  <label>Company Name <span className="ei-required">*</span></label>
                  <input type="text" className="input" placeholder="e.g. TechNova Solutions" value={companyName} onChange={e => setCompanyName(e.target.value)} required />
                </div>

                <div className="ei-grid-2">
                  <div className="field">
                    <label>Location <span className="ei-required">*</span></label>
                    <input type="text" className="input" placeholder="e.g. Remote" value={location} onChange={e => setLocation(e.target.value)} required />
                  </div>
                  <div className="field">
                    <label>Duration <span className="ei-required">*</span></label>
                    <input type="text" className="input" placeholder="e.g. 6 Months" value={duration} onChange={e => setDuration(e.target.value)} required />
                  </div>
                </div>

                <div className="field">
                  <label>Application Deadline <span className="ei-required">*</span></label>
                  <input type="date" className="input" value={deadline} onChange={e => setDeadline(e.target.value)} required />
                </div>

                <div className="field">
                  <label>Description <span className="ei-required">*</span></label>
                  <textarea className="textarea" rows={4} placeholder="Describe the internship role..." value={description} onChange={e => setDescription(e.target.value)} required></textarea>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="ei-modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn" disabled={isSubmitting}>
                  <Save size={16} /> {isSubmitting ? 'Posting...' : 'Post Internship'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}