export interface ConversionRecord {
  id: string;
  tamilText: string;
  braillePattern: number[][];
  createdAt: number;
  liked: boolean;
}

const STORAGE_KEY = 'tamil_braille_history';
const MAX_HISTORY = 50;

export function saveConversion(tamilText: string, braillePattern: number[][]): ConversionRecord {
  const record: ConversionRecord = {
    id: Date.now().toString(),
    tamilText,
    braillePattern,
    createdAt: Date.now(),
    liked: false
  };

  const history = getHistory();
  history.unshift(record);

  // Keep only the latest MAX_HISTORY items
  if (history.length > MAX_HISTORY) {
    history.pop();
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  return record;
}

export function getHistory(): ConversionRecord[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load history:', error);
    return [];
  }
}

export function deleteConversion(id: string): void {
  const history = getHistory();
  const filtered = history.filter(record => record.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export function toggleLike(id: string): void {
  const history = getHistory();
  const record = history.find(r => r.id === id);
  if (record) {
    record.liked = !record.liked;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}
