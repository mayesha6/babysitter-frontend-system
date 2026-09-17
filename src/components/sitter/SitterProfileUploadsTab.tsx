'use client';

import React, { useState } from 'react';
import { Upload, CheckCircle2, Loader2, Image as ImageIcon, FileText } from 'lucide-react';
import { uploadToCloudinary } from '../../services/api';
import { useToast } from '../../context/ToastContext';

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
  handleUploadDocuments,
}: SitterProfileUploadsTabProps) {
  const { toast } = useToast();
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldKey: string,
    setter: (url: string) => void
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setUploadingField(fieldKey);
    try {
      toast.info(`Uploading ${file.name} to Cloudinary...`, 'Cloudinary Upload');
      const uploadedUrl = await uploadToCloudinary(file);
      if (uploadedUrl) {
        setter(uploadedUrl);
        toast.success(`File successfully uploaded to Cloudinary!`, 'Upload Success');
      }
    } catch (err: any) {
      toast.error('Cloudinary upload failed, please try again.', 'Upload Error');
    } finally {
      setUploadingField(null);
    }
  };

  return (
    <div className="card" style={{ padding: '32px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '22px', fontWeight: '600', color: 'var(--color-dark)' }}>
          Verification Document Uploads
        </h3>
        <p style={{ color: 'var(--color-body)', fontSize: '14px', marginTop: '4px' }}>
          Upload your NID card details, live selfie, and police clearance certificate to seek platform verification badges via Cloudinary storage.
        </p>
      </div>

      <form onSubmit={handleUploadDocuments}>
        {/* NID Number */}
        <div className="form-group" style={{ marginBottom: '24px' }}>
          <label className="form-label" style={{ fontWeight: '600' }}>National ID (NID) Number</label>
          <input
            type="text"
            placeholder="e.g. 199XXXXXXXXXX"
            className="form-control"
            value={nidNumber}
            onChange={(e) => setNidNumber(e.target.value)}
            required
          />
        </div>

        {/* Upload Cards Grid */}
        <div className="grid-2" style={{ gap: '20px', marginBottom: '24px' }}>
          
          {/* NID Front */}
          <DocumentUploadCard
            label="NID Front Image"
            fieldKey="nidFront"
            value={nidFrontImage}
            setValue={setNidFrontImage}
            isUploading={uploadingField === 'nidFront'}
            onFileSelect={(e) => handleFileUpload(e, 'nidFront', setNidFrontImage)}
          />

          {/* NID Back */}
          <DocumentUploadCard
            label="NID Back Image"
            fieldKey="nidBack"
            value={nidBackImage}
            setValue={setNidBackImage}
            isUploading={uploadingField === 'nidBack'}
            onFileSelect={(e) => handleFileUpload(e, 'nidBack', setNidBackImage)}
          />

          {/* Live Selfie */}
          <DocumentUploadCard
            label="Live Selfie Image"
            fieldKey="selfie"
            value={selfieImage}
            setValue={setSelfieImage}
            isUploading={uploadingField === 'selfie'}
            onFileSelect={(e) => handleFileUpload(e, 'selfie', setSelfieImage)}
          />

          {/* Police Clearance */}
          <DocumentUploadCard
            label="Police Clearance Certificate"
            fieldKey="policeClearance"
            value={policeClearanceImage}
            setValue={setPoliceClearanceImage}
            isUploading={uploadingField === 'policeClearance'}
            onFileSelect={(e) => handleFileUpload(e, 'policeClearance', setPoliceClearanceImage)}
          />

        </div>

        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%', padding: '14px', fontSize: '15px' }}
        >
          Submit Documents for Admin Verification
        </button>
      </form>
    </div>
  );
}

function DocumentUploadCard({
  label,
  fieldKey,
  value,
  setValue,
  isUploading,
  onFileSelect,
}: {
  label: string;
  fieldKey: string;
  value: string;
  setValue: (val: string) => void;
  isUploading: boolean;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div
      style={{
        border: '2px dashed var(--color-gray-border)',
        borderRadius: '16px',
        padding: '20px',
        background: value ? 'rgba(109, 193, 160, 0.05)' : 'var(--color-bg-light)',
        borderColor: value ? 'var(--color-tertiary)' : 'var(--color-gray-border)',
        transition: 'all 0.3s ease',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <label className="form-label" style={{ fontWeight: '600', margin: 0, fontSize: '14px' }}>
          {label}
        </label>
        {value ? (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--color-tertiary-dark)', fontWeight: '700' }}>
            <CheckCircle2 size={14} /> Cloudinary Ready
          </span>
        ) : (
          <span style={{ fontSize: '11px', color: 'var(--color-body)' }}>Required</span>
        )}
      </div>

      {value ? (
        <div style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--color-gray-border)', marginBottom: '12px' }}>
          <img src={value} alt={label} style={{ width: '100%', height: '120px', objectFit: 'cover' }} />
          <button
            type="button"
            onClick={() => setValue('')}
            style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              background: 'rgba(29, 33, 80, 0.75)',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              padding: '4px 8px',
              fontSize: '11px',
              cursor: 'pointer',
            }}
          >
            Change
          </button>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          {isUploading ? (
            <div style={{ color: 'var(--color-secondary-dark)' }}>
              <Loader2 size={24} className="spin" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 8px auto' }} />
              <p style={{ fontSize: '12px', fontWeight: '600' }}>Uploading to Cloudinary...</p>
            </div>
          ) : (
            <>
              <Upload size={28} style={{ color: 'var(--color-secondary)', margin: '0 auto 8px auto' }} />
              <label
                className="btn btn-outline"
                style={{
                  padding: '6px 16px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                Choose File
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={onFileSelect}
                  style={{ display: 'none' }}
                />
              </label>
            </>
          )}
        </div>
      )}

      {/* Manual URL Input Fallback */}
      <input
        type="text"
        placeholder="Or paste Cloudinary URL..."
        className="form-control"
        style={{ fontSize: '12px', padding: '8px 12px' }}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}
