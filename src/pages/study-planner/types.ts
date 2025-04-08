
export interface StudyPlanStep {
  title: string;
  description: string;
  timeAllocation: string;
  completed: boolean;
}

export interface StudyPlan {
  chapterTitle: string;
  approach: string;
  timeEstimate: string;
  keyTopics: { topic: string; importance: string }[];
  prerequisites: { topic: string; reason: string }[];
  steps: StudyPlanStep[];
  completionPercentage: number;
}
