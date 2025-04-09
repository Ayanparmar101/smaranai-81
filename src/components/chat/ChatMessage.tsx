
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Message } from '@/types';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const avatarLetter = isUser ? 'U' : 'A';
  
  // Handle the timestamp formatting safely
  const formatTimestamp = (timestamp: Date | string | number) => {
    if (timestamp instanceof Date) {
      return timestamp.toLocaleTimeString();
    } else if (typeof timestamp === 'string') {
      return new Date(timestamp).toLocaleTimeString();
    } else if (typeof timestamp === 'number') {
      return new Date(timestamp).toLocaleTimeString();
    }
    return '';
  };
  
  return (
    <div
      className={cn(
        'flex w-full gap-2 p-4',
        isUser ? 'justify-end pl-10' : 'justify-start pr-10',
      )}
    >
      {!isUser && (
        <Avatar>
          <AvatarFallback>{avatarLetter}</AvatarFallback>
        </Avatar>
      )}
      
      <div
        className={cn(
          'flex flex-col gap-2 rounded-lg p-4',
          isUser ? 'bg-primary text-primary-foreground' : 'bg-muted',
        )}
      >
        {message.imageUrl && (
          <div className="mb-2">
            <img 
              src={message.imageUrl} 
              alt="User uploaded image" 
              className="max-w-full rounded-md max-h-64 object-contain"
            />
          </div>
        )}
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        <div className="text-xs opacity-50">
          {formatTimestamp(message.timestamp)}
        </div>
      </div>
      
      {isUser && (
        <Avatar>
          <AvatarFallback>{avatarLetter}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default ChatMessage;
