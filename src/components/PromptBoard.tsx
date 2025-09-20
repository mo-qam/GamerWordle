import React from 'react';
import { LetterState } from '../logic/classicEval';

interface PromptBoardProps {
  prompt: string;
  answerLength: number;
  attempts: string[];
  states: LetterState[][];
  currentInput: string;
  bank?: string[];
  keyboardStates?: Record<string, LetterState>;
  onChar: (c: string)=>void;
  onBack: ()=>void;
  onSubmit: ()=>void;
  solved: boolean;
  remaining: number;
  difficulty?: 'easy' | 'medium' | 'hard';
}

function tileClass(state: LetterState): string {
  switch(state){
    case 'correct': return 'wordle-correct';
    case 'present': return 'wordle-present';
    case 'absent': return 'wordle-absent';
    default: return 'wordle-empty';
  }
}

export const PromptBoard: React.FC<PromptBoardProps> = ({ prompt, answerLength, attempts, states, currentInput, bank, keyboardStates, onChar, onBack, onSubmit, solved, remaining, difficulty }) => {
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="rounded-lg border border-slate-600/40 bg-slate-800/40 dark:bg-slate-800/60 p-3 text-[0.75rem] leading-relaxed text-slate-200 dark:text-slate-300 flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-brand tracking-wide uppercase mr-1">Prompt</span>
          {difficulty && (
            <span className={`px-2 py-0.5 rounded text-[0.55rem] font-bold uppercase tracking-wide ${difficulty==='easy'?'bg-green-600/70 text-white':difficulty==='medium'?'bg-amber-500/80 text-black':'bg-rose-600/80 text-white'}`}>{difficulty}</span>
          )}
        </div>
        <div>{prompt}</div>
      </div>
      <div className="flex flex-col gap-2">
        {attempts.map((g,i)=>(
          <div key={i} className="grid grid-cols-12 gap-1 justify-items-center">
            {g.split('').map((ch, idx)=>(
              <div
                key={idx}
                style={{ animationDelay: `${idx * 120}ms` }}
                className={`w-8 h-8 md:w-9 md:h-9 flex items-center justify-center font-bold text-sm rounded-sm border ${tileClass(states[i][idx])} anim-flip`}
              >{ch.toUpperCase()}</div>
            ))}
          </div>
        ))}
        {!solved && (
          <div className="grid grid-cols-12 gap-1 justify-items-center">
            {Array.from({length: Math.max(currentInput.length, answerLength)}).map((_, idx)=>{
              const ch = currentInput[idx];
              return <div key={idx} className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center font-bold text-sm rounded-sm border wordle-empty text-slate-400">{ch? ch.toUpperCase(): ''}</div>;
            })}
          </div>
        )}
      </div>
      {bank && (
        <div className="flex flex-wrap gap-1 p-2 rounded-md border border-slate-600/40 bg-slate-800/30">
          {bank.map(l => {
            const st = keyboardStates?.[l];
            const base = 'px-2 py-1 text-xs rounded font-semibold active:scale-95 transition-colors transition-transform hover:scale-105';
            const cls = st === 'correct' ? 'wordle-correct'
              : st === 'present' ? 'wordle-present'
              : st === 'absent' ? 'wordle-absent'
              : 'bg-slate-700 hover:bg-slate-600 text-slate-200';
            return <button key={l} onClick={()=> onChar(l.toUpperCase())} disabled={solved} className={`${base} ${cls}`}>{l.toUpperCase()}</button>;
          })}
          <button onClick={onBack} disabled={solved} className="px-2 py-1 text-xs rounded bg-slate-700 hover:bg-slate-600 text-slate-300">Del</button>
          <button onClick={onSubmit} disabled={solved} className="px-3 py-1 text-xs rounded bg-brand hover:bg-brand-dark text-white font-semibold">Enter</button>
        </div>
      )}
      <div className="text-[0.65rem] uppercase tracking-wide text-slate-400 text-center">{solved? 'Solved!' : `${remaining} attempts left`}</div>
    </div>
  );
};
