'use client';

import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { AlertCircle, RefreshCw, HelpCircle, ArrowLeft, ShieldAlert } from 'lucide-react';

function PaymentFailedContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const bookingId = searchParams.get('bookingId') || 'N/A';
  const reason = searchParams.get('reason') || 'Card payment declined by issuer or network timeout.';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />

      <main style={{ flex: 1, padding: '60px 0', background: 'var(--color-bg-light)' }}>
        <div className="container" style={{ maxWidth: '650px' }}>
          
          <div className="card" style={{ padding: '40px 32px', textAlign: 'center', position: 'relative' }}>
            
            {/* Animated Warning Icon */}
            <div style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              background: 'rgba(255, 110, 110, 0.15)',
              color: 'var(--color-danger)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto',
              boxShadow: '0 10px 25px rgba(255, 110, 110, 0.25)',
              animation: 'scaleUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}>
              <AlertCircle size={54} />
            </div>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--color-danger)', fontWeight: '700', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
              <ShieldAlert size={16} /> Transaction Unsuccessful
            </div>

            <h2 style={{ fontSize: '32px', fontWeight: '700', color: 'var(--color-dark)', marginBottom: '8px' }}>
              Payment Failed
            </h2>
            <p style={{ color: 'var(--color-body)', fontSize: '15px', maxWidth: '480px', margin: '0 auto 32px auto' }}>
              We were unable to process your payment for this booking. Don't worry, no funds were deducted from your account.
            </p>

            {/* Error Detail Card */}
            <div style={{
              background: 'rgba(255, 110, 110, 0.05)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 110, 110, 0.2)',
              padding: '24px',
              textAlign: 'left',
              marginBottom: '32px'
            }}>
              <h4 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--color-dark)', borderBottom: '1px solid var(--color-gray-border)', paddingBottom: '12px', marginBottom: '16px' }}>
                Error Details
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-body)' }}>
                  <span>Booking ID:</span>
                  <strong style={{ color: 'var(--color-dark)' }}>#{bookingId}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-body)', alignItems: 'flex-start' }}>
                  <span>Failure Reason:</span>
                  <span style={{ fontWeight: '600', color: 'var(--color-danger)', textAlign: 'right', maxWidth: '300px' }}>
                    {reason}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-body)' }}>
                  <span>Timestamp:</span>
                  <span style={{ color: 'var(--color-dark)' }}>{new Date().toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div style={{ background: '#fff', padding: '16px 20px', borderRadius: '12px', border: '1px solid var(--color-gray-border)', marginBottom: '32px', textAlign: 'left', fontSize: '13px', color: 'var(--color-body)' }}>
              <strong style={{ color: 'var(--color-dark)', display: 'block', marginBottom: '4px' }}>Suggestions to fix this issue:</strong>
              <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <li>Double check your card number, expiration date, and CVV code.</li>
                <li>Ensure your bank card has active online/international transaction privileges.</li>
                <li>Try an alternative credit card or payment method.</li>
              </ul>
            </div>

            {/* Navigation Actions */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => router.push('/parent-dashboard')}
                className="btn btn-primary"
                style={{ padding: '12px 24px', fontSize: '14px' }}
              >
                <RefreshCw size={16} /> Try Paying Again
              </button>

              <a
                href="mailto:support@bebicare.com"
                className="btn btn-outline"
                style={{ padding: '12px 20px', fontSize: '14px' }}
              >
                <HelpCircle size={16} /> Contact Support
              </a>

              <button
                onClick={() => router.push('/parent-dashboard')}
                className="btn btn-secondary"
                style={{ padding: '12px 20px', fontSize: '14px' }}
              >
                <ArrowLeft size={16} /> Return to Dashboard
              </button>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function PaymentFailedPage() {
  return (
    <Suspense fallback={<div style={{ padding: '60px', textAlign: 'center' }}>Loading error details...</div>}>
      <PaymentFailedContent />
    </Suspense>
  );
}
