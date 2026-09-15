'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Briefcase, CalendarCheck, Sparkles, ArrowRight } from 'lucide-react';

export default function ParentOverviewTab({ myJobs = [], myBookings = [], setActiveTab }) {
  const router = useRouter();

  const activeBookingsCount = myBookings.filter(b => b.status === 'ACCEPTED').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* Summary Cards Grid */}
      <div className="grid-3">
        {/* Card 1: Job Posts */}
        <div 
          className="card" 
          style={{
            background: 'linear-gradient(135deg, rgba(255,162,188,0.12) 0%, rgba(255,255,255,1) 100%)',
            textAlign: 'center',
            padding: '28px 20px',
            border: '1px solid var(--color-gray-border)'
          }}
        >
          <div style={{ color: 'var(--color-primary-dark)', display: 'inline-flex', marginBottom: '8px' }}>
            <Briefcase size={28} />
          </div>
          <h4 style={{ color: 'var(--color-dark)', fontSize: '15px', fontWeight: '600' }}>Posted Jobs</h4>
          <div style={{ fontSize: '38px', fontWeight: '800', margin: '8px 0', color: 'var(--color-dark)' }}>{myJobs.length}</div>
          <button 
            onClick={() => setActiveTab('my-jobs')} 
            className="btn btn-outline" 
            style={{ padding: '6px 16px', fontSize: '12px', boxShadow: 'none', borderColor: 'var(--color-primary)' }}
          >
            Manage Jobs
          </button>
        </div>

        {/* Card 2: Active Bookings */}
        <div 
          className="card" 
          style={{
            background: 'linear-gradient(135deg, rgba(185,150,254,0.12) 0%, rgba(255,255,255,1) 100%)',
            textAlign: 'center',
            padding: '28px 20px',
            border: '1px solid var(--color-gray-border)'
          }}
        >
          <div style={{ color: 'var(--color-secondary-dark)', display: 'inline-flex', marginBottom: '8px' }}>
            <CalendarCheck size={28} />
          </div>
          <h4 style={{ color: 'var(--color-dark)', fontSize: '15px', fontWeight: '600' }}>Active Bookings</h4>
          <div style={{ fontSize: '38px', fontWeight: '800', margin: '8px 0', color: 'var(--color-dark)' }}>
            {activeBookingsCount}
          </div>
          <button 
            onClick={() => setActiveTab('bookings')} 
            className="btn btn-outline" 
            style={{ padding: '6px 16px', fontSize: '12px', boxShadow: 'none', borderColor: 'var(--color-secondary)' }}
          >
            View Bookings
          </button>
        </div>

        {/* Card 3: Hiring Shortcuts */}
        <div 
          className="card" 
          style={{
            background: 'linear-gradient(135deg, rgba(109,193,160,0.12) 0%, rgba(255,255,255,1) 100%)',
            textAlign: 'center',
            padding: '28px 20px',
            border: '1px solid var(--color-gray-border)'
          }}
        >
          <div style={{ color: 'var(--color-tertiary-dark)', display: 'inline-flex', marginBottom: '8px' }}>
            <Sparkles size={28} />
          </div>
          <h4 style={{ color: 'var(--color-dark)', fontSize: '15px', fontWeight: '600' }}>Quick Actions</h4>
          <div style={{ margin: '14px 0 0 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button 
              onClick={() => setActiveTab('create-job')} 
              className="btn btn-primary" 
              style={{ padding: '8px 14px', fontSize: '12px', width: '100%', boxShadow: 'none' }}
            >
              Post a New Job
            </button>
            <button 
              onClick={() => router.push('/search')} 
              className="btn btn-secondary" 
              style={{ padding: '8px 14px', fontSize: '12px', width: '100%', boxShadow: 'none' }}
            >
              Find Sitters
            </button>
          </div>
        </div>
      </div>

      {/* Recent Bookings Table Card */}
      <div className="card" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '700' }}>Recent Contract Bookings</h3>
          <button 
            onClick={() => setActiveTab('bookings')} 
            style={{ background: 'none', border: 'none', color: 'var(--color-secondary-dark)', fontWeight: '700', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            View All <ArrowRight size={14} />
          </button>
        </div>

        {myBookings.length === 0 ? (
          <p style={{ color: 'var(--color-body)', fontSize: '14px', textAlign: 'center', padding: '30px 0' }}>
            No bookings created yet. You can hire a sitter from the directory or accept job applicants.
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-gray-border)', color: 'var(--color-body)' }}>
                  <th style={{ padding: '12px 10px', fontWeight: '600' }}>Babysitter</th>
                  <th style={{ padding: '12px 10px', fontWeight: '600' }}>Dates</th>
                  <th style={{ padding: '12px 10px', fontWeight: '600' }}>Total Cost</th>
                  <th style={{ padding: '12px 10px', fontWeight: '600' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {myBookings.slice(0, 4).map((b) => (
                  <tr key={b._id} style={{ borderBottom: '1px solid var(--color-gray-border)' }}>
                    <td style={{ padding: '14px 10px', fontWeight: '700', color: 'var(--color-dark)' }}>
                      {b.sitter?.name || 'Vetted Sitter'}
                    </td>
                    <td style={{ padding: '14px 10px', color: 'var(--color-body)' }}>
                      {b.startDate} to {b.endDate}
                    </td>
                    <td style={{ padding: '14px 10px', fontWeight: '700', color: 'var(--color-primary-dark)' }}>
                      ৳{b.totalAmount || b.hourlyRate * b.totalHours}
                    </td>
                    <td style={{ padding: '14px 10px' }}>
                      <span className={`badge ${b.status === 'ACCEPTED' ? 'badge-verified' : 'badge-pending'}`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
