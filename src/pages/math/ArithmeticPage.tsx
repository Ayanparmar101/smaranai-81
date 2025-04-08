
import React from 'react';
import { Layout } from '../../components/Layout';
import { Card } from '@/components/ui/card';
import MathQuestionForm from '@/components/MathQuestionForm';

const ArithmeticPage = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-white mb-8 text-center">Basic Arithmetic</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6 bg-gray-800 border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-4">Practice Arithmetic</h2>
              <p className="text-gray-300 mb-6">
                Build your foundation with addition, subtraction, multiplication, and division exercises.
              </p>
              <MathQuestionForm topic="arithmetic" />
            </Card>
            
            <Card className="p-6 bg-gray-800 border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-4">Learning Resources</h2>
              <p className="text-gray-300 mb-6">
                Access comprehensive tutorials and examples to master arithmetic concepts.
              </p>
              <div className="space-y-4">
                <div className="p-4 bg-gray-700 rounded-lg">
                  <h3 className="text-lg font-medium text-white">Addition & Subtraction</h3>
                  <p className="text-gray-300 mt-2">Learn the fundamentals of adding and subtracting numbers.</p>
                </div>
                <div className="p-4 bg-gray-700 rounded-lg">
                  <h3 className="text-lg font-medium text-white">Multiplication & Division</h3>
                  <p className="text-gray-300 mt-2">Master techniques for multiplying and dividing efficiently.</p>
                </div>
                <div className="p-4 bg-gray-700 rounded-lg">
                  <h3 className="text-lg font-medium text-white">Order of Operations</h3>
                  <p className="text-gray-300 mt-2">Understand PEMDAS and solve complex expressions correctly.</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ArithmeticPage;
