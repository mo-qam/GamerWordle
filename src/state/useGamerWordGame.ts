import { useCallback, useEffect, useMemo, useState } from 'react';
import { evaluateGuess, LetterState } from '../logic/classicEval';
import { getDailyGamerWord, getGamerWordForDate, getRandomGamerWord, GAMER_WORD_MAX_GUESSES, GAMER_WORD_LENGTH } from '../logic/gamerWords';

interface StoredGamerWord {
  dateKey: string;
  guesses: string[];
  states: LetterState[][];
  solved: boolean;
  solvedAt?: number;
  version: number;
}

const STORAGE_KEY = 'gw_classic_v1';

function load(key: string): StoredGamerWord | null {
  try { const raw = localStorage.getItem(STORAGE_KEY); if(!raw) return null; const p: StoredGamerWord = JSON.parse(raw); return p.dateKey === key ? p : null; } catch { return null; }
}
function save(val: StoredGamerWord) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(val)); } catch {} }

export function useGamerWordGame(dateKeyOverride?: string, endless?: boolean){
  const initialMeta = useMemo(()=>{
    if(endless) return getRandomGamerWord();
    if(dateKeyOverride) return getGamerWordForDate(dateKeyOverride);
    return getDailyGamerWord();
  }, [dateKeyOverride, endless]);
  const [meta, setMeta] = useState(initialMeta);
  useEffect(()=>{ if(!endless){ setMeta(initialMeta); } }, [initialMeta, endless]);
  const { answer, dateKey, prompt, maxGuesses, wordLength } = meta;
  const [guesses, setGuesses] = useState<string[]>([]);
  const [states, setStates] = useState<LetterState[][]>([]);
  const [solvedAt, setSolvedAt] = useState<number|undefined>();

  useEffect(()=>{
    const stored = load(dateKey);
    if(stored){
      setGuesses(stored.guesses);
      setStates(stored.states);
      if(stored.solved) setSolvedAt(stored.solvedAt);
    } else {
      setGuesses([]); setStates([]); setSolvedAt(undefined);
    }
  }, [dateKey]);

  useEffect(()=>{
    save({ dateKey, guesses, states, solved: !!solvedAt, solvedAt, version:1 });
  }, [dateKey, guesses, states, solvedAt]);

  const submit = useCallback((raw: string)=>{
    const guess = raw.trim().toLowerCase();
    if(guess.length !== wordLength) return { ok:false, reason:'length' as const };
    if(guesses.length >= maxGuesses) return { ok:false, reason:'limit' as const };
    if(solvedAt) return { ok:false, reason:'solved' as const };
    const evalStates = evaluateGuess(guess, answer);
    setGuesses(g=>[...g, guess]);
    setStates(s=>[...s, evalStates]);
    if(evalStates.every(s=>s==='correct')) setSolvedAt(Date.now());
    return { ok:true } as const;
  }, [answer, guesses.length, maxGuesses, solvedAt, wordLength]);

  const keyboardStates = useMemo(()=>{
    const map: Record<string, LetterState> = {};
    states.forEach((row,i)=>{
      row.forEach((st,idx)=>{
        const ch = guesses[i][idx];
        const prev = map[ch];
        if(st === 'correct' || (st === 'present' && prev !== 'correct') || !prev){
          map[ch] = st;
        }
      });
    });
    return map;
  }, [states, guesses]);

  const progress = useMemo(()=>{
    let bestCorrect = 0; let bestPresent = 0;
    states.forEach(r => {
      const correct = r.filter(s=>s==='correct').length;
      const present = r.filter(s=>s==='present').length;
      if(correct > bestCorrect) bestCorrect = correct;
      if(present > bestPresent) bestPresent = present;
    });
    return { bestCorrect, bestPresent };
  }, [states]);

  return {
    answer,
    dateKey,
    prompt,
    guesses,
    states,
    submit,
    keyboardStates,
    solved: !!solvedAt,
    failed: !solvedAt && guesses.length >= maxGuesses,
    remaining: maxGuesses - guesses.length,
    maxGuesses,
    wordLength,
    progress,
    restart: () => {
      if(endless){
        const next = getRandomGamerWord();
        setMeta(next);
        setGuesses([]);
        setStates([]);
        setSolvedAt(undefined);
      }
    }
  };
}
