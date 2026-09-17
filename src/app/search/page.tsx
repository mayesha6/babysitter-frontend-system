'use client';

import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SitterCard from '../../components/SitterCard';
import SearchFilterSidebar from '../../components/SearchFilterSidebar';
import Pagination, { PaginationMeta } from '../../components/Pagination';
import api from '../../services/api';
import { Info, Sparkles } from 'lucide-react';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('ALL');
  const [maxHourlyRate, setMaxHourlyRate] = useState(500);
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [selectedAvailability, setSelectedAvailability] = useState('ALL');
  const [cprOnly, setCprOnly] = useState(false);

  // Pagination states
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta>({
    page: 1,
    limit: 6,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [sitters, setSitters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedLocation('ALL');
    setMaxHourlyRate(500);
    setOnlyVerified(false);
    setSelectedAvailability('ALL');
    setCprOnly(false);
    setPage(1);
  };

  const fetchSitters = async () => {
    setLoading(true);
    try {
      const params: any = {
        page,
        limit,
        search: searchQuery || undefined,
        location: selectedLocation !== 'ALL' ? selectedLocation : undefined,
        maxRate: maxHourlyRate,
        verified: onlyVerified ? 'true' : undefined,
        employmentType: selectedAvailability !== 'ALL' ? selectedAvailability : undefined,
      };

      const response: any = await api.get('/sitter-profile', { params });

      // Extract metadata from backend response format
      const backendMeta = response.meta || response.pagination || response.metaData;
      const dataList = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response)
        ? response
        : [];

      if (backendMeta) {
        setSitters(dataList);
        setPaginationMeta({
          page: backendMeta.page || page,
          limit: backendMeta.limit || limit,
          total: backendMeta.total || dataList.length,
          totalPages: backendMeta.totalPages || Math.ceil((backendMeta.total || dataList.length) / limit),
          hasNextPage: backendMeta.hasNextPage ?? page < (backendMeta.totalPages || 1),
          hasPrevPage: backendMeta.hasPrevPage ?? page > 1,
        });
      } else {
        // Filter locally if backend returned raw list without pagination metadata
        const results = dataList.filter((s: any) => {
          if (searchQuery && !s.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) && !s.skills?.some((sk: string) => sk.toLowerCase().includes(searchQuery.toLowerCase()))) {
            return false;
          }
          if (selectedLocation !== 'ALL' && !s.address?.toLowerCase().includes(selectedLocation.toLowerCase())) {
            return false;
          }
          if (s.hourlyRate && s.hourlyRate > maxHourlyRate) {
            return false;
          }
          if (onlyVerified && s.verificationStatus !== 'VERIFIED') {
            return false;
          }
          if (selectedAvailability !== 'ALL' && s.employmentType !== selectedAvailability) {
            return false;
          }
          return true;
        });

        const totalItems = results.length;
        const totalPagesCount = Math.max(1, Math.ceil(totalItems / limit));
        const paginatedSlice = results.slice((page - 1) * limit, page * limit);

        setSitters(paginatedSlice);
        setPaginationMeta({
          page,
          limit,
          total: totalItems,
          totalPages: totalPagesCount,
          hasNextPage: page < totalPagesCount,
          hasPrevPage: page > 1,
        });
      }
    } catch (err: any) {
      console.warn('API error fetching sitters, loading fallback mock data with pagination.', err.message);
      const mocks = [
        {
          _id: 's1',
          user: { _id: 'sitter1', name: 'Jannat ul Ferdous' },
          address: 'Dhanmondi, Dhaka',
          averageRating: 4.9,
          reviewCount: 18,
          hourlyRate: 350,
          skills: ['CPR Certified', 'Newborn Expert', 'Creative Play'],
          verificationStatus: 'VERIFIED',
          employmentType: 'FULL_TIME'
        },
        {
          _id: 's2',
          user: { _id: 'sitter2', name: 'Mayesha Islam' },
          address: 'Gulshan, Dhaka',
          averageRating: 4.8,
          reviewCount: 22,
          hourlyRate: 450,
          skills: ['First Aid', 'First Year Milestones', 'Puzzles'],
          verificationStatus: 'VERIFIED',
          employmentType: 'PART_TIME'
        },
        {
          _id: 's3',
          user: { _id: 'sitter3', name: 'Sultana Nigar' },
          address: 'Mirpur, Dhaka',
          averageRating: 4.7,
          reviewCount: 12,
          hourlyRate: 300,
          skills: ['Cooking', 'Art & Craft', 'Bedtime Routines'],
          verificationStatus: 'VERIFIED',
          employmentType: 'WEEKEND'
        },
        {
          _id: 's4',
          user: { _id: 'sitter4', name: 'Nusaiba Rahman' },
          address: 'Uttara, Dhaka',
          averageRating: 4.9,
          reviewCount: 30,
          hourlyRate: 400,
          skills: ['Special Needs', 'Toddlers', 'Storytelling'],
          verificationStatus: 'VERIFIED',
          employmentType: 'FULL_TIME'
        },
        {
          _id: 's5',
          user: { _id: 'sitter5', name: 'Tasnim Akter' },
          address: 'Banani, Dhaka',
          averageRating: 4.6,
          reviewCount: 9,
          hourlyRate: 320,
          skills: ['Drawing', 'Outdoor Play', 'First Aid'],
          verificationStatus: 'VERIFIED',
          employmentType: 'PART_TIME'
        },
        {
          _id: 's6',
          user: { _id: 'sitter6', name: 'Farhana Yeasmin' },
          address: 'Mohakhali, Dhaka',
          averageRating: 4.8,
          reviewCount: 15,
          hourlyRate: 380,
          skills: ['Infant Care', 'Singing', 'Potty Training'],
          verificationStatus: 'VERIFIED',
          employmentType: 'WEEKEND'
        },
        {
          _id: 's7',
          user: { _id: 'sitter7', name: 'Ayesha Siddiqua' },
          address: 'Bashundhara, Dhaka',
          averageRating: 5.0,
          reviewCount: 40,
          hourlyRate: 500,
          skills: ['Montessori Training', 'Bilingual', 'CPR Certified'],
          verificationStatus: 'VERIFIED',
          employmentType: 'FULL_TIME'
        }
      ];

      const filtered = mocks.filter((s) => {
        if (searchQuery && !s.user.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        if (selectedLocation !== 'ALL' && !s.address.toLowerCase().includes(selectedLocation.toLowerCase())) return false;
        if (s.hourlyRate > maxHourlyRate) return false;
        if (onlyVerified && s.verificationStatus !== 'VERIFIED') return false;
        if (selectedAvailability !== 'ALL' && s.employmentType !== selectedAvailability) return false;
        return true;
      });

      const totalCount = filtered.length;
      const totalPagesCount = Math.max(1, Math.ceil(totalCount / limit));
      const sliced = filtered.slice((page - 1) * limit, page * limit);

      setSitters(sliced);
      setPaginationMeta({
        page,
        limit,
        total: totalCount,
        totalPages: totalPagesCount,
        hasNextPage: page < totalPagesCount,
        hasPrevPage: page > 1,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchSitters();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, selectedLocation, maxHourlyRate, onlyVerified, selectedAvailability, cprOnly, page, limit]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />

      <main style={{ flex: 1, padding: '50px 0', background: 'var(--color-bg-light)' }}>
        <div className="container">
          
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--color-primary-dark)', fontWeight: '600', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
              <Sparkles size={16} /> Directory Search
            </div>
            <h2 style={{ fontSize: '36px', fontWeight: '600' }}>Find a Qualified Babysitter</h2>
            <p style={{ color: 'var(--color-body)', fontSize: '15px', marginTop: '4px' }}>
              Filter through verified babysitters to find the perfect helper for your family.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '32px' }}>
            
            <SearchFilterSidebar 
              searchQuery={searchQuery} setSearchQuery={setSearchQuery}
              selectedLocation={selectedLocation} setSelectedLocation={setSelectedLocation}
              maxHourlyRate={maxHourlyRate} setMaxHourlyRate={setMaxHourlyRate}
              onlyVerified={onlyVerified} setOnlyVerified={setOnlyVerified}
              selectedAvailability={selectedAvailability} setSelectedAvailability={setSelectedAvailability}
              cprOnly={cprOnly} setCprOnly={setCprOnly}
              handleResetFilters={handleResetFilters}
            />

            <div>
              {loading ? (
                <div className="card" style={{ padding: '60px', textAlign: 'center', color: 'var(--color-body)' }}>
                  Loading matching sitters...
                </div>
              ) : sitters.length === 0 ? (
                <div className="card" style={{ padding: '60px', textAlign: 'center', color: 'var(--color-body)' }}>
                  <Info size={40} style={{ margin: '0 auto 12px auto', color: 'var(--color-secondary)' }} />
                  <h3 style={{ fontSize: '20px', color: 'var(--color-dark)', marginBottom: '8px', fontWeight: '600' }}>No Babysitters Found</h3>
                  <p style={{ marginBottom: '16px' }}>Try expanding your filter criteria or changing the location query.</p>
                  <button onClick={handleResetFilters} className="btn btn-outline" style={{ padding: '8px 20px', fontSize: '14px' }}>
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <>
                  <div style={{ fontSize: '14px', color: 'var(--color-body)', marginBottom: '16px', fontWeight: '600' }}>
                    Showing {sitters.length} of {paginationMeta.total} verified babysitter{paginationMeta.total > 1 ? 's' : ''}
                  </div>

                  <div className="grid-3">
                    {sitters.map((sitter) => (
                      <SitterCard key={sitter._id} sitter={sitter} />
                    ))}
                  </div>

                  {/* Backend Meta Pagination & Limit Selector */}
                  <Pagination
                    meta={paginationMeta}
                    onPageChange={(newPage) => setPage(newPage)}
                    onLimitChange={(newLimit) => {
                      setLimit(newLimit);
                      setPage(1);
                    }}
                    loading={loading}
                    itemLabel="babysitters"
                  />
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

