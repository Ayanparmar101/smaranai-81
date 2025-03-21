import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, CheckCircle, HelpCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import ApiKeyInput from '@/components/ApiKeyInput';
import DoodleButton from '@/components/DoodleButton';
import DoodleDecoration from '@/components/DoodleDecoration';
import { Slider } from '@/components/ui/slider';
import { Toggle, toggleVariants } from '@/components/ui/toggle';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { NeoButton } from '@/components/NeoButton';
import { openaiService } from '@/services/openaiService';
interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanations?: string[];
}
interface GrammarLesson {
  title: string;
  content: string;
  level: string;
  examples: string[];
  quiz: {
    easy: QuizQuestion[];
    medium: QuizQuestion[];
    hard: QuizQuestion[];
  };
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
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [numQuestions, setNumQuestions] = useState<number>(3);
  const grammarTopics = {
    beginner: ['Nouns and Pronouns', 'Simple Present Tense', 'Articles (a, an, the)', 'Plural Nouns', 'Common Adjectives', 'Subject-Verb Agreement'],
    intermediate: ['Present Continuous Tense', 'Past Simple Tense', 'Prepositions of Time and Place', 'Comparative and Superlative Adjectives', 'Adverbs of Frequency', 'Modal Verbs (can, must)'],
    advanced: ['Present Perfect Tense', 'Past Continuous Tense', 'Future Tenses', 'Conditional Sentences', 'Passive Voice', 'Reported Speech']
  };
  useEffect(() => {
    const savedApiKey = localStorage.getItem('openaiApiKey');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      openaiService.setApiKey(savedApiKey);
    } else {
      navigate('/');
    }
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
    setUserAnswers([]);
    try {
      const promptLevel = selectedLevel === 'beginner' ? 'grades 1-2' : selectedLevel === 'intermediate' ? 'grades 3-5' : 'grades 6-8';
      const difficultyLevel = selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1);
      const questionCount = Math.max(1, Math.min(10, numQuestions));
      const systemPrompt = `You are an expert English teacher for elementary school students. Create an engaging English grammar lesson about "${topic}" for ${promptLevel}. The lesson difficulty should be "${difficultyLevel}".
      
      Your response must follow this exact JSON format without any markdown formatting or extra text:
      {
        "title": "Lesson title",
        "content": "A clear, simple explanation of the grammar concept (keep it concise)",
        "level": "${difficultyLevel}",
        "examples": ["Example 1", "Example 2", "Example 3"],
        "quiz": {
          "${selectedDifficulty}": [
            {
              "question": "Question text",
              "options": ["Option A", "Option B", "Option C", "Option D"],
              "correctIndex": 0,
              "explanations": ["Explanation for A", "Explanation for B", "Explanation for C", "Explanation for D"]
            }
          ]
        }
      }
      
      Important instructions:
      1. Generate EXACTLY ${questionCount} quiz questions for the "${selectedDifficulty}" difficulty.
      2. Keep the explanation and content brief and simple.
      3. Return only in strict JSON format with no extra text, markdown, or code blocks.
      4. Make sure all JSON is properly formatted and closed.`;
      const result = await openaiService.createCompletion(systemPrompt, 'Generate a grammar lesson', {
        max_tokens: 3000,
        temperature: 0.7
      });
      try {
        let jsonStr = result.replace(/```json\n|\n```|```|\n/g, '').trim();
        console.log("Raw JSON string length:", jsonStr.length);
        try {
          const parsedLesson = JSON.parse(jsonStr);
          const receivedQuestions = parsedLesson.quiz[selectedDifficulty]?.length || 0;
          console.log(`Received ${receivedQuestions} questions for ${selectedDifficulty} difficulty`);
          if (!parsedLesson.title || !parsedLesson.content || !parsedLesson.examples || !parsedLesson.quiz || !parsedLesson.quiz[selectedDifficulty]) {
            throw new Error("Lesson data is missing required fields");
          }
          if (receivedQuestions < questionCount) {
            console.warn(`Received ${receivedQuestions} questions, but ${questionCount} were requested. Adding fallback questions.`);
            const fallbackQuestions = generateFallbackQuestions(questionCount - receivedQuestions, topic, selectedDifficulty);
            parsedLesson.quiz[selectedDifficulty] = [...parsedLesson.quiz[selectedDifficulty], ...fallbackQuestions];
          }
          if (receivedQuestions > questionCount) {
            parsedLesson.quiz[selectedDifficulty] = parsedLesson.quiz[selectedDifficulty].slice(0, questionCount);
          }
          setLesson(parsedLesson);
          setUserAnswers(new Array(parsedLesson.quiz[selectedDifficulty].length).fill(-1));
        } catch (jsonError) {
          console.error("JSON parsing error:", jsonError);
          if (jsonStr.length > 500) {
            console.log("JSON preview (first 500 chars):", jsonStr.substring(0, 500));
            console.log("JSON preview (last 100 chars):", jsonStr.substring(jsonStr.length - 100));
          }
          const fallbackLesson = createFallbackLesson(topic, questionCount, selectedDifficulty);
          setLesson(fallbackLesson);
          setUserAnswers(new Array(fallbackLesson.quiz[selectedDifficulty].length).fill(-1));
          toast.warning("Had trouble generating a perfect lesson, but created a simple version for you.");
        }
      } catch (error) {
        console.error("Error processing lesson content:", error);
        toast.error("Failed to parse lesson content. Please try a different topic or fewer questions.");
      }
    } catch (error) {
      console.error('Error generating lesson:', error);
      toast.error('Failed to generate lesson. Please try again with fewer questions.');
    } finally {
      setLoading(false);
    }
  };
  const generateFallbackQuestions = (count: number, topic: string, difficulty: 'easy' | 'medium' | 'hard'): QuizQuestion[] => {
    const fallbackQuestions: QuizQuestion[] = [];
    for (let i = 0; i < count; i++) {
      fallbackQuestions.push({
        question: `Practice question ${i + 1} about ${topic}`,
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctIndex: 0,
        explanations: ["This is correct", "This is incorrect", "This is incorrect", "This is incorrect"]
      });
    }
    return fallbackQuestions;
  };
  const createFallbackLesson = (topic: string, questionCount: number, difficulty: 'easy' | 'medium' | 'hard'): GrammarLesson => {
    const fallbackLesson: GrammarLesson = {
      title: `Lesson about ${topic}`,
      content: `This is a basic lesson about ${topic}. Let's learn together!`,
      level: difficulty.charAt(0).toUpperCase() + difficulty.slice(1),
      examples: ["Example 1", "Example 2", "Example 3"],
      quiz: {
        easy: [],
        medium: [],
        hard: []
      }
    };
    fallbackLesson.quiz[difficulty] = generateFallbackQuestions(questionCount, topic, difficulty);
    return fallbackLesson;
  };
  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    if (showResults) return;
    const newAnswers = [...userAnswers];
    newAnswers[questionIndex] = answerIndex;
    setUserAnswers(newAnswers);
  };
  const handleQuizSubmit = () => {
    if (!lesson) return;
    if (userAnswers.includes(-1)) {
      toast.error('Please answer all questions before submitting');
      return;
    }
    setShowResults(true);
    let correctAnswers = 0;
    userAnswers.forEach((answer, index) => {
      if (answer === lesson.quiz[selectedDifficulty][index].correctIndex) {
        correctAnswers++;
      }
    });
    const percentage = Math.round(correctAnswers / lesson.quiz[selectedDifficulty].length * 100);
    if (percentage >= 80) {
      toast.success(`Great job! You scored ${percentage}%`);
    } else if (percentage >= 60) {
      toast.info(`Good effort! You scored ${percentage}%`);
    } else {
      toast.info(`You scored ${percentage}%. Let's review the lesson and try again!`);
    }
  };
  const resetQuiz = () => {
    setUserAnswers(new Array(lesson?.quiz[selectedDifficulty].length || 0).fill(-1));
    setShowResults(false);
  };
  return <div className="min-h-screen flex flex-col bg-background">
      <NavBar />

      <main className="flex-1">
        <div className="page-container">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold">
              <span className="flex items-center gap-2">
                <BookOpen className="text-kid-green" />
                English Grammar Learner
              </span>
            </h1>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Select your level:</h2>
            <ToggleGroup type="single" value={selectedLevel} onValueChange={value => value && setSelectedLevel(value as any)}>
              <ToggleGroupItem value="beginner" className="flex-1">
                Beginner (Grades 1-2)
              </ToggleGroupItem>
              <ToggleGroupItem value="intermediate" className="flex-1">
                Intermediate (Grades 3-5)
              </ToggleGroupItem>
              <ToggleGroupItem value="advanced" className="flex-1">
                Advanced (Grades 6-8)
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Select Difficulty:</h2>
            <ToggleGroup type="single" value={selectedDifficulty} onValueChange={value => value && setSelectedDifficulty(value as any)}>
              <ToggleGroupItem value="easy" className="flex-1 text-green-800 bg-green-300 hover:bg-green-200">
                Easy
              </ToggleGroupItem>
              <ToggleGroupItem value="medium" className="flex-1 bg-yellow-200/30 text-yellow-800 data-[state=on]:bg-yellow-200 data-[state=on]:text-yellow-800">
                Medium
              </ToggleGroupItem>
              <ToggleGroupItem value="hard" className="flex-1 bg-red-200/30 text-red-800 data-[state=on]:bg-red-200 data-[state=on]:text-red-800">
                Hard
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Number of Questions: {numQuestions}</h2>
            <div className="px-4 py-2 bg-white border-3 border-black rounded-md shadow-neo-sm">
              <Slider value={[numQuestions]} max={10} min={1} step={1} onValueChange={value => {
              console.log("Slider value changed to:", value[0]);
              setNumQuestions(value[0]);
            }} className="w-full" />
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                <span>1</span>
                <span>5</span>
                <span>10</span>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-xl font-semibold mb-4">Choose a topic to study:</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {grammarTopics[selectedLevel].map(topic => <button key={topic} onClick={() => selectTopic(topic)} className={`p-4 border-3 border-black rounded-xl transition-all ${selectedTopic === topic ? 'bg-kid-green text-white shadow-none translate-y-1' : 'bg-white shadow-neo-sm hover:shadow-none hover:translate-y-1'}`}>
                  {topic}
                </button>)}
            </div>
          </div>

          {loading ? <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-kid-green border-t-transparent"></div>
              <p className="mt-4 text-lg">Generating your lesson...</p>
            </div> : lesson ? <div className="bg-white rounded-2xl p-6 shadow-neo border-3 border-black mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{lesson.title}</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border-2 border-black ${lesson.level === 'Easy' ? 'bg-green-100 text-green-800' : lesson.level === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                  {lesson.level}
                </span>
              </div>

              <div className="prose max-w-none mb-8">
                <div dangerouslySetInnerHTML={{
              __html: lesson.content.replace(/\n/g, '<br />')
            }} />
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Examples:</h3>
                <ul className="space-y-2">
                  {lesson.examples.map((example, index) => <li key={index} className="flex items-start">
                      <span className="bg-kid-yellow text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 border-2 border-black">
                        {index + 1}
                      </span>
                      <span>{example}</span>
                    </li>)}
                </ul>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">Practice Quiz:</h3>
                  {showResults && <NeoButton variant="success" size="sm" onClick={resetQuiz} icon={<RefreshCw className="w-4 h-4" />}>
                      Try Again
                    </NeoButton>}
                </div>

                <div className="space-y-6">
                  {lesson.quiz[selectedDifficulty].map((question, qIndex) => <div key={qIndex} className="bg-muted/50 p-4 rounded-xl border-3 border-black shadow-neo-sm">
                      <p className="font-medium mb-3">{qIndex + 1}. {question.question}</p>
                      <div className="space-y-2">
                        {question.options.map((option, oIndex) => <div key={oIndex} onClick={() => handleAnswerSelect(qIndex, oIndex)} className={`p-3 rounded-lg cursor-pointer flex items-center transition-all border-3 ${userAnswers[qIndex] === oIndex ? 'border-black bg-kid-green/20 shadow-none translate-y-1' : 'border-black bg-white shadow-neo-sm hover:shadow-none hover:translate-y-1'} ${showResults ? oIndex === question.correctIndex ? 'bg-green-100 border-black text-green-900 shadow-none translate-y-1' : userAnswers[qIndex] === oIndex && userAnswers[qIndex] !== question.correctIndex ? 'bg-red-100 border-black text-red-900 shadow-none translate-y-1' : '' : ''}`}>
                            <span className="mr-3 w-6 h-6 rounded-full bg-muted/80 flex items-center justify-center border-2 border-black">
                              {String.fromCharCode(65 + oIndex)}
                            </span>
                            <span>{option}</span>
                            {showResults && oIndex === question.correctIndex && <CheckCircle className="ml-auto text-green-500 w-5 h-5" />}
                            {showResults && userAnswers[qIndex] === oIndex && userAnswers[qIndex] !== question.correctIndex && <HelpCircle className="ml-auto text-red-500 w-5 h-5" />}
                          </div>)}
                      </div>
                      {showResults && <div className="mt-2 p-3 border-3 border-black rounded-lg bg-white shadow-neo-sm">
                          {userAnswers[qIndex] === question.correctIndex ? <span className="text-green-600 flex items-center gap-1">
                              <CheckCircle size={16} /> Correct!
                            </span> : <div className="text-red-600">
                              <p>Incorrect. The correct answer is: {question.options[question.correctIndex]}</p>
                              {question.explanations && question.explanations[userAnswers[qIndex]] && <p className="mt-1 text-sm">
                                  Why it's wrong: {question.explanations[userAnswers[qIndex]]}
                                </p>}
                            </div>}
                        </div>}
                    </div>)}
                </div>

                {!showResults && <div className="mt-8 flex justify-center gap-4">
                    <NeoButton variant="success" size="lg" onClick={handleQuizSubmit}>
                      Submit Answers
                    </NeoButton>
                  </div>}
                {showResults && <div className="mt-8 flex justify-center gap-4">
                    <NeoButton variant="secondary" size="lg" onClick={() => {
                setShowResults(false);
                generateLesson(selectedTopic);
              }}>
                      New Practice
                    </NeoButton>
                  </div>}
              </div>
            </div> : selectedTopic ? <div className="text-center py-12">
              <p className="text-muted-foreground">
                {apiKey ? "Click 'Generate Lesson' to start learning" : "Please enter your OpenAI API key to generate lessons"}
              </p>
            </div> : null}
        </div>
      </main>

      <Footer />
    </div>;
};
export default GrammarPage;