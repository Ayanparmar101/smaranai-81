
import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mic, Send, StopCircle } from 'lucide-react';
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

const formSchema = z.object({
  message: z.string().min(1, {
    message: 'Message cannot be empty.',
  }),
});

const VoiceBotPage = () => {
  const { user } = useAuth();
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ role: "user" | "bot"; text: string; }[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: '',
    },
  });

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addMessage = (text: string, role: "user" | "bot") => {
    setMessages((prevMessages) => [...prevMessages, { role, text }]);
  };

  const handleApiKeySubmit = (key: string) => {
    setApiKey(key);
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Speech recognition is not supported in your browser");
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    
    recognitionRef.current.onstart = () => {
      setIsListening(true);
      setTranscript('');
    };
    
    recognitionRef.current.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }
      
      setTranscript(finalTranscript || interimTranscript);
    };
    
    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };
    
    recognitionRef.current.onend = () => {
      setIsListening(false);
    };
    
    recognitionRef.current.start();
  };

  const stopListening = async () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      
      if (transcript.trim()) {
        await handleSubmitVoice(transcript);
      }
    }
  };

  const handleSubmitVoice = async (text: string) => {
    if (!text.trim()) return;
    
    addMessage(text, 'user');
    setTranscript('');
    await fetchBotResponse(text);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const message = values.message.trim();
    if (!message) return;
    
    addMessage(message, 'user');
    form.reset();
    await fetchBotResponse(message);
  };

  const fetchBotResponse = async (message: string) => {
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
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <NavBar />
      
      <main className="flex-1 container mx-auto max-w-4xl p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-kid-purple">Voice Bot</h1>
          <ApiKeyInput onApiKeySubmit={handleApiKeySubmit} />
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
            onClick={startListening}
            disabled={isListening || loading}
            color="purple"
            className="w-full"
          >
            Start Recording
          </DoodleButton>
          
          <DoodleButton 
            onClick={stopListening}
            disabled={!isListening || loading}
            color="red"
            className="w-full"
          >
            Stop Recording
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
