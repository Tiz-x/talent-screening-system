import { useState } from 'react';
import { mockApplicants } from '../api/mockData';
import { Award, CheckCircle, XCircle } from 'lucide-react';

export default function EmployerRanking() {
  const [selectedApplicant, setSelectedApplicant] = useState<string>(mockApplicants[0].id);

  const currentApp = mockApplicants.find(a => a.id === selectedApplicant);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Frontend Developer Intern</h1>
          <p style={{ color: 'var(--muted)' }}>Ranked Applicants based on Screening Criteria</p>
        </div>
        <button className="btn">Export Results</button>
      </div>

      <div className="split">
        {/* LEFT: Ranked Table */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Applicant</th>
                <th>Total Score</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {mockApplicants.map((app, index) => (
                <tr 
                  key={app.id} 
                  onClick={() => setSelectedApplicant(app.id)}
                  className={selectedApplicant === app.id ? 'selected' : ''}
                >
                  <td style={{ fontWeight: 'bold', color: index === 0 ? 'var(--primary)' : 'var(--text)' }}>
                    {index === 0 ? <Award size={18} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '4px' }}/> : null}
                    #{index + 1}
                  </td>
                  <td>
                    <div style={{ fontWeight: '600' }}>{app.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{app.qualification}</div>
                  </td>
                  <td>
                    <span className={app.totalScore > 80 ? 'score-high' : app.totalScore > 50 ? 'score-mid' : 'score-low'}>
                      {app.totalScore}%
                    </span>
                  </td>
                  <td>
                    <span className={`badge badge-${app.status.toLowerCase().replace('_', '-')}`}>
                      {app.status.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* RIGHT: Score Breakdown (Section 3.11.1) */}
        <div className="card">
          {currentApp ? (
            <>
              <h2 style={{ marginBottom: '4px' }}>{currentApp.name}</h2>
              <p style={{ color: 'var(--muted)', fontSize: '13px', marginBottom: '24px' }}>
                Application ID: {currentApp.id}
              </p>

              <h3 style={{ marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
                Screening Breakdown
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Qualification */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '13px' }}>
                    <span>Qualification (25%)</span>
                    <strong>{currentApp.qualScore} / 100</strong>
                  </div>
                  <div className="score-bar"><span style={{ width: `${currentApp.qualScore}%` }}></span></div>
                </div>

                {/* Skills */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '13px' }}>
                    <span>Skills Match (40%)</span>
                    <strong>{currentApp.skillsScore} / 100</strong>
                  </div>
                  <div className="score-bar"><span style={{ width: `${currentApp.skillsScore}%` }}></span></div>
                </div>

                {/* Experience */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '13px' }}>
                    <span>Experience (25%)</span>
                    <strong>{currentApp.expScore} / 100</strong>
                  </div>
                  <div className="score-bar"><span style={{ width: `${currentApp.expScore}%` }}></span></div>
                </div>

                {/* Certifications */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '13px' }}>
                    <span>Certifications (10%)</span>
                    <strong>{currentApp.certsScore} / 100</strong>
                  </div>
                  <div className="score-bar"><span style={{ width: `${currentApp.certsScore}%` }}></span></div>
                </div>
              </div>

              <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3>Total Score</h3>
                  <h2 style={{ color: 'var(--primary)' }}>{currentApp.totalScore}%</h2>
                </div>
              </div>

              <div style={{ marginTop: '24px', display: 'flex', gap: '8px' }}>
                <button className="btn" style={{ flex: 1, justifyContent: 'center' }}>
                  <CheckCircle size={16} /> Shortlist
                </button>
                <button className="btn btn-outline" style={{ flex: 1, justifyContent: 'center', color: 'var(--danger)', borderColor: 'var(--danger)' }}>
                  <XCircle size={16} /> Reject
                </button>
              </div>
            </>
          ) : (
            <p>Select an applicant to view details.</p>
          )}
        </div>
      </div>
    </div>
  );
}