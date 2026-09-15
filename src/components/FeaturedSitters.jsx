'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import SitterCard from './SitterCard';
import api from '../services/api';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function FeaturedSitters() {
  const [featuredSitters, setFeaturedSitters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSitters = async () => {
      try {
        const response = await api.get('/sitter-profile', {
          params: { limit: 3, sort: '-averageRating' }
        });
        setFeaturedSitters(response.data || []);
      } catch (err) {
        console.warn('Could not load featured sitters from API. Using placeholders.', err.message);
        setFeaturedSitters([
          {
            _id: 'f1',
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
            _id: 'f2',
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
            _id: 'f3',
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
    <section style={{ padding: '90px 0', background: 'var(--color-white)', borderBottom: '1px solid var(--color-gray-border)' }}>
      <div className="container">
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--color-tertiary-dark)', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
              <Sparkles size={16} /> Top Verified Talent
            </div>
            <h2 style={{ fontSize: '36px' }}>Featured Babysitters</h2>
            <p style={{ color: 'var(--color-body)', fontSize: '15px', marginTop: '4px' }}>
              Top rated, fully verified babysitters available for hire in your area right now.
            </p>
          </div>
          <Link href="/search" className="btn btn-outline" style={{ padding: '10px 24px', fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            Browse All Sitters <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-body)' }}>
            Loading top-rated babysitters...
          </div>
        ) : (
          <div className="grid-3">
            {featuredSitters.map((sitter) => (
              <SitterCard key={sitter._id} sitter={sitter} />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
