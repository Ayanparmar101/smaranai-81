
import React, { RefObject } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Mic, MicOff } from 'lucide-react';
import { NeoButton } from '@/components/NeoButton';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

interface QuestionAnswerSectionProps {
  question: string;
  setQuestion: (value: string) => void;
  answer: string;
  isListening: boolean;
  toggleListening: () => void;
  askQuestion: () => void;
  isLoading: boolean;
  selectedChapter: string;
  answerRef: RefObject<HTMLDivElement>;
}

const QuestionAnswerSection: React.FC<QuestionAnswerSectionProps> = ({
  question,
  setQuestion,
  answer,
  isListening,
  toggleListening,
  askQuestion,
  isLoading,
  selectedChapter,
  answerRef
}) => {
  return (
    <Card className="h-[500px] flex flex-col neo-card">
      <CardHeader>
        <CardTitle className="text-xl">Ask Questions</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="flex flex-col space-y-2 mb-4">
          <div className="flex items-center space-x-2">
            <Textarea
              placeholder="Type your question about the chapter..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className={`flex-1 neo-input ${isListening ? 'border-green-500 border-2' : ''}`}
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
              <p className="text-xs text-center text-muted-foreground mt-1 animate-pulse">Recording in progress...</p>
            </div>
          )}
        </div>
        
        <NeoButton 
          onClick={askQuestion} 
          disabled={!selectedChapter || isLoading || !question.trim()}
          className="mb-4"
          variant="primary"
          loading={isLoading}
        >
          {isLoading ? "Thinking..." : "Ask Question"}
        </NeoButton>
        
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-[250px] w-full pr-4 border-3 border-black rounded-md shadow-neo-sm" ref={answerRef}>
            <div className="prose max-w-none p-4">
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ) : answer ? (
                answer
              ) : (
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
