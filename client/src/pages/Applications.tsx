import { useState, useEffect, useRef } from 'react';
import { api } from '../api/api';
import { Calendar, CheckCircle2, Briefcase, GraduationCap } from 'lucide-react';
import Spinner from '../components/Spinner';
import './Applications.css';

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

  // Ref for the detail panel — used to scroll into view on mobile
  const detailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [jobsData, internData] = await Promise.all([
          api.getMyApplications(),
          api.getMyInternshipApplications(),
        ]);
        setJobApps(jobsData);
        setInternshipApps(internData);

        if (jobsData.length > 0) {
          setSelectedApp(jobsData[0].id);
        }
      } catch (err) {
        console.error('Failed to load applications', err);
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

  // On mobile, after selecting a card, smoothly scroll the detail panel into view
  const handleSelect = (id: string) => {
    setSelectedApp(id);
    if (window.matchMedia('(max-width: 900px)').matches && detailRef.current) {
      setTimeout(() => {
        detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  };

  // Safe status → css class (handles multiple underscores)
  const statusToClass = (status: string) =>
    status.toLowerCase().replace(/_/g, '-');

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>My Applications</h1>
          <p style={{ color: 'var(--muted)' }}>Track the status of your applications</p>
        </div>
      </div>

      {/* TABS */}
      <div className="apps-tabs">
        <button
          type="button"
          onClick={() => handleTabChange('jobs')}
          className={`apps-tab${activeTab === 'jobs' ? ' active' : ''}`}
        >
          <Briefcase size={18} /> Job Applications
        </button>
        <button
          type="button"
          onClick={() => handleTabChange('internships')}
          className={`apps-tab${activeTab === 'internships' ? ' active' : ''}`}
        >
          <GraduationCap size={18} /> Internship Applications
        </button>
      </div>

      {isLoading ? (
        <Spinner />
      ) : currentList.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: 'var(--muted)' }}>
            You haven't applied for any {activeTab} yet.
          </p>
        </div>
      ) : (
        <div className="split apps-split">
          {/* LEFT: Application List */}
          <div className="apps-list">
            {currentList.map((app: any) => {
              const title = activeTab === 'jobs' ? app.vacancy.title : app.internship.title;
              const subtitle =
                activeTab === 'jobs'
                  ? app.vacancy.location
                  : `${app.internship.companyName} • ${app.internship.location}`;

              return (
                <div
                  key={app.id}
                  className={`card apps-card${selectedApp === app.id ? ' selected' : ''}`}
                  onClick={() => handleSelect(app.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSelect(app.id);
                    }
                  }}
                >
                  <div className="apps-card-inner">
                    <div className="apps-card-main">
                      <h3>{title}</h3>
                      <p>{subtitle}</p>
                    </div>
                    <div className="apps-card-meta">
                      <span className={`badge badge-${statusToClass(app.status)}`}>
                        {app.status.replace(/_/g, ' ')}
                      </span>
                      <div className="apps-card-date">
                        <Calendar size={12} />
                        {new Date(app.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT: Status Timeline */}
          <div className="card apps-detail" ref={detailRef}>
            {currentApp ? (
              <>
                <div className="apps-detail-head">
                  <h2>
                    {activeTab === 'jobs'
                      ? currentApp.vacancy.title
                      : currentApp.internship.title}
                  </h2>
                  <p>
                    {activeTab === 'jobs'
                      ? currentApp.vacancy.location
                      : currentApp.internship.companyName}
                  </p>
                </div>

                <h3 style={{ marginBottom: '24px' }}>Application Timeline</h3>

                <div className="timeline">
                  <div className="timeline-item">
                    <div className="apps-step-head">
                      <strong style={{ color: 'var(--text)' }}>Submitted</strong>
                      <span className="apps-step-date">
                        {new Date(currentApp.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="apps-step-text">Application received.</p>
                  </div>

                  {currentApp.status !== 'SUBMITTED' && (
                    <div className="timeline-item">
                      <div className="apps-step-head">
                        <strong style={{ color: 'var(--primary)' }}>
                          {currentApp.status.replace(/_/g, ' ')}
                        </strong>
                      </div>

                      {currentApp.status === 'INTERVIEW' && (
                        <div className="apps-interview-box">
                          <p className="apps-interview-title">Interview Details:</p>
                          <p className="apps-interview-text">
                            Check your email for the meeting link and time.
                          </p>
                        </div>
                      )}

                      <div className="apps-current-stage">
                        <CheckCircle2 size={14} /> Current Stage
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <p
                style={{
                  color: 'var(--muted)',
                  textAlign: 'center',
                  padding: '40px 0',
                }}
              >
                Select an application to view details.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}