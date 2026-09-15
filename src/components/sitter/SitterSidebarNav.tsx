'use client';

import React from 'react';
import { User as UserIcon, Briefcase, FileCheck, Calendar, DollarSign, UploadCloud, ShieldCheck } from 'lucide-react';

interface SitterSidebarNavProps {
  user: any;
  profile: any;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function SitterSidebarNav({ user, profile, activeTab, setActiveTab }: SitterSidebarNavProps) {
  const isVerified = profile?.verificationStatus === 'VERIFIED';

  return (
    <div className="sidebar-card">
      <div style={{ textAlign: 'center', marginBottom: '24px', borderBottom: '1px solid var(--color-gray-border)', paddingBottom: '16px' }}>
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: 'var(--color-secondary-dark)',
          color: 'white',
          fontSize: '28px',
          fontFamily: 'var(--font-header)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 12px auto',
          border: '3px solid var(--color-secondary)'
        }}>
          {user?.name?.charAt(0) || 'S'}
        </div>
        <h4 style={{ fontSize: '18px', fontWeight: '600' }}>{user?.name}</h4>
        <p style={{ fontSize: '12px', color: 'var(--color-body)', marginTop: '2px' }}>{user?.email}</p>
        <div style={{ marginTop: '8px' }}>
          {isVerified ? (
            <span className="badge badge-verified" style={{ padding: '4px 10px', fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck size={12} /> Verified Sitter
            </span>
          ) : (
            <span className="badge badge-danger" style={{ padding: '4px 10px', fontSize: '11px' }}>
              Pending Verification
            </span>
          )}
        </div>
      </div>

      <ul className="sidebar-menu">
        <li className={`sidebar-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
          <UserIcon size={18} /> Overview
        </li>
        <li className={`sidebar-item ${activeTab === 'jobs' ? 'active' : ''}`} onClick={() => setActiveTab('jobs')}>
          <Briefcase size={18} /> Available Jobs
        </li>
        <li className={`sidebar-item ${activeTab === 'applications' ? 'active' : ''}`} onClick={() => setActiveTab('applications')}>
          <FileCheck size={18} /> My Applications
        </li>
        <li className={`sidebar-item ${activeTab === 'schedule' ? 'active' : ''}`} onClick={() => setActiveTab('schedule')}>
          <Calendar size={18} /> Schedule & Bookings
        </li>
        <li className={`sidebar-item ${activeTab === 'earnings' ? 'active' : ''}`} onClick={() => setActiveTab('earnings')}>
          <DollarSign size={18} /> Earnings & Commission
        </li>
        <li className={`sidebar-item ${activeTab === 'uploads' ? 'active' : ''}`} onClick={() => setActiveTab('uploads')}>
          <UploadCloud size={18} /> NID & Documents
        </li>
      </ul>
    </div>
  );
}
