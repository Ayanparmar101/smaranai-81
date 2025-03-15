
import React, { useState, useRef, useEffect, useContext } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Mic, MicOff, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { openaiService } from '@/services/openaiService';
import ApiKeyInput from '@/components/ApiKeyInput';
import { ChapterPDFUploader } from '@/components/ChapterPDFUploader';
import { PDFService } from '@/services/pdfService';
import { AuthContext } from '@/App';
import { useNavigate } from 'react-router-dom';

// Class 8 English chapters data
const books = [
  {
    id: "honeydew",
    name: "Honeydew",
    chapters: [
      { id: "chapter1", name: "Chapter 1. The Best Christmas Present in the World" },
      { id: "chapter2", name: "Chapter 2. The Tsunami" },
      { id: "chapter3", name: "Chapter 3. Glimpses of the Past" },
      { id: "chapter4", name: "Chapter 4. Bepin Choudhury's Lapse of Memory" },
      { id: "chapter5", name: "Chapter 5. The Summit Within" },
      { id: "chapter6", name: "Chapter 6. This is Jody's Faun" },
      { id: "chapter7", name: "Chapter 7. A Visit to Cambridge" },
      { id: "chapter8", name: "Chapter 8. A Short Monsoon Diary" }
    ]
  },
  {
    id: "it-so-happened",
    name: "It So Happened",
    chapters: [
      { id: "chapter1", name: "Chapter 1. How the Camel got his hump" },
      { id: "chapter2", name: "Chapter 2. Children at work" },
      { id: "chapter3", name: "Chapter 3. The Selfish Giant" },
      { id: "chapter4", name: "Chapter 4. The Treasure within" },
      { id: "chapter5", name: "Chapter 5. Princess September" },
      { id: "chapter6", name: "Chapter 6. The Fight" },
      { id: "chapter7", name: "Chapter 7. Jalebis" },
      { id: "chapter8", name: "Chapter 8. Ancient Education System of India" }
    ]
  }
];

const classOptions = Array.from({ length: 8 }, (_, i) => ({ value: (i + 1).toString(), label: `Class ${i + 1}` }));

const TeacherPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState<string>("8");
  const [selectedBook, setSelectedBook] = useState<string>("honeydew");
  const [selectedChapter, setSelectedChapter] = useState<string>("");
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [chapterContent, setChapterContent] = useState<string>("");
  const [uploadedPDFs, setUploadedPDFs] = useState<Record<string, { file: File, url: string | null }>>({});
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const answerRef = useRef<HTMLDivElement>(null);

  // Check if user is logged in when accessing the page
  useEffect(() => {
    if (!user) {
      toast.error('Please sign in to access the teacher features');
      navigate('/auth');
    }
  }, [user, navigate]);

  // Handle API key setup
  const handleApiKeySubmit = (apiKey: string) => {
    openaiService.setApiKey(apiKey);
  };

  // Initialize speech recognition
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      if (recognitionRef.current) {
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        
        recognitionRef.current.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');
          
          setQuestion(transcript);
        };
        
        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          toast.error(`Speech recognition error: ${event.error}`);
        };
        
        recognitionRef.current.onend = () => {
          if (isListening) {
            try {
              recognitionRef.current?.start();
            } catch (error) {
              console.error('Failed to restart speech recognition', error);
            }
          }
        };
      }
    } else {
      toast.error('Speech recognition is not supported in this browser');
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
        
        if (isListening) {
          try {
            recognitionRef.current.stop();
          } catch (error) {
            console.error('Error stopping speech recognition:', error);
          }
        }
      }
    };
  }, [isListening]);

  // Toggle speech recognition
  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast.error('Speech recognition is not supported in this browser');
      return;
    }
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        toast.error('Failed to start speech recognition');
      }
    }
  };

  // Load chapter content when a chapter is selected
  useEffect(() => {
    if (selectedChapter) {
      const loadChapterContent = async () => {
        try {
          const chapterId = `${selectedBook}-${selectedChapter}`;
          
          // Check if we have the PDF in our uploadedPDFs state
          if (uploadedPDFs[chapterId]) {
            const content = await PDFService.extractTextFromPDF(uploadedPDFs[chapterId].file);
            setChapterContent(content);
            return;
          }
          
          // If not, try to get it from Supabase storage
          const pdfResponse = await PDFService.getPDF(chapterId);
          if (pdfResponse) {
            // Convert the response to a file
            const blob = await pdfResponse.blob();
            const file = new File([blob], `${chapterId}.pdf`, { type: 'application/pdf' });
            
            // Extract text and update state
            const content = await PDFService.extractTextFromPDF(file);
            setChapterContent(content);
            
            // Update uploadedPDFs state
            const { data: { publicUrl } } = supabase.storage
              .from('chapter_pdfs')
              .getPublicUrl(`${chapterId}/${chapterId}.pdf`);
              
            setUploadedPDFs(prev => ({
              ...prev,
              [chapterId]: { file, url: publicUrl }
            }));
          } else {
            // No PDF found
            setChapterContent("No PDF uploaded for this chapter yet. Please upload a PDF to view content.");
          }
        } catch (error) {
          console.error('Error loading chapter content:', error);
          toast.error('Failed to load chapter content');
          setChapterContent("Error loading chapter content. Please try again.");
        }
      };
      
      loadChapterContent();
    }
  }, [selectedChapter, selectedBook, uploadedPDFs]);

  // Ask a question about the chapter
  const askQuestion = async () => {
    if (!question.trim()) {
      toast.error('Please enter a question');
      return;
    }
    
    if (!openaiService.getApiKey()) {
      toast.error('Please set your OpenAI API key first');
      return;
    }
    
    if (!chapterContent) {
      toast.error('No chapter content loaded. Please upload a PDF for this chapter.');
      return;
    }
    
    setIsLoading(true);
    setAnswer("");
    
    try {
      const book = books.find(b => b.id === selectedBook);
      const chapter = book?.chapters.find(c => c.id === selectedChapter);
      
      const systemPrompt = `You are a helpful, educational assistant specializing in English literature for Class ${selectedClass} students. 
      You will answer questions about the chapter "${chapter?.name}" based on the provided content. 
      Be thorough but keep your explanations at an appropriate level for the student's grade. 
      Always base your responses on the provided chapter content.`;
      
      // Use streaming to show answer as it's generated
      await openaiService.createCompletion(
        systemPrompt,
        `Chapter Content: ${chapterContent}\n\nQuestion: ${question}`,
        {
          stream: true,
          onChunk: (chunk) => {
            setAnswer(prev => prev + chunk);
            if (answerRef.current) {
              answerRef.current.scrollTop = answerRef.current.scrollHeight;
            }
          }
        }
      );
    } catch (error) {
      console.error('Error getting answer:', error);
      toast.error('Failed to get answer. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle file upload
  const handleFileUpload = (file: File, publicUrl: string | null) => {
    const chapterId = `${selectedBook}-${selectedChapter}`;
    if (file) {
      setUploadedPDFs(prev => ({
        ...prev,
        [chapterId]: { file, url: publicUrl }
      }));
      toast.success(`PDF uploaded for ${chapterId}`);
      
      // Update chapter content with extracted text
      PDFService.extractTextFromPDF(file).then(content => {
        setChapterContent(content);
      });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">Teacher</CardTitle>
            <CardDescription>
              Select your class and chapter, then ask questions about the content.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <Label htmlFor="class-select">Select Class</Label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger id="class-select">
                    <SelectValue placeholder="Select Class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="book-select">Select Book</Label>
                <Select value={selectedBook} onValueChange={setSelectedBook}>
                  <SelectTrigger id="book-select">
                    <SelectValue placeholder="Select Book" />
                  </SelectTrigger>
                  <SelectContent>
                    {books.map(book => (
                      <SelectItem key={book.id} value={book.id}>
                        {book.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="chapter-select">Select Chapter</Label>
                <Select 
                  value={selectedChapter} 
                  onValueChange={setSelectedChapter}
                  disabled={!selectedBook}
                >
                  <SelectTrigger id="chapter-select">
                    <SelectValue placeholder="Select Chapter" />
                  </SelectTrigger>
                  <SelectContent>
                    {books.find(b => b.id === selectedBook)?.chapters.map(chapter => (
                      <SelectItem key={chapter.id} value={chapter.id}>
                        {chapter.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between items-center">
                <ApiKeyInput onApiKeySubmit={handleApiKeySubmit} />
                
                {selectedChapter && (
                  <ChapterPDFUploader 
                    onFileUpload={handleFileUpload}
                    chapterId={`${selectedBook}-${selectedChapter}`}
                  />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="h-[500px] flex flex-col">
            <CardHeader>
              <CardTitle className="text-xl">Chapter Content</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
              <ScrollArea className="h-[380px] w-full pr-4">
                {chapterContent ? (
                  <div className="prose max-w-none">
                    {chapterContent}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground p-4">
                    <p>Select a chapter and upload a PDF to view content</p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
          
          <Card className="h-[500px] flex flex-col">
            <CardHeader>
              <CardTitle className="text-xl">Ask Questions</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="flex items-center space-x-2 mb-4">
                <Textarea
                  placeholder="Type your question about the chapter..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  variant={isListening ? "destructive" : "secondary"}
                  size="icon"
                  onClick={toggleListening}
                  className="flex-shrink-0"
                  title={isListening ? "Stop speaking" : "Start speaking"}
                >
                  {isListening ? <MicOff /> : <Mic />}
                </Button>
              </div>
              
              <Button 
                onClick={askQuestion} 
                disabled={!selectedChapter || isLoading || !question.trim()}
                className="mb-4"
              >
                {isLoading ? "Thinking..." : "Ask Question"}
              </Button>
              
              <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-[250px] w-full pr-4" ref={answerRef}>
                  <div className="prose max-w-none">
                    {answer ? answer : (
                      <div className="text-center text-muted-foreground p-4">
                        <p>Your answer will appear here</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default TeacherPage;
