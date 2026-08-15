'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useApp } from '../../context/AppContext';
import api from '../../services/api';
import { Lock, Mail, Phone, User as UserIcon, Shield, ArrowLeft, CheckCircle2 } from 'lucide-react';

function AuthContent() {
  const { login, register, verifyOtp } = useApp();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Navigation tab state: 'login', 'register', 'otp', 'forgot', 'reset'
  const [tab, setTab] = useState('login');
  
  // Registration role: 'PARENT' or 'BABYSITTER'
  const [role, setRole] = useState('PARENT');

  // Input states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Status states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Sync tab and role from URL params
  useEffect(() => {
    const urlTab = searchParams.get('tab');
    const urlRole = searchParams.get('role');
    
    if (urlTab) setTab(urlTab);
    if (urlRole) setRole(urlRole.toUpperCase());
  }, [searchParams]);

  const handleError = (err) => {
    setError(err.message || 'Action failed. Please check inputs.');
    setLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return setError('Email and Password are required.');
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
    } catch (err) {
      handleError(err);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !email || !phone || !password || !confirmPassword) {
      return setError('All fields are required.');
    }
    if (password !== confirmPassword) {
      return setError('Passwords do not match.');
    }
    setLoading(true);
    setError(null);

    try {
      await register({
        name,
        email,
        phone,
        password,
        confirmPassword,
        role
      });
      setSuccessMsg('Account created successfully! An OTP has been sent to your email.');
      setTab('otp');
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) return setError('Please enter the OTP.');
    setLoading(true);
    setError(null);

    try {
      await verifyOtp(email, otp);
      setSuccessMsg('Account verified successfully! You can now log in.');
      setTab('login');
      setPassword('');
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) return setError('Email is required.');
    setLoading(true);
    setError(null);

    try {
      await api.post('/auth/forgot-password', { email });
      setSuccessMsg('OTP code sent successfully. Please check your email.');
      setTab('reset');
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!otp || !newPassword) return setError('OTP and New Password are required.');
    setLoading(true);
    setError(null);

    try {
      await api.post('/auth/reset-password', {
        email,
        otp,
        newPassword
      });
      setSuccessMsg('Password reset successfully. You can now log in.');
      setTab('login');
      setPassword('');
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />

      <main style={{ flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', background: 'var(--color-bg-light)' }}>
        <div className="card" style={{ width: '100%', maxWidth: '480px', padding: '36px' }}>
          
          {/* Header Message */}
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <span style={{ fontSize: '36px' }}>🧸</span>
            <h2 style={{ fontSize: '28px', marginTop: '10px' }}>
              {tab === 'login' && 'Welcome Back'}
              {tab === 'register' && 'Create Account'}
              {tab === 'otp' && 'Verify Account'}
              {tab === 'forgot' && 'Reset Password'}
              {tab === 'reset' && 'Enter New Password'}
            </h2>
            <p style={{ color: 'var(--color-body)', fontSize: '14px', marginTop: '6px' }}>
              {tab === 'login' && 'Log in to connect with sitters and parents'}
              {tab === 'register' && 'Register and find professional childcare'}
              {tab === 'otp' && `We sent a 6-digit OTP code to ${email}`}
              {tab === 'forgot' && 'Enter your email to receive an OTP code'}
              {tab === 'reset' && 'Input the OTP and your new password'}
            </p>
          </div>

          {/* Feedback messages */}
          {error && (
            <div style={{ background: 'rgba(255, 110, 110, 0.1)', border: '1px solid var(--color-danger)', color: 'var(--color-danger)', padding: '12px', borderRadius: '8px', fontSize: '13px', marginBottom: '20px' }}>
              {error}
            </div>
          )}
          {successMsg && (
            <div style={{ background: 'rgba(76, 217, 100, 0.1)', border: '1px solid var(--color-success)', color: 'var(--color-success)', padding: '12px', borderRadius: '8px', fontSize: '13px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* LOGIN FORM */}
          {tab === 'login' && (
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
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
                  <label className="form-label">Password</label>
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
                <button type="button" onClick={() => setTab('register')} style={{ background: 'none', border: 'none', color: 'var(--color-primary-dark)', fontWeight: '700', cursor: 'pointer' }}>
                  Sign Up
                </button>
              </div>
            </form>
          )}

          {/* REGISTER FORM */}
          {tab === 'register' && (
            <form onSubmit={handleRegister}>
              {/* Role Select Buttons */}
              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label">Choose Your Role</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <button 
                    type="button" 
                    className={`btn ${role === 'PARENT' ? 'btn-primary' : 'btn-outline'}`}
                    style={{ padding: '10px', fontSize: '13px', boxShadow: 'none', border: role === 'PARENT' ? 'none' : '1.5px solid var(--color-dark)' }}
                    onClick={() => setRole('PARENT')}
                  >
                    Parent / Guardian
                  </button>
                  <button 
                    type="button" 
                    className={`btn ${role === 'BABYSITTER' ? 'btn-secondary' : 'btn-outline'}`}
                    style={{ padding: '10px', fontSize: '13px', boxShadow: 'none', border: role === 'BABYSITTER' ? 'none' : '1.5px solid var(--color-dark)' }}
                    onClick={() => setRole('BABYSITTER')}
                  >
                    Babysitter
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  placeholder="John Doe" 
                  className="form-control" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input 
                  type="email" 
                  placeholder="john@example.com" 
                  className="form-control" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input 
                  type="text" 
                  placeholder="017XXXXXXXX" 
                  className="form-control" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    className="form-control" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    className="form-control" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className={`btn ${role === 'PARENT' ? 'btn-primary' : 'btn-secondary'}`} style={{ width: '100%', marginTop: '10px', padding: '14px' }}>
                {loading ? 'Creating...' : 'Register'}
              </button>

              <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px' }}>
                Already have an account?{' '}
                <button type="button" onClick={() => setTab('login')} style={{ background: 'none', border: 'none', color: 'var(--color-primary-dark)', fontWeight: '700', cursor: 'pointer' }}>
                  Log In
                </button>
              </div>
            </form>
          )}

          {/* OTP VERIFICATION FORM */}
          {tab === 'otp' && (
            <form onSubmit={handleVerifyOtp}>
              <div className="form-group">
                <label className="form-label">Verification Code (OTP)</label>
                <input 
                  type="text" 
                  placeholder="123456" 
                  className="form-control" 
                  maxLength="6"
                  style={{ textAlign: 'center', letterSpacing: '8px', fontSize: '24px', fontWeight: 'bold' }}
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
                  style={{ background: 'none', border: 'none', color: 'var(--color-secondary)', fontWeight: '700', cursor: 'pointer' }}
                  onClick={async () => {
                    setLoading(true);
                    try {
                      await api.post('/otp/resend-otp', { email });
                      setSuccessMsg('Verification OTP resent successfully!');
                    } catch (err) {
                      setError(err.message);
                    } finally {
                      setLoading(false);
                    }
                  }}
                >
                  Resend OTP
                </button>
              </div>
            </form>
          )}

          {/* FORGOT PASSWORD FORM */}
          {tab === 'forgot' && (
            <form onSubmit={handleForgotPassword}>
              <div className="form-group">
                <label className="form-label">Registered Email</label>
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

              <button type="button" onClick={() => setTab('login')} style={{ width: '100%', marginTop: '12px', background: 'none', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'var(--color-body)', fontSize: '13px', cursor: 'pointer' }}>
                <ArrowLeft size={16} /> Back to Login
              </button>
            </form>
          )}

          {/* RESET PASSWORD FORM */}
          {tab === 'reset' && (
            <form onSubmit={handleResetPassword}>
              <div className="form-group">
                <label className="form-label">Verification OTP</label>
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
                <label className="form-label">New Password</label>
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
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function Auth() {
  return (
    <Suspense fallback={<div>Loading Auth...</div>}>
      <AuthContent />
    </Suspense>
  );
}
