'use client';

import React from 'react';
import { Star, Quote } from 'lucide-react';

export default function TestimonialsSection() {
  const reviews = [
    {
      id: 't1',
      parentName: 'Farhana & Tanvir Ahmed',
      role: 'Parents of 2 (Gulshan)',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
      comment: 'Finding Jannat on BebiCare saved our busy work schedules! Her CPR certification gave us complete peace of mind while we were at office.',
      rating: 5
    },
    {
      id: 't2',
      parentName: 'Mahmudul Hasan',
      role: 'Single Parent (Dhanmondi)',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      comment: 'The NID background verification badge is genuine. The administrative support team verified everything quickly and booking was seamless.',
      rating: 5
    },
    {
      id: 't3',
      parentName: 'Dr. Sharmin Akter',
      role: 'Doctor & Mother (Uttara)',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
      comment: 'I needed urgent weekend night care for my 3-year-old daughter. Within 20 minutes of posting on BebiCare, I hired a wonderful verified sitter!',
      rating: 5
    }
  ];

  return (
    <section style={{ padding: '80px 0', background: 'var(--color-bg-light)' }}>
      <div className="container">
        
        <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 50px auto' }}>
          <span style={{ fontSize: '14px', color: 'var(--color-primary-dark)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Real Parent Stories
          </span>
          <h2 style={{ fontSize: '32px', marginTop: '8px', color: 'var(--color-dark)', fontWeight: '600' }}>
            Loved by 1,000+ Happy Families
          </h2>
          <p style={{ color: 'var(--color-body)', fontSize: '15px', marginTop: '10px' }}>
            Read how BebiCare brings joy, safety, and flexible nanny support to households.
          </p>
        </div>

        <div className="grid-3" style={{ gap: '24px' }}>
          {reviews.map((rev) => (
            <div 
              key={rev.id}
              className="card"
              style={{
                padding: '32px 24px 24px 24px',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: '1px solid var(--color-gray-border)'
              }}
            >
              <div style={{ position: 'absolute', top: '20px', right: '20px', color: 'rgba(255, 162, 188, 0.4)' }}>
                <Quote size={36} />
              </div>

              <div>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="var(--color-quaternary)" color="var(--color-quaternary)" />
                  ))}
                </div>
                <p style={{ fontSize: '14px', color: 'var(--color-dark)', lineHeight: '1.7', fontStyle: 'italic', marginBottom: '24px' }}>
                  "{rev.comment}"
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', borderTop: '1px solid var(--color-gray-border)', paddingTop: '16px' }}>
                <img 
                  src={rev.avatar} 
                  alt={rev.parentName}
                  style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: '600' }}>{rev.parentName}</h4>
                  <div style={{ fontSize: '12px', color: 'var(--color-body)' }}>{rev.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
