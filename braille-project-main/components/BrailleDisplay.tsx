'use client';

import { BrailleCell } from './BrailleCell';
import { renderBrailleAsText } from '@/lib/braille-converter';

interface BrailleDisplayProps {
  braillePattern: number[][];
  tamilText: string;
}

export function BrailleDisplay({ braillePattern, tamilText }: BrailleDisplayProps) {
  const brailleText = renderBrailleAsText(braillePattern);

  return (
    <div className="w-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-8">
        <div>
          <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3 uppercase tracking-wide">
            Tamil Input
          </h3>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
            <p className="text-lg text-slate-900 dark:text-white font-tamil break-words">
              {tamilText || '-'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-600" />
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 px-2">
            CONVERTED
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-600" />
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3 uppercase tracking-wide">
            Braille Pattern
          </h3>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700 min-h-[120px] flex items-center">
            <div className="flex flex-wrap gap-3">
              {braillePattern.map((dots, idx) => (
                <div key={idx}>
                  <BrailleCell dots={dots} size="md" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3 uppercase tracking-wide">
            Unicode Braille
          </h3>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700 font-mono">
            <p className="text-lg text-slate-900 dark:text-white break-words select-all">
              {brailleText || '-'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
