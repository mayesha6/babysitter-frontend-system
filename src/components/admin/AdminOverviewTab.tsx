'use client';

import React from 'react';

interface AdminOverviewTabProps {
  stats: {
    totalUsers: number;
    parents: number;
    sitters: number;
    verifiedSitters: number;
  };
  transactions: any[];
}

export default function AdminOverviewTab({ stats, transactions }: AdminOverviewTabProps) {
  const totalVolume = transactions.reduce((sum, tx) => sum + (tx.amount || 0), 0);
  const platformRevenue = (totalVolume * 0.1).toFixed(2);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      {/* Summary Counters */}
      <div className="grid-4">
        <div className="card" style={{ textAlign: 'center' }}>
          <h4 style={{ color: 'var(--color-body)', fontSize: '13px', fontWeight: '600' }}>Total Accounts</h4>
          <div style={{ fontSize: '32px', fontWeight: '600', margin: '8px 0' }}>{stats.totalUsers}</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <h4 style={{ color: 'var(--color-primary-dark)', fontSize: '13px', fontWeight: '600' }}>Parents</h4>
          <div style={{ fontSize: '32px', fontWeight: '600', margin: '8px 0' }}>{stats.parents}</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <h4 style={{ color: 'var(--color-secondary-dark)', fontSize: '13px', fontWeight: '600' }}>Babysitters</h4>
          <div style={{ fontSize: '32px', fontWeight: '600', margin: '8px 0' }}>{stats.sitters}</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <h4 style={{ color: 'var(--color-tertiary-dark)', fontSize: '13px', fontWeight: '600' }}>Verified Sitters</h4>
          <div style={{ fontSize: '32px', fontWeight: '600', margin: '8px 0' }}>{stats.verifiedSitters}</div>
        </div>
      </div>

      {/* Commission audit summaries */}
      <div className="card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '20px', marginBottom: '16px', fontWeight: '600' }}>Commission Metrics</h3>
        <p style={{ color: 'var(--color-body)', fontSize: '14px', marginBottom: '20px' }}>
          Audit log of completed transactions and estimated commission payout amounts.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ background: 'var(--color-bg-light)', border: '2px solid var(--color-gray-border)', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '13px', color: 'var(--color-body)', fontWeight: '600' }}>Estimated Volume processed</div>
            <div style={{ fontSize: '28px', fontWeight: '600', color: 'var(--color-dark)', marginTop: '6px' }}>
              ৳{totalVolume}
            </div>
          </div>
          <div style={{ background: 'var(--color-bg-light)', border: '2px solid var(--color-gray-border)', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '13px', color: 'var(--color-body)', fontWeight: '600' }}>Est. Platform Revenue (10% fee)</div>
            <div style={{ fontSize: '28px', fontWeight: '600', color: 'var(--color-success)', marginTop: '6px' }}>
              ৳{platformRevenue}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
