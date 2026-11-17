import { useState, useEffect } from 'react';
import { api } from '../api/api';
import { Calendar, CheckCircle2, Briefcase, GraduationCap } from 'lucide-react';
import Spinner from '../components/Spinner';

interface JobApplication {
  id: string;
  status: string;
  createdAt: string;
  vacancy: {
    title: string;
    location: string;
  };
}

interface InternshipApplication {
  id: string;
  status: string;
  createdAt: string;
  internship: {
    title: string;
    companyName: string;
    location: string;
  };
}

export default function Applications() {
  const [activeTab, setActiveTab] = useState<'jobs' | 'internships'>('jobs');
  
  const [jobApps, setJobApps] = useState<JobApplication[]>([]);
  const [internshipApps, setInternshipApps] = useState<InternshipApplication[]>([]);
  
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // Add this to force a loading state
      try {
        const [jobsData, internData] = await Promise.all([
          api.getMyApplications(),
          api.getMyInternshipApplications()
        ]);
        setJobApps(jobsData);
        setInternshipApps(internData);
        
        // Auto-select the first job application if it exists
        if (jobsData.length > 0) {
          setSelectedApp(jobsData[0].id);
        }
      } catch (err) {
        console.error("Failed to load applications", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const currentList = activeTab === 'jobs' ? jobApps : internshipApps;
  const currentApp: any = currentList.find((a: any) => a.id === selectedApp);

  const handleTabChange = (tab: 'jobs' | 'internships') => {
    setActiveTab(tab);
    const newList = tab === 'jobs' ? jobApps : internshipApps;
    if (newList.length > 0) setSelectedApp(newList[0].id);
    else setSelectedApp(null);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>My Applications</h1>
          <p style={{ color: 'var(--muted)' }}>Track the status of your applications</p>
        </div>
      </div>

      {/* TABS */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
        <button 
          onClick={() => handleTabChange('jobs')}
          style={{ 
            background: 'none', border: 'none', fontSize: '16px', fontWeight: '600', cursor: 'pointer',
            color: activeTab === 'jobs' ? 'var(--primary)' : 'var(--muted)',
            borderBottom: activeTab === 'jobs' ? '2px solid var(--primary)' : '2px solid transparent',
            paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px'
          }}
        >
          <Briefcase size={18} /> Job Applications
        </button>
        <button 
          onClick={() => handleTabChange('internships')}
          style={{ 
            background: 'none', border: 'none', fontSize: '16px', fontWeight: '600', cursor: 'pointer',
            color: activeTab === 'internships' ? 'var(--primary)' : 'var(--muted)',
            borderBottom: activeTab === 'internships' ? '2px solid var(--primary)' : '2px solid transparent',
            paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px'
          }}
        >
          <GraduationCap size={18} /> Internship Applications
        </button>
      </div>

      {isLoading ? <Spinner /> : currentList.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: 'var(--muted)' }}>You haven't applied for any {activeTab} yet.</p>
        </div>
      ) : (
        <div className="split">
          {/* LEFT: Application List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {currentList.map((app: any) => {
              const title = activeTab === 'jobs' ? app.vacancy.title : app.internship.title;
              const subtitle = activeTab === 'jobs' ? app.vacancy.location : `${app.internship.companyName} • ${app.internship.location}`;
              
              return (
                <div 
                  key={app.id} 
                  className={`card ${selectedApp === app.id ? 'selected' : ''}`}
                  onClick={() => setSelectedApp(app.id)}
                  style={{ cursor: 'pointer', padding: '16px' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ color: 'var(--primary)', marginBottom: '4px' }}>{title}</h3>
                      <p style={{ fontSize: '13px', color: 'var(--muted)' }}>{subtitle}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className={`badge badge-${app.status.toLowerCase().replace('_', '-')}`} style={{ marginBottom: '8px' }}>
                        {app.status.replace('_', ' ')}
                      </span>
                      <div style={{ fontSize: '12px', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                        <Calendar size={12} /> {new Date(app.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT: Status Timeline */}
          <div className="card">
            {currentApp ? (
              <>
                <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '16px', marginBottom: '24px' }}>
                  <h2>{activeTab === 'jobs' ? currentApp.vacancy.title : currentApp.internship.title}</h2>
                  <p style={{ color: 'var(--muted)', fontSize: '14px' }}>
                    {activeTab === 'jobs' ? currentApp.vacancy.location : currentApp.internship.companyName}
                  </p>
                </div>

                <h3 style={{ marginBottom: '24px' }}>Application Timeline</h3>
                
                <div className="timeline">
                  <div className="timeline-item">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <strong style={{ color: 'var(--text)' }}>Submitted</strong>
                      <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
                        {new Date(currentApp.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--muted)' }}>
                      Application received.
                    </p>
                  </div>
                  
                  {currentApp.status !== 'SUBMITTED' && (
                    <div className="timeline-item">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <strong style={{ color: 'var(--primary)' }}>
                          {currentApp.status.replace('_', ' ')}
                        </strong>
                      </div>
                      
                      {/* Interview Details Block */}
                      {currentApp.status === 'INTERVIEW' && (
                        <div style={{ marginTop: '8px', padding: '12px', background: 'var(--info-soft)', borderRadius: '6px', border: '1px solid var(--info)' }}>
                          <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--info)', marginBottom: '4px' }}>Interview Details:</p>
                          <p style={{ fontSize: '13px', color: 'var(--text)' }}>Check your email for the meeting link and time.</p>
                        </div>
                      )}

                      <div style={{ marginTop: '8px', display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--success)', fontSize: '12px', fontWeight: '600' }}>
                        <CheckCircle2 size={14} /> Current Stage
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '40px 0' }}>Select an application to view details.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}