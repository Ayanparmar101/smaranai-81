
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
      aria-label={animationsEnabled ? "Disable animations" : "Enable animations"}
      pressed={animationsEnabled}
      onPressedChange={toggleAnimations}
      className="h-9 w-9 rounded-full p-0 text-white"
      title="Toggle background animations"
    >
      <CloudSun className="h-4 w-4" />
      <span className="sr-only">{animationsEnabled ? "Disable animations" : "Enable animations"}</span>
    </Toggle>
  );
};

export default AnimationToggle;
