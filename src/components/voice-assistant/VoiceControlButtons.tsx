
import React from 'react';
import { Mic, StopCircle, Volume2, VolumeX } from 'lucide-react';
import { NeoButton } from '@/components/NeoButton';

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
          className="col-span-1 md:col-span-2"
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
  );
};

export default VoiceControlButtons;
