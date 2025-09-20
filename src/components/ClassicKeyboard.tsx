import React from 'react';
import { LetterState } from '../logic/classicEval';

interface Props { onKey: (ch: string) => void; states: Record<string, LetterState>; disabled?: boolean; }

const ROWS = ['QWERTYUIOP','ASDFGHJKL','ZXCVBNM'];

function keyClass(state?: LetterState) {
  switch(state){
    case 'correct': return 'wordle-correct';
    case 'present': return 'wordle-present';
    case 'absent': return 'wordle-absent';
    default: return 'bg-[#818384] text-white';
  }
}

export const ClassicKeyboard: React.FC<Props> = ({ onKey, states, disabled }) => {
  return (
    <div className="mt-6 space-y-2 select-none">
      {ROWS.map((row, idx) => (
        <div key={idx} className="flex justify-center gap-1">
          {row.split('').map(ch => (
            <button
              key={ch}
              disabled={disabled}
              onClick={()=>onKey(ch)}
              className={`h-12 min-w-[2.4rem] px-1 rounded-sm text-[0.8rem] font-semibold uppercase transition-colors ${keyClass(states[ch.toLowerCase()])} disabled:opacity-40 disabled:cursor-not-allowed`}
            >{ch}</button>
          ))}
          {idx === ROWS.length-1 && (
            <>
              <button disabled={disabled} onClick={()=>onKey('ENTER')} className="h-12 px-3 rounded-sm text-[0.65rem] font-semibold bg-[#565758] text-white">Enter</button>
              <button disabled={disabled} onClick={()=>onKey('BACK')} className="h-12 px-3 rounded-sm text-[0.65rem] font-semibold bg-[#565758] text-white">Del</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};
