import { useState, useEffect, useRef } from 'react';
import { X, UploadCloud, Save, User, GraduationCap, Briefcase, CheckCircle } from 'lucide-react';
import { api } from '../api/api';
import Spinner from '../components/Spinner';

export default function Profile() {
  const [qualification, setQualification] = useState('BSC');
  const [experienceYrs, setExperienceYrs] = useState(1);
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [cvName, setCvName] = useState<string>(''); 
  
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Fetch profile data on load
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api.getMyProfile();
        setQualification(data.qualification);
        setExperienceYrs(data.experienceYrs);
        setSkills(data.skills);
        setCvUrl(data.cvUrl);
        
        // Extract filename from URL
        if (data.cvUrl) {
          const fileName = data.cvUrl.split('/').pop()?.split('?')[0] || 'Uploaded_CV.pdf';
          setCvName(fileName);
        }
      } catch {
        console.log("No profile found, starting fresh.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newSkill.trim() !== '') {
      e.preventDefault();
      if (!skills.includes(newSkill.trim())) setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage('');
    try {
      await api.saveApplicantProfile({ qualification, skills, experienceYrs, cvUrl });
      setMessage('Profile saved to database successfully!');
    } catch {
      setMessage('Failed to save profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File is too large. Max size is 5MB.");
      return;
    }

    setCvName(file.name);
    setIsUploading(true);
    setMessage('');
    try {
      const data = await api.uploadCV(file);
      setCvUrl(data.cvUrl);
      setMessage('CV uploaded successfully!');
    } catch (err: unknown) {
      if (err instanceof Error) setMessage(err.message);
      else setMessage('Failed to upload CV');
      setCvName(''); 
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) return <div style={{ padding: '40px' }}><Spinner /></div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>My Profile</h1>
          <p style={{ color: 'var(--muted)' }}>Complete your profile for accurate screening</p>
        </div>
        <button 
          className="btn" 
          onClick={handleSave} 
          disabled={isSaving}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}
        >
          <Save size={18} /> {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {message && (
        <div style={{ padding: '12px', background: message.includes('success') ? 'var(--success-soft)' : 'var(--danger-soft)', color: message.includes('success') ? 'var(--success)' : 'var(--danger)', borderRadius: '6px', marginBottom: '24px', fontWeight: '500' }}>
          {message}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', alignItems: 'start' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Academic Info */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
              <div style={{ background: 'var(--primary-soft)', padding: '10px', borderRadius: '8px', color: 'var(--primary)' }}>
                <GraduationCap size={20} />
              </div>
              <h2 style={{ margin: 0 }}>Academic & Personal</h2>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="field">
                <label>Full Name</label>
                <input type="text" className="input" defaultValue={localStorage.getItem('userName') || ''} disabled style={{ background: 'var(--bg)', cursor: 'not-allowed' }} />
              </div>
              <div className="field">
                <label>Highest Qualification</label>
                <select className="select" value={qualification} onChange={(e) => setQualification(e.target.value)}>
                  <option value="OND">OND</option>
                  <option value="HND">HND</option>
                  <option value="BSC">BSc</option>
                  <option value="MSC">MSc</option>
                </select>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
              <div style={{ background: 'var(--primary-soft)', padding: '10px', borderRadius: '8px', color: 'var(--primary)' }}>
                <User size={20} />
              </div>
              <h2 style={{ margin: 0 }}>Skills</h2>
            </div>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
              {skills.map(skill => (
                <span key={skill} style={{ background: 'var(--primary)', color: '#fff', padding: '8px 14px', borderRadius: '6px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500' }}>
                  {skill} <X size={14} style={{ cursor: 'pointer' }} onClick={() => setSkills(skills.filter(s => s !== skill))} />
                </span>
              ))}
            </div>
            <input type="text" className="input" placeholder="Type a skill and press Enter..." value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyDown={handleAddSkill} />
          </div>

          {/* Experience */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
              <div style={{ background: 'var(--primary-soft)', padding: '10px', borderRadius: '8px', color: 'var(--primary)' }}>
                <Briefcase size={20} />
              </div>
              <h2 style={{ margin: 0 }}>Experience</h2>
            </div>
            
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Total Years of Relevant Experience</label>
              <input type="number" className="input" value={experienceYrs} onChange={(e) => setExperienceYrs(parseInt(e.target.value) || 0)} />
            </div>
          </div>
        </div>

        {/* CV Upload */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card">
            <h2 style={{ marginBottom: '20px' }}>CV / Resume</h2>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              accept=".pdf,.doc,.docx" 
              onChange={handleFileChange} 
            />

            {cvUrl ? (
              <div style={{ border: '1px solid var(--success)', background: 'var(--success-soft)', borderRadius: '8px', padding: '24px', textAlign: 'center' }}>
                <CheckCircle size={40} style={{ color: 'var(--success)', margin: '0 auto 12px auto' }} />
                <p style={{ fontWeight: '600', color: 'var(--success)', marginBottom: '8px' }}>CV Uploaded Successfully</p>
                
                <div style={{ background: '#fff', padding: '12px', borderRadius: '6px', border: '1px solid var(--border)', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '150px' }}>
                    {cvName}
                  </span>
                  <a href={cvUrl} target="_blank" rel="noreferrer" style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>
                    View
                  </a>
                </div>

                <button 
                  className="btn btn-outline" 
                  style={{ width: '100%', fontSize: '13px', padding: '8px' }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  Upload New File
                </button>
              </div>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                style={{ border: '2px dashed var(--border)', borderRadius: '8px', padding: '40px 16px', textAlign: 'center', cursor: 'pointer', background: 'var(--bg)', transition: 'all 0.2s' }}
              >
                {isUploading ? (
                  <p style={{ fontWeight: '600', color: 'var(--primary)' }}>Uploading to Cloudinary...</p>
                ) : (
                  <>
                    <UploadCloud size={40} style={{ color: 'var(--primary)', margin: '0 auto 16px auto' }} />
                    <p style={{ fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>Click to upload CV</p>
                    <p style={{ fontSize: '12px', color: 'var(--muted)' }}>PDF or DOCX (Max 5MB)</p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}