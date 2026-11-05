import { mockInternships } from '../api/mockData';
import { Plus, User } from 'lucide-react';

export default function EmployerInternships() {
  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Manage Internships</h1>
          <p style={{ color: 'var(--muted)' }}>Post and review internship applications (No automated ranking)</p>
        </div>
        <button className="btn">
          <Plus size={16} /> Post Internship
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {mockInternships.map((internship) => (
          <div key={internship.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ color: 'var(--primary)', marginBottom: '4px' }}>{internship.title}</h2>
              <p style={{ color: 'var(--muted)', fontSize: '13px' }}>{internship.location} • {internship.duration}</p>
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <div className="card" style={{ padding: '12px 24px', textAlign: 'center', background: 'var(--bg)' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text)' }}>8</div>
                <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Applicants</div>
              </div>
              <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={16} /> Review Applicants
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}