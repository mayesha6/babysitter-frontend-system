'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--color-dark)',
      color: 'rgba(255,255,255,0.8)',
      padding: '80px 0 40px 0',
      position: 'relative',
      marginTop: 'auto',
      borderTop: '4px solid var(--color-dark)'
    }}>
      {/* Curved Cloud Shape Divider at top of Footer */}
      <div style={{
        position: 'absolute',
        top: '-1px',
        left: 0,
        width: '100%',
        height: '40px',
        overflow: 'hidden',
        lineHeight: 0,
        transform: 'rotate(180deg)'
      }}>
        <svg viewBox="0 0 283.5 27.8" preserveAspectRatio="xMidYMax slice" style={{
          display: 'block',
          width: '100%',
          height: '40px',
          fill: 'var(--color-bg-light)'
        }}>
          <path d="M265.8 3.5c-10.9 0-15.9 6.2-15.9 6.2s-3.6-3.5-9.2-.9c-9.1 4.1-4.4 13.4-4.4 13.4s-1.2.2-1.9.9c-.6.7-.5 1.9-.5 1.9s-1-.5-2.3-.2c-1.3.3-1.6 1.4-1.6 1.4s.4-3.4-1.5-5c-3.9-3.4-8.3-.2-8.3-.2s-.6-.7-.9-.9c-.4-.2-1.2-.2-1.2-.2s-4.4-3.6-11.5-2.6-10.4 7.9-10.4 7.9-.5-3.3-3.9-4.9c-4.8-2.4-7.4 0-7.4 0s2.4-4.1-1.9-6.4-6.2 1.2-6.2 1.2-.9-.5-2.1-.5-2.3 1.1-2.3 1.1.1-.7-1.1-1.1c-1.2-.4-2 0-2 0s3.6-6.8-3.5-8.9c-6-1.8-7.9 2.6-8.4 4-.1-.3-.4-.7-.9-1.1-1-.7-1.3-.5-1.3-.5s1-4-1.7-5.2c-2.7-1.2-4.2 1.1-4.2 1.1s-3.1-1-5.7 1.4-2.1 5.5-2.1 5.5-.9 0-2.1.7-1.4 1.7-1.4 1.7-1.7-1.2-4.3-1.2c-2.6 0-4.5 1.2-4.5 1.2s-.7-1.5-2.8-2.4c-2.1-.9-4 0-4 0s2.6-5.9-4.7-9c-7.3-3.1-12.6 3.3-12.6 3.3s-.9 0-1.9.2c-.9.2-1.5.9-1.5.9S99.4 3 94.9 3.9c-4.5.9-5.7 5.7-5.7 5.7s-2.8-5-12.3-3.9-11.1 6-11.1 6-1.2-1.4-4-.7c-.8.2-1.3.5-1.8.9-.9-2.1-2.7-4.9-6.2-4.4-3.2.4-4 2.2-4 2.2s-.5-.7-1.2-.7h-1.4s-.5-.9-1.7-1.4-2.4 0-2.4 0-2.4-1.2-4.7 0-3.1 4.1-3.1 4.1-1.7-1.4-3.6-.7c-1.9.7-1.9 2.8-1.9 2.8s-.5-.5-1.7-.2c-1.2.2-1.4.7-1.4.7s-.7-2.3-2.8-2.8c-2.1-.5-4.3.2-4.3.2s-1.7-5-11.1-6c-3.8-.4-6.6.2-8.5 1v21.2h283.5V11.1c-.9.2-1.6.4-1.6.4s-5.2-8-16.1-8z"></path>
        </svg>
      </div>

      <div className="container">
        <div className="grid-4" style={{ marginBottom: '60px' }}>
          {/* Logo & Intro */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontFamily: 'var(--font-header)', fontSize: '24px', color: 'white', marginBottom: '20px' }}>
              <span style={{ background: 'var(--color-primary)', color: 'white', padding: '6px', borderRadius: '50% 50% 50% 10px', fontSize: '18px' }}>🧸</span>
              <span>BebiCare</span>
            </div>
            <p style={{ fontSize: '14px', lineHeight: '1.8' }}>
              Safe, verified, fun, and engaging childcare experiences. We connect busy parents with qualified professional babysitters.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: 'white', marginBottom: '24px', fontSize: '18px' }}>Services</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
              <li><Link href="/search?type=FULL_TIME">Full-time Care</Link></li>
              <li><Link href="/search?type=PART_TIME">Part-time Care</Link></li>
              <li><Link href="/search?type=WEEKEND">Weekend Nanny</Link></li>
              <li><Link href="/search">Verified Babysitters</Link></li>
            </ul>
          </div>

          {/* About Links */}
          <div>
            <h4 style={{ color: 'white', marginBottom: '24px', fontSize: '18px' }}>Company</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
              <li><Link href="/">About Us</Link></li>
              <li><Link href="/">Contact Us</Link></li>
              <li><Link href="/">Frequently Asked Questions</Link></li>
              <li><Link href="/">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 style={{ color: 'white', marginBottom: '24px', fontSize: '18px' }}>Get In Touch</h4>
            <p style={{ fontSize: '14px', marginBottom: '12px' }}>📍 Envanto HQ, Dhaka, Bangladesh</p>
            <p style={{ fontSize: '14px', marginBottom: '12px' }}>📞 Phone: +880 1712 345678</p>
            <p style={{ fontSize: '14px' }}>✉️ Email: support@bebicare.com</p>
          </div>
        </div>

        {/* Bottom Rights */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: '30px',
          textAlign: 'center',
          fontSize: '13px',
          color: 'rgba(255,255,255,0.5)'
        }}>
          &copy; {new Date().getFullYear()} BebiCare. All rights reserved. Made with ❤️ for parents everywhere.
        </div>
      </div>
    </footer>
  );
}
