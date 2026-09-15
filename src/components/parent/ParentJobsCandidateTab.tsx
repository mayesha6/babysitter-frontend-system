'use client';

import React from 'react';
import Link from 'next/link';
import { Star, ShieldCheck, Check } from 'lucide-react';

interface ParentJobsCandidateTabProps {
  myJobs: any[];
  candidates: any[];
  selectedJobForApplicants: any;
  handleViewApplicants: (jobId: string) => void;
  handleHireCandidate: (applicant: any) => void;
}

export default function ParentJobsCandidateTab({
  myJobs,
  candidates,
  selectedJobForApplicants,
  handleViewApplicants,
  handleHireCandidate
}: ParentJobsCandidateTabProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Job listings */}
      <div className="card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '20px', marginBottom: '16px', fontWeight: '600' }}>Your Active Job Requirements</h3>
        {myJobs.length === 0 ? (
          <p style={{ color: 'var(--color-body)', fontSize: '14px' }}>No active job requirements posted yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {myJobs.map((job) => (
              <div key={job._id} style={{ border: '1px solid var(--color-gray-border)', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: '600' }}>{job.title}</h4>
                  <p style={{ fontSize: '12px', color: 'var(--color-body)' }}>Location: {job.location} | Rate: ৳{job.hourlyRate}/hr | Type: {job.jobType}</p>
                </div>
                <button 
                  onClick={() => handleViewApplicants(job._id)} 
                  className="btn btn-secondary" 
                  style={{ padding: '8px 16px', fontSize: '12px', boxShadow: 'none' }}
                >
                  View Applicants ({job.applicantsCount || candidates.length})
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Applicants panel */}
      {selectedJobForApplicants && (
        <div className="card" style={{ padding: '24px', border: '2px solid var(--color-secondary)' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '16px', fontWeight: '600' }}>Candidate Applications for this Job</h3>
          {candidates.length === 0 ? (
            <p style={{ color: 'var(--color-body)', fontSize: '14px' }}>No babysitters have applied for this job yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {candidates.map((app) => {
                const sitterUser = app.sitter?.user || app.sitter || {};
                return (
                  <div key={app._id} style={{ background: 'var(--color-bg-light)', padding: '16px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ fontSize: '15px', fontWeight: '600' }}>{sitterUser.name || 'Babysitter Candidate'}</h4>
                      <p style={{ fontSize: '12px', color: 'var(--color-body)' }}>Message: "{app.coverLetter || 'Interested in this job'}"</p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Link href={`/sitter-profile/${sitterUser._id || app.sitter}`} className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '12px' }}>
                        View Profile
                      </Link>
                      <button 
                        onClick={() => handleHireCandidate(app)} 
                        className="btn btn-tertiary" 
                        style={{ padding: '6px 12px', fontSize: '12px', boxShadow: 'none' }}
                      >
                        <Check size={14} /> Direct Hire
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
