
import React from 'react';
import { Send } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { NeoButton } from '@/components/NeoButton';

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
    <div className="neo-card bg-white border-3 border-black rounded-md">
      <h2 className="text-xl font-bold mb-4">Image Prompt</h2>
      <p className="text-muted-foreground mb-4">
        Edit the prompt or use the generated one to create your image.
      </p>
      
      <div className="mb-4">
        <Textarea
          placeholder="The prompt will appear here..."
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          className="min-h-[100px] border-3 border-black focus:border-[#F97316] bg-white text-foreground shadow-neo-sm"
        />
      </div>
      
      <NeoButton
        variant="accent"
        onClick={onGenerateImage}
        loading={loading && prompt !== ''}
        icon={<Send className="w-4 h-4" />}
      >
        Generate Image
      </NeoButton>
    </div>
  );
};

export default PromptGenerator;
