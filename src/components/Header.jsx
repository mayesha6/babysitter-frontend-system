'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '../context/AppContext';
import { Bell, MessageSquare, User as UserIcon, LogOut, Shield, Briefcase, Search, Menu, X } from 'lucide-react';

export default function Header() {
  const { user, logout, unreadCount, notifications, markNotificationsRead, switchRole } = useApp();
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleNotificationsClick = () => {
    setShowNotifications(!showNotifications);
    setShowProfileMenu(false);
    if (!showNotifications && unreadCount > 0) {
      markNotificationsRead();
    }
  };

  const handleProfileClick = () => {
    setShowProfileMenu(!showProfileMenu);
    setShowNotifications(false);
  };

  const getDashboardLink = () => {
    if (!user) return '/auth';
    if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN') return '/admin-dashboard';
    if (user.role === 'PARENT') return '/parent-dashboard';
    if (user.role === 'BABYSITTER') return '/sitter-dashboard';
    return '/';
  };

  return (
    <>
      {/* Role Switcher Debug Panel */}
      <div className="debug-bar">
        <span>🔧 Developer Sandbox | Quick Role Switcher:</span>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button className="debug-role-select" onClick={() => switchRole('SUPER_ADMIN')}>Admin</button>
          <button className="debug-role-select" onClick={() => switchRole('PARENT')}>Parent</button>
          <button className="debug-role-select" onClick={() => switchRole('BABYSITTER')}>Sitter</button>
        </div>
      </div>

      <header className="header-wrapper">
        <div className="container header-container">
          {/* Logo */}
          <Link href="/" className="logo-wrapper">
            <span className="logo-icon">🧸</span>
            <span>BebiCare</span>
          </Link>

          {/* Navigation Links (Desktop) */}
          <nav className="nav-links" style={{ display: typeof window !== 'undefined' && window.innerWidth < 768 ? 'none' : 'flex' }}>
            <Link href="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`}>
              Home
            </Link>
            <Link href="/search" className={`nav-link ${pathname === '/search' ? 'active' : ''}`}>
              Find Babysitters
            </Link>
            {user && (
              <>
                <Link href={getDashboardLink()} className={`nav-link ${pathname.includes('dashboard') ? 'active' : ''}`}>
                  Dashboard
                </Link>
                <Link href="/chat" className={`nav-link ${pathname === '/chat' ? 'active' : ''}`}>
                  Inbox
                </Link>
              </>
            )}
          </nav>

          {/* Header Controls (Desktop) */}
          <div className="header-actions">
            {user ? (
              <>
                {/* Notifications Bell */}
                <div style={{ position: 'relative' }}>
                  <button 
                    onClick={handleNotificationsClick}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', color: 'var(--color-dark)', display: 'flex' }}
                  >
                    <Bell size={22} />
                    {unreadCount > 0 && (
                      <span style={{
                        position: 'absolute',
                        top: '2px',
                        right: '2px',
                        background: 'var(--color-primary)',
                        color: 'white',
                        borderRadius: '50%',
                        fontSize: '10px',
                        width: '18px',
                        height: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        border: '2px solid white'
                      }}>
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {showNotifications && (
                    <div className="card" style={{
                      position: 'absolute',
                      top: '50px',
                      right: '0',
                      width: '320px',
                      maxHeight: '400px',
                      overflowY: 'auto',
                      zIndex: 10,
                      padding: '16px',
                      border: '3px solid var(--color-dark)',
                      boxShadow: '0 8px 0 var(--color-dark)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', borderBottom: '1px solid var(--color-gray-border)', paddingBottom: '8px' }}>
                        <h4 style={{ fontSize: '16px' }}>Notifications</h4>
                        {unreadCount > 0 && (
                          <button onClick={markNotificationsRead} style={{ background: 'none', border: 'none', color: 'var(--color-secondary)', fontWeight: '600', fontSize: '12px', cursor: 'pointer' }}>
                            Mark read
                          </button>
                        )}
                      </div>
                      {notifications.length === 0 ? (
                        <p style={{ textAlign: 'center', color: 'var(--color-body)', fontSize: '13px', padding: '12px 0' }}>No new notifications</p>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {notifications.map((n) => (
                            <div key={n._id} style={{
                              padding: '8px 10px',
                              borderRadius: '8px',
                              background: n.isRead ? 'none' : 'rgba(185, 150, 254, 0.08)',
                              fontSize: '13px',
                              borderLeft: n.isRead ? '3px solid transparent' : '3px solid var(--color-secondary)'
                            }}>
                              <div style={{ fontWeight: '600' }}>{n.title}</div>
                              <div style={{ color: 'var(--color-body)', fontSize: '12px' }}>{n.message}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Profile Controls */}
                <div style={{ position: 'relative' }}>
                  <button 
                    onClick={handleProfileClick}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'none',
                      border: '3px solid var(--color-dark)',
                      borderRadius: '30px',
                      padding: '6px 14px',
                      cursor: 'pointer',
                      fontWeight: '700',
                      fontSize: '14px',
                      color: 'var(--color-dark)'
                    }}
                  >
                    <UserIcon size={16} />
                    <span>{user.name.split(' ')[0]}</span>
                  </button>

                  {/* Profile Dropdown */}
                  {showProfileMenu && (
                    <div className="card" style={{
                      position: 'absolute',
                      top: '50px',
                      right: '0',
                      width: '200px',
                      zIndex: 10,
                      padding: '12px',
                      border: '3px solid var(--color-dark)',
                      boxShadow: '0 8px 0 var(--color-dark)'
                    }}>
                      <div style={{ fontSize: '13px', paddingBottom: '8px', borderBottom: '1px solid var(--color-gray-border)', marginBottom: '8px' }}>
                        <div style={{ fontWeight: '700' }}>{user.name}</div>
                        <div style={{ color: 'var(--color-body)', fontSize: '11px' }}>{user.role}</div>
                      </div>
                      <Link href={getDashboardLink()} onClick={() => setShowProfileMenu(false)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', fontSize: '14px', fontWeight: '500' }}>
                        <Briefcase size={16} />
                        <span>My Dashboard</span>
                      </Link>
                      <button 
                        onClick={() => { setShowProfileMenu(false); logout(); }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px',
                          fontSize: '14px',
                          fontWeight: '500',
                          border: 'none',
                          background: 'none',
                          color: 'var(--color-danger)',
                          cursor: 'pointer'
                        }}
                      >
                        <LogOut size={16} />
                        <span>Log Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/auth?tab=login" className="btn btn-outline" style={{ padding: '8px 20px' }}>
                  Log In
                </Link>
                <Link href="/auth?tab=register" className="btn btn-primary" style={{ padding: '8px 20px', boxShadow: 'none' }}>
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
