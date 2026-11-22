import { useState } from 'react';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/api';
import CustomSelect from '../components/CustomSelect';
import './CreateVacancy.css';

export default function CreateVacancy() {
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [location, setLocation] = useState('');
  const [workMode, setWorkMode] = useState('Onsite');
  const [salary, setSalary] = useState('');
  const [type, setType] = useState('Full-time');
  const [deadline, setDeadline] = useState('');
  const [description, setDescription] = useState('');
  const [minQualification, setMinQualification] = useState('BSC');
  const [requiredYears, setRequiredYears] = useState(1);
  const [requiredSkills] = useState<string[]>(['React', 'TypeScript']);
  
  const [weights, setWeights] = useState({
    qual: 25, skills: 40, exp: 25, certs: 10
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showErrors, setShowErrors] = useState(false);

  const totalWeight = weights.qual + weights.skills + weights.exp + weights.certs;
  const isWeightValid = totalWeight === 100;

  const isFormValid = 
    title.trim() !== '' && 
    companyName.trim() !== '' && 
    location.trim() !== '' && 
    deadline !== '' && 
    description.trim() !== '' &&
    isWeightValid;

  const handleWeightChange = (field: keyof typeof weights, value: string) => {
    setWeights({ ...weights, [field]: parseInt(value) || 0 });
  };

  const handlePublish = async () => {
    if (!isFormValid) {
      setShowErrors(true);
      return;
    }
    
    setIsLoading(true);
    setMessage('');

    try {
      await api.createVacancy({
        title, companyName, location, workMode, salary, type, description,
        deadline, minQualification, requiredSkills, requiredYears, weights
      });
      setMessage('Vacancy created successfully!');
      setTimeout(() => navigate('/vacancies'), 1500);
    } catch (err: unknown) {
      if (err instanceof Error) setMessage(err.message);
      else setMessage('Failed to create vacancy');
    } finally {
      setIsLoading(false);
    }
  };

  const getInputStyle = (value: string) => ({
    borderColor: showErrors && value.trim() === '' ? 'var(--danger)' : 'var(--border)',
    background: showErrors && value.trim() === '' ? 'var(--danger-soft)' : '#fff'
  });

  return (
    <div>
      <div className="page-header cv-header">
        <div>
          <button 
            onClick={() => navigate('/vacancies')}
            className="cv-back-btn"
          >
            <ArrowLeft size={16} /> Back to Vacancies
          </button>
          <h1>Create New Vacancy</h1>
        </div>
        <div className="cv-action-wrap">
          <button 
            className="btn" 
            disabled={isLoading} 
            onClick={handlePublish}
            style={{ opacity: (isFormValid || !showErrors) ? 1 : 0.6 }}
          >
            <Save size={16} /> {isLoading ? 'Publishing...' : 'Publish Vacancy'}
          </button>
          {!isFormValid && showErrors && (
            <span className="cv-error-msg">
              <AlertCircle size={14} /> Please fill all required fields
            </span>
          )}
        </div>
      </div>

      {message && (
        <div className="cv-message" style={{ 
          background: message.includes('success') ? 'var(--success-soft)' : 'var(--danger-soft)', 
          color: message.includes('success') ? 'var(--success)' : 'var(--danger)' 
        }}>
          {message}
        </div>
      )}

      {/* Replaced inline grid with className */}
      <div className="split cv-split">
        
        {/* LEFT: Basic Info */}
        <div className="cv-col">
          <div className="card">
            <h2>Job Details</h2>
            <p className="cv-subtext">Basic information about the role.</p>
            
            <div className="field">
              <label>Job Title <span className="cv-required">*</span></label>
              <input type="text" className="input" placeholder="e.g. Frontend Developer Intern" value={title} onChange={e => setTitle(e.target.value)} style={getInputStyle(title)} />
            </div>

            <div className="field">
              <label>Company Name <span className="cv-required">*</span></label>
              <input type="text" className="input" placeholder="e.g. TechNova Solutions" value={companyName} onChange={e => setCompanyName(e.target.value)} style={getInputStyle(companyName)} />
            </div>
            
            {/* Replaced inline grid with className */}
            <div className="cv-grid-2">
              <div className="field">
                <label>Location <span className="cv-required">*</span></label>
                <input type="text" className="input" placeholder="e.g. Akungba, Ondo" value={location} onChange={e => setLocation(e.target.value)} style={getInputStyle(location)} />
              </div>
              <div className="field">
                <label>Work Mode</label>
                <CustomSelect 
  value={workMode}
  onChange={setWorkMode}
  options={[
    { value: 'Onsite', label: 'Onsite' },
    { value: 'Remote', label: 'Remote' },
    { value: 'Hybrid', label: 'Hybrid' }
  ]}
/>
              </div>
            </div>

            <div className="cv-grid-2">
              <div className="field">
                <label>Job Type</label>
                <CustomSelect 
  value={type}
  onChange={setType}
  options={[
    { value: 'Full-time', label: 'Full-time' },
    { value: 'Part-time', label: 'Part-time' },
    { value: 'Internship', label: 'Internship' },
    { value: 'Contract', label: 'Contract' }
  ]}
/>
              </div>
              <div className="field">
                <label>Salary Range (Optional)</label>
                <input type="text" className="input" placeholder="e.g. ₦150,000 - ₦200,000" value={salary} onChange={e => setSalary(e.target.value)} />
              </div>
            </div>

            <div className="field">
              <label>Application Deadline <span className="cv-required">*</span></label>
              <input type="date" className="input" value={deadline} onChange={e => setDeadline(e.target.value)} style={getInputStyle(deadline)} />
            </div>

            <div className="field">
              <label>Job Description <span className="cv-required">*</span></label>
              <textarea className="textarea" rows={5} placeholder="Describe the role and responsibilities..." value={description} onChange={e => setDescription(e.target.value)} style={getInputStyle(description)}></textarea>
            </div>
          </div>
        </div>

        {/* RIGHT: Criteria & Weights */}
        <div className="cv-col">
          <div className="card">
            <h2>Knockout & Requirements</h2>
            
            <div className="field">
              <label>Minimum Qualification</label>
              <CustomSelect 
  value={minQualification}
  onChange={setMinQualification}
  options={[
    { value: 'OND', label: 'OND' },
    { value: 'HND', label: 'HND' },
    { value: 'BSC', label: 'BSc' },
    { value: 'MSC', label: 'MSc' }
  ]}
/>
            </div>
            
            <div className="field">
              <label>Required Years of Experience</label>
              <input type="number" className="input" value={requiredYears} onChange={e => setRequiredYears(parseInt(e.target.value))} />
            </div>
          </div>

          <div className="card">
            <h2>Screening Weights</h2>
            <p className="cv-subtext">Must total exactly 100%.</p>

            <div className="cv-grid-2">
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

            <div 
              className="cv-weight-total"
              style={{ 
                background: isWeightValid ? 'var(--success-soft)' : 'var(--danger-soft)',
                color: isWeightValid ? 'var(--success)' : 'var(--danger)',
              }}
            >
              <span>Total Weight:</span>
              <span>{totalWeight}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}