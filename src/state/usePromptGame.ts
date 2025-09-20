import { useCallback, useEffect, useMemo, useState } from 'react';
import { getDailyPromptPuzzle, getPromptPuzzleForDate } from '../logic/promptPuzzles';
import { evaluateGuess, LetterState } from '../logic/classicEval';

interface StoredPromptGame {
  id: string;
  attempts: string[];
  states: LetterState[][];
  solved: boolean;
  solvedAt?: number;
  version: number;
}

const LEGACY_STORAGE_KEY = 'pnd_prompt_v1';
const ARCHIVE_STORAGE_KEY = 'pnd_prompt_archive_v1';
const MAX_ATTEMPTS = 8; // allow more creativity than Wordle

interface ArchivePayload {
  version: number;
  puzzles: Record<string, StoredPromptGame>;
}

function migrateLegacy(): ArchivePayload | null {
  try {
    const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
    if(!legacyRaw) return null;
    const legacy: StoredPromptGame = JSON.parse(legacyRaw);
    const archive: ArchivePayload = { version:1, puzzles: { [legacy.id]: legacy } };
    localStorage.setItem(ARCHIVE_STORAGE_KEY, JSON.stringify(archive));
    localStorage.removeItem(LEGACY_STORAGE_KEY);
    return archive;
  } catch { return null; }
}

function loadArchive(): ArchivePayload {
  try {
    const raw = localStorage.getItem(ARCHIVE_STORAGE_KEY);
    if(!raw){
      return migrateLegacy() || { version:1, puzzles:{} };
    }
    const parsed: ArchivePayload = JSON.parse(raw);
    if(!parsed.puzzles) return { version:1, puzzles:{} };
    return parsed;
  } catch { return { version:1, puzzles:{} }; }
}

function savePuzzle(p: StoredPromptGame) {
  try {
    const archive = loadArchive();
    archive.puzzles[p.id] = p;
    localStorage.setItem(ARCHIVE_STORAGE_KEY, JSON.stringify(archive));
  } catch {}
}

export function usePromptGame(dateKey?: string) {
  const puzzle = useMemo(()=>{
    return dateKey ? getPromptPuzzleForDate(dateKey) : getDailyPromptPuzzle();
  }, [dateKey]);
  const { id, answer, prompt, bank } = puzzle;

  const [attempts, setAttempts] = useState<string[]>([]);
  const [states, setStates] = useState<LetterState[][]>([]);
  const [solvedAt, setSolvedAt] = useState<number|undefined>();

  useEffect(()=>{
    const archive = loadArchive();
    const stored = archive.puzzles[id];
    if(stored){
      setAttempts(stored.attempts);
      setStates(stored.states);
      if(stored.solved) setSolvedAt(stored.solvedAt);
    } else {
      setAttempts([]); setStates([]); setSolvedAt(undefined);
    }
  }, [id]);

  useEffect(()=>{
    savePuzzle({ id, attempts, states, solved: !!solvedAt, solvedAt, version:1 });
  }, [id, attempts, states, solvedAt]);

  const submit = useCallback((raw: string)=>{
    const guess = raw.trim().toLowerCase();
    if(!guess) return { ok:false, reason:'empty' } as const;
    if(guess.length !== answer.length) return { ok:false, reason:'length' } as const;
    if(attempts.length >= MAX_ATTEMPTS) return { ok:false, reason:'limit' } as const;
    if(solvedAt) return { ok:false, reason:'solved' } as const;
    if(bank && !guess.split('').every(ch => bank.includes(ch))) return { ok:false, reason:'letters' } as const;
    const evalStates = evaluateGuess(guess, answer);
    setAttempts(a => [...a, guess]);
    setStates(s => [...s, evalStates]);
    if(guess === answer) setSolvedAt(Date.now());
    return { ok:true } as const;
  }, [answer, attempts.length, solvedAt, bank]);

  const keyboardStates = useMemo(()=>{
    const map: Record<string, LetterState> = {};
    states.forEach((row, i)=> {
      row.forEach((st, idx)=>{
        const ch = attempts[i][idx];
        if(!ch) return;
        const prev = map[ch];
        if (st === 'correct' || (st === 'present' && prev !== 'correct') || !prev) map[ch] = st;
      });
    });
    return map;
  }, [states, attempts]);

  const progress = useMemo(()=>{
    let bestCorrect = 0; let bestPresent = 0;
    states.forEach((row)=>{
      let c = 0; let p = 0;
      row.forEach(st => { if(st==='correct') c++; else if(st==='present') p++; });
      if(c > bestCorrect) bestCorrect = c;
      if(p > bestPresent) bestPresent = p;
    });
    return { bestCorrect, bestPresent, answerLength: answer.length };
  }, [states, answer.length]);

  return {
    id,
    prompt,
    answer,
    bank,
    difficulty: (puzzle as any).difficulty,
    attempts,
    states,
    solved: !!solvedAt,
    solvedAt,
    submit,
    keyboardStates,
    progress,
    remaining: MAX_ATTEMPTS - attempts.length,
    maxAttempts: MAX_ATTEMPTS
  };
}
