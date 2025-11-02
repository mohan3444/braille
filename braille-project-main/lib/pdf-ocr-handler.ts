export async function extractFirstLineFromPDF(file: File): Promise<string> {
  try {
    const pdfjsLib = await import('pdfjs-dist');
    const Tesseract = await import('tesseract.js');

    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const firstPage = await pdf.getPage(1);

    const viewport = firstPage.getViewport({ scale: 2.0 });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) {
      throw new Error('Could not get canvas context');
    }

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await firstPage.render({
      canvasContext: context,
      viewport: viewport,
      canvas: canvas
    } as any).promise;

    const imageData = canvas.toDataURL('image/png');

    const result = await Tesseract.default.recognize(imageData, 'tam', {
      logger: (m) => console.log(m)
    });

    const lines = result.data.text.split('\n').filter(line => line.trim().length > 0);
    return lines[0] || '';
  } catch (error) {
    console.error('PDF OCR extraction error:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

export async function extractTextFromImage(file: File): Promise<string> {
  try {
    const Tesseract = await import('tesseract.js');

    const result = await Tesseract.default.recognize(file, 'tam', {
      logger: (m) => console.log(m)
    });

    const lines = result.data.text.split('\n').filter(line => line.trim().length > 0);
    return lines[0] || '';
  } catch (error) {
    console.error('Image OCR extraction error:', error);
    throw new Error('Failed to extract text from image');
  }
}
