'use client';

import React from 'react';

interface ParentPostJobTabProps {
  jobTitle: string;
  setJobTitle: (val: string) => void;
  jobDescription: string;
  setJobDescription: (val: string) => void;
  jobLocation: string;
  setJobLocation: (val: string) => void;
  hourlyRate: string | number;
  setHourlyRate: (val: string | number) => void;
  jobType: string;
  setJobType: (val: string) => void;
  startDate: string;
  setStartDate: (val: string) => void;
  endDate: string;
  setEndDate: (val: string) => void;
  startTime: string;
  setStartTime: (val: string) => void;
  endTime: string;
  setEndTime: (val: string) => void;
  childName?: string;
  setChildName?: (val: string) => void;
  childAge?: string | number;
  setChildAge?: (val: string | number) => void;
  handleCreateJob: (e: React.FormEvent) => void;
}

export default function ParentPostJobTab({
  jobTitle,
  setJobTitle,
  jobDescription,
  setJobDescription,
  jobLocation,
  setJobLocation,
  hourlyRate,
  setHourlyRate,
  jobType,
  setJobType,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  childName,
  setChildName,
  childAge,
  setChildAge,
  handleCreateJob
}: ParentPostJobTabProps) {
  return (
    <div className="card" style={{ padding: '32px' }}>
      <h3 style={{ fontSize: '22px', marginBottom: '8px', fontWeight: '600' }}>Post a New Childcare Job</h3>
      <p style={{ color: 'var(--color-body)', fontSize: '14px', marginBottom: '24px' }}>
        Fill in your job details to connect with verified babysitter candidates in your neighborhood.
      </p>

      <form onSubmit={handleCreateJob}>
        <div className="form-group">
          <label className="form-label" style={{ fontWeight: '600' }}>Job Title</label>
          <input 
            type="text" 
            placeholder="e.g. Seeking Weekend Babysitter for 2-year-old" 
            className="form-control" 
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: '600' }}>Location / Area</label>
            <input 
              type="text" 
              placeholder="e.g. Dhanmondi, Dhaka" 
              className="form-control" 
              value={jobLocation}
              onChange={(e) => setJobLocation(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontWeight: '600' }}>Hourly Rate (৳/hr)</label>
            <input 
              type="number" 
              placeholder="350" 
              className="form-control" 
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" style={{ fontWeight: '600' }}>Job Type</label>
          <select 
            className="form-control"
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
          >
            <option value="PART_TIME">Part-Time Care</option>
            <option value="FULL_TIME">Full-Time Care</option>
            <option value="WEEKEND">Weekend Nanny</option>
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: '600' }}>Start Date</label>
            <input 
              type="date" 
              className="form-control" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontWeight: '600' }}>End Date</label>
            <input 
              type="date" 
              className="form-control" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: '600' }}>Daily Start Time</label>
            <input 
              type="time" 
              className="form-control" 
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontWeight: '600' }}>Daily End Time</label>
            <input 
              type="time" 
              className="form-control" 
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: '600' }}>Child Name / Nickname</label>
            <input 
              type="text" 
              placeholder="e.g. Aayan" 
              className="form-control" 
              value={childName || ''}
              onChange={(e) => setChildName && setChildName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontWeight: '600' }}>Child Age</label>
            <input 
              type="number" 
              placeholder="e.g. 3" 
              className="form-control" 
              value={childAge || ''}
              onChange={(e) => setChildAge && setChildAge(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" style={{ fontWeight: '600' }}>Job Description & Requirements</label>
          <textarea 
            rows={4} 
            placeholder="Describe your child care needs, schedule expectations, required CPR certifications, etc." 
            className="form-control"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            required
          ></textarea>
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', fontSize: '16px', marginTop: '10px' }}>
          Publish Job Requirement
        </button>
      </form>
    </div>
  );
}
