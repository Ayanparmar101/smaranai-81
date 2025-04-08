
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';

interface UseVoiceRecognitionProps {
  onTranscriptChange?: (transcript: string) => void;
  onProcessInput?: (text: string) => Promise<void>;
}

export const useVoiceRecognition = ({ onTranscriptChange, onProcessInput }: UseVoiceRecognitionProps = {}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (onTranscriptChange) {
      onTranscriptChange(transcript);
    }
  }, [transcript, onTranscriptChange]);

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
      
      if (transcript.trim() && onProcessInput) {
        await onProcessInput(transcript.trim());
      }
    }
  };

  return {
    isListening,
    transcript,
    startListening,
    stopListening
  };
};
