'use client';

import React from 'react';

interface SitterProfileUploadsTabProps {
  nidNumber: string;
  setNidNumber: (val: string) => void;
  nidFrontImage: string;
  setNidFrontImage: (val: string) => void;
  nidBackImage: string;
  setNidBackImage: (val: string) => void;
  selfieImage: string;
  setSelfieImage: (val: string) => void;
  policeClearanceImage: string;
  setPoliceClearanceImage: (val: string) => void;
  handleUploadDocuments: (e: React.FormEvent) => void;
}

export default function SitterProfileUploadsTab({
  nidNumber,
  setNidNumber,
  nidFrontImage,
  setNidFrontImage,
  nidBackImage,
  setNidBackImage,
  selfieImage,
  setSelfieImage,
  policeClearanceImage,
  setPoliceClearanceImage,
  handleUploadDocuments
}: SitterProfileUploadsTabProps) {
  return (
    <div className="card" style={{ padding: '32px' }}>
      <h3 style={{ fontSize: '22px', marginBottom: '8px', fontWeight: '600' }}>Verification Document Uploads</h3>
      <p style={{ color: 'var(--color-body)', fontSize: '14px', marginBottom: '24px' }}>
        Please upload your NID card details and police clearance certificate image links for admin verification.
      </p>

      <form onSubmit={handleUploadDocuments}>
        <div className="form-group">
          <label className="form-label" style={{ fontWeight: '600' }}>National ID (NID) Number</label>
          <input 
            type="text" 
            placeholder="199XXXXXXXXXX" 
            className="form-control"
            value={nidNumber}
            onChange={(e) => setNidNumber(e.target.value)}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: '600' }}>NID Front Image URL</label>
            <input 
              type="text" 
              placeholder="https://..." 
              className="form-control"
              value={nidFrontImage}
              onChange={(e) => setNidFrontImage(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontWeight: '600' }}>NID Back Image URL</label>
            <input 
              type="text" 
              placeholder="https://..." 
              className="form-control"
              value={nidBackImage}
              onChange={(e) => setNidBackImage(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: '600' }}>Live Selfie Image URL</label>
            <input 
              type="text" 
              placeholder="https://..." 
              className="form-control"
              value={selfieImage}
              onChange={(e) => setSelfieImage(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontWeight: '600' }}>Police Clearance Image URL</label>
            <input 
              type="text" 
              placeholder="https://..." 
              className="form-control"
              value={policeClearanceImage}
              onChange={(e) => setPoliceClearanceImage(e.target.value)}
              required
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', fontSize: '15px' }}>
          Submit Documents for Admin Verification
        </button>
      </form>
    </div>
  );
}
