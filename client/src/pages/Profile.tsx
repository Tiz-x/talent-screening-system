import { useState, useEffect, useRef } from 'react';
import { X, UploadCloud, Save, User, GraduationCap, Briefcase, CheckCircle, Plus } from 'lucide-react';
import { api } from '../api/api';
import Spinner from '../components/Spinner';
import { useToast } from '../components/Toast';
import CustomSelect from '../components/CustomSelect';
import './Profile.css';

export default function Profile() {
  const { showToast } = useToast();
  const [qualification, setQualification] = useState('BSC');
  const [experienceYrs, setExperienceYrs] = useState(1);
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');

  const [additionalInfo, setAdditionalInfo] = useState<{ label: string; value: string }[]>([]);
  const [newInfoLabel, setNewInfoLabel] = useState('');
  const [newInfoValue, setNewInfoValue] = useState('');

  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [cvName, setCvName] = useState<string>('');

  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api.getMyProfile();
        setQualification(data.qualification);
        setExperienceYrs(data.experienceYrs);
        setSkills(data.skills);
        setCvUrl(data.cvUrl);

        if (data.additionalInfo) {
          setAdditionalInfo(data.additionalInfo as { label: string; value: string }[]);
        }

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

  const handleAddInfo = () => {
    if (newInfoLabel.trim() && newInfoValue.trim()) {
      setAdditionalInfo([...additionalInfo, { label: newInfoLabel.trim(), value: newInfoValue.trim() }]);
      setNewInfoLabel('');
      setNewInfoValue('');
    }
  };

  const handleRemoveInfo = (index: number) => {
    setAdditionalInfo(additionalInfo.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.saveApplicantProfile({
        qualification,
        skills,
        experienceYrs,
        cvUrl,
        additionalInfo,
      });
      showToast('Profile saved successfully!', 'success');
    } catch {
      showToast('Failed to save profile.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast("File is too large. Max size is 5MB.", 'error');
      return;
    }

    setCvName(file.name);
    setIsUploading(true);
    try {
      const data = await api.uploadCV(file);
      setCvUrl(data.cvUrl);
      showToast('CV uploaded successfully!', 'success');
    } catch (err: unknown) {
      if (err instanceof Error) showToast(err.message, 'error');
      else showToast('Failed to upload CV', 'error');
      setCvName('');
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) return <div style={{ padding: '40px' }}><Spinner /></div>;

  return (
    <div>
      <div className="page-header profile-header">
        <div>
          <h1>My Profile</h1>
          <p style={{ color: 'var(--muted)' }}>Complete your profile for accurate screening</p>
        </div>
        <button
          className="btn profile-save-btn"
          onClick={handleSave}
          disabled={isSaving}
        >
          <Save size={18} /> {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="profile-layout">

        <div className="profile-main">
          {/* Academic Info */}
          <div className="card">
            <div className="profile-card-header">
              <div className="profile-card-icon"><GraduationCap size={20} /></div>
              <h2>Academic & Personal</h2>
            </div>

            <div className="profile-grid-2">
              <div className="field">
                <label>Full Name</label>
                <input
                  type="text"
                  className="input"
                  defaultValue={localStorage.getItem('userName') || ''}
                  disabled
                  style={{ background: 'var(--bg)', cursor: 'not-allowed' }}
                />
              </div>
              <div className="field">
                <label>Highest Qualification</label>
                <CustomSelect 
  value={qualification}
  onChange={setQualification}
  options={[
    { value: 'OND', label: 'OND' },
    { value: 'HND', label: 'HND' },
    { value: 'BSC', label: 'BSc' },
    { value: 'MSC', label: 'MSc' }
  ]}
/>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="card">
            <div className="profile-card-header">
              <div className="profile-card-icon"><User size={20} /></div>
              <h2>Skills</h2>
            </div>

            <div className="profile-skills-wrap">
              {skills.map(skill => (
                <span key={skill} className="profile-skill-pill">
                  <span>{skill}</span>
                  <X
                    size={14}
                    className="profile-skill-remove"
                    onClick={() => setSkills(skills.filter(s => s !== skill))}
                  />
                </span>
              ))}
            </div>
            <input
              type="text"
              className="input"
              placeholder="Type a skill and press Enter..."
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={handleAddSkill}
            />
          </div>

          {/* Experience */}
          <div className="card">
            <div className="profile-card-header">
              <div className="profile-card-icon"><Briefcase size={20} /></div>
              <h2>Experience</h2>
            </div>

            <div className="field" style={{ marginBottom: 0 }}>
              <label>Total Years of Relevant Experience</label>
              <input
                type="number"
                className="input"
                value={experienceYrs}
                onChange={(e) => setExperienceYrs(parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          {/* Additional Info */}
          <div className="card">
            <div className="profile-card-header">
              <div className="profile-card-icon"><Plus size={20} /></div>
              <h2>Additional Information</h2>
            </div>

            <p className="profile-hint">
              Add any extra details you want the employer to see (e.g., Portfolio URL, Languages, etc.).
            </p>

            <div className="profile-add-row">
              <input
                type="text"
                className="input"
                placeholder="Label (e.g., Portfolio)"
                value={newInfoLabel}
                onChange={(e) => setNewInfoLabel(e.target.value)}
              />
              <input
                type="text"
                className="input"
                placeholder="Value (e.g., https://...)"
                value={newInfoValue}
                onChange={(e) => setNewInfoValue(e.target.value)}
              />
              <button
                type="button"
                className="btn profile-add-btn"
                onClick={handleAddInfo}
                disabled={!newInfoLabel || !newInfoValue}
              >
                Add
              </button>
            </div>

            {additionalInfo.length > 0 && (
              <div className="profile-info-list">
                {additionalInfo.map((info, index) => (
                  <div key={index} className="profile-info-item">
                    <div className="profile-info-text">
                      <span className="profile-info-label">{info.label}:</span>{' '}
                      <span className="profile-info-value">{info.value}</span>
                    </div>
                    <X
                      size={16}
                      className="profile-info-remove"
                      onClick={() => handleRemoveInfo(index)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CV Upload */}
        <div className="profile-side">
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
              <div className="profile-cv-success">
                <CheckCircle size={40} className="profile-cv-success-icon" />
                <p className="profile-cv-success-title">CV Uploaded Successfully</p>

                <div className="profile-cv-file">
                  <span className="profile-cv-filename">{cvName}</span>
                  <a href={cvUrl} target="_blank" rel="noreferrer" className="profile-cv-view">
                    View
                  </a>
                </div>

                <button
                  className="btn btn-outline profile-cv-replace-btn"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Upload New File
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="profile-cv-dropzone"
              >
                {isUploading ? (
                  <p className="profile-cv-uploading">Uploading to Cloudinary...</p>
                ) : (
                  <>
                    <UploadCloud size={40} className="profile-cv-dropzone-icon" />
                    <p className="profile-cv-dropzone-title">Click to upload CV</p>
                    <p className="profile-cv-dropzone-hint">PDF or DOCX (Max 5MB)</p>
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