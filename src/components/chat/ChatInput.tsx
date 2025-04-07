
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { SendIcon, RefreshCcw } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onClearChat: () => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  onClearChat,
  disabled = false 
}) => {
  const [message, setMessage] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="relative">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          rows={3}
          className="resize-none pr-12"
          disabled={disabled}
        />
        <div className="absolute right-2 bottom-2">
          <Button 
            size="icon"
            type="submit"
            disabled={!message.trim() || disabled}
          >
            <SendIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button 
          type="button"
          variant="ghost"
          size="sm"
          onClick={onClearChat}
          disabled={disabled}
        >
          <RefreshCcw className="h-4 w-4 mr-2" />
          Clear Chat
        </Button>
      </div>
    </form>
  );
};

export default ChatInput;
