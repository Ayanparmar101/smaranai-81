
import { useEffect } from 'react';
import openaiService from '@/services/openaiService';

export function useOpenAIKey() {
  useEffect(() => {
    const envApiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (envApiKey) {
      openaiService.setApiKey(envApiKey);
    } else {
      const savedApiKey = localStorage.getItem('openaiApiKey');
      if (savedApiKey) {
        openaiService.setApiKey(savedApiKey);
      }
    }
  }, []);
}
