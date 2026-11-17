import { useState, useEffect } from 'react';
import { api } from '../api/api';
import { MapPin, Clock, Calendar, CheckCircle2, X, User, GraduationCap, FileText } from 'lucide-react';
import Spinner from '../components/Spinner';

interface Internship {
  id: string;
  title: string;
  companyName: string;
  description: string;
  location: string;
  duration: string;
  deadline: string;
}

interface Profile {
  qualification: string;
  skills: string[];
  experienceYrs: number;
  cvUrl: string | null;
}

export default function Internships() {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [applied, setApplied] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal States
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [internshipsData, profileData] = await Promise.all([
          api.getInternships(),
          api.getMyProfile().catch(() => null)
        ]);
        setInternships(internshipsData);
        if (profileData) setProfile(profileData);
      } catch { 
        console.error("Failed to load data"); 
      } finally { 
        setIsLoading(false); 
      }
    };
    fetchData();
  }, []);

  const handleOpenModal = (internship: Internship) => {
    setMessage('');
    if (!profile) {
      alert("Please complete your profile and upload a CV before applying. Go to 'My Profile'.");
      return;
    }
    setSelectedInternship(internship);
    setIsModalOpen(true);
  };

  const handleFinalSubmit = async () => {
    if (!selectedInternship) return;
    setApplying(true);
    setMessage('');
    try {
      await api.applyForInternship(selectedInternship.id);
      setApplied([...applied, selectedInternship.id]);
      setMessage('Application submitted successfully!');
      setTimeout(() => setIsModalOpen(false), 2000);
    } catch (err: unknown) {
      if (err instanceof Error) setMessage(err.message);
      else setMessage('Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Internship Portal</h1>
          <p style={{ color: 'var(--muted)' }}>Find and apply for SIWES or graduate internships</p>
        </div>
      </div>

      {isLoading ? <Spinner /> : internships.length === 0 ? <p>No internships available.</p> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {internships.map((internship) => (
            <div key={internship.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ flex: 1 }}>
                <h2 style={{ color: 'var(--primary)', fontSize: '18px', marginBottom: '4px' }}>{internship.title}</h2>
                <p style={{ fontWeight: '500', fontSize: '14px', marginBottom: '16px', color: 'var(--text)' }}>
                  {internship.companyName}
                </p>
                
                <p style={{ color: 'var(--muted)', fontSize: '13px', marginBottom: '16px', lineHeight: '1.6' }}>
                  {internship.description}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'var(--muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={16} /> {internship.location}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Clock size={16} /> {internship.duration}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={16} /> Deadline: {new Date(internship.deadline).toLocaleDateString()}</span>
                </div>
              </div>

              <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                {applied.includes(internship.id) ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--success)', fontWeight: '600', padding: '8px' }}>
                    <CheckCircle2 size={18} /> Application Submitted
                  </div>
                ) : (
                  <button className="btn" style={{ width: '100%', justifyContent: 'center' }} onClick={() => handleOpenModal(internship)}>
                    Apply for Internship
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- APPLICATION REVIEW MODAL --- */}
      {isModalOpen && selectedInternship && profile && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div className="card" style={{ width: '100%', maxWidth: '600px', padding: 0, overflow: 'hidden', animation: 'fadeIn 0.2s ease-out' }}>
            
            <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg)' }}>
              <div>
                <h2 style={{ fontSize: '20px', margin: 0 }}>Review Application</h2>
                <p style={{ color: 'var(--muted)', fontSize: '13px', margin: 0 }}>Applying for: <strong>{selectedInternship.title}</strong></p>
              </div>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}><X size={24} /></button>
            </div>

            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {message && (
                <div style={{ padding: '12px', background: message.includes('success') ? 'var(--success-soft)' : 'var(--danger-soft)', color: message.includes('success') ? 'var(--success)' : 'var(--danger)', borderRadius: '6px', fontWeight: '500' }}>
                  {message}
                </div>
              )}

              <p style={{ fontSize: '14px', color: 'var(--text)' }}>
                The employer will see the following profile details. Please ensure everything is correct before submitting.
              </p>

              <div style={{ border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
                <div style={{ background: 'var(--bg)', padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}>
                  <User size={18} /> Profile Information
                </div>
                <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <p style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '4px' }}>Qualification</p>
                    <p style={{ fontWeight: '500' }}>{profile.qualification}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '4px' }}>Years of Experience</p>
                    <p style={{ fontWeight: '500' }}>{profile.experienceYrs} Years</p>
                  </div>
                </div>
              </div>

              <div style={{ border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
                <div style={{ background: 'var(--bg)', padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}>
                  <GraduationCap size={18} /> Skills Attached
                </div>
                <div style={{ padding: '16px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {profile.skills.map(s => <span key={s} className="badge badge-submitted">{s}</span>)}
                </div>
              </div>

              <div style={{ border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
                <div style={{ background: 'var(--bg)', padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}>
                  <FileText size={18} /> CV / Resume
                </div>
                <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ fontWeight: '500', fontSize: '14px' }}>{profile.cvUrl ? 'CV_Uploaded.pdf' : 'No CV Uploaded'}</p>
                  <a href={profile.cvUrl || '#'} target="_blank" rel="noreferrer" style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: '500', textDecoration: 'none' }}>
                    View CV
                  </a>
                </div>
              </div>
            </div>

            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', background: 'var(--bg)', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button className="btn" onClick={handleFinalSubmit} disabled={applying || message.includes('success')}>
                {applying ? 'Submitting...' : 'Confirm & Submit'}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}