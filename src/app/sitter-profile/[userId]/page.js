'use client';

import React, { useState, useEffect } from 'react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import SitterBookingCard from '../../../components/SitterBookingCard';
import { useApp } from '../../../context/AppContext';
import api from '../../../services/api';
import { Star, ShieldCheck, MapPin, Sparkles, Heart } from 'lucide-react';

export default function SitterProfile({ params }) {
  const unwrappedParams = React.use(params);
  const { userId } = unwrappedParams;
  const { user: currentUser } = useApp();

  const [sitter, setSitter] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        // 1. Fetch sitter profile by user ID
        const profileRes = await api.get(`/sitter-profile/${userId}`);
        setSitter(profileRes.data);

        // 2. Fetch sitter reviews
        try {
          const reviewsRes = await api.get(`/reviews/sitter/${userId}`);
          setReviews(reviewsRes.data || []);
        } catch (revErr) {
          console.warn('Failed to load reviews from API.', revErr.message);
        }
      } catch (err) {
        console.warn('API error loading profile, falling back to mock details.', err.message);
        const mockSitter = {
          user: { _id: userId, name: 'Jannat ul Ferdous', email: 'jannat@gmail.com', phone: '01711223344' },
          address: 'Dhanmondi, Dhaka',
          about: 'Hello! I am a professional babysitter with over 4 years of experience. I specialize in infant care, creative playtime, and keeping kids safe and happy. Certified in Pediatric First Aid and CPR.',
          experienceYears: 4,
          gender: 'FEMALE',
          hourlyRate: 150,
          skills: ['First Aid Certified', 'CPR Certified', 'Infant Care', 'Tutoring', 'Cooking'],
          languages: ['Bangla', 'English'],
          verificationStatus: 'VERIFIED',
          availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          availableStartTime: '08:00 AM',
          availableEndTime: '06:00 PM',
          averageRating: 4.9,
          reviewCount: 2
        };
        setSitter(mockSitter);
        setReviews([
          { _id: 'r1', rating: 5, comment: 'Excellent helper! She is extremely polite and my son enjoyed playing with her.', sender: { name: 'Rahat Hossain' } },
          { _id: 'r2', rating: 5, comment: 'Very careful and punctual. Highly recommended for toddler care.', sender: { name: 'Mahrin Ahmed' } }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [userId]);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          Loading profile...
        </div>
        <Footer />
      </div>
    );
  }

  const name = sitter?.user?.name || 'Babysitter';
  const colors = ['#ffa2bc', '#b996fe', '#6dc1a0', '#ffc147'];
  const placeholderBg = colors[name.length % colors.length];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />

      <main style={{ flex: 1, padding: '50px 0', background: 'var(--color-bg-light)' }}>
        <div className="container">
          
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.8fr', gap: '40px' }}>
            
            {/* Left Column: Sitter Bio Details */}
            <div>
              {/* Header profile card */}
              <div className="card" style={{ padding: '32px', marginBottom: '30px' }}>
                <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
                  {sitter.profileImage ? (
                    <img src={sitter.profileImage} alt={name} style={{ width: '120px', height: '120px', borderRadius: '50% 50% 50% 15px', border: '4px solid var(--color-white)', boxShadow: 'var(--shadow-sm)', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '120px', height: '120px', borderRadius: '50% 50% 50% 15px', border: '4px solid var(--color-white)', boxShadow: 'var(--shadow-sm)', backgroundColor: placeholderBg, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', fontFamily: 'var(--font-header)' }}>
                      {name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <h2 style={{ fontSize: '28px' }}>{name}</h2>
                      {sitter.verificationStatus === 'VERIFIED' && (
                        <span className="badge badge-verified">
                          <ShieldCheck size={14} style={{ marginRight: '4px' }} /> Verified Sitter
                        </span>
                      )}
                    </div>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-body)', marginTop: '6px' }}>
                      <MapPin size={16} /> {sitter.address || 'Dhaka, Bangladesh'}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700', fontSize: '15px', marginTop: '12px' }}>
                      <Star size={16} fill="var(--color-quaternary)" color="var(--color-quaternary)" />
                      <span>{sitter.averageRating?.toFixed(1) || '5.0'}</span>
                      <span style={{ fontWeight: '400', color: 'var(--color-body)' }}>({sitter.reviewCount || 0} reviews)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio description */}
              <div className="card" style={{ padding: '32px', marginBottom: '30px' }}>
                <h3 style={{ fontSize: '20px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={18} style={{ color: 'var(--color-secondary)' }} /> About Me
                </h3>
                <p style={{ color: 'var(--color-body)', fontSize: '15px', lineHeight: '1.8' }}>
                  {sitter.about || 'This babysitter has not written a bio description yet.'}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '30px', borderTop: '1px solid var(--color-gray-border)', paddingTop: '20px' }}>
                  <div>
                    <h4 style={{ fontSize: '14px', color: 'var(--color-body)', fontWeight: '600' }}>Experience</h4>
                    <p style={{ fontSize: '16px', fontWeight: '700', color: 'var(--color-dark)' }}>{sitter.experienceYears || 0} Years</p>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '14px', color: 'var(--color-body)', fontWeight: '600' }}>Gender / Age</h4>
                    <p style={{ fontSize: '16px', fontWeight: '700', color: 'var(--color-dark)' }}>{sitter.gender || 'FEMALE'}</p>
                  </div>
                </div>
              </div>

              {/* Skills & Languages */}
              <div className="card" style={{ padding: '32px', marginBottom: '30px' }}>
                <h3 style={{ fontSize: '20px', marginBottom: '16px' }}>Skills & Expertise</h3>
                <div className="sitter-skills" style={{ marginBottom: '24px' }}>
                  {sitter.skills?.map((skill, i) => (
                    <span key={i} className="skill-tag" style={{ padding: '6px 14px', fontSize: '13px' }}>{skill}</span>
                  )) || 'None'}
                </div>

                <h3 style={{ fontSize: '18px', marginBottom: '12px' }}>Languages</h3>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {sitter.languages?.map((lang, i) => (
                    <span key={i} style={{ background: 'rgba(109, 193, 160, 0.12)', color: 'var(--color-tertiary-dark)', border: '1px solid var(--color-tertiary)', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' }}>
                      {lang}
                    </span>
                  )) || 'Bangla'}
                </div>
              </div>

              {/* Reviews List */}
              <div className="card" style={{ padding: '32px' }}>
                <h3 style={{ fontSize: '20px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Heart size={18} style={{ color: 'var(--color-primary)' }} /> Parent Reviews
                </h3>
                {reviews.length === 0 ? (
                  <p style={{ color: 'var(--color-body)', textAlign: 'center', padding: '20px' }}>No reviews posted yet for this sitter.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {reviews.map((rev, i) => (
                      <div key={rev._id || i} style={{ borderBottom: i === reviews.length - 1 ? 'none' : '1px solid var(--color-gray-border)', paddingBottom: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <h4 style={{ fontSize: '15px' }}>{rev.sender?.name || 'Parent'}</h4>
                          <div style={{ display: 'flex', gap: '2px', color: 'var(--color-quaternary)' }}>
                            {[...Array(rev.rating)].map((_, idx) => (
                              <Star key={idx} size={14} fill="var(--color-quaternary)" color="var(--color-quaternary)" />
                            ))}
                          </div>
                        </div>
                        <p style={{ color: 'var(--color-body)', fontSize: '14px', marginTop: '8px', fontStyle: 'italic' }}>
                          "{rev.comment}"
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Hiring Booking Card Component */}
            <div>
              <SitterBookingCard sitter={sitter} userId={userId} />
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
