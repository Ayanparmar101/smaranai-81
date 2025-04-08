
import React from 'react';
import { Card } from '@/components/ui/card';
import { StudyPlanStep } from '../types';
import StudyStepsList from './StudyStepsList';

interface StudyStepsCardProps {
  steps: StudyPlanStep[];
  completionPercentage: number;
  onStepComplete: (index: number) => void;
}

const StudyStepsCard: React.FC<StudyStepsCardProps> = ({
  steps,
  completionPercentage,
  onStepComplete
}) => {
  return (
    <Card className="border-3 border-black shadow-neo-md">
      <StudyStepsList
        steps={steps}
        completionPercentage={completionPercentage}
        onStepComplete={onStepComplete}
      />
    </Card>
  );
};

export default StudyStepsCard;
