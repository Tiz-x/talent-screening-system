import { useState } from 'react';
import { mockApplications } from '../api/mockData';
import { Calendar, CheckCircle2 } from 'lucide-react';

export default function Applications() {
  const [selectedApp, setSelectedApp] = useState<string>(mockApplications[0].id);

  const currentApp = mockApplications.find(a => a.id === selectedApp);

  // Helper to format status for the badge
  const formatStatus = (status: string) => {
    return status.replace('_', ' ');
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>My Applications</h1>
          <p style={{ color: 'var(--muted)' }}>Track the status of your job applications</p>
        </div>
      </div>

      <div className="split">
        {/* LEFT: Application List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {mockApplications.map((app) => (
            <div 
              key={app.id} 
              className={`card ${selectedApp === app.id ? 'selected' : ''}`}
              onClick={() => setSelectedApp(app.id)}
              style={{ cursor: 'pointer', padding: '16px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ color: 'var(--primary)', marginBottom: '4px' }}>{app.jobTitle}</h3>
                  <p style={{ fontSize: '13px', color: 'var(--muted)' }}>{app.company}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className={`badge badge-${app.status.toLowerCase().replace('_', '-')}`} style={{ marginBottom: '8px' }}>
                    {formatStatus(app.status)}
                  </span>
                  <div style={{ fontSize: '12px', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                    <Calendar size={12} /> {app.dateApplied}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT: Status Timeline */}
        <div className="card">
          {currentApp ? (
            <>
              <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '16px', marginBottom: '24px' }}>
                <h2>{currentApp.jobTitle}</h2>
                <p style={{ color: 'var(--muted)', fontSize: '14px' }}>{currentApp.company}</p>
              </div>

              <h3 style={{ marginBottom: '24px' }}>Application Timeline</h3>
              
              <div className="timeline">
                {currentApp.history.map((step, index) => {
                  const isLatest = index === currentApp.history.length - 1;
                  return (
                    <div key={index} className="timeline-item">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <strong style={{ color: isLatest ? 'var(--primary)' : 'var(--text)' }}>
                          {step.status}
                        </strong>
                        <span style={{ fontSize: '12px', color: 'var(--muted)' }}>{step.date}</span>
                      </div>
                      <p style={{ fontSize: '13px', color: isLatest ? 'var(--text)' : 'var(--muted)' }}>
                        {step.note}
                      </p>
                      {isLatest && (
                        <div style={{ marginTop: '8px', display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--success)', fontSize: '12px', fontWeight: '600' }}>
                          <CheckCircle2 size={14} /> Current Stage
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '40px 0' }}>Select an application to view details.</p>
          )}
        </div>
      </div>
    </div>
  );
}