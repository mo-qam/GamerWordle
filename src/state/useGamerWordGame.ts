import { useCallback, useEffect, useMemo, useState } from 'react';
import { evaluateGuess, LetterState } from '../logic/classicEval';
import { ALL_CATEGORIES } from '../data/terms';
import { CATEGORY_WORDS } from '../data/categoryWords';
import { DAILY_WORDLE_POOL } from '../data/dailyWordlePool';
import { seedHash, mulberry32 } from '../logic/rng';

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

export function useGamerWordGame(dateKeyOverride?: string, endless?: boolean, categoryId?: string){
  // Helper to get candidate pool
  const getCandidates = () => {
    if(categoryId && categoryId !== 'all') {
      return CATEGORY_WORDS[categoryId] || [];
    }
    return DAILY_WORDLE_POOL;
  };

  // Helper to get word-to-category
  const getWordToCategory = () => {
    const map: Record<string,{id:string;label:string}> = {};
    for(const cat of ALL_CATEGORIES){
      const words = CATEGORY_WORDS[cat.id] || [];
      for(const w of words){
        const lower = w.toLowerCase();
        if(!map[lower]){
          map[lower] = { id: cat.id, label: cat.label };
        }
      }
    }
    return map;
  };

  // Custom daily and random word functions
  const getDailyWord = (dateStr?: string) => {
    const pool = getCandidates();
    const wordToCategory = getWordToCategory();
    const date = dateStr ? new Date(dateStr) : new Date();
    const key = date.getUTCFullYear() + '-' + (date.getUTCMonth()+1) + '-' + date.getUTCDate();
    const h = seedHash('gamerwords:' + key + ':' + (categoryId || 'all'));
    const rand = mulberry32(h);
    const idx = Math.floor(rand() * pool.length);
    const answer = pool[idx];
    const cat = wordToCategory[answer];
    const prompt = cat ? `Category: ${cat.label}` : '';
    return { answer, dateKey: key, categoryId: cat?.id || '', categoryLabel: cat?.label || '', prompt, wordLength: 5, maxGuesses: 6 };
  };
  const getRandomWord = () => {
    const pool = getCandidates();
    const wordToCategory = getWordToCategory();
    const idx = Math.floor(Math.random() * pool.length);
    const answer = pool[idx];
    const cat = wordToCategory[answer];
    const prompt = cat ? `Category: ${cat.label}` : '';
    return { answer, dateKey: 'endless-' + Date.now(), categoryId: cat?.id || '', categoryLabel: cat?.label || '', prompt, wordLength: 5, maxGuesses: 6 };
  };

  const initialMeta = useMemo(()=>{
    if(endless) return getRandomWord();
    if(dateKeyOverride) return getDailyWord(dateKeyOverride);
    return getDailyWord();
  }, [dateKeyOverride, endless, categoryId]);
  const [meta, setMeta] = useState(initialMeta);
  const [promptHistory, setPromptHistory] = useState<string[]>([initialMeta.prompt]);
  const [promptIndex, setPromptIndex] = useState(0);
  // When not in endless, keep meta in sync with daily; when switching into endless, force a fresh random word.
  useEffect(()=>{
    if(!endless){
      setMeta(initialMeta);
      setGuesses([]); setStates([]); setSolvedAt(undefined);
      setPromptHistory([initialMeta.prompt]);
      setPromptIndex(0);
    } else {
      // entering endless mode: generate a fresh word immediately
      const next = getRandomWord();
      setMeta(next);
      setGuesses([]); setStates([]); setSolvedAt(undefined);
      setPromptHistory([next.prompt]);
      setPromptIndex(0);
    }
  }, [initialMeta, endless]);
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
    const solvedNow = evalStates.every(s=>s==='correct');
    setGuesses(g=>[...g, guess]);
    setStates(s=>[...s, evalStates]);
    if(solvedNow) setSolvedAt(Date.now());
    return { ok:true, solvedNow } as const;
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
      const next = endless ? getRandomWord() : getDailyWord();
      setMeta(next);
      setGuesses([]);
      setStates([]);
      setSolvedAt(undefined);
      if(endless){
        setPromptHistory(h=>[...h, next.prompt]);
        setPromptIndex(p=>p+1);
      } else {
        setPromptHistory([next.prompt]);
        setPromptIndex(0);
      }
    },
    cyclePrompt: () => {
      if(!endless) return;
      const next = getRandomWord();
      setMeta(next);
      setGuesses([]); setStates([]); setSolvedAt(undefined);
      setPromptHistory(h=>[...h, next.prompt]);
      setPromptIndex(p=>p+1);
    },
    promptHistory,
    promptIndex
  };
}
