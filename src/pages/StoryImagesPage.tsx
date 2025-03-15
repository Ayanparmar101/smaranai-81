
import React, { useState, useEffect } from 'react';
import { Image, Download, RefreshCcw, Undo, Send } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import ApiKeyInput from '@/components/ApiKeyInput';
import DoodleButton from '@/components/DoodleButton';
import { openaiService } from '@/services/openaiService';

const StoryImagesPage = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [storyText, setStoryText] = useState('');
  const [prompt, setPrompt] = useState('');
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<Array<{ prompt: string; imageUrl: string }>>([]);
  
  useEffect(() => {
    const envApiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (envApiKey) {
      setApiKey(envApiKey);
      openaiService.setApiKey(envApiKey);
    }
  }, []);

  const handleApiKeySubmit = (key: string) => {
    setApiKey(key);
    openaiService.setApiKey(key);
  };

  const generatePrompt = async () => {
    if (!apiKey) {
      toast.error('Please enter your OpenAI API key first');
      return;
    }
    
    if (!storyText.trim()) {
      toast.error('Please write a story first');
      return;
    }
    
    setLoading(true);
    
    try {
      const systemPrompt = `You are a helpful AI that creates art prompts for children's stories. Given a story snippet, create a child-friendly, colorful, and engaging prompt that can be used to generate an illustration for the story. The prompt should be detailed yet simple, and should focus on creating a cheerful, colorful doodle-style illustration. Include specific details from the story, and describe the art style as "colorful children's book illustration with doodle style". Keep the prompt under 200 characters.`;
      
      const result = await openaiService.createCompletion(systemPrompt, storyText);
      setPrompt(result);
    } catch (error) {
      console.error('Error generating prompt:', error);
      toast.error('Failed to generate a prompt. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateImage = async () => {
    if (!apiKey) {
      toast.error('Please enter your OpenAI API key first');
      return;
    }
    
    if (!prompt.trim()) {
      toast.error('Please generate or write a prompt first');
      return;
    }
    
    setLoading(true);
    
    try {
      const enhancedPrompt = prompt + ", children's book illustration style, colorful doodles, cute characters, happy mood";
      const imageUrl = await openaiService.generateImage(enhancedPrompt);
      
      setGeneratedImageUrl(imageUrl);
      
      // Add to history
      setHistory(prev => [{ prompt, imageUrl }, ...prev.slice(0, 5)]);
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error('Failed to generate an image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = () => {
    if (!generatedImageUrl) return;
    
    const link = document.createElement('a');
    link.href = generatedImageUrl;
    link.download = 'story-illustration.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearStory = () => {
    setStoryText('');
    setPrompt('');
  };

  const loadFromHistory = (item: { prompt: string; imageUrl: string }) => {
    setPrompt(item.prompt);
    setGeneratedImageUrl(item.imageUrl);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavBar />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              <span className="flex items-center gap-2">
                <Image className="text-kid-yellow" />
                Story Image Generator
              </span>
            </h1>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div>
              <div className="bg-card rounded-2xl p-6 shadow-lg border-4 border-dashed border-kid-yellow mb-6 text-card-foreground">
                <h2 className="text-xl font-bold mb-4">Write Your Story</h2>
                <p className="text-muted-foreground mb-4">
                  Write a short story or describe a scene, and we'll generate an illustration for it!
                </p>
                
                <div className="mb-4">
                  <Textarea
                    placeholder="Once upon a time, there was a little rabbit who lived in a magical forest..."
                    value={storyText}
                    onChange={(e) => setStoryText(e.target.value)}
                    className="min-h-[150px] border-2 border-gray-200 focus:border-kid-yellow bg-muted text-foreground"
                  />
                </div>
                
                <div className="flex space-x-3">
                  <DoodleButton
                    color="yellow"
                    onClick={generatePrompt}
                    loading={loading && !prompt}
                  >
                    Create Prompt
                  </DoodleButton>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={clearStory}
                    title="Clear story"
                  >
                    <Undo className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="bg-card rounded-2xl p-6 shadow-lg border-4 border-dashed border-kid-orange text-card-foreground">
                <h2 className="text-xl font-bold mb-4">Image Prompt</h2>
                <p className="text-muted-foreground mb-4">
                  Edit the prompt or use the generated one to create your image.
                </p>
                
                <div className="mb-4">
                  <Textarea
                    placeholder="The prompt will appear here..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[100px] border-2 border-gray-200 focus:border-kid-orange bg-muted text-foreground"
                  />
                </div>
                
                <DoodleButton
                  color="orange"
                  onClick={generateImage}
                  loading={loading && prompt !== ''}
                  icon={<Send className="w-4 h-4" />}
                >
                  Generate Image
                </DoodleButton>
              </div>
            </div>
            
            <div>
              <div className="bg-card rounded-2xl p-6 shadow-lg border-4 border-dashed border-kid-red h-full flex flex-col text-card-foreground">
                <h2 className="text-xl font-bold mb-4">Your Illustration</h2>
                
                {generatedImageUrl ? (
                  <div className="flex flex-col flex-grow">
                    <div className="relative bg-muted rounded-xl overflow-hidden flex-grow flex items-center justify-center">
                      <img
                        src={generatedImageUrl}
                        alt="Generated illustration"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    
                    <div className="mt-4 flex justify-center">
                      <DoodleButton
                        color="red"
                        onClick={downloadImage}
                        icon={<Download className="w-4 h-4" />}
                      >
                        Download Image
                      </DoodleButton>
                    </div>
                  </div>
                ) : (
                  <div className="flex-grow flex flex-col items-center justify-center bg-muted rounded-xl p-8">
                    <Image className="w-16 h-16 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground text-center">
                      Your generated image will appear here.
                      <br />
                      Write a story and generate an image!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* History section */}
          {history.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6 text-foreground">Your Recent Images</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {history.map((item, index) => (
                  <div 
                    key={index}
                    className="bg-card rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer text-card-foreground"
                    onClick={() => loadFromHistory(item)}
                  >
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={item.imageUrl} 
                        alt={`History item ${index}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-sm text-muted-foreground line-clamp-2">{item.prompt}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default StoryImagesPage;
