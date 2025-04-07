
import React from 'react';
import { Message } from '../../types';
import ChatMessage from './ChatMessage';
import { ScrollArea } from '../ui/scroll-area';

interface ChatHistoryProps {
  messages: Message[];
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ messages }) => {
  // Create ref for scroll area
  const scrollRef = React.useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);
  
  return (
    <ScrollArea className="h-[60vh] pr-4" ref={scrollRef}>
      <div className="flex flex-col gap-4 py-4">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground p-4">
            No messages yet. Start a conversation!
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))
        )}
      </div>
    </ScrollArea>
  );
};

export default ChatHistory;
