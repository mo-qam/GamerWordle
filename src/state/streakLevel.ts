export interface StreakLevelState {
  streak: number;
  maxStreak: number;
  xp: number;
  level: number;
  lastPuzzle: string | null; // dateKey last completed
  version: number;
}

const KEY = 'gw_streak_level_v1';

function base(): StreakLevelState { return { streak:0, maxStreak:0, xp:0, level:1, lastPuzzle:null, version:1 }; }

export function loadStreakLevel(): StreakLevelState {
  try { const raw = localStorage.getItem(KEY); if(!raw) return base(); const data: StreakLevelState = JSON.parse(raw); return { ...base(), ...data }; } catch { return base(); }
}
export function saveStreakLevel(s: StreakLevelState){ try { localStorage.setItem(KEY, JSON.stringify(s)); } catch {} }

export function awardForPuzzle(prev: StreakLevelState, dateKey: string, solved: boolean, guessesUsed: number, maxGuesses: number): StreakLevelState {
  const copy = { ...prev };
  if(!solved) return copy;
  if(copy.lastPuzzle === dateKey) return copy; // already counted
  // Compute consecutive day logic – naive: if lastPuzzle exists and date difference is 1 day increment, else reset.
  if(copy.lastPuzzle){
    const last = new Date(copy.lastPuzzle);
    const cur = new Date(dateKey);
    const diffDays = Math.floor((cur.getTime() - last.getTime())/86400000);
    if(diffDays === 1) copy.streak += 1; else copy.streak = 1;
  } else {
    copy.streak = 1;
  }
  if(copy.streak > copy.maxStreak) copy.maxStreak = copy.streak;
  // XP formula: base 50 + bonus for remaining guesses
  const remaining = Math.max(0, maxGuesses - guessesUsed);
  const gain = 50 + remaining * 10;
  copy.xp += gain;
  // Level curve: level up every 300 xp early, grow slightly after
  let needed = levelXpRequirement(copy.level);
  while(copy.xp >= needed){
    copy.level += 1;
    needed = levelXpRequirement(copy.level);
  }
  copy.lastPuzzle = dateKey;
  return copy;
}

export function levelXpRequirement(level: number): number {
  // Simple curve: 300 * (1 + (level-1)*0.15)
  return Math.round(300 * (1 + (level-1)*0.15));
}
