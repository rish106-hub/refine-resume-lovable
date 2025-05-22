
import * as pdfjs from 'pdfjs-dist';

// Need to set the worker path
const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export const extractTextFromPDF = async (file: File): Promise<string> => {
  try {
    // Convert the file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Load the PDF document
    const loadingTask = pdfjs.getDocument(arrayBuffer);
    const pdf = await loadingTask.promise;
    
    let fullText = '';
    
    // Iterate through each page
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      
      // Extract the text items and join them
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      
      fullText += pageText + '\n';
    }
    
    return fullText;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF. Please check the file and try again.');
  }
};
