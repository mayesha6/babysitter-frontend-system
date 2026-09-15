'use client';

import React, { useState } from 'react';
import { Calendar, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import api from '../services/api';

export default function SitterBookingCard({ sitter, userId }) {
  const { user: currentUser } = useApp();

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('09:00 AM');
  const [endTime, setEndTime] = useState('05:00 PM');
  const [totalHours, setTotalHours] = useState(8);
  const [additionalInfo, setAdditionalInfo] = useState('');

  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const hourlyRate = sitter?.hourlyRate || 150;
  const estimatedTotal = hourlyRate * Number(totalHours || 0);

  const handleBook = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert('Please log in as a Parent to book a babysitter.');
      return;
    }
    if (currentUser.role !== 'PARENT') {
      alert('Only Parents are authorized to request bookings.');
      return;
    }
    if (!startDate || !endDate) {
      alert('Please select valid start and end dates.');
      return;
    }

    setBookingLoading(true);
    try {
      const payload = {
        sitter: userId,
        startDate,
        endDate,
        startTime,
        endTime,
        hourlyRate,
        totalHours: Number(totalHours),
        additionalInfo
      };

      await api.post('/bookings', payload);
      setBookingSuccess(true);
      setAdditionalInfo('');
      setTimeout(() => {
        setBookingSuccess(false);
      }, 4000);
    } catch (err) {
      alert(err.message || 'Booking submission failed. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="card" style={{ padding: '28px', position: 'sticky', top: '100px' }}>
      
      {/* Price Header */}
      <div style={{ borderBottom: '2px solid var(--color-gray-border)', paddingBottom: '16px', marginBottom: '20px', textAlign: 'center' }}>
        <div style={{ fontSize: '13px', color: 'var(--color-body)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Hourly Charge</div>
        <div style={{ fontSize: '36px', fontWeight: '600', color: 'var(--color-dark)', marginTop: '2px' }}>
          ৳{hourlyRate}<span style={{ fontSize: '16px', fontWeight: '500', color: 'var(--color-body)' }}>/hr</span>
        </div>
      </div>

      {bookingSuccess && (
        <div style={{ background: 'rgba(76, 217, 100, 0.12)', border: '1px solid var(--color-success)', color: 'var(--color-success)', padding: '12px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={18} />
          <span>Booking requested successfully!</span>
        </div>
      )}

      <form onSubmit={handleBook}>
        
        {/* Start Date */}
        <div className="form-group" style={{ marginBottom: '16px' }}>
          <label className="form-label" style={{ fontWeight: '600', fontSize: '13px', marginBottom: '6px', display: 'block' }}>Start Date</label>
          <div style={{ position: 'relative' }}>
            <input 
              type="date" 
              className="form-control" 
              style={{ width: '100%', paddingLeft: '40px' }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
            <Calendar size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--color-body)' }} />
          </div>
        </div>

        {/* End Date */}
        <div className="form-group" style={{ marginBottom: '16px' }}>
          <label className="form-label" style={{ fontWeight: '600', fontSize: '13px', marginBottom: '6px', display: 'block' }}>End Date</label>
          <div style={{ position: 'relative' }}>
            <input 
              type="date" 
              className="form-control" 
              style={{ width: '100%', paddingLeft: '40px' }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
            <Calendar size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--color-body)' }} />
          </div>
        </div>

        {/* Start & End Time */}
        <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: '600', fontSize: '13px', marginBottom: '6px', display: 'block' }}>Start Time</label>
            <input 
              type="text" 
              placeholder="09:00 AM" 
              className="form-control"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: '600', fontSize: '13px', marginBottom: '6px', display: 'block' }}>End Time</label>
            <input 
              type="text" 
              placeholder="05:00 PM" 
              className="form-control"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </div>

        {/* Total Hours */}
        <div className="form-group" style={{ marginBottom: '16px' }}>
          <label className="form-label" style={{ fontWeight: '600', fontSize: '13px', marginBottom: '6px', display: 'block' }}>Total Hours</label>
          <input 
            type="number" 
            min="1"
            className="form-control"
            value={totalHours}
            onChange={(e) => setTotalHours(Number(e.target.value))}
          />
        </div>

        {/* Special Instructions */}
        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label className="form-label" style={{ fontWeight: '600', fontSize: '13px', marginBottom: '6px', display: 'block' }}>Special Instructions</label>
          <textarea 
            rows="3" 
            placeholder="Children allergy alerts, food preference, bedtime..."
            className="form-control"
            style={{ width: '100%' }}
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
          ></textarea>
        </div>

        {/* Estimated Price Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-bg-light)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', marginBottom: '20px' }}>
          <span style={{ fontSize: '14px', color: 'var(--color-body)' }}>Estimated Cost:</span>
          <span style={{ fontSize: '18px', fontWeight: '600', color: 'var(--color-primary-dark)' }}>৳{estimatedTotal}</span>
        </div>

        {/* Submit Hire Button */}
        <button 
          type="submit" 
          disabled={bookingLoading} 
          className="btn btn-secondary" 
          style={{ width: '100%', padding: '14px', fontSize: '15px', fontWeight: '600' }}
        >
          {bookingLoading ? 'Submitting Request...' : 'Book This Sitter'}
        </button>

      </form>
    </div>
  );
}
