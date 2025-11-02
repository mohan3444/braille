import { extractFirstLineFromPDF, extractTextFromImage } from './pdf-ocr-handler';

export async function extractTextFromFile(file: File): Promise<string> {
  if (file.type === 'text/plain') {
    return file.text();
  }

  if (file.type === 'application/pdf') {
    return extractFirstLineFromPDF(file);
  }

  if (file.type.startsWith('image/')) {
    return extractTextFromImage(file);
  }

  throw new Error('Unsupported file type. Please upload TXT, PDF, or image files.');
}

export function validateFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 10 * 1024 * 1024;
  const supportedTypes = ['text/plain', 'application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File size exceeds 10MB limit'
    };
  }

  if (!supportedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Please upload TXT, PDF, or image files'
    };
  }

  return { valid: true };
}
