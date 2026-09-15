'use client';

import React from 'react';
import { PlusCircle } from 'lucide-react';

export default function ParentPostJobTab({
  title, setTitle,
  description, setDescription,
  hourlyRate, setHourlyRate,
  location, setLocation,
  startDate, setStartDate,
  endDate, setEndDate,
  startTime, setStartTime,
  endTime, setEndTime,
  jobType, setJobType,
  childName, setChildName,
  childAge, setChildAge,
  childGender, setChildGender,
  handlePostJob
}) {
  return (
    <div className="card" style={{ padding: '36px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', borderBottom: '2px solid var(--color-gray-border)', paddingBottom: '16px' }}>
        <PlusCircle size={24} style={{ color: 'var(--color-primary-dark)' }} />
        <div>
          <h3 style={{ fontSize: '22px', fontWeight: '600' }}>Post a New Childcare Job</h3>
          <p style={{ fontSize: '13px', color: 'var(--color-body)' }}>Fill in the details below to publish your job offer to verified babysitters.</p>
        </div>
      </div>

      <form onSubmit={handlePostJob}>
        {/* Job Title */}
        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label className="form-label" style={{ fontWeight: '600' }}>Job Title *</label>
          <input 
            type="text" 
            placeholder="e.g. Need a Babysitter for 2 toddlers on weekends" 
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Job Description */}
        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label className="form-label" style={{ fontWeight: '600' }}>Job Description & Special Rules *</label>
          <textarea 
            rows="4" 
            placeholder="Describe child details, expectations, crafts, meal rules, bedtime routines..."
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        {/* Hourly Rate & Location */}
        <div className="form-row" style={{ marginBottom: '20px' }}>
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: '600' }}>Hourly Rate Budget (৳/hr) *</label>
            <input 
              type="number" 
              min="50"
              className="form-control"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(Number(e.target.value))}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: '600' }}>Job Location *</label>
            <input 
              type="text" 
              placeholder="e.g. Dhanmondi, Dhaka" 
              className="form-control"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Start Date & End Date */}
        <div className="form-row" style={{ marginBottom: '20px' }}>
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: '600' }}>Start Date *</label>
            <input 
              type="date" 
              className="form-control"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: '600' }}>End Date *</label>
            <input 
              type="date" 
              className="form-control"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Start Time & End Time */}
        <div className="form-row" style={{ marginBottom: '20px' }}>
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: '600' }}>Start Time</label>
            <input 
              type="text" 
              placeholder="09:00 AM" 
              className="form-control"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: '600' }}>End Time</label>
            <input 
              type="text" 
              placeholder="05:00 PM" 
              className="form-control"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </div>

        {/* Job Type & Child Name */}
        <div className="form-row" style={{ marginBottom: '20px' }}>
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: '600' }}>Job Type</label>
            <select 
              className="form-control"
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
            >
              <option value="PART_TIME">Part Time (Daily)</option>
              <option value="FULL_TIME">Full Time (Monthly)</option>
              <option value="WEEKEND">Weekend Only</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: '600' }}>Child Name</label>
            <input 
              type="text" 
              placeholder="e.g. Leo" 
              className="form-control"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
            />
          </div>
        </div>

        {/* Child Age & Gender */}
        <div className="form-row" style={{ marginBottom: '28px' }}>
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: '600' }}>Child Age (Years)</label>
            <input 
              type="number" 
              placeholder="e.g. 3" 
              className="form-control"
              value={childAge}
              onChange={(e) => setChildAge(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: '600' }}>Child Gender</label>
            <select 
              className="form-control"
              value={childGender}
              onChange={(e) => setChildGender(e.target.value)}
            >
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="MIXED">Mixed (Multiple Kids)</option>
            </select>
          </div>
        </div>

        <button 
          type="submit" 
          className="btn btn-primary" 
          style={{ width: '100%', padding: '16px', fontSize: '16px', fontWeight: '600' }}
        >
          Publish Childcare Job Post
        </button>
      </form>
    </div>
  );
}
