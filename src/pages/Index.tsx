
import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import AgeGroupsSection from '@/components/home/AgeGroupsSection';
import CallToActionSection from '@/components/home/CallToActionSection';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <AgeGroupsSection />
        <CallToActionSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
