import { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CreateVacancy() {
  const navigate = useNavigate();
  
  // Weights state
  const [weights, setWeights] = useState({
    qual: 25,
    skills: 40,
    exp: 25,
    certs: 10
  });

  const totalWeight = weights.qual + weights.skills + weights.exp + weights.certs;
  const isValid = totalWeight === 100;

  const handleWeightChange = (field: keyof typeof weights, value: string) => {
    setWeights({ ...weights, [field]: parseInt(value) || 0 });
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <button 
            onClick={() => navigate('/vacancies')}
            style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px', padding: 0 }}
          >
            <ArrowLeft size={16} /> Back to Vacancies
          </button>
          <h1>Create New Vacancy</h1>
        </div>
        <button className="btn" disabled={!isValid} style={{ opacity: isValid ? 1 : 0.5 }}>
          <Save size={16} /> Publish Vacancy
        </button>
      </div>

      <div className="split" style={{ gridTemplateColumns: '1fr 400px' }}>
        
        {/* LEFT: Basic Info */}
        <div className="card">
          <h2>Job Details</h2>
          <p style={{ color: 'var(--muted)', fontSize: '13px', marginBottom: '24px' }}>Basic information about the role.</p>
          
          <div className="field">
            <label>Job Title</label>
            <input type="text" className="input" placeholder="e.g. Frontend Developer Intern" />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="field">
              <label>Location</label>
              <input type="text" className="input" placeholder="e.g. Akungba or Remote" />
            </div>
            <div className="field">
              <label>Deadline</label>
              <input type="date" className="input" />
            </div>
          </div>

          <div className="field">
            <label>Description</label>
            <textarea className="textarea" rows={5} placeholder="Describe the role..."></textarea>
          </div>
        </div>

        {/* RIGHT: Criteria & Weights */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="card">
            <h2>Knockout & Requirements</h2>
            <p style={{ color: 'var(--muted)', fontSize: '13px', marginBottom: '16px' }}>Applicants failing these will be auto-rejected.</p>
            
            <div className="field">
              <label>Minimum Qualification</label>
              <select className="select">
                <option value="OND">OND</option>
                <option value="HND">HND</option>
                <option value="BSC">BSc</option>
                <option value="MSC">MSc</option>
              </select>
            </div>
            
            <div className="field">
              <label>Required Years of Experience</label>
              <input type="number" className="input" defaultValue={1} />
            </div>
          </div>

          <div className="card">
            <h2>Screening Weights</h2>
            <p style={{ color: 'var(--muted)', fontSize: '13px', marginBottom: '16px' }}>Must total exactly 100%.</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="field">
                <label>Qualification (%)</label>
                <input type="number" className="input" value={weights.qual} onChange={e => handleWeightChange('qual', e.target.value)} />
              </div>
              <div className="field">
                <label>Skills (%)</label>
                <input type="number" className="input" value={weights.skills} onChange={e => handleWeightChange('skills', e.target.value)} />
              </div>
              <div className="field">
                <label>Experience (%)</label>
                <input type="number" className="input" value={weights.exp} onChange={e => handleWeightChange('exp', e.target.value)} />
              </div>
              <div className="field">
                <label>Certifications (%)</label>
                <input type="number" className="input" value={weights.certs} onChange={e => handleWeightChange('certs', e.target.value)} />
              </div>
            </div>

            <div style={{ 
              marginTop: '16px', 
              padding: '12px', 
              borderRadius: '6px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: isValid ? 'var(--success-soft)' : 'var(--danger-soft)',
              color: isValid ? 'var(--success)' : 'var(--danger)',
              fontWeight: '600'
            }}>
              <span>Total Weight:</span>
              <span>{totalWeight}%</span>
            </div>
            {!isValid && (
              <p style={{ color: 'var(--danger)', fontSize: '12px', marginTop: '8px' }}>
                Weights must equal exactly 100% to publish.
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}