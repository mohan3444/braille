export async function extractTextFromFile(file: File): Promise<string> {
  if (file.type === 'text/plain') {
    return file.text();
  }

  throw new Error('Currently supporting TXT files. PDF support coming soon.');
}

export function validateFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const supportedTypes = ['text/plain'];

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File size exceeds 10MB limit'
    };
  }

  if (!supportedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Please upload a TXT file'
    };
  }

  return { valid: true };
}
