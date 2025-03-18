
import React from 'react';
import { Send } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import DoodleButton from '@/components/DoodleButton';

interface PromptGeneratorProps {
  prompt: string;
  onPromptChange: (value: string) => void;
  onGenerateImage: () => void;
  loading: boolean;
}

const PromptGenerator: React.FC<PromptGeneratorProps> = ({
  prompt,
  onPromptChange,
  onGenerateImage,
  loading
}) => {
  return (
    <div className="bg-card rounded-2xl p-6 shadow-lg border-4 border-dashed border-kid-orange text-card-foreground">
      <h2 className="text-xl font-bold mb-4">Image Prompt</h2>
      <p className="text-muted-foreground mb-4">
        Edit the prompt or use the generated one to create your image.
      </p>
      
      <div className="mb-4">
        <Textarea
          placeholder="The prompt will appear here..."
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          className="min-h-[100px] border-2 border-gray-200 focus:border-kid-orange bg-muted text-foreground"
        />
      </div>
      
      <DoodleButton
        color="orange"
        onClick={onGenerateImage}
        loading={loading && prompt !== ''}
        icon={<Send className="w-4 h-4" />}
      >
        Generate Image
      </DoodleButton>
    </div>
  );
};

export default PromptGenerator;
