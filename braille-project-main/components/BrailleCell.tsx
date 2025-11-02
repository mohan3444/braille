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
    <div className={`${sizeClasses[size]} flex flex-col justify-between bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-lg p-2 shadow-sm transition-all hover:shadow-md hover:border-slate-400 dark:hover:border-slate-500`}>
      {cell.map((row, rowIdx) => (
        <div key={rowIdx} className="flex gap-1 justify-between">
          {row.map((dot, colIdx) => (
            <div
              key={`${rowIdx}-${colIdx}`}
              className={`${dotSizeClasses[size]} rounded-full transition-all duration-200 ${
                dot
                  ? 'bg-slate-900 dark:bg-slate-100 shadow-lg scale-100'
                  : 'bg-slate-200 dark:bg-slate-700 scale-75 opacity-50'
              }`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
