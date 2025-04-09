
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText } from 'lucide-react';
import LoadingState from '@/components/grammar/LoadingState';

interface PDFDisplayCardProps {
  pdfUrl: string | null;
  chapterContent: string;
  isLoading?: boolean;
}

const PDFDisplayCard: React.FC<PDFDisplayCardProps> = ({ 
  pdfUrl, 
  chapterContent, 
  isLoading = false 
}) => {
  if (!pdfUrl && !chapterContent && !isLoading) return null;
  
  if (isLoading) {
    return (
      <Card className="border-3 border-black shadow-neo-md">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Chapter Content</CardTitle>
          <CardDescription>Extracting text from PDF...</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <LoadingState message="Processing PDF..." size="sm" />
        </CardContent>
      </Card>
    );
  }
  
  return pdfUrl ? (
    <Card className="border-3 border-black shadow-neo-md">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Chapter PDF
        </CardTitle>
        <CardDescription>
          The uploaded PDF will be used to generate your study plan
        </CardDescription>
      </CardHeader>
      <CardContent>
        <iframe 
          src={pdfUrl} 
          className="w-full h-[400px] border-3 border-black rounded-md shadow-neo-sm"
          title="Chapter PDF"
        />
        {chapterContent && chapterContent.length > 0 && (
          <div className="mt-4">
            <p className="text-sm text-muted-foreground mb-2">
              PDF text extracted ({Math.round(chapterContent.length / 6)} words):
            </p>
            <ScrollArea className="h-[100px] w-full pr-4 border border-gray-200 rounded p-2">
              <p className="text-xs text-muted-foreground whitespace-pre-line">
                {chapterContent.slice(0, 500)}... 
                {chapterContent.length > 500 && " [content truncated for preview]"}
              </p>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  ) : (
    <Card className="border-3 border-black shadow-neo-md">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Chapter Content</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] w-full pr-4 border-3 border-black rounded-md shadow-neo-sm">
          <div className="p-4">
            {chapterContent ? (
              <p className="whitespace-pre-line">{chapterContent}</p>
            ) : (
              <p className="text-center text-muted-foreground">
                Upload a PDF to view the chapter content
              </p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default PDFDisplayCard;
