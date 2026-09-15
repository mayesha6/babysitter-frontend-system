'use client';

import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';

interface SearchFilterSidebarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedLocation: string;
  setSelectedLocation: (val: string) => void;
  maxHourlyRate: number;
  setMaxHourlyRate: (val: number) => void;
  onlyVerified: boolean;
  setOnlyVerified: (val: boolean) => void;
  selectedAvailability: string;
  setSelectedAvailability: (val: string) => void;
  cprOnly: boolean;
  setCprOnly: (val: boolean) => void;
  handleResetFilters: () => void;
}

export default function SearchFilterSidebar({
  searchQuery,
  setSearchQuery,
  selectedLocation,
  setSelectedLocation,
  maxHourlyRate,
  setMaxHourlyRate,
  onlyVerified,
  setOnlyVerified,
  selectedAvailability,
  setSelectedAvailability,
  cprOnly,
  setCprOnly,
  handleResetFilters
}: SearchFilterSidebarProps) {
  return (
    <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-gray-border)', paddingBottom: '12px' }}>
        <h3 style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}>
          <Filter size={18} /> Filters
        </h3>
        <button 
          onClick={handleResetFilters}
          style={{ background: 'none', border: 'none', color: 'var(--color-secondary)', fontSize: '12px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          <RotateCcw size={12} /> Reset All
        </button>
      </div>

      {/* Name / Keyword Search */}
      <div className="form-group">
        <label className="form-label" style={{ fontWeight: '600' }}>Sitter Name or Skill</label>
        <input 
          type="text" 
          placeholder="e.g. Jannat, CPR, Drawing..." 
          className="form-control"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Area Location Filter */}
      <div className="form-group">
        <label className="form-label" style={{ fontWeight: '600' }}>Location / Area</label>
        <select 
          className="form-control"
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
        >
          <option value="ALL">All Areas (Dhaka)</option>
          <option value="Dhanmondi">Dhanmondi</option>
          <option value="Gulshan">Gulshan / Banani</option>
          <option value="Uttara">Uttara</option>
          <option value="Mirpur">Mirpur</option>
          <option value="Mohammadpur">Mohammadpur</option>
        </select>
      </div>

      {/* Maximum Hourly Rate */}
      <div className="form-group">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <label className="form-label" style={{ fontWeight: '600' }}>Max Hourly Rate</label>
          <span style={{ fontWeight: '600', color: 'var(--color-primary-dark)', fontSize: '14px' }}>৳{maxHourlyRate}/hr</span>
        </div>
        <input 
          type="range" 
          min="200" 
          max="1000" 
          step="50"
          value={maxHourlyRate}
          onChange={(e) => setMaxHourlyRate(Number(e.target.value))}
          style={{ width: '100%', accentColor: 'var(--color-primary)' }}
        />
      </div>

      {/* Availability Filter */}
      <div className="form-group">
        <label className="form-label" style={{ fontWeight: '600' }}>Care Availability</label>
        <select 
          className="form-control"
          value={selectedAvailability}
          onChange={(e) => setSelectedAvailability(e.target.value)}
        >
          <option value="ALL">Any Schedule</option>
          <option value="FULL_TIME">Full-time Care</option>
          <option value="PART_TIME">Part-time Care</option>
          <option value="WEEKEND">Weekend Nanny</option>
        </select>
      </div>

      {/* Verification Checkboxes */}
      <div style={{ borderTop: '1px solid var(--color-gray-border)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', cursor: 'pointer' }}>
          <input 
            type="checkbox" 
            checked={onlyVerified} 
            onChange={(e) => setOnlyVerified(e.target.checked)}
            style={{ width: '16px', height: '16px', accentColor: 'var(--color-tertiary-dark)' }}
          />
          <span style={{ fontWeight: '600' }}>Show Verified Sitters Only (NID & Police)</span>
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', cursor: 'pointer' }}>
          <input 
            type="checkbox" 
            checked={cprOnly} 
            onChange={(e) => setCprOnly(e.target.checked)}
            style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }}
          />
          <span>CPR / First Aid Certified Only</span>
        </label>
      </div>
    </div>
  );
}
