'use client';

import React from 'react';

interface LoginFormProps {
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  loading: boolean;
  handleLogin: (e: React.FormEvent) => void;
  setTab: (tab: string) => void;
}

export default function LoginForm({ email, setEmail, password, setPassword, loading, handleLogin, setTab }: LoginFormProps) {
  return (
    <form onSubmit={handleLogin}>
      <div className="form-group">
        <label className="form-label" style={{ fontWeight: '600' }}>Email Address</label>
        <input 
          type="email" 
          placeholder="parent@gmail.com" 
          className="form-control" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="form-group">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label className="form-label" style={{ fontWeight: '600' }}>Password</label>
          <button type="button" onClick={() => setTab('forgot')} style={{ background: 'none', border: 'none', color: 'var(--color-secondary)', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
            Forgot password?
          </button>
        </div>
        <input 
          type="password" 
          placeholder="••••••••" 
          className="form-control" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: '10px', padding: '14px' }}>
        {loading ? 'Logging in...' : 'Log In'}
      </button>

      <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px' }}>
        Don't have an account?{' '}
        <button type="button" onClick={() => setTab('register')} style={{ background: 'none', border: 'none', color: 'var(--color-primary-dark)', fontWeight: '600', cursor: 'pointer' }}>
          Sign Up
        </button>
      </div>
    </form>
  );
}
