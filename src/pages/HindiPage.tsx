
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Flag, MessageSquare } from 'lucide-react';
import DoodleCard from '@/components/DoodleCard';
import NeoBackButton from '@/components/NeoBackButton';

const HindiPage = () => {
  const navigate = useNavigate();
  
  const handleReturn = () => {
    navigate('/subjects');
  };

  const handleFeatureClick = (feature: string) => {
    if (feature === 'chatbot') {
      navigate('/hindi/chatbot');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <NeoBackButton 
        label="Back to Subjects" 
        color="orange" 
        onClick={handleReturn}
      />

      <div className="flex items-center mb-8">
        <div className="bg-kid-orange p-3 rounded-full mr-4">
          <Flag className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold">
          <span className="bg-gradient-to-r from-kid-orange to-orange-600 bg-clip-text text-transparent">
            हिंदी (Hindi)
          </span>
        </h1>
      </div>

      <div className="mb-8">
        <p className="text-lg text-gray-700 mb-4">
          हिंदी सीखने के लिए इन उपकरणों का उपयोग करें। अपनी भाषा कौशल विकसित करें और नए शब्द सीखें।
          <br />
          (Use these tools to learn Hindi. Develop your language skills and learn new words.)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <DoodleCard 
          title="हिंदी चैटबॉट (Hindi Chatbot)" 
          description="चित्र और पाठ के माध्यम से हिंदी में प्रश्न पूछें और उत्तर प्राप्त करें।" 
          icon={<MessageSquare className="w-10 h-10" />} 
          color="orange" 
          onClick={() => handleFeatureClick('chatbot')}
          className="hover:scale-105 transition-transform duration-300"
        >
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">Ask questions in Hindi and receive answers through text and images.</p>
            <button 
              onClick={() => handleFeatureClick('chatbot')} 
              className="mt-2 text-kid-orange font-medium hover:underline"
            >
              शुरू करें (Start) &rarr;
            </button>
          </div>
        </DoodleCard>
      </div>
    </div>
  );
};

export default HindiPage;
