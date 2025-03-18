import React, { useEffect, useState, useContext } from 'react';
import { Layout } from '@/components/Layout';
import { supabase } from '@/integrations/supabase/client';
import { AuthContext } from '@/App';
import ProtectedRoute from '@/components/ProtectedRoute';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
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
}
const HistoryPage = () => {
  const {
    user
  } = useContext(AuthContext);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all");
  useEffect(() => {
    const fetchMessages = async () => {
      if (!user?.id) return;
      try {
        setLoading(true);
        setError(null);
        const {
          data,
          error: fetchError
        } = await supabase.from('messages').select('*').eq('user_id', user.id).order('timestamp', {
          ascending: false
        });
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
    };
    fetchMessages();

    // Set up real-time subscription for all message changes
    const subscribeToChanges = () => {
      console.log('Setting up real-time subscription for user:', user?.id);
      const channel = supabase.channel('messages_changes').on('postgres_changes', {
        event: '*',
        // Listen to all events (INSERT, UPDATE, DELETE)
        schema: 'public',
        table: 'messages',
        filter: `user_id=eq.${user?.id}`
      }, payload => {
        console.log('Real-time event received:', payload.eventType, payload);
        if (payload.eventType === 'INSERT') {
          console.log('New message received:', payload.new);
          setMessages(prev => [payload.new as ChatMessage, ...prev]);
          toast.success('New message received');
        } else if (payload.eventType === 'UPDATE') {
          console.log('Message updated:', payload.new);
          setMessages(prev => prev.map(msg => msg.id === payload.new.id ? payload.new as ChatMessage : msg));
        } else if (payload.eventType === 'DELETE') {
          console.log('Message deleted:', payload.old);
          setMessages(prev => prev.filter(msg => msg.id !== payload.old.id));
        }
      }).subscribe(status => {
        console.log('Subscription status:', status);
        // Fix: Use proper type checking instead of string comparison
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to messages changes');
        } else if (status === 'TIMED_OUT' || status === 'CHANNEL_ERROR' || status === 'CLOSED') {
          console.error('Error subscribing to messages changes:', status);
          // Use Sonner toast directly without affecting UI - better user experience
          toast.error('Error subscribing to message updates', {
            position: 'top-right',
            duration: 3000,
            closeButton: true,
            // This ensures the toast is shown briefly and doesn't stay too long
            onAutoClose: () => console.log('Toast closed')
          });
        }
      });
      return channel;
    };
    const channel = subscribeToChanges();
    return () => {
      console.log('Cleaning up subscription');
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [user]);
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
  const MessageContent = ({
    message
  }: {
    message: ChatMessage;
  }) => {
    return <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Badge variant="outline">{getChatTypeLabel(message.chat_type)}</Badge>
            <p className="text-xs text-muted-foreground">{formatDate(message.created_at)}</p>
          </div>

          {/* User message */}
          <div className="p-3 rounded-lg bg-zinc-900">
            <p className="font-medium">You:</p>
            <p className="whitespace-pre-wrap">{message.text}</p>
          </div>

          {/* AI response - show only if exists */}
          {message.ai_response && <div className="bg-muted p-3 rounded-lg">
              <p className="font-medium">AI Assistant:</p>
              <p className="whitespace-pre-wrap">{message.ai_response}</p>
            </div>}

          {/* Image - show only if exists */}
          {message.image_url && <div className="mt-2">
              <img src={message.image_url} alt="Generated content" className="rounded-lg max-w-full h-auto" loading="lazy" onError={e => {
            console.error('Image failed to load:', message.image_url);
            e.currentTarget.src = '/placeholder.svg';
            e.currentTarget.alt = 'Image failed to load';
          }} />
            </div>}
        </div>
      </div>;
  };
  return <Layout>
      <ProtectedRoute>
        <div className="container mx-auto py-8">
          <h1 className="text-3xl font-bold mb-6">Chat History</h1>
          
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
    </Layout>;
};
export default HistoryPage;