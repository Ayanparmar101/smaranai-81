
import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { saveMessage } from '@/utils/messageUtils';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import VoiceChat from '@/components/voice-assistant/VoiceChat';
import { openaiService } from '@/services/openai';
import ApiKeyInput from '@/components/ApiKeyInput';

const VoiceAssistantPage: React.FC = () => {
  const { user } = useAuth();
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isReady, setIsReady] = useState<boolean>(false);

  const handleApiKeySubmit = (key: string) => {
    setApiKey(key);
    openaiService.setApiKey(key);
    setIsReady(true);
  };

  useEffect(() => {
    // Check if API key exists in openaiService
    const savedKey = openaiService.getApiKey();
    if (savedKey) {
      setApiKey(savedKey);
      setIsReady(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavBar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-bold text-primary">Voice Assistant</h1>
            <p className="text-muted-foreground mt-2">
              Talk with an AI assistant using your voice. Ask questions and get spoken responses.
            </p>
          </div>
          <ApiKeyInput onApiKeySubmit={handleApiKeySubmit} />
        </div>

        {isReady ? (
          <VoiceChat 
            userId={user?.id}
            saveMessage={(message, response) => {
              if (user) {
                saveMessage({
                  text: message,
                  userId: user.id,
                  aiResponse: response,
                  chatType: 'voice-bot',
                  additionalData: { isVoiceAssistant: true }
                });
              }
            }}
          />
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">API Key Required</h2>
            <p className="text-muted-foreground mb-4">
              Please enter your OpenAI API key to use the Voice Assistant feature.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default VoiceAssistantPage;
