
import React, { useState, useEffect } from 'react';
import ApiKeyInput from '@/components/ApiKeyInput';
import { openaiService } from '@/services/openai';
import StudyPlanDisplay from './StudyPlanDisplay';
import IntroCard from './IntroCard';
import ChapterSelectionCard from './ChapterSelectionCard';
import PDFDisplayCard from './PDFDisplayCard';
import { useChapterContent } from './useChapterContent';
import { useStudyPlanGenerator } from './useStudyPlanGenerator';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { StudyPlan } from './types';
import { toast } from 'sonner';

const StudyPlannerContainer = () => {
  const [selectedClass, setSelectedClass] = useState<string>("8");
  const [selectedBook, setSelectedBook] = useState<string>("honeydew");
  const [selectedChapter, setSelectedChapter] = useState<string>("");
  const { user } = useAuth();
  const [isPdfProcessing, setIsPdfProcessing] = useState<boolean>(false);
  
  const { chapterContent, pdfUrl, handleFileUpload } = useChapterContent(selectedChapter, selectedBook, setIsPdfProcessing);
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
  };

  const handleResetPDF = () => {
    setSelectedChapter("");
  };

  const verifyApiKey = async (): Promise<boolean> => {
    const apiKey = openaiService.getApiKey();
    
    if (!apiKey) {
      toast.error("Please enter your OpenAI API key first");
      return false;
    }
    
    // Check if it's in valid format first
    if (!(apiKey.startsWith('sk-') || apiKey.startsWith('sk-proj-')) || apiKey.length < 20) {
      toast.error("Invalid API key format. OpenAI API keys should start with 'sk-' or 'sk-proj-'");
      return false;
    }
    
    try {
      // For project API keys, we need to add the OpenAI-Beta header
      const headers: Record<string, string> = {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      };
      
      if (apiKey.startsWith('sk-proj-')) {
        headers['OpenAI-Beta'] = 'assistants=v1';
      }
      
      // Make a simple request to verify the API key is working
      const response = await fetch('https://api.openai.com/v1/models', {
        headers
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("API key verification failed:", errorData);
        toast.error(errorData.error?.message || "Your OpenAI API key appears to be invalid. Please check and update it.");
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("API key verification failed:", error);
      toast.error("Your OpenAI API key verification failed. Please check your internet connection and try again.");
      return false;
    }
  };

  const handleGenerateStudyPlan = async () => {
    if (!await verifyApiKey()) {
      return;
    }
    
    if (!chapterContent || chapterContent.length < 100) {
      toast.error("Please upload a PDF with sufficient content first");
      return;
    }
    
    await generateStudyPlan(selectedChapter, selectedBook);
  };
  
  const saveStudyPlan = async () => {
    if (!user) {
      toast.error("Please log in to save your study plan");
      return;
    }
    
    if (!studyPlan) {
      toast.error("No study plan to save");
      return;
    }
    
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          user_id: user.id,
          chat_type: 'study-planner',
          text: `${selectedBook} - ${selectedChapter}`,
          ai_response: JSON.stringify(studyPlan),
          additional_data: {
            chapter_id: selectedChapter,
            book_id: selectedBook,
            progress: progress
          }
        });
        
      if (error) {
        console.error("Error saving study plan:", error);
        toast.error("Failed to save study plan");
        return;
      }
      
      toast.success("Study plan saved successfully!");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to save study plan");
    }
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
          onSaveStudyPlan={saveStudyPlan}
          canSave={!!studyPlan && !!user}
        />
        
        {selectedChapter && (
          <PDFDisplayCard 
            pdfUrl={pdfUrl} 
            chapterContent={chapterContent} 
            isLoading={isPdfProcessing}
            onReset={handleResetPDF}
          />
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
