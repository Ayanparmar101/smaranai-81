
import React, { useState } from 'react';
import ApiKeyInput from '@/components/ApiKeyInput';
import ChatDisplay from '@/components/voice-bot/ChatDisplay';
import VoiceControls from '@/components/voice-bot/VoiceControls';
import MessageInput from '@/components/voice-bot/MessageInput';
import TranscriptDisplay from '@/components/voice-bot/TranscriptDisplay';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useOpenAI } from '@/hooks/useOpenAI';

const VoiceBotPage = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const { messages, loading, handleUserMessage } = useOpenAI(apiKey);
  const { isListening, transcript, startListening, stopListening } = useSpeechRecognition({
    onFinalTranscript: handleUserMessage
  });

  const handleApiKeySubmit = (key: string) => {
    setApiKey(key);
  };

  return (
    <main className="flex-1 container mx-auto max-w-4xl p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-kid-purple">Voice Bot</h1>
        <ApiKeyInput onApiKeySubmit={handleApiKeySubmit} />
      </div>
      
      <div className="bg-card rounded-xl shadow-md p-4 mb-4 h-[60vh] overflow-y-auto text-card-foreground">
        <ChatDisplay messages={messages} />
      </div>
      
      <TranscriptDisplay transcript={transcript} />
      
      <VoiceControls 
        isListening={isListening}
        loading={loading}
        startListening={startListening}
        stopListening={stopListening}
      />
      
      <MessageInput 
        loading={loading}
        onSubmit={handleUserMessage}
      />
    </main>
  );
};

export default VoiceBotPage;
