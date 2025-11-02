'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Loader2, X } from 'lucide-react';
import { extractTextFromFile, validateFile } from '@/lib/file-handler';
import { toast } from 'sonner';

interface ConversionFormProps {
  onConvert: (text: string) => Promise<void>;
  isLoading?: boolean;
}

export function ConversionForm({ onConvert, isLoading = false }: ConversionFormProps) {
  const [tamilText, setTamilText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextConvert = async () => {
    if (tamilText.trim()) {
      await onConvert(tamilText);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileError('');

    if (file) {
      const validation = validateFile(file);
      if (!validation.valid) {
        setFileError(validation.error || 'Invalid file');
        toast.error(validation.error);
        return;
      }

      setSelectedFile(file);

      try {
        const text = await extractTextFromFile(file);
        setTamilText(text);
        await onConvert(text);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to process file';
        setFileError(errorMessage);
        toast.error(errorMessage);
        setSelectedFile(null);
      }
    }
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setFileError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="space-y-3">
        <label htmlFor="tamil-input" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          Enter Tamil Text
        </label>
        <Textarea
          id="tamil-input"
          placeholder="Type or paste Tamil text here..."
          value={tamilText}
          onChange={(e) => setTamilText(e.target.value)}
          disabled={isLoading}
          className="min-h-32 resize-none text-base font-tamil"
        />
      </div>

      <div className="flex gap-3">
        <Button
          onClick={handleTextConvert}
          disabled={!tamilText.trim() || isLoading}
          size="lg"
          className="flex-1 hover:scale-[1.02] active:scale-[0.98] transition-transform"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Converting...
            </>
          ) : (
            'Convert to Braille'
          )}
        </Button>
      </div>

      <div className="relative">
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-slate-300 dark:bg-slate-600" />
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">OR</span>
          <div className="flex-1 h-px bg-slate-300 dark:bg-slate-600" />
        </div>
      </div>

      <div>
        <label htmlFor="file-input" className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-3">
          Upload File
        </label>
        <input
          ref={fileInputRef}
          id="file-input"
          type="file"
          accept=".txt,.pdf,image/*"
          onChange={handleFileSelect}
          disabled={isLoading}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="w-full p-6 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="flex flex-col items-center gap-2">
            <Upload className="w-6 h-6 text-slate-600 dark:text-slate-400" />
            <div>
              <p className="font-semibold text-slate-700 dark:text-slate-300">
                {selectedFile ? selectedFile.name : 'Click to upload file'}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                TXT, PDF, or Image up to 10MB
              </p>
            </div>
          </div>
        </button>

        {selectedFile && (
          <div className="mt-3 flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded p-3">
            <span className="text-sm text-blue-900 dark:text-blue-200">File loaded: {selectedFile.name}</span>
            <button
              onClick={handleClearFile}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {fileError && (
          <div className="mt-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-3">
            {fileError}
          </div>
        )}
      </div>
    </div>
  );
}
