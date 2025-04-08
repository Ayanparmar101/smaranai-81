
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface DifficultySelectorProps {
  selectedDifficulty: 'easy' | 'medium' | 'hard';
  onDifficultyChange: (value: 'easy' | 'medium' | 'hard') => void;
}

const DifficultySelector: React.FC<DifficultySelectorProps> = ({ 
  selectedDifficulty, 
  onDifficultyChange 
}) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Select Difficulty:</h2>
      <ToggleGroup 
        type="single" 
        value={selectedDifficulty} 
        onValueChange={(value) => value && onDifficultyChange(value as any)}
      >
        <ToggleGroupItem 
          value="easy" 
          className="flex-1 bg-green-200/30 text-green-800 data-[state=on]:bg-green-200 data-[state=on]:text-green-800"
        >
          Easy
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="medium" 
          className="flex-1 bg-yellow-200/30 text-yellow-800 data-[state=on]:bg-yellow-200 data-[state=on]:text-yellow-800"
        >
          Medium
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="hard" 
          className="flex-1 bg-red-200/30 text-red-800 data-[state=on]:bg-red-200 data-[state=on]:text-red-800"
        >
          Hard
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default DifficultySelector;
