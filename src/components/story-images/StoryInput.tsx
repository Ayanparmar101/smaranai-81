
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Undo } from 'lucide-react';
import DoodleButton from '@/components/DoodleButton';

interface StoryInputProps {
  storyText: string;
  onStoryChange: (value: string) => void;
  onGeneratePrompt: () => void;
  onClear: () => void;
  loading: boolean;
}

const StoryInput: React.FC<StoryInputProps> = ({
  storyText,
  onStoryChange,
  onGeneratePrompt,
  onClear,
  loading
}) => {
  return (
    <div className="bg-card rounded-2xl p-6 shadow-lg border-4 border-dashed border-kid-yellow mb-6 text-card-foreground">
      <h2 className="text-xl font-bold mb-4">Write Your Story</h2>
      <p className="text-muted-foreground mb-4">
        Write a short story or describe a scene, and we'll generate an illustration for it!
      </p>
      
      <div className="mb-4">
        <Textarea
          placeholder="Once upon a time, there was a little rabbit who lived in a magical forest..."
          value={storyText}
          onChange={(e) => onStoryChange(e.target.value)}
          className="min-h-[150px] border-2 border-gray-200 focus:border-kid-yellow bg-muted text-foreground"
        />
      </div>
      
      <div className="flex space-x-3">
        <DoodleButton
          color="yellow"
          onClick={onGeneratePrompt}
          loading={loading}
        >
          Create Prompt
        </DoodleButton>
        
        <Button
          variant="outline"
          size="icon"
          onClick={onClear}
          title="Clear story"
        >
          <Undo className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default StoryInput;
