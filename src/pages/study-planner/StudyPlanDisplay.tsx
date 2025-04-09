
import React from 'react';
import { StudyPlan } from './types';
import StudyPlanOverview from './components/StudyPlanOverview';
import DayPlanCard from './components/DayPlanCard';
import { Button } from '@/components/ui/button';
import { FileText, Printer } from 'lucide-react';
import { toast } from 'sonner';

interface StudyPlanDisplayProps {
  studyPlan: StudyPlan;
  onStepComplete: (dayIndex: number, taskIndex: number) => void;
}

const StudyPlanDisplay: React.FC<StudyPlanDisplayProps> = ({
  studyPlan,
  onStepComplete
}) => {
  const handlePrint = () => {
    window.print();
  };

  const handleExportToPDF = () => {
    // This would be implemented using a PDF library
    toast.info("PDF export functionality will be added soon!");
  };

  return (
    <div className="space-y-6">
      <StudyPlanOverview
        chapterTitle={studyPlan.chapterTitle}
        timeEstimate={studyPlan.timeEstimate}
        approach={studyPlan.approach}
        keyTopics={studyPlan.keyTopics}
        prerequisites={studyPlan.prerequisites}
        tips={studyPlan.tips}
      />
      
      <div className="flex justify-end gap-2 print:hidden">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1"
          onClick={handlePrint}
        >
          <Printer className="w-4 h-4" />
          Print
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1"
          onClick={handleExportToPDF}
        >
          <FileText className="w-4 h-4" />
          Export PDF
        </Button>
      </div>

      {studyPlan.steps.map((day, dayIndex) => (
        <DayPlanCard
          key={dayIndex}
          day={day}
          dayIndex={dayIndex}
          onTaskComplete={(taskIndex) => onStepComplete(dayIndex, taskIndex)}
        />
      ))}
    </div>
  );
};

export default StudyPlanDisplay;
