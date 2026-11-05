import { useState } from 'react';
import { api } from '../api/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Call the real backend login endpoint
      const data = await api.login(email, password);
      
      // Save the JWT token and user data to localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('userRole', data.user.role);
      localStorage.setItem('userName', data.user.name);
      localStorage.setItem('userEmail', data.user.email);
      
      // Redirect to the Dashboard
      window.location.href = '/'; 
      
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Invalid email or password');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <div className="card" style={{ width: '400px', padding: '40px' }}>
        <h1 style={{ textAlign: 'center', color: 'var(--primary)', marginBottom: '8px' }}>TalentScreen</h1>
        <p style={{ textAlign: 'center', color: 'var(--muted)', marginBottom: '24px' }}>Sign in to your account</p>
        
        {error && (
          <div style={{ background: 'var(--danger-soft)', color: 'var(--danger)', padding: '12px', borderRadius: '6px', marginBottom: '16px', fontSize: '13px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="field">
            <label>Email</label>
            <input 
              type="email" 
              className="input" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="e.g. test@aaua.edu.ng"
              required 
            />
          </div>
          
          <div className="field">
            <label>Password</label>
            <input 
              type="password" 
              className="input" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••"
              required 
            />
          </div>
          
          <button 
            type="submit" 
            className="btn" 
            style={{ width: '100%', justifyContent: 'center', marginTop: '24px' }} 
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--muted)', marginTop: '24px' }}>
          Don't have an account? Contact your admin.
        </p>
      </div>
    </div>
  );
}