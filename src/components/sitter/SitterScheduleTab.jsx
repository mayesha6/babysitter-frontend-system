'use client';

import React from 'react';
import { Calendar, Check, X, CheckCircle2 } from 'lucide-react';

export default function SitterScheduleTab({ myBookings = [], handleUpdateBookingStatus }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Calendar size={24} style={{ color: 'var(--color-secondary-dark)' }} />
        <h3 style={{ fontSize: '22px', fontWeight: '600' }}>Booking Requests & Hiring Contracts</h3>
      </div>

      {myBookings.length === 0 ? (
        <div className="card" style={{ padding: '60px', textAlign: 'center', color: 'var(--color-body)' }}>
          <p style={{ fontSize: '16px', marginBottom: '8px' }}>No direct hiring contracts or requests found.</p>
          <p style={{ fontSize: '14px' }}>Parents can hire you directly from your profile or accept your job applications!</p>
        </div>
      ) : (
        myBookings.map((b) => (
          <div key={b._id} className="card" style={{ padding: '28px' }}>
            
            {/* Header Info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--color-gray-border)', paddingBottom: '14px', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h4 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--color-dark)' }}>
                  Parent: {b.parent?.name || 'Parent Client'}
                </h4>
                <p style={{ fontSize: '13px', color: 'var(--color-body)', marginTop: '4px' }}>
                  📅 Shift Dates: {b.startDate} to {b.endDate} | ⏰ {b.startTime || '09:00 AM'} - {b.endTime || '05:00 PM'}
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                <span className={`badge ${b.status === 'ACCEPTED' || b.status === 'COMPLETED' ? 'badge-verified' : 'badge-pending'}`} style={{ fontWeight: '600' }}>
                  Status: {b.status}
                </span>
                <span className={`badge ${b.paymentStatus === 'PAID' ? 'badge-verified' : 'badge-pending'}`} style={{ fontSize: '11px', fontWeight: '600' }}>
                  Payment: {b.paymentStatus || 'PENDING'}
                </span>
              </div>
            </div>

            {/* Salary Payout & Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <span style={{ fontSize: '13px', color: 'var(--color-body)' }}>Total Shift Payout:</span>
                <div style={{ fontSize: '24px', fontWeight: '600', color: 'var(--color-tertiary-dark)' }}>
                  ৳{b.totalAmount || b.hourlyRate * b.totalHours}
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                {/* Action for direct pending requests */}
                {b.status === 'PENDING' && (
                  <>
                    <button 
                      onClick={() => handleUpdateBookingStatus(b._id, 'ACCEPTED')}
                      className="btn btn-tertiary" 
                      style={{ padding: '8px 18px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Check size={16} /> Accept Request
                    </button>
                    <button 
                      onClick={() => handleUpdateBookingStatus(b._id, 'CANCELLED')}
                      className="btn btn-outline" 
                      style={{ padding: '8px 18px', fontSize: '13px', border: '1.5px solid var(--color-danger)', color: 'var(--color-danger)' }}
                    >
                      <X size={16} /> Decline
                    </button>
                  </>
                )}

                {/* Action to complete ongoing Accepted hiring */}
                {b.status === 'ACCEPTED' && (
                  <button 
                    onClick={() => handleUpdateBookingStatus(b._id, 'COMPLETED')}
                    className="btn btn-secondary" 
                    style={{ padding: '10px 22px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <CheckCircle2 size={16} /> Mark as Shift Completed
                  </button>
                )}
              </div>
            </div>

          </div>
        ))
      )}
    </div>
  );
}
