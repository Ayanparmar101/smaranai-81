
import React, { useState } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import ApiKeyInput from '@/components/ApiKeyInput';
import { openaiService } from '@/services/openaiService';
import { toast } from 'sonner';
import DoodleDecoration from '@/components/DoodleDecoration';

const VoiceBotPage = () => {
  const [isApiKeySet, setIsApiKeySet] = useState(!!openaiService.getApiKey());

  const handleApiKeyChange = (key: string) => {
    openaiService.setApiKey(key);
    setIsApiKeySet(!!key);
    toast.success('API key saved');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Voice Chat Bot
          </h1>
          
          <p className="text-gray-700 mb-8">
            Talk with an AI assistant that listens to your voice and responds to help you practice English conversation.
          </p>

          {!isApiKeySet && (
            <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <h3 className="font-bold text-yellow-800 mb-2">OpenAI API Key Required</h3>
              <p className="text-sm text-yellow-700 mb-4">
                To use the Voice Chat Bot, you need to provide your OpenAI API key. This key remains in your browser and is never sent to our servers.
              </p>
              <ApiKeyInput onApiKeySubmit={handleApiKeyChange} />
            </div>
          )}

          <div className="flex flex-col items-center justify-center py-12 text-center">
            <DoodleDecoration type="star" color="orange" size="lg" className="mb-4" />
            <h2 className="text-2xl font-bold text-gray-400 mb-2">Coming Soon!</h2>
            <p className="text-gray-500 max-w-md">
              We're still working on this feature. Soon you'll be able to practice English conversation by speaking with our AI voice bot!
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default VoiceBotPage;
