
import React, { useState, useRef, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { NeoButton } from '@/components/NeoButton';
import { Mic, MicOff, Send, Bot } from 'lucide-react';
import { toast } from 'sonner';
import { saveMessage } from '@/utils/messageUtils';
import { useOpenAI } from '@/hooks/useOpenAI';

interface Message {
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
}

const GujaratiChatbotPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { openaiService } = useOpenAI();

  // Setup speech recognition
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      if (recognitionRef.current) {
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'gu-IN'; // Set language to Gujarati
        
        recognitionRef.current.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');
          
          setInputText(transcript);
        };
        
        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          toast.error(`Speech recognition error: ${event.error}`);
        };
        
        recognitionRef.current.onend = () => {
          if (isListening) {
            try {
              recognitionRef.current?.start();
            } catch (error) {
              console.error('Failed to restart speech recognition', error);
            }
          }
        };
      }
    } else {
      toast.error('Speech recognition is not supported in this browser');
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
        
        if (isListening) {
          try {
            recognitionRef.current.stop();
          } catch (error) {
            console.error('Error stopping speech recognition:', error);
          }
        }
      }
    };
  }, [isListening]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast.error('Speech recognition is not supported in this browser');
      return;
    }
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        toast.error('Failed to start speech recognition');
      }
    }
  };

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

  const sendMessage = async () => {
    if (!inputText.trim()) return;
    
    const userMessage = {
      role: 'user' as const,
      content: inputText,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    
    if (isListening) {
      toggleListening();
    }

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">
            <span className="bg-gradient-to-r from-kid-green to-kid-blue bg-clip-text text-transparent">
              ગુજરાતી ચેટબોટ / Gujarati Chatbot
            </span>
          </h1>
          
          <Card className="border-3 border-black shadow-neo-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-6 w-6 text-kid-green" />
                <span>ગુજરાતી શીખવાની ચેટ</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col h-[60vh]">
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
                
                <div className="flex gap-2">
                  <Textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message in Gujarati or English..."
                    className="neo-input"
                  />
                  <div className="flex flex-col gap-2">
                    <NeoButton 
                      variant={isListening ? "destructive" : "secondary"}
                      size="sm"
                      onClick={toggleListening}
                      className="flex-shrink-0"
                      icon={isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    />
                    <NeoButton
                      onClick={sendMessage}
                      disabled={isLoading || !inputText.trim()}
                      size="sm"
                      icon={<Send className="h-4 w-4" />}
                      loading={isLoading}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default GujaratiChatbotPage;
