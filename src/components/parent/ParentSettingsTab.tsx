'use client';

import React from 'react';

interface ParentSettingsTabProps {
  parentAddress: string;
  setParentAddress: (val: string) => void;
  childrenCount: number | string;
  setChildrenCount: (val: number | string) => void;
  childrenAges: string;
  setChildrenAges: (val: string) => void;
  specialNeeds: string;
  setSpecialNeeds: (val: string) => void;
  handleSaveProfile: (e: React.FormEvent) => void;
}

export default function ParentSettingsTab({
  parentAddress,
  setParentAddress,
  childrenCount,
  setChildrenCount,
  childrenAges,
  setChildrenAges,
  specialNeeds,
  setSpecialNeeds,
  handleSaveProfile
}: ParentSettingsTabProps) {
  return (
    <div className="card" style={{ padding: '32px' }}>
      <h3 style={{ fontSize: '22px', marginBottom: '8px', fontWeight: '600' }}>Household & Family Settings</h3>
      <p style={{ color: 'var(--color-body)', fontSize: '14px', marginBottom: '24px' }}>
        Keep your family information updated so babysitters can better understand your childcare environment.
      </p>

      <form onSubmit={handleSaveProfile}>
        <div className="form-group">
          <label className="form-label" style={{ fontWeight: '600' }}>Home Address / Area</label>
          <input 
            type="text" 
            placeholder="House #, Road #, Area, Dhaka" 
            className="form-control"
            value={parentAddress}
            onChange={(e) => setParentAddress(e.target.value)}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: '600' }}>Number of Children</label>
            <input 
              type="number" 
              min="1" 
              className="form-control"
              value={childrenCount}
              onChange={(e) => setChildrenCount(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontWeight: '600' }}>Children Ages (e.g. 2 yrs, 5 yrs)</label>
            <input 
              type="text" 
              placeholder="e.g. 2, 5" 
              className="form-control"
              value={childrenAges}
              onChange={(e) => setChildrenAges(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" style={{ fontWeight: '600' }}>Allergies or Special Care Notes</label>
          <textarea 
            rows={3} 
            placeholder="Mention allergies, food preferences, bedtime routines..." 
            className="form-control"
            value={specialNeeds}
            onChange={(e) => setSpecialNeeds(e.target.value)}
          ></textarea>
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', fontSize: '15px' }}>
          Save Family Settings
        </button>
      </form>
    </div>
  );
}
