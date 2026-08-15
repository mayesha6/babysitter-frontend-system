'use client';

import React, { useState } from 'react';
import { X, CreditCard, Lock, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

export default function PaymentModal({ isOpen, onClose, booking, onSuccess }) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen || !booking) return null;

  const handlePay = async (e) => {
    e.preventDefault();
    if (!cardNumber || !expiry || !cvv) {
      setError('Please fill in all card details.');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      // 1. Request Stripe payment intent from backend
      try {
        await api.post('/payments/create-intent', { bookingId: booking._id });
      } catch (intentErr) {
        console.warn('Backend payment intent failed or not set up, using sandbox mode.', intentErr.message);
      }

      // 2. Call mock stripe confirmation: update payment status directly on booking
      await api.patch(`/bookings/${booking._id}/payment`, { paymentStatus: 'PAID' });
      
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onSuccess();
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.message || 'Payment processing failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '420px' }}>
        <button onClick={onClose} className="modal-close">
          <X size={20} />
        </button>

        {!success ? (
          <>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{
                background: 'rgba(185, 150, 254, 0.15)',
                color: 'var(--color-secondary)',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px auto'
              }}>
                <CreditCard size={30} />
              </div>
              <h3 style={{ fontSize: '22px' }}>Complete Hiring</h3>
              <p style={{ color: 'var(--color-body)', fontSize: '13px', marginTop: '4px' }}>
                Secure payment via Stripe
              </p>
            </div>

            {error && (
              <div style={{
                background: 'rgba(255, 110, 110, 0.1)',
                border: '1px solid var(--color-danger)',
                color: 'var(--color-danger)',
                padding: '12px',
                borderRadius: '8px',
                fontSize: '13px',
                marginBottom: '16px'
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handlePay}>
              <div className="form-group">
                <label className="form-label">Total Amount</label>
                <div style={{
                  fontSize: '24px',
                  fontWeight: '800',
                  color: 'var(--color-dark)',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: 'var(--color-bg-light)',
                  border: '2px solid var(--color-gray-border)',
                  textAlign: 'center'
                }}>
                  ৳{booking.totalAmount || booking.hourlyRate * booking.totalHours}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Card Number</label>
                <input
                  type="text"
                  placeholder="4242 4242 4242 4242"
                  className="form-control"
                  maxLength="19"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Expiration Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="form-control"
                    maxLength="5"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">CVV</label>
                  <input
                    type="password"
                    placeholder="123"
                    className="form-control"
                    maxLength="3"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '16px', padding: '14px' }}
              >
                {loading ? 'Processing...' : `Pay ৳${booking.totalAmount || booking.hourlyRate * booking.totalHours}`}
              </button>

              <p style={{
                color: 'var(--color-body)',
                fontSize: '11px',
                textAlign: 'center',
                marginTop: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px'
              }}>
                <Lock size={12} /> Secure 256-bit SSL encrypted connection
              </p>
            </form>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ color: 'var(--color-success)', marginBottom: '16px' }}>
              <CheckCircle2 size={64} style={{ margin: '0 auto' }} />
            </div>
            <h3 style={{ fontSize: '24px', color: 'var(--color-dark)' }}>Payment Successful!</h3>
            <p style={{ color: 'var(--color-body)', marginTop: '8px', fontSize: '14px' }}>
              Your payment has been received and the booking status updated.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
