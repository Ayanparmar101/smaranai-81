
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface SaveMessageParams {
  text: string;
  userId: string;
  aiResponse?: string;
  chatType: 'story-images' | 'spoken-english' | 'voice-bot' | 'socratic-tutor' | 'teacher' | 'gujarati-chatbot';
  imageUrl?: string;
  toolType?: string;
  additionalData?: Record<string, any>;
}

export const saveMessage = async ({
  text,
  userId,
  aiResponse,
  chatType,
  imageUrl,
  toolType,
  additionalData
}: SaveMessageParams): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('messages')
      .insert({
        text,
        user_id: userId,
        ai_response: aiResponse,
        chat_type: chatType,
        image_url: imageUrl,
        tool_type: toolType,
        additional_data: additionalData,
        timestamp: Math.floor(Date.now() / 1000)
      });

    if (error) {
      console.error('Error saving message:', error);
      toast.error('Failed to save to history');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in saveMessage:', error);
    return false;
  }
};
