import { ALL_CATEGORIES } from '../data/terms';
import { seedHash, mulberry32, pickArray } from './rng';

// Build a list of candidate words (5-letter priority). We'll filter to alphabetic only.
const rawWords = Array.from(new Set(ALL_CATEGORIES.flatMap(c => c.words)));
export const CLASSIC_CANDIDATES = rawWords.filter(w => /^[a-zA-Z]+$/.test(w) && w.length === 5).map(w => w.toLowerCase());

export function getDailyClassicAnswer(dateStr?: string) {
  const date = dateStr ? new Date(dateStr) : new Date();
  const key = date.getUTCFullYear() + '-' + (date.getUTCMonth()+1) + '-' + date.getUTCDate();
  const h = seedHash('classic:' + key);
  const rand = mulberry32(h);
  // deterministic pick
  const idx = Math.floor(rand() * CLASSIC_CANDIDATES.length);
  return { answer: CLASSIC_CANDIDATES[idx], dateKey: key };
}

export const CLASSIC_WORD_LENGTH = 5;
export const CLASSIC_MAX_GUESSES = 6;