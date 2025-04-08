
import React from 'react';
import { StudyPlan } from './types';
import StudyPlanOverview from './components/StudyPlanOverview';
import StudyStepsCard from './components/StudyStepsCard';

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
      <StudyPlanOverview
        chapterTitle={studyPlan.chapterTitle}
        timeEstimate={studyPlan.timeEstimate}
        approach={studyPlan.approach}
        keyTopics={studyPlan.keyTopics}
        prerequisites={studyPlan.prerequisites}
      />

      <StudyStepsCard
        steps={studyPlan.steps}
        completionPercentage={studyPlan.completionPercentage}
        onStepComplete={onStepComplete}
      />
    </div>
  );
};

export default StudyPlanDisplay;
