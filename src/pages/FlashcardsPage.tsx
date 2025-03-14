
import React, { useState } from 'react';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import { FileText, Upload, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const FlashcardsPage = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [flashcards, setFlashcards] = useState<Array<{question: string, answer: string}>>([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
    } else {
      toast.error('Please upload a PDF file');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfFile) {
      toast.error('Please select a PDF file first');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('pdf', pdfFile);
      
      // TODO: Implement API endpoint for PDF processing
      const response = await fetch('/api/generate-flashcards', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      setFlashcards(data.flashcards);
      toast.success('Flashcards generated successfully!');
    } catch (error) {
      console.error('Error generating flashcards:', error);
      toast.error('Failed to generate flashcards');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-1">
        <div className="page-container">
          <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
            <div className="md:w-3/5">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                <span className="flex items-center gap-2">
                  <FileText className="text-kid-blue" />
                  PDF Flashcard Generator
                </span>
              </h1>
              <p className="text-gray-700 mb-4">
                Upload a PDF and get AI-generated flashcards to help you study and memorize the content effectively.
              </p>
            </div>
            <div className="md:w-2/5 bg-kid-blue/10 p-4 rounded-xl border border-kid-blue/20">
              <div className="flex items-start gap-2">
                <HelpCircle className="text-kid-blue mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-kid-blue">How it works:</h3>
                  <p className="text-sm text-gray-600">
                    Upload your PDF study material, and our AI will analyze it to create targeted flashcards for better learning.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <form onSubmit={handleSubmit}>
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 mb-4">
                    <Upload className="w-12 h-12 text-gray-400 mb-4" />
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                      id="pdf-upload"
                    />
                    <label
                      htmlFor="pdf-upload"
                      className="cursor-pointer text-center"
                    >
                      <span className="text-kid-blue font-medium">Click to upload</span>
                      <span className="text-gray-500"> or drag and drop</span>
                      <p className="text-sm text-gray-500">PDF (max. 10MB)</p>
                    </label>
                  </div>
                  {pdfFile && (
                    <p className="text-sm text-gray-600 mb-4">
                      Selected file: {pdfFile.name}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={!pdfFile || loading}
                    className={cn(
                      "w-full py-2 px-4 rounded-lg font-medium transition-colors",
                      "bg-kid-blue text-white hover:bg-kid-blue/90",
                      "disabled:bg-gray-300 disabled:cursor-not-allowed"
                    )}
                  >
                    {loading ? 'Generating...' : 'Generate Flashcards'}
                  </button>
                </form>
              </div>
            </div>

            <div>
              <div className="bg-white rounded-xl shadow-sm border p-6 h-full">
                <h2 className="text-xl font-semibold mb-4">Your Flashcards</h2>
                {flashcards.length > 0 ? (
                  <div className="space-y-4">
                    {flashcards.map((card, index) => (
                      <div
                        key={index}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <h3 className="font-medium mb-2">Question {index + 1}:</h3>
                        <p className="text-gray-700 mb-3">{card.question}</p>
                        <h3 className="font-medium mb-2">Answer:</h3>
                        <p className="text-gray-700">{card.answer}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    Generated flashcards will appear here
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FlashcardsPage;
import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const FlashcardsPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [flashcards, setFlashcards] = useState<Array<{ question: string; answer: string }>>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    // TODO: Implement PDF processing logic here
    // For now, just show a sample flashcard
    setFlashcards([
      { question: "Sample Question", answer: "Sample Answer" }
    ]);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-1">
        <div className="page-container">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold">
              <span className="flex items-center gap-2">
                <FileText className="text-kid-green" />
                PDF Flashcards Generator
              </span>
            </h1>
          </div>

          <div className="max-w-xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="mb-4"
              />
              <Button 
                onClick={handleUpload}
                className="w-full bg-kid-green hover:bg-kid-green/90"
                disabled={!file}
              >
                Generate Flashcards
              </Button>
            </div>

            {flashcards.length > 0 && (
              <div className="mt-8 space-y-4">
                {flashcards.map((card, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="font-semibold">Question:</h3>
                    <p className="mb-2">{card.question}</p>
                    <h3 className="font-semibold">Answer:</h3>
                    <p>{card.answer}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FlashcardsPage;
