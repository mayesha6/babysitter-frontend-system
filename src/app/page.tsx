'use client';

import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HeroSection from '../components/HeroSection';
import TrustBadges from '../components/TrustBadges';
import HowItWorks from '../components/HowItWorks';
import FeaturedSitters from '../components/FeaturedSitters';
import TestimonialsSection from '../components/TestimonialsSection';
import CtaBanner from '../components/CtaBanner';

export default function Home() {
  return (
    <>
      <Header />
      <main style={{ minHeight: '100vh' }}>
        <HeroSection />
        <TrustBadges />
        <HowItWorks />
        <FeaturedSitters />
        <TestimonialsSection />
        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
