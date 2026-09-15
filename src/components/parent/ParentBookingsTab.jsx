'use client';

import React from 'react';
import { FileText, CreditCard, Star, CheckCircle2 } from 'lucide-react';

export default function ParentBookingsTab({
  myBookings = [],
  setSelectedBooking,
  setIsPaymentOpen,
  reviewBookingId,
  setReviewBookingId,
  rating,
  setRating,
  comment,
  setComment,
  handleSubmitReview
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <FileText size={24} style={{ color: 'var(--color-primary-dark)' }} />
        <h3 style={{ fontSize: '22px', fontWeight: '700' }}>Hiring History & Invoices</h3>
      </div>

      {myBookings.length === 0 ? (
        <div className="card" style={{ padding: '60px', textAlign: 'center', color: 'var(--color-body)' }}>
          <p style={{ fontSize: '16px', marginBottom: '8px' }}>No booking contracts or invoices found.</p>
          <p style={{ fontSize: '14px' }}>Hire a babysitter directly from their profile page or accept applicants to create a contract!</p>
        </div>
      ) : (
        myBookings.map((b) => (
          <div key={b._id} className="card" style={{ padding: '28px' }}>
            
            {/* Header info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--color-gray-border)', paddingBottom: '16px', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h4 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--color-dark)' }}>
                  Babysitter: {b.sitter?.name || 'Vetted Sitter'}
                </h4>
                <p style={{ fontSize: '13px', color: 'var(--color-body)', marginTop: '4px' }}>
                  📅 Dates: {b.startDate} to {b.endDate} | ⏰ {b.startTime || '09:00 AM'} - {b.endTime || '05:00 PM'}
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                <span className={`badge ${b.status === 'ACCEPTED' || b.status === 'COMPLETED' ? 'badge-verified' : 'badge-pending'}`}>
                  Booking: {b.status}
                </span>
                <span className={`badge ${b.paymentStatus === 'PAID' ? 'badge-verified' : 'badge-pending'}`} style={{ fontSize: '11px' }}>
                  Payment: {b.paymentStatus || 'PENDING'}
                </span>
              </div>
            </div>

            {/* Footer action bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <span style={{ fontSize: '13px', color: 'var(--color-body)' }}>Total Contract Amount:</span>
                <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--color-dark)' }}>
                  ৳{b.totalAmount || b.hourlyRate * b.totalHours}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                {/* Stripe Card Payment Trigger */}
                {b.status === 'ACCEPTED' && b.paymentStatus !== 'PAID' && (
                  <button 
                    onClick={() => { setSelectedBooking(b); setIsPaymentOpen(true); }}
                    className="btn btn-primary" 
                    style={{ padding: '10px 24px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <CreditCard size={16} /> Pay Invoice via Stripe
                  </button>
                )}

                {/* Review Trigger */}
                {(b.status === 'COMPLETED' || b.status === 'ACCEPTED') && (
                  <button 
                    onClick={() => setReviewBookingId(b._id)}
                    className="btn btn-secondary" 
                    style={{ padding: '10px 20px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Star size={16} /> Rate & Review Sitter
                  </button>
                )}
              </div>
            </div>

            {/* Review Form Drawer */}
            {reviewBookingId === b._id && (
              <div 
                className="card" 
                style={{
                  marginTop: '24px',
                  background: 'var(--color-bg-light)',
                  border: '2px dashed var(--color-secondary)',
                  padding: '24px'
                }}
              >
                <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Star size={18} fill="var(--color-quaternary)" color="var(--color-quaternary)" /> Submit Babysitter Review
                </h4>

                <form onSubmit={handleSubmitReview}>
                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label className="form-label">Star Rating</label>
                    <select 
                      className="form-control"
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                    >
                      <option value="5">⭐⭐⭐⭐⭐ 5 Stars (Exceptional Service)</option>
                      <option value="4">⭐⭐⭐⭐ 4 Stars (Very Good)</option>
                      <option value="3">⭐⭐⭐ 3 Stars (Average)</option>
                      <option value="2">⭐⭐ 2 Stars (Needs Improvement)</option>
                      <option value="1">⭐ 1 Star (Poor)</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ marginBottom: '20px' }}>
                    <label className="form-label">Parent Review Comment</label>
                    <textarea 
                      rows="3" 
                      placeholder="Write about child care experience, punctuality, and communication..."
                      className="form-control"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      required
                    ></textarea>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button type="submit" className="btn btn-secondary" style={{ padding: '10px 20px', fontSize: '13px' }}>
                      Submit Feedback
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setReviewBookingId(null)} 
                      className="btn btn-outline" 
                      style={{ padding: '10px 20px', fontSize: '13px', border: '1.5px solid var(--color-secondary)' }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>
        ))
      )}
    </div>
  );
}
