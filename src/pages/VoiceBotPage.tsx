
import React, { useState, useEffect, useRef } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import ApiKeyInput from '@/components/ApiKeyInput';
import { openaiService } from '@/services/openaiService';
import { toast } from 'sonner';
import DoodleDecoration from '@/components/DoodleDecoration';
import { Mic, MicOff, Play, Square, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DoodleButton from '@/components/DoodleButton';

const VoiceBotPage = () => {
  const [isApiKeySet, setIsApiKeySet] = useState(!!openaiService.getApiKey());
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [botResponse, setBotResponse] = useState('');
  const [conversation, setConversation] = useState<Array<{role: 'user' | 'bot', text: string}>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  
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
          // Here we would normally use the Whisper API to transcribe
          // For this demo, we'll use the Web Speech API
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
      
      // Stop all audio tracks
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };
  
  const recognizeSpeech = (audioBlob: Blob) => {
    // For demo purposes, we're using the Web Speech API
    // In a real implementation, we would use Whisper API here
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    
    recognition.onresult = (event) => {
      const result = event.results[0][0].transcript;
      setTranscript(result);
      
      // Automatically send the transcript to get a response
      handleSpeechProcessed(result);
    };
    
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      toast.error('Failed to recognize speech. Please try again.');
      setIsLoading(false);
    };
    
    recognition.start();
  };
  
  const handleSpeechProcessed = async (text: string) => {
    if (!text.trim()) {
      setIsLoading(false);
      return;
    }
    
    // Add user message to conversation
    const updatedConversation = [
      ...conversation,
      { role: 'user', text }
    ];
    setConversation(updatedConversation);
    
    try {
      // Get bot response
      const systemPrompt = `You are a helpful English conversation partner for children in grades 1-8. 
      Speak naturally and engage in a friendly conversation. 
      Keep your responses short (2-3 sentences) and use simple language suitable for children.
      Be encouraging and supportive. If the child makes grammar mistakes, subtly model the correct form without explicitly correcting them.`;
      
      // Build conversation context from history
      const conversationContext = updatedConversation
        .slice(-5) // Get last 5 messages for context
        .map(msg => `${msg.role === 'user' ? 'Child' : 'You'}: ${msg.text}`)
        .join('\n');
      
      const userMessage = `The conversation so far:\n${conversationContext}\n\nRespond to the child's last message.`;
      
      const result = await openaiService.createCompletion(systemPrompt, userMessage);
      setBotResponse(result);
      
      // Add bot response to conversation
      setConversation([
        ...updatedConversation,
        { role: 'bot', text: result }
      ]);
      
      // Speak the response
      speakText(result);
    } catch (error) {
      console.error('Error getting bot response:', error);
      toast.error('Failed to get a response. Please try again.');
    } finally {
      setIsLoading(false);
      setTranscript('');
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
  
  const startNewConversation = () => {
    setConversation([]);
    setBotResponse('');
    setTranscript('');
    toast.success('Started a new conversation');
  };
  
  useEffect(() => {
    // Initialize speech recognition
    if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
      toast.error('Speech recognition is not supported in your browser.');
    }
    
    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      // Load voices
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
    
    // Add initial bot greeting if conversation is empty
    if (isApiKeySet && conversation.length === 0) {
      setBotResponse("Hi there! I'm your English conversation buddy. What would you like to talk about today?");
      setConversation([
        { role: 'bot', text: "Hi there! I'm your English conversation buddy. What would you like to talk about today?" }
      ]);
    }
    
    // Cleanup on unmount
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
      
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isApiKeySet, conversation.length]);

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Voice Chat Bot
          </h1>
          
          <p className="text-gray-700 mb-8">
            Talk with an AI assistant that listens to your voice and responds to help you practice English conversation.
          </p>

          {!isApiKeySet && (
            <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <h3 className="font-bold text-yellow-800 mb-2">OpenAI API Key Required</h3>
              <p className="text-sm text-yellow-700 mb-4">
                To use the Voice Chat Bot, you need to provide your OpenAI API key. This key remains in your browser and is never sent to our servers.
              </p>
              <ApiKeyInput onApiKeySubmit={handleApiKeyChange} />
            </div>
          )}

          {isApiKeySet && (
            <>
              <div className="bg-white rounded-2xl p-6 shadow-lg border-4 border-dashed border-kid-orange mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Conversation</h2>
                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={startNewConversation}
                    >
                      <RefreshCw className="h-4 w-4" />
                      New Conversation
                    </Button>
                  </div>
                </div>
                
                <div className="min-h-[300px] bg-gray-50 rounded-xl p-4 mb-6 overflow-y-auto">
                  {conversation.length > 0 ? (
                    <div className="space-y-4">
                      {conversation.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div 
                            className={`max-w-[80%] rounded-2xl p-3 ${
                              msg.role === 'user' 
                                ? 'bg-kid-blue text-white'
                                : 'bg-gray-200 text-gray-800'
                            }`}
                          >
                            <p>{msg.text}</p>
                          </div>
                        </div>
                      ))}
                      {isLoading && (
                        <div className="flex justify-start">
                          <div className="bg-gray-200 text-gray-800 rounded-2xl p-3">
                            <p>Thinking...</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-gray-400">Your conversation will appear here.</p>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-center gap-4">
                  {!isRecording ? (
                    <DoodleButton
                      color="red"
                      onClick={startRecording}
                      disabled={isLoading}
                      icon={<Mic className="w-4 h-4" />}
                    >
                      Start Speaking
                    </DoodleButton>
                  ) : (
                    <DoodleButton
                      color="gray"
                      onClick={stopRecording}
                      icon={<MicOff className="w-4 h-4" />}
                    >
                      Stop Speaking
                    </DoodleButton>
                  )}
                  
                  {!isSpeaking && botResponse ? (
                    <DoodleButton
                      color="green"
                      onClick={() => speakText(botResponse)}
                      disabled={isLoading}
                      icon={<Play className="w-4 h-4" />}
                    >
                      Play Response
                    </DoodleButton>
                  ) : isSpeaking && (
                    <DoodleButton
                      color="gray"
                      onClick={stopSpeaking}
                      icon={<Square className="w-4 h-4" />}
                    >
                      Stop Audio
                    </DoodleButton>
                  )}
                </div>
              </div>
              
              <div className="bg-blue-50 p-6 rounded-xl mb-8">
                <h3 className="font-bold text-blue-800 mb-2">How to use the Voice Chat Bot</h3>
                <ol className="list-decimal pl-5 space-y-2 text-blue-700">
                  <li>Click "Start Speaking" and talk clearly in English.</li>
                  <li>The bot will listen, understand, and respond to you.</li>
                  <li>You can hear the bot's response by clicking "Play Response".</li>
                  <li>Continue the conversation by speaking again.</li>
                  <li>Click "New Conversation" at any time to start over.</li>
                </ol>
              </div>
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default VoiceBotPage;
