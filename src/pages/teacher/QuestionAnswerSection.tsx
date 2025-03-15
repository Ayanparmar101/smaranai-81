
import React, { useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Mic, MicOff } from 'lucide-react';

interface QuestionAnswerSectionProps {
  question: string;
  setQuestion: (value: string) => void;
  answer: string;
  isListening: boolean;
  toggleListening: () => void;
  askQuestion: () => void;
  isLoading: boolean;
  selectedChapter: string;
}

const QuestionAnswerSection: React.FC<QuestionAnswerSectionProps> = ({
  question,
  setQuestion,
  answer,
  isListening,
  toggleListening,
  askQuestion,
  isLoading,
  selectedChapter
}) => {
  const answerRef = useRef<HTMLDivElement>(null);
  
  return (
    <Card className="h-[500px] flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl">Ask Questions</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="flex items-center space-x-2 mb-4">
          <Textarea
            placeholder="Type your question about the chapter..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="flex-1"
          />
          <Button 
            variant={isListening ? "destructive" : "secondary"}
            size="icon"
            onClick={toggleListening}
            className="flex-shrink-0"
            title={isListening ? "Stop speaking" : "Start speaking"}
          >
            {isListening ? <MicOff /> : <Mic />}
          </Button>
        </div>
        
        <Button 
          onClick={askQuestion} 
          disabled={!selectedChapter || isLoading || !question.trim()}
          className="mb-4"
        >
          {isLoading ? "Thinking..." : "Ask Question"}
        </Button>
        
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-[250px] w-full pr-4" ref={answerRef}>
            <div className="prose max-w-none">
              {answer ? answer : (
                <div className="text-center text-muted-foreground p-4">
                  <p>Your answer will appear here</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionAnswerSection;
