'use client';

import { useState, useEffect } from 'react';
import { ConversionRecord, getHistory, deleteConversion, toggleLike } from '@/lib/history-store';
import { Button } from '@/components/ui/button';
import { Heart, Trash2, Copy, Download } from 'lucide-react';
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
    return <div>Loading...</div>;
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 dark:text-slate-400 text-lg">
          No conversions yet. Start by converting some Tamil text!
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Conversion History</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {history.map((record) => (
          <div
            key={record.id}
            className="group bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200 cursor-pointer"
            onClick={() => onSelectConversion?.(record)}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-tamil text-sm text-slate-700 dark:text-slate-300 break-words line-clamp-2">
                    {record.tamilText}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {new Date(record.createdAt).toLocaleDateString()} at{' '}
                    {new Date(record.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900 rounded p-2">
                <p className="font-mono text-xs text-slate-600 dark:text-slate-400 break-words line-clamp-2">
                  {renderBrailleAsText(record.braillePattern)}
                </p>
              </div>

              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopy(record.braillePattern);
                  }}
                  className="flex-1"
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
                  className="flex-1"
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
                  className={record.liked ? 'text-red-500' : ''}
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
                  className="text-red-600 hover:text-red-700"
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
