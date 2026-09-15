'use client';

import React from 'react';
import { Briefcase, Check, X, UserCheck, MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ParentJobsCandidateTab({ myJobs = [], handleApplicantStatus }) {
  const router = useRouter();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Briefcase size={24} style={{ color: 'var(--color-secondary-dark)' }} />
        <h3 style={{ fontSize: '22px', fontWeight: '700' }}>My Job Posts & Candidates</h3>
      </div>

      {myJobs.length === 0 ? (
        <div className="card" style={{ padding: '60px', textAlign: 'center', color: 'var(--color-body)' }}>
          <p style={{ fontSize: '16px', marginBottom: '8px' }}>You haven't posted any childcare jobs yet.</p>
          <p style={{ fontSize: '14px' }}>Click "Post a Job" from the sidebar to publish your first job listing!</p>
        </div>
      ) : (
        myJobs.map((job) => {
          const applicantCount = job.applicants?.length || 0;
          return (
            <div key={job._id} className="card" style={{ padding: '28px' }}>
              
              {/* Job Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid var(--color-gray-border)', paddingBottom: '16px', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <h4 style={{ fontSize: '19px', fontWeight: '700' }}>{job.title}</h4>
                    <span className={`badge ${job.status === 'OPEN' ? 'badge-verified' : 'badge-danger'}`}>
                      {job.status}
                    </span>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--color-body)', marginTop: '6px' }}>
                    📍 {job.location} | ৳{job.hourlyRate}/hr | Type: {job.jobType}
                  </p>
                  {job.startDate && (
                    <p style={{ fontSize: '12px', color: 'var(--color-body)', marginTop: '2px' }}>
                      📅 Dates: {job.startDate} to {job.endDate}
                    </p>
                  )}
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '12px', color: 'var(--color-body)', fontWeight: '600' }}>Total Applicants</span>
                  <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--color-secondary-dark)' }}>{applicantCount}</div>
                </div>
              </div>

              {/* Applicants List Section */}
              <div>
                <h5 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '14px', color: 'var(--color-dark)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <UserCheck size={16} style={{ color: 'var(--color-tertiary-dark)' }} /> Candidates Applied ({applicantCount})
                </h5>

                {!job.applicants || job.applicants.length === 0 ? (
                  <p style={{ fontSize: '14px', color: 'var(--color-body)', fontStyle: 'italic', background: 'var(--color-bg-light)', padding: '16px', borderRadius: 'var(--radius-sm)' }}>
                    No babysitters have applied for this job post yet.
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {job.applicants.map((app, i) => {
                      const applicantSitter = app.sitter || {};
                      return (
                        <div 
                          key={i} 
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            background: 'var(--color-bg-light)',
                            padding: '16px 20px',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--color-gray-border)',
                            flexWrap: 'wrap',
                            gap: '12px'
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: '700', fontSize: '15px', color: 'var(--color-dark)' }}>
                              {applicantSitter.name || 'Verified Babysitter Candidate'}
                            </div>
                            <div style={{ fontSize: '12px', color: 'var(--color-body)', marginTop: '2px' }}>
                              Applied: {new Date(app.appliedAt || Date.now()).toLocaleDateString()}
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <button 
                              onClick={() => router.push('/chat')}
                              className="btn btn-outline" 
                              style={{ padding: '6px 14px', fontSize: '12px', boxShadow: 'none' }}
                              title="Chat with Sitter"
                            >
                              <MessageSquare size={14} /> Chat
                            </button>

                            {app.status === 'PENDING' ? (
                              <>
                                <button 
                                  onClick={() => handleApplicantStatus(job._id, applicantSitter._id, 'ACCEPTED')}
                                  className="btn btn-tertiary" 
                                  style={{ padding: '6px 16px', fontSize: '12px', boxShadow: 'none' }}
                                >
                                  <Check size={14} /> Accept Candidate
                                </button>
                                <button 
                                  onClick={() => handleApplicantStatus(job._id, applicantSitter._id, 'REJECTED')}
                                  className="btn btn-outline" 
                                  style={{ padding: '6px 14px', fontSize: '12px', boxShadow: 'none', borderColor: 'var(--color-danger)', color: 'var(--color-danger)' }}
                                >
                                  <X size={14} /> Reject
                                </button>
                              </>
                            ) : (
                              <span className={`badge ${app.status === 'ACCEPTED' ? 'badge-verified' : 'badge-danger'}`} style={{ fontSize: '12px', padding: '6px 14px' }}>
                                Status: {app.status}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          );
        })
      )}
    </div>
  );
}
