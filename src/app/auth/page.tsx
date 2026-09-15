'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useApp } from '../../context/AppContext';
import api from '../../services/api';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

import LoginForm from '../../components/auth/LoginForm';
import RegisterForm from '../../components/auth/RegisterForm';
import OtpVerifyForm from '../../components/auth/OtpVerifyForm';
import { ForgotPasswordForm, ResetPasswordForm } from '../../components/auth/PasswordResetForms';

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
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Sync tab and role from URL params
  useEffect(() => {
    const urlTab = searchParams.get('tab');
    const urlRole = searchParams.get('role');
    
    if (urlTab) setTab(urlTab);
    if (urlRole) setRole(urlRole.toUpperCase());
  }, [searchParams]);

  const handleError = (err: any) => {
    setError(err.message || 'Action failed. Please check inputs.');
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return setError('Email and Password are required.');
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
    } catch (err: any) {
      handleError(err);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
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
    } catch (err: any) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return setError('Please enter the OTP.');
    setLoading(true);
    setError(null);

    try {
      await verifyOtp(email, otp);
      setSuccessMsg('Account verified successfully! You can now log in.');
      setTab('login');
      setPassword('');
    } catch (err: any) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return setError('Email is required.');
    setLoading(true);
    setError(null);

    try {
      await api.post('/auth/forgot-password', { email });
      setSuccessMsg('OTP code sent successfully. Please check your email.');
      setTab('reset');
    } catch (err: any) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
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
    } catch (err: any) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />

      <main style={{ flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', background: 'var(--color-bg-light)' }}>
        <div className="card" style={{ width: '100%', maxWidth: '480px', padding: '36px', position: 'relative' }}>
          
          <div style={{ marginBottom: '20px' }}>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--color-body)', fontSize: '13px', fontWeight: '600' }}>
              <ArrowLeft size={14} /> Back to Home
            </Link>
          </div>
          
          {/* Header Message */}
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <span style={{ fontSize: '36px' }}>🧸</span>
            <h2 style={{ fontSize: '28px', marginTop: '10px', fontWeight: '600' }}>
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
            <LoginForm 
              email={email} 
              setEmail={setEmail} 
              password={password} 
              setPassword={setPassword} 
              loading={loading} 
              handleLogin={handleLogin} 
              setTab={setTab} 
            />
          )}

          {/* REGISTER FORM */}
          {tab === 'register' && (
            <RegisterForm 
              role={role} 
              setRole={setRole} 
              name={name} 
              setName={setName} 
              email={email} 
              setEmail={setEmail} 
              phone={phone} 
              setPhone={setPhone} 
              password={password} 
              setPassword={setPassword} 
              confirmPassword={confirmPassword} 
              setConfirmPassword={setConfirmPassword} 
              loading={loading} 
              handleRegister={handleRegister} 
              setTab={setTab} 
            />
          )}

          {/* OTP VERIFICATION FORM */}
          {tab === 'otp' && (
            <OtpVerifyForm 
              otp={otp} 
              setOtp={setOtp} 
              loading={loading} 
              setLoading={setLoading} 
              handleVerifyOtp={handleVerifyOtp} 
              email={email} 
              setSuccessMsg={setSuccessMsg} 
              setError={setError} 
            />
          )}

          {/* FORGOT PASSWORD FORM */}
          {tab === 'forgot' && (
            <ForgotPasswordForm 
              email={email} 
              setEmail={setEmail} 
              loading={loading} 
              handleForgotPassword={handleForgotPassword} 
              setTab={setTab} 
            />
          )}

          {/* RESET PASSWORD FORM */}
          {tab === 'reset' && (
            <ResetPasswordForm 
              otp={otp} 
              setOtp={setOtp} 
              newPassword={newPassword} 
              setNewPassword={setNewPassword} 
              loading={loading} 
              handleResetPassword={handleResetPassword} 
            />
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
