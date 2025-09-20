import React from 'react';
import { LetterState } from '../logic/classicEval';

interface GamerWordBoardProps {
  prompt: string;
  wordLength: number;
  guesses: string[];
  states: LetterState[][];
  current: string;
  keyboardStates: Record<string, LetterState>;
  onChar: (c:string)=>void;
  onKeySound?: ()=>void;
  onBack: ()=>void;
  onEnter: ()=>void;
  remaining: number;
  solved: boolean;
}

function tileClass(state: LetterState){
  switch(state){
    case 'correct': return 'shade-correct';
    case 'present': return 'shade-present';
    case 'absent': return 'shade-absent';
    default: return 'shade-empty';
  }
}

const ROWS_MAX = 6;
const KEY_ROWS = [
  'qwertyuiop'.split(''),
  'asdfghjkl'.split(''),
  ['Enter',... 'zxcvbnm'.split(''),'Del']
];

export const GamerWordBoard: React.FC<GamerWordBoardProps> = ({ prompt, wordLength, guesses, states, current, keyboardStates, onChar, onBack, onEnter, remaining, solved, onKeySound }) => {
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="rounded-lg border border-slate-600/40 bg-slate-800/40 dark:bg-slate-800/60 p-3 text-[0.75rem] leading-relaxed text-slate-200 dark:text-slate-300 flex flex-col gap-1">
        <span className="font-semibold text-brand tracking-wide uppercase mr-1">Prompt</span>
        <div>{prompt}</div>
      </div>
      <div className="flex flex-col gap-1">
        {Array.from({length: ROWS_MAX}).map((_,rowIdx)=>{
          const g = guesses[rowIdx];
            return (
              <div key={rowIdx} className="grid grid-cols-5 gap-1 justify-items-center">
                {Array.from({length: wordLength}).map((__,colIdx)=>{
                  const filled = g ? g[colIdx] : (rowIdx === guesses.length ? current[colIdx]: undefined);
                  const state: LetterState = g ? states[rowIdx][colIdx] : 'empty';
                  return (
                    <div key={colIdx} className={`shade-outer w-12 h-12 md:w-14 md:h-14 flex items-center justify-center text-lg shade-tile ${tileClass(state)} ${!g && filled? 'animate-pulse':''}`}>{filled? filled.toUpperCase(): ''}</div>
                  );
                })}
              </div>
            );
        })}
      </div>
      <div className="flex flex-col gap-1 select-none">
        {KEY_ROWS.map((row,i)=>(
          <div key={i} className="flex justify-center gap-1">
            {row.map(key=>{
              if(key==='Enter') return <button key={key} onClick={()=>{ onKeySound?.(); onEnter(); }} disabled={solved} className="px-3 py-2 text-[0.65rem] shade-outer shade-key shade-correct active:scale-95" data-sfx="enter">Enter</button>;
              if(key==='Del') return <button key={key} onClick={()=>{ onKeySound?.(); onBack(); }} disabled={solved} className="px-3 py-2 text-[0.65rem] shade-outer shade-key shade-absent active:scale-95" data-sfx="back">Del</button>;
              const st = keyboardStates[key];
              const base = 'flex-1 min-w-[2rem] px-2 py-2 shade-outer shade-key';
              const cls = st==='correct' ? 'shade-correct' : st==='present' ? 'shade-present' : st==='absent' ? 'shade-absent' : 'shade-empty hover:brightness-110';
              return <button key={key} onClick={()=>{ onChar(key); onKeySound?.(); }} disabled={solved} className={`${base} ${cls}`}>{key.toUpperCase()}</button>;
            })}
          </div>
        ))}
      </div>
      <div className="text-[0.65rem] uppercase tracking-wide text-slate-400 text-center">{solved ? 'Solved!' : `${remaining} attempts left`}</div>
    </div>
  );
};
