'use client';

import React from 'react';

interface TeddyBearIconProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function TeddyBearIcon({ size = 36, className, style }: TeddyBearIconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 44 44" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
    >
      {/* Ears */}
      <circle cx="8" cy="8" r="6.5" fill="#d9822b" />
      <circle cx="8" cy="8" r="3.8" fill="#f7c88b" />
      <circle cx="36" cy="8" r="6.5" fill="#d9822b" />
      <circle cx="36" cy="8" r="3.8" fill="#f7c88b" />
      
      {/* Head */}
      <ellipse cx="22" cy="22" rx="17" ry="15" fill="#f5aa47" />
      
      {/* Cheeks */}
      <ellipse cx="11" cy="24" rx="3.5" ry="2" fill="#ff6b8b" opacity="0.7" />
      <ellipse cx="33" cy="24" rx="3.5" ry="2" fill="#ff6b8b" opacity="0.7" />

      {/* Eyes */}
      <circle cx="15" cy="18" r="2.6" fill="#221608" />
      <circle cx="16" cy="17" r="0.9" fill="#ffffff" />
      <circle cx="29" cy="18" r="2.6" fill="#221608" />
      <circle cx="30" cy="17" r="0.9" fill="#ffffff" />
      
      {/* Snout */}
      <ellipse cx="22" cy="25" rx="7.5" ry="6" fill="#fce5c4" />
      
      {/* Nose */}
      <path d="M19.5 22.8 Q22 21.2 24.5 22.8 Q22 25.8 19.5 22.8 Z" fill="#3d2105" />
      
      {/* Mouth */}
      <path d="M22 24.8 L22 27.2 M19.8 27.2 Q22 28.8 24.2 27.2" stroke="#3d2105" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
