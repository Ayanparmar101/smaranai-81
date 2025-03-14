
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, CheckCircle, HelpCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import ApiKeyInput from '@/components/ApiKeyInput';
import DoodleButton from '@/components/DoodleButton';
import DoodleDecoration from '@/components/DoodleDecoration';
import { openaiService } from '@/services/openaiService';

interface GrammarLesson {
  title: string;
  content: string;
  level: 'Easy' | 'Medium' | 'Hard';
  examples: string[];
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
  }[];
}

const GrammarPage = () => {
  const navigate = useNavigate();
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [lesson, setLesson] = useState<GrammarLesson | null>(null);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  
  const grammarTopics = {
    beginner: [
      'Nouns and Pronouns',
      'Simple Present Tense',
      'Articles (a, an, the)',
      'Plural Nouns',
      'Common Adjectives',
      'Subject-Verb Agreement',
    ],
    intermediate: [
      'Present Continuous Tense',
      'Past Simple Tense',
      'Prepositions of Time and Place',
      'Comparative and Superlative Adjectives',
      'Adverbs of Frequency',
      'Modal Verbs (can, must)',
    ],
    advanced: [
      'Present Perfect Tense',
      'Past Continuous Tense',
      'Future Tenses',
      'Conditional Sentences',
      'Passive Voice',
      'Reported Speech',
    ],
  };

  useEffect(() => {
    const savedApiKey = localStorage.getItem('openaiApiKey');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      openaiService.setApiKey(savedApiKey);
    }
    
    // Reset state when component mounts
    setLesson(null);
    setUserAnswers([]);
    setShowResults(false);
  }, []);

  const handleApiKeySubmit = (key: string) => {
    setApiKey(key);
    openaiService.setApiKey(key);
  };

  const selectTopic = (topic: string) => {
    setSelectedTopic(topic);
    if (apiKey) {
      generateLesson(topic);
    } else {
      toast.error('Please enter your OpenAI API key first');
    }
  };

  const generateLesson = async (topic: string) => {
    setLoading(true);
    setLesson(null);
    
    try {
      const promptLevel = selectedLevel === 'beginner' ? 'grades 1-2' : 
                         selectedLevel === 'intermediate' ? 'grades 3-5' : 'grades 6-8';
      
      const systemPrompt = `You are an expert English teacher for elementary school students. Create an engaging English grammar lesson about "${topic}" for ${promptLevel}. 
      The response must be in valid JSON format with the following structure:
      {
        "title": "Lesson title",
        "content": "A clear, simple explanation of the grammar concept with examples",
        "level": "Easy/Medium/Hard",
        "examples": ["Example 1", "Example 2", "Example 3"],
        "quiz": [
          {
            "question": "Question text",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctIndex": 0 // Index of the correct answer (0 for Option A, etc.)
          }
        ] // Include 3-5 quiz questions
      }
      Make the explanation fun and use simple language appropriate for children. Use colorful examples that kids can relate to.`;
      
      const result = await openaiService.createCompletion(systemPrompt, 'Generate a grammar lesson');
      const lessonData: GrammarLesson = JSON.parse(result);
      
      setLesson(lessonData);
      setUserAnswers(new Array(lessonData.quiz.length).fill(-1));
    } catch (error) {
      console.error('Error generating lesson:', error);
      toast.error('Failed to generate lesson. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    if (showResults) return; // Don't allow changes after submission
    
    const newAnswers = [...userAnswers];
    newAnswers[questionIndex] = answerIndex;
    setUserAnswers(newAnswers);
  };

  const handleQuizSubmit = () => {
    if (!lesson) return;
    
    // Check if all questions are answered
    if (userAnswers.includes(-1)) {
      toast.error('Please answer all questions before submitting');
      return;
    }
    
    setShowResults(true);
    
    // Calculate score
    let correctAnswers = 0;
    userAnswers.forEach((answer, index) => {
      if (answer === lesson.quiz[index].correctIndex) {
        correctAnswers++;
      }
    });
    
    const percentage = Math.round((correctAnswers / lesson.quiz.length) * 100);
    
    if (percentage >= 80) {
      toast.success(`Great job! You scored ${percentage}%`);
    } else if (percentage >= 60) {
      toast.info(`Good effort! You scored ${percentage}%`);
    } else {
      toast.info(`You scored ${percentage}%. Let's review the lesson and try again!`);
    }
  };

  const resetQuiz = () => {
    setUserAnswers(new Array(lesson?.quiz.length || 0).fill(-1));
    setShowResults(false);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-1">
        <div className="page-container">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold">
              <span className="flex items-center gap-2">
                <BookOpen className="text-kid-green" />
                English Grammar Learner
              </span>
            </h1>
            <ApiKeyInput onApiKeySubmit={handleApiKeySubmit} />
          </div>
          
          {/* Level selection */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Select your level:</h2>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setSelectedLevel('beginner')}
                className={`px-4 py-2 rounded-full transition-all ${
                  selectedLevel === 'beginner'
                    ? 'bg-kid-green text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                Beginner (Grades 1-2)
              </button>
              <button
                onClick={() => setSelectedLevel('intermediate')}
                className={`px-4 py-2 rounded-full transition-all ${
                  selectedLevel === 'intermediate'
                    ? 'bg-kid-blue text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                Intermediate (Grades 3-5)
              </button>
              <button
                onClick={() => setSelectedLevel('advanced')}
                className={`px-4 py-2 rounded-full transition-all ${
                  selectedLevel === 'advanced'
                    ? 'bg-kid-purple text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                Advanced (Grades 6-8)
              </button>
            </div>
          </div>
          
          {/* Topics grid */}
          <div className="mb-12">
            <h2 className="text-xl font-semibold mb-4">Choose a topic to study:</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {grammarTopics[selectedLevel].map((topic) => (
                <button
                  key={topic}
                  onClick={() => selectTopic(topic)}
                  className={`p-4 border-2 border-dashed rounded-xl transition-all hover:shadow-md ${
                    selectedTopic === topic
                      ? 'bg-kid-green/10 border-kid-green'
                      : 'bg-white border-gray-200 hover:border-kid-green/50'
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
          
          {/* Lesson content */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-kid-green border-t-transparent"></div>
              <p className="mt-4 text-lg">Generating your lesson...</p>
            </div>
          ) : lesson ? (
            <div className="bg-white rounded-2xl p-6 shadow-lg border-4 border-dashed border-kid-green mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{lesson.title}</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  lesson.level === 'Easy' ? 'bg-green-100 text-green-800' :
                  lesson.level === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {lesson.level}
                </span>
              </div>
              
              <div className="prose max-w-none mb-8">
                <div dangerouslySetInnerHTML={{ __html: lesson.content.replace(/\n/g, '<br />') }} />
              </div>
              
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Examples:</h3>
                <ul className="space-y-2">
                  {lesson.examples.map((example, index) => (
                    <li key={index} className="flex items-start">
                      <span className="bg-kid-yellow text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">
                        {index + 1}
                      </span>
                      <span>{example}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">Practice Quiz:</h3>
                  {showResults && (
                    <DoodleButton
                      color="green"
                      size="sm"
                      onClick={resetQuiz}
                      icon={<RefreshCw className="w-4 h-4" />}
                    >
                      Try Again
                    </DoodleButton>
                  )}
                </div>
                
                <div className="space-y-6">
                  {lesson.quiz.map((question, qIndex) => (
                    <div key={qIndex} className="bg-gray-50 p-4 rounded-xl">
                      <p className="font-medium mb-3">{qIndex + 1}. {question.question}</p>
                      <div className="space-y-2">
                        {question.options.map((option, oIndex) => (
                          <div 
                            key={oIndex}
                            onClick={() => handleAnswerSelect(qIndex, oIndex)}
                            className={`p-3 rounded-lg cursor-pointer flex items-center transition-all ${
                              userAnswers[qIndex] === oIndex 
                                ? 'bg-kid-green/20 border-kid-green border-2'
                                : 'bg-white border-2 border-gray-200 hover:border-kid-green/50'
                            } ${
                              showResults 
                                ? oIndex === question.correctIndex 
                                  ? 'bg-green-100 border-green-500 border-2'
                                  : userAnswers[qIndex] === oIndex && userAnswers[qIndex] !== question.correctIndex
                                    ? 'bg-red-100 border-red-500 border-2'
                                    : ''
                                : ''
                            }`}
                          >
                            <span className="mr-3 w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                              {String.fromCharCode(65 + oIndex)}
                            </span>
                            <span>{option}</span>
                            {showResults && oIndex === question.correctIndex && (
                              <CheckCircle className="ml-auto text-green-500 w-5 h-5" />
                            )}
                            {showResults && userAnswers[qIndex] === oIndex && userAnswers[qIndex] !== question.correctIndex && (
                              <HelpCircle className="ml-auto text-red-500 w-5 h-5" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                
                {!showResults && (
                  <div className="mt-8 flex justify-center">
                    <DoodleButton
                      color="green"
                      size="lg"
                      onClick={handleQuizSubmit}
                    >
                      Submit Answers
                    </DoodleButton>
                  </div>
                )}
              </div>
            </div>
          ) : selectedTopic ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {apiKey ? "Click 'Generate Lesson' to start learning" : "Please enter your OpenAI API key to generate lessons"}
              </p>
            </div>
          ) : null}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default GrammarPage;
