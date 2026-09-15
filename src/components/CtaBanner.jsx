'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, UserPlus, Heart } from 'lucide-react';

export default function CtaBanner() {
  return (
    <section style={{ padding: '80px 0' }}>
      <div className="container">
        
        <div 
          className="card" 
          style={{
            background: 'linear-gradient(135deg, var(--color-secondary) 0%, var(--color-primary) 100%)',
            border: 'none',
            boxShadow: 'var(--shadow-lg)',
            borderRadius: 'var(--radius-lg)',
            padding: '70px 40px',
            textAlign: 'center',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Decorative background overlay circles */}
          <div style={{ position: 'absolute', top: '-50px', left: '-50px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}></div>
          <div style={{ position: 'absolute', bottom: '-80px', right: '-80px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}></div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.2)', padding: '6px 16px', borderRadius: '30px', fontSize: '14px', fontWeight: '600', marginBottom: '20px' }}>
              <Heart size={16} fill="white" /> Join Hundreds of Happy Families
            </div>

            <h2 style={{ fontSize: '42px', color: 'white', fontWeight: '800', marginBottom: '16px', lineHeight: '1.2' }}>
              Ready to Give Your Child the Best Care?
            </h2>

            <p style={{ fontSize: '18px', maxWidth: '640px', margin: '0 auto 40px auto', opacity: 0.95, lineHeight: '1.6' }}>
              Create an account today to browse background-checked local babysitters or apply to become a certified nanny.
            </p>

            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link 
                href="/auth?tab=register&role=PARENT" 
                className="btn btn-outline" 
                style={{
                  padding: '14px 32px',
                  fontSize: '16px',
                  borderColor: 'white',
                  color: 'white',
                  background: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(4px)'
                }}
              >
                Hire a Babysitter
              </Link>
              <Link 
                href="/auth?tab=register&role=BABYSITTER" 
                className="btn btn-primary" 
                style={{
                  padding: '14px 32px',
                  fontSize: '16px',
                  background: 'white',
                  color: 'var(--color-dark)',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.15)'
                }}
              >
                Apply as Babysitter <ArrowRight size={18} />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
