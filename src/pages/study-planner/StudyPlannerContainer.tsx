
import React, { useState } from 'react';
import ChapterSelector from '../teacher/ChapterSelector';
import StudyPlanDisplay from './StudyPlanDisplay';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Book, Brain, CheckCheck } from 'lucide-react';
import DoodleButton from '@/components/DoodleButton';
import ApiKeyInput from '@/components/ApiKeyInput';
import { openaiService } from '@/services/openaiService';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';

const StudyPlannerContainer = () => {
  const [selectedChapter, setSelectedChapter] = useState<{ text: string; title: string } | null>(null);
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  // Define study plan interface
  interface StudyPlanStep {
    title: string;
    description: string;
    timeAllocation: string;
    completed: boolean;
  }

  interface StudyPlan {
    chapterTitle: string;
    approach: string;
    timeEstimate: string;
    keyTopics: { topic: string; importance: string }[];
    prerequisites: { topic: string; reason: string }[];
    steps: StudyPlanStep[];
    completionPercentage: number;
  }

  const handleChapterSelect = (chapterText: string, chapterTitle: string) => {
    setSelectedChapter({ text: chapterText, title: chapterTitle });
    setStudyPlan(null);
    setProgress(0);
  };

  const generateStudyPlan = async () => {
    if (!selectedChapter) {
      toast.error("Please select a chapter first");
      return;
    }

    try {
      setIsGenerating(true);
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

      const userPrompt = `Here is the chapter content to create a study plan for:\n\nTitle: ${selectedChapter.title}\n\nContent: ${selectedChapter.text}`;

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

  const renderIntroCard = () => (
    <Card className="mb-6 border-3 border-black shadow-neo-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <Brain className="w-6 h-6 text-[#5B86E5]" />
          Study Planner
        </CardTitle>
        <CardDescription>
          Select a chapter and generate a personalized study plan with AI
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">
          Our AI will analyze your chapter and create a step-by-step study plan, highlighting key topics,
          prerequisites, and an optimal approach to mastering the content.
        </p>
        
        {studyPlan && (
          <div className="mt-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Study Progress</span>
              <span className="text-sm font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto py-6 px-4 max-w-4xl">
      <ApiKeyInput onApiKeySubmit={(key) => openaiService.setApiKey(key)} />
      
      {renderIntroCard()}
      
      <div className="grid grid-cols-1 gap-6">
        <Card className="border-3 border-black shadow-neo-md">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Book className="w-5 h-5 text-[#5B86E5]" />
              Select Chapter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChapterSelector onChapterSelect={handleChapterSelect} />
            
            {selectedChapter && (
              <div className="mt-4 flex justify-end">
                <DoodleButton 
                  onClick={generateStudyPlan}
                  loading={isGenerating}
                  icon={<Brain size={18} />}
                  disabled={isGenerating}
                >
                  {isGenerating ? "Generating Plan..." : "Generate Study Plan"}
                </DoodleButton>
              </div>
            )}
          </CardContent>
        </Card>
        
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
