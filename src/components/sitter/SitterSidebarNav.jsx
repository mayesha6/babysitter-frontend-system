'use client';

import React from 'react';
import { DollarSign, Briefcase, FileText, Calendar, User as UserIcon } from 'lucide-react';

export default function SitterSidebarNav({ user, profile, activeTab, setActiveTab, onClearMessages }) {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: <DollarSign size={18} /> },
    { id: 'jobs-feed', label: 'Browse Jobs Feed', icon: <Briefcase size={18} /> },
    { id: 'my-applications', label: 'My Applications', icon: <FileText size={18} /> },
    { id: 'schedule', label: 'Booking Requests', icon: <Calendar size={18} /> },
    { id: 'earnings', label: 'Payments History', icon: <DollarSign size={18} /> },
    { id: 'profile', label: 'Profile & Uploads', icon: <UserIcon size={18} /> },
  ];

  const handleTabClick = (id) => {
    setActiveTab(id);
    if (onClearMessages) onClearMessages();
  };

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'S';
  const verStatus = profile?.verificationStatus || 'PENDING';

  return (
    <div className="sidebar-card">
      <div style={{ textAlign: 'center', marginBottom: '24px', borderBottom: '1px solid var(--color-gray-border)', paddingBottom: '20px' }}>
        <div style={{
          width: '68px',
          height: '68px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--color-secondary) 0%, var(--color-tertiary-dark) 100%)',
          color: 'white',
          fontSize: '26px',
          fontFamily: 'var(--font-header)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 12px auto',
          border: '3px solid var(--color-white)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          {initial}
        </div>
        <h4 style={{ fontSize: '17px', fontWeight: '600', color: 'var(--color-dark)' }}>{user?.name || 'Babysitter'}</h4>
        <div style={{ marginTop: '6px' }}>
          <span className={`badge ${verStatus === 'VERIFIED' ? 'badge-verified' : verStatus === 'PENDING' ? 'badge-pending' : 'badge-danger'}`} style={{ fontSize: '11px', fontWeight: '600' }}>
            {verStatus === 'VERIFIED' ? '✓ VERIFIED SITTER' : `STATUS: ${verStatus}`}
          </span>
        </div>
      </div>

      <ul className="sidebar-menu" style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <li 
              key={item.id} 
              className={`sidebar-item ${isActive ? 'active' : ''}`} 
              onClick={() => handleTabClick(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                background: isActive ? 'var(--color-secondary)' : 'transparent',
                color: isActive ? 'white' : 'var(--color-dark)'
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
