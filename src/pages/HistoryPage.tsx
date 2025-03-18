
import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { supabase } from '@/integrations/supabase/client';
import { useContext } from 'react';
import { AuthContext } from '@/App';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ChatMessage {
  id: string;
  text: string;
  created_at: string;
  user_id: string;
}

const HistoryPage = () => {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!user?.id) return;

      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('user_id', user.id)
          .order('timestamp', { ascending: false });

        if (error) throw error;
        setMessages(data || []);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
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

  return (
    <Layout>
      <ProtectedRoute>
        <div className="container mx-auto py-8">
          <h1 className="text-3xl font-bold mb-6">Chat History</h1>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Messages</TabsTrigger>
              <TabsTrigger value="story">Story Images</TabsTrigger>
              <TabsTrigger value="spoken">Spoken English</TabsTrigger>
              <TabsTrigger value="voice">Voice Bot</TabsTrigger>
              <TabsTrigger value="teacher">Teacher</TabsTrigger>
            </TabsList>

            <div className="bg-card rounded-lg shadow-md p-6">
              {loading ? (
                <div className="text-center py-4">Loading messages...</div>
              ) : messages.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No messages found
                </div>
              ) : (
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className="p-4 rounded-lg bg-muted"
                      >
                        <p className="text-sm text-muted-foreground mb-2">
                          {formatDate(message.created_at)}
                        </p>
                        <p className="whitespace-pre-wrap">{message.text}</p>
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
