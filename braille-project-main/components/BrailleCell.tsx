'use client';

import { getCellVisualization } from '@/lib/braille-converter';

interface BrailleCellProps {
  dots: number[];
  size?: 'sm' | 'md' | 'lg';
}

export function BrailleCell({ dots, size = 'md' }: BrailleCellProps) {
  const cell = getCellVisualization(dots);

  const sizeClasses = {
    sm: 'w-8 h-12',
    md: 'w-12 h-16',
    lg: 'w-16 h-24'
  };

  const dotSizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  return (
    <div className={`${sizeClasses[size]} flex flex-col justify-between bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded p-1`}>
      {cell.map((row, rowIdx) => (
        <div key={rowIdx} className="flex gap-1 justify-between">
          {row.map((dot, colIdx) => (
            <div
              key={`${rowIdx}-${colIdx}`}
              className={`${dotSizeClasses[size]} rounded-full transition-all ${
                dot
                  ? 'bg-slate-900 dark:bg-white shadow-md'
                  : 'bg-slate-200 dark:bg-slate-700'
              }`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
