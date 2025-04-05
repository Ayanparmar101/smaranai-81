
import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { NeoButton } from '@/components/NeoButton';
import { Mic, MicOff, Send } from 'lucide-react';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [inputText, setInputText] = useState('');
  
  const { isListening, toggleListening } = useSpeechRecognition({
    onTranscriptChange: (transcript) => {
      setInputText(transcript);
    }
  });

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    
    onSendMessage(inputText);
    setInputText('');
    
    if (isListening) {
      toggleListening();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex gap-2">
      <Textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message in Gujarati or English..."
        className="neo-input"
      />
      <div className="flex flex-col gap-2">
        <NeoButton 
          variant={isListening ? "destructive" : "secondary"}
          size="sm"
          onClick={toggleListening}
          className="flex-shrink-0"
          icon={isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        />
        <NeoButton
          onClick={handleSendMessage}
          disabled={isLoading || !inputText.trim()}
          size="sm"
          icon={<Send className="h-4 w-4" />}
          loading={isLoading}
        />
      </div>
    </div>
  );
};
