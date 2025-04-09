
import { useState } from 'react';
import { openaiService } from '@/services/openai';
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
      Create a detailed, structured study plan for the provided chapter's content. The response should be in JSON format with the following structure:
      
      {
        "chapterTitle": "Title of the chapter",
        "approach": "A brief 2-3 sentence overview of how to approach studying this chapter",
        "timeEstimate": "Estimated time to complete the study plan (e.g., '3 days')",
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
            "day": 1,
            "title": "Understanding the Narrative",
            "tasks": [
              {
                "name": "Read & Annotate",
                "duration": "45 mins",
                "details": "Highlight key events and write short margin notes.",
                "completed": false
              },
              {
                "name": "Vocabulary Table",
                "duration": "20 mins",
                "details": "Word | Meaning | Sentence format.",
                "completed": false
              }
            ]
          },
          {
            "day": 2,
            "title": "Another Day Title",
            "tasks": [
              {
                "name": "Another Task",
                "duration": "30 mins",
                "details": "Task details here",
                "completed": false
              }
            ]
          }
        ],
        "tips": [
          "Use Pomodoro technique for better focus",
          "Teach someone else to improve retention",
          "Use visual diagrams to map out places/events"
        ],
        "completionPercentage": 0
      }
      
      Make sure to:
      1. Thoroughly analyze the ENTIRE chapter content provided and base your study plan on that specific content
      2. Extract 4-7 key topics directly from the provided chapter content
      3. Identify any 2-4 prerequisites needed to understand this chapter (or empty array if not needed)
      4. Create 3 days of detailed study steps with appropriate tasks for each day based on the chapter's content
      5. Include 3-5 practical study tips relevant to this particular chapter
      6. Keep descriptions concise but informative
      7. Set all completed values to false
      8. Set completionPercentage to 0
      9. Use specific examples and references from the chapter content when describing tasks
      
      You must respond with ONLY the valid JSON, nothing else.`;

      const userPrompt = `Here is the chapter to create a study plan for:\n\nSubject: ${book?.name || 'English'}\nGrade: ${selectedBook.includes('8') ? '8' : 'Middle School'}\nTitle: ${chapter.name}\n\nChapter Content: ${chapterContent}`;

      let jsonResponse;
      
      try {
        const response = await openaiService.createCompletion(systemPrompt, userPrompt, { max_tokens: 3000 });
        jsonResponse = JSON.parse(response);
      } catch (error) {
        console.error("Error parsing JSON response:", error);
        toast.error("Error generating study plan. Please try again.");
        setIsGenerating(false);
        return;
      }
      
      setStudyPlan(jsonResponse);
      toast.success("Study plan generated successfully!");

      // Save to Supabase if user is logged in
      // This would be implemented in a later step
      
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to generate study plan. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStepCompletion = (dayIndex: number, taskIndex: number) => {
    if (!studyPlan) return;
    
    const updatedPlan = { ...studyPlan };
    const task = updatedPlan.steps[dayIndex].tasks[taskIndex];
    task.completed = !task.completed;
    
    // Calculate completion percentage
    let completedTasks = 0;
    let totalTasks = 0;
    
    updatedPlan.steps.forEach(day => {
      day.tasks.forEach(task => {
        totalTasks++;
        if (task.completed) {
          completedTasks++;
        }
      });
    });
    
    updatedPlan.completionPercentage = Math.round((completedTasks / totalTasks) * 100);
    
    setStudyPlan(updatedPlan);
    setProgress(updatedPlan.completionPercentage);
  };

  return { studyPlan, isGenerating, progress, generateStudyPlan, handleStepCompletion };
};
