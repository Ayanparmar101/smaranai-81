
import React, { useState, useRef, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mic, Send, StopCircle } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { saveMessage } from '@/utils/messageUtils';

type Message = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: number;
};

const GujaratiChatbotPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('conversation');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'નમસ્તે! હું તમારી ગુજરાતી શીખવામાં મદદ કરવા માટે અહીં છું. આપણે શું શીખવું જોઈએ?',
      isUser: false,
      timestamp: Date.now()
    }
  ]);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const startTopics = [
    { id: 'greetings', title: 'અભિવાદન', english: 'Greetings' },
    { id: 'family', title: 'પરિવાર', english: 'Family' },
    { id: 'food', title: 'ભોજન', english: 'Food' },
    { id: 'colors', title: 'રંગો', english: 'Colors' },
    { id: 'numbers', title: 'સંખ્યાઓ', english: 'Numbers' },
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
          
          setInput(transcript);
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      text: input,
      isUser: true,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Save user message to history if logged in
    if (user) {
      await saveMessage({
        text: input,
        userId: user.id,
        chatType: 'gujarati-chatbot',
        timestamp: Date.now()
      });
    }

    // Generate bot response (simple for now, could be improved with AI integration)
    setTimeout(async () => {
      let botResponse = '';
      const lowerInput = input.toLowerCase();
      
      if (lowerInput.includes('નમસ્તે') || lowerInput.includes('hello') || lowerInput.includes('hi')) {
        botResponse = 'નમસ્તે! તમે કેમ છો?';
      } else if (lowerInput.includes('કેમ છો') || lowerInput.includes('how are you')) {
        botResponse = 'હું સારું છું, આભાર! તમે કેમ છો?';
      } else if (lowerInput.includes('મારું નામ') || lowerInput.includes('my name')) {
        botResponse = 'તમને મળીને આનંદ થયો! હું તમારી ગુજરાતી શીખવામાં મદદ કરીશ.';
      } else if (lowerInput.includes('રંગ') || lowerInput.includes('color')) {
        botResponse = 'ગુજરાતીમાં મુખ્ય રંગો: લાલ (red), વાદળી (blue), પીળો (yellow), લીલો (green), કાળો (black), સફેદ (white).';
      } else if (lowerInput.includes('સંખ્યા') || lowerInput.includes('number')) {
        botResponse = 'ગુજરાતીમાં સંખ્યાઓ: એક (1), બે (2), ત્રણ (3), ચાર (4), પાંચ (5).';
      } else {
        botResponse = 'મને સમજાયું નહીં. કૃપા કરીને ફરીથી પ્રયાસ કરો અથવા બીજો પ્રશ્ન પૂછો.';
      }
      
      const botMessageObj = {
        id: Date.now().toString(),
        text: botResponse,
        isUser: false,
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, botMessageObj]);
      
      // Save bot response to history if logged in
      if (user) {
        await saveMessage({
          text: input,
          userId: user.id,
          aiResponse: botResponse,
          chatType: 'gujarati-chatbot',
          timestamp: Date.now()
        });
      }
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTopicClick = (topic: string) => {
    let message = '';
    switch (topic) {
      case 'greetings':
        message = 'ગુજરાતીમાં અભિવાદન કેવી રીતે કરવું તે શીખવશો?';
        break;
      case 'family':
        message = 'ગુજરાતીમાં પરિવારના સભ્યોના નામ શીખવા માંગું છું.';
        break;
      case 'food':
        message = 'ગુજરાતી વ્યંજનો અને ખાદ્ય પદાર્થોના નામ શીખવાડશો?';
        break;
      case 'colors':
        message = 'ગુજરાતીમાં રંગોના નામ શું છે?';
        break;
      case 'numbers':
        message = 'ગુજરાતીમાં 1 થી 10 સુધીની સંખ્યાઓ શીખવાડશો?';
        break;
      default:
        message = 'મને આ વિષય વિશે વધુ જાણકારી આપશો?';
    }
    setInput(message);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">ગુજરાતી ચેટબોટ</h1>
          <p className="text-xl">Gujarati Chatbot</p>
        </div>

        <Tabs defaultValue="conversation" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="conversation">Conversation</TabsTrigger>
            <TabsTrigger value="topics">Suggested Topics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="conversation" className="h-[70vh] flex flex-col">
            <Card className="flex-1 flex flex-col h-full">
              <CardHeader>
                <CardTitle>ગુજરાતી વાતચીત કરો</CardTitle>
                <CardDescription>
                  Practice your Gujarati by chatting with our AI tutor
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col h-full p-0">
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className="flex items-start gap-2 max-w-[80%]">
                        {!message.isUser && (
                          <Avatar className="mt-1 bg-primary text-primary-foreground">
                            <span>અ</span>
                          </Avatar>
                        )}
                        <div
                          className={`p-3 rounded-lg ${
                            message.isUser
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="whitespace-pre-line">{message.text}</p>
                          <div className="text-xs opacity-70 mt-1 text-right">
                            {new Date(message.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                        {message.isUser && (
                          <Avatar className="mt-1 bg-primary text-primary-foreground">
                            <span>મ</span>
                          </Avatar>
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={toggleListening}
                      className={isListening ? 'bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700' : ''}
                    >
                      {isListening ? <StopCircle /> : <Mic />}
                    </Button>
                    <Textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type your message in Gujarati or English..."
                      className="flex-1 min-h-[60px] resize-none"
                    />
                    <Button size="icon" onClick={handleSendMessage}>
                      <Send />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="topics">
            <Card>
              <CardHeader>
                <CardTitle>સૂચિત વિષયો</CardTitle>
                <CardDescription>
                  Choose from these topics to start practicing Gujarati
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {startTopics.map((topic) => (
                    <Button
                      key={topic.id}
                      variant="outline"
                      className="p-8 h-auto flex flex-col gap-2 hover:bg-accent"
                      onClick={() => {
                        handleTopicClick(topic.id);
                        setActiveTab('conversation');
                      }}
                    >
                      <span className="text-xl font-bold">{topic.title}</span>
                      <span className="text-sm text-gray-500">{topic.english}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default GujaratiChatbotPage;
