
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PDFDisplayCardProps {
  pdfUrl: string | null;
  chapterContent: string;
}

const PDFDisplayCard: React.FC<PDFDisplayCardProps> = ({ pdfUrl, chapterContent }) => {
  if (!pdfUrl && !chapterContent) return null;
  
  return pdfUrl ? (
    <Card className="border-3 border-black shadow-neo-md">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Chapter PDF</CardTitle>
      </CardHeader>
      <CardContent>
        <iframe 
          src={pdfUrl} 
          className="w-full h-[400px] border-3 border-black rounded-md shadow-neo-sm"
          title="Chapter PDF"
        />
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
