const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:10000';

export const api = {
  login: async (email: string, password: string, role: string) => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role }),
    });
    if (!res.ok) throw new Error('Login failed');
    return res.json();
  },
  
  register: async (name: string, email: string, password: string, role: string) => {
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role }),
    });
    if (!res.ok) throw new Error('Registration failed');
    return res.json();
  }
};