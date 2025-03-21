
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  AlarmClock, 
  BookOpen, 
  Brain, 
  CheckCheck, 
  GraduationCap, 
  Key, 
  Lightbulb, 
  ListChecks 
} from 'lucide-react';
import { cn } from '@/lib/utils';

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

interface StudyPlanDisplayProps {
  studyPlan: StudyPlan;
  onStepComplete: (index: number) => void;
}

const StudyPlanDisplay: React.FC<StudyPlanDisplayProps> = ({
  studyPlan,
  onStepComplete
}) => {
  return (
    <div className="space-y-6">
      <Card className="border-3 border-black shadow-neo-md">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#5B86E5]" />
            Study Plan: {studyPlan.chapterTitle}
          </CardTitle>
          <CardDescription className="flex items-center gap-2">
            <AlarmClock className="w-4 h-4" />
            Estimated time: {studyPlan.timeEstimate}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-md font-semibold mb-2 flex items-center gap-2">
                <Brain className="w-4 h-4 text-[#8B5CF6]" />
                Approach
              </h3>
              <p className="text-muted-foreground">{studyPlan.approach}</p>
            </div>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="key-topics">
                <AccordionTrigger className="py-3">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-[#F59E0B]" />
                    <span className="font-semibold">Key Topics</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-3 mt-2">
                    {studyPlan.keyTopics.map((topic, index) => (
                      <li key={index} className="border-l-2 border-[#F59E0B] pl-3 py-1">
                        <h4 className="font-medium">{topic.topic}</h4>
                        <p className="text-sm text-muted-foreground">{topic.importance}</p>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>

              {studyPlan.prerequisites.length > 0 && (
                <AccordionItem value="prerequisites">
                  <AccordionTrigger className="py-3">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-[#10B981]" />
                      <span className="font-semibold">Prerequisites</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-3 mt-2">
                      {studyPlan.prerequisites.map((prereq, index) => (
                        <li key={index} className="border-l-2 border-[#10B981] pl-3 py-1">
                          <h4 className="font-medium">{prereq.topic}</h4>
                          <p className="text-sm text-muted-foreground">{prereq.reason}</p>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          </div>
        </CardContent>
      </Card>

      <Card className="border-3 border-black shadow-neo-md">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <ListChecks className="w-5 h-5 text-[#EF4444]" />
            Study Steps
          </CardTitle>
          <CardDescription>
            Complete each step and track your progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {studyPlan.steps.map((step, index) => (
              <li 
                key={index} 
                className={cn(
                  "rounded-lg border p-4 transition-all",
                  step.completed 
                    ? "bg-muted/50 border-muted" 
                    : "hover:border-[#5B86E5] hover:shadow-sm"
                )}
              >
                <div className="flex items-start gap-3">
                  <Checkbox 
                    id={`step-${index}`}
                    checked={step.completed}
                    onCheckedChange={() => onStepComplete(index)}
                    className="mt-1"
                  />
                  <div className="space-y-1">
                    <label 
                      htmlFor={`step-${index}`}
                      className={cn(
                        "font-medium cursor-pointer flex items-center gap-2",
                        step.completed && "line-through text-muted-foreground"
                      )}
                    >
                      {step.title}
                      <span className="text-xs font-normal text-muted-foreground px-2 py-0.5 rounded-full bg-muted">
                        {step.timeAllocation}
                      </span>
                    </label>
                    <p className={cn(
                      "text-sm text-muted-foreground",
                      step.completed && "line-through"
                    )}>
                      {step.description}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {studyPlan.completionPercentage === 100 && (
            <div className="mt-6 p-4 bg-[#10B981]/10 border border-[#10B981]/30 rounded-lg flex items-center gap-3">
              <CheckCheck className="w-5 h-5 text-[#10B981]" />
              <div>
                <h4 className="font-medium text-[#10B981]">Study plan completed!</h4>
                <p className="text-sm text-muted-foreground">
                  Great job completing all study steps. You're ready for an assessment on this chapter.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudyPlanDisplay;
