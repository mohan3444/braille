'use client';

import { BrailleCell } from './BrailleCell';
import { renderBrailleAsText } from '@/lib/braille-converter';

interface BrailleDisplayProps {
  braillePattern: number[][];
  tamilText: string;
}

interface CharacterMapping {
  tamil: string;
  braille: number[];
}

export function BrailleDisplay({ braillePattern, tamilText }: BrailleDisplayProps) {
  const brailleText = renderBrailleAsText(braillePattern);

  const getCharacterMappings = (): CharacterMapping[] => {
    const mappings: CharacterMapping[] = [];
    let tamilIndex = 0;
    let brailleIndex = 0;

    while (tamilIndex < tamilText.length && brailleIndex < braillePattern.length) {
      let charLength = 1;
      for (let len = Math.min(3, tamilText.length - tamilIndex); len > 0; len--) {
        if (brailleIndex + len <= braillePattern.length) {
          charLength = len;
          break;
        }
      }

      const tamilChar = tamilText.substring(tamilIndex, tamilIndex + charLength);
      const brailleDots = braillePattern[brailleIndex];

      mappings.push({ tamil: tamilChar, braille: brailleDots });
      tamilIndex += charLength;
      brailleIndex++;
    }

    return mappings;
  };

  const characterMappings = getCharacterMappings();

  return (
    <div className="w-full bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-900/50 dark:to-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-lg backdrop-blur-sm">
      <div className="space-y-6 sm:space-y-8">
        <div>
          <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3 uppercase tracking-wide">
            Tamil Input
          </h3>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700 transition-all hover:shadow-md">
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
            Character Mapping
          </h3>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 sm:p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex flex-wrap gap-3 sm:gap-4">
              {braillePattern.map((dots, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center gap-2 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all hover:scale-105 hover:shadow-md"
                >
                  <BrailleCell dots={dots} size="md" />
                  <span className="text-base font-tamil text-slate-700 dark:text-slate-300">
                    {tamilText[idx] || ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3 uppercase tracking-wide">
            Unicode Braille
          </h3>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700 transition-all hover:shadow-md">
            <p className="text-2xl text-slate-900 dark:text-white break-words select-all leading-relaxed">
              {brailleText || '-'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
