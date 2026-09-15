'use client';

import React from 'react';
import { ShieldCheck, Heart, Award, Clock } from 'lucide-react';

export default function TrustBadges() {
  const trustItems = [
    {
      icon: <ShieldCheck size={40} />,
      iconColor: 'var(--color-primary)',
      bgColor: 'rgba(255, 162, 188, 0.15)',
      title: '100% Background Checked',
      description: 'Every babysitter submits NID, police clearance, and emergency contact details for admin verification.'
    },
    {
      icon: <Heart size={40} />,
      iconColor: 'var(--color-secondary)',
      bgColor: 'rgba(185, 150, 254, 0.15)',
      title: 'Playful & Nurturing Care',
      description: 'Sitters are vetted for interactive skills, arts & crafts, homework assistance, and infant safety.'
    },
    {
      icon: <Award size={40} />,
      iconColor: 'var(--color-tertiary-dark)',
      bgColor: 'rgba(109, 193, 160, 0.15)',
      title: 'Transparent Invoicing',
      description: 'Clear hourly calculations with automated billing logs and verified parent review ratings.'
    },
    {
      icon: <Clock size={40} />,
      iconColor: 'var(--color-quaternary)',
      bgColor: 'rgba(255, 193, 71, 0.2)',
      title: 'Flexible Scheduling',
      description: 'Hire sitters for full-time monthly care, part-time after-school shifts, or weekend emergencies.'
    }
  ];

  return (
    <section style={{ padding: '70px 0', background: 'var(--color-white)', borderBottom: '1px solid var(--color-gray-border)' }}>
      <div className="container">
        
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <span style={{ color: 'var(--color-primary-dark)', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Why Families Choose BebiCare
          </span>
          <h2 style={{ fontSize: '32px', marginTop: '8px' }}>Designed for Peace of Mind</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '30px' }}>
          {trustItems.map((item, index) => (
            <div 
              key={index} 
              className="card" 
              style={{
                padding: '32px 24px',
                textAlign: 'center',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'default'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              }}
            >
              <div 
                style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '50%',
                  background: item.bgColor,
                  color: item.iconColor,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px'
                }}
              >
                {item.icon}
              </div>
              <h3 style={{ fontSize: '18px', marginBottom: '12px', color: 'var(--color-dark)' }}>
                {item.title}
              </h3>
              <p style={{ color: 'var(--color-body)', fontSize: '14px', lineHeight: '1.6' }}>
                {item.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
