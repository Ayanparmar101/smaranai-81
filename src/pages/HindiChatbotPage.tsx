
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flag, Upload, SendIcon, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import NeoBackButton from '@/components/NeoBackButton';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import ApiKeyInput from '@/components/ApiKeyInput';
import { useAuth } from '@/contexts/AuthContext';
import { saveMessage } from '@/utils/messageUtils';
import { openaiService } from '@/services/openai';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  imageUrl?: string;
}

const HindiChatbotPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(openaiService.getApiKey());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleReturn = () => {
    navigate('/hindi');
  };

  const handleApiKeySubmit = (key: string) => {
    setApiKey(key);
    openaiService.setApiKey(key);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        toast.error('Image size must be less than 4MB');
        return;
      }
      
      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey) {
      toast.error('Please enter your OpenAI API key first');
      return;
    }
    
    if (!inputValue.trim() && !selectedImage) {
      toast.error('Please enter a message or upload an image');
      return;
    }
    
    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      imageUrl: imagePreview || undefined
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      let systemPrompt = "आप हिंदी भाषा का विशेषज्ञ हैं। आप केवल हिंदी में उत्तर दें। आप बच्चों के लिए सरल और शैक्षिक उत्तर प्रदान करें। (You are a Hindi language expert. Respond only in Hindi. Provide simple and educational answers for children.)";
      
      let userPrompt = inputValue;
      
      // If there's an image, we need to handle it differently
      if (selectedImage) {
        // For now we'll just mention the image in the prompt
        // In a real implementation, you would use vision capabilities of GPT-4o
        userPrompt = `${inputValue || 'इस छवि का वर्णन करें (Describe this image)'}. [Note: User uploaded an image]`;
      }
      
      const response = await openaiService.createCompletion(
        systemPrompt,
        userPrompt,
        { temperature: 0.7 }
      );
      
      const newBotMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: response
      };
      
      setMessages(prev => [...prev, newBotMessage]);
      
      // Save to history if user is logged in
      if (user) {
        await saveMessage({
          text: inputValue,
          userId: user.id,
          aiResponse: response,
          chatType: 'hindi-chatbot',
          toolType: 'hindi-learning',
          additionalData: { 
            hadImage: !!selectedImage,
          }
        });
      }
      
      // Clear image after processing
      clearImage();
    } catch (error) {
      console.error('Error processing message:', error);
      toast.error('Error processing your message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <NeoBackButton 
        label="Back to Hindi" 
        color="orange" 
        onClick={handleReturn}
      />

      <div className="flex items-center mb-4">
        <div className="bg-kid-orange p-3 rounded-full mr-4">
          <Flag className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold">
          <span className="bg-gradient-to-r from-kid-orange to-orange-600 bg-clip-text text-transparent">
            हिंदी चैटबॉट (Hindi Chatbot)
          </span>
        </h1>
      </div>

      <div className="mb-4 flex justify-end">
        <ApiKeyInput onApiKeySubmit={handleApiKeySubmit} />
      </div>

      <Card className="mb-4 border-3 border-black shadow-neo-md">
        <CardContent className="p-0">
          <ScrollArea className="h-[50vh] p-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <Flag className="w-12 h-12 text-kid-orange mb-4" />
                <h3 className="text-xl font-bold mb-2">हिंदी चैटबॉट (Hindi Chatbot)</h3>
                <p className="text-muted-foreground">
                  अपने प्रश्न पूछें या हिंदी अभ्यास करें। आप टेक्स्ट या इमेज अपलोड कर सकते हैं।
                  <br />
                  (Ask your questions or practice Hindi. You can upload text or images.)
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === 'user' 
                          ? 'bg-kid-orange/10 border-2 border-kid-orange/30' 
                          : 'bg-gray-100 border-2 border-gray-300'
                      }`}
                    >
                      {message.imageUrl && (
                        <div className="mb-2">
                          <img 
                            src={message.imageUrl} 
                            alt="Uploaded" 
                            className="max-w-full rounded-md"
                          />
                        </div>
                      )}
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-4">
        {imagePreview && (
          <div className="relative inline-block">
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="max-h-48 rounded-md border-2 border-gray-300"
            />
            <button
              type="button"
              onClick={clearImage}
              className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
            >
              <XCircle className="w-5 h-5 text-red-500" />
            </button>
          </div>
        )}
        
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            className="border-3 border-black shadow-neo-sm hover:translate-y-1 hover:shadow-none"
          >
            <Upload className="h-4 w-4" />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
          </Button>
          
          <div className="flex-grow relative">
            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="अपना संदेश यहां टाइप करें... (Type your message here...)"
              className="min-h-[80px] border-3 border-black pr-12 focus:border-kid-orange shadow-neo-sm"
            />
            <Button
              type="submit"
              disabled={isLoading || (!inputValue.trim() && !selectedImage)}
              className="absolute bottom-2 right-2 bg-kid-orange hover:bg-orange-600"
              size="icon"
            >
              <SendIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default HindiChatbotPage;
