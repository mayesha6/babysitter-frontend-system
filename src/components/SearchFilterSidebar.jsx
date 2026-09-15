'use client';

import React from 'react';
import { SlidersHorizontal, MapPin, RotateCcw } from 'lucide-react';

export default function SearchFilterSidebar({
  address,
  setAddress,
  maxRate,
  setMaxRate,
  gender,
  setGender,
  employmentType,
  setEmploymentType,
  onReset
}) {
  return (
    <div className="card" style={{ padding: '28px', position: 'sticky', top: '100px' }}>
      
      {/* Header & Reset */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '2px solid var(--color-gray-border)', paddingBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <SlidersHorizontal size={18} style={{ color: 'var(--color-primary-dark)' }} />
          <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Filter Sitters</h3>
        </div>
        
        {onReset && (
          <button 
            onClick={onReset} 
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-body)',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer'
            }}
            title="Reset Filters"
          >
            <RotateCcw size={14} /> Reset
          </button>
        )}
      </div>

      {/* Address / Location Search Filter */}
      <div className="form-group" style={{ marginBottom: '20px' }}>
        <label className="form-label" style={{ fontWeight: '600', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
          Location / Area
        </label>
        <div style={{ position: 'relative' }}>
          <input 
            type="text" 
            placeholder="e.g. Dhanmondi, Gulshan..." 
            className="form-control" 
            style={{ paddingLeft: '40px', width: '100%' }}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <MapPin size={16} style={{ position: 'absolute', left: '14px', top: '16px', color: 'var(--color-body)' }} />
        </div>
      </div>

      {/* Hourly Rate Slider */}
      <div className="form-group" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <label className="form-label" style={{ fontWeight: '600', fontSize: '14px' }}>Max Rate / Hr</label>
          <span style={{ fontWeight: '600', color: 'var(--color-secondary-dark)', fontSize: '16px' }}>৳{maxRate}</span>
        </div>
        <input 
          type="range" 
          min="50" 
          max="500" 
          step="10"
          value={maxRate}
          onChange={(e) => setMaxRate(Number(e.target.value))}
          style={{ width: '100%', accentColor: 'var(--color-secondary)', cursor: 'pointer' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--color-body)', marginTop: '4px' }}>
          <span>৳50/hr</span>
          <span>৳500/hr</span>
        </div>
      </div>

      {/* Gender Select */}
      <div className="form-group" style={{ marginBottom: '20px' }}>
        <label className="form-label" style={{ fontWeight: '600', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
          Sitter Gender
        </label>
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

      {/* Employment / Job Type Select */}
      <div className="form-group" style={{ marginBottom: '10px' }}>
        <label className="form-label" style={{ fontWeight: '600', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
          Job Employment Type
        </label>
        <select 
          className="form-control" 
          value={employmentType}
          onChange={(e) => setEmploymentType(e.target.value)}
        >
          <option value="">Any Employment Type</option>
          <option value="FULL_TIME">Full Time (Monthly)</option>
          <option value="PART_TIME">Part Time (Daily)</option>
          <option value="WEEKEND">Weekend Only</option>
        </select>
      </div>

    </div>
  );
}
