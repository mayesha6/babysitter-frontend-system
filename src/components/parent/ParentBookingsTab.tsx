'use client';

import React from 'react';
import { CreditCard } from 'lucide-react';

interface ParentBookingsTabProps {
  bookings: any[];
  setPaymentBooking: (booking: any) => void;
  setShowPaymentModal: (val: boolean) => void;
}

export default function ParentBookingsTab({ bookings, setPaymentBooking, setShowPaymentModal }: ParentBookingsTabProps) {
  return (
    <div className="card" style={{ padding: '24px' }}>
      <h3 style={{ fontSize: '20px', marginBottom: '16px', fontWeight: '600' }}>Hiring & Booking Records</h3>
      {bookings.length === 0 ? (
        <p style={{ color: 'var(--color-body)', fontSize: '14px' }}>No active or past bookings found.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {bookings.map((b) => (
            <div key={b._id} style={{ border: '1px solid var(--color-gray-border)', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: '600' }}>Babysitter: {b.sitter?.user?.name || b.sitter?.name || 'Assigned Sitter'}</h4>
                <p style={{ fontSize: '12px', color: 'var(--color-body)' }}>
                  Dates: {new Date(b.startDate).toLocaleDateString()} to {new Date(b.endDate).toLocaleDateString()} ({b.totalHours} hrs)
                </p>
                <p style={{ fontSize: '13px', fontWeight: '600', marginTop: '4px' }}>
                  Total Fee: ৳{b.totalAmount || b.hourlyRate * b.totalHours}
                </p>
              </div>
              <div>
                <span className={`badge ${b.paymentStatus === 'PAID' ? 'badge-verified' : 'badge-danger'}`} style={{ marginRight: '8px' }}>
                  {b.paymentStatus}
                </span>
                {b.paymentStatus !== 'PAID' && (
                  <button 
                    onClick={() => {
                      setPaymentBooking(b);
                      setShowPaymentModal(true);
                    }} 
                    className="btn btn-primary" 
                    style={{ padding: '6px 14px', fontSize: '12px', boxShadow: 'none' }}
                  >
                    <CreditCard size={14} /> Pay Now
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
