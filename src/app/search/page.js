'use client';

import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SitterCard from '../../components/SitterCard';
import api from '../../services/api';
import { Search as SearchIcon, MapPin, SlidersHorizontal, Info } from 'lucide-react';

export default function SearchPage() {
  // Filter states
  const [address, setAddress] = useState('');
  const [maxRate, setMaxRate] = useState(500);
  const [gender, setGender] = useState('');
  const [employmentType, setEmploymentType] = useState('');
  
  // Sitter results
  const [sitters, setSitters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSitters = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (address) params.searchTerm = address;
      if (gender) params.gender = gender;
      if (employmentType) params.employmentType = employmentType;
      
      // Let's filter client-side or pass queries to the backend QueryBuilder
      const response = await api.get('/sitter-profile', { params });
      
      // Filter by max rate on client-side to ensure slider accuracy
      const results = (response.data || []).filter(
        (s) => !s.hourlyRate || s.hourlyRate <= maxRate
      );
      
      setSitters(results);
    } catch (err) {
      console.warn('API error fetching sitters, loading mock fallback data.', err.message);
      // Fallback mockup data matching filter conditions
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

  // Re-fetch when filter options change
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchSitters();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [address, maxRate, gender, employmentType]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />

      <main style={{ flex: 1, padding: '40px 0', background: 'var(--color-bg-light)' }}>
        <div className="container">
          
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '32px' }}>Find a Babysitter</h2>
            <p style={{ color: 'var(--color-body)', fontSize: '15px' }}>
              Filter through verified babysitters to find the perfect helper for your child.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '32px' }}>
            
            {/* Filters Sidebar */}
            <div>
              <div className="card" style={{ padding: '24px', position: 'sticky', top: '100px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', borderBottom: '2px solid var(--color-gray-border)', paddingBottom: '10px' }}>
                  <SlidersHorizontal size={18} />
                  <h3 style={{ fontSize: '18px' }}>Filters</h3>
                </div>

                {/* Address Filter */}
                <div className="form-group">
                  <label className="form-label">Location / Address</label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="text" 
                      placeholder="e.g. Dhanmondi" 
                      className="form-control" 
                      style={{ paddingLeft: '40px', width: '100%' }}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                    <MapPin size={16} style={{ position: 'absolute', left: '14px', top: '16px', color: 'var(--color-body)' }} />
                  </div>
                </div>

                {/* Hourly Rate Slider */}
                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="form-label">Max Hourly Rate</label>
                    <span style={{ fontWeight: '700', color: 'var(--color-secondary)' }}>৳{maxRate}</span>
                  </div>
                  <input 
                    type="range" 
                    min="50" 
                    max="500" 
                    step="10"
                    value={maxRate}
                    onChange={(e) => setMaxRate(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--color-secondary)' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--color-body)' }}>
                    <span>৳50/hr</span>
                    <span>৳500/hr</span>
                  </div>
                </div>

                {/* Gender Select */}
                <div className="form-group">
                  <label className="form-label">Sitter Gender</label>
                  <select 
                    className="form-control" 
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="">Any Gender</option>
                    <option value="FEMALE">Female Only</option>
                    <option value="MALE">Male Only</option>
                  </select>
                </div>

                {/* Employment Type */}
                <div className="form-group">
                  <label className="form-label">Job Type</label>
                  <select 
                    className="form-control" 
                    value={employmentType}
                    onChange={(e) => setEmploymentType(e.target.value)}
                  >
                    <option value="">Any Job Type</option>
                    <option value="FULL_TIME">Full Time</option>
                    <option value="PART_TIME">Part Time</option>
                    <option value="WEEKEND">Weekend</option>
                  </select>
                </div>
              </div>
            </div>

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
                  <p>Try expanding your filter criteria or changing the location query.</p>
                </div>
              ) : (
                <div className="grid-3">
                  {sitters.map((sitter) => (
                    <SitterCard key={sitter._id} sitter={sitter} />
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
