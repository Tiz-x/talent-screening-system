import { useState, useEffect } from 'react';
import { api } from '../api/api';
import { useToast } from '../components/Toast';
import { MapPin, Clock, Calendar, CheckCircle2, X, User, GraduationCap, FileText } from 'lucide-react';
import Spinner from '../components/Spinner';
import './Internships.css';

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
  const { showToast } = useToast();
  const [internships, setInternships] = useState<Internship[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [applied, setApplied] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [applying, setApplying] = useState(false);

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
        showToast("Failed to load internships", "error");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleOpenModal = (internship: Internship) => {
    if (!profile) {
      showToast("Please complete your profile and upload a CV before applying.", "error");
      return;
    }
    setSelectedInternship(internship);
    setIsModalOpen(true);
  };

  const handleFinalSubmit = async () => {
    if (!selectedInternship) return;
    setApplying(true);
    try {
      await api.applyForInternship(selectedInternship.id);
      setApplied([...applied, selectedInternship.id]);
      showToast('Application submitted successfully!', 'success');
      setTimeout(() => setIsModalOpen(false), 2000);
    } catch (err: unknown) {
      if (err instanceof Error) showToast(err.message, 'error');
      else showToast('Failed to apply', 'error');
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

      {isLoading ? (
        <Spinner />
      ) : internships.length === 0 ? (
        <div className="card int-empty">No internships available.</div>
      ) : (
        <div className="int-grid">
          {internships.map((internship) => (
            <div key={internship.id} className="card int-card">
              <div className="int-card-main">
                <h2 className="int-title">{internship.title}</h2>
                <p className="int-company">{internship.companyName}</p>
                <p className="int-description">{internship.description}</p>

                <div className="int-meta">
                  <span><MapPin size={16} /> {internship.location}</span>
                  <span><Clock size={16} /> {internship.duration}</span>
                  <span><Calendar size={16} /> Deadline: {new Date(internship.deadline).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="int-card-footer">
                {applied.includes(internship.id) ? (
                  <div className="int-applied-indicator">
                    <CheckCircle2 size={18} /> Application Submitted
                  </div>
                ) : (
                  <button
                    className="btn int-apply-btn"
                    onClick={() => handleOpenModal(internship)}
                  >
                    Apply for Internship
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* APPLICATION REVIEW MODAL */}
      {isModalOpen && selectedInternship && profile && (
        <div
          className="int-modal-overlay"
          onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false); }}
        >
          <div className="card int-modal">

            <div className="int-modal-header">
              <div style={{ minWidth: 0 }}>
                <h2>Review Application</h2>
                <p>
                  Applying for: <strong>{selectedInternship.title}</strong>
                </p>
              </div>
              <button
                type="button"
                className="int-modal-close"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="int-modal-body">
              <p className="int-modal-intro">
                The employer will see the following profile details. Please ensure everything is correct before submitting.
              </p>

              <div className="int-info-block">
                <div className="int-info-head">
                  <User size={18} /> Profile Information
                </div>
                <div className="int-info-body int-info-grid">
                  <div>
                    <p className="int-info-label">Qualification</p>
                    <p className="int-info-value">{profile.qualification}</p>
                  </div>
                  <div>
                    <p className="int-info-label">Years of Experience</p>
                    <p className="int-info-value">{profile.experienceYrs} Years</p>
                  </div>
                </div>
              </div>

              <div className="int-info-block">
                <div className="int-info-head">
                  <GraduationCap size={18} /> Skills Attached
                </div>
                <div className="int-info-body int-skills-wrap">
                  {profile.skills.map(s => (
                    <span key={s} className="badge badge-submitted">{s}</span>
                  ))}
                </div>
              </div>

              <div className="int-info-block">
                <div className="int-info-head">
                  <FileText size={18} /> CV / Resume
                </div>
                <div className="int-info-body int-cv-row">
                  <p className="int-cv-name">
                    {profile.cvUrl ? 'CV_Uploaded.pdf' : 'No CV Uploaded'}
                  </p>
                  <a
                    href={profile.cvUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="int-cv-link"
                  >
                    View CV
                  </a>
                </div>
              </div>
            </div>

            <div className="int-modal-footer">
              <button className="btn btn-outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
              <button className="btn" onClick={handleFinalSubmit} disabled={applying}>
                {applying ? 'Submitting...' : 'Confirm & Submit'}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}