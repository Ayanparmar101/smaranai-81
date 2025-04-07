
import React from 'react';
import { Message } from '../../types';
import { formatDate } from '../../utils/formatters';
import { Avatar } from '../ui/avatar';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <Avatar className="h-8 w-8">
          <div className="bg-primary text-primary-foreground flex h-full w-full items-center justify-center rounded-full">
            AI
          </div>
        </Avatar>
      )}
      
      <div className={`max-w-[80%] rounded-lg p-4 ${
        isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'
      }`}>
        <div className="prose dark:prose-invert">
          {message.content}
        </div>
        <div className={`text-xs mt-2 ${isUser ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
          {formatDate(message.timestamp)}
        </div>
      </div>
      
      {isUser && (
        <Avatar className="h-8 w-8">
          <div className="bg-secondary text-secondary-foreground flex h-full w-full items-center justify-center rounded-full">
            You
          </div>
        </Avatar>
      )}
    </div>
  );
};

export default ChatMessage;
