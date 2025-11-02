import brailleMapping from './braille_mapping.json';

type BraillePattern = number[][];

const mapping: Record<string, BraillePattern> = brailleMapping as Record<string, BraillePattern>;

export function convertTamilToBraille(tamilText: string): BraillePattern {
  const result: BraillePattern = [];
  let i = 0;

  while (i < tamilText.length) {
    let matched = false;

    // Try to match the longest possible sequence first
    for (let len = Math.min(4, tamilText.length - i); len > 0; len--) {
      const sequence = tamilText.substring(i, i + len);
      if (mapping[sequence]) {
        result.push(...mapping[sequence]);
        i += len;
        matched = true;
        break;
      }
    }

    if (!matched) {
      // If character not found in mapping, skip it
      i++;
    }
  }

  return result;
}

export function renderBrailleAsText(braillePattern: BraillePattern): string {
  return braillePattern.map(cell => renderCell(cell)).join('');
}

function renderCell(dots: number[]): string {
  const unicodeBase = 0x2800;
  let code = 0;

  dots.forEach(dot => {
    if (dot >= 1 && dot <= 8) {
      code |= (1 << (dot - 1));
    }
  });

  return String.fromCharCode(unicodeBase + code);
}

export function getCellVisualization(dots: number[]): boolean[][] {
  const cell: boolean[][] = [
    [false, false],
    [false, false],
    [false, false]
  ];

  dots.forEach(dot => {
    if (dot === 1) cell[0][0] = true;
    if (dot === 2) cell[1][0] = true;
    if (dot === 3) cell[2][0] = true;
    if (dot === 4) cell[0][1] = true;
    if (dot === 5) cell[1][1] = true;
    if (dot === 6) cell[2][1] = true;
  });

  return cell;
}
