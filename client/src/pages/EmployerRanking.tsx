import { useState, useEffect } from 'react';
import { api } from '../api/api';
import { Award, AlertTriangle, FileText, CheckCircle, XCircle, Calendar, X } from 'lucide-react';

interface Vacancy {
  id: string;
  title: string;
}

interface ApplicantProfile {
  qualification: string;
  skills: string[];
  experienceYrs: number;
  cvUrl: string | null;
}

interface ScreeningResult {
  applicationId: string;
  applicantName: string;
  profile: ApplicantProfile | null;
  knockedOut: boolean;
  reason?: string;
  totalScore: number;
  breakdown: {
    qualScore: number;
    skillsScore: number;
    expScore: number;
    certsScore: number;
  } | null;
}

export default function EmployerRanking() {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [selectedVacancy, setSelectedVacancy] = useState('');
  const [results, setResults] = useState<ScreeningResult[]>([]);
  const [selectedApplicant, setSelectedApplicant] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Interview Modal States
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [interviewData, setInterviewData] = useState({ date: '', time: '', mode: 'Virtual', link: '', notes: '' });
  const [isScheduling, setIsScheduling] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await api.getVacancies();
        setVacancies(data);
        if (data.length > 0) setSelectedVacancy(data[0].id);
      } catch { 
        console.error("Failed to load vacancies"); 
      }
    };
    fetchJobs();
  }, []);

  const handleRunScreening = async () => {
    if (!selectedVacancy) return;
    setIsLoading(true);
    setResults([]); 
    
    try {
      const data = await api.runScreening(selectedVacancy);
      setResults(data.results);
      setSelectedApplicant(data.results[0]?.applicationId || null);
    } catch {
      alert("Failed to run screening");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (status: string) => {
    if (!currentApp) return;
    try {
      await api.updateApplicationStatus(currentApp.applicationId, status);
      alert(`Applicant status updated to ${status}`);
    } catch {
      alert('Failed to update status');
    }
  };

  const handleScheduleInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentApp) return;
    setIsScheduling(true);
    try {
      await api.scheduleInterview({
        applicationId: currentApp.applicationId,
        ...interviewData
      });
      alert('Interview scheduled successfully!');
      setIsInterviewModalOpen(false);
      handleRunScreening(); // Reload results
    } catch {
      alert('Failed to schedule interview');
    } finally {
      setIsScheduling(false);
    }
  };

  const currentApp = results.find(a => a.applicationId === selectedApplicant);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Screening & Ranking</h1>
          <p style={{ color: 'var(--muted)' }}>Run the rule-based screening engine to rank candidates</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <select 
            className="select" 
            style={{ width: '250px', marginBottom: 0 }} 
            value={selectedVacancy} 
            onChange={(e) => setSelectedVacancy(e.target.value)}
          >
            {vacancies.map(v => <option key={v.id} value={v.id}>{v.title}</option>)}
          </select>
          <button 
            className="btn" 
            onClick={handleRunScreening} 
            disabled={isLoading || !selectedVacancy}
            style={{ whiteSpace: 'nowrap', padding: '10px 24px' }}
          >
            {isLoading ? 'Screening...' : 'Run Screening'}
          </button>
        </div>
      </div>

      {/* EMPTY STATE */}
      {results.length === 0 && !isLoading && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 24px', textAlign: 'center' }}>
          <div style={{ background: 'var(--primary-soft)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
            <Award size={40} style={{ color: 'var(--primary)' }} />
          </div>
          <h2 style={{ marginBottom: '12px', fontSize: '24px' }}>Ready to Screen Applicants</h2>
          <p style={{ color: 'var(--muted)', maxWidth: '400px', marginBottom: '32px', lineHeight: '1.6' }}>
            Our rule-based engine will automatically compare all applicants against the criteria and weights you set for this vacancy.
          </p>
          <button 
            className="btn" 
            onClick={handleRunScreening} 
            disabled={isLoading || !selectedVacancy}
            style={{ padding: '12px 32px', fontSize: '16px' }}
          >
            Start Screening Now
          </button>
        </div>
      )}

      {/* RESULTS VIEW */}
      {results.length > 0 && (
        <div className="split" style={{ gridTemplateColumns: '1fr 450px' }}>
          {/* LEFT: Ranked Table */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Applicant</th>
                  <th>Score</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {results.map((app, index) => (
                  <tr 
                    key={app.applicationId} 
                    onClick={() => setSelectedApplicant(app.applicationId)}
                    className={selectedApplicant === app.applicationId ? 'selected' : ''}
                    style={{ cursor: 'pointer' }}
                  >
                    <td style={{ fontWeight: 'bold' }}>
                      {app.knockedOut ? '-' : (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: index === 0 ? 'var(--primary)' : 'var(--text)' }}>
                          {index === 0 && <Award size={16} />} #{index + 1}
                        </span>
                      )}
                    </td>
                    <td>
                      <div style={{ fontWeight: '600' }}>{app.applicantName}</div>
                    </td>
                    <td>
                      {app.knockedOut ? (
                        <span className="badge badge-rejected">Knocked Out</span>
                      ) : (
                        <span className={app.totalScore > 80 ? 'score-high' : app.totalScore > 50 ? 'score-mid' : 'score-low'}>
                          {app.totalScore}%
                        </span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${app.knockedOut ? 'badge-rejected' : 'badge-shortlisted'}`}>
                        {app.knockedOut ? 'Rejected' : 'Eligible'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* RIGHT: Applicant Details & Score */}
          <div className="card">
            {currentApp && (
              <>
                <h2 style={{ marginBottom: '4px' }}>{currentApp.applicantName}</h2>
                <p style={{ color: 'var(--muted)', fontSize: '13px', marginBottom: '24px' }}>
                  Application ID: {currentApp.applicationId}
                </p>

                {currentApp.knockedOut ? (
                  <div style={{ background: 'var(--danger-soft)', color: 'var(--danger)', padding: '16px', borderRadius: '8px', display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '24px' }}>
                    <AlertTriangle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong>Knocked Out</strong>
                      <p style={{ marginTop: '4px', fontSize: '13px' }}>{currentApp.reason}</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Score Breakdown */}
                    <h3 style={{ marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
                      Score Breakdown
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '13px' }}>
                          <span>Qualification</span><strong>{currentApp.breakdown?.qualScore} / 100</strong>
                        </div>
                        <div className="score-bar"><span style={{ width: `${currentApp.breakdown?.qualScore}%` }}></span></div>
                      </div>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '13px' }}>
                          <span>Skills Match</span><strong>{currentApp.breakdown?.skillsScore} / 100</strong>
                        </div>
                        <div className="score-bar"><span style={{ width: `${currentApp.breakdown?.skillsScore}%` }}></span></div>
                      </div>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '13px' }}>
                          <span>Experience</span><strong>{currentApp.breakdown?.expScore} / 100</strong>
                        </div>
                        <div className="score-bar"><span style={{ width: `${currentApp.breakdown?.expScore}%` }}></span></div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
                        <h3>Total Score</h3>
                        <h2 style={{ color: 'var(--primary)' }}>{currentApp.totalScore}%</h2>
                      </div>
                    </div>

                    {/* Candidate Profile */}
                    {currentApp.profile && (
                      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
                        <h3 style={{ marginBottom: '16px' }}>Candidate Profile</h3>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                          <div>
                            <p style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Qualification</p>
                            <p style={{ fontWeight: '500' }}>{currentApp.profile.qualification}</p>
                          </div>
                          <div>
                            <p style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Experience</p>
                            <p style={{ fontWeight: '500' }}>{currentApp.profile.experienceYrs} Years</p>
                          </div>
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                          <p style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Skills</p>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {currentApp.profile.skills.map(s => (
                              <span key={s} style={{ background: 'var(--bg)', border: '1px solid var(--border)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>{s}</span>
                            ))}
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontSize: '14px', fontWeight: '500', cursor: 'pointer', marginBottom: '24px' }}>
                          <FileText size={16} /> View CV / Resume
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                          <button className="btn" style={{ justifyContent: 'center' }} onClick={() => setIsInterviewModalOpen(true)}>
                            <Calendar size={16} /> Schedule Interview
                          </button>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button className="btn" style={{ flex: 1, justifyContent: 'center' }} onClick={() => handleStatusUpdate('SHORTLISTED')}>
                              <CheckCircle size={16} /> Shortlist
                            </button>
                            <button className="btn btn-outline" style={{ flex: 1, justifyContent: 'center', color: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={() => handleStatusUpdate('REJECTED')}>
                              <XCircle size={16} /> Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* INTERVIEW SCHEDULING MODAL */}
      {isInterviewModalOpen && currentApp && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div className="card" style={{ width: '100%', maxWidth: '500px', padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg)' }}>
              <h2 style={{ margin: 0 }}>Schedule Interview</h2>
              <button onClick={() => setIsInterviewModalOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}><X size={24} /></button>
            </div>
            <form onSubmit={handleScheduleInterview} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="field">
                <label>Date</label>
                <input type="date" className="input" required value={interviewData.date} onChange={e => setInterviewData({...interviewData, date: e.target.value})} />
              </div>
              <div className="field">
                <label>Time</label>
                <input type="time" className="input" required value={interviewData.time} onChange={e => setInterviewData({...interviewData, time: e.target.value})} />
              </div>
              <div className="field">
                <label>Mode</label>
                <select className="select" value={interviewData.mode} onChange={e => setInterviewData({...interviewData, mode: e.target.value})}>
                  <option value="Virtual">Virtual (Zoom/Meet)</option>
                  <option value="In-person">In-person</option>
                </select>
              </div>
              <div className="field">
                <label>{interviewData.mode === 'Virtual' ? 'Meeting Link' : 'Physical Address'}</label>
                <input type="text" className="input" placeholder={interviewData.mode === 'Virtual' ? 'https://zoom.us/...' : 'Office Address'} value={interviewData.link} onChange={e => setInterviewData({...interviewData, link: e.target.value})} required />
              </div>
              <div className="field">
                <label>Notes (Optional)</label>
                <textarea className="textarea" rows={2} placeholder="e.g. Bring your portfolio" value={interviewData.notes} onChange={e => setInterviewData({...interviewData, notes: e.target.value})}></textarea>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsInterviewModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn" disabled={isScheduling}>{isScheduling ? 'Scheduling...' : 'Confirm Interview'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}