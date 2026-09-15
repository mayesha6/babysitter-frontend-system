'use client';

import React, { useState } from 'react';
import { UserCheck, Search, CalendarCheck, Shield, FileText, Banknote } from 'lucide-react';

export default function HowItWorks() {
  const [activeTab, setActiveTab] = useState('parent'); // 'parent' or 'sitter'

  const parentSteps = [
    {
      stepNum: 1,
      icon: <FileText size={24} />,
      color: 'var(--color-primary)',
      title: 'Post a Childcare Job',
      description: 'Define your requirements — age of children, desired hours, budget, and specific safety skills needed.'
    },
    {
      stepNum: 2,
      icon: <Search size={24} />,
      color: 'var(--color-secondary)',
      title: 'Review Candidates',
      description: 'Check applicant profiles, audit their verification badges, and interview them over real-time chat.'
    },
    {
      stepNum: 3,
      icon: <CalendarCheck size={24} />,
      color: 'var(--color-tertiary-dark)',
      title: 'Book & Pay Securely',
      description: 'Confirm booking schedules, pay conveniently using Stripe card checkout, and submit ratings after job completion.'
    }
  ];

  const sitterSteps = [
    {
      stepNum: 1,
      icon: <UserCheck size={24} />,
      color: 'var(--color-secondary)',
      title: 'Create Your Profile',
      description: 'Fill in your experience bio, hourly rate, skills, availability timetable, and submit NID documents.'
    },
    {
      stepNum: 2,
      icon: <Search size={24} />,
      color: 'var(--color-tertiary-dark)',
      title: 'Browse & Apply Jobs',
      description: 'Access the parent jobs feed filtered by location and apply with a single click once verified.'
    },
    {
      stepNum: 3,
      icon: <Banknote size={24} />,
      color: 'var(--color-primary)',
      title: 'Complete & Get Paid',
      description: 'Care for kids safely, update parents, and track your completed shift earnings directly in your dashboard.'
    }
  ];

  const currentSteps = activeTab === 'parent' ? parentSteps : sitterSteps;

  return (
    <section style={{ padding: '90px 0', background: 'var(--color-bg-light)', borderBottom: '1px solid var(--color-gray-border)' }}>
      <div className="container" style={{ textAlign: 'center' }}>
        
        <span style={{ color: 'var(--color-secondary-dark)', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Simple & Easy Steps
        </span>
        <h2 style={{ fontSize: '36px', marginTop: '8px', marginBottom: '16px' }}>How BebiCare Works</h2>
        <p style={{ color: 'var(--color-body)', fontSize: '16px', maxWidth: '600px', margin: '0 auto 40px auto' }}>
          Whether you are a parent looking for childcare or a babysitter looking for job opportunities, we've got you covered.
        </p>

        {/* Tab Switcher */}
        <div style={{ display: 'inline-flex', background: 'var(--color-white)', padding: '6px', borderRadius: '30px', border: '1px solid var(--color-gray-border)', boxShadow: 'var(--shadow-sm)', marginBottom: '50px' }}>
          <button 
            className={`btn ${activeTab === 'parent' ? 'btn-primary' : ''}`}
            style={{
              padding: '10px 28px',
              fontSize: '15px',
              borderRadius: '24px',
              background: activeTab === 'parent' ? 'var(--color-primary)' : 'none',
              color: activeTab === 'parent' ? 'white' : 'var(--color-dark)',
              boxShadow: activeTab === 'parent' ? 'var(--shadow-sm)' : 'none',
              border: 'none',
              cursor: 'pointer'
            }}
            onClick={() => setActiveTab('parent')}
          >
            For Parents 👨‍👩‍👧
          </button>
          <button 
            className={`btn ${activeTab === 'sitter' ? 'btn-secondary' : ''}`}
            style={{
              padding: '10px 28px',
              fontSize: '15px',
              borderRadius: '24px',
              background: activeTab === 'sitter' ? 'var(--color-secondary)' : 'none',
              color: activeTab === 'sitter' ? 'white' : 'var(--color-dark)',
              boxShadow: activeTab === 'sitter' ? 'var(--shadow-sm)' : 'none',
              border: 'none',
              cursor: 'pointer'
            }}
            onClick={() => setActiveTab('sitter')}
          >
            For Babysitters 👶
          </button>
        </div>

        {/* Steps Grid */}
        <div className="grid-3" style={{ textAlign: 'left' }}>
          {currentSteps.map((step) => (
            <div 
              key={step.stepNum} 
              className="card step-card" 
              style={{
                padding: '36px 28px',
                position: 'relative',
                background: 'var(--color-white)',
                transition: 'all 0.3s ease'
              }}
            >
              <div 
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: step.color,
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  fontWeight: '800',
                  marginBottom: '20px',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                }}
              >
                {step.stepNum}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <span style={{ color: step.color }}>{step.icon}</span>
                <h3 style={{ fontSize: '20px', color: 'var(--color-dark)' }}>{step.title}</h3>
              </div>

              <p style={{ color: 'var(--color-body)', fontSize: '14px', lineHeight: '1.6' }}>
                {step.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
