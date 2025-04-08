
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import ChatMessages from './ChatMessages';
import VoiceControlButtons from './VoiceControlButtons';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';
import { useVoicePlayback } from '@/hooks/useVoicePlayback';
import { useOpenAIVoiceChat } from '@/hooks/useOpenAIVoiceChat';

interface VoiceChatProps {
  userId?: string;
  saveMessage?: (message: string, response: string) => void;
}

const VoiceChat: React.FC<VoiceChatProps> = ({ userId, saveMessage }) => {
  const [currentTranscript, setCurrentTranscript] = useState('');
  const { messages, isProcessing, processVoiceInput } = useOpenAIVoiceChat({ userId, saveMessage });
  const { isSpeaking, playAudio, stopAudio, replayLastResponse } = useVoicePlayback();
  
  const { isListening, startListening, stopListening } = useVoiceRecognition({
    onTranscriptChange: setCurrentTranscript,
    onProcessInput: async (text) => {
      const audioUrl = await processVoiceInput(text);
      if (audioUrl) {
        playAudio(audioUrl);
      }
    }
  });

  const handleReplayLastResponse = () => {
    replayLastResponse(messages);
  };

  return (
    <div className="flex flex-col h-[75vh]">
      <Card className="flex-grow mb-4 p-4 overflow-hidden flex flex-col">
        <ChatMessages 
          messages={messages} 
          onPlayAudio={playAudio} 
        />
      </Card>
      
      {currentTranscript && (
        <div className="bg-muted p-3 rounded-lg mb-4 italic text-muted-foreground">
          "{currentTranscript}"
        </div>
      )}
      
      <VoiceControlButtons
        isListening={isListening}
        isSpeaking={isSpeaking}
        isProcessing={isProcessing}
        hasAudioMessages={messages.some(m => m.audioUrl)}
        onStartListening={startListening}
        onStopListening={stopListening}
        onStopSpeaking={stopAudio}
        onReplayLastResponse={handleReplayLastResponse}
      />
    </div>
  );
};

export default VoiceChat;
