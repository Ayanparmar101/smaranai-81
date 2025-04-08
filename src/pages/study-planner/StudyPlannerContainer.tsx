
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import ApiKeyInput from '@/components/ApiKeyInput';
import openaiService from '@/services/openaiService';
import StudyPlanDisplay from './StudyPlanDisplay';
import IntroCard from './IntroCard';
import ChapterSelectionCard from './ChapterSelectionCard';
import PDFDisplayCard from './PDFDisplayCard';
import { useChapterContent } from './useChapterContent';
import { useStudyPlanGenerator } from './useStudyPlanGenerator';

const StudyPlannerContainer = () => {
  const [selectedClass, setSelectedClass] = useState<string>("8");
  const [selectedBook, setSelectedBook] = useState<string>("honeydew");
  const [selectedChapter, setSelectedChapter] = useState<string>("");
  
  const { chapterContent, pdfUrl, handleFileUpload } = useChapterContent(selectedChapter, selectedBook);
  const { studyPlan, isGenerating, progress, generateStudyPlan, handleStepCompletion } = useStudyPlanGenerator(chapterContent);

  useEffect(() => {
    const envApiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (envApiKey) {
      openaiService.setApiKey(envApiKey);
    } else {
      const savedApiKey = localStorage.getItem('openaiApiKey');
      if (savedApiKey) {
        openaiService.setApiKey(savedApiKey);
      }
    }
  }, []);

  const handleChapterSelect = (chapterId: string) => {
    setSelectedChapter(chapterId);
    // Resetting study plan when chapter changes
    if (studyPlan) {
      // Don't try to call the hook setter directly
    }
  };

  const handleGenerateStudyPlan = () => {
    generateStudyPlan(selectedChapter, selectedBook);
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-4xl">
      <ApiKeyInput onApiKeySubmit={(key) => openaiService.setApiKey(key)} />
      
      <IntroCard studyPlan={studyPlan} progress={progress} />
      
      <div className="grid grid-cols-1 gap-6">
        <ChapterSelectionCard
          selectedClass={selectedClass}
          setSelectedClass={setSelectedClass}
          selectedBook={selectedBook}
          setSelectedBook={setSelectedBook}
          selectedChapter={selectedChapter}
          setSelectedChapter={handleChapterSelect}
          generateStudyPlan={handleGenerateStudyPlan}
          isGenerating={isGenerating}
          handleFileUpload={handleFileUpload}
        />
        
        {selectedChapter && (
          <PDFDisplayCard pdfUrl={pdfUrl} chapterContent={chapterContent} />
        )}
        
        {studyPlan && (
          <StudyPlanDisplay 
            studyPlan={studyPlan} 
            onStepComplete={handleStepCompletion}
          />
        )}
      </div>
    </div>
  );
};

export default StudyPlannerContainer;
