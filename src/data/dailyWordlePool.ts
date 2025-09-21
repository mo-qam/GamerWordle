// Daily wordle candidate pool: all unique 5-letter words from all categories
import { CATEGORY_WORDS } from './categoryWords';

export const DAILY_WORDLE_POOL: string[] = Array.from(
  new Set(
    Object.values(CATEGORY_WORDS).flat().filter(w => /^[a-zA-Z]{5}$/.test(w))
  )
);
