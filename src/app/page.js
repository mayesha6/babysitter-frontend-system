'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SitterCard from '../components/SitterCard';
import api from '../services/api';
import { Search, Shield, Heart, Award, ArrowRight, UserPlus, FileText, CheckCircle } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('parent'); // 'parent' or 'sitter'
  const [featuredSitters, setFeaturedSitters] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load verified babysitters for the featured section
  useEffect(() => {
    const loadSitters = async () => {
      try {
        const response = await api.get('/sitter-profile', {
          params: { limit: 3, sort: '-averageRating' }
        });
        setFeaturedSitters(response.data || []);
      } catch (err) {
        console.warn('Could not load featured sitters from API. Using placeholders.', err.message);
        // Fallback placeholders
        setFeaturedSitters([
          {
            user: { _id: 'sitter1', name: 'Jannat ul Ferdous' },
            address: 'Dhanmondi, Dhaka',
            averageRating: 4.9,
            reviewCount: 18,
            hourlyRate: 150,
            skills: ['CPR Certified', 'Newborn Expert', 'Creative Play'],
            verificationStatus: 'VERIFIED',
            employmentType: 'FULL_TIME'
          },
          {
            user: { _id: 'sitter2', name: 'Mayesha Islam' },
            address: 'Gulshan, Dhaka',
            averageRating: 4.8,
            reviewCount: 22,
            hourlyRate: 180,
            skills: ['First Aid', 'First Year Milestones', 'Puzzles'],
            verificationStatus: 'VERIFIED',
            employmentType: 'PART_TIME'
          },
          {
            user: { _id: 'sitter3', name: 'Sultana Nigar' },
            address: 'Mirpur, Dhaka',
            averageRating: 4.7,
            reviewCount: 12,
            hourlyRate: 120,
            skills: ['Cooking', 'Art & Craft', 'Bedtime Routines'],
            verificationStatus: 'VERIFIED',
            employmentType: 'WEEKEND'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadSitters();
  }, []);

  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="hero-wrapper">
        <div className="hero-shapes">
          <div className="hero-shape-1"></div>
          <div className="hero-shape-2"></div>
          <div className="hero-shape-3"></div>
        </div>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '40px', alignItems: 'center' }}>
          <div className="hero-content">
            <span className="hero-tagline">🍼 Trusted Childcare Platform</span>
            <h1 className="hero-title">Your Partner in Parenting</h1>
            <p className="hero-description">
              Finding a nanny is a tedious task. BebiCare connects you with safe, fun, verified, and engaging childcare professionals to give your kids the best care.
            </p>
            <div className="hero-ctas">
              <Link href="/search" className="btn btn-primary" style={{ padding: '16px 36px', fontSize: '16px' }}>
                Find a Babysitter <ArrowRight size={16} />
              </Link>
              <Link href="/auth?tab=register&role=BABYSITTER" className="btn btn-outline" style={{ padding: '16px 36px', fontSize: '16px' }}>
                Apply as Babysitter
              </Link>
            </div>
          </div>
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            {/* Visual aesthetic box */}
            <div style={{
              width: '320px',
              height: '320px',
              borderRadius: '50% 50% 50% 30px',
              background: 'var(--color-secondary)',
              border: '4px solid var(--color-white)',
              boxShadow: 'var(--shadow-lg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '120px',
              animation: 'float 6s ease-in-out infinite'
            }}>
              👶
            </div>
          </div>
        </div>
      </section>

      {/* Core Badges/Trust Section */}
      <section style={{ padding: '60px 0', background: 'var(--color-white)', borderBottom: '1px solid var(--color-gray-border)' }}>
        <div className="container">
          <div className="grid-3" style={{ textAlign: 'center' }}>
            <div style={{ padding: '20px' }}>
              <div style={{ color: 'var(--color-primary)', display: 'inline-flex', marginBottom: '16px' }}>
                <Shield size={40} />
              </div>
              <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>100% Background Checked</h3>
              <p style={{ color: 'var(--color-body)', fontSize: '14px' }}>Every babysitter submits NID and police clearance documents reviewed by admins.</p>
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{ color: 'var(--color-secondary)', display: 'inline-flex', marginBottom: '16px' }}>
                <Heart size={40} />
              </div>
              <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>Playful & Caring</h3>
              <p style={{ color: 'var(--color-body)', fontSize: '14px' }}>Sitters are vetted for interactive skills, crafts, homework help, and safety certifications.</p>
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{ color: 'var(--color-tertiary)', display: 'inline-flex', marginBottom: '16px' }}>
                <Award size={40} />
              </div>
              <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>Secure Stripe Payments</h3>
              <p style={{ color: 'var(--color-body)', fontSize: '14px' }}>Hassle-free booking payouts with transparent invoices and reviews loop.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: '100px 0', background: 'var(--color-bg-light)', borderBottom: '1px solid var(--color-gray-border)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '36px', marginBottom: '16px' }}>How BebiCare Works</h2>
          <p style={{ color: 'var(--color-body)', fontSize: '16px', maxWidth: '600px', margin: '0 auto 40px auto' }}>
            We make finding and managing professional childcare super easy. Toggle below to see instructions.
          </p>

          {/* Toggle buttons */}
          <div style={{ display: 'inline-flex', background: 'var(--color-white)', padding: '6px', borderRadius: '30px', border: '1px solid var(--color-gray-border)', boxShadow: 'var(--shadow-sm)', marginBottom: '50px' }}>
            <button 
              className={`btn ${activeTab === 'parent' ? 'btn-primary' : ''}`}
              style={{ padding: '8px 24px', fontSize: '14px', borderRadius: '20px', background: activeTab === 'parent' ? '' : 'none', color: activeTab === 'parent' ? '' : 'var(--color-dark)', boxShadow: 'none' }}
              onClick={() => setActiveTab('parent')}
            >
              For Parents
            </button>
            <button 
              className={`btn ${activeTab === 'sitter' ? 'btn-secondary' : ''}`}
              style={{ padding: '8px 24px', fontSize: '14px', borderRadius: '20px', background: activeTab === 'sitter' ? '' : 'none', color: activeTab === 'sitter' ? '' : 'var(--color-dark)', boxShadow: 'none' }}
              onClick={() => setActiveTab('sitter')}
            >
              For Babysitters
            </button>
          </div>

          {/* Steps columns */}
          {activeTab === 'parent' ? (
            <div className="grid-3">
              <div className="card step-card">
                <div className="step-num flex-center">1</div>
                <h3 style={{ fontSize: '18px', marginBottom: '12px' }}>Post a Job</h3>
                <p style={{ color: 'var(--color-body)', fontSize: '14px' }}>Submit child details, timings, hourly rate, and required safety skills.</p>
              </div>
              <div className="card step-card">
                <div className="step-num flex-center" style={{ backgroundColor: 'var(--color-primary)' }}>2</div>
                <h3 style={{ fontSize: '18px', marginBottom: '12px' }}>Choose a Sitter</h3>
                <p style={{ color: 'var(--color-body)', fontSize: '14px' }}>Review candidates, check verification badges, and interview them over live chat.</p>
              </div>
              <div className="card step-card">
                <div className="step-num flex-center" style={{ backgroundColor: 'var(--color-tertiary)' }}>3</div>
                <h3 style={{ fontSize: '18px', marginBottom: '12px' }}>Book & Pay</h3>
                <p style={{ color: 'var(--color-body)', fontSize: '14px' }}>Confirm dates, pay securely using Stripe card, and enjoy peace of mind.</p>
              </div>
            </div>
          ) : (
            <div className="grid-3">
              <div className="card step-card">
                <div className="step-num flex-center" style={{ backgroundColor: 'var(--color-secondary)' }}>1</div>
                <h3 style={{ fontSize: '18px', marginBottom: '12px' }}>Create Profile</h3>
                <p style={{ color: 'var(--color-body)', fontSize: '14px' }}>Input hourly rate, working hours availability, and upload your documents.</p>
              </div>
              <div className="card step-card">
                <div className="step-num flex-center" style={{ backgroundColor: 'var(--color-tertiary)' }}>2</div>
                <h3 style={{ fontSize: '18px', marginBottom: '12px' }}>Apply to Jobs</h3>
                <p style={{ color: 'var(--color-body)', fontSize: '14px' }}>Browse matching jobs feed posted by parents and apply with one click.</p>
              </div>
              <div className="card step-card">
                <div className="step-num flex-center" style={{ backgroundColor: 'var(--color-primary)' }}>3</div>
                <h3 style={{ fontSize: '18px', marginBottom: '12px' }}>Earn Money</h3>
                <p style={{ color: 'var(--color-body)', fontSize: '14px' }}>Complete childcare duties and receive payouts directly to your dashboard.</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Featured Sitters Grid */}
      <section style={{ padding: '100px 0', background: 'var(--color-white)', borderBottom: '1px solid var(--color-gray-border)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
            <div>
              <h2 style={{ fontSize: '36px', marginBottom: '8px' }}>Featured Babysitters</h2>
              <p style={{ color: 'var(--color-body)' }}>Top rated, fully verified babysitters available for hire right now.</p>
            </div>
            <Link href="/search" className="btn btn-outline" style={{ padding: '8px 24px', fontSize: '14px' }}>
              Browse All
            </Link>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>Loading babysitters...</div>
          ) : (
            <div className="grid-3">
              {featuredSitters.map((sitter) => (
                <SitterCard key={sitter._id} sitter={sitter} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '100px 0', background: 'var(--color-bg-light)', borderBottom: '1px solid var(--color-gray-border)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '36px', marginBottom: '40px' }}>Loved by Parents</h2>
          <div className="grid-3" style={{ textAlign: 'left' }}>
            <div className="card" style={{ padding: '30px' }}>
              <div style={{ display: 'flex', gap: '4px', color: 'var(--color-quaternary)', marginBottom: '16px' }}>
                <Heart size={20} fill="var(--color-quaternary)" />
                <Heart size={20} fill="var(--color-quaternary)" />
                <Heart size={20} fill="var(--color-quaternary)" />
                <Heart size={20} fill="var(--color-quaternary)" />
                <Heart size={20} fill="var(--color-quaternary)" />
              </div>
              <p style={{ color: 'var(--color-dark)', fontStyle: 'italic', marginBottom: '20px', fontSize: '14px' }}>
                "BebiCare has been a lifesaver! Finding Jannat was the best thing that happened to our family. My kids absolutely love her."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'white' }}>
                  RH
                </div>
                <div>
                  <h4 style={{ fontSize: '14px' }}>Rahat Hossain</h4>
                  <p style={{ fontSize: '12px', color: 'var(--color-body)' }}>Parent of 2 toddlers</p>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: '30px' }}>
              <div style={{ display: 'flex', gap: '4px', color: 'var(--color-quaternary)', marginBottom: '16px' }}>
                <Heart size={20} fill="var(--color-quaternary)" />
                <Heart size={20} fill="var(--color-quaternary)" />
                <Heart size={20} fill="var(--color-quaternary)" />
                <Heart size={20} fill="var(--color-quaternary)" />
                <Heart size={20} fill="var(--color-quaternary)" />
              </div>
              <p style={{ color: 'var(--color-dark)', fontStyle: 'italic', marginBottom: '20px', fontSize: '14px' }}>
                "The background checks and verification badge gave me so much peace of mind. We hired Mayesha for weekend care and she is great!"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'white' }}>
                  SM
                </div>
                <div>
                  <h4 style={{ fontSize: '14px' }}>Sadia Mumu</h4>
                  <p style={{ fontSize: '12px', color: 'var(--color-body)' }}>Parent of 4yo daughter</p>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: '30px' }}>
              <div style={{ display: 'flex', gap: '4px', color: 'var(--color-quaternary)', marginBottom: '16px' }}>
                <Heart size={20} fill="var(--color-quaternary)" />
                <Heart size={20} fill="var(--color-quaternary)" />
                <Heart size={20} fill="var(--color-quaternary)" />
                <Heart size={20} fill="var(--color-quaternary)" />
                <Heart size={20} fill="var(--color-quaternary)" />
              </div>
              <p style={{ color: 'var(--color-dark)', fontStyle: 'italic', marginBottom: '20px', fontSize: '14px' }}>
                "Super secure payments and real-time alerts. I can coordinate and chat with sitters instantly. The review system is very helpful."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'white' }}>
                  AH
                </div>
                <div>
                  <h4 style={{ fontSize: '14px' }}>Anisul Huq</h4>
                  <p style={{ fontSize: '12px', color: 'var(--color-body)' }}>Parent of 1yo infant</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div className="card" style={{
            background: 'linear-gradient(135deg, var(--color-secondary) 0%, var(--color-primary) 100%)',
            border: '1px solid var(--color-gray-border)',
            boxShadow: 'var(--shadow-lg)',
            borderRadius: 'var(--radius-lg)',
            padding: '60px 40px',
            textAlign: 'center',
            color: 'white'
          }}>
            <h2 style={{ fontSize: '40px', color: 'white', marginBottom: '16px' }}>Ready to Give Your Child the Best Care?</h2>
            <p style={{ fontSize: '18px', maxWidth: '600px', margin: '0 auto 40px auto', opacity: 0.9 }}>
              Sign up today and browse verified local babysitters. Safe, secure, and professional.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/auth?tab=register&role=PARENT" className="btn btn-outline" style={{ padding: '12px 28px' }}>
                Find a Babysitter
              </Link>
              <Link href="/auth?tab=register&role=BABYSITTER" className="btn btn-primary" style={{ padding: '12px 28px' }}>
                Apply as Sitter
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
