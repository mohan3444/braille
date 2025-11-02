'use client';

import { useState, useEffect } from 'react';
import { ConversionForm } from '@/components/ConversionForm';
import { BrailleDisplay } from '@/components/BrailleDisplay';
import { ConversionHistory } from '@/components/ConversionHistory';
import { convertTamilToBraille } from '@/lib/braille-converter';
import { saveConversion, ConversionRecord } from '@/lib/history-store';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const [result, setResult] = useState<{ tamilText: string; braillePattern: number[][] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleConvert = async (text: string) => {
    setIsLoading(true);
    try {
      const braillePattern = convertTamilToBraille(text);
      setResult({ tamilText: text, braillePattern });
      saveConversion(text, braillePattern);
    } catch (error) {
      console.error('Conversion error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectFromHistory = (record: ConversionRecord) => {
    setResult({
      tamilText: record.tamilText,
      braillePattern: record.braillePattern
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Navigation */}
      <nav className="border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
               Tamil
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Tamil to Braille</h1>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">Convert Tamil text to Braille easily</p>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="mb-12 text-center space-y-4">
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white leading-tight">
            Tamil to Braille Converter
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Instantly convert Tamil text to Braille patterns. Perfect for accessibility and learning Braille script.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Input Section */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Input</h3>
            <ConversionForm onConvert={handleConvert} isLoading={isLoading} />
          </div>

          {/* Output Section */}
          <div>
            {isLoading ? (
              <div className="h-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center min-h-[400px]">
                <div className="text-center space-y-4">
                  <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto" />
                  <p className="text-slate-600 dark:text-slate-400 font-medium">Converting to Braille...</p>
                </div>
              </div>
            ) : result ? (
              <BrailleDisplay
                tamilText={result.tamilText}
                braillePattern={result.braillePattern}
              />
            ) : (
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8 flex items-center justify-center min-h-[400px]">
                <div className="text-center space-y-3">
                  <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">
                    No conversion yet
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-500">
                    Enter Tamil text or upload a file to get started
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* History Section */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm">
          <ConversionHistory onSelectConversion={handleSelectFromHistory} />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Built to make Braille accessible to everyone
          </p>
        </div>
      </footer>
    </div>
  );
}
