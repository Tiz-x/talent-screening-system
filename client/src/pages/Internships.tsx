import { useState } from 'react';
import { mockInternships } from '../api/mockData';
import { MapPin, Clock, Calendar, CheckCircle2 } from 'lucide-react';

export default function Internships() {
  const [applied, setApplied] = useState<string[]>([]);

  const handleApply = (id: string) => {
    setApplied([...applied, id]);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Internship Portal</h1>
          <p style={{ color: 'var(--muted)' }}>Find and apply for SIWES or graduate internships</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {mockInternships.map((internship) => (
          <div key={internship.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1 }}>
              <h2 style={{ color: 'var(--primary)', fontSize: '18px', marginBottom: '4px' }}>{internship.title}</h2>
              <p style={{ fontWeight: '500', fontSize: '14px', marginBottom: '16px' }}>{internship.company}</p>
              
              <p style={{ color: 'var(--muted)', fontSize: '13px', marginBottom: '16px', lineHeight: '1.6' }}>
                {internship.description}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'var(--muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={16} /> {internship.location}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={16} /> {internship.duration}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={16} /> Deadline: {internship.deadline}
                </span>
              </div>
            </div>

            <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
              {applied.includes(internship.id) ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--success)', fontWeight: '600', padding: '8px' }}>
                  <CheckCircle2 size={18} /> Application Submitted
                </div>
              ) : (
                <button 
                  className="btn" 
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => handleApply(internship.id)}
                >
                  Apply for Internship
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}