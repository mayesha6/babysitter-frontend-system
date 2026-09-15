'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';

export function ForgotPasswordForm({ email, setEmail, loading, handleForgotPassword, setTab }) {
  return (
    <form onSubmit={handleForgotPassword}>
      <div className="form-group">
        <label className="form-label" style={{ fontWeight: '600' }}>Registered Email</label>
        <input 
          type="email" 
          placeholder="parent@gmail.com" 
          className="form-control" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: '10px', padding: '14px' }}>
        {loading ? 'Sending code...' : 'Get OTP Code'}
      </button>

      <button type="button" onClick={() => setTab('login')} style={{ width: '100%', marginTop: '12px', background: 'none', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'var(--color-body)', fontSize: '13px', cursor: 'pointer', fontWeight: '600' }}>
        <ArrowLeft size={16} /> Back to Login
      </button>
    </form>
  );
}

export function ResetPasswordForm({ otp, setOtp, newPassword, setNewPassword, loading, handleResetPassword }) {
  return (
    <form onSubmit={handleResetPassword}>
      <div className="form-group">
        <label className="form-label" style={{ fontWeight: '600' }}>Verification OTP</label>
        <input 
          type="text" 
          placeholder="123456" 
          className="form-control" 
          maxLength="6"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label className="form-label" style={{ fontWeight: '600' }}>New Password</label>
        <input 
          type="password" 
          placeholder="Min 8 characters" 
          className="form-control" 
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>

      <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: '10px', padding: '14px' }}>
        {loading ? 'Resetting...' : 'Change Password'}
      </button>
    </form>
  );
}
