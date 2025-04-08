
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
  processingFunction: (message: string, imageUrl?: string) => Promise<string>;
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
  
  const handleSendMessage = async (message: string, image?: File) => {
    let messageContent = message;
    let imageUrl: string | undefined;
    
    // If there's an image, create a temporary local URL for display
    if (image) {
      imageUrl = URL.createObjectURL(image);
      messageContent = message || "Image"; // Use "Image" as message if text is empty
    }
    
    // Add user message to chat
    addMessage('user', messageContent, imageUrl);
    
    // Set loading state
    setIsLoading(true);
    
    try {
      // Get AI response
      const response = await processingFunction(message, imageUrl);
      
      // Add AI response to chat
      addMessage('assistant', response);
    } catch (error) {
      handleApiError(error);
    } finally {
      // Clear loading state
      setIsLoading(false);
      
      // Revoke the object URL to free memory
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
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
