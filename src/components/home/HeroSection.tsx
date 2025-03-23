
import React from 'react';
import { useNavigate } from 'react-router-dom';
import DoodleButton from '@/components/DoodleButton';
import DoodleDecoration from '@/components/DoodleDecoration';

const HeroSection = () => {
  const navigate = useNavigate();
  
  const handleNavigation = (path: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(path);
  };

  return (
    <section className="relative py-12 md:py-20 overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              <span className="block">Learn English</span>
              <span className="bg-gradient-to-r from-kid-blue via-kid-purple to-kid-red bg-clip-text text-transparent">
                The Fun Way!
              </span>
            </h1>
            <p className="text-xl mb-8 text-gray-700">
              Interactive lessons, story generators, and AI tutors to help students in grades 1-8 master English.
            </p>
            <div className="flex flex-wrap gap-4">
              <DoodleButton 
                color="blue" 
                size="lg" 
                onClick={handleNavigation("/subjects")}
              >
                Get Started
              </DoodleButton>
              <DoodleButton 
                color="purple" 
                size="lg" 
                variant="outline" 
                onClick={handleNavigation("/grammar")}
              >
                Explore Lessons
              </DoodleButton>
            </div>
          </div>
          <div className="md:w-1/2 relative">
            <div className="relative">
              <img 
                alt="Colorful doodles" 
                src="/lovable-uploads/43cda320-2d3f-46eb-b10e-2bc9ce6e1854.png" 
                className="rounded-3xl shadow-lg object-fill" 
              />
              <div className="absolute -top-6 -right-6">
                <DoodleDecoration type="star" color="yellow" size="lg" />
              </div>
              <div className="absolute -bottom-6 -left-6">
                <DoodleDecoration type="heart" color="red" size="lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background decorations */}
      <div className="absolute top-20 left-10 opacity-20">
        <DoodleDecoration type="cloud" color="blue" size="lg" />
      </div>
      <div className="absolute bottom-20 right-10 opacity-20">
        <DoodleDecoration type="circle" color="green" size="lg" />
      </div>
    </section>
  );
};

export default HeroSection;
