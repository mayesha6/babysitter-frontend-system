'use client';

import React from 'react';
import { Check, X } from 'lucide-react';

interface AdminVerificationTabProps {
  pendingSitters: any[];
  reviewSitter: any;
  setReviewSitter: (sitter: any) => void;
  handleVerifySitter: (sitterUserId: string, status: string) => void;
}

export default function AdminVerificationTab({ pendingSitters, reviewSitter, setReviewSitter, handleVerifySitter }: AdminVerificationTabProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h3 style={{ fontSize: '22px', fontWeight: '600' }}>Sitter Verification Requests</h3>
      {pendingSitters.length === 0 ? (
        <div className="card" style={{ padding: '40px', textAlign: 'center', color: 'var(--color-body)' }}>
          No babysitters are currently awaiting document verification approvals.
        </div>
      ) : (
        pendingSitters.map((sitter) => (
          <div key={sitter._id} className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-gray-border)', paddingBottom: '12px', marginBottom: '16px' }}>
              <div>
                <h4 style={{ fontSize: '18px', fontWeight: '600' }}>{sitter.user?.name || 'Babysitter Candidate'}</h4>
                <p style={{ fontSize: '12px', color: 'var(--color-body)' }}>Email: {sitter.user?.email} | NID: {sitter.nidNumber}</p>
              </div>
              <button 
                onClick={() => setReviewSitter(reviewSitter?._id === sitter._id ? null : sitter)}
                className="btn btn-secondary" 
                style={{ padding: '6px 14px', fontSize: '12px', boxShadow: 'none' }}
              >
                {reviewSitter?._id === sitter._id ? 'Close Preview' : 'Review Documents'}
              </button>
            </div>

            {/* Expandable Document previewer */}
            {reviewSitter?._id === sitter._id && (
              <div style={{ background: 'var(--color-bg-light)', border: '2px dashed var(--color-gray-border)', padding: '20px', borderRadius: '12px', marginTop: '16px' }}>
                <h5 style={{ fontSize: '14px', marginBottom: '12px', fontWeight: '600' }}>Submitted Document Previews:</h5>
                
                <div className="grid-3" style={{ gap: '16px', marginBottom: '24px' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--color-body)', marginBottom: '4px', fontWeight: '600' }}>NID Front Image</div>
                    <img src={sitter.nidFrontImage} alt="NID Front" style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--color-gray-border)' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--color-body)', marginBottom: '4px', fontWeight: '600' }}>NID Back Image</div>
                    <img src={sitter.nidBackImage} alt="NID Back" style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--color-gray-border)' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--color-body)', marginBottom: '4px', fontWeight: '600' }}>Selfie Image</div>
                    <img src={sitter.selfieImage} alt="Selfie" style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--color-gray-border)' }} />
                  </div>
                </div>
                
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--color-body)', marginBottom: '4px', fontWeight: '600' }}>Police Clearance Certificate</div>
                  <img src={sitter.policeClearanceImage} alt="Police Clearance" style={{ width: '100%', maxHeight: '300px', objectFit: 'contain', borderRadius: '8px', border: '1px solid var(--color-gray-border)' }} />
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    onClick={() => handleVerifySitter(sitter.user?._id || sitter.user, 'VERIFIED')}
                    className="btn btn-tertiary" 
                    style={{ padding: '8px 20px', fontSize: '12px', boxShadow: 'none' }}
                  >
                    <Check size={16} /> Approve Verification
                  </button>
                  <button 
                    onClick={() => handleVerifySitter(sitter.user?._id || sitter.user, 'REJECTED')}
                    className="btn btn-primary" 
                    style={{ padding: '8px 20px', fontSize: '12px', boxShadow: 'none' }}
                  >
                    <X size={16} /> Reject Request
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setReviewSitter(null)}
                    className="btn btn-outline" 
                    style={{ padding: '8px 20px', fontSize: '12px', boxShadow: 'none', border: '1.5px solid var(--color-secondary)' }}
                  >
                    Close Preview
                  </button>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
