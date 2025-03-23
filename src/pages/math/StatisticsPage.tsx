
import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import MathQuestionForm from '@/components/MathQuestionForm';
import { Pi } from 'lucide-react';
import { saveMessage } from '@/utils/messageUtils';
import { useAuth } from '@supabase/auth-helpers-react';

const StatisticsPage = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const userId = auth?.user()?.id;
  
  const handleReturn = () => {
    navigate('/mathematics');
  };

  const handleResultGenerated = async (result: {
    question: string;
    answer: string;
    similarQuestions: string[];
  }) => {
    if (userId) {
      await saveMessage({
        text: result.question,
        userId,
        aiResponse: result.answer,
        chatType: 'teacher',
        toolType: 'statistics',
        additionalData: {
          similarQuestions: result.similarQuestions
        }
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <button 
          onClick={handleReturn}
          className="mb-6 text-kid-blue hover:underline flex items-center"
        >
          ← Back to Mathematics
        </button>

        <div className="flex items-center mb-8">
          <div className="bg-kid-orange p-3 rounded-full mr-4">
            <Pi className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">
            <span className="bg-gradient-to-r from-kid-orange to-orange-600 bg-clip-text text-transparent">
              Statistics
            </span>
          </h1>
        </div>

        <div className="mb-8">
          <p className="text-lg text-gray-700 mb-4">
            Statistics is the study of collecting, analyzing, interpreting, and presenting data. Ask questions about 
            probability, distributions, hypothesis testing, regression, or data analysis.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-kid-orange/10 p-4 rounded-lg border-2 border-kid-orange/30">
              <h3 className="font-bold mb-2">Example Questions:</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>How do I calculate the mean, median, and mode?</li>
                <li>What is standard deviation and how do I interpret it?</li>
                <li>How do I perform a hypothesis test?</li>
                <li>What's the difference between correlation and causation?</li>
              </ul>
            </div>
          </div>
        </div>

        <MathQuestionForm topic="Statistics" onResultGenerated={handleResultGenerated} />
      </main>
      
      <Footer />
    </div>
  );
};

export default StatisticsPage;
