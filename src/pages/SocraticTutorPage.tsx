
import React, { useState, useRef } from 'react';
import { Send, HelpCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import DoodleButton from '@/components/DoodleButton';
import ApiKeyInput from '@/components/ApiKeyInput';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import openaiService from '@/services/openaiService';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import DoodleDecoration from '@/components/DoodleDecoration';
import { useAuth } from '@/contexts/AuthContext';
import { saveMessage } from '@/utils/messageUtils';

const SocraticTutorPage = () => {
  const { user } = useAuth();
  const [question, setQuestion] = useState('');
  const [conversation, setConversation] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isApiKeySet, setIsApiKeySet] = useState(!!openaiService.getApiKey());
  const conversationEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of conversation
  const scrollToBottom = () => {
    if (conversationEndRef.current) {
      conversationEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle API key change
  const handleApiKeyChange = (key: string) => {
    openaiService.setApiKey(key);
    setIsApiKeySet(!!key);
    toast.success('API key saved');
  };

  // Handle question submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim()) {
      toast.error('Please enter a question');
      return;
    }

    if (!isApiKeySet) {
      toast.error('Please set your OpenAI API key first');
      return;
    }

    // Add user question to conversation
    const newUserMessage = { role: 'user' as const, content: question.trim() };
    setConversation(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      // Prepare Socratic prompt
      const systemPrompt = `
        You are a Socratic tutor for English language students in grades 1-8. 
        Your goal is to help students learn by guiding them to discover answers themselves.
        
        Guidelines:
        1. NEVER give direct answers to questions. Instead, ask follow-up questions that lead students to discover insights.
        2. Use age-appropriate language based on the complexity of their questions.
        3. Break complex topics into smaller, manageable questions.
        4. Praise effort and good thinking.
        5. If they're stuck, provide small hints but still let them figure out the main point.
        6. Relate concepts to examples they would understand.
        7. Keep your responses concise and engaging.
        8. Use friendly, encouraging language.
        
        Remember: The goal is to develop their critical thinking skills while teaching English.
      `;

      // Get AI response
      const response = await openaiService.createCompletion(
        systemPrompt,
        question,
        { temperature: 0.7 }
      );

      // Add AI response to conversation
      setConversation(prev => [...prev, { role: 'assistant', content: response }]);
      
      // Save to history if user is logged in
      if (user) {
        await saveMessage({
          text: question,
          userId: user.id,
          aiResponse: response,
          chatType: 'socratic-tutor'
        });
      }
      
      setQuestion('');
    } catch (error) {
      console.error('Error getting response:', error);
      toast.error('Failed to get a response. Please try again.');
    } finally {
      setIsLoading(false);
      // Scroll to bottom after state updates
      setTimeout(scrollToBottom, 100);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavBar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
            <div className="md:w-3/5">
              <h1 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">
                Socratic Tutor
              </h1>
              <p className="text-muted-foreground mb-4">
                Ask questions about English grammar, vocabulary, or writing. 
                Instead of giving you direct answers, the tutor will guide you to discover the answers yourself through thoughtful questions.
              </p>
            </div>
            <div className="md:w-2/5 bg-card/40 p-4 rounded-xl border border-kid-purple/20">
              <div className="flex items-start gap-2">
                <HelpCircle className="text-kid-purple mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-kid-purple">How it works:</h3>
                  <p className="text-sm text-muted-foreground">
                    The Socratic method helps you learn by guiding you to find answers through questions rather than just telling you the answer directly.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {!isApiKeySet && (
            <div className="mb-8 p-4 bg-yellow-950/20 border border-yellow-800/30 rounded-xl">
              <h3 className="font-bold text-yellow-400 mb-2">OpenAI API Key Required</h3>
              <p className="text-sm text-yellow-400/80 mb-4">
                To use the Socratic Tutor, you need to provide your OpenAI API key. This key remains in your browser and is never sent to our servers.
              </p>
              <ApiKeyInput onApiKeySubmit={handleApiKeyChange} />
            </div>
          )}

          <div className="bg-card rounded-xl shadow-lg border border-border overflow-hidden mb-6 text-card-foreground">
            <ScrollArea className="h-[400px] p-4">
              {conversation.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6">
                  <DoodleDecoration type="circle" color="purple" size="lg" className="mb-4 opacity-50" />
                  <h3 className="text-xl font-medium text-muted-foreground mb-2">Your Socratic learning journey begins here</h3>
                  <p className="text-muted-foreground max-w-md">
                    Ask any English-related question, and the tutor will guide you toward the answer through thoughtful questions.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {conversation.map((message, index) => (
                    <div 
                      key={index} 
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[80%] p-3 rounded-xl ${
                          message.role === 'user' 
                            ? 'bg-kid-blue text-white rounded-tr-none' 
                            : 'bg-muted text-foreground rounded-tl-none'
                        }`}
                      >
                        {message.content.split('\n').map((text, i) => (
                          <p key={i} className={i > 0 ? 'mt-2' : ''}>
                            {text}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div ref={conversationEndRef} />
                </div>
              )}
            </ScrollArea>

            <form onSubmit={handleSubmit} className="p-4 border-t border-border">
              <div className="flex gap-2">
                <Textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask a question about English..."
                  className="flex-1 min-h-12 bg-muted text-foreground"
                  disabled={isLoading || !isApiKeySet}
                />
                <DoodleButton
                  type="submit"
                  color="purple"
                  disabled={isLoading || !question.trim() || !isApiKeySet}
                  loading={isLoading}
                  icon={isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                >
                  {isLoading ? "Thinking..." : "Ask"}
                </DoodleButton>
              </div>
            </form>
          </div>

          <div className="bg-muted p-4 rounded-xl border border-border">
            <h3 className="font-bold mb-2 text-foreground">Example questions to ask:</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• What's the difference between "their", "there", and "they're"?</li>
              <li>• How do I use past tense verbs correctly?</li>
              <li>• Why do we use punctuation marks?</li>
              <li>• How can I make my writing more interesting?</li>
              <li>• What's the difference between adjectives and adverbs?</li>
            </ul>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SocraticTutorPage;
