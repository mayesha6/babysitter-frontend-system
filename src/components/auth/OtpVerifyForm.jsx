'use client';

import React from 'react';
import api from '../../services/api';

export default function OtpVerifyForm({
  otp,
  setOtp,
  loading,
  setLoading,
  handleVerifyOtp,
  email,
  setSuccessMsg,
  setError
}) {
  const handleResend = async () => {
    setLoading(true);
    try {
      await api.post('/otp/resend-otp', { email });
      setSuccessMsg('Verification OTP resent successfully!');
    } catch (err) {
      setError(err.message || 'Failed to resend OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleVerifyOtp}>
      <div className="form-group">
        <label className="form-label" style={{ fontWeight: '600' }}>Verification Code (OTP)</label>
        <input 
          type="text" 
          placeholder="123456" 
          className="form-control" 
          maxLength="6"
          style={{ textAlign: 'center', letterSpacing: '8px', fontSize: '24px', fontWeight: '600' }}
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
      </div>

      <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: '10px', padding: '14px' }}>
        {loading ? 'Verifying...' : 'Verify & Activate'}
      </button>

      <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px' }}>
        Didn't receive code?{' '}
        <button 
          type="button" 
          style={{ background: 'none', border: 'none', color: 'var(--color-secondary)', fontWeight: '600', cursor: 'pointer' }}
          onClick={handleResend}
        >
          Resend OTP
        </button>
      </div>
    </form>
  );
}
