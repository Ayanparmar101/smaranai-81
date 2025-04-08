
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { PDFService } from '@/services/pdfService';
import { supabase } from '@/integrations/supabase/client';

export function useChapterPDF(selectedBook: string, selectedChapter: string) {
  const [chapterContent, setChapterContent] = useState<string>("");
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [uploadedPDFs, setUploadedPDFs] = useState<Record<string, { file: File, url: string | null }>>({});

  useEffect(() => {
    if (selectedChapter) {
      const loadChapterContent = async () => {
        try {
          const chapterId = `${selectedBook}-${selectedChapter}`;
          
          if (uploadedPDFs[chapterId]) {
            const content = await PDFService.extractTextFromPDF(uploadedPDFs[chapterId].file);
            setChapterContent(content);
            setPdfUrl(uploadedPDFs[chapterId].url);
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
            setChapterContent("No PDF uploaded for this chapter yet. Please upload a PDF to view content.");
            setPdfUrl(null);
          }
        } catch (error) {
          console.error('Error loading chapter content:', error);
          toast.error('Failed to load chapter content');
          setChapterContent("Error loading chapter content. Please try again.");
          setPdfUrl(null);
        }
      };
      
      loadChapterContent();
    }
  }, [selectedChapter, selectedBook, uploadedPDFs]);

  const handleFileUpload = (file: File, publicUrl: string | null) => {
    const chapterId = `${selectedBook}-${selectedChapter}`;
    if (file) {
      setUploadedPDFs(prev => ({
        ...prev,
        [chapterId]: { file, url: publicUrl }
      }));
      setPdfUrl(publicUrl);
      toast.success(`PDF uploaded for ${chapterId}`);
      
      PDFService.extractTextFromPDF(file).then(content => {
        setChapterContent(content);
      });
    }
  };

  return { chapterContent, pdfUrl, handleFileUpload };
}
