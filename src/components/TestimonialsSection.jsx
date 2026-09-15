'use client';

import React from 'react';
import { Star, Heart, Quote } from 'lucide-react';

export default function TestimonialsSection() {
  const testimonials = [
    {
      id: 1,
      quote: "BebiCare has been an absolute lifesaver for our family! Finding Jannat was the best thing that happened. She is super gentle, CPR-certified, and my two toddlers adore her.",
      parentName: "Rahat Hossain",
      parentTitle: "Parent of 2 toddlers (Dhanmondi)",
      initials: "RH",
      avatarBg: "var(--color-primary)",
      stars: 5
    },
    {
      id: 2,
      quote: "The admin background verification badge gave me so much peace of mind. We hired Mayesha for weekend care and she is consistently punctual and creative with learning games.",
      parentName: "Sadia Mumu",
      parentTitle: "Parent of 4yo daughter (Gulshan)",
      initials: "SM",
      avatarBg: "var(--color-secondary)",
      stars: 5
    },
    {
      id: 3,
      quote: "Super convenient Stripe card checkout and live socket messaging! I can coordinate with sitters instantly and get real-time updates. The review system is very authentic.",
      parentName: "Anisul Huq",
      parentTitle: "Parent of 1yo infant (Uttara)",
      initials: "AH",
      avatarBg: "var(--color-tertiary-dark)",
      stars: 5
    }
  ];

  return (
    <section style={{ padding: '90px 0', background: 'var(--color-bg-light)', borderBottom: '1px solid var(--color-gray-border)' }}>
      <div className="container" style={{ textAlign: 'center' }}>
        
        <span style={{ color: 'var(--color-primary-dark)', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Real Parent Experiences
        </span>
        <h2 style={{ fontSize: '36px', marginTop: '8px', marginBottom: '16px' }}>Loved by Families Across Bangladesh</h2>
        <p style={{ color: 'var(--color-body)', fontSize: '16px', maxWidth: '600px', margin: '0 auto 50px auto' }}>
          Here is what parents say about their experience finding safe, reliable, and loving babysitters through BebiCare.
        </p>

        <div className="grid-3" style={{ textAlign: 'left' }}>
          {testimonials.map((t) => (
            <div 
              key={t.id} 
              className="card" 
              style={{
                padding: '36px 28px',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
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
              <div>
                <Quote size={32} style={{ color: 'rgba(255, 162, 188, 0.4)', marginBottom: '12px' }} />
                
                {/* Rating Stars */}
                <div style={{ display: 'flex', gap: '4px', color: 'var(--color-quaternary)', marginBottom: '16px' }}>
                  {[...Array(t.stars)].map((_, i) => (
                    <Star key={i} size={18} fill="var(--color-quaternary)" color="var(--color-quaternary)" />
                  ))}
                </div>

                <p style={{ color: 'var(--color-dark)', fontStyle: 'italic', marginBottom: '24px', fontSize: '15px', lineHeight: '1.7' }}>
                  "{t.quote}"
                </p>
              </div>

              {/* Author Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', paddingTop: '16px', borderTop: '1px solid var(--color-gray-border)' }}>
                <div 
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: t.avatarBg,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '700',
                    fontSize: '15px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                  }}
                >
                  {t.initials}
                </div>
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--color-dark)' }}>{t.parentName}</h4>
                  <p style={{ fontSize: '13px', color: 'var(--color-body)' }}>{t.parentTitle}</p>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
