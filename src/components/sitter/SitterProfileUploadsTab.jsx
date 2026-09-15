'use client';

import React from 'react';
import { UserCheck, Upload, Save, ShieldCheck } from 'lucide-react';

export default function SitterProfileUploadsTab({
  address, setAddress,
  about, setAbout,
  experienceYears, setExperienceYears,
  hourlyRate, setHourlyRate,
  gender, setGender,
  skillsText, setSkillsText,
  languagesText, setLanguagesText,
  nidNumber, setNidNumber,
  nidFrontImage,
  nidBackImage,
  selfieImage,
  policeClearanceImage,
  handleFileUpload,
  uploadingFile,
  handleUpdateProfile
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* Profile & Document Verification Form Card */}
      <div className="card" style={{ padding: '36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', borderBottom: '2px solid var(--color-gray-border)', paddingBottom: '16px' }}>
          <UserCheck size={24} style={{ color: 'var(--color-secondary-dark)' }} />
          <div>
            <h3 style={{ fontSize: '22px', fontWeight: '600' }}>Profile Information & Document Uploads</h3>
            <p style={{ fontSize: '13px', color: 'var(--color-body)' }}>Update your biological bio, hourly rate, and upload NID & police verification documents.</p>
          </div>
        </div>

        <form onSubmit={handleUpdateProfile}>
          
          {/* Location Address */}
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label className="form-label" style={{ fontWeight: '600' }}>Location Address</label>
            <input 
              type="text" 
              placeholder="e.g. Dhanmondi, Dhaka" 
              className="form-control"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          {/* About / Bio */}
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label className="form-label" style={{ fontWeight: '600' }}>About / Bio Description</label>
            <textarea 
              rows="4" 
              placeholder="Tell parents about your childcare style, experience with infants or toddlers..."
              className="form-control"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
            ></textarea>
          </div>

          {/* Experience Years & Hourly Rate */}
          <div className="form-row" style={{ marginBottom: '20px' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: '600' }}>Experience (Years)</label>
              <input 
                type="number" 
                min="0"
                className="form-control"
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: '600' }}>Hourly Rate Charge (৳/hr)</label>
              <input 
                type="number" 
                min="50"
                className="form-control"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Gender */}
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label className="form-label" style={{ fontWeight: '600' }}>Gender</label>
            <select 
              className="form-control"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="FEMALE">Female</option>
              <option value="MALE">Male</option>
            </select>
          </div>

          {/* Skills & Languages */}
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label className="form-label" style={{ fontWeight: '600' }}>Skills & Certifications (Comma separated)</label>
            <input 
              type="text" 
              placeholder="e.g. CPR Certified, Infant Care, Tutoring, Arts & Crafts" 
              className="form-control"
              value={skillsText}
              onChange={(e) => setSkillsText(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '28px' }}>
            <label className="form-label" style={{ fontWeight: '600' }}>Languages Spoken (Comma separated)</label>
            <input 
              type="text" 
              placeholder="e.g. Bangla, English" 
              className="form-control"
              value={languagesText}
              onChange={(e) => setLanguagesText(e.target.value)}
            />
          </div>

          {/* VERIFICATION DOCUMENTS SECTION */}
          <div style={{ borderTop: '2px solid var(--color-gray-border)', paddingTop: '24px', marginTop: '10px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <ShieldCheck size={20} style={{ color: 'var(--color-tertiary-dark)' }} />
              <h4 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--color-dark)' }}>
                Platform Verification Documents
              </h4>
            </div>

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label className="form-label" style={{ fontWeight: '600' }}>NID Card Number</label>
              <input 
                type="text" 
                placeholder="National ID Number" 
                className="form-control"
                value={nidNumber}
                onChange={(e) => setNidNumber(e.target.value)}
              />
            </div>

            {/* NID Front & Back */}
            <div className="form-row" style={{ marginBottom: '20px' }}>
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: '600' }}>NID Front Image Photo</label>
                <input 
                  type="file" 
                  accept="image/*"
                  className="form-control" 
                  onChange={(e) => handleFileUpload(e, 'nidFrontImage')}
                />
                {uploadingFile === 'nidFrontImage' && <span style={{ fontSize: '12px', color: 'var(--color-secondary)' }}>Uploading file...</span>}
                {nidFrontImage && (
                  <img src={nidFrontImage} alt="NID Front" style={{ width: '100%', height: '110px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', marginTop: '10px', border: '1px solid var(--color-gray-border)' }} />
                )}
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: '600' }}>NID Back Image Photo</label>
                <input 
                  type="file" 
                  accept="image/*"
                  className="form-control" 
                  onChange={(e) => handleFileUpload(e, 'nidBackImage')}
                />
                {uploadingFile === 'nidBackImage' && <span style={{ fontSize: '12px', color: 'var(--color-secondary)' }}>Uploading file...</span>}
                {nidBackImage && (
                  <img src={nidBackImage} alt="NID Back" style={{ width: '100%', height: '110px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', marginTop: '10px', border: '1px solid var(--color-gray-border)' }} />
                )}
              </div>
            </div>

            {/* Selfie & Police Clearance */}
            <div className="form-row" style={{ marginBottom: '28px' }}>
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: '600' }}>Profile Selfie Image</label>
                <input 
                  type="file" 
                  accept="image/*"
                  className="form-control" 
                  onChange={(e) => handleFileUpload(e, 'selfieImage')}
                />
                {uploadingFile === 'selfieImage' && <span style={{ fontSize: '12px', color: 'var(--color-secondary)' }}>Uploading file...</span>}
                {selfieImage && (
                  <img src={selfieImage} alt="Selfie" style={{ width: '100%', height: '110px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', marginTop: '10px', border: '1px solid var(--color-gray-border)' }} />
                )}
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: '600' }}>Police Clearance Certificate</label>
                <input 
                  type="file" 
                  accept="image/*,.pdf"
                  className="form-control" 
                  onChange={(e) => handleFileUpload(e, 'policeClearanceImage')}
                />
                {uploadingFile === 'policeClearanceImage' && <span style={{ fontSize: '12px', color: 'var(--color-secondary)' }}>Uploading file...</span>}
                {policeClearanceImage && (
                  <img src={policeClearanceImage} alt="Police Clearance" style={{ width: '100%', height: '110px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', marginTop: '10px', border: '1px solid var(--color-gray-border)' }} />
                )}
              </div>
            </div>

          </div>

          <button 
            type="submit" 
            className="btn btn-secondary" 
            style={{ width: '100%', padding: '16px', fontSize: '16px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <Save size={18} /> Submit Profile & Verification Documents
          </button>
        </form>
      </div>

    </div>
  );
}
