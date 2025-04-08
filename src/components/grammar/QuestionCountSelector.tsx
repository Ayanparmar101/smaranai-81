
import React from 'react';
import { Slider } from '@/components/ui/slider';

interface QuestionCountSelectorProps {
  numQuestions: number;
  onNumQuestionsChange: (value: number) => void;
}

const QuestionCountSelector: React.FC<QuestionCountSelectorProps> = ({ 
  numQuestions, 
  onNumQuestionsChange 
}) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Number of Questions: {numQuestions}</h2>
      <div className="px-4 py-2 bg-white border-3 border-black rounded-md shadow-neo-sm">
        <Slider
          value={[numQuestions]}
          max={10}
          min={1}
          step={1}
          onValueChange={(value) => {
            console.log("Slider value changed to:", value[0]);
            onNumQuestionsChange(value[0]);
          }}
          className="w-full"
        />
        <div className="flex justify-between mt-2 text-sm text-muted-foreground">
          <span>1</span>
          <span>5</span>
          <span>10</span>
        </div>
      </div>
    </div>
  );
};

export default QuestionCountSelector;
