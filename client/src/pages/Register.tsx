import { useState } from 'react';
import { api } from '../api/api';
import { Link } from 'react-router-dom';
import { type Role } from '../api/mockData';
import { Building2, UserCheck, Shield, Eye, EyeOff } from 'lucide-react'; 
import CustomSelect from '../components/CustomSelect';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // <-- New state
  const [role, setRole] = useState<Role>('APPLICANT');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

    const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validation: Ensure Full Name has at least two words (First and Last Name)
    const nameParts = name.trim().split(' ');
    if (nameParts.length < 2 || nameParts.some(part => part === '')) {
      setError('Please enter your full name (First and Last Name).');
      setIsLoading(false);
      return;
    }

    try {
      await api.register(name, email, password, role);
      const data = await api.login(email, password);
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('userRole', data.user.role);
      localStorage.setItem('userName', data.user.name);
      localStorage.setItem('userEmail', data.user.email);
      
      window.location.href = '/dashboard'; 
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
            {/* ADD THIS STYLE TAG RIGHT HERE */}
      <style>{`
        @media (max-width: 900px) {
          .auth-left { display: none !important; }
          .auth-right { 
            padding: 24px 16px !important; 
            align-items: flex-start !important;
          }
          .auth-form-wrapper {
            /* Make it fill the space beautifully */
            max-width: 480px !important; 
            margin: 0 auto !important;
            padding: 32px 20px !important;
            width: 100% !important;
            border: none !important;
            box-shadow: none !important;
            background: transparent !important;
          }
          /* Slightly larger inputs and buttons for mobile ease-of-use */
          .auth-form-wrapper .input,
          .auth-form-wrapper .select {
            font-size: 16px !important; /* Prevents iOS zoom on focus */
            padding: 12px 14px !important;
          }
          .auth-form-wrapper .btn {
            padding: 14px !important;
            font-size: 16px !important;
          }
          .auth-form-wrapper h2 {
            font-size: 28px !important;
          }
        }
      `}</style>
      {/* LEFT SIDE */}
      <div className="auth-left">
        <div className="auth-left-content">
          <h1>Join the TalentScreen Network.</h1>
          <p>
            Whether you are an AAUA student looking for SIWES placement, a graduate seeking your first role, 
            or an employer looking for top talent, create an account to get started.
          </p>
          
          <div className="auth-feature-list">
            <div className="auth-feature">
              <div className="auth-feature-icon"><UserCheck size={18} /></div>
              <span><strong>Applicants:</strong> Build a profile, upload your CV, and track your application status.</span>
            </div>
            <div className="auth-feature">
              <div className="auth-feature-icon"><Building2 size={18} /></div>
              <span><strong>Employers:</strong> Post vacancies, set screening criteria, and rank candidates instantly.</span>
            </div>
            <div className="auth-feature">
              <div className="auth-feature-icon"><Shield size={18} /></div>
              <span>All data is securely stored and handled according to best practices.</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="auth-right">
        <div className="auth-form-wrapper">
          <h2 style={{ fontSize: '24px', marginBottom: '8px', color: 'var(--text)' }}>Create an Account</h2>
          <p style={{ color: 'var(--muted)', marginBottom: '24px', fontSize: '14px' }}>
            Fill in your details to join the platform.
          </p>
          
          {error && (
            <div style={{ background: 'var(--danger-soft)', color: 'var(--danger)', padding: '12px', borderRadius: '6px', marginBottom: '16px', fontSize: '13px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleRegister}>
            <div className="field">
  <label>Full Name</label>
  <input type="text" className="input" value={name} onChange={(e) => setName(e.target.value)} required />
  <p style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>Enter both your First and Last name.</p>
</div>

            <div className="field">
              <label>Email Address</label>
              <input type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            
            {/* PASSWORD FIELD WITH EYE TOGGLE */}
            <div className="field">
              <label>Password</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="input" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  style={{ paddingRight: '40px' }} 
                  required 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--muted)',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="field" style={{ background: 'var(--bg)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <label style={{ marginBottom: '8px' }}>I am registering as:</label>
              <CustomSelect 
  value={role}
  onChange={(val) => setRole(val as Role)}
  options={[
    { value: 'APPLICANT', label: 'Applicant (Student / Graduate)' },
    { value: 'EMPLOYER', label: 'Employer (Recruiter / Company)' }
  ]}
/>
            </div>
            
            <button 
              type="submit" 
              className="btn" 
              style={{ width: '100%', justifyContent: 'center', marginTop: '16px', padding: '12px' }} 
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Register'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--muted)', marginTop: '24px' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}