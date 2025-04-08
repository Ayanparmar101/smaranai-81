
import React from 'react';
import { Mic, StopCircle, Volume2, VolumeX } from 'lucide-react';
import { NeoButton } from '@/components/NeoButton';
import { Progress } from '@/components/ui/progress';

interface VoiceControlButtonsProps {
  isListening: boolean;
  isSpeaking: boolean;
  isProcessing: boolean;
  hasAudioMessages: boolean;
  onStartListening: () => void;
  onStopListening: () => void;
  onStopSpeaking: () => void;
  onReplayLastResponse: () => void;
}

const VoiceControlButtons: React.FC<VoiceControlButtonsProps> = ({
  isListening,
  isSpeaking,
  isProcessing,
  hasAudioMessages,
  onStartListening,
  onStopListening,
  onStopSpeaking,
  onReplayLastResponse,
}) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {!isListening ? (
          <NeoButton
            variant="primary"
            icon={<Mic />}
            onClick={onStartListening}
            disabled={isProcessing}
            className="col-span-1 md:col-span-2"
          >
            Start Speaking
          </NeoButton>
        ) : (
          <NeoButton
            variant="destructive"
            icon={<StopCircle />}
            onClick={onStopListening}
            className="col-span-1 md:col-span-2 animate-pulse"
          >
            Stop Speaking
          </NeoButton>
        )}
        
        {isSpeaking ? (
          <NeoButton
            variant="secondary"
            icon={<VolumeX />}
            onClick={onStopSpeaking}
            className="col-span-1 md:col-span-2"
          >
            Stop Playback
          </NeoButton>
        ) : (
          <NeoButton
            variant="secondary"
            icon={<Volume2 />}
            disabled={!hasAudioMessages}
            onClick={onReplayLastResponse}
            className="col-span-1 md:col-span-2"
          >
            Replay Last Response
          </NeoButton>
        )}
      </div>
      
      {isListening && (
        <div className="mt-2">
          <div className="flex items-center gap-2">
            <div className="w-full">
              <Progress value={100} className="h-1.5 w-full bg-slate-200 animate-pulse" />
            </div>
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-red-500 rounded-full animate-[pulse_1s_ease-in-out_infinite]"></div>
              <div className="w-1 h-2 bg-red-500 rounded-full animate-[pulse_1s_ease-in-out_0.3s_infinite]"></div>
              <div className="w-1 h-3 bg-red-500 rounded-full animate-[pulse_1s_ease-in-out_0.5s_infinite]"></div>
            </div>
          </div>
          <p className="text-xs text-center text-muted-foreground mt-1">Recording your voice...</p>
        </div>
      )}
    </div>
  );
};

export default VoiceControlButtons;
