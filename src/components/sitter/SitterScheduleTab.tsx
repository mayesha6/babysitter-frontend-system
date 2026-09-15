'use client';

import React from 'react';
import { Check, X } from 'lucide-react';

interface SitterScheduleTabProps {
  bookings: any[];
  handleBookingAction: (bookingId: string, status: string) => void;
}

export default function SitterScheduleTab({ bookings, handleBookingAction }: SitterScheduleTabProps) {
  return (
    <div className="card" style={{ padding: '24px' }}>
      <h3 style={{ fontSize: '20px', marginBottom: '16px', fontWeight: '600' }}>Schedule & Hiring Bookings</h3>
      {bookings.length === 0 ? (
        <p style={{ color: 'var(--color-body)', fontSize: '14px' }}>No active or past bookings recorded.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {bookings.map((b) => (
            <div key={b._id} style={{ border: '1px solid var(--color-gray-border)', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: '600' }}>Parent: {b.parent?.name || 'Hiring Parent'}</h4>
                <p style={{ fontSize: '12px', color: 'var(--color-body)' }}>
                  Dates: {new Date(b.startDate).toLocaleDateString()} to {new Date(b.endDate).toLocaleDateString()} ({b.totalHours} hrs)
                </p>
                <p style={{ fontSize: '13px', fontWeight: '600', marginTop: '4px' }}>Payout: ৳{b.totalAmount || b.hourlyRate * b.totalHours}</p>
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span className={`badge ${b.status === 'ACCEPTED' ? 'badge-verified' : b.status === 'REJECTED' ? 'badge-danger' : 'badge-warning'}`}>
                  {b.status}
                </span>

                {b.status === 'PENDING' && (
                  <>
                    <button 
                      onClick={() => handleBookingAction(b._id, 'ACCEPTED')} 
                      className="btn btn-tertiary" 
                      style={{ padding: '6px 12px', fontSize: '12px', boxShadow: 'none' }}
                    >
                      <Check size={14} /> Accept
                    </button>
                    <button 
                      onClick={() => handleBookingAction(b._id, 'REJECTED')} 
                      className="btn btn-primary" 
                      style={{ padding: '6px 12px', fontSize: '12px', boxShadow: 'none' }}
                    >
                      <X size={14} /> Decline
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
