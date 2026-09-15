'use client';

import React from 'react';
import { Search, UserCheck, CalendarCheck, Heart } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      num: "01",
      icon: <Search size={28} color="var(--color-primary-dark)" />,
      title: "Search & Filter",
      description: "Browse background-verified sitters by location, hourly rates, CPR certifications, and availability."
    },
    {
      num: "02",
      icon: <UserCheck size={28} color="var(--color-secondary-dark)" />,
      title: "Review Verified Profiles",
      description: "Inspect NID clearance badges, parent reviews, and police background verifications."
    },
    {
      num: "03",
      icon: <CalendarCheck size={28} color="var(--color-tertiary-dark)" />,
      title: "Instant Chat & Booking",
      description: "Connect via real-time Socket inbox chat or post custom job offers directly to candidates."
    },
    {
      num: "04",
      icon: <Heart size={28} color="var(--color-quaternary)" />,
      title: "Peace of Mind",
      description: "Enjoy stress-free childcare with 10% platform commission audit protection."
    }
  ];

  return (
    <section style={{ padding: '80px 0', background: 'var(--color-bg-light)' }}>
      <div className="container">
        
        {/* Section Title */}
        <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 50px auto' }}>
          <span style={{ fontSize: '14px', color: 'var(--color-primary-dark)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Simple 4-Step Process
          </span>
          <h2 style={{ fontSize: '32px', marginTop: '8px', color: 'var(--color-dark)', fontWeight: '600' }}>
            How BebiCare Works for Parents
          </h2>
          <p style={{ color: 'var(--color-body)', fontSize: '15px', marginTop: '10px' }}>
            Find, interview, and hire experienced nannies in 4 easy steps with complete transparency.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid-4" style={{ gap: '24px' }}>
          {steps.map((step) => (
            <div 
              key={step.num}
              className="card"
              style={{
                padding: '28px 24px',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                border: '1px solid var(--color-gray-border)'
              }}
            >
              {/* Step number watermark badge */}
              <div style={{
                position: 'absolute',
                top: '16px',
                right: '20px',
                fontSize: '36px',
                fontWeight: '600',
                color: 'var(--color-gray-border)',
                opacity: 0.6
              }}>
                {step.num}
              </div>

              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                background: 'var(--color-bg-light)',
                border: '1.5px solid var(--color-gray-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {step.icon}
              </div>

              <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--color-dark)' }}>
                {step.title}
              </h3>

              <p style={{ fontSize: '13px', color: 'var(--color-body)', lineHeight: '1.6' }}>
                {step.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
