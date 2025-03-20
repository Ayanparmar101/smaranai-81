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
  return;
};
export default AnimationToggle;