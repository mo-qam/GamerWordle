import React from 'react';
import { LetterState } from '../logic/classicEval';

interface Props { guesses: string[]; states: LetterState[][]; rows: number; wordLength: number; currentInput: string; }

function tileClasses(state: LetterState) {
  switch(state){
    case 'correct': return 'wordle-correct';
    case 'present': return 'wordle-present';
    case 'absent': return 'wordle-absent';
    default: return 'wordle-empty';
  }
}

export const ClassicBoard: React.FC<Props> = ({ guesses, states, rows, wordLength, currentInput }) => {
  const filledRows = guesses.length;
  return (
    <div className="grid gap-2" style={{gridTemplateRows:`repeat(${rows},minmax(0,1fr))`}}>
      {Array.from({ length: rows }).map((_, rowIdx) => {
        const guess = guesses[rowIdx] || '';
        const stateRow = states[rowIdx];
        const isCurrent = rowIdx === filledRows && !stateRow;
        const reveal = !!stateRow;
        return (
          <div key={rowIdx} className="grid gap-2" style={{gridTemplateColumns:`repeat(${wordLength},minmax(0,1fr))`}}>
            {Array.from({ length: wordLength }).map((__, colIdx) => {
              let letter = guess[colIdx] || '';
              if (isCurrent) {
                letter = currentInput[colIdx] || '';
              }
              const lState: LetterState = stateRow ? stateRow[colIdx] : (letter? 'empty':'empty');
              const delayClass = reveal ? `anim-flip anim-delay-${colIdx}` : (letter? 'anim-pop':'');
              return (
                <div key={colIdx} className={`aspect-square flex items-center justify-center rounded-sm border font-bold text-xl uppercase select-none transition-colors duration-500 ${tileClasses(lState)} ${delayClass}`}>
                  {letter}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
