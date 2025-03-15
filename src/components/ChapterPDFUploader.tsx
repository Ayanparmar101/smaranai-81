
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';
import { PDFService } from '@/services/pdfService';

interface ChapterPDFUploaderProps {
  onFileUpload: (file: File, publicUrl: string | null) => void;
  chapterId: string;
}

export const ChapterPDFUploader: React.FC<ChapterPDFUploaderProps> = ({ onFileUpload, chapterId }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [open, setOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check if the file is a PDF
      if (file.type !== 'application/pdf') {
        toast.error('Please upload a PDF file');
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (selectedFile) {
      setIsUploading(true);
      try {
        // Upload to Supabase storage
        const publicUrl = await PDFService.uploadPDF(selectedFile, chapterId);
        
        // Notify parent component
        onFileUpload(selectedFile, publicUrl);
        
        setOpen(false);
        setSelectedFile(null);
      } catch (error) {
        console.error("Error during upload:", error);
        toast.error('Failed to upload PDF');
      } finally {
        setIsUploading(false);
      }
    } else {
      toast.error('Please select a file first');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          <span>Upload PDF for Chapter</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Chapter PDF</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="pdf-upload">
              Upload PDF file for {chapterId}
            </Label>
            <Input
              id="pdf-upload"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
            />
            {selectedFile && (
              <p className="text-sm text-muted-foreground">
                Selected: {selectedFile.name}
              </p>
            )}
          </div>
        </div>
        <Button 
          onClick={handleUpload} 
          disabled={!selectedFile || isUploading}
          className="w-full"
        >
          {isUploading ? 'Uploading...' : 'Upload'}
        </Button>
      </DialogContent>
    </Dialog>
  );
};
