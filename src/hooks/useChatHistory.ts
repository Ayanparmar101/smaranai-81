
import { useState, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Message } from '../types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Custom hook to manage chat history
 * @param storageKey Key for localStorage
 * @returns Chat history state and operations
 */
export const useChatHistory = (storageKey: string = 'chatHistory') => {
  const [messages, setMessages] = useLocalStorage<Message[]>(storageKey, []);
  const [isLoading, setIsLoading] = useState(false);

  const addMessage = useCallback((role: 'user' | 'assistant', content: string, imageUrl?: string) => {
    const newMessage: Message = {
      id: uuidv4(),
      role,
      content,
      imageUrl,
      timestamp: new Date()
    };
    
    // Use a function to update state to ensure we're working with the latest state
    setMessages((prevMessages: Message[]) => {
      // Log both the current messages and the message we're adding for debugging
      console.log("Current messages:", prevMessages);
      console.log("Adding message:", newMessage);
      
      const updatedMessages = [...prevMessages, newMessage];
      console.log("Updated messages array:", updatedMessages);
      return updatedMessages;
    });
    
    return newMessage;
  }, [setMessages]);

  const clearHistory = useCallback(() => {
    setMessages([]);
  }, [setMessages]);

  return {
    messages,
    isLoading,
    setIsLoading,
    addMessage,
    clearHistory
  };
};
