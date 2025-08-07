'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AboutHero from '@/components/AboutHero';
import AboutStory from '@/components/AboutStory';
import AboutValues from '@/components/AboutValues';
import AboutTeam from '@/components/AboutTeam';
import AboutTimeline from '@/components/AboutTimeline';
import AboutStats from '@/components/AboutStats';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main>
        {/* Hero Section */}
        <AboutHero />
        
        {/* Our Story */}
        <AboutStory />
        
        {/* Company Stats */}
        <AboutStats />
        
        {/* Our Values */}
        <AboutValues />
        
        {/* Timeline */}
        <AboutTimeline />
        
        {/* Team */}
        <AboutTeam />
      </main>
      
      <Footer />
    </div>
  );
}
