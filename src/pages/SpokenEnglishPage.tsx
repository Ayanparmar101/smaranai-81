
import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { processEnglishConversation } from '../services/openaiEngService';
import ChatContainer from '../components/chat/ChatContainer';
import ApiKeyInput from '../components/ApiKeyInput';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

const SpokenEnglishPage = () => {
  const [apiKey, setApiKey] = useLocalStorage<string>('openai-api-key', '');
  const [activeTab, setActiveTab] = useState('conversation');

  // Function to process messages using OpenAI
  const processMessage = async (message: string): Promise<string> => {
    if (!apiKey) {
      throw new Error("Please add your OpenAI API key first");
    }
    
    return processEnglishConversation(message, { apiKey });
  };

  const renderApiKeyDialog = () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">API Key Settings</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>OpenAI API Key</DialogTitle>
          <DialogDescription>
            Enter your OpenAI API key to use the conversation features.
          </DialogDescription>
        </DialogHeader>
        <ApiKeyInput 
          onApiKeySubmit={setApiKey}
        />
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="container py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Spoken English Practice</h1>
        {renderApiKeyDialog()}
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="conversation">Conversation Practice</TabsTrigger>
          <TabsTrigger value="tips">Learning Tips</TabsTrigger>
        </TabsList>
        
        <TabsContent value="conversation" className="mt-6">
          <ChatContainer 
            title="English Conversation Practice" 
            storageKey="spoken-english-chat" 
            processingFunction={processMessage} 
          />
        </TabsContent>
        
        <TabsContent value="tips" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Speaking Practice Tips</CardTitle>
                <CardDescription>Improve your spoken English</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>• Practice speaking English for at least 10 minutes every day</p>
                <p>• Record yourself speaking and listen for areas to improve</p>
                <p>• Learn common phrases and expressions, not just individual words</p>
                <p>• Don't be afraid to make mistakes - they are part of learning!</p>
                <p>• Find a language exchange partner or join conversation groups</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Pronunciation Focus</CardTitle>
                <CardDescription>Common challenges and solutions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>• Pay attention to word stress and sentence intonation</p>
                <p>• Practice minimal pairs (e.g., ship/sheep, bet/bat)</p>
                <p>• Watch English shows with subtitles to connect sounds to words</p>
                <p>• Use pronunciation apps to get feedback on your speech</p>
                <p>• Slow down when speaking difficult words or phrases</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SpokenEnglishPage;
