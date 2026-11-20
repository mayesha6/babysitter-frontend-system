'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Star, Sparkles } from 'lucide-react';

function TeddyBearIcon({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <circle cx="8" cy="8" r="6.5" fill="#d9822b" />
      <circle cx="8" cy="8" r="3.8" fill="#f7c88b" />
      <circle cx="36" cy="8" r="6.5" fill="#d9822b" />
      <circle cx="36" cy="8" r="3.8" fill="#f7c88b" />
      <ellipse cx="22" cy="22" rx="17" ry="15" fill="#f5aa47" />
      <ellipse cx="11" cy="24" rx="3.5" ry="2" fill="#ff6b8b" opacity="0.7" />
      <ellipse cx="33" cy="24" rx="3.5" ry="2" fill="#ff6b8b" opacity="0.7" />
      <circle cx="15" cy="18" r="2.6" fill="#221608" />
      <circle cx="16" cy="17" r="0.9" fill="#ffffff" />
      <circle cx="29" cy="18" r="2.6" fill="#221608" />
      <circle cx="30" cy="17" r="0.9" fill="#ffffff" />
      <ellipse cx="22" cy="25" rx="7.5" ry="6" fill="#fce5c4" />
      <path d="M19.5 22.8 Q22 21.2 24.5 22.8 Q22 25.8 19.5 22.8 Z" fill="#3d2105" />
      <path d="M22 24.8 L22 27.2 M19.8 27.2 Q22 28.8 24.2 27.2" stroke="#3d2105" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function BabyIllustration({ size = 180 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="babySkin" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#FFF4E6" />
          <stop offset="100%" stopColor="#FBD3B0" />
        </radialGradient>
      </defs>
      <circle cx="16" cy="52" r="7" fill="#FBD3B0" />
      <circle cx="16" cy="52" r="4" fill="#F4B896" />
      <circle cx="84" cy="52" r="7" fill="#FBD3B0" />
      <circle cx="84" cy="52" r="4" fill="#F4B896" />
      <circle cx="50" cy="50" r="36" fill="url(#babySkin)" />
      <path d="M48 14 C44 6, 56 6, 52 14" stroke="#B87D4B" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M35 45 Q40 39 45 45" stroke="#4A3427" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M55 45 Q60 39 65 45" stroke="#4A3427" strokeWidth="3" strokeLinecap="round" fill="none" />
      <circle cx="33" cy="52" r="6" fill="#FF8DA1" opacity="0.5" />
      <circle cx="67" cy="52" r="6" fill="#FF8DA1" opacity="0.5" />
      <ellipse cx="50" cy="62" rx="11" ry="6" fill="#6EC1A0" />
      <circle cx="50" cy="62" r="4" fill="#FFFFFF" />
      <path d="M46 66 C46 72, 54 72, 54 66" stroke="#6EC1A0" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export default function HeroSection() {
  return (
    <section className="hero-wrapper" style={{ position: 'relative', overflow: 'hidden', padding: '80px 0 100px 0' }}>
      {/* Decorative background shapes */}
      <div className="hero-shapes">
        <div className="hero-shape-1"></div>
        <div className="hero-shape-2"></div>
        <div className="hero-shape-3"></div>
      </div>

      <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '40px', alignItems: 'center' }}>
        {/* Left Column: Hero Text Content */}
        <div className="hero-content">
          <div className="badge badge-verified" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '30px', fontSize: '14px', marginBottom: '20px', background: 'rgba(255, 162, 188, 0.15)', color: 'var(--color-primary-dark)', border: '1px solid var(--color-primary)' }}>
            <Sparkles size={16} /> <span>#1 Trusted Childcare & Babysitter Platform</span>
          </div>

          <h1 className="hero-title" style={{ fontSize: '48px', lineHeight: '1.2', fontWeight: '600', marginBottom: '20px', color: 'var(--color-dark)' }}>
            Your Partner in <span style={{ color: 'var(--color-primary)', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>Parenting <TeddyBearIcon size={38} /></span>
          </h1>

          <p className="hero-description" style={{ fontSize: '18px', color: 'var(--color-body)', lineHeight: '1.7', marginBottom: '32px', maxWidth: '540px' }}>
            Finding a reliable nanny shouldn't be stressful. BabyCare connects busy parents with background-checked, CPR-certified, and loving babysitters in your neighborhood.
          </p>

          {/* Action CTAs */}
          <div className="hero-ctas" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
            <Link href="/search" className="btn btn-primary" style={{ padding: '16px 36px', fontSize: '16px', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
              Find a Babysitter <ArrowRight size={18} />
            </Link>
            <Link href="/auth?tab=register&role=BABYSITTER" className="btn btn-outline" style={{ padding: '16px 36px', fontSize: '16px' }}>
              Become a Sitter
            </Link>
          </div>

          {/* Trust Metrics Bar */}
          <div style={{ display: 'flex', gap: '28px', marginTop: '40px', paddingTop: '24px', borderTop: '1px solid var(--color-gray-border)' }}>
            <div>
              <div style={{ fontSize: '24px', fontWeight: '600', color: 'var(--color-primary)' }}>500+</div>
              <div style={{ fontSize: '13px', color: 'var(--color-body)' }}>Verified Sitters</div>
            </div>
            <div style={{ borderLeft: '1px solid var(--color-gray-border)', paddingLeft: '28px' }}>
              <div style={{ fontSize: '24px', fontWeight: '600', color: 'var(--color-secondary)' }}>4.9 ★</div>
              <div style={{ fontSize: '13px', color: 'var(--color-body)' }}>Average Rating</div>
            </div>
            <div style={{ borderLeft: '1px solid var(--color-gray-border)', paddingLeft: '28px' }}>
              <div style={{ fontSize: '24px', fontWeight: '600', color: 'var(--color-tertiary-dark)' }}>100%</div>
              <div style={{ fontSize: '13px', color: 'var(--color-body)' }}>NID & Police Vetted</div>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Circle & Floating Badges */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          
          <div style={{
            width: '340px',
            height: '340px',
            borderRadius: '50% 50% 50% 30px',
            background: 'linear-gradient(135deg, var(--color-secondary) 0%, var(--color-primary) 100%)',
            border: '6px solid var(--color-white)',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'float 6s ease-in-out infinite',
            position: 'relative'
          }}>
            <BabyIllustration size={180} />
          </div>

          <div style={{
            position: 'absolute',
            top: '-10px',
            left: '-10px',
            background: 'var(--color-white)',
            padding: '12px 20px',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-md)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            border: '1px solid var(--color-gray-border)',
            animation: 'float 5s ease-in-out infinite 1s'
          }}>
            <div style={{ background: 'rgba(255, 193, 71, 0.2)', padding: '8px', borderRadius: '50%', color: 'var(--color-quaternary)' }}>
              <Star size={20} fill="var(--color-quaternary)" />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '600' }}>4.9 Star Sitters</div>
              <div style={{ fontSize: '12px', color: 'var(--color-body)' }}>100+ Parent Reviews</div>
            </div>
          </div>

          <div style={{
            position: 'absolute',
            bottom: '-15px',
            right: '-10px',
            background: 'var(--color-white)',
            padding: '12px 20px',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-md)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            border: '1px solid var(--color-gray-border)',
            animation: 'float 6s ease-in-out infinite 2s'
          }}>
            <div style={{ background: 'rgba(109, 193, 160, 0.2)', padding: '8px', borderRadius: '50%', color: 'var(--color-tertiary-dark)' }}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '600' }}>Admin Approved</div>
              <div style={{ fontSize: '12px', color: 'var(--color-body)' }}>Identity & Police Checked</div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
