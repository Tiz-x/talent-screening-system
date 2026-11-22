import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/api';
import { ArrowLeft, User, Mail, GraduationCap, FileText } from 'lucide-react';
import Spinner from '../components/Spinner';
import './InternshipApplicants.css';

interface Applicant {
  applicationId: string;
  status: string;
  applicantName: string;
  email: string;
  profile: {
    qualification: string;
    skills: string[];
    cvUrl: string | null;
  } | null;
}

export default function InternshipApplicants() {
  const { internshipId } = useParams();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchApplicants = async () => {
      if (!internshipId) return;
      try {
        const data = await api.getInternshipApplicants(internshipId);
        setApplicants(data);
      } catch {
        console.error("Failed to load applicants");
      } finally {
        setIsLoading(false);
      }
    };
    fetchApplicants();
  }, [internshipId]);

  return (
    <div>
      <div className="page-header">
        <div>
          <button
            onClick={() => navigate('/internships')}
            className="ia-back-btn"
          >
            <ArrowLeft size={16} /> Back to Internships
          </button>
          <h1>Internship Applicants</h1>
          <p style={{ color: 'var(--muted)' }}>
            Review students who applied for this internship (No automated scoring)
          </p>
        </div>
      </div>

      {isLoading ? (
        <Spinner />
      ) : applicants.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)' }}>
          No applications received for this internship yet.
        </div>
      ) : (
        <div className="card ia-table-card">
          <div className="ia-table-scroll">
            <table className="table">
              <thead>
                <tr>
                  <th>Applicant</th>
                  <th>Qualification</th>
                  <th>Skills</th>
                  <th>CV</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {applicants.map((app) => (
                  <tr key={app.applicationId}>
                    <td>
                      <div style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <User size={16} style={{ color: 'var(--muted)' }} /> {app.applicantName}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                        <Mail size={12} /> {app.email}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <GraduationCap size={14} style={{ color: 'var(--muted)' }} />
                        {app.profile?.qualification || 'N/A'}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', maxWidth: '200px' }}>
                        {app.profile?.skills.slice(0, 3).map(s => (
                          <span key={s} style={{ background: 'var(--bg)', border: '1px solid var(--border)', padding: '2px 6px', borderRadius: '4px', fontSize: '11px' }}>{s}</span>
                        ))}
                        {(app.profile?.skills.length || 0) > 3 && <span style={{ fontSize: '11px', color: 'var(--muted)' }}>+{app.profile!.skills.length - 3} more</span>}
                      </div>
                    </td>
                    <td>
                      {app.profile?.cvUrl ? (
                        <a href={app.profile.cvUrl} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary)', fontSize: '13px', fontWeight: '500' }}>
                          <FileText size={14} /> View CV
                        </a>
                      ) : (
                        <span style={{ color: 'var(--muted)', fontSize: '13px' }}>No CV</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge badge-submitted`}>
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}