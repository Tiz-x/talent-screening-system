import { useState } from 'react';
import { api } from '../api/api';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, GraduationCap, Eye, EyeOff } from 'lucide-react'; // <-- Import Eye icons

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // <-- New state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const data = await api.login(email, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('userRole', data.user.role);
      localStorage.setItem('userName', data.user.name);
      localStorage.setItem('userEmail', data.user.email);
      window.location.href = '/dashboard'; 
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* LEFT SIDE */}
      <div className="auth-left">
        <div className="auth-left-content">
          <h1>Welcome to TalentScreen.</h1>
          <p>
            The official Talent Screening and Applicant Management System for Adekunle Ajasin University (AAUA). 
            Connecting top students and graduates with verified employers through a fair, rule-based screening engine.
          </p>
          
          <div className="auth-feature-list">
            <div className="auth-feature">
              <div className="auth-feature-icon"><Zap size={18} /></div>
              <span>Automated Rule-Based Screening</span>
            </div>
            <div className="auth-feature">
              <div className="auth-feature-icon"><ShieldCheck size={18} /></div>
              <span>Secure, Transparent Application Tracking</span>
            </div>
            <div className="auth-feature">
              <div className="auth-feature-icon"><GraduationCap size={18} /></div>
              <span>Dedicated Internship Portal (SIWES)</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="auth-right">
        <div className="auth-form-wrapper">
          <h2 style={{ fontSize: '24px', marginBottom: '8px', color: 'var(--text)' }}>Sign In</h2>
          <p style={{ color: 'var(--muted)', marginBottom: '24px', fontSize: '14px' }}>
            Enter your credentials to access your dashboard.
          </p>
          
          {error && (
            <div style={{ background: 'var(--danger-soft)', color: 'var(--danger)', padding: '12px', borderRadius: '6px', marginBottom: '16px', fontSize: '13px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="field">
              <label>Email Address</label>
              <input 
                type="email" 
                className="input" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="e.g. student@aaua.edu.ng"
                required 
              />
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
                  placeholder="••••••••"
                  style={{ paddingRight: '40px' }} // Make room for the icon
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
            
            <button 
              type="submit" 
              className="btn" 
              style={{ width: '100%', justifyContent: 'center', marginTop: '16px', padding: '12px' }} 
              disabled={isLoading}
            >
              {isLoading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--muted)', marginTop: '24px' }}>
            Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '600' }}>Create one here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}