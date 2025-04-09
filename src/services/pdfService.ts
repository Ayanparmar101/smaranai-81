
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import * as pdfjs from 'pdfjs-dist';

// Set the worker source
const pdfjsWorker = `https://unpkg.com/pdfjs-dist@3.4.120/legacy/build/pdf.worker.min.js`;
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

class PDFServiceClass {
  async extractTextFromPDF(file: File): Promise<string> {
    try {
      // Read the file as an ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      
      // Load the PDF document
      const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      
      let fullText = '';
      
      // Extract text from each page
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => 'str' in item ? item.str : '').join(' ');
        fullText += pageText + '\n\n';
      }
      
      if (fullText.trim().length === 0) {
        return `[PDF appears to be scanned or contain no extractable text. Please upload a text-based PDF.]`;
      }
      
      return fullText;
    } catch (error) {
      console.error("Error extracting text from PDF:", error);
      toast.error("Failed to extract text from PDF");
      return "Error extracting text from PDF. Please try again with a different PDF.";
    }
  }
  
  // This method uploads a PDF to Supabase storage
  async uploadPDF(file: File, chapterId: string): Promise<string | null> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${chapterId}.${fileExt}`;
      const filePath = `${chapterId}/${fileName}`;
      
      // Upload file to Supabase storage
      const { data, error } = await supabase.storage
        .from('chapter_pdfs')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (error) {
        console.error("Error uploading PDF:", error);
        toast.error(`Failed to upload PDF: ${error.message}`);
        return null;
      }
      
      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('chapter_pdfs')
        .getPublicUrl(filePath);
      
      toast.success("PDF uploaded successfully!");
      return publicUrl;
    } catch (error) {
      console.error("Error uploading PDF:", error);
      toast.error("Failed to upload PDF");
      return null;
    }
  }
  
  // This method retrieves a PDF from Supabase storage
  async getPDF(chapterId: string): Promise<Response | null> {
    try {
      // Check if PDF exists
      const { data: files, error } = await supabase.storage
        .from('chapter_pdfs')
        .list(`${chapterId}`);
      
      if (error || !files || files.length === 0) {
        console.error("PDF not found:", error);
        return null;
      }
      
      // Get the public URL
      const filePath = `${chapterId}/${files[0].name}`;
      const { data: { publicUrl } } = supabase.storage
        .from('chapter_pdfs')
        .getPublicUrl(filePath);
      
      // Fetch the PDF
      const response = await fetch(publicUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch PDF');
      }
      
      return response;
    } catch (error) {
      console.error("Error getting PDF:", error);
      return null;
    }
  }
  
  // This method would be used with the OpenAI API to perform OCR on the PDF
  async performOCRWithOpenAI(file: File, apiKey: string): Promise<string> {
    try {
      // Convert PDF to base64
      const arrayBuffer = await file.arrayBuffer();
      const base64 = this.arrayBufferToBase64(arrayBuffer);
      
      // In a real implementation, you would:
      // 1. Call OpenAI's API with the PDF data
      // 2. Process the response to extract the text
      
      // This is a placeholder for now
      return "OCR processed content would appear here.";
    } catch (error) {
      console.error("Error performing OCR with OpenAI:", error);
      toast.error("Failed to perform OCR");
      return "Error performing OCR. Please try again.";
    }
  }
  
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }
}

export const PDFService = new PDFServiceClass();
