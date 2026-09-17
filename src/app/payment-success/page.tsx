'use client';

import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { CheckCircle2, ArrowRight, Printer, ShieldCheck, Home } from 'lucide-react';
import Link from 'next/link';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const bookingId = searchParams.get('bookingId') || 'BK-' + Math.floor(100000 + Math.random() * 900000);
  const amount = searchParams.get('amount') || '3500';
  const txId = searchParams.get('txId') || 'pi_' + Math.random().toString(36).substring(2, 12);
  const sitterName = searchParams.get('sitter') || 'Verified Babysitter';

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />

      <main style={{ flex: 1, padding: '60px 0', background: 'var(--color-bg-light)' }}>
        <div className="container" style={{ maxWidth: '650px' }}>
          
          <div className="card" style={{ padding: '40px 32px', textAlign: 'center', position: 'relative' }}>
            
            {/* Animated Celebration Icon */}
            <div style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              background: 'rgba(76, 217, 100, 0.15)',
              color: 'var(--color-tertiary-dark)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto',
              boxShadow: '0 10px 25px rgba(109, 193, 160, 0.3)',
              animation: 'scaleUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}>
              <CheckCircle2 size={54} />
            </div>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--color-tertiary-dark)', fontWeight: '700', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
              <ShieldCheck size={16} /> Payment Confirmed
            </div>

            <h2 style={{ fontSize: '32px', fontWeight: '700', color: 'var(--color-dark)', marginBottom: '8px' }}>
              Payment Successful!
            </h2>
            <p style={{ color: 'var(--color-body)', fontSize: '15px', maxWidth: '480px', margin: '0 auto 32px auto' }}>
              Thank you! Your hiring payment for <strong style={{ color: 'var(--color-dark)' }}>{sitterName}</strong> has been processed successfully.
            </p>

            {/* Invoice Transaction Card */}
            <div style={{
              background: 'var(--color-bg-light)',
              borderRadius: '16px',
              border: '1px solid var(--color-gray-border)',
              padding: '24px',
              textAlign: 'left',
              marginBottom: '32px'
            }}>
              <h4 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--color-dark)', borderBottom: '1px solid var(--color-gray-border)', paddingBottom: '12px', marginBottom: '16px' }}>
                Transaction Summary
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-body)' }}>
                  <span>Booking ID:</span>
                  <strong style={{ color: 'var(--color-dark)' }}>#{bookingId}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-body)' }}>
                  <span>Transaction Reference:</span>
                  <code style={{ background: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', border: '1px solid var(--color-gray-border)', color: 'var(--color-secondary-dark)' }}>
                    {txId}
                  </code>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-body)' }}>
                  <span>Payment Gateway:</span>
                  <span style={{ fontWeight: '600', color: 'var(--color-dark)' }}>Stripe SSL Encrypted</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-body)' }}>
                  <span>Date & Time:</span>
                  <span style={{ color: 'var(--color-dark)' }}>{new Date().toLocaleString()}</span>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '12px',
                  paddingTop: '12px',
                  borderTop: '2px dashed var(--color-gray-border)',
                  fontSize: '18px',
                  fontWeight: '700',
                  color: 'var(--color-dark)'
                }}>
                  <span>Total Amount Paid:</span>
                  <span style={{ color: 'var(--color-tertiary-dark)', fontSize: '22px' }}>৳{amount}</span>
                </div>
              </div>
            </div>

            {/* Navigation Actions */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => router.push('/parent-dashboard')}
                className="btn btn-primary"
                style={{ padding: '12px 24px', fontSize: '14px' }}
              >
                Go to Dashboard <ArrowRight size={16} />
              </button>

              <button
                onClick={handlePrint}
                className="btn btn-outline"
                style={{ padding: '12px 20px', fontSize: '14px' }}
              >
                <Printer size={16} /> Print Receipt
              </button>

              <Link
                href="/search"
                className="btn btn-secondary"
                style={{ padding: '12px 20px', fontSize: '14px' }}
              >
                <Home size={16} /> Search Sitters
              </Link>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div style={{ padding: '60px', textAlign: 'center' }}>Loading confirmation...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
