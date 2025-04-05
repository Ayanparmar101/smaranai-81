import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import MathQuestionForm from '@/components/MathQuestionForm';
import { Calculator } from 'lucide-react';
import { saveMessage } from '@/utils/messageUtils';
import { useAuth } from '@/contexts/AuthContext';

const ArithmeticPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const handleReturn = () => {
    navigate('/mathematics');
  };

  const handleResultGenerated = async (result: {
    question: string;
    answer: string;
    similarQuestions: string[];
  }) => {
    if (user?.id) {
      await saveMessage({
        text: result.question,
        userId: user.id,
        aiResponse: result.answer,
        chatType: 'teacher',
        toolType: 'basic-arithmetic',
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
          <div className="bg-kid-blue p-3 rounded-full mr-4">
            <Calculator className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">
            <span className="bg-gradient-to-r from-kid-blue to-blue-600 bg-clip-text text-transparent">
              Basic Arithmetic
            </span>
          </h1>
        </div>

        <div className="mb-8">
          <p className="text-lg text-gray-700 mb-4">
            Basic arithmetic is the foundation of mathematics, covering addition, subtraction, multiplication, and division. 
            Ask any question about arithmetic calculations, number properties, or solving basic math problems.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-kid-blue/10 p-4 rounded-lg border-2 border-kid-blue/30">
              <h3 className="font-bold mb-2">Example Questions:</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>How do I add fractions with different denominators?</li>
                <li>What's the process for long division?</li>
                <li>How do I multiply decimal numbers?</li>
                <li>Explain the order of operations (PEMDAS/BODMAS)</li>
              </ul>
            </div>
          </div>
        </div>

        <MathQuestionForm topic="Basic Arithmetic" onResultGenerated={handleResultGenerated} />
      </main>
      
      <Footer />
    </div>
  );
};

export default ArithmeticPage;
