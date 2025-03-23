
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, Sigma, Pi, Function, BrainCircuit, GraduationCap, BookOpen, PenTool } from 'lucide-react';
import DoodleCard from '@/components/DoodleCard';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

const MathematicsPage = () => {
  const navigate = useNavigate();
  
  const handleToolClick = (tool: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    console.log(`Clicked on ${tool}`);
    // Future implementation for mathematics tools
  };

  const mathTools = [
    { 
      name: 'Basic Arithmetic', 
      icon: <Calculator className="w-10 h-10" />, 
      color: 'blue',
      description: 'Master addition, subtraction, multiplication, and division'
    },
    { 
      name: 'Algebra', 
      icon: <Function className="w-10 h-10" />, 
      color: 'purple',
      description: 'Learn equations, variables, and algebraic expressions'
    },
    { 
      name: 'Geometry', 
      icon: <PenTool className="w-10 h-10" />, 
      color: 'green',
      description: 'Explore shapes, angles, and spatial relationships'
    },
    { 
      name: 'Calculus', 
      icon: <Sigma className="w-10 h-10" />, 
      color: 'yellow',
      description: 'Understand derivatives, integrals, and limits'
    },
    { 
      name: 'Statistics', 
      icon: <Pi className="w-10 h-10" />, 
      color: 'orange',
      description: 'Work with data, probability, and statistical analysis'
    },
    { 
      name: 'Problem Solving', 
      icon: <BrainCircuit className="w-10 h-10" />, 
      color: 'red',
      description: 'Develop critical thinking and mathematical reasoning skills'
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
                Mathematics Learning
              </span>
            </h1>
            <p className="text-xl mb-12 text-gray-700 text-center max-w-3xl mx-auto">
              Explore various branches of mathematics with interactive tools, exercises, and AI-powered problem solving
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
              {mathTools.map((tool, index) => (
                <DoodleCard 
                  key={index}
                  title={tool.name} 
                  description={tool.description} 
                  icon={tool.icon} 
                  color={tool.color as 'green' | 'blue' | 'red' | 'yellow' | 'purple' | 'orange' | 'pink'} 
                  onClick={handleToolClick(tool.name)}
                  className="hover:scale-105 transition-transform duration-300"
                >
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <button 
                      onClick={handleToolClick(tool.name)} 
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
              <Pi size={64} />
            </div>
          </div>
          <div className="absolute bottom-20 right-10 opacity-20">
            <div className="text-kid-purple">
              <Function size={64} />
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default MathematicsPage;
