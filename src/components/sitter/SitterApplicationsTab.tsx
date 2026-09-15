'use client';

import React from 'react';

interface SitterApplicationsTabProps {
  applications: any[];
}

export default function SitterApplicationsTab({ applications }: SitterApplicationsTabProps) {
  return (
    <div className="card" style={{ padding: '24px' }}>
      <h3 style={{ fontSize: '20px', marginBottom: '16px', fontWeight: '600' }}>Submitted Job Applications</h3>
      {applications.length === 0 ? (
        <p style={{ color: 'var(--color-body)', fontSize: '14px' }}>You haven't submitted any job applications yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {applications.map((app) => (
            <div key={app._id} style={{ border: '1px solid var(--color-gray-border)', borderRadius: '10px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: '600' }}>{app.jobPost?.title || 'Job Requirement'}</h4>
                <p style={{ fontSize: '12px', color: 'var(--color-body)' }}>Applied: {new Date(app.createdAt || Date.now()).toLocaleDateString()}</p>
              </div>
              <span className={`badge ${app.status === 'ACCEPTED' ? 'badge-verified' : app.status === 'REJECTED' ? 'badge-danger' : 'badge-warning'}`}>
                {app.status || 'PENDING'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
