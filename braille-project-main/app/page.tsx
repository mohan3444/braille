'use client';

import { useState, useCallback } from 'react';
import { ConversionForm } from '@/components/ConversionForm';
import { BrailleDisplay } from '@/components/BrailleDisplay';
import { ConversionHistory } from '@/components/ConversionHistory';
import { convertTamilToBraille } from '@/lib/braille-converter';
import { saveConversion, ConversionRecord } from '@/lib/history-store';
import { Loader2, Type } from 'lucide-react';

export default function Home() {
  const [result, setResult] = useState<{ tamilText: string; braillePattern: number[][] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [historyKey, setHistoryKey] = useState(0);

  const handleConvert = async (text: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const braillePattern = convertTamilToBraille(text);
      setResult({ tamilText: text, braillePattern });
      saveConversion(text, braillePattern);
      setHistoryKey(prev => prev + 1);
    } catch (error) {
      console.error('Conversion error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectFromHistory = useCallback((record: ConversionRecord) => {
    setResult({
      tamilText: record.tamilText,
      braillePattern: record.braillePattern
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <nav className="border-b border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 group">
              <div className="w-11 h-11 bg-gradient-to-br from-slate-700 to-slate-900 dark:from-slate-100 dark:to-slate-300 rounded-xl flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-105">
                <Type className="w-6 h-6 text-white dark:text-slate-900" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Tamil to Braille</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">Accessible conversion tool</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8 sm:mb-12 text-center space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white leading-tight">
            Convert Tamil to Braille
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Transform Tamil text into Braille patterns instantly with OCR support
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 mb-12 lg:mb-16">
          <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm animate-in fade-in slide-in-from-left-8 duration-700">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-6">Input</h3>
            <ConversionForm onConvert={handleConvert} isLoading={isLoading} />
          </div>

          <div className="animate-in fade-in slide-in-from-right-8 duration-700">
            {isLoading ? (
              <div className="h-full bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-900/50 dark:to-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 flex items-center justify-center min-h-[400px] backdrop-blur-sm">
                <div className="text-center space-y-4 animate-pulse">
                  <Loader2 className="w-12 h-12 text-slate-700 dark:text-slate-300 animate-spin mx-auto" />
                  <p className="text-slate-600 dark:text-slate-400 font-medium">Converting to Braille...</p>
                </div>
              </div>
            ) : result ? (
              <BrailleDisplay
                tamilText={result.tamilText}
                braillePattern={result.braillePattern}
              />
            ) : (
              <div className="bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-900/50 dark:to-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-8 flex items-center justify-center min-h-[400px] backdrop-blur-sm">
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 mx-auto bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                    <Type className="w-8 h-8 text-slate-500 dark:text-slate-400" />
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">
                    No conversion yet
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-500">
                    Enter text or upload a file to begin
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-6 sm:p-8 shadow-lg backdrop-blur-sm animate-in fade-in slide-in-from-bottom-8 duration-700">
          <ConversionHistory key={historyKey} onSelectConversion={handleSelectFromHistory} />
        </div>
      </main>

      <footer className="border-t border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Making Braille accessible to everyone
          </p>
        </div>
      </footer>
    </div>
  );
}
