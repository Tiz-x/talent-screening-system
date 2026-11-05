import { useState } from 'react';
import { type Role } from '../api/mockData'; // <-- Added 'type' keyword here

export default function Login() {
  const [role, setRole] = useState<Role>('APPLICANT');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('userRole', role);
    window.location.href = '/'; // Force reload to update layout
  };

  return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <div className="card" style={{ width: '400px', padding: '40px' }}>
        <h1 style={{ textAlign: 'center', color: 'var(--primary)', marginBottom: '8px' }}>TalentScreen</h1>
        <p style={{ textAlign: 'center', color: 'var(--muted)', marginBottom: '24px' }}>Sign in to your account</p>
        
        <form onSubmit={handleLogin}>
          <div className="field">
            <label>Email</label>
            <input type="email" className="input" placeholder="you@aaua.edu.ng" defaultValue="test@aaua.edu.ng" required />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" className="input" placeholder="••••••••" defaultValue="password" required />
          </div>
          
          <div className="field" style={{ background: 'var(--primary-soft)', padding: '12px', borderRadius: '8px' }}>
            <label style={{ color: 'var(--primary)' }}>Login As (For Testing)</label>
            <select 
              className="select" 
              value={role} 
              onChange={(e) => setRole(e.target.value as Role)}
              style={{ borderColor: 'var(--primary)' }}
            >
              <option value="APPLICANT">Applicant</option>
              <option value="EMPLOYER">Employer</option>
            </select>
          </div>
          
          <button type="submit" className="btn" style={{ width: '100%', justifyContent: 'center', marginTop: '16px' }}>
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}