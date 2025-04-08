
import React from 'react';
import { Layout } from '@/components/Layout';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import AgeGroupsSection from '@/components/home/AgeGroupsSection';
import CallToActionSection from '@/components/home/CallToActionSection';

const Index = () => {
  return (
    <Layout>
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <AgeGroupsSection />
        <CallToActionSection />
      </main>
    </Layout>
  );
};

export default Index;
