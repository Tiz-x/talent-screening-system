import { useState } from 'react';
import { Plus, X, UploadCloud, Save } from 'lucide-react';

export default function Profile() {
  const [skills, setSkills] = useState<string[]>(['React', 'TypeScript', 'CSS']);
  const [newSkill, setNewSkill] = useState('');

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newSkill.trim() !== '') {
      e.preventDefault();
      if (!skills.includes(newSkill.trim())) {
        setSkills([...skills, newSkill.trim()]);
      }
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>My Profile</h1>
          <p style={{ color: 'var(--muted)' }}>Keep your information updated for accurate screening</p>
        </div>
        <button className="btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Save size={16} /> Save Changes
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        
        {/* LEFT COLUMN: Structured Data */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Personal & Qualification */}
          <div className="card">
            <h2 style={{ marginBottom: '16px' }}>Academic & Personal</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="field">
                <label>Full Name</label>
                <input type="text" className="input" defaultValue="John Doe" />
              </div>
              <div className="field">
                <label>Matric Number / ID</label>
                <input type="text" className="input" defaultValue="AAUA/2022/001" />
              </div>
            </div>

            <div className="field">
              <label>Highest Qualification</label>
              <select className="select" defaultValue="BSC">
                <option value="OND">OND (Ordinary National Diploma)</option>
                <option value="HND">HND (Higher National Diploma)</option>
                <option value="BSC">BSc (Bachelor's Degree)</option>
                <option value="MSC">MSc (Master's Degree)</option>
              </select>
              <p style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>
                This is used for the knockout stage (Section 3.10).
              </p>
            </div>
          </div>

          {/* Skills */}
          <div className="card">
            <h2 style={{ marginBottom: '16px' }}>Skills</h2>
            <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '16px' }}>
              Type a skill and press <strong>Enter</strong> to add it. The screening engine matches these exactly.
            </p>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
              {skills.map(skill => (
                <span key={skill} style={{ background: 'var(--primary-soft)', color: 'var(--primary)', padding: '6px 12px', borderRadius: '4px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '500' }}>
                  {skill}
                  <X size={14} style={{ cursor: 'pointer', opacity: 0.7 }} onClick={() => removeSkill(skill)} />
                </span>
              ))}
            </div>

            <div className="field" style={{ marginBottom: 0 }}>
              <input 
                type="text" 
                className="input" 
                placeholder="e.g. Node.js, Python, Figma..." 
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={handleAddSkill}
              />
            </div>
          </div>

          {/* Experience */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2>Experience</h2>
              <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '12px' }}>
                <Plus size={14} /> Add Entry
              </button>
            </div>
            
            <div style={{ padding: '16px', border: '1px solid var(--border)', borderRadius: '6px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="field">
                  <label>Job Title</label>
                  <input type="text" className="input" defaultValue="Frontend Intern" />
                </div>
                <div className="field">
                  <label>Field / Category</label>
                  <select className="select" defaultValue="Web Development">
                    <option value="Web Development">Web Development</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Design">Design</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: 0 }}>
                <div className="field" style={{ marginBottom: 0 }}>
                  <label>Duration (Years)</label>
                  <input type="number" className="input" defaultValue="1" />
                </div>
                <div className="field" style={{ marginBottom: 0 }}>
                  <label>Company</label>
                  <input type="text" className="input" defaultValue="TechCorp" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CV Upload & Certifications */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card">
            <h2 style={{ marginBottom: '16px' }}>CV / Resume</h2>
            <div style={{ border: '2px dashed var(--border)', borderRadius: '8px', padding: '32px 16px', textAlign: 'center', cursor: 'pointer', background: 'var(--bg)' }}>
              <UploadCloud size={32} style={{ color: 'var(--primary)', margin: '0 auto 12px auto' }} />
              <p style={{ fontWeight: '500', fontSize: '14px' }}>Click to upload CV</p>
              <p style={{ fontSize: '12px', color: 'var(--muted)' }}>PDF or DOCX (Max 5MB)</p>
            </div>
          </div>

          <div className="card">
            <h2 style={{ marginBottom: '16px' }}>Certifications</h2>
            <div className="field">
              <label>Certification Name</label>
              <input type="text" className="input" defaultValue="Meta Frontend Developer" />
            </div>
            <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}>
              <Plus size={16} /> Add Certification
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}