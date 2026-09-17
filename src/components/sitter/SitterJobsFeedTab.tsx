'use client';

import React, { useState } from 'react';
import { Send } from 'lucide-react';
import Pagination, { PaginationMeta } from '../Pagination';

interface SitterJobsFeedTabProps {
  availableJobs: any[];
  selectedJobForApply: any;
  setSelectedJobForApply: (job: any) => void;
  coverLetter: string;
  setCoverLetter: (val: string) => void;
  handleApplyForJob: (e: React.FormEvent) => void;
  meta?: PaginationMeta;
  onPageChange?: (newPage: number) => void;
  onLimitChange?: (newLimit: number) => void;
}

export default function SitterJobsFeedTab({
  availableJobs,
  selectedJobForApply,
  setSelectedJobForApply,
  coverLetter,
  setCoverLetter,
  handleApplyForJob,
  meta,
  onPageChange,
  onLimitChange,
}: SitterJobsFeedTabProps) {
  const [localPage, setLocalPage] = useState(1);
  const [localLimit, setLocalLimit] = useState(5);
  const [scrollMode, setScrollMode] = useState<'pages' | 'infinite' | 'both'>('both');

  // Compute pagination meta if not directly provided by parent
  const activeMeta: PaginationMeta = meta || {
    page: localPage,
    limit: localLimit,
    total: availableJobs.length,
    totalPages: Math.max(1, Math.ceil(availableJobs.length / localLimit)),
    hasNextPage: localPage < Math.ceil(availableJobs.length / localLimit),
    hasPrevPage: localPage > 1,
  };

  // Slice jobs locally if meta wasn't passed down from server
  const displayJobs = meta
    ? availableJobs
    : availableJobs.slice((localPage - 1) * localLimit, localPage * localLimit);

  const handlePageChange = (p: number) => {
    if (onPageChange) {
      onPageChange(p);
    } else {
      setLocalPage(p);
    }
  };

  const handleLimitChange = (l: number) => {
    if (onLimitChange) {
      onLimitChange(l);
    } else {
      setLocalLimit(l);
      setLocalPage(1);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '600' }}>Parent Job Feed</h3>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--color-body)' }}>
            <span>View Mode:</span>
            <button
              onClick={() => setScrollMode(scrollMode === 'both' ? 'infinite' : 'both')}
              className="btn btn-outline"
              style={{ padding: '4px 12px', fontSize: '12px', borderRadius: '12px' }}
            >
              {scrollMode === 'both' ? 'Show Infinite Button' : 'Show Page Bar'}
            </button>
          </div>
        </div>

        {availableJobs.length === 0 ? (
          <p style={{ color: 'var(--color-body)', fontSize: '14px' }}>No active parent job requests available at the moment.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {displayJobs.map((job) => (
              <div key={job._id} style={{ border: '1px solid var(--color-gray-border)', borderRadius: '12px', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h4 style={{ fontSize: '18px', fontWeight: '600' }}>{job.title}</h4>
                    <p style={{ fontSize: '13px', color: 'var(--color-body)', marginTop: '4px' }}>
                      Location: {job.location} | Hourly Offer: ৳{job.hourlyRate}/hr | Type: {job.jobType}
                    </p>
                    <p style={{ fontSize: '14px', marginTop: '12px', lineHeight: '1.6' }}>{job.description}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedJobForApply(selectedJobForApply?._id === job._id ? null : job)}
                    className="btn btn-primary" 
                    style={{ padding: '8px 18px', fontSize: '13px', boxShadow: 'none' }}
                  >
                    {selectedJobForApply?._id === job._id ? 'Close Form' : 'Apply Now'}
                  </button>
                </div>

                {/* Inline Apply Form */}
                {selectedJobForApply?._id === job._id && (
                  <form onSubmit={handleApplyForJob} style={{ background: 'var(--color-bg-light)', padding: '16px', borderRadius: '10px', marginTop: '16px' }}>
                    <label className="form-label" style={{ fontWeight: '600', fontSize: '13px' }}>Cover Note to Parent</label>
                    <textarea 
                      rows={3} 
                      placeholder="Introduce yourself, mention your CPR/experience background..." 
                      className="form-control"
                      style={{ marginBottom: '12px' }}
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      required
                    ></textarea>
                    <button type="submit" className="btn btn-tertiary" style={{ padding: '8px 20px', fontSize: '13px' }}>
                      <Send size={14} /> Send Application
                    </button>
                  </form>
                )}
              </div>
            ))}

            {/* Pagination & Infinite Scroll Component */}
            <Pagination
              meta={activeMeta}
              onPageChange={handlePageChange}
              onLimitChange={handleLimitChange}
              mode={scrollMode}
              itemLabel="job posts"
            />
          </div>
        )}
      </div>

    </div>
  );
}

