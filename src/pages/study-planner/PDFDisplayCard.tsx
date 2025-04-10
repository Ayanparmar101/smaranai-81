
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle, 
  CardDescription
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, AlertTriangle, Sparkles } from 'lucide-react';
import LoadingState from '@/components/grammar/LoadingState';

interface PDFDisplayCardProps {
  pdfUrl?: string;
  chapterContent?: string;
  onReset?: () => void;
  isLoading?: boolean;
}

const PDFDisplayCard = ({ 
  pdfUrl, 
  chapterContent = "", 
  onReset,
  isLoading = false 
}) => {
  if (!pdfUrl && !chapterContent && !isLoading) return null;
  
  const isError = chapterContent?.includes("Error extracting text");
  const isOCR = chapterContent?.length > 0 && !isError && !chapterContent?.includes("Page 1");
  
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Processing PDF</CardTitle>
          <CardDescription>Please wait while we extract the text from your PDF...</CardDescription>
        </CardHeader>
        <CardContent>
          <LoadingState />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>PDF Preview</CardTitle>
        <CardDescription>The text extracted from your PDF will be used to generate a study plan</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-5 w-5 text-blue-500" />
          <a 
            href={pdfUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 underline"
          >
            View Original PDF
          </a>
        </div>
        {chapterContent && chapterContent.length > 0 && (
          <div className="mt-4">
            {isError ? (
              <div className="p-4 border border-red-300 bg-red-50 rounded-md flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-red-700">PDF Text Extraction Failed</p>
                  <p className="text-sm text-red-600 mt-1">
                    {chapterContent}. Try uploading a different PDF file that contains selectable text.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">
                    PDF text extracted ({Math.round(chapterContent.length / 6)} words)
                  </p>
                  {isOCR && (
                    <div className="flex items-center gap-1 bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                      <Sparkles className="h-3 w-3" />
                      <span>OCR Processed</span>
                    </div>
                  )}
                </div>
                <ScrollArea className="h-[100px] w-full pr-4 border border-gray-200 rounded p-2">
                  <p className="text-xs text-muted-foreground whitespace-pre-line">
                    {chapterContent.slice(0, 500)}... 
                    {chapterContent.length > 500 && " [content truncated for preview]"}
                  </p>
                </ScrollArea>
              </>
            )}
          </div>
        )}
      </CardContent>
      {onReset && (
        <CardFooter>
          <Button onClick={onReset} variant="outline">Upload a Different PDF</Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default PDFDisplayCard;
