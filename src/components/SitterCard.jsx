'use client';

import React from 'react';
import Link from 'next/link';
import { Star, ShieldCheck, MapPin, DollarSign } from 'lucide-react';

export default function SitterCard({ sitter }) {
  // Sitter contains nested user object
  const user = sitter?.user || {};
  const name = user.name || 'Babysitter';
  const rating = sitter.averageRating || 5.0;
  const reviewCount = sitter.reviewCount || 0;
  const hourlyRate = sitter.hourlyRate || 15;
  const address = sitter.address || 'Dhaka, Bangladesh';
  const skills = sitter.skills || [];
  const status = sitter.verificationStatus || 'PENDING';
  const employmentType = sitter.employmentType || 'PART_TIME';
  const userId = user._id || sitter.user;

  // Generate random avatar placeholder color based on name length
  const colors = ['#ffa2bc', '#b996fe', '#6dc1a0', '#ffc147'];
  const placeholderBg = colors[name.length % colors.length];

  return (
    <div className="card sitter-card-body">
      <div className="sitter-card-header">
        {sitter.profileImage ? (
          <img src={sitter.profileImage} alt={name} className="sitter-avatar" />
        ) : (
          <div className="sitter-avatar-placeholder" style={{ backgroundColor: placeholderBg }}>
            {name.charAt(0)}
          </div>
        )}
        <div className="sitter-info-basic">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <h3 style={{ fontSize: '18px' }}>{name}</h3>
            {status === 'VERIFIED' && (
              <span className="badge badge-verified" style={{ padding: '2px 6px', fontSize: '10px' }}>
                <ShieldCheck size={12} style={{ marginRight: '2px' }} />
                Verified
              </span>
            )}
          </div>
          <p style={{ color: 'var(--color-body)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
            <MapPin size={14} />
            {address.split(',')[0]}
          </p>
        </div>
      </div>

      {/* Skills list */}
      <div className="sitter-skills">
        {skills.slice(0, 3).map((skill, i) => (
          <span key={i} className="skill-tag">{skill}</span>
        ))}
        {skills.length > 3 && (
          <span className="skill-tag">+{skills.length - 3} more</span>
        )}
      </div>

      <div className="sitter-card-footer">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: '600' }}>
            <Star size={14} fill="var(--color-quaternary)" color="var(--color-quaternary)" />
            <span>{rating.toFixed(1)}</span>
            <span style={{ color: 'var(--color-body)', fontWeight: '400' }}>({reviewCount})</span>
          </div>
          <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--color-dark)', marginTop: '4px' }}>
            ৳{hourlyRate}/hr
          </div>
        </div>
        <Link href={`/sitter-profile/${userId}`} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '13px', boxShadow: 'none' }}>
          View Profile
        </Link>
      </div>
    </div>
  );
}
