'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '../context/AppContext';
import { Bell, User as UserIcon, LogOut, Briefcase, Menu, X, Home, Search, MessageSquare, ChevronRight } from 'lucide-react';

export default function Header() {
  const { user, logout, unreadCount, notifications, markNotificationsRead } = useApp();
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close menus on page navigation
  useEffect(() => {
    setMobileMenuOpen(false);
    setShowNotifications(false);
    setShowProfileMenu(false);
  }, [pathname]);

  const handleNotificationsClick = () => {
    setShowNotifications(!showNotifications);
    setShowProfileMenu(false);
    setMobileMenuOpen(false);
    if (!showNotifications && unreadCount > 0) {
      markNotificationsRead();
    }
  };

  const handleProfileClick = () => {
    setShowProfileMenu(!showProfileMenu);
    setShowNotifications(false);
    setMobileMenuOpen(false);
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
      <header className="header-wrapper">
        <div className="container header-container">
          
          {/* Logo */}
          <Link href="/" className="logo-wrapper">
            <span className="logo-icon">🧸</span>
            <span className="logo-text">BabyCare</span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="nav-links nav-links-desktop">
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

          {/* Header Controls */}
          <div className="header-actions">
            {user ? (
              <>
                {/* Notifications Bell */}
                <div style={{ position: 'relative' }}>
                  <button 
                    onClick={handleNotificationsClick}
                    aria-label="View notifications"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', color: 'var(--color-dark)', display: 'flex', position: 'relative' }}
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
                        fontWeight: '600',
                        border: '2px solid white'
                      }}>
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {showNotifications && (
                    <div className="card notifications-dropdown" style={{
                      position: 'absolute',
                      top: '48px',
                      right: '0',
                      width: 'min(320px, calc(100vw - 32px))',
                      maxHeight: '380px',
                      overflowY: 'auto',
                      zIndex: 100,
                      padding: '16px',
                      border: '1px solid var(--color-gray-border)',
                      boxShadow: 'var(--shadow-lg)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid var(--color-gray-border)', paddingBottom: '8px' }}>
                        <h4 style={{ fontSize: '15px', fontWeight: '600' }}>Notifications</h4>
                        {unreadCount > 0 && (
                          <button onClick={markNotificationsRead} style={{ background: 'none', border: 'none', color: 'var(--color-secondary)', fontWeight: '600', fontSize: '12px', cursor: 'pointer' }}>
                            Mark all read
                          </button>
                        )}
                      </div>
                      {notifications.length === 0 ? (
                        <p style={{ textAlign: 'center', color: 'var(--color-body)', fontSize: '13px', padding: '16px 0' }}>No new notifications</p>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {notifications.slice(0, 15).map((n) => (
                            <div key={n._id} style={{
                              padding: '8px 10px',
                              borderRadius: '8px',
                              background: n.isRead ? 'none' : 'rgba(185, 150, 254, 0.08)',
                              fontSize: '13px',
                              borderLeft: n.isRead ? '3px solid transparent' : '3px solid var(--color-secondary)'
                            }}>
                              <div style={{ fontWeight: '600' }}>{n.title}</div>
                              <div style={{ color: 'var(--color-body)', fontSize: '12px', marginTop: '2px' }}>{n.message}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Profile Controls (Desktop) */}
                <div className="profile-btn-desktop" style={{ position: 'relative' }}>
                  <button 
                    onClick={handleProfileClick}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'none',
                      border: '1.5px solid var(--color-secondary)',
                      borderRadius: '30px',
                      padding: '6px 14px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '14px',
                      color: 'var(--color-dark)'
                    }}
                  >
                    <UserIcon size={16} />
                    <span>{user.name ? user.name.split(' ')[0] : 'User'}</span>
                  </button>

                  {/* Profile Dropdown */}
                  {showProfileMenu && (
                    <div className="card" style={{
                      position: 'absolute',
                      top: '48px',
                      right: '0',
                      width: '210px',
                      zIndex: 100,
                      padding: '12px',
                      border: '1px solid var(--color-gray-border)',
                      boxShadow: 'var(--shadow-lg)'
                    }}>
                      <div style={{ fontSize: '13px', paddingBottom: '8px', borderBottom: '1px solid var(--color-gray-border)', marginBottom: '8px' }}>
                        <div style={{ fontWeight: '600' }}>{user.name}</div>
                        <div style={{ color: 'var(--color-body)', fontSize: '11px' }}>{user.role}</div>
                      </div>
                      <Link href={getDashboardLink()} onClick={() => setShowProfileMenu(false)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', fontSize: '14px', fontWeight: '500', borderRadius: '6px' }}>
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
              <div className="auth-btns-desktop">
                <Link href="/auth?tab=login" className="btn btn-outline" style={{ padding: '8px 18px', fontSize: '14px' }}>
                  Log In
                </Link>
                <Link href="/auth?tab=register" className="btn btn-primary" style={{ padding: '8px 18px', fontSize: '14px', boxShadow: 'none' }}>
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
                setShowNotifications(false);
                setShowProfileMenu(false);
              }}
              className="mobile-menu-btn"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="mobile-nav-drawer">
            {user && (
              <div className="mobile-user-card">
                <div className="mobile-user-avatar">
                  {user.name ? user.name.charAt(0) : 'U'}
                </div>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '15px' }}>{user.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-body)' }}>{user.email}</div>
                  <span className="badge badge-verified" style={{ fontSize: '10px', marginTop: '4px', display: 'inline-block' }}>
                    {user.role}
                  </span>
                </div>
              </div>
            )}

            <div className="mobile-nav-items">
              <Link href="/" className={`mobile-nav-link ${pathname === '/' ? 'active' : ''}`}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Home size={18} />
                  <span>Home</span>
                </div>
                <ChevronRight size={16} opacity={0.6} />
              </Link>

              <Link href="/search" className={`mobile-nav-link ${pathname === '/search' ? 'active' : ''}`}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Search size={18} />
                  <span>Find Babysitters</span>
                </div>
                <ChevronRight size={16} opacity={0.6} />
              </Link>

              {user ? (
                <>
                  <Link href={getDashboardLink()} className={`mobile-nav-link ${pathname.includes('dashboard') ? 'active' : ''}`}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Briefcase size={18} />
                      <span>Dashboard</span>
                    </div>
                    <ChevronRight size={16} opacity={0.6} />
                  </Link>

                  <Link href="/chat" className={`mobile-nav-link ${pathname === '/chat' ? 'active' : ''}`}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <MessageSquare size={18} />
                      <span>Inbox Messages</span>
                    </div>
                    <ChevronRight size={16} opacity={0.6} />
                  </Link>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="mobile-nav-link"
                    style={{ width: '100%', border: 'none', background: 'none', color: 'var(--color-danger)', cursor: 'pointer', textAlign: 'left', marginTop: '8px' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <LogOut size={18} />
                      <span>Log Out</span>
                    </div>
                  </button>
                </>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px' }}>
                  <Link href="/auth?tab=login" className="btn btn-outline" style={{ width: '100%' }}>
                    Log In
                  </Link>
                  <Link href="/auth?tab=register" className="btn btn-primary" style={{ width: '100%' }}>
                    Create Account
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
