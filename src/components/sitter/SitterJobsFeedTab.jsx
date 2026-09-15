'use client';

import React from 'react';
import { Briefcase, Lock, CheckCircle } from 'lucide-react';

export default function SitterJobsFeedTab({ availableJobs = [], verStatus = 'PENDING', handleApply }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Briefcase size={24} style={{ color: 'var(--color-secondary-dark)' }} />
        <h3 style={{ fontSize: '22px', fontWeight: '600' }}>Available Childcare Jobs Feed</h3>
      </div>
      
      {/* Verification status lock alert */}
      {verStatus !== 'VERIFIED' && (
        <div style={{
          background: 'rgba(255, 110, 110, 0.1)',
          border: '1px solid var(--color-danger)',
          color: 'var(--color-danger)',
          padding: '14px 18px',
          borderRadius: 'var(--radius-sm)',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <Lock size={18} />
          <span>Job Application access is currently locked. Submit your NID and police clearance documents to get approved by admin.</span>
        </div>
      )}

      {availableJobs.length === 0 ? (
        <div className="card" style={{ padding: '60px', textAlign: 'center', color: 'var(--color-body)' }}>
          <p style={{ fontSize: '16px', marginBottom: '8px' }}>No active childcare jobs posted by parents right now.</p>
          <p style={{ fontSize: '14px' }}>Check back soon as parents frequently post new nanny listings!</p>
        </div>
      ) : (
        availableJobs.map((job) => (
          <div key={job._id} className="card" style={{ padding: '28px' }}>
            
            {/* Header info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid var(--color-gray-border)', paddingBottom: '14px', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h4 style={{ fontSize: '19px', fontWeight: '600', color: 'var(--color-dark)' }}>{job.title}</h4>
                <p style={{ fontSize: '13px', color: 'var(--color-body)', marginTop: '4px' }}>
                  📍 Location: {job.location} | 📅 Dates: {job.startDate || 'Immediate'} to {job.endDate || 'Flexible'}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '12px', color: 'var(--color-body)', fontWeight: '600' }}>Hourly Rate</span>
                <div style={{ fontSize: '22px', fontWeight: '600', color: 'var(--color-secondary-dark)' }}>
                  ৳{job.hourlyRate}/hr
                </div>
              </div>
            </div>

            {/* Description */}
            <p style={{ color: 'var(--color-dark)', fontSize: '14px', lineHeight: '1.7', marginBottom: '20px' }}>
              {job.description}
            </p>

            {/* Footer Tag & Apply Action */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <span className="badge badge-pending" style={{ textTransform: 'uppercase', padding: '6px 14px', fontWeight: '600' }}>
                Job Type: {job.jobType}
              </span>

              <button 
                disabled={verStatus !== 'VERIFIED'}
                onClick={() => handleApply(job._id)}
                className="btn btn-secondary" 
                style={{
                  padding: '10px 28px',
                  fontSize: '14px',
                  opacity: verStatus !== 'VERIFIED' ? 0.6 : 1,
                  cursor: verStatus !== 'VERIFIED' ? 'not-allowed' : 'pointer'
                }}
              >
                {verStatus !== 'VERIFIED' ? 'Verification Locked' : 'Apply to Job'}
              </button>
            </div>

          </div>
        ))
      )}
    </div>
  );
}
