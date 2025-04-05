
import React, { useState, useEffect, useRef } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import ApiKeyInput from '@/components/ApiKeyInput';
import { openaiService } from '@/services/openaiService';
import { toast } from 'sonner';
import DoodleDecoration from '@/components/DoodleDecoration';
import { Mic, MicOff, Play, Square, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import DoodleButton from '@/components/DoodleButton';
import { useAuth } from '@/contexts/AuthContext';
import { saveMessage } from '@/utils/messageUtils';

const SpokenEnglishPage = () => {
  const { user } = useAuth();
  const [isApiKeySet, setIsApiKeySet] = useState(!!openaiService.getApiKey());
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [useWebSpeech, setUseWebSpeech] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const handleApiKeyChange = (key: string) => {
    openaiService.setApiKey(key);
    setIsApiKeySet(!!key);
    toast.success('API key saved');
  };
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        try {
          setIsLoading(true);
          recognizeSpeech(audioBlob);
        } catch (error) {
          console.error('Error transcribing audio:', error);
          toast.error('Failed to transcribe audio. Please try again.');
          setIsLoading(false);
        }
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      toast.success('Recording started');
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error('Failed to access microphone. Please check permissions.');
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast.success('Recording stopped');
      
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };
  
  const recognizeSpeech = (audioBlob: Blob) => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    
    recognition.onresult = (event) => {
      const result = event.results[0][0].transcript;
      setTranscript(result);
      setIsLoading(false);
    };
    
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      toast.error('Failed to recognize speech. Please try again.');
      setIsLoading(false);
    };
    
    recognition.start();
  };
  
  const handleSubmit = async () => {
    if (!transcript.trim()) {
      toast.error('Please record something first');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const systemPrompt = `You are a helpful English tutor specializing in teaching young students (grades 1-8). 
      Your responses should be encouraging, simple, and educational. 
      Correct any grammar or pronunciation mistakes in the student's speech, 
      but do it in a gentle, supportive way. Provide examples and explanations when needed. 
      Keep responses under 150 words and appropriate for children.`;
      
      const result = await openaiService.createCompletion(systemPrompt, transcript);
      setResponse(result);
      
      if (user) {
        await saveMessage({
          text: transcript,
          userId: user.id,
          aiResponse: result,
          chatType: 'spoken-english'
        });
      }
      
      if (!useWebSpeech) {
        await speakTextWithOpenAI(result);
      } else {
        speakTextWithWebSpeech(result);
      }
    } catch (error) {
      console.error('Error getting response:', error);
      toast.error('Failed to get a response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const speakTextWithOpenAI = async (text: string) => {
    try {
      setIsSpeaking(true);
      
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      
      const audioData = await openaiService.generateSpeech(text, {
        voice: "nova",
        speed: 0.9,
      });
      
      const blob = new Blob([audioData], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);
      
      const audio = new Audio(url);
      audioRef.current = audio;
      
      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(url);
      };
      
      audio.onerror = (e) => {
        console.error('Audio playback error:', e);
        setIsSpeaking(false);
        toast.error('Failed to play the audio. Please try again.');
        URL.revokeObjectURL(url);
      };
      
      await audio.play();
    } catch (error) {
      console.error('Error with OpenAI TTS:', error);
      setIsSpeaking(false);
      
      toast.error('OpenAI TTS failed. Falling back to browser TTS.');
      setUseWebSpeech(true);
      speakTextWithWebSpeech(text);
    }
  };
  
  const speakTextWithWebSpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      
      const voices = window.speechSynthesis.getVoices();
      
      const englishVoice = voices.find(voice => 
        voice.lang.includes('en') && voice.name.includes('Female')
      ) || voices.find(voice => voice.lang.includes('en')) || voices[0];
      
      if (englishVoice) {
        utterance.voice = englishVoice;
      }
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setIsSpeaking(false);
        toast.error('Failed to speak text. Please try again.');
      };
      
      speechSynthesisRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } else {
      toast.error('Text-to-speech is not supported in your browser.');
    }
  };
  
  const stopSpeaking = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsSpeaking(false);
    } else if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };
  
  useEffect(() => {
    if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
      toast.error('Speech recognition is not supported in your browser.');
    }
    
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
    
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
      
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavBar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Spoken English Tutor
          </h1>
          
          <p className="text-muted-foreground mb-8">
            Practice your spoken English with interactive exercises designed for students in grades 1-8.
          </p>

          {!isApiKeySet && (
            <div className="mb-8 p-4 bg-yellow-950/20 border border-yellow-800/30 rounded-xl">
              <h3 className="font-bold text-yellow-400 mb-2">OpenAI API Key Required</h3>
              <p className="text-sm text-yellow-400/80 mb-4">
                To use the Spoken English Tutor, you need to provide your OpenAI API key. This key remains in your browser and is never sent to our servers.
              </p>
              <ApiKeyInput onApiKeySubmit={handleApiKeyChange} />
            </div>
          )}

          {isApiKeySet && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-card rounded-2xl p-6 shadow-lg border-4 border-dashed border-kid-blue text-card-foreground">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Your Speech</h2>
                  <div className="flex space-x-2">
                    {!isRecording ? (
                      <Button
                        variant="outline"
                        className="rounded-full bg-kid-red text-white hover:bg-red-600"
                        onClick={startRecording}
                        disabled={isLoading}
                      >
                        <Mic className="h-5 w-5" />
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        className="rounded-full bg-gray-500 text-white hover:bg-gray-600"
                        onClick={stopRecording}
                      >
                        <MicOff className="h-5 w-5" />
                      </Button>
                    )}
                  </div>
                </div>
                
                <Textarea
                  placeholder="Your transcribed speech will appear here..."
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  className="min-h-[150px] border-2 border-input focus:border-kid-blue bg-muted text-foreground mb-4"
                  readOnly={isLoading}
                />
                
                <div className="flex justify-end">
                  <DoodleButton
                    color="blue"
                    onClick={handleSubmit}
                    loading={isLoading}
                    icon={<Send className="w-4 h-4" />}
                  >
                    Get Feedback
                  </DoodleButton>
                </div>
              </div>
              
              <div className="bg-card rounded-2xl p-6 shadow-lg border-4 border-dashed border-kid-green text-card-foreground">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Tutor's Response</h2>
                  <div className="flex space-x-2">
                    {!isSpeaking ? (
                      <Button
                        variant="outline"
                        className="rounded-full bg-kid-green text-white hover:bg-green-600"
                        onClick={() => useWebSpeech ? speakTextWithWebSpeech(response) : speakTextWithOpenAI(response)}
                        disabled={!response || isLoading}
                      >
                        <Play className="h-5 w-5" />
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        className="rounded-full bg-gray-500 text-white hover:bg-gray-600"
                        onClick={stopSpeaking}
                      >
                        <Square className="h-5 w-5" />
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="min-h-[150px] border-2 border-input rounded-md p-3 mb-4 overflow-y-auto bg-muted">
                  {response ? (
                    <p className="text-foreground">{response}</p>
                  ) : (
                    <p className="text-muted-foreground italic">
                      The tutor's response will appear here after you submit your speech.
                    </p>
                  )}
                </div>
                
                <div className="flex justify-center">
                  <DoodleDecoration type="cloud" color="green" size="md" />
                </div>
              </div>
            </div>
          )}
          
          {isApiKeySet && (
            <div className="bg-blue-950/20 p-6 rounded-xl mb-8 border border-blue-800/30">
              <h3 className="font-bold text-blue-400 mb-2">How to use the Spoken English Tutor</h3>
              <ol className="list-decimal pl-5 space-y-2 text-blue-400/80">
                <li>Click the microphone button and speak clearly in English.</li>
                <li>Click the stop button when you're finished speaking.</li>
                <li>Review your transcribed speech and click "Get Feedback".</li>
                <li>The tutor will provide feedback that you can read or listen to with OpenAI's realistic speech.</li>
                <li>Practice regularly to improve your pronunciation and grammar!</li>
              </ol>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SpokenEnglishPage;
