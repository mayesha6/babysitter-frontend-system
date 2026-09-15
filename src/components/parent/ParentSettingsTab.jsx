'use client';

import React from 'react';
import { UserCheck, Save } from 'lucide-react';

export default function ParentSettingsTab({
  address, setAddress,
  parentChildName, setParentChildName,
  parentChildAge, setParentChildAge,
  parentChildGender, setParentChildGender,
  expectedHourlyBudget, setExpectedHourlyBudget,
  handleUpdateProfile
}) {
  return (
    <div className="card" style={{ padding: '36px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', borderBottom: '2px solid var(--color-gray-border)', paddingBottom: '16px' }}>
        <UserCheck size={24} style={{ color: 'var(--color-primary-dark)' }} />
        <div>
          <h3 style={{ fontSize: '22px', fontWeight: '700' }}>Parent Profile Settings</h3>
          <p style={{ fontSize: '13px', color: 'var(--color-body)' }}>Update your home location, child preferences, and default hourly budget.</p>
        </div>
      </div>

      <form onSubmit={handleUpdateProfile}>
        
        {/* Location Address */}
        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label className="form-label" style={{ fontWeight: '600' }}>Home Address / Area</label>
          <input 
            type="text" 
            placeholder="e.g. House 12, Road 5, Dhanmondi, Dhaka" 
            className="form-control"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        {/* Child Name */}
        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label className="form-label" style={{ fontWeight: '600' }}>Child Name</label>
          <input 
            type="text" 
            placeholder="e.g. Lily" 
            className="form-control"
            value={parentChildName}
            onChange={(e) => setParentChildName(e.target.value)}
          />
        </div>

        {/* Child Age & Gender */}
        <div className="form-row" style={{ marginBottom: '20px' }}>
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: '600' }}>Child Age (Years)</label>
            <input 
              type="number" 
              placeholder="e.g. 3" 
              className="form-control"
              value={parentChildAge}
              onChange={(e) => setParentChildAge(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: '600' }}>Child Gender</label>
            <select 
              className="form-control"
              value={parentChildGender}
              onChange={(e) => setParentChildGender(e.target.value)}
            >
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="MIXED">Mixed (Multiple Kids)</option>
            </select>
          </div>
        </div>

        {/* Expected Hourly Budget */}
        <div className="form-group" style={{ marginBottom: '28px' }}>
          <label className="form-label" style={{ fontWeight: '600' }}>Expected Hourly Budget (৳/hr)</label>
          <input 
            type="number" 
            min="50"
            className="form-control"
            value={expectedHourlyBudget}
            onChange={(e) => setExpectedHourlyBudget(Number(e.target.value))}
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-primary" 
          style={{ width: '100%', padding: '16px', fontSize: '16px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          <Save size={18} /> Update Profile Information
        </button>
      </form>
    </div>
  );
}
