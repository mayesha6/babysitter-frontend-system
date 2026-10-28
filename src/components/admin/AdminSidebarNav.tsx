'use client';

import React from 'react';
import { Shield, Award, Users, FileText } from 'lucide-react';

interface AdminSidebarNavProps {
  user: any;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  pendingCount: number;
}

export default function AdminSidebarNav({ user, activeTab, setActiveTab, pendingCount }: AdminSidebarNavProps) {
  return (
    <div className="sidebar-card">
      <div className="sidebar-user-header">
        <div 
          className="sidebar-user-avatar"
          style={{
            background: 'var(--color-secondary-dark)',
            border: '3px solid var(--color-primary)'
          }}
        >
          {user?.name?.charAt(0) || 'A'}
        </div>
        <div>
          <h4 style={{ fontSize: '16px', fontWeight: '600' }}>{user?.name}</h4>
          <span style={{ fontSize: '11px', color: 'var(--color-body)', fontWeight: '600', textTransform: 'uppercase' }}>Administrator</span>
        </div>
      </div>

      <ul className="sidebar-menu">
        <li className={`sidebar-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
          <Shield size={18} /> Overview
        </li>
        <li className={`sidebar-item ${activeTab === 'verification' ? 'active' : ''}`} onClick={() => setActiveTab('verification')}>
          <Award size={18} /> Verification Requests ({pendingCount})
        </li>
        <li className={`sidebar-item ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
          <Users size={18} /> User Management
        </li>
        <li className={`sidebar-item ${activeTab === 'transactions' ? 'active' : ''}`} onClick={() => setActiveTab('transactions')}>
          <FileText size={18} /> Transactions Audit
        </li>
      </ul>
    </div>
  );
}
