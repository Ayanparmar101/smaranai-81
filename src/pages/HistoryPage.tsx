
import React, { useEffect, useState, useContext } from 'react';
import { Layout } from '@/components/Layout';
import { supabase } from '@/integrations/supabase/client';
import { AuthContext } from '@/App';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';

interface ChatMessage {
  id: string;
  text: string;
  created_at: string;
  user_id: string;
  timestamp: number;
  tool_type?: string;
  image_url?: string;
}

const HistoryPage = () => {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
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

        setMessages(data || []);
      } catch (error) {
        console.error('Error in messages fetch:', error);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    const channel = supabase
      .channel('messages_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `user_id=eq.${user?.id}`
        },
        (payload) => {
          setMessages(prev => [payload.new as ChatMessage, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getFilteredMessages = () => {
    if (activeTab === 'all') return messages;
    return messages.filter(message => message.tool_type === activeTab);
  };

  const MessageContent = ({ message }: { message: ChatMessage }) => {
    if (message.image_url) {
      return (
        <div className="space-y-2">
          <p className="whitespace-pre-wrap mb-2">{message.text}</p>
          <img 
            src={message.image_url} 
            alt="Generated content"
            className="rounded-lg max-w-full h-auto"
          />
        </div>
      );
    }
    return <p className="whitespace-pre-wrap">{message.text}</p>;
  };

  return (
    <Layout>
      <ProtectedRoute>
        <div className="container mx-auto py-8">
          <h1 className="text-3xl font-bold mb-6">Chat History</h1>
          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Messages</TabsTrigger>
              <TabsTrigger value="story-images">Story Images</TabsTrigger>
              <TabsTrigger value="spoken-english">Spoken English</TabsTrigger>
              <TabsTrigger value="voice-bot">Voice Bot</TabsTrigger>
              <TabsTrigger value="teacher">Teacher</TabsTrigger>
            </TabsList>

            <div className="bg-card rounded-lg shadow-md p-6">
              {error ? (
                <div className="text-center py-4 text-red-500">{error}</div>
              ) : loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : getFilteredMessages().length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No messages found
                </div>
              ) : (
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-4">
                    {getFilteredMessages().map((message) => (
                      <div
                        key={message.id}
                        className="p-4 rounded-lg bg-muted"
                      >
                        <p className="text-sm text-muted-foreground mb-2">
                          {formatDate(message.created_at)}
                        </p>
                        <MessageContent message={message} />
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
          </Tabs>
        </div>
      </ProtectedRoute>
    </Layout>
  );
};

export default HistoryPage;
