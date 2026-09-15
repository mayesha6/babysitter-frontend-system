'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Heart } from 'lucide-react';

export default function CtaBanner() {
  return (
    <section style={{ padding: '80px 0', background: 'var(--color-white)' }}>
      <div className="container">
        
        <div 
          style={{
            background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-secondary-dark) 100%)',
            borderRadius: '24px',
            padding: '60px 40px',
            color: 'white',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-lg)'
          }}
        >
          {/* Decorative background circle */}
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)'
          }} />

          <div style={{ maxWidth: '640px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '6px 16px',
              borderRadius: '30px',
              fontSize: '13px',
              marginBottom: '20px',
              backdropFilter: 'blur(4px)'
            }}>
              <Heart size={14} /> <span>Join Our Caring Community</span>
            </div>

            <h2 style={{ fontSize: '36px', lineHeight: '1.3', fontWeight: '600', marginBottom: '16px' }}>
              Ready to Find the Perfect Babysitter for Your Child?
            </h2>

            <p style={{ fontSize: '16px', opacity: 0.9, lineHeight: '1.6', marginBottom: '32px' }}>
              Create your parent account in less than 2 minutes. Post jobs or browse verified sitters with transparent hourly rates.
            </p>

            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link 
                href="/auth?tab=register&role=PARENT" 
                className="btn btn-primary"
                style={{ padding: '16px 36px', fontSize: '16px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                Get Started Now <ArrowRight size={18} />
              </Link>
              <Link 
                href="/auth?tab=register&role=BABYSITTER" 
                className="btn btn-outline"
                style={{ padding: '16px 36px', fontSize: '16px', borderColor: 'white', color: 'white' }}
              >
                Join as a Babysitter
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
