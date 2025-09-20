import React from 'react';
import { GuessRecord } from '../state/usePuzzleState';

interface Props {
  guesses: GuessRecord[];
}

export const GuessHistory: React.FC<Props> = ({ guesses }) => {
  if (!guesses.length) return null;
  return (
    <div className="mt-4">
      <h3 className="text-[0.9rem] mb-1 tracking-wide uppercase text-slate-400 font-medium">History</h3>
      <ul className="max-h-[140px] overflow-y-auto rounded-md border border-slate-700/60 bg-slate-900/70 divide-y divide-slate-700/60">
        {guesses.slice().reverse().map(g => (
          <li key={g.ts} className="px-2.5 py-1.5 flex justify-between font-mono text-sm">
            <span className="text-slate-100">{g.guess}</span>
            <span className={g.matched.length ? 'text-green-400':'text-slate-500'}>{g.matched.length ? `+${g.matched.length}`:'—'}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
