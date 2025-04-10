
import { useEffect } from 'react';
import { openaiService } from '@/services/openai';
import { toast } from 'sonner';

export function useOpenAIKey() {
  useEffect(() => {
    // Always prioritize environment variable
    const envApiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (envApiKey) {
      openaiService.setApiKey(envApiKey);
      // Don't notify on initial load to avoid confusion
      // toast.success('Using OpenAI API key from environment variables');
    } else {
      // Fall back to localStorage
      const savedApiKey = localStorage.getItem('openaiApiKey');
      if (savedApiKey) {
        openaiService.setApiKey(savedApiKey);
      }
    }
  }, []);
}
