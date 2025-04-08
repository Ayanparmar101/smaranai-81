
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { saveMessage } from '@/utils/messageUtils';

interface Message {
  role: "user" | "bot";
  text: string;
}

export const useOpenAI = (apiKey: string | null) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  
  const addMessage = useCallback((text: string, role: "user" | "bot") => {
    setMessages((prevMessages) => [...prevMessages, { role, text }]);
  }, []);

  const fetchBotResponse = useCallback(async (message: string) => {
    if (!apiKey) {
      toast.error('Please add your OpenAI API key first.');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a friendly voice assistant for children learning English. Keep your responses simple, encouraging, and suitable for children. Limit your responses to 2-3 sentences.'
            },
            {
              role: 'user',
              content: message
            }
          ],
          max_tokens: 150
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to get response');
      }
      
      const data = await response.json();
      const botMessage = data.choices[0].message.content;
      addMessage(botMessage, 'bot');
      
      // Save to message history if user is logged in
      if (user) {
        await saveMessage({
          text: message,
          userId: user.id,
          aiResponse: botMessage,
          chatType: 'voice-bot'
        });
      }
      
      // Text-to-speech for bot response
      if ('speechSynthesis' in window) {
        const speech = new SpeechSynthesisUtterance(botMessage);
        speech.rate = 0.9; // Slightly slower for children
        speech.pitch = 1.1; // Slightly higher pitch
        window.speechSynthesis.speak(speech);
      }
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [apiKey, user, addMessage]);

  const handleUserMessage = useCallback(async (text: string) => {
    addMessage(text, 'user');
    await fetchBotResponse(text);
  }, [addMessage, fetchBotResponse]);

  return {
    messages,
    loading,
    handleUserMessage
  };
};
