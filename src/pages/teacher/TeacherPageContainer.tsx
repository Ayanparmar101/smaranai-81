
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ChapterPDFUploader } from '@/components/ChapterPDFUploader';
import ChapterSelector from './ChapterSelector';
import ChapterContent from './ChapterContent';
import QuestionAnswerSection from './QuestionAnswerSection';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useChapterContent } from '@/hooks/useChapterContent';
import { useOpenAI } from '@/hooks/useOpenAI';
import { useQuestionProcessor } from './QuestionProcessor';

const TeacherPageContainer: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState<string>("8");
  const [selectedBook, setSelectedBook] = useState<string>("honeydew");
  const [selectedChapter, setSelectedChapter] = useState<string>("");
  const [question, setQuestion] = useState<string>("");
  
  // Initialize hooks
  useOpenAI();
  const { chapterContent, pdfUrl, handleFileUpload } = useChapterContent(selectedBook, selectedChapter);
  const { isListening, toggleListening } = useSpeechRecognition({
    onTranscriptChange: setQuestion
  });
  const { answer, isLoading, askQuestion, answerRef } = useQuestionProcessor({
    question,
    setQuestion,
    chapterContent,
    selectedBook,
    selectedChapter,
    selectedClass
  });

  useEffect(() => {
    if (!user) {
      toast.error('Please sign in to access the teacher features');
      navigate('/auth');
    }
  }, [user, navigate]);

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">Teacher</CardTitle>
          <CardDescription>
            Select your class and chapter, then ask questions about the content.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChapterSelector
            selectedClass={selectedClass}
            setSelectedClass={setSelectedClass}
            selectedBook={selectedBook}
            setSelectedBook={setSelectedBook}
            selectedChapter={selectedChapter}
            setSelectedChapter={setSelectedChapter}
          />
          
          <div className="mb-4">
            <div className="flex justify-end items-center">
              {selectedChapter && (
                <ChapterPDFUploader 
                  onFileUpload={handleFileUpload}
                  chapterId={`${selectedBook}-${selectedChapter}`}
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChapterContent 
          chapterContent={chapterContent} 
          pdfUrl={pdfUrl} 
        />
        
        <QuestionAnswerSection
          question={question}
          setQuestion={setQuestion}
          answer={answer}
          isListening={isListening}
          toggleListening={toggleListening}
          askQuestion={askQuestion}
          isLoading={isLoading}
          selectedChapter={selectedChapter}
          answerRef={answerRef}
        />
      </div>
    </div>
  );
};

export default TeacherPageContainer;
