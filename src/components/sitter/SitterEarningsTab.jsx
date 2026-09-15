'use client';

import React from 'react';
import { DollarSign } from 'lucide-react';

export default function SitterEarningsTab({ earningsHistory = [] }) {
  const totalEarnings = earningsHistory.reduce((sum, b) => sum + (b.totalAmount || b.hourlyRate * b.totalHours || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <DollarSign size={24} style={{ color: 'var(--color-tertiary-dark)' }} />
        <h3 style={{ fontSize: '22px', fontWeight: '600' }}>Earnings & Payouts Ledger</h3>
      </div>

      {/* Summary Total Card */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(109,193,160,0.15) 0%, rgba(255,255,255,1) 100%)', padding: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '14px', color: 'var(--color-body)', fontWeight: '600' }}>Total Received Payouts:</span>
          <div style={{ fontSize: '36px', fontWeight: '600', color: 'var(--color-tertiary-dark)', marginTop: '4px' }}>
            ৳{totalEarnings}
          </div>
        </div>
        <span className="badge badge-verified" style={{ padding: '8px 18px', fontSize: '13px', fontWeight: '600' }}>
          ✓ Verified Payouts Active
        </span>
      </div>

      {/* History Table Card */}
      <div className="card" style={{ padding: '28px' }}>
        <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>Completed Shift Transactions</h4>
        
        {earningsHistory.length === 0 ? (
          <p style={{ color: 'var(--color-body)', fontSize: '14px', textAlign: 'center', padding: '30px 0' }}>
            No payments received yet. Once parents complete Stripe invoice payments, earnings will appear here!
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-gray-border)', color: 'var(--color-body)' }}>
                  <th style={{ padding: '12px 10px', fontWeight: '600' }}>Client Parent</th>
                  <th style={{ padding: '12px 10px', fontWeight: '600' }}>Shift End Date</th>
                  <th style={{ padding: '12px 10px', fontWeight: '600' }}>Amount Received</th>
                  <th style={{ padding: '12px 10px', fontWeight: '600' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {earningsHistory.map((earn) => (
                  <tr key={earn._id} style={{ borderBottom: '1px solid var(--color-gray-border)' }}>
                    <td style={{ padding: '14px 10px', fontWeight: '600', color: 'var(--color-dark)' }}>
                      {earn.parent?.name || 'Parent Client'}
                    </td>
                    <td style={{ padding: '14px 10px', color: 'var(--color-body)' }}>
                      {earn.endDate}
                    </td>
                    <td style={{ padding: '14px 10px', color: 'var(--color-success)', fontWeight: '600' }}>
                      +৳{earn.totalAmount || earn.hourlyRate * earn.totalHours}
                    </td>
                    <td style={{ padding: '14px 10px' }}>
                      <span className="badge badge-verified" style={{ fontWeight: '600' }}>Paid</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
