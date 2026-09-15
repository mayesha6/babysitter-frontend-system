'use client';

import React from 'react';

export default function AdminUsersTab({ usersList, handleToggleBlockUser }) {
  return (
    <div className="card" style={{ padding: '24px' }}>
      <h3 style={{ fontSize: '20px', marginBottom: '16px', fontWeight: '600' }}>Registered Accounts</h3>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--color-gray-border)', color: 'var(--color-body)' }}>
              <th style={{ padding: '12px 8px', fontWeight: '600' }}>User Details</th>
              <th style={{ padding: '12px 8px', fontWeight: '600' }}>Role</th>
              <th style={{ padding: '12px 8px', fontWeight: '600' }}>Status</th>
              <th style={{ padding: '12px 8px', fontWeight: '600' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {usersList.map((usr) => (
              <tr key={usr._id} style={{ borderBottom: '1px solid var(--color-gray-border)' }}>
                <td style={{ padding: '12px 8px' }}>
                  <div style={{ fontWeight: '600' }}>{usr.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-body)' }}>{usr.email}</div>
                </td>
                <td style={{ padding: '12px 8px', textTransform: 'uppercase', fontSize: '12px' }}>{usr.role}</td>
                <td style={{ padding: '12px 8px' }}>
                  <span className={`badge ${usr.status === 'ACTIVE' ? 'badge-verified' : 'badge-danger'}`}>
                    {usr.status}
                  </span>
                </td>
                <td style={{ padding: '12px 8px' }}>
                  {usr.role !== 'SUPER_ADMIN' && (
                    <button 
                      onClick={() => handleToggleBlockUser(usr._id, usr.status)}
                      className={`btn ${usr.status === 'ACTIVE' ? 'btn-primary' : 'btn-tertiary'}`}
                      style={{ padding: '6px 14px', fontSize: '11px', boxShadow: 'none' }}
                    >
                      {usr.status === 'ACTIVE' ? 'Block Account' : 'Unblock'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
