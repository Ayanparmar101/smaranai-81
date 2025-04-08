
import { useState, useRef, useEffect } from 'react';

export const useVoicePlayback = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      
      audioRef.current.addEventListener('play', () => {
        setIsSpeaking(true);
      });
      
      audioRef.current.addEventListener('ended', () => {
        setIsSpeaking(false);
      });
      
      audioRef.current.addEventListener('pause', () => {
        setIsSpeaking(false);
      });
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const playAudio = (url: string) => {
    if (audioRef.current) {
      audioRef.current.src = url;
      audioRef.current.play();
    }
  };

  const stopAudio = () => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const replayLastResponse = (messages: Array<{id: string; role: string; audioUrl?: string}>) => {
    const lastAssistantMessage = [...messages].reverse().find(m => m.role === 'assistant' && m.audioUrl);
    if (lastAssistantMessage?.audioUrl && audioRef.current) {
      audioRef.current.src = lastAssistantMessage.audioUrl;
      audioRef.current.play();
    }
  };

  return {
    isSpeaking,
    playAudio,
    stopAudio,
    replayLastResponse
  };
};
