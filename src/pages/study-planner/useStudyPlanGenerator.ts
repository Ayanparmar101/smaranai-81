
import { useState } from 'react';
import openaiService from '@/services/openaiService';
import { toast } from 'sonner';
import { StudyPlan } from './types';
import { books } from '../teacher/ChapterSelector';

export const useStudyPlanGenerator = (chapterContent: string) => {
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const generateStudyPlan = async (selectedChapter: string, selectedBook: string) => {
    if (!selectedChapter) {
      toast.error("Please select a chapter first");
      return;
    }

    if (!chapterContent || chapterContent.includes("No PDF uploaded") || chapterContent.includes("Error loading")) {
      toast.error("Please upload a PDF for this chapter first");
      return;
    }

    try {
      setIsGenerating(true);
      
      // Find the chapter details to include in the prompt
      const book = books.find(b => b.id === selectedBook);
      const chapter = book?.chapters.find(c => c.id === selectedChapter);
      
      if (!chapter) {
        toast.error("Chapter information not found");
        setIsGenerating(false);
        return;
      }
      
      const systemPrompt = `You are an expert educational consultant specializing in creating personalized study plans for students. 
      Create a detailed, structured study plan for the provided chapter. The response should be in JSON format with the following structure:
      
      {
        "chapterTitle": "Title of the chapter",
        "approach": "A brief 2-3 sentence overview of how to approach studying this chapter",
        "timeEstimate": "Estimated time to complete the study plan (e.g., '3-4 hours')",
        "keyTopics": [
          { "topic": "Key topic 1", "importance": "Brief explanation of why this topic is important" },
          { "topic": "Key topic 2", "importance": "Brief explanation of why this topic is important" }
        ],
        "prerequisites": [
          { "topic": "Prerequisite topic 1", "reason": "Why this is needed" },
          { "topic": "Prerequisite topic 2", "reason": "Why this is needed" }
        ],
        "steps": [
          { 
            "title": "Step 1: Title", 
            "description": "Detailed description", 
            "timeAllocation": "30 minutes", 
            "completed": false 
          },
          { 
            "title": "Step 2: Title", 
            "description": "Detailed description", 
            "timeAllocation": "45 minutes", 
            "completed": false 
          }
        ],
        "completionPercentage": 0
      }
      
      Make sure to:
      1. Include 4-7 key topics
      2. Include 2-4 prerequisites (or empty array if not needed)
      3. Provide 5-8 detailed study steps
      4. Keep descriptions concise but informative
      5. Set all completed values to false
      6. Set completionPercentage to 0
      
      You must respond with ONLY the valid JSON, nothing else.`;

      const userPrompt = `Here is the chapter to create a study plan for:\n\nTitle: ${chapter.name}\n\nContent: ${chapterContent}`;

      let jsonResponse;
      
      try {
        const response = await openaiService.createCompletion(systemPrompt, userPrompt, { max_tokens: 2000 });
        jsonResponse = JSON.parse(response);
      } catch (error) {
        console.error("Error parsing JSON response:", error);
        toast.error("Error generating study plan. Please try again.");
        setIsGenerating(false);
        return;
      }
      
      setStudyPlan(jsonResponse);
      toast.success("Study plan generated successfully!");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to generate study plan. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStepCompletion = (index: number) => {
    if (!studyPlan) return;
    
    const updatedPlan = { ...studyPlan };
    updatedPlan.steps[index].completed = !updatedPlan.steps[index].completed;
    
    // Calculate completion percentage
    const completedSteps = updatedPlan.steps.filter(step => step.completed).length;
    updatedPlan.completionPercentage = Math.round((completedSteps / updatedPlan.steps.length) * 100);
    
    setStudyPlan(updatedPlan);
    setProgress(updatedPlan.completionPercentage);
  };

  return { studyPlan, isGenerating, progress, generateStudyPlan, handleStepCompletion };
};
