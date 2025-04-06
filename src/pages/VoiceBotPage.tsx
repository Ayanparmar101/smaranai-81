
import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mic, Send } from 'lucide-react';
import { toast } from 'sonner';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import DoodleButton from '@/components/DoodleButton';
import ApiKeyInput from '@/components/ApiKeyInput';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { saveMessage } from '@/utils/messageUtils';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useOpenAI } from '@/hooks/useOpenAI';
import { openaiService } from '@/services/openaiService';

const formSchema = z.object({
  message: z.string().min(1, {
    message: 'Message cannot be empty.',
  }),
});

const VoiceBotPage = () => {
  const { user } = useAuth();
  const { openaiService: openaiHook } = useOpenAI();
  const [messages, setMessages] = useState<{ role: "user" | "bot"; text: string; }[]>([]);
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const [streamingResponse, setStreamingResponse] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: '',
    },
  });

  const { isListening, toggleListening } = useSpeechRecognition({
    onTranscriptChange: (newTranscript) => {
      setTranscript(newTranscript);
    }
  });

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Check if transcript has been idle for 2 seconds (assuming the user has stopped speaking)
    let typingTimer: NodeJS.Timeout;
    
    if (transcript && isListening) {
      typingTimer = setTimeout(() => {
        if (transcript.trim()) {
          toggleListening(); // Stop listening
          handleSubmitVoice(transcript); // Submit what was transcribed
        }
      }, 2000);
    }
    
    return () => {
      clearTimeout(typingTimer);
    };
  }, [transcript, isListening]);

  useEffect(() => {
    // Stop any ongoing speech when component unmounts
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addMessage = (text: string, role: "user" | "bot") => {
    setMessages((prevMessages) => [...prevMessages, { role, text }]);
  };

  const handleSubmitVoice = async (text: string) => {
    if (!text.trim()) return;
    
    // Cancel any ongoing text-to-speech
    if (window.speechSynthesis && speechSynthesisRef.current) {
      window.speechSynthesis.cancel();
    }
    
    addMessage(text, 'user');
    setTranscript('');
    await fetchBotResponse(text);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const message = values.message.trim();
    if (!message) return;
    
    // Cancel any ongoing text-to-speech
    if (window.speechSynthesis && speechSynthesisRef.current) {
      window.speechSynthesis.cancel();
    }
    
    addMessage(message, 'user');
    form.reset();
    await fetchBotResponse(message);
  };

  const fetchBotResponse = async (message: string) => {
    if (!openaiService.getApiKey()) {
      toast.error('Please add your OpenAI API key first.');
      return;
    }
    
    setLoading(true);
    setStreamingResponse('');
    
    try {
      // Add an empty bot message that will be updated as tokens arrive
      setMessages(prev => [...prev, { role: 'bot', text: '' }]);
      
      // System prompt for the voice assistant
      const systemPrompt = 'You are a friendly voice assistant for children learning English. Keep your responses simple, encouraging, and suitable for children. Limit your responses to 2-3 sentences.';
      
      // Use the streaming option with onChunk callback
      const fullResponse = await openaiService.createCompletion(
        systemPrompt,
        message,
        {
          temperature: 0.7,
          max_tokens: 150,
          stream: true,
          onChunk: (chunk) => {
            setStreamingResponse(prev => {
              const newResponse = prev + chunk;
              
              // Update the last bot message in real-time
              setMessages(messages => {
                const updatedMessages = [...messages];
                if (updatedMessages.length > 0) {
                  updatedMessages[updatedMessages.length - 1] = {
                    ...updatedMessages[updatedMessages.length - 1],
                    text: newResponse
                  };
                }
                return updatedMessages;
              });
              
              return newResponse;
            });
          }
        }
      );
      
      // Save to message history if user is logged in
      if (user && fullResponse) {
        await saveMessage({
          text: message,
          userId: user.id,
          aiResponse: fullResponse,
          chatType: 'voice-bot'
        });
      }
      
      // Text-to-speech for bot response
      if ('speechSynthesis' in window && fullResponse) {
        speechSynthesisRef.current = new SpeechSynthesisUtterance(fullResponse);
        speechSynthesisRef.current.rate = 0.9; // Slightly slower for children
        speechSynthesisRef.current.pitch = 1.1; // Slightly higher pitch
        window.speechSynthesis.speak(speechSynthesisRef.current);
      }
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong');
      console.error('Error:', error);
      
      // Remove the last empty bot message if there was an error
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setLoading(false);
      setStreamingResponse('');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <NavBar />
      
      <main className="flex-1 container mx-auto max-w-4xl p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-kid-purple">Voice Bot</h1>
          <ApiKeyInput onApiKeySubmit={(key) => openaiService.setApiKey(key)} />
        </div>
        
        <div className="bg-card rounded-xl shadow-md p-4 mb-4 h-[60vh] overflow-y-auto text-card-foreground">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <div className="w-24 h-24 bg-kid-purple/10 rounded-full flex items-center justify-center mb-4">
                <Mic className="h-12 w-12 text-kid-purple" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Start a Conversation!</h3>
              <p className="text-muted-foreground max-w-md">
                Click the "Start Recording" button and speak, or type a message below to chat with the voice bot.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      msg.role === 'user'
                        ? 'bg-kid-purple text-white rounded-tr-none'
                        : 'bg-muted text-foreground rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        
        {transcript && (
          <div className="bg-muted p-3 rounded-lg mb-4 italic text-muted-foreground">
            "{transcript}"
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <DoodleButton 
            onClick={toggleListening}
            disabled={loading}
            color={isListening ? "red" : "purple"}
            className="w-full"
          >
            {isListening ? "Stop Recording" : "Start Recording"}
          </DoodleButton>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex space-x-2">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      placeholder="Type your message..."
                      {...field}
                      disabled={loading}
                      className="rounded-full bg-muted text-foreground"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              size="icon" 
              disabled={loading}
              className="rounded-full bg-kid-purple hover:bg-purple-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </Form>
      </main>
      
      <Footer />
    </div>
  );
};

export default VoiceBotPage;
