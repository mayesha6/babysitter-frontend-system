'use client';

import React from 'react';
import { ShieldCheck, UserCheck, Award, HeartHandshake } from 'lucide-react';

export default function TrustBadges() {
  const badges = [
    {
      icon: <ShieldCheck size={32} color="var(--color-primary-dark)" />,
      title: "100% Identity Verified",
      description: "Every sitter submits national ID (NID) and live selfie verification before receiving parent bookings."
    },
    {
      icon: <Award size={32} color="var(--color-secondary-dark)" />,
      title: "Police Clearance Vetted",
      description: "Sitters submit official police clearance certificates verified by our administrative audit team."
    },
    {
      icon: <UserCheck size={32} color="var(--color-tertiary-dark)" />,
      title: "Background & References",
      description: "Parent recommendations and experience histories are audited for maximum safety."
    },
    {
      icon: <HeartHandshake size={32} color="var(--color-quaternary)" />,
      title: "Secure Commission Booking",
      description: "Direct transparent bookings with 10% platform protection and instant chat connect."
    }
  ];

  return (
    <section style={{ padding: '60px 0', background: 'var(--color-white)', borderBottom: '1px solid var(--color-gray-border)' }}>
      <div className="container">
        <div className="grid-4" style={{ gap: '24px' }}>
          {badges.map((badge, idx) => (
            <div 
              key={idx} 
              className="card" 
              style={{
                padding: '24px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '14px',
                border: '1.5px solid var(--color-gray-border)'
              }}
            >
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'var(--color-bg-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {badge.icon}
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--color-dark)' }}>{badge.title}</h3>
              <p style={{ fontSize: '13px', color: 'var(--color-body)', lineHeight: '1.6' }}>{badge.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
