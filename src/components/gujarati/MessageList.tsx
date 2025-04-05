
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
}

interface MessageListProps {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, messagesEndRef }) => {
  return (
    <ScrollArea className="flex-1 pr-4 mb-4 border-3 border-black rounded-md shadow-neo-sm">
      <div className="p-4 space-y-4">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`rounded-lg px-4 py-2 max-w-[80%] shadow ${
                message.role === 'user' 
                  ? 'bg-kid-blue text-white ml-auto' 
                  : 'bg-gray-100 dark:bg-gray-800 mr-auto'
              }`}
            >
              <div className="whitespace-pre-wrap">{message.content}</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};
