
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ChapterContentProps {
  chapterContent: string;
  pdfUrl: string | null;
}

const ChapterContent: React.FC<ChapterContentProps> = ({ chapterContent, pdfUrl }) => {
  return (
    <Card className="h-[500px] flex flex-col neo-card">
      <CardHeader>
        <CardTitle className="text-xl">Chapter Content</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        {pdfUrl ? (
          <iframe 
            src={pdfUrl} 
            className="w-full h-[380px] border-3 border-black rounded-md shadow-neo-sm"
            title="Chapter PDF"
          />
        ) : (
          <ScrollArea className="h-[380px] w-full pr-4 border-3 border-black rounded-md shadow-neo-sm">
            {chapterContent ? (
              <div className="prose max-w-none p-4">
                {chapterContent}
              </div>
            ) : (
              <div className="text-center text-muted-foreground p-4">
                <p>Select a chapter and upload a PDF to view content</p>
              </div>
            )}
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default ChapterContent;
