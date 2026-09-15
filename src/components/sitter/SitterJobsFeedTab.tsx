'use client';

import React from 'react';
import { Send } from 'lucide-react';

interface SitterJobsFeedTabProps {
  availableJobs: any[];
  selectedJobForApply: any;
  setSelectedJobForApply: (job: any) => void;
  coverLetter: string;
  setCoverLetter: (val: string) => void;
  handleApplyForJob: (e: React.FormEvent) => void;
}

export default function SitterJobsFeedTab({
  availableJobs,
  selectedJobForApply,
  setSelectedJobForApply,
  coverLetter,
  setCoverLetter,
  handleApplyForJob
}: SitterJobsFeedTabProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      <div className="card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '20px', marginBottom: '16px', fontWeight: '600' }}>Parent Job Feed</h3>
        {availableJobs.length === 0 ? (
          <p style={{ color: 'var(--color-body)', fontSize: '14px' }}>No active parent job requests available at the moment.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {availableJobs.map((job) => (
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
          </div>
        )}
      </div>

    </div>
  );
}
