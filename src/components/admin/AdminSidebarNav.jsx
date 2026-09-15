'use client';

import React from 'react';
import { Shield, Award, Users, FileText } from 'lucide-react';

export default function AdminSidebarNav({ user, pendingCount = 0, activeTab, setActiveTab, onClearMessages }) {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: <Shield size={18} /> },
    { id: 'verification', label: `Verification Requests (${pendingCount})`, icon: <Award size={18} /> },
    { id: 'users', label: 'User Management', icon: <Users size={18} /> },
    { id: 'transactions', label: 'Transactions Audit', icon: <FileText size={18} /> },
  ];

  const handleTabClick = (id) => {
    setActiveTab(id);
    if (onClearMessages) onClearMessages();
  };

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'A';

  return (
    <div className="sidebar-card">
      <div style={{ textAlign: 'center', marginBottom: '24px', borderBottom: '1px solid var(--color-gray-border)', paddingBottom: '20px' }}>
        <div style={{
          width: '68px',
          height: '68px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--color-secondary-dark) 0%, var(--color-dark) 100%)',
          color: 'white',
          fontSize: '26px',
          fontFamily: 'var(--font-header)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 12px auto',
          border: '3px solid var(--color-primary)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          {initial}
        </div>
        <h4 style={{ fontSize: '17px', fontWeight: '600', color: 'var(--color-dark)' }}>{user?.name || 'Administrator'}</h4>
        <span style={{ fontSize: '11px', color: 'var(--color-secondary-dark)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          🛡️ Platform Control Board
        </span>
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
