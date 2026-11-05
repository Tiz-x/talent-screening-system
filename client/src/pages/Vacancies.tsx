import { useState } from 'react';
import { mockVacancies } from '../api/mockData';
import { MapPin, Briefcase, Calendar } from 'lucide-react';

export default function Vacancies() {
  const [selectedJob, setSelectedJob] = useState<string | null>(null);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Find Vacancies</h1>
          <p style={{ color: 'var(--muted)' }}>Browse open roles and apply</p>
        </div>
      </div>

      <div className="split" style={{ gridTemplateColumns: '1fr 400px' }}>
        {/* Left Side: Job List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {mockVacancies.map((job) => (
            <div 
              key={job.id} 
              className={`card ${selectedJob === job.id ? 'selected' : ''}`}
              onClick={() => setSelectedJob(job.id)}
              style={{ cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h2 style={{ color: 'var(--primary)' }}>{job.title}</h2>
                  <p style={{ fontWeight: '500', marginBottom: '8px' }}>{job.company}</p>
                  
                  <div style={{ display: 'flex', gap: '16px', color: 'var(--muted)', fontSize: '13px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={14} /> {job.location}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Briefcase size={14} /> {job.type}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={14} /> Deadline: {job.deadline}
                    </span>
                  </div>
                </div>
                <span className="badge badge-submitted">Active</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Side: Job Details / Apply */}
        <div className="card" style={{ position: 'sticky', top: '24px' }}>
          {selectedJob ? (
            (() => {
              const job = mockVacancies.find(v => v.id === selectedJob)!;
              return (
                <>
                  <h2>{job.title}</h2>
                  <p style={{ color: 'var(--muted)', marginBottom: '16px' }}>{job.company}</p>
                  
                  <h3 style={{ marginTop: '16px', marginBottom: '8px' }}>Requirements</h3>
                  <ul style={{ paddingLeft: '20px', marginBottom: '16px', color: 'var(--muted)' }}>
                    <li>Minimum Qualification: {job.minQualification}</li>
                    <li>Required Experience: {job.requiredYears} years</li>
                    <li>Required Skills: {job.requiredSkills.join(', ')}</li>
                  </ul>

                  <button className="btn" style={{ width: '100%', justifyContent: 'center', marginTop: '24px' }}>
                    Apply for this Job
                  </button>
                  <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--muted)', marginTop: '8px' }}>
                    By applying, your profile will be screened against the job criteria.
                  </p>
                </>
              );
            })()
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '40px 0' }}>
              Select a job from the left to view details and apply.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}