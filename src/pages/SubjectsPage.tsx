
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, BookText, Atom, GraduationCap, Globe, Flag } from 'lucide-react';
import DoodleCard from '@/components/DoodleCard';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

const SubjectsPage = () => {
  const navigate = useNavigate();
  
  const handleSubjectClick = (subject: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (subject === 'English') {
      window.location.href = 'https://smaranai-53.lovable.app/';
    } else {
      console.log(`Clicked on ${subject}`);
      // Future implementation for other subjects
    }
  };

  const subjects = [
    { 
      name: 'Mathematics', 
      icon: <GraduationCap className="w-10 h-10" />, 
      color: 'blue',
      description: 'Explore numbers, shapes, and patterns with interactive math lessons'
    },
    { 
      name: 'English', 
      icon: <BookText className="w-10 h-10" />, 
      color: 'green',
      description: 'Master language skills with grammar, vocabulary, and writing exercises'
    },
    { 
      name: 'Science', 
      icon: <Atom className="w-10 h-10" />, 
      color: 'purple',
      description: 'Discover the natural world through biology, chemistry, and physics'
    },
    { 
      name: 'Social Science', 
      icon: <Globe className="w-10 h-10" />, 
      color: 'yellow',
      description: 'Learn about history, geography, civics, and economics'
    },
    { 
      name: 'Hindi', 
      icon: <Flag className="w-10 h-10" />, 
      color: 'orange',
      description: 'Develop Hindi language skills with comprehensive lessons'
    },
    { 
      name: 'Gujarati', 
      icon: <BookOpen className="w-10 h-10" />, 
      color: 'red',
      description: 'Learn Gujarati with interactive lessons and cultural insights'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-12 md:py-20 overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-center">
              <span className="bg-gradient-to-r from-kid-blue via-kid-purple to-kid-red bg-clip-text text-transparent">
                Choose Your Subject
              </span>
            </h1>
            <p className="text-xl mb-12 text-gray-700 text-center max-w-3xl mx-auto">
              Select a subject to start learning with interactive lessons, exercises, and AI-powered tutoring
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
              {subjects.map((subject, index) => (
                <DoodleCard 
                  key={index}
                  title={subject.name} 
                  description={subject.description} 
                  icon={subject.icon} 
                  color={subject.color as 'green' | 'blue' | 'red' | 'yellow' | 'purple' | 'orange' | 'pink'} 
                  onClick={handleSubjectClick(subject.name)}
                  className="hover:scale-105 transition-transform duration-300"
                >
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <button 
                      onClick={handleSubjectClick(subject.name)} 
                      className="text-kid-blue font-medium hover:underline"
                    >
                      Start Learning &rarr;
                    </button>
                  </div>
                </DoodleCard>
              ))}
            </div>
          </div>
          
          {/* Background decorations */}
          <div className="absolute top-20 left-10 opacity-20">
            <div className="text-kid-blue">
              <GraduationCap size={64} />
            </div>
          </div>
          <div className="absolute bottom-20 right-10 opacity-20">
            <div className="text-kid-green">
              <BookText size={64} />
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default SubjectsPage;
