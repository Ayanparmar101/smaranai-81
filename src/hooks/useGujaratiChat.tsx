
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { saveMessage } from '@/utils/messageUtils';
import { useOpenAI } from '@/hooks/useOpenAI';

interface Message {
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
}

export const useGujaratiChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { openaiService } = useOpenAI();

  // Initialize with welcome message
  useEffect(() => {
    setMessages([
      {
        role: 'assistant',
        content: 'નમસ્તે! હું ગુજરાતી શીખવામાં તમારી મદદ કરવા માટે અહીં છું. તમે મારી સાથે ગુજરાતીમાં વાત કરી શકો છો અને હું તમને જવાબ આપીશ. શું તમે કોઈ પ્રશ્ન પૂછવા માંગો છો?',
        timestamp: Date.now()
      }
    ]);
  }, []);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const saveToHistory = async (text: string, aiResponse?: string) => {
    if (!user) return;
    
    try {
      await saveMessage({
        text,
        userId: user.id,
        aiResponse,
        chatType: 'gujarati-chatbot'
      });
    } catch (error) {
      console.error('Error in saveToHistory:', error);
      toast.error('Failed to save message history');
    }
  };

  const sendMessage = async (inputText: string) => {
    if (!inputText.trim()) return;
    
    const userMessage = {
      role: 'user' as const,
      content: inputText,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const systemPrompt = `You are a helpful Gujarati language tutor. 
      Reply in both Gujarati and English to help the student learn.
      Keep your responses educational, helpful, and appropriate for language learners.
      If the user sends a message in English, still provide your answer in both Gujarati and English.`;
      
      let fullResponse = '';
      
      await openaiService.createCompletion(
        systemPrompt,
        inputText,
        {
          stream: true,
          onChunk: (chunk) => {
            fullResponse += chunk;
            
            // Check if we already have an assistant message we can update
            setMessages(prev => {
              const lastMessage = prev[prev.length - 1];
              
              // If the last message is already an assistant message that we're building
              if (lastMessage.role === 'assistant' && prev.length >= 2 && prev[prev.length - 2].content === userMessage.content) {
                // Update the existing message
                const updatedMessages = [...prev];
                updatedMessages[prev.length - 1] = {
                  ...lastMessage,
                  content: fullResponse
                };
                return updatedMessages;
              } else if (lastMessage.role === 'user' && lastMessage.content === userMessage.content) {
                // Add new assistant message
                return [...prev, { 
                  role: 'assistant', 
                  content: fullResponse,
                  timestamp: Date.now()
                }];
              }
              
              return prev;
            });
          }
        }
      );

      await saveToHistory(inputText, fullResponse);
    } catch (error) {
      console.error('Error getting response:', error);
      toast.error('Failed to get response. Please try again.');
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'માફ કરશો, કોઈ ભૂલ આવી. કૃપા કરીને ફરી પ્રયાસ કરો.',
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    sendMessage,
    messagesEndRef
  };
};
