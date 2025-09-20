export interface PromptPuzzle {
  id: string;          // date key or unique hash
  prompt: string;      // gamer themed clue
  answer: string;      // target word (lowercase)
  letters?: string;    // optional explicit letter bank; if omitted, derive from answer plus decoys
  bank?: string[];     // computed letter bank list (single chars)
  difficulty: 'easy' | 'medium' | 'hard';
}

// Initial seed list (keep all lowercase answers)
const SEED: Omit<PromptPuzzle, 'id' | 'bank'>[] = [
  { prompt: 'Enemy AI that swarms with basic pathing', answer: 'mob', letters: 'mobxyz', difficulty: 'easy' },
  { prompt: 'Temporary stat increase from pickup', answer: 'buff', letters: 'bufafqc', difficulty: 'easy' },
  { prompt: 'Hidden area packed with loot', answer: 'nook', letters: 'nooklz', difficulty: 'easy' },
  { prompt: 'Early game handheld recovery item', answer: 'potion', letters: 'potionerr', difficulty: 'medium' },
  { prompt: 'Non‑player ally following the hero', answer: 'companion', letters: 'companionu', difficulty: 'hard' },
  { prompt: 'Resource used to unlock skill tree nodes', answer: 'xp', letters: 'xplv', difficulty: 'easy' },
  { prompt: 'Boss attack pattern reset window', answer: 'phase', letters: 'phaseir', difficulty: 'medium' },
  { prompt: 'Traversal tool: fires a line to pull you', answer: 'grapple', letters: 'grappleid', difficulty: 'medium' },
  { prompt: 'Short invulnerability after taking damage', answer: 'iframes', letters: 'iframesot', difficulty: 'hard' },
  { prompt: 'Highest difficulty challenge badge', answer: 'insane', letters: 'insanexr', difficulty: 'hard' }
];

function dateKey(d: Date): string { return d.toISOString().slice(0,10); }

export function getDailyPromptPuzzle(): PromptPuzzle {
  const today = new Date();
  const key = dateKey(today);
  // deterministic index based on YYYY-MM-DD
  const seed = key.split('-').join('');
  let hash = 0; for (let i=0;i<seed.length;i++){ hash = (hash * 31 + seed.charCodeAt(i)) >>> 0; }
  const base = SEED[hash % SEED.length];
  const id = key;
  const bank = (base.letters ?? Array.from(new Set(base.answer.split(''))).join('')).split('');
  return { ...base, id, bank };
}

export function getPromptPuzzleForDate(key: string): PromptPuzzle {
  // Accept YYYY-MM-DD; fallback to daily if malformed
  if(!/^\d{4}-\d{2}-\d{2}$/.test(key)) return getDailyPromptPuzzle();
  const seed = key.split('-').join('');
  let hash = 0; for (let i=0;i<seed.length;i++){ hash = (hash * 31 + seed.charCodeAt(i)) >>> 0; }
  const base = SEED[hash % SEED.length];
  const bank = (base.letters ?? Array.from(new Set(base.answer.split(''))).join('')).split('');
  return { ...base, id: key, bank };
}

export function getPromptPuzzleByIndex(index: number, date: Date): PromptPuzzle {
  const base = SEED[index % SEED.length];
  const id = date.toISOString().slice(0,10);
  const bank = (base.letters ?? Array.from(new Set(base.answer.split(''))).join('')).split('');
  return { ...base, id, bank };
}

export function listSeedPuzzles(): ReadonlyArray<Omit<PromptPuzzle,'id'|'bank'>> { return SEED; }
