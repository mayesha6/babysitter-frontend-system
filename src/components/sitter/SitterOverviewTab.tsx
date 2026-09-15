'use client';

import React from 'react';
import { Star, ShieldCheck, Briefcase } from 'lucide-react';

interface SitterOverviewTabProps {
  user: any;
  profile: any;
  applications: any[];
  bookings: any[];
  setActiveTab: (tab: string) => void;
}

export default function SitterOverviewTab({ user, profile, applications, bookings, setActiveTab }: SitterOverviewTabProps) {
  const isVerified = profile?.verificationStatus === 'VERIFIED';
  const totalEarnings = bookings.reduce((sum, b) => sum + (b.totalAmount || (b.hourlyRate * b.totalHours)), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* Welcome Banner */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(185, 150, 254, 0.2) 0%, rgba(109, 193, 160, 0.2) 100%)', border: 'none', padding: '28px' }}>
        <h2 style={{ fontSize: '26px', color: 'var(--color-dark)', marginBottom: '8px', fontWeight: '600' }}>
          Welcome back, {user?.name}! 👋
        </h2>
        <p style={{ color: 'var(--color-body)', fontSize: '15px' }}>
          {isVerified ? 'Your account is verified! You can apply for jobs and accept parent bookings.' : 'Complete your document verification to unlock full booking privileges.'}
        </p>
      </div>

      {/* Overview Statistics Cards */}
      <div className="grid-3">
        <div className="card" style={{ textAlign: 'center' }}>
          <h4 style={{ color: 'var(--color-body)', fontSize: '13px', fontWeight: '600' }}>My Applications</h4>
          <div style={{ fontSize: '32px', fontWeight: '600', margin: '8px 0', color: 'var(--color-secondary-dark)' }}>
            {applications.length}
          </div>
          <button onClick={() => setActiveTab('applications')} className="btn btn-outline" style={{ padding: '4px 12px', fontSize: '12px', width: '100%' }}>
            View History
          </button>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <h4 style={{ color: 'var(--color-body)', fontSize: '13px', fontWeight: '600' }}>Completed Jobs</h4>
          <div style={{ fontSize: '32px', fontWeight: '600', margin: '8px 0', color: 'var(--color-tertiary-dark)' }}>
            {bookings.length}
          </div>
          <button onClick={() => setActiveTab('schedule')} className="btn btn-outline" style={{ padding: '4px 12px', fontSize: '12px', width: '100%' }}>
            View Schedule
          </button>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <h4 style={{ color: 'var(--color-body)', fontSize: '13px', fontWeight: '600' }}>Total Earnings</h4>
          <div style={{ fontSize: '32px', fontWeight: '600', margin: '8px 0', color: 'var(--color-primary-dark)' }}>
            ৳{totalEarnings}
          </div>
          <button onClick={() => setActiveTab('earnings')} className="btn btn-outline" style={{ padding: '4px 12px', fontSize: '12px', width: '100%' }}>
            Earnings Audit
          </button>
        </div>
      </div>

      {/* Verification prompt callout */}
      {!isVerified && (
        <div className="card" style={{ padding: '24px', borderLeft: '4px solid var(--color-danger)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ fontSize: '16px', color: 'var(--color-danger)', fontWeight: '600' }}>NID Verification Required</h4>
              <p style={{ fontSize: '13px', color: 'var(--color-body)', marginTop: '4px' }}>
                Please upload your National ID & Police Clearance images for admin review.
              </p>
            </div>
            <button onClick={() => setActiveTab('uploads')} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '12px' }}>
              Upload Documents
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
