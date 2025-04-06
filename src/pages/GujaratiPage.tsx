import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, BookText, MessageSquare } from 'lucide-react';
import DoodleCard from '@/components/DoodleCard';

const GujaratiPage = () => {
  const navigate = useNavigate();
  
  const sections = [
    {
      title: "ગુજરાતી કવિતાઓ",
      englishTitle: "Gujarati Poems",
      description: "Explore beautiful Gujarati poems with meanings and explanations",
      icon: <BookText className="w-10 h-10" />,
      color: "green",
      path: "/gujarati/poems"
    },
    {
      title: "ગુજરાતી પાઠો",
      englishTitle: "Gujarati Lessons",
      description: "Learn Gujarati through structured lessons and chapters",
      icon: <BookOpen className="w-10 h-10" />,
      color: "blue",
      path: "/gujarati/lessons"
    },
    {
      title: "ગુજરાતી ચેટબોટ",
      englishTitle: "Gujarati Chatbot",
      description: "Practice Gujarati conversation with an AI tutor",
      icon: <MessageSquare className="w-10 h-10" />,
      color: "purple",
      path: "/gujarati/chatbot"
    }
  ];

  const handleNavigate = (path: string) => () => {
    navigate(path);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-kid-blue via-kid-purple to-kid-pink bg-clip-text text-transparent">
            ગુજરાતી ભાષા શીખો
          </span>
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold mb-6">
          Learn Gujarati Language
        </h2>
        <p className="text-lg max-w-3xl mx-auto text-gray-700 dark:text-gray-300">
          Explore Gujarati language through poems, structured lessons, and interactive conversations with our AI chatbot
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        {sections.map((section, index) => (
          <DoodleCard
            key={index}
            title={section.title}
            description={section.description}
            icon={section.icon}
            color={section.color as 'green' | 'blue' | 'red' | 'yellow' | 'purple' | 'orange' | 'pink'}
            onClick={handleNavigate(section.path)}
            className="hover:scale-105 transition-transform duration-300"
          >
            <div className="mt-2">
              <h3 className="font-medium text-gray-600 dark:text-gray-400">{section.englishTitle}</h3>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleNavigate(section.path)}
                className="text-kid-blue font-medium hover:underline"
              >
                Start Learning &rarr;
              </button>
            </div>
          </DoodleCard>
        ))}
      </div>
    </div>
  );
};

export default GujaratiPage;
