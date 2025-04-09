
import React, { useEffect, useRef } from 'react';
import { Message } from '../../types';
import ChatMessage from './ChatMessage';
import { ScrollArea } from '../ui/scroll-area';

interface ChatHistoryProps {
  messages: Message[];
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ messages }) => {
  // Create ref for scroll area
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      const scrollElement = scrollRef.current;
      // Use a small timeout to ensure DOM is updated
      setTimeout(() => {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }, 100);
    }
  }, [messages]);
  
  return (
    <ScrollArea className="h-[60vh] pr-4" ref={scrollRef}>
      <div className="flex flex-col gap-4 py-4">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground p-4">
            कोई संदेश नहीं। बातचीत शुरू करें! (No messages yet. Start a conversation!)
          </div>
        ) : (
          messages.map((message, index) => (
            <ChatMessage key={`${message.id}-${index}`} message={message} />
          ))
        )}
      </div>
    </ScrollArea>
  );
};

export default ChatHistory;
