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
  // Create a 3x2 braille cell visualization
  const cell = [
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

  // Use Unicode braille characters
  const brailleChars: Record<string, string> = {
    '000000': '⠀',
    '100000': '⠁',
    '010000': '⠂',
    '110000': '⠃',
    '001000': '⠄',
    '101000': '⠅',
    '011000': '⠆',
    '111000': '⠇',
    '000100': '⠈',
    '100100': '⠉',
    '010100': '⠊',
    '110100': '⠋',
    '001100': '⠌',
    '101100': '⠍',
    '011100': '⠎',
    '111100': '⠏',
    '000010': '⠐',
    '100010': '⠑',
    '010010': '⠒',
    '110010': '⠓',
    '001010': '⠔',
    '101010': '⠕',
    '011010': '⠖',
    '111010': '⠗',
    '000110': '⠘',
    '100110': '⠙',
    '010110': '⠚',
    '110110': '⠛',
    '001110': '⠜',
    '101110': '⠝',
    '011110': '⠞',
    '111110': '⠟',
    '000001': '⠠',
    '100001': '⠡',
    '010001': '⠢',
    '110001': '⠣',
    '001001': '⠤',
    '101001': '⠥',
    '011001': '⠦',
    '111001': '⠧',
    '000101': '⠨',
    '100101': '⠩',
    '010101': '⠪',
    '110101': '⠫',
    '001101': '⠬',
    '101101': '⠭',
    '011101': '⠮',
    '111101': '⠯',
    '000011': '⠰',
    '100011': '⠱',
    '010011': '⠲',
    '110011': '⠳',
    '001011': '⠴',
    '101011': '⠵',
    '011011': '⠶',
    '111011': '⠷',
    '000111': '⠸',
    '100111': '⠹',
    '010111': '⠺',
    '110111': '⠻',
    '001111': '⠼',
    '101111': '⠽',
    '011111': '⠾',
    '111111': '⠿'
  };

  const key = cell.flat().map(v => v ? '1' : '0').join('');
  return brailleChars[key] || '⠀';
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
