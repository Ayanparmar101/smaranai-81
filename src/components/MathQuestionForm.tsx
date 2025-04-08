
import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { NeoButton } from '@/components/NeoButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import openaiService from '@/services/openaiService';

interface MathQuestionFormProps {
  topic: string;
  onResultGenerated?: (result: {
    question: string;
    answer: string;
    similarQuestions: string[];
  }) => void;
}

const MathQuestionForm: React.FC<MathQuestionFormProps> = ({ topic, onResultGenerated }) => {
  const [question, setQuestion] = useState('');
  const [explanation, setExplanation] = useState('');
  const [similarQuestions, setSimilarQuestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  // Web Speech API for voice input
  const toggleListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      toast.error('Speech recognition is not supported in your browser');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuestion((prev) => prev + ' ' + transcript);
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event);
      toast.error('Failed to recognize speech');
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    setIsListening(true);
    recognition.start();
  };

  // Handle question submission
  const handleSubmit = async () => {
    if (!question.trim()) {
      toast.error('Please enter a question');
      return;
    }

    setIsLoading(true);
    setExplanation('');
    setSimilarQuestions([]);

    try {
      // Use OpenAI to generate the answer and similar questions
      const systemPrompt = `You are a ${topic} tutor for students. 
      A student has asked a ${topic} question. 
      First, provide a clear, step-by-step explanation to solve the problem. 
      Break down complex concepts into simple steps. 
      Use mathematical notation when appropriate.
      
      After providing the explanation, generate 3 similar practice questions that reinforce the same concepts but are not identical to the original question.
      
      Format your response in the following JSON structure:
      {
        "explanation": "Step-by-step solution here...",
        "similarQuestions": [
          "Similar question 1",
          "Similar question 2",
          "Similar question 3"
        ]
      }
      
      Return ONLY the properly formatted JSON with no additional text.`;

      const result = await openaiService.createCompletion(
        systemPrompt,
        question,
        { temperature: 0.7, max_tokens: 2500 }
      );

      try {
        // Try to parse the JSON response
        const parsedResult = JSON.parse(result);
        setExplanation(parsedResult.explanation);
        setSimilarQuestions(parsedResult.similarQuestions);
        
        // Call the callback if provided
        if (onResultGenerated) {
          onResultGenerated({
            question,
            answer: parsedResult.explanation,
            similarQuestions: parsedResult.similarQuestions
          });
        }
      } catch (error) {
        console.error('Failed to parse response:', error);
        toast.error('Failed to get a proper response. Please try again.');
        setExplanation(result); // Fallback to showing the raw response
      }
    } catch (error) {
      console.error('Error generating explanation:', error);
      toast.error('Failed to generate explanation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="neo-card">
        <CardHeader>
          <CardTitle>Ask a {topic} Question</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <Textarea
                  placeholder={`Enter your ${topic} question here...`}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className={`flex-1 neo-input min-h-[100px] ${isListening ? 'border-green-500 border-2' : ''}`}
                />
                <NeoButton 
                  variant={isListening ? "destructive" : "secondary"}
                  size="sm"
                  onClick={toggleListening}
                  className={`flex-shrink-0 ${isListening ? 'animate-pulse' : ''}`}
                  icon={isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                >
                  {isListening ? "" : ""}
                </NeoButton>
              </div>
              
              {isListening && (
                <div className="w-full">
                  <Progress value={100} className="h-1 w-full bg-slate-200 animate-pulse" />
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-muted-foreground animate-pulse">Recording voice input...</span>
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 bg-red-500 rounded-full animate-[pulse_1s_ease-in-out_infinite]"></div>
                      <div className="w-1 h-2 bg-red-500 rounded-full animate-[pulse_1s_ease-in-out_0.3s_infinite]"></div>
                      <div className="w-1 h-3 bg-red-500 rounded-full animate-[pulse_1s_ease-in-out_0.5s_infinite]"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <NeoButton 
              onClick={handleSubmit} 
              disabled={isLoading || !question.trim()}
              variant="primary"
              fullWidth
              loading={isLoading}
            >
              {isLoading ? "Solving..." : "Solve Step by Step"}
            </NeoButton>
          </div>
        </CardContent>
      </Card>

      {explanation && (
        <Card className="neo-card">
          <CardHeader>
            <CardTitle>Step-by-Step Solution</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] w-full pr-4 rounded-md shadow-neo-sm">
              <div className="prose max-w-none p-4">
                <pre className="whitespace-pre-wrap">{explanation}</pre>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {similarQuestions.length > 0 && (
        <Card className="neo-card">
          <CardHeader>
            <CardTitle>Similar Practice Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {similarQuestions.map((q, index) => (
                <Card key={index} className="p-4 border-3 border-black shadow-neo-sm">
                  <p>{q}</p>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MathQuestionForm;
