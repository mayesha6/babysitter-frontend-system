'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, Users, Baby, ArrowRight, Loader2, Sparkles } from 'lucide-react';

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
  const { switchRole } = useApp();
  const [roleLoading, setRoleLoading] = useState<string | null>(null);

  const handleRoleQuickLogin = async (targetRole: 'SUPER_ADMIN' | 'PARENT' | 'BABYSITTER') => {
    setRoleLoading(targetRole);
    if (targetRole === 'SUPER_ADMIN') {
      setEmail('super@gmail.com');
      setPassword('12345678');
    } else if (targetRole === 'PARENT') {
      setEmail('parent@gmail.com');
      setPassword('Password@123');
    } else if (targetRole === 'BABYSITTER') {
      setEmail('sitter@gmail.com');
      setPassword('Password@123');
    }

    try {
      await switchRole(targetRole);
    } finally {
      setRoleLoading(null);
    }
  };

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

      <button type="submit" disabled={loading || !!roleLoading} className="btn btn-primary" style={{ width: '100%', marginTop: '10px', padding: '14px' }}>
        {loading ? 'Logging in...' : 'Log In'}
      </button>

      {/* 1-Click Role Login Section */}
      <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid var(--color-gray-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '14px' }}>
          <Sparkles size={14} color="var(--color-primary)" />
          <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--color-body)' }}>
            One-Click Role Login / ডেমো লগইন
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Admin Role Button */}
          <button
            type="button"
            disabled={loading || !!roleLoading}
            onClick={() => handleRoleQuickLogin('SUPER_ADMIN')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderRadius: '10px',
              border: '1.5px solid #8b5cf6',
              background: 'rgba(139, 92, 246, 0.06)',
              color: '#5b21b6',
              cursor: (loading || !!roleLoading) ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              textAlign: 'left'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ background: '#8b5cf6', color: 'white', padding: '8px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Shield size={18} />
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#4c1d95', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>Admin</span>
                  <span style={{ fontSize: '11px', background: '#8b5cf6', color: 'white', padding: '2px 6px', borderRadius: '10px', fontWeight: '600' }}>Full Access</span>
                </div>
                <div style={{ fontSize: '12px', color: '#6d28d9', marginTop: '2px' }}>
                  সব ভেরিফিকেশন, ইউজার ও পেমেন্ট ম্যানেজমেন্ট
                </div>
              </div>
            </div>
            {roleLoading === 'SUPER_ADMIN' ? (
              <Loader2 size={18} className="animate-spin" color="#6d28d9" />
            ) : (
              <ArrowRight size={16} color="#8b5cf6" />
            )}
          </button>

          {/* Parent (User) Role Button */}
          <button
            type="button"
            disabled={loading || !!roleLoading}
            onClick={() => handleRoleQuickLogin('PARENT')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderRadius: '10px',
              border: '1.5px solid var(--color-primary)',
              background: 'rgba(255, 117, 151, 0.08)',
              color: 'var(--color-primary-dark)',
              cursor: (loading || !!roleLoading) ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              textAlign: 'left'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ background: 'var(--color-primary)', color: 'white', padding: '8px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={18} />
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-dark)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>User / Parent</span>
                  <span style={{ fontSize: '11px', background: 'var(--color-primary)', color: 'white', padding: '2px 6px', borderRadius: '10px', fontWeight: '600' }}>Employer</span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--color-body)', marginTop: '2px' }}>
                  জব পোস্ট, সিটার হায়ার ও বুকিং পরিচালনা
                </div>
              </div>
            </div>
            {roleLoading === 'PARENT' ? (
              <Loader2 size={18} className="animate-spin" color="var(--color-primary)" />
            ) : (
              <ArrowRight size={16} color="var(--color-primary)" />
            )}
          </button>

          {/* Babysitter Role Button */}
          <button
            type="button"
            disabled={loading || !!roleLoading}
            onClick={() => handleRoleQuickLogin('BABYSITTER')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderRadius: '10px',
              border: '1.5px solid var(--color-tertiary-dark)',
              background: 'rgba(109, 193, 160, 0.1)',
              color: 'var(--color-tertiary-dark)',
              cursor: (loading || !!roleLoading) ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              textAlign: 'left'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ background: 'var(--color-tertiary-dark)', color: 'white', padding: '8px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Baby size={18} />
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-dark)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>Babysitter</span>
                  <span style={{ fontSize: '11px', background: 'var(--color-tertiary-dark)', color: 'white', padding: '2px 6px', borderRadius: '10px', fontWeight: '600' }}>Caregiver</span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--color-body)', marginTop: '2px' }}>
                  জব খোঁজা, অ্যাপ্লাই ও শিডিউল ম্যানেজমেন্ট
                </div>
              </div>
            </div>
            {roleLoading === 'BABYSITTER' ? (
              <Loader2 size={18} className="animate-spin" color="var(--color-tertiary-dark)" />
            ) : (
              <ArrowRight size={16} color="var(--color-tertiary-dark)" />
            )}
          </button>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px' }}>
        Don't have an account?{' '}
        <button type="button" onClick={() => setTab('register')} style={{ background: 'none', border: 'none', color: 'var(--color-primary-dark)', fontWeight: '600', cursor: 'pointer' }}>
          Sign Up
        </button>
      </div>
    </form>
  );
}
