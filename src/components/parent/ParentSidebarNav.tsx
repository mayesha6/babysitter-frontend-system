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
      <div className="sidebar-user-header">
        <div 
          className="sidebar-user-avatar"
          style={{
            background: 'var(--color-primary-dark)',
            border: '3px solid var(--color-primary)'
          }}
        >
          {user?.name?.charAt(0) || 'P'}
        </div>
        <div>
          <h4 style={{ fontSize: '17px', fontWeight: '600' }}>{user?.name}</h4>
          <p style={{ fontSize: '12px', color: 'var(--color-body)', marginTop: '2px' }}>{user?.email}</p>
          <span className="badge badge-verified" style={{ marginTop: '6px', padding: '3px 8px', fontSize: '11px', display: 'inline-block' }}>
            Parent Account
          </span>
        </div>
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
