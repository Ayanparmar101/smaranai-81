
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface LevelSelectorProps {
  selectedLevel: 'beginner' | 'intermediate' | 'advanced';
  onLevelChange: (value: 'beginner' | 'intermediate' | 'advanced') => void;
}

const LevelSelector: React.FC<LevelSelectorProps> = ({ selectedLevel, onLevelChange }) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Select your level:</h2>
      <ToggleGroup 
        type="single" 
        value={selectedLevel} 
        onValueChange={(value) => value && onLevelChange(value as any)}
      >
        <ToggleGroupItem value="beginner" className="flex-1">
          Beginner (Grades 1-2)
        </ToggleGroupItem>
        <ToggleGroupItem value="intermediate" className="flex-1">
          Intermediate (Grades 3-5)
        </ToggleGroupItem>
        <ToggleGroupItem value="advanced" className="flex-1">
          Advanced (Grades 6-8)
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default LevelSelector;
