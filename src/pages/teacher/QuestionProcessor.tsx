
import React, { useRef, useState } from 'react';
import { toast } from 'sonner';
import { openaiService } from '@/services/openaiService';
import { saveMessage } from '@/utils/messageUtils';
import { books } from './ChapterSelector';
import { useAuth } from '@/contexts/AuthContext';

interface QuestionProcessorProps {
  question: string;
  setQuestion: (value: string) => void;
  chapterContent: string;
  selectedBook: string;
  selectedChapter: string;
  selectedClass: string;
}

export const useQuestionProcessor = ({
  question,
  setQuestion,
  chapterContent,
  selectedBook,
  selectedChapter,
  selectedClass
}: QuestionProcessorProps) => {
  const [answer, setAnswer] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const answerRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const saveToHistory = async (text: string, isUserMessage: boolean, aiResponse?: string) => {
    if (!user) return;
    
    try {
      await saveMessage({
        text,
        userId: user.id,
        aiResponse: isUserMessage ? undefined : aiResponse,
        chatType: 'teacher'
      });
    } catch (error) {
      console.error('Error in saveToHistory:', error);
      toast.error('Failed to save message history');
    }
  };

  const askQuestion = async () => {
    if (!question.trim()) {
      toast.error('Please enter a question');
      return;
    }
    
    if (!openaiService.getApiKey()) {
      toast.error('Please set your OpenAI API key first');
      return;
    }
    
    if (!chapterContent) {
      toast.error('No chapter content loaded. Please upload a PDF for this chapter.');
      return;
    }
    
    setIsLoading(true);
    setAnswer("");

    await saveToHistory(question, true);
    
    try {
      const book = books.find(b => b.id === selectedBook);
      const chapter = book?.chapters.find(c => c.id === selectedChapter);
      
      const systemPrompt = `You are a helpful, educational assistant specializing in English literature for Class ${selectedClass} students. 
      You will answer questions about the chapter "${chapter?.name}" based on the provided content. 
      Be thorough but keep your explanations at an appropriate level for the student's grade. 
      Always base your responses on the provided chapter content.`;
      
      let fullResponse = '';
      await openaiService.createCompletion(
        systemPrompt,
        `Chapter Content: ${chapterContent}\n\nQuestion: ${question}`,
        {
          stream: true,
          onChunk: (chunk) => {
            fullResponse += chunk;
            setAnswer(prev => prev + chunk);
            if (answerRef.current) {
              answerRef.current.scrollTop = answerRef.current.scrollHeight;
            }
          }
        }
      );

      await saveToHistory(question, false, fullResponse);
    } catch (error) {
      console.error('Error getting answer:', error);
      toast.error('Failed to get answer. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return { answer, isLoading, askQuestion, answerRef };
};
