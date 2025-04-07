
import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { Mic, MicOff, Send, StopCircle, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { openaiService } from '@/services/openaiService';
import ChatMessages from './ChatMessages';
import { NeoButton } from '@/components/NeoButton';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  audioUrl?: string;
}

interface VoiceChatProps {
  userId?: string;
  saveMessage?: (message: string, response: string) => void;
}

const VoiceChat: React.FC<VoiceChatProps> = ({ userId, saveMessage }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
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
      
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('Speech recognition is not supported in your browser');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onstart = () => {
      setIsListening(true);
      setTranscript('');
    };

    recognitionRef.current.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      setTranscript(finalTranscript || interimTranscript);
    };

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      toast.error(`Speech recognition error: ${event.error}`);
      setIsListening(false);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current.start();
  };

  const stopListening = async () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    if (transcript.trim()) {
      await processVoiceInput(transcript.trim());
    }
  };

  const stopSpeaking = () => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const processVoiceInput = async (text: string) => {
    try {
      setIsProcessing(true);
      
      // Add user message to chat
      const userMessage: Message = {
        id: uuidv4(),
        role: 'user',
        content: text,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessage]);
      setTranscript('');
      
      // Get AI response
      const response = await openaiService.createCompletion(
        'You are a friendly and helpful AI assistant for students. Keep your responses clear, accurate, and conversational. Limit your responses to 2-3 paragraphs at most, unless the student asks for more detailed information.',
        text,
        { temperature: 0.7, max_tokens: 300 }
      );
      
      // Add AI message to chat
      const assistantMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Save to database if user is logged in
      if (userId && saveMessage) {
        saveMessage(text, response);
      }
      
      // Generate speech for AI response
      try {
        const audioData = await openaiService.generateSpeech(response, { voice: 'nova' });
        const blob = new Blob([audioData], { type: 'audio/mpeg' });
        const audioUrl = URL.createObjectURL(blob);
        
        // Update assistant message with audio URL
        setMessages(prev => 
          prev.map(msg => 
            msg.id === assistantMessage.id ? { ...msg, audioUrl } : msg
          )
        );
        
        // Play the audio
        if (audioRef.current) {
          audioRef.current.src = audioUrl;
          audioRef.current.play();
        }
      } catch (error) {
        console.error('Error generating speech:', error);
        toast.error('Could not generate speech. Showing text response only.');
      }
      
    } catch (error) {
      toast.error('Error processing your request');
      console.error('Error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-[75vh]">
      <Card className="flex-grow mb-4 p-4 overflow-hidden flex flex-col">
        <ChatMessages messages={messages} onPlayAudio={(url) => {
          if (audioRef.current) {
            audioRef.current.src = url;
            audioRef.current.play();
          }
        }} />
      </Card>
      
      {transcript && (
        <div className="bg-muted p-3 rounded-lg mb-4 italic text-muted-foreground">
          "{transcript}"
        </div>
      )}
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {!isListening ? (
          <NeoButton
            variant="primary"
            icon={<Mic />}
            onClick={startListening}
            disabled={isProcessing}
            className="col-span-1 md:col-span-2"
          >
            Start Speaking
          </NeoButton>
        ) : (
          <NeoButton
            variant="destructive"
            icon={<StopCircle />}
            onClick={stopListening}
            className="col-span-1 md:col-span-2"
          >
            Stop Speaking
          </NeoButton>
        )}
        
        {isSpeaking ? (
          <NeoButton
            variant="secondary"
            icon={<VolumeX />}
            onClick={stopSpeaking}
            className="col-span-1 md:col-span-2"
          >
            Stop Playback
          </NeoButton>
        ) : (
          <NeoButton
            variant="secondary"
            icon={<Volume2 />}
            disabled={!messages.some(m => m.audioUrl)}
            onClick={() => {
              const lastAssistantMessage = [...messages].reverse().find(m => m.role === 'assistant' && m.audioUrl);
              if (lastAssistantMessage?.audioUrl && audioRef.current) {
                audioRef.current.src = lastAssistantMessage.audioUrl;
                audioRef.current.play();
              }
            }}
            className="col-span-1 md:col-span-2"
          >
            Replay Last Response
          </NeoButton>
        )}
      </div>
    </div>
  );
};

export default VoiceChat;
