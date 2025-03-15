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

const SpokenEnglishPage = () => {
  const [isApiKeySet, setIsApiKeySet] = useState(!!openaiService.getApiKey() || !!localStorage.getItem('openai-api-key'));
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
  const handleApiKeyChange = (key: string) => {
    openaiService.setApiKey(key);
    localStorage.setItem('openai-api-key', key);
    setIsApiKeySet(!!key);
    toast.success('API key saved');
  };
  
  useEffect(() => {
    // Check if API key is in localStorage and set it
    const savedKey = localStorage.getItem('openai-api-key');
    if (savedKey && !openaiService.getApiKey()) {
      openaiService.setApiKey(savedKey);
      setIsApiKeySet(true);
    }
  }, []);
  
  const startRecording = async () => {
    try {
      // First try using Web Speech API for transcription
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        console.log("Using Web Speech API for transcription");
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
        
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';
        
        recognitionRef.current.onstart = () => {
          setIsRecording(true);
          setTranscript('');
          toast.success('Recording started');
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
          console.error('Speech recognition error:', event.error);
          toast.error(`Speech recognition error: ${event.error}`);
        };
        
        recognitionRef.current.onend = () => {
          setIsRecording(false);
        };
        
        recognitionRef.current.start();
        return;
      }
      
      // Fallback to MediaRecorder API if Web Speech API is not available
      console.log("Falling back to MediaRecorder API");
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
          // Here we would normally use the Whisper API to transcribe
          // For now, we'll just use a placeholder since we already have Web Speech API
          setTranscript('(Please use Web Speech API transcription)');
          setIsLoading(false);
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
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
      toast.success('Recording stopped');
      return;
    }
    
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast.success('Recording stopped');
      
      // Stop all audio tracks
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };
  
  const handleSubmit = async () => {
    if (!transcript.trim()) {
      toast.error('Please record something first');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const savedKey = localStorage.getItem('openai-api-key');
      if (savedKey && !openaiService.getApiKey()) {
        openaiService.setApiKey(savedKey);
      }
      
      const systemPrompt = `You are a helpful English tutor specializing in teaching young students (grades 1-8). 
      Your responses should be encouraging, simple, and educational. 
      Correct any grammar or pronunciation mistakes in the student's speech, 
      but do it in a gentle, supportive way. Provide examples and explanations when needed. 
      Keep responses under 150 words and appropriate for children. Make sure your answers are detailed, informative and helpful.`;
      
      const result = await openaiService.createCompletion(systemPrompt, transcript);
      setResponse(result);
      
      // Speak the response
      speakText(result);
    } catch (error) {
      console.error('Error getting response:', error);
      toast.error('Failed to get a response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const speakText = (text: string) => {
    // Using the Web Speech API for text-to-speech
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9; // Slightly slower than normal
      
      // Get all available voices
      const voices = window.speechSynthesis.getVoices();
      
      // Try to find a female English voice
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
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };
  
  useEffect(() => {
    // Initialize voices
    if ('speechSynthesis' in window) {
      // Load voices
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
    
    // Cleanup on unmount
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
      
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Spoken English Tutor
          </h1>
          
          <p className="text-gray-700 mb-8">
            Practice your spoken English with interactive exercises designed for students in grades 1-8.
          </p>

          {!isApiKeySet && (
            <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <h3 className="font-bold text-yellow-800 mb-2">OpenAI API Key Required</h3>
              <p className="text-sm text-yellow-700 mb-4">
                To use the Spoken English Tutor, you need to provide your OpenAI API key. This key remains in your browser and is never sent to our servers.
              </p>
              <ApiKeyInput onApiKeySubmit={handleApiKeyChange} />
            </div>
          )}

          {isApiKeySet && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-2xl p-6 shadow-lg border-4 border-dashed border-kid-blue">
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
                  className="min-h-[150px] border-2 border-gray-200 focus:border-kid-blue mb-4"
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
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border-4 border-dashed border-kid-green">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Tutor's Response</h2>
                  <div className="flex space-x-2">
                    {!isSpeaking ? (
                      <Button
                        variant="outline"
                        className="rounded-full bg-kid-green text-white hover:bg-green-600"
                        onClick={() => speakText(response)}
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
                
                <div className="min-h-[150px] border-2 border-gray-200 rounded-md p-3 mb-4 overflow-y-auto">
                  {response ? (
                    <p className="text-gray-800">{response}</p>
                  ) : (
                    <p className="text-gray-400 italic">
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
            <div className="bg-blue-50 p-6 rounded-xl mb-8">
              <h3 className="font-bold text-blue-800 mb-2">How to use the Spoken English Tutor</h3>
              <ol className="list-decimal pl-5 space-y-2 text-blue-700">
                <li>Click the microphone button and speak clearly in English.</li>
                <li>Click the stop button when you're finished speaking.</li>
                <li>Review your transcribed speech and click "Get Feedback".</li>
                <li>The tutor will provide feedback that you can read or listen to.</li>
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
