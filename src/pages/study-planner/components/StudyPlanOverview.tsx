
import React from 'react';
import { 
  Card,
  CardContent 
} from '@/components/ui/card';
import { Accordion } from '@/components/ui/accordion';
import StudyPlanHeader from './StudyPlanHeader';
import ApproachSection from './ApproachSection';
import TopicsList from './TopicsList';
import PrerequisitesList from './PrerequisitesList';

interface StudyPlanOverviewProps {
  chapterTitle: string;
  timeEstimate: string;
  approach: string;
  keyTopics: { topic: string; importance: string }[];
  prerequisites: { topic: string; reason: string }[];
}

const StudyPlanOverview: React.FC<StudyPlanOverviewProps> = ({
  chapterTitle,
  timeEstimate,
  approach,
  keyTopics,
  prerequisites
}) => {
  return (
    <Card className="border-3 border-black shadow-neo-md">
      <StudyPlanHeader 
        chapterTitle={chapterTitle} 
        timeEstimate={timeEstimate} 
      />
      <CardContent>
        <div className="space-y-6">
          <ApproachSection approach={approach} />

          <Accordion type="single" collapsible className="w-full">
            <TopicsList topics={keyTopics} />
            <PrerequisitesList prerequisites={prerequisites} />
          </Accordion>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudyPlanOverview;
