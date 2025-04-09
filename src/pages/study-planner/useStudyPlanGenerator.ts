
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
      toast.info("Analyzing PDF content and generating study plan...");
      
      // Find the chapter details to include in the prompt
      const book = books.find(b => b.id === selectedBook);
      const chapter = book?.chapters.find(c => c.id === selectedChapter);
      
      if (!chapter) {
        toast.error("Chapter information not found");
        setIsGenerating(false);
        return;
      }
      
      // Check if PDF content is sufficient
      const contentSample = chapterContent.slice(0, 500);
      console.log("PDF content sample:", contentSample);
      
      if (chapterContent.length < 200) {
        toast.error("The PDF content is too short or couldn't be properly extracted. Please try a different PDF.");
        setIsGenerating(false);
        return;
      }
      
      // Limit content size if it's too large to avoid token limits
      let processedContent = chapterContent;
      if (chapterContent.length > 15000) {
        processedContent = chapterContent.slice(0, 15000) + 
          "\n\n[Content truncated due to length. Please analyze the above portion thoroughly.]";
      }

      const systemPrompt = `You are an expert educational consultant specializing in creating personalized study plans for students. 
      Create a detailed, structured study plan based SOLELY on the provided chapter's PDF content. The response should be in JSON format with the following structure:
      
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
      1. READ THE ENTIRE PDF CONTENT THOROUGHLY. Your study plan must be based EXCLUSIVELY on the content provided from the PDF, not general knowledge.
      2. Include ACTUAL topics, examples, and details FROM THE PDF in your study plan
      3. Extract 4-7 key topics directly from the PDF content
      4. Identify any 2-4 prerequisites needed to understand this chapter based on content references (or empty array if not needed)
      5. Create 3 days of detailed study steps with tasks that reference specific content from the PDF
      6. Include 3-5 practical study tips relevant to this particular content
      7. Keep descriptions concise but informative
      8. Set all completed values to false
      9. Set completionPercentage to 0
      10. Use specific examples, terms, and references from the chapter content when describing tasks
      
      IMPORTANT: Return ONLY valid JSON without any text before or after the JSON object. Do not include markdown formatting, code blocks, or any other text.`;

      const userPrompt = `Here is the chapter to create a study plan for:\n\nSubject: ${book?.name || 'English'}\nGrade: ${selectedBook.includes('8') ? '8' : 'Middle School'}\nTitle: ${chapter.name}\n\nChapter Content from PDF: ${processedContent}`;

      let jsonResponse;
      
      try {
        console.log("Sending request to OpenAI...");
        const response = await openaiService.createCompletion(systemPrompt, userPrompt, { 
          max_tokens: 3500,
          temperature: 0.2 // Lower temperature for more focused, consistent results
        });
        
        console.log("Raw response from OpenAI:", response.substring(0, 100) + "...");
        
        // Clean the response to handle any potential markdown or text formatting
        let cleanedResponse = response;
        
        // Try to extract JSON from the response if wrapped in markdown
        if (response.includes('```json') || response.includes('```')) {
          // Extract content between ```json and ```
          const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
          if (jsonMatch && jsonMatch[1]) {
            cleanedResponse = jsonMatch[1];
          }
        }
        
        // Additional cleaning - remove any non-JSON text before or after
        cleanedResponse = cleanedResponse.trim();
        
        // If the response starts with something that's not a { character, try to find the first {
        if (!cleanedResponse.startsWith('{')) {
          const jsonStart = cleanedResponse.indexOf('{');
          if (jsonStart !== -1) {
            cleanedResponse = cleanedResponse.substring(jsonStart);
          }
        }
        
        // If the response doesn't end with a } character, try to find the last }
        if (!cleanedResponse.endsWith('}')) {
          const jsonEnd = cleanedResponse.lastIndexOf('}');
          if (jsonEnd !== -1) {
            cleanedResponse = cleanedResponse.substring(0, jsonEnd + 1);
          }
        }
        
        console.log("Attempting to parse cleaned JSON:", cleanedResponse.substring(0, 100) + "...");
        jsonResponse = JSON.parse(cleanedResponse);
        console.log('Successfully parsed JSON response');
      } catch (error) {
        console.error("Error parsing JSON response:", error);
        toast.error("Error generating study plan. Please try again with a different PDF or chapter.");
        setIsGenerating(false);
        return;
      }
      
      setStudyPlan(jsonResponse);
      toast.success("Study plan generated successfully based on the PDF content!");
      
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
