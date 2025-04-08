
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Book, Brain } from 'lucide-react';
import ChapterSelector from '../teacher/ChapterSelector';
import DoodleButton from '@/components/DoodleButton';
import { ChapterPDFUploader } from '@/components/ChapterPDFUploader';

interface ChapterSelectionCardProps {
  selectedClass: string;
  setSelectedClass: (value: string) => void;
  selectedBook: string;
  setSelectedBook: (value: string) => void;
  selectedChapter: string;
  setSelectedChapter: (value: string) => void;
  generateStudyPlan: () => void;
  isGenerating: boolean;
  handleFileUpload: (file: File, publicUrl: string | null) => void;
}

const ChapterSelectionCard: React.FC<ChapterSelectionCardProps> = ({
  selectedClass,
  setSelectedClass,
  selectedBook,
  setSelectedBook,
  selectedChapter,
  setSelectedChapter,
  generateStudyPlan,
  isGenerating,
  handleFileUpload
}) => {
  return (
    <Card className="border-3 border-black shadow-neo-md">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Book className="w-5 h-5 text-[#5B86E5]" />
          Select Chapter
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChapterSelector
          selectedClass={selectedClass}
          setSelectedClass={setSelectedClass}
          selectedBook={selectedBook}
          setSelectedBook={setSelectedBook}
          selectedChapter={selectedChapter}
          setSelectedChapter={setSelectedChapter}
        />
        
        {selectedChapter && (
          <div className="mt-4 flex justify-between items-center">
            <ChapterPDFUploader 
              onFileUpload={handleFileUpload}
              chapterId={`${selectedBook}-${selectedChapter}`}
            />
            <DoodleButton 
              onClick={generateStudyPlan}
              loading={isGenerating}
              icon={<Brain size={18} />}
              disabled={isGenerating}
            >
              {isGenerating ? "Generating Plan..." : "Generate Study Plan"}
            </DoodleButton>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ChapterSelectionCard;
