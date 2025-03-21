
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

interface CircularTimerProps {
  timeLeft: number;
  totalTime: number;
  isBreak: boolean;
}

const CircularTimer: React.FC<CircularTimerProps> = ({ timeLeft, totalTime, isBreak }) => {
  // Calculate percentage of time remaining
  const percentage = (timeLeft / totalTime) * 100;
  
  // Determine color based on time remaining
  const getProgressColor = () => {
    if (isBreak) return "bg-blue-500";
    
    if (percentage > 60) return "bg-green-500";
    if (percentage > 30) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="relative flex items-center justify-center w-64 h-64 mx-auto mb-8">
      {/* Circle background */}
      <div className="absolute w-full h-full rounded-full border-8 border-gray-200 dark:border-gray-700"></div>
      
      {/* Colored progress circle - we use a rotated pseudoelement to create the arc */}
      <div 
        className="absolute w-full h-full rounded-full overflow-hidden"
        style={{
          background: `conic-gradient(${getProgressColor()} ${percentage}%, transparent ${percentage}%)`,
          transform: 'rotate(-90deg)'
        }}
      ></div>
      
      {/* Inner circle with time display */}
      <div className="absolute flex flex-col items-center justify-center w-[85%] h-[85%] bg-card rounded-full border-3 border-black shadow-neo">
        <Clock size={30} className="mb-2" />
        <div className="text-4xl font-bold font-mono tracking-wider">
          {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:
          {(timeLeft % 60).toString().padStart(2, '0')}
        </div>
        <div className="text-sm font-medium text-muted-foreground mt-1">
          {isBreak ? "Break Time" : "Focus Time"}
        </div>
      </div>
    </div>
  );
};

export default CircularTimer;
