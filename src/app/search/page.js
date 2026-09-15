'use client';

import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SitterCard from '../../components/SitterCard';
import SearchFilterSidebar from '../../components/SearchFilterSidebar';
import api from '../../services/api';
import { Info, Sparkles } from 'lucide-react';

export default function SearchPage() {
  // Filter states
  const [address, setAddress] = useState('');
  const [maxRate, setMaxRate] = useState(500);
  const [gender, setGender] = useState('');
  const [employmentType, setEmploymentType] = useState('');
  
  // Sitter results
  const [sitters, setSitters] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleResetFilters = () => {
    setAddress('');
    setMaxRate(500);
    setGender('');
    setEmploymentType('');
  };

  const fetchSitters = async () => {
    setLoading(true);
    try {
      const params = {};
      if (address) params.searchTerm = address;
      if (gender) params.gender = gender;
      if (employmentType) params.employmentType = employmentType;
      
      const response = await api.get('/sitter-profile', { params });
      
      // Filter by max rate on client-side
      const results = (response.data || []).filter(
        (s) => !s.hourlyRate || s.hourlyRate <= maxRate
      );
      
      setSitters(results);
    } catch (err) {
      console.warn('API error fetching sitters, loading fallback mock data.', err.message);
      const mocks = [
        {
          _id: 's1',
          user: { _id: 'sitter1', name: 'Jannat ul Ferdous' },
          address: 'Dhanmondi, Dhaka',
          averageRating: 4.9,
          reviewCount: 18,
          hourlyRate: 150,
          skills: ['CPR Certified', 'Newborn Expert', 'Creative Play'],
          verificationStatus: 'VERIFIED',
          employmentType: 'FULL_TIME',
          gender: 'FEMALE'
        },
        {
          _id: 's2',
          user: { _id: 'sitter2', name: 'Mayesha Islam' },
          address: 'Gulshan, Dhaka',
          averageRating: 4.8,
          reviewCount: 22,
          hourlyRate: 180,
          skills: ['First Aid', 'First Year Milestones', 'Puzzles'],
          verificationStatus: 'VERIFIED',
          employmentType: 'PART_TIME',
          gender: 'FEMALE'
        },
        {
          _id: 's3',
          user: { _id: 'sitter3', name: 'Sultana Nigar' },
          address: 'Mirpur, Dhaka',
          averageRating: 4.7,
          reviewCount: 12,
          hourlyRate: 120,
          skills: ['Cooking', 'Art & Craft', 'Bedtime Routines'],
          verificationStatus: 'VERIFIED',
          employmentType: 'WEEKEND',
          gender: 'FEMALE'
        },
        {
          _id: 's4',
          user: { _id: 'sitter4', name: 'Sourav Roy' },
          address: 'Uttara, Dhaka',
          averageRating: 4.6,
          reviewCount: 8,
          hourlyRate: 100,
          skills: ['Tutoring', 'Swimming Safety', 'Active Games'],
          verificationStatus: 'VERIFIED',
          employmentType: 'PART_TIME',
          gender: 'MALE'
        }
      ];

      const filtered = mocks.filter((s) => {
        if (address && !s.address.toLowerCase().includes(address.toLowerCase())) return false;
        if (gender && s.gender !== gender) return false;
        if (employmentType && s.employmentType !== employmentType) return false;
        if (s.hourlyRate > maxRate) return false;
        return true;
      });

      setSitters(filtered);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchSitters();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [address, maxRate, gender, employmentType]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />

      <main style={{ flex: 1, padding: '50px 0', background: 'var(--color-bg-light)' }}>
        <div className="container">
          
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--color-primary-dark)', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
              <Sparkles size={16} /> Directory Search
            </div>
            <h2 style={{ fontSize: '36px' }}>Find a Qualified Babysitter</h2>
            <p style={{ color: 'var(--color-body)', fontSize: '15px', marginTop: '4px' }}>
              Filter through verified babysitters to find the perfect helper for your family.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '32px' }}>
            
            {/* Filters Sidebar Component */}
            <SearchFilterSidebar 
              address={address}
              setAddress={setAddress}
              maxRate={maxRate}
              setMaxRate={setMaxRate}
              gender={gender}
              setGender={setGender}
              employmentType={employmentType}
              setEmploymentType={setEmploymentType}
              onReset={handleResetFilters}
            />

            {/* Results Grid */}
            <div>
              {loading ? (
                <div className="card" style={{ padding: '60px', textAlign: 'center', color: 'var(--color-body)' }}>
                  Loading matching sitters...
                </div>
              ) : sitters.length === 0 ? (
                <div className="card" style={{ padding: '60px', textAlign: 'center', color: 'var(--color-body)' }}>
                  <Info size={40} style={{ margin: '0 auto 12px auto', color: 'var(--color-secondary)' }} />
                  <h3 style={{ fontSize: '20px', color: 'var(--color-dark)', marginBottom: '8px' }}>No Babysitters Found</h3>
                  <p style={{ marginBottom: '16px' }}>Try expanding your filter criteria or changing the location query.</p>
                  <button onClick={handleResetFilters} className="btn btn-outline" style={{ padding: '8px 20px', fontSize: '14px' }}>
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <>
                  <div style={{ fontSize: '14px', color: 'var(--color-body)', marginBottom: '16px', fontWeight: '600' }}>
                    Showing {sitters.length} verified babysitter{sitters.length > 1 ? 's' : ''}
                  </div>
                  <div className="grid-3">
                    {sitters.map((sitter) => (
                      <SitterCard key={sitter._id} sitter={sitter} />
                    ))}
                  </div>
                </>
              )}
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
