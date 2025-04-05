
import React, { useEffect, useState, useCallback } from 'react';
import { Layout } from '@/components/Layout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';

interface ChatMessage {
  id: string;
  text: string;
  created_at: string;
  user_id: string;
  timestamp: number;
  tool_type?: string;
  image_url?: string;
  ai_response?: string;
  chat_type?: string;
  additional_data?: any;
}

const HistoryPage = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [subscriptionError, setSubscriptionError] = useState<boolean>(false);

  const fetchMessages = useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('messages')
        .select('*')
        .eq('user_id', user.id)
        .order('timestamp', { ascending: false });

      if (fetchError) {
        console.error('Error fetching messages:', fetchError);
        setError('Failed to load messages');
        return;
      }

      console.log('Fetched messages:', data?.length || 0);
      setMessages(data || []);
    } catch (error) {
      console.error('Error in messages fetch:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const setupRealtimeSubscription = useCallback(() => {
    if (!user?.id) return null;
    
    console.log('Setting up real-time subscription for user:', user?.id);
    setSubscriptionError(false);
    
    const channel = supabase.channel('messages_changes')
      .on('postgres_changes', {
        event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
        schema: 'public',
        table: 'messages',
        filter: `user_id=eq.${user?.id}`
      }, payload => {
        console.log('Real-time event received:', payload.eventType, payload);
        
        if (payload.eventType === 'INSERT') {
          console.log('New message received:', payload.new);
          setMessages(prev => [payload.new as ChatMessage, ...prev]);
          toast.success('New message received', {
            position: 'top-right',
            duration: 3000,
            closeButton: true
          });
        } else if (payload.eventType === 'UPDATE') {
          console.log('Message updated:', payload.new);
          setMessages(prev => prev.map(msg => 
            msg.id === payload.new.id ? payload.new as ChatMessage : msg
          ));
        } else if (payload.eventType === 'DELETE') {
          console.log('Message deleted:', payload.old);
          setMessages(prev => prev.filter(msg => msg.id !== payload.old.id));
        }
      })
      .subscribe(status => {
        console.log('Subscription status:', status);
        
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to messages changes');
          setSubscriptionError(false);
        } else if (status === 'TIMED_OUT' || status === 'CHANNEL_ERROR' || status === 'CLOSED') {
          console.error('Error subscribing to messages changes:', status);
          setSubscriptionError(true);
        }
      });
      
    return channel;
  }, [user?.id]);

  useEffect(() => {
    let channel = setupRealtimeSubscription();
    let retryCount = 0;
    const maxRetries = 3;
    
    const retrySubscription = () => {
      if (retryCount < maxRetries && subscriptionError) {
        console.log(`Retrying subscription (${retryCount + 1}/${maxRetries})...`);
        
        if (channel) {
          supabase.removeChannel(channel);
        }
        
        setTimeout(() => {
          channel = setupRealtimeSubscription();
          retryCount++;
        }, 2000 * (retryCount + 1));
      }
    };

    const retryTimer = subscriptionError ? setTimeout(retrySubscription, 2000) : null;

    fetchMessages();

    return () => {
      console.log('Cleaning up subscription');
      if (channel) {
        supabase.removeChannel(channel);
      }
      if (retryTimer) {
        clearTimeout(retryTimer);
      }
    };
  }, [user, fetchMessages, setupRealtimeSubscription, subscriptionError]);

  const handleManualRefresh = () => {
    fetchMessages();
    
    if (subscriptionError) {
      const channel = setupRealtimeSubscription();
      
      return () => {
        if (channel) {
          supabase.removeChannel(channel);
        }
      };
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getChatTypeLabel = (chatType: string | undefined) => {
    switch (chatType) {
      case 'story-images':
        return 'Story Images';
      case 'spoken-english':
        return 'Spoken English';
      case 'voice-bot':
        return 'Voice Bot';
      case 'socratic-tutor':
        return 'Socratic Tutor';
      case 'teacher':
        return 'Teacher';
      default:
        return 'Chat';
    }
  };

  const getFilteredMessages = () => {
    if (activeTab === "all") {
      return messages;
    }
    return messages.filter(message => message.chat_type === activeTab);
  };

  const MessageContent = ({ message }: { message: ChatMessage; }) => {
    // Check if we have multiple images
    const hasMultipleImages = message.tool_type === 'story-series-generator' && message.additional_data && 
      message.additional_data.image_urls && Array.isArray(message.additional_data.image_urls);

    return <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Badge variant="outline">{getChatTypeLabel(message.chat_type)}</Badge>
            <p className="text-xs text-muted-foreground">{formatDate(message.created_at)}</p>
          </div>

          <div className="p-3 rounded-lg bg-zinc-900">
            <p className="font-medium">You:</p>
            <p className="whitespace-pre-wrap">{message.text}</p>
          </div>

          {message.ai_response && <div className="bg-muted p-3 rounded-lg">
              <p className="font-medium">AI Assistant:</p>
              <p className="whitespace-pre-wrap">{message.ai_response}</p>
            </div>}

          {hasMultipleImages ? (
            <div className="mt-4">
              <p className="font-medium mb-2">Story Illustrations:</p>
              <Carousel className="w-full">
                <CarouselContent>
                  {message.additional_data.image_urls.map((url: string, idx: number) => (
                    <CarouselItem key={idx} className="basis-full md:basis-1/2 lg:basis-1/3">
                      <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-white p-1 h-[200px] flex items-center justify-center">
                        <img 
                          src={url} 
                          alt={`Story illustration ${idx + 1}`} 
                          className="max-h-full max-w-full object-contain"
                          onError={e => {
                            console.error('Image failed to load:', url);
                            e.currentTarget.src = '/placeholder.svg';
                            e.currentTarget.alt = 'Image failed to load';
                          }}
                        />
                        <div className="absolute top-2 left-2 bg-black text-white text-xs py-1 px-2 rounded-full">
                          {idx + 1}/{message.additional_data.image_urls.length}
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden md:flex" />
                <CarouselNext className="hidden md:flex" />
              </Carousel>
            </div>
          ) : message.image_url ? (
            <div className="mt-2">
              <img 
                src={message.image_url} 
                alt="Generated content" 
                className="rounded-lg max-w-full h-auto" 
                loading="lazy" 
                onError={e => {
                  console.error('Image failed to load:', message.image_url);
                  e.currentTarget.src = '/placeholder.svg';
                  e.currentTarget.alt = 'Image failed to load';
                }} 
              />
            </div>
          ) : null}
        </div>
      </div>;
  };

  return (
    <Layout>
      <ProtectedRoute>
        <div className="container mx-auto py-8">
          <h1 className="text-3xl font-bold mb-6">Chat History</h1>
          
          {subscriptionError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Connectivity Issue</AlertTitle>
              <AlertDescription className="flex items-center justify-between">
                <span>Unable to receive real-time updates. Messages may not appear immediately.</span>
                <button 
                  onClick={handleManualRefresh} 
                  className="flex items-center text-sm bg-destructive/20 hover:bg-destructive/30 text-destructive-foreground px-2 py-1 rounded-md"
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Refresh
                </button>
              </AlertDescription>
            </Alert>
          )}
          
          <Tabs defaultValue="all" className="mb-6" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="story-images">Story Images</TabsTrigger>
              <TabsTrigger value="spoken-english">Spoken English</TabsTrigger>
              <TabsTrigger value="voice-bot">Voice Bot</TabsTrigger>
              <TabsTrigger value="socratic-tutor">Socratic Tutor</TabsTrigger>
              <TabsTrigger value="teacher">Teacher</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-0">
              <div className="bg-card rounded-lg shadow-md p-6">
                {error ? <div className="text-center py-4 text-red-500">{error}</div> : loading ? <div className="space-y-4">
                    {[...Array(3)].map((_, i) => <div key={i} className="flex items-center space-x-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-[250px]" />
                          <Skeleton className="h-4 w-[200px]" />
                        </div>
                      </div>)}
                  </div> : getFilteredMessages().length === 0 ? <div className="text-center py-4 text-muted-foreground">
                    No messages found for this category
                  </div> : <ScrollArea className="h-[600px] pr-4">
                    <div className="space-y-6">
                      {getFilteredMessages().map(message => <div key={message.id} className="p-4 rounded-lg bg-card border">
                          <MessageContent message={message} />
                        </div>)}
                    </div>
                  </ScrollArea>}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </ProtectedRoute>
    </Layout>
  );
};

export default HistoryPage;
