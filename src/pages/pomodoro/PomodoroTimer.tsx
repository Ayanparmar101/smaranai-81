
import React, { useState, useEffect, useRef } from 'react';
import { Slider } from "@/components/ui/slider";
import { NeoButton } from "@/components/NeoButton";
import { Play, Pause, RotateCcw, Timer, Clock, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import CircularTimer from "./CircularTimer";

const BREAK_DURATION = 10; // 10 minutes break

const PomodoroTimer = () => {
  const [duration, setDuration] = useState(25); // Default 25 minutes
  const [timeLeft, setTimeLeft] = useState(duration * 60); // in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  
  // Reset timer when duration changes
  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(duration * 60);
    }
  }, [duration, isRunning]);
  
  // Main timer effect
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Timer reached zero
            clearInterval(timerRef.current as NodeJS.Timeout);
            
            if (!isBreak) {
              // Work session ended, start break
              toast({
                title: "Work session completed!",
                description: "Time for a 10-minute break.",
              });
              setIsBreak(true);
              setTimeLeft(BREAK_DURATION * 60);
              return BREAK_DURATION * 60;
            } else {
              // Break ended
              toast({
                title: "Break completed!",
                description: "Ready for another focus session?",
              });
              setIsRunning(false);
              setIsBreak(false);
              setTimeLeft(duration * 60);
              return duration * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, isBreak, duration, toast]);
  
  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };
  
  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(duration * 60);
  };
  
  const handleDurationChange = (value: number[]) => {
    setDuration(value[0]);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold mb-2">Pomodoro Timer</h1>
          <p className="text-muted-foreground">
            Focus better with timed work sessions and breaks
          </p>
        </div>
        
        <Card className="p-6 mb-8 bg-gradient-to-r from-[#4E9BF5]/10 to-[#76D394]/10 border-black border-3 shadow-neo">
          <div className="flex flex-col items-center">
            {/* Replace the text timer with the circular timer */}
            <CircularTimer 
              timeLeft={timeLeft} 
              totalTime={isBreak ? BREAK_DURATION * 60 : duration * 60}
              isBreak={isBreak}
            />
            
            <div className="flex gap-4 mb-6">
              <NeoButton 
                onClick={toggleTimer} 
                variant={isRunning ? "warning" : "success"}
                size="lg"
                icon={isRunning ? <Pause /> : <Play />}
              >
                {isRunning ? "Pause" : "Start"}
              </NeoButton>
              
              <NeoButton
                onClick={resetTimer}
                variant="outline"
                size="lg"
                icon={<RotateCcw />}
              >
                Reset
              </NeoButton>
            </div>
            
            <div className="text-lg font-semibold mb-2 flex items-center gap-2">
              {isBreak ? <Bell className="text-blue-500" /> : <Clock className="text-green-500" />}
              {isBreak ? "Break Time!" : "Work Session"}
            </div>
          </div>
        </Card>
        
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Timer size={20} /> Session Duration
          </h2>
          
          <div className="mb-4">
            <Slider
              defaultValue={[25]}
              min={5}
              max={120}
              step={5}
              value={[duration]}
              onValueChange={handleDurationChange}
              disabled={isRunning}
              className="mb-2"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>5m</span>
              <span>{duration} minutes</span>
              <span>2h</span>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground mt-4">
            <strong>How it works:</strong> Work for {duration} minutes, followed by a 10-minute break.
            The timer will automatically switch between work and break modes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;
