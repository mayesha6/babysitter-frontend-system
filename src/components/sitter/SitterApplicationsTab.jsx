'use client';

import React from 'react';
import { FileText, MapPin } from 'lucide-react';

export default function SitterApplicationsTab({ myApplications = [] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <FileText size={24} style={{ color: 'var(--color-primary-dark)' }} />
        <h3 style={{ fontSize: '22px', fontWeight: '600' }}>My Applied Jobs</h3>
      </div>

      {myApplications.length === 0 ? (
        <div className="card" style={{ padding: '60px', textAlign: 'center', color: 'var(--color-body)' }}>
          <p style={{ fontSize: '16px', marginBottom: '8px' }}>You haven't applied to any job postings yet.</p>
          <p style={{ fontSize: '14px' }}>Browse the Jobs Feed tab to view open parent childcare requests!</p>
        </div>
      ) : (
        myApplications.map((app, i) => (
          <div 
            key={i} 
            className="card" 
            style={{
              padding: '24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px'
            }}
          >
            <div>
              <h4 style={{ fontSize: '17px', fontWeight: '600', color: 'var(--color-dark)' }}>{app.title}</h4>
              <p style={{ fontSize: '13px', color: 'var(--color-body)', marginTop: '4px' }}>
                📍 Location: {app.location} | Hourly Budget: ৳{app.hourlyRate}/hr
              </p>
              {app.appliedAt && (
                <p style={{ fontSize: '12px', color: 'var(--color-body)', marginTop: '2px' }}>
                  Applied on: {new Date(app.appliedAt).toLocaleDateString()}
                </p>
              )}
            </div>

            <div>
              <span 
                className={`badge ${
                  app.status === 'ACCEPTED' ? 'badge-verified' : 
                  app.status === 'PENDING' ? 'badge-pending' : 'badge-danger'
                }`}
                style={{ padding: '8px 16px', fontSize: '12px', fontWeight: '600' }}
              >
                Application Status: {app.status}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
