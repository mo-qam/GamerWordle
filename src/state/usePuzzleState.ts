import { useEffect, useMemo, useState, useCallback } from 'react';
import { DailyPuzzle, generateDailyPuzzle } from '../logic/puzzle';

export interface GuessRecord {
  guess: string;
  matched: string[]; // blankIds matched
  ts: number;
}

export interface PuzzleStatsSnapshot {
  totalGuesses: number;
  solved: boolean;
  solvedAt?: number;
  distinctMatched: number;
  blanksTotal: number;
  accuracy: number; // matched blanks / total guesses (rough)
}

interface StoredState {
  date: string;
  guesses: GuessRecord[];
  blanksFilled: Record<string, boolean>;
  solvedAt?: number;
  version: number;
}

const STORAGE_KEY = 'pnd_daily_state_v1';

function loadStored(date: string): StoredState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: StoredState = JSON.parse(raw);
    if (parsed.date !== date) return null; // new day resets
    return parsed;
  } catch { return null; }
}

function saveStored(state: StoredState) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
}

export function usePuzzleState(puzzle: DailyPuzzle) {
  const [guesses, setGuesses] = useState<GuessRecord[]>([]);
  const [blanksFilled, setBlanksFilled] = useState<Record<string, boolean>>({});
  const [solvedAt, setSolvedAt] = useState<number|undefined>();

  // load on mount
  useEffect(()=>{
    const stored = loadStored(puzzle.date);
    if (stored) {
      setGuesses(stored.guesses);
      setBlanksFilled(stored.blanksFilled);
      setSolvedAt(stored.solvedAt);
    } else {
      // fresh state
      const initialFilled: Record<string, boolean> = {};
      for (const id of puzzle.blankOrder) initialFilled[id] = false;
      setBlanksFilled(initialFilled);
    }
  }, [puzzle.date]);

  // persist
  useEffect(()=>{
    const snapshot: StoredState = {
      date: puzzle.date,
      guesses,
      blanksFilled,
      solvedAt,
      version: 1
    };
    saveStored(snapshot);
  }, [puzzle.date, guesses, blanksFilled, solvedAt]);

  const submitGuess = useCallback((rawGuess: string) => {
    const guess = rawGuess.trim().toLowerCase();
    if (!guess) return { matched: [] as string[], accepted: false };
    // Already solved? still record guess but no effect.
    const matched: string[] = [];
    const newlyFilled: Record<string, boolean> = { ...blanksFilled };
    for (const id of puzzle.blankOrder) {
      const blank = puzzle.blanks[id];
      if (!newlyFilled[id] && blank.answer === guess) {
        newlyFilled[id] = true;
        matched.push(id);
      }
    }
    if (matched.length === 0 && guesses.some(g => g.guess === guess)) {
      // duplicate non-matching guess ignored to discourage spam
      return { matched, accepted: false };
    }
    const rec: GuessRecord = { guess, matched, ts: Date.now() };
    setGuesses(g => [...g, rec]);
    if (matched.length > 0) setBlanksFilled(newlyFilled);
    if (!solvedAt && Object.values(newlyFilled).every(Boolean)) {
      setSolvedAt(Date.now());
    }
    return { matched, accepted: true };
  }, [blanksFilled, guesses, solvedAt, puzzle]);

  const stats: PuzzleStatsSnapshot = useMemo(()=>{
    const distinctMatched = Object.values(blanksFilled).filter(Boolean).length;
    const totalGuesses = guesses.length;
    const accuracy = totalGuesses ? distinctMatched / totalGuesses : 0;
    return {
      totalGuesses,
      solved: distinctMatched === puzzle.blankOrder.length,
      solvedAt,
      distinctMatched,
      blanksTotal: puzzle.blankOrder.length,
      accuracy
    };
  }, [guesses, blanksFilled, puzzle.blankOrder.length, solvedAt]);

  return { guesses, blanksFilled, submitGuess, stats };
}
