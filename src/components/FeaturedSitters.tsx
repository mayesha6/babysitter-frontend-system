'use client';

import React from 'react';
import Link from 'next/link';
import { Star, ShieldCheck, MapPin, Heart, ArrowRight } from 'lucide-react';

export default function FeaturedSitters() {
  const sitters = [
    {
      _id: '650c1f2f8a123b0012345678',
      name: 'Jannat ul Ferdous',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
      location: 'Dhanmondi, Dhaka',
      rating: 4.9,
      reviewsCount: 38,
      hourlyRate: 350,
      experienceYears: 4,
      isVerified: true,
      bio: 'Certified CPR & First Aid. Passionate about toddler early learning and creative drawing.'
    },
    {
      _id: '650c1f2f8a123b0012345679',
      name: 'Nusrat Jahan',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      location: 'Gulshan 2, Dhaka',
      rating: 4.8,
      reviewsCount: 24,
      hourlyRate: 450,
      experienceYears: 6,
      isVerified: true,
      bio: 'Montessori background & infant specialist. Experienced with twin toddlers and homework help.'
    },
    {
      _id: '650c1f2f8a123b001234567a',
      name: 'Sabrina Islam',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
      location: 'Uttara Sector 7, Dhaka',
      rating: 5.0,
      reviewsCount: 42,
      hourlyRate: 400,
      experienceYears: 5,
      isVerified: true,
      bio: 'Patient and energetic caregiver. Specialized in storytelling, outdoor safety and weekend nanny care.'
    }
  ];

  return (
    <section style={{ padding: '80px 0', background: 'var(--color-white)' }}>
      <div className="container">
        
        {/* Header Title */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span style={{ fontSize: '14px', color: 'var(--color-secondary-dark)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Hand-Picked Candidates
            </span>
            <h2 style={{ fontSize: '32px', marginTop: '6px', color: 'var(--color-dark)', fontWeight: '600' }}>
              Featured Verified Babysitters
            </h2>
          </div>
          <Link href="/search" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            View All Sitters <ArrowRight size={16} />
          </Link>
        </div>

        {/* 3 Sitter Cards Grid */}
        <div className="grid-3" style={{ gap: '24px' }}>
          {sitters.map((sitter) => (
            <div 
              key={sitter._id}
              className="card"
              style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '16px',
                border: '1.5px solid var(--color-gray-border)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
            >
              <div>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ position: 'relative' }}>
                    <img 
                      src={sitter.avatar} 
                      alt={sitter.name}
                      style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-primary)' }}
                    />
                    {sitter.isVerified && (
                      <span 
                        title="NID & Police Verified"
                        style={{
                          position: 'absolute',
                          bottom: '-2px',
                          right: '-2px',
                          background: 'var(--color-tertiary-dark)',
                          color: 'white',
                          borderRadius: '50%',
                          padding: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '2px solid white'
                        }}
                      >
                        <ShieldCheck size={14} />
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '600' }}>{sitter.name}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-body)', fontSize: '13px', marginTop: '4px' }}>
                      <MapPin size={14} color="var(--color-primary-dark)" />
                      <span>{sitter.location}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px', fontSize: '13px' }}>
                      <Star size={14} fill="var(--color-quaternary)" color="var(--color-quaternary)" />
                      <span style={{ fontWeight: '600' }}>{sitter.rating}</span>
                      <span style={{ color: 'var(--color-body)' }}>({sitter.reviewsCount} reviews)</span>
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: '13px', color: 'var(--color-body)', lineHeight: '1.6', marginBottom: '16px' }}>
                  "{sitter.bio}"
                </p>
              </div>

              {/* Bottom Details Footer */}
              <div style={{ borderTop: '1px solid var(--color-gray-border)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '20px', fontWeight: '600', color: 'var(--color-primary-dark)' }}>৳{sitter.hourlyRate}</span>
                  <span style={{ fontSize: '12px', color: 'var(--color-body)' }}> / hr</span>
                </div>

                <Link 
                  href={`/sitter-profile/${sitter._id}`} 
                  className="btn btn-secondary"
                  style={{ padding: '8px 18px', fontSize: '13px', boxShadow: 'none' }}
                >
                  View Profile
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
