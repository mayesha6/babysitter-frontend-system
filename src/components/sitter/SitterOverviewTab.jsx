'use client';

import React from 'react';
import { DollarSign, Calendar, ShieldCheck, FileCheck, ArrowRight } from 'lucide-react';

export default function SitterOverviewTab({ myBookings = [], earningsHistory = [], verStatus = 'PENDING', setActiveTab }) {
  
  const totalEarnings = earningsHistory.reduce((sum, b) => sum + (b.totalAmount || b.hourlyRate * b.totalHours || 0), 0);
  const pendingRequestsCount = myBookings.filter(b => b.status === 'PENDING').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* Summary Cards Grid */}
      <div className="grid-3">
        {/* Card 1: Total Earnings */}
        <div 
          className="card" 
          style={{
            background: 'linear-gradient(135deg, rgba(109,193,160,0.12) 0%, rgba(255,255,255,1) 100%)',
            textAlign: 'center',
            padding: '28px 20px',
            border: '1px solid var(--color-gray-border)'
          }}
        >
          <div style={{ color: 'var(--color-tertiary-dark)', display: 'inline-flex', marginBottom: '8px' }}>
            <DollarSign size={28} />
          </div>
          <h4 style={{ color: 'var(--color-dark)', fontSize: '15px', fontWeight: '600' }}>Total Earnings</h4>
          <div style={{ fontSize: '38px', fontWeight: '600', margin: '8px 0', color: 'var(--color-dark)' }}>
            ৳{totalEarnings}
          </div>
          <button 
            onClick={() => setActiveTab('earnings')} 
            className="btn btn-outline" 
            style={{ padding: '6px 16px', fontSize: '12px', boxShadow: 'none', borderColor: 'var(--color-tertiary)' }}
          >
            View Payouts
          </button>
        </div>

        {/* Card 2: Direct Bookings */}
        <div 
          className="card" 
          style={{
            background: 'linear-gradient(135deg, rgba(185,150,254,0.12) 0%, rgba(255,255,255,1) 100%)',
            textAlign: 'center',
            padding: '28px 20px',
            border: '1px solid var(--color-gray-border)'
          }}
        >
          <div style={{ color: 'var(--color-secondary-dark)', display: 'inline-flex', marginBottom: '8px' }}>
            <Calendar size={28} />
          </div>
          <h4 style={{ color: 'var(--color-dark)', fontSize: '15px', fontWeight: '600' }}>Pending Hire Requests</h4>
          <div style={{ fontSize: '38px', fontWeight: '600', margin: '8px 0', color: 'var(--color-dark)' }}>
            {pendingRequestsCount}
          </div>
          <button 
            onClick={() => setActiveTab('schedule')} 
            className="btn btn-outline" 
            style={{ padding: '6px 16px', fontSize: '12px', boxShadow: 'none', borderColor: 'var(--color-secondary)' }}
          >
            View Requests
          </button>
        </div>

        {/* Card 3: Verification Status */}
        <div 
          className="card" 
          style={{
            background: 'linear-gradient(135deg, rgba(255,162,188,0.12) 0%, rgba(255,255,255,1) 100%)',
            textAlign: 'center',
            padding: '28px 20px',
            border: '1px solid var(--color-gray-border)'
          }}
        >
          <div style={{ color: 'var(--color-primary-dark)', display: 'inline-flex', marginBottom: '8px' }}>
            <ShieldCheck size={28} />
          </div>
          <h4 style={{ color: 'var(--color-dark)', fontSize: '15px', fontWeight: '600' }}>Platform Verification</h4>
          <div style={{ margin: '14px 0 10px 0' }}>
            <span className={`badge ${verStatus === 'VERIFIED' ? 'badge-verified' : verStatus === 'PENDING' ? 'badge-pending' : 'badge-danger'}`} style={{ padding: '6px 16px', fontSize: '12px', fontWeight: '600' }}>
              Status: {verStatus}
            </span>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--color-body)', marginTop: '4px' }}>
            {verStatus === 'VERIFIED' ? 'Approved for all job feeds' : 'Upload NID & certificates'}
          </p>
        </div>
      </div>

      {/* Verification Reminder Banner if not verified */}
      {verStatus !== 'VERIFIED' && (
        <div 
          className="card" 
          style={{
            display: 'flex',
            gap: '20px',
            background: 'rgba(255, 193, 71, 0.08)',
            border: '2px dashed var(--color-quaternary)',
            alignItems: 'center',
            padding: '28px'
          }}
        >
          <div style={{ background: 'rgba(255, 193, 71, 0.2)', padding: '16px', borderRadius: '50%', color: 'var(--color-quaternary)' }}>
            <FileCheck size={32} />
          </div>
          <div>
            <h4 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--color-dark)' }}>Submit Document Verification</h4>
            <p style={{ color: 'var(--color-body)', fontSize: '14px', marginTop: '4px', lineHeight: '1.6' }}>
              To apply for parent job posts, you must submit your NID number, front/back card photos, a selfie image, and police clearance certificate in your settings profile for admin review.
            </p>
            <button 
              onClick={() => setActiveTab('profile')} 
              className="btn btn-secondary" 
              style={{ padding: '8px 20px', fontSize: '13px', marginTop: '14px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              Upload Documents <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
