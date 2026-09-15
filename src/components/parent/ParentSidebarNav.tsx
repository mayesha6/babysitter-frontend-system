'use client';

import React from 'react';
import { User as UserIcon, PlusCircle, Briefcase, CalendarCheck, Settings } from 'lucide-react';

interface ParentSidebarNavProps {
  user: any;
  profile: any;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function ParentSidebarNav({ user, profile, activeTab, setActiveTab }: ParentSidebarNavProps) {
  return (
    <div className="sidebar-card">
      <div style={{ textAlign: 'center', marginBottom: '24px', borderBottom: '1px solid var(--color-gray-border)', paddingBottom: '16px' }}>
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: 'var(--color-primary-dark)',
          color: 'white',
          fontSize: '28px',
          fontFamily: 'var(--font-header)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 12px auto',
          border: '3px solid var(--color-primary)'
        }}>
          {user?.name?.charAt(0) || 'P'}
        </div>
        <h4 style={{ fontSize: '18px', fontWeight: '600' }}>{user?.name}</h4>
        <p style={{ fontSize: '12px', color: 'var(--color-body)', marginTop: '2px' }}>{user?.email}</p>
        <span className="badge badge-verified" style={{ marginTop: '8px', padding: '4px 10px', fontSize: '11px' }}>
          Parent Account
        </span>
      </div>

      <ul className="sidebar-menu">
        <li className={`sidebar-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
          <UserIcon size={18} /> Profile Overview
        </li>
        <li className={`sidebar-item ${activeTab === 'post-job' ? 'active' : ''}`} onClick={() => setActiveTab('post-job')}>
          <PlusCircle size={18} /> Post a Job
        </li>
        <li className={`sidebar-item ${activeTab === 'my-jobs' ? 'active' : ''}`} onClick={() => setActiveTab('my-jobs')}>
          <Briefcase size={18} /> My Job Posts & Candidates
        </li>
        <li className={`sidebar-item ${activeTab === 'bookings' ? 'active' : ''}`} onClick={() => setActiveTab('bookings')}>
          <CalendarCheck size={18} /> Bookings & Payments
        </li>
        <li className={`sidebar-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
          <Settings size={18} /> Profile Settings
        </li>
      </ul>
    </div>
  );
}
