
import React from 'react';
import { Toggle } from '@/components/ui/toggle';
import { CloudSun } from 'lucide-react';

const AnimationToggle = () => {
  const [animationsEnabled, setAnimationsEnabled] = React.useState(true);
  
  const toggleAnimations = () => {
    setAnimationsEnabled(!animationsEnabled);

    // Toggle the 'reduce-motion' class on the HTML element
    if (animationsEnabled) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  };
  
  return (
    <Toggle
      aria-label="Toggle animations"
      pressed={animationsEnabled}
      onPressedChange={toggleAnimations}
      className="p-2 rounded-full hover:bg-muted transition-colors"
    >
      <CloudSun className="h-5 w-5" />
    </Toggle>
  );
};

export default AnimationToggle;
