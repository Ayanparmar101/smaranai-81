
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import ChatHistory from './ChatHistory';
import ChatInput from './ChatInput';
import { useChatHistory } from '../../hooks/useChatHistory';
import { handleApiError } from '../../utils/apiHelpers';

interface ChatContainerProps {
  title: string;
  storageKey: string;
  processingFunction: (message: string) => Promise<string>;
}

const ChatContainer: React.FC<ChatContainerProps> = ({
  title,
  storageKey,
  processingFunction
}) => {
  const { 
    messages, 
    isLoading, 
    setIsLoading, 
    addMessage, 
    clearHistory 
  } = useChatHistory(storageKey);
  
  const handleSendMessage = async (message: string) => {
    // Add user message to chat
    addMessage('user', message);
    
    // Set loading state
    setIsLoading(true);
    
    try {
      // Get AI response
      const response = await processingFunction(message);
      
      // Add AI response to chat
      addMessage('assistant', response);
    } catch (error) {
      handleApiError(error);
    } finally {
      // Clear loading state
      setIsLoading(false);
    }
  };
  
  const handleClearChat = () => {
    clearHistory();
    toast.success('Chat history cleared');
  };
  
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      
      <CardContent>
        <ChatHistory messages={messages} />
      </CardContent>
      
      <CardFooter>
        <ChatInput 
          onSendMessage={handleSendMessage}
          onClearChat={handleClearChat}
          disabled={isLoading}
        />
      </CardFooter>
    </Card>
  );
};

export default ChatContainer;
