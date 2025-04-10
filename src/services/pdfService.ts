
import { supabase } from "@/integrations/supabase/client";
import * as pdfjs from 'pdfjs-dist';

// Set the worker source using the exact matching version (3.4.120)
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js`;

class PDFServiceClass {
  async extractTextFromPDF(file: File): Promise<string> {
    try {
      // First try standard text extraction
      const text = await this.standardPDFExtraction(file);
      
      // If we got meaningful text, return it
      if (text && text.trim().length > 50) {
        return text;
      }
      
      // Otherwise, try OCR
      console.log("Standard PDF extraction yielded little text, trying OCR...");
      return await this.ocrPDFExtraction(file);
    } catch (error) {
      console.error("Error extracting text from PDF:", error);
      return `Error extracting text from PDF: ${error.message}. This may be due to the PDF being scanned or containing images instead of text.`;
    }
  }

  private async standardPDFExtraction(file: File): Promise<string> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n\n';
      }

      return fullText;
    } catch (error) {
      console.error("Error in standard PDF extraction:", error);
      throw error;
    }
  }

  private async ocrPDFExtraction(file: File): Promise<string> {
    try {
      // Create a FormData object to send the PDF
      const formData = new FormData();
      formData.append('pdf', file);

      // Call our Supabase Edge Function for OCR
      const response = await fetch(`${supabase.supabaseUrl}/functions/v1/ocr-pdf`, {
        method: 'POST',
        headers: {
          // Use the anon key instead of accessing protected properties
          'Authorization': `Bearer ${supabase.auth.anon.key}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OCR failed: ${errorData.error || response.statusText}`);
      }

      const data = await response.json();
      return data.text || "No text could be extracted via OCR.";
    } catch (error) {
      console.error("Error in OCR PDF extraction:", error);
      throw error;
    }
  }

  async uploadPDF(file: File, userId: string): Promise<string> {
    const timestamp = new Date().getTime();
    const filePath = `${userId}/${timestamp}_${file.name}`;
    
    const { data, error } = await supabase.storage
      .from('pdfs')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error('Error uploading PDF:', error);
      throw new Error(`Failed to upload PDF: ${error.message}`);
    }
    
    const { data: { publicUrl } } = supabase.storage
      .from('pdfs')
      .getPublicUrl(filePath);
    
    return publicUrl;
  }

  // Add the missing getPDF method
  async getPDF(chapterId: string): Promise<Response | null> {
    try {
      // Try to fetch the PDF from storage
      const { data, error } = await supabase.storage
        .from('chapter_pdfs')
        .download(`${chapterId}/${chapterId}.pdf`);
        
      if (error) {
        console.error('Error fetching PDF:', error);
        return null;
      }
      
      return new Response(data);
    } catch (error) {
      console.error('Error in getPDF:', error);
      return null;
    }
  }
}

export const PDFService = new PDFServiceClass();
