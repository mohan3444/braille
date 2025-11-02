'use client';

import { useState, useEffect } from 'react';
import { ConversionRecord, getHistory, deleteConversion, toggleLike } from '@/lib/history-store';
import { Button } from '@/components/ui/button';
import { Heart, Trash2, Copy, Download, Clock } from 'lucide-react';
import { renderBrailleAsText } from '@/lib/braille-converter';
import { toast } from 'sonner';

interface ConversionHistoryProps {
  onSelectConversion?: (record: ConversionRecord) => void;
}

export function ConversionHistory({ onSelectConversion }: ConversionHistoryProps) {
  const [history, setHistory] = useState<ConversionRecord[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setHistory(getHistory());
    setIsLoaded(true);
  }, []);

  const handleDelete = (id: string) => {
    deleteConversion(id);
    setHistory(getHistory());
    toast.success('Conversion deleted');
  };

  const handleLike = (id: string) => {
    toggleLike(id);
    setHistory(getHistory());
  };

  const handleCopy = (braillePattern: number[][]) => {
    const text = renderBrailleAsText(braillePattern);
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Braille copied to clipboard');
    });
  };

  const handleDownload = (tamilText: string, braillePattern: number[][]) => {
    const brailleText = renderBrailleAsText(braillePattern);
    const content = `Tamil Text:\n${tamilText}\n\nBraille:\n${brailleText}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `braille-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('File downloaded');
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse text-slate-500 dark:text-slate-400">Loading history...</div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
          <Clock className="w-8 h-8 text-slate-400 dark:text-slate-500" />
        </div>
        <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">
          No conversions yet
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
          Your conversion history will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6">Recent Conversions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {history.map((record, index) => (
          <div
            key={record.id}
            className="group bg-white dark:bg-slate-800/70 rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 cursor-pointer transform hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4"
            style={{ animationDelay: `${index * 50}ms` }}
            onClick={() => onSelectConversion?.(record)}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-tamil text-sm text-slate-700 dark:text-slate-300 break-words line-clamp-2 mb-2">
                    {record.tamilText}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(record.createdAt).toLocaleDateString()} at{' '}
                    {new Date(record.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
                <p className="text-lg text-slate-800 dark:text-slate-300 break-words line-clamp-2">
                  {renderBrailleAsText(record.braillePattern)}
                </p>
              </div>

              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopy(record.braillePattern);
                  }}
                  className="flex-1 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  <Copy className="w-3 h-3 mr-1" />
                  Copy
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(record.tamilText, record.braillePattern);
                  }}
                  className="flex-1 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  <Download className="w-3 h-3 mr-1" />
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLike(record.id);
                  }}
                  className={record.liked ? 'text-red-500 hover:text-red-600' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}
                >
                  <Heart className={`w-3 h-3 ${record.liked ? 'fill-current' : ''}`} />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(record.id);
                  }}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
