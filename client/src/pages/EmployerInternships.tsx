import { useState, useEffect } from 'react';
import { api } from '../api/api';
import { Plus, User, X, Save, Calendar, MapPin, Clock, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))', gap: '20px' }}>
          {internships.map((internship) => (
            <div key={internship.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <h2 style={{ color: 'var(--text)', fontSize: '18px', marginBottom: '4px' }}>{internship.title}</h2>
                    <p style={{ fontWeight: '500', fontSize: '14px', color: 'var(--text)', marginBottom: '6px' }}>
                      {internship.companyName}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--muted)' }}>
                      <MapPin size={14} /> {internship.location}
                    </div>
                  </div>
                  <span className="badge badge-selected">
                    <ShieldCheck size={12} style={{ display: 'inline', marginRight: '4px' }}/> Active
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--muted)', padding: '12px', background: 'var(--bg)', borderRadius: '6px', marginBottom: '16px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={14} /> {internship.duration}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} /> {new Date(internship.deadline).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                <button 
                  className="btn btn-outline" 
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
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
          onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false); }} // Close on click outside
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', overflowY: 'auto' }}
        >
          <div className="card" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden', animation: 'fadeIn 0.2s ease-out' }}>
            
            {/* Modal Header */}
            <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg)', flexShrink: 0 }}>
              <div>
                <h2 style={{ fontSize: '20px', margin: 0 }}>Post New Internship</h2>
                <p style={{ color: 'var(--muted)', fontSize: '13px', margin: 0 }}>Fill in the details for the internship listing.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text)' }}>
                <X size={20} />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <form onSubmit={handlePostInternship} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
                {error && (
                  <div style={{ padding: '12px', background: 'var(--danger-soft)', color: 'var(--danger)', borderRadius: '6px', fontSize: '13px' }}>
                    {error}
                  </div>
                )}

                <div className="field">
                  <label>Internship Title <span style={{ color: 'var(--danger)' }}>*</span></label>
                  <input type="text" className="input" placeholder="e.g. Software Engineering Intern" value={title} onChange={e => setTitle(e.target.value)} required />
                </div>

                <div className="field">
                  <label>Company Name <span style={{ color: 'var(--danger)' }}>*</span></label>
                  <input type="text" className="input" placeholder="e.g. TechNova Solutions" value={companyName} onChange={e => setCompanyName(e.target.value)} required />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="field">
                    <label>Location <span style={{ color: 'var(--danger)' }}>*</span></label>
                    <input type="text" className="input" placeholder="e.g. Remote" value={location} onChange={e => setLocation(e.target.value)} required />
                  </div>
                  <div className="field">
                    <label>Duration <span style={{ color: 'var(--danger)' }}>*</span></label>
                    <input type="text" className="input" placeholder="e.g. 6 Months" value={duration} onChange={e => setDuration(e.target.value)} required />
                  </div>
                </div>

                <div className="field">
                  <label>Application Deadline <span style={{ color: 'var(--danger)' }}>*</span></label>
                  <input type="date" className="input" value={deadline} onChange={e => setDeadline(e.target.value)} required />
                </div>

                <div className="field">
                  <label>Description <span style={{ color: 'var(--danger)' }}>*</span></label>
                  <textarea className="textarea" rows={4} placeholder="Describe the internship role..." value={description} onChange={e => setDescription(e.target.value)} required></textarea>
                </div>
              </div>

              {/* Modal Footer */}
              <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', background: 'var(--bg)', display: 'flex', justifyContent: 'flex-end', gap: '12px', flexShrink: 0 }}>
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