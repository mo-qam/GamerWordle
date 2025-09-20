import { useEffect, useState } from 'react';

interface StoredLifetime {
  version: number;
  lastDate: string | null; // YYYY-MM-DD
  streak: number;
  maxStreak: number;
  gamesPlayed: number;
  gamesWon: number;
  guessDistribution: Record<string, number>; // blanks count vs wins
}

const KEY = 'pnd_lifetime_v1';

function load(): StoredLifetime {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as StoredLifetime;
  } catch {}
  return {
    version: 1,
    lastDate: null,
    streak: 0,
    maxStreak: 0,
    gamesPlayed: 0,
    gamesWon: 0,
    guessDistribution: {}
  };
}

function save(data: StoredLifetime) {
  try { localStorage.setItem(KEY, JSON.stringify(data)); } catch {}
}

export interface StreakStats extends StoredLifetime {}

export function useStreakStats(currentDate: string, solved: boolean, blanksTotal: number, totalGuesses: number) {
  const [stats, setStats] = useState<StoredLifetime>(() => load());

  useEffect(()=>{
    // On mount or when date changes, if we haven't registered today's game yet, do it.
    setStats(prev => {
      if (prev.lastDate === currentDate) return prev; // already processed today
      const isConsecutive = prev.lastDate ? consecutive(prev.lastDate, currentDate) : false;
      const updated: StoredLifetime = { ...prev };
      updated.gamesPlayed += 1;
      if (solved) {
        if (isConsecutive || prev.lastDate === null) {
          updated.streak = prev.lastDate ? prev.streak + 1 : 1;
        } else {
          updated.streak = 1;
        }
        updated.maxStreak = Math.max(updated.maxStreak, updated.streak);
        updated.gamesWon += 1;
        const key = String(blanksTotal);
        updated.guessDistribution[key] = (updated.guessDistribution[key] || 0) + 1;
      } else {
        // If unsolved at load time we simply break streak when tomorrow loads.
        if (!isConsecutive) {
          // If they skipped days reset streak
          updated.streak = solved ? 1 : 0;
        }
      }
      updated.lastDate = currentDate;
      save(updated);
      return updated;
    });
  }, [currentDate]);

  // Update solved status later (when puzzle solved after initial load)
  useEffect(()=>{
    if (!solved) return;
    setStats(prev => {
      if (prev.lastDate !== currentDate) return prev; // Should have been processed
      // If already counted a win (gamesWon incremented) skip
      // We detect by ensuring guessDistribution has blanksTotal entry maybe already incremented; to be safe we only increment if not already (rare case if they solved after mount same day).
      const key = String(blanksTotal);
      if (prev.guessDistribution[key]) return prev; // Assume already counted
      const updated = { ...prev };
      updated.gamesWon += 1;
      updated.guessDistribution[key] = (updated.guessDistribution[key] || 0) + 1;
      save(updated);
      return updated;
    });
  }, [solved, blanksTotal, currentDate]);

  return stats as StreakStats;
}

function consecutive(prevDate: string, currentDate: string): boolean {
  const prev = new Date(prevDate + 'T00:00:00Z');
  const cur = new Date(currentDate + 'T00:00:00Z');
  const diff = (cur.getTime() - prev.getTime()) / 86400000;
  return diff === 1;
}
