'use client';

import React from 'react';

interface SitterEarningsTabProps {
  bookings: any[];
}

export default function SitterEarningsTab({ bookings }: SitterEarningsTabProps) {
  const grossTotal = bookings.reduce((sum, b) => sum + (b.totalAmount || (b.hourlyRate * b.totalHours)), 0);
  const platformCommission = (grossTotal * 0.1).toFixed(2);
  const netEarnings = (grossTotal * 0.9).toFixed(2);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="grid-3">
        <div className="card" style={{ textAlign: 'center' }}>
          <h4 style={{ color: 'var(--color-body)', fontSize: '13px', fontWeight: '600' }}>Gross Booking Volume</h4>
          <div style={{ fontSize: '28px', fontWeight: '600', margin: '8px 0', color: 'var(--color-dark)' }}>৳{grossTotal}</div>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <h4 style={{ color: 'var(--color-body)', fontSize: '13px', fontWeight: '600' }}>Platform Fee (10%)</h4>
          <div style={{ fontSize: '28px', fontWeight: '600', margin: '8px 0', color: 'var(--color-danger)' }}>৳{platformCommission}</div>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <h4 style={{ color: 'var(--color-body)', fontSize: '13px', fontWeight: '600' }}>Net Sitter Payout</h4>
          <div style={{ fontSize: '28px', fontWeight: '600', margin: '8px 0', color: 'var(--color-tertiary-dark)' }}>৳{netEarnings}</div>
        </div>
      </div>
    </div>
  );
}
