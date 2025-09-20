import { useCallback, useEffect, useMemo, useState } from 'react';
import { getDailyClassicAnswer, CLASSIC_MAX_GUESSES, CLASSIC_WORD_LENGTH } from '../logic/classicWords';
import { evaluateGuess, LetterState } from '../logic/classicEval';

interface ClassicStored {
  dateKey: string;
  guesses: string[];
  states: LetterState[][];
  solved: boolean;
  solvedAt?: number;
  version: number;
}

const STORAGE_KEY = 'pnd_classic_v1';

function load(key: string): ClassicStored | null {
  try { const raw = localStorage.getItem(STORAGE_KEY); if(!raw) return null; const p: ClassicStored = JSON.parse(raw); return p.dateKey === key ? p : null; } catch { return null; }
}
function save(val: ClassicStored) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(val)); } catch {} }

export function useClassicGame() {
  const { answer, dateKey } = useMemo(()=>getDailyClassicAnswer(), []);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [states, setStates] = useState<LetterState[][]>([]);
  const [solvedAt, setSolvedAt] = useState<number|undefined>();

  useEffect(()=>{
    const stored = load(dateKey);
    if (stored) {
      setGuesses(stored.guesses);
      setStates(stored.states);
      if (stored.solved) setSolvedAt(stored.solvedAt);
    }
  }, [dateKey]);

  useEffect(()=>{
    save({ dateKey, guesses, states, solved: solvedAt !== undefined, solvedAt, version:1 });
  }, [dateKey, guesses, states, solvedAt]);

  const submit = useCallback((raw: string) => {
    const guess = raw.trim().toLowerCase();
    if (guess.length !== CLASSIC_WORD_LENGTH) return false;
    if (guesses.length >= CLASSIC_MAX_GUESSES || solvedAt) return false;
    const evalStates = evaluateGuess(guess, answer);
    setGuesses(g => [...g, guess]);
    setStates(s => [...s, evalStates]);
    if (evalStates.every(s => s === 'correct')) setSolvedAt(Date.now());
    return true;
  }, [answer, guesses.length, solvedAt]);

  const keyboardStates = useMemo(() => {
    const map: Record<string, LetterState> = {};
    states.forEach((row, i) => {
      row.forEach((st, idx) => {
        const ch = guesses[i][idx];
        const prev = map[ch];
        if (st === 'correct' || (st === 'present' && prev !== 'correct') || !prev) {
          map[ch] = st;
        }
      });
    });
    return map;
  }, [states, guesses]);

  return {
    answer,
    dateKey,
    guesses,
    states,
    solved: !!solvedAt,
    solvedAt,
    submit,
    keyboardStates,
    remaining: CLASSIC_MAX_GUESSES - guesses.length,
    maxGuesses: CLASSIC_MAX_GUESSES,
    wordLength: CLASSIC_WORD_LENGTH
  };
}
