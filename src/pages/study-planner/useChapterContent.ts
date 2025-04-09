
import { useState, useEffect } from 'react';
import { PDFService } from '@/services/pdfService';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useChapterContent = (
  selectedChapter: string, 
  selectedBook: string,
  setIsPdfProcessing?: (isProcessing: boolean) => void
) => {
  const [chapterContent, setChapterContent] = useState<string>("");
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [uploadedPDFs, setUploadedPDFs] = useState<Record<string, { file: File, url: string | null }>>({});

  useEffect(() => {
    if (selectedChapter) {
      const loadChapterContent = async () => {
        try {
          if (setIsPdfProcessing) setIsPdfProcessing(true);
          const chapterId = `${selectedBook}-${selectedChapter}`;
          
          if (uploadedPDFs[chapterId]) {
            const content = await PDFService.extractTextFromPDF(uploadedPDFs[chapterId].file);
            setChapterContent(content);
            setPdfUrl(uploadedPDFs[chapterId].url);
            if (setIsPdfProcessing) setIsPdfProcessing(false);
            return;
          }
          
          const pdfResponse = await PDFService.getPDF(chapterId);
          if (pdfResponse) {
            const blob = await pdfResponse.blob();
            const file = new File([blob], `${chapterId}.pdf`, { type: 'application/pdf' });
            
            const content = await PDFService.extractTextFromPDF(file);
            setChapterContent(content);
            
            const { data: { publicUrl } } = supabase.storage
              .from('chapter_pdfs')
              .getPublicUrl(`${chapterId}/${chapterId}.pdf`);
              
            setPdfUrl(publicUrl);
            
            setUploadedPDFs(prev => ({
              ...prev,
              [chapterId]: { file, url: publicUrl }
            }));
          } else {
            setChapterContent("No PDF uploaded for this chapter yet. Please upload a PDF to generate a study plan.");
            setPdfUrl(null);
          }
        } catch (error) {
          console.error('Error loading chapter content:', error);
          toast.error('Failed to load chapter content');
          setChapterContent("Error loading chapter content. Please try again.");
          setPdfUrl(null);
        } finally {
          if (setIsPdfProcessing) setIsPdfProcessing(false);
        }
      };
      
      loadChapterContent();
    }
  }, [selectedChapter, selectedBook, uploadedPDFs, setIsPdfProcessing]);

  const handleFileUpload = async (file: File, publicUrl: string | null) => {
    const chapterId = `${selectedBook}-${selectedChapter}`;
    if (file) {
      try {
        if (setIsPdfProcessing) setIsPdfProcessing(true);
        toast.info("Processing PDF...");
        
        setUploadedPDFs(prev => ({
          ...prev,
          [chapterId]: { file, url: publicUrl }
        }));
        setPdfUrl(publicUrl);
        
        const content = await PDFService.extractTextFromPDF(file);
        setChapterContent(content);
        
        toast.success(`PDF uploaded and processed for ${chapterId}`);
      } catch (error) {
        console.error("Error processing PDF:", error);
        toast.error("Failed to process PDF content");
      } finally {
        if (setIsPdfProcessing) setIsPdfProcessing(false);
      }
    }
  };

  return { chapterContent, pdfUrl, handleFileUpload };
};
