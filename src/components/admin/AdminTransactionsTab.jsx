'use client';

import React from 'react';

export default function AdminTransactionsTab({ transactions }) {
  return (
    <div className="card" style={{ padding: '24px' }}>
      <h3 style={{ fontSize: '20px', marginBottom: '16px', fontWeight: '600' }}>Completed Payments Log</h3>
      {transactions.length === 0 ? (
        <p style={{ color: 'var(--color-body)', fontSize: '14px', textAlign: 'center', padding: '20px' }}>No payments logged yet.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--color-gray-border)', color: 'var(--color-body)' }}>
                <th style={{ padding: '12px 8px', fontWeight: '600' }}>Hiring Parent</th>
                <th style={{ padding: '12px 8px', fontWeight: '600' }}>Babysitter</th>
                <th style={{ padding: '12px 8px', fontWeight: '600' }}>Tx amount</th>
                <th style={{ padding: '12px 8px', fontWeight: '600' }}>Admin Fee (10%)</th>
                <th style={{ padding: '12px 8px', fontWeight: '600' }}>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx._id} style={{ borderBottom: '1px solid var(--color-gray-border)' }}>
                  <td style={{ padding: '12px 8px' }}>{tx.parent?.name || 'Parent'}</td>
                  <td style={{ padding: '12px 8px' }}>{tx.sitter?.name || 'Sitter'}</td>
                  <td style={{ padding: '12px 8px', fontWeight: '600' }}>৳{tx.amount}</td>
                  <td style={{ padding: '12px 8px', color: 'var(--color-success)', fontWeight: '600' }}>৳{(tx.amount * 0.1).toFixed(2)}</td>
                  <td style={{ padding: '12px 8px', fontSize: '12px', color: 'var(--color-body)' }}>{new Date(tx.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
