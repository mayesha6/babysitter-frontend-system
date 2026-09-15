'use client';

import React from 'react';
import { PlusCircle, CalendarCheck, ShieldCheck } from 'lucide-react';

interface ParentOverviewTabProps {
  user: any;
  profile: any;
  myJobs: any[];
  bookings: any[];
  setActiveTab: (tab: string) => void;
}

export default function ParentOverviewTab({ user, profile, myJobs, bookings, setActiveTab }: ParentOverviewTabProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* Welcome Banner */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(255, 162, 188, 0.2) 0%, rgba(185, 150, 254, 0.2) 100%)', border: 'none', padding: '28px' }}>
        <h2 style={{ fontSize: '26px', color: 'var(--color-dark)', marginBottom: '8px', fontWeight: '600' }}>
          Welcome back, {user?.name}! 👋
        </h2>
        <p style={{ color: 'var(--color-body)', fontSize: '15px' }}>
          Manage your job posts, review babysitter candidates, and track active bookings.
        </p>
      </div>

      {/* Overview Statistics Cards */}
      <div className="grid-3">
        <div className="card" style={{ textAlign: 'center' }}>
          <h4 style={{ color: 'var(--color-body)', fontSize: '13px', fontWeight: '600' }}>Active Job Posts</h4>
          <div style={{ fontSize: '32px', fontWeight: '600', margin: '8px 0', color: 'var(--color-primary-dark)' }}>
            {myJobs.length}
          </div>
          <button onClick={() => setActiveTab('my-jobs')} className="btn btn-outline" style={{ padding: '4px 12px', fontSize: '12px', width: '100%' }}>
            View Jobs
          </button>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <h4 style={{ color: 'var(--color-body)', fontSize: '13px', fontWeight: '600' }}>Total Bookings</h4>
          <div style={{ fontSize: '32px', fontWeight: '600', margin: '8px 0', color: 'var(--color-secondary-dark)' }}>
            {bookings.length}
          </div>
          <button onClick={() => setActiveTab('bookings')} className="btn btn-outline" style={{ padding: '4px 12px', fontSize: '12px', width: '100%' }}>
            View Bookings
          </button>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <h4 style={{ color: 'var(--color-body)', fontSize: '13px', fontWeight: '600' }}>Account Status</h4>
          <div style={{ fontSize: '18px', fontWeight: '600', margin: '14px 0', color: 'var(--color-tertiary-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <ShieldCheck size={20} /> Verified Parent
          </div>
          <button onClick={() => setActiveTab('settings')} className="btn btn-outline" style={{ padding: '4px 12px', fontSize: '12px', width: '100%' }}>
            Edit Profile
          </button>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '18px', marginBottom: '16px', fontWeight: '600' }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <button onClick={() => setActiveTab('post-job')} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <PlusCircle size={18} /> Post a New Childcare Job
          </button>
          <button onClick={() => setActiveTab('bookings')} className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <CalendarCheck size={18} /> Check Hiring Status
          </button>
        </div>
      </div>

    </div>
  );
}
