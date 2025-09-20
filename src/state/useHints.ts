import { useState } from 'react';
import { DailyPuzzle } from '../logic/puzzle';

export interface HintState {
  lettersRevealed: Record<string, number>; // blankId -> letters count
  wordsRevealed: Record<string, boolean>;
  totalActions: number;
}

export function useHints(puzzle: DailyPuzzle) {
  const [state, setState] = useState<HintState>({ lettersRevealed:{}, wordsRevealed:{}, totalActions:0 });

  function revealLetter(blankId: string) {
    setState(prev => {
      const current = prev.lettersRevealed[blankId] || 0;
      const next = Math.min(current + 1, puzzle.blanks[blankId].answer.length - 1);
      return { ...prev, lettersRevealed: { ...prev.lettersRevealed, [blankId]: next }, totalActions: prev.totalActions + 1 };
    });
  }

  function revealWord(blankId: string) {
    setState(prev => ({ ...prev, wordsRevealed: { ...prev.wordsRevealed, [blankId]: true }, totalActions: prev.totalActions + 1 }));
  }

  return { state, revealLetter, revealWord };
}
