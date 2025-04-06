
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot } from 'lucide-react';
import { MessageList } from '@/components/gujarati/MessageList';
import { ChatInput } from '@/components/gujarati/ChatInput';
import { useGujaratiChat } from '@/hooks/useGujaratiChat';

const GujaratiChatbotPage = () => {
  const { messages, isLoading, sendMessage, messagesEndRef } = useGujaratiChat();

  return (
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
              <MessageList 
                messages={messages} 
                messagesEndRef={messagesEndRef} 
              />
              
              <ChatInput 
                onSendMessage={sendMessage}
                isLoading={isLoading}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GujaratiChatbotPage;
