'use client';

import React from 'react';

export default function RegisterForm({
  role,
  setRole,
  name,
  setName,
  email,
  setEmail,
  phone,
  setPhone,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  loading,
  handleRegister,
  setTab
}) {
  return (
    <form onSubmit={handleRegister}>
      {/* Role Select Buttons */}
      <div className="form-group" style={{ marginBottom: '24px' }}>
        <label className="form-label" style={{ fontWeight: '600' }}>Choose Your Role</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <button 
            type="button" 
            className={`btn ${role === 'PARENT' ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '10px', fontSize: '13px', boxShadow: 'none', border: role === 'PARENT' ? 'none' : '2px solid var(--color-secondary)' }}
            onClick={() => setRole('PARENT')}
          >
            Parent / Guardian
          </button>
          <button 
            type="button" 
            className={`btn ${role === 'BABYSITTER' ? 'btn-secondary' : 'btn-outline'}`}
            style={{ padding: '10px', fontSize: '13px', boxShadow: 'none', border: role === 'BABYSITTER' ? 'none' : '2px solid var(--color-secondary)' }}
            onClick={() => setRole('BABYSITTER')}
          >
            Babysitter
          </button>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" style={{ fontWeight: '600' }}>Full Name</label>
        <input 
          type="text" 
          placeholder="John Doe" 
          className="form-control" 
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label" style={{ fontWeight: '600' }}>Email Address</label>
        <input 
          type="email" 
          placeholder="john@example.com" 
          className="form-control" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label" style={{ fontWeight: '600' }}>Phone Number</label>
        <input 
          type="text" 
          placeholder="017XXXXXXXX" 
          className="form-control" 
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label" style={{ fontWeight: '600' }}>Password</label>
        <input 
          type="password" 
          placeholder="••••••••" 
          className="form-control" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label" style={{ fontWeight: '600' }}>Confirm Password</label>
        <input 
          type="password" 
          placeholder="••••••••" 
          className="form-control" 
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      <button type="submit" disabled={loading} className={`btn ${role === 'PARENT' ? 'btn-primary' : 'btn-secondary'}`} style={{ width: '100%', marginTop: '10px', padding: '14px' }}>
        {loading ? 'Creating...' : 'Register'}
      </button>

      <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px' }}>
        Already have an account?{' '}
        <button type="button" onClick={() => setTab('login')} style={{ background: 'none', border: 'none', color: 'var(--color-primary-dark)', fontWeight: '600', cursor: 'pointer' }}>
          Log In
        </button>
      </div>
    </form>
  );
}
