import React from 'react';
import { DailyPuzzle } from '../logic/puzzle';

interface Props {
  puzzle: DailyPuzzle;
  blanksFilled: Record<string, boolean>;
}

export const PatchLines: React.FC<Props> = ({ puzzle, blanksFilled }) => {
  return (
    <div>
      {puzzle.lines.map((line, idx) => (
        <div key={idx} className="mb-3 text-[1.05rem] leading-snug">
          {line.tokens.map((t,i)=>{
            if (t.blankId) {
              const blank = puzzle.blanks[t.blankId];
              const filled = blanksFilled[t.blankId];
              const minWidth = { minWidth: blank.length * 0.6 + 'ch' } as React.CSSProperties;
              return (
                <span
                  key={i}
                  className={`inline-block text-center mr-1 px-1 py-0.5 rounded-md border-b-2 ${filled? 'border-green-400 text-green-300 font-semibold anim-pop shadow-[0_0_0_1px_rgba(74,222,128,0.4),0_0_12px_-2px_rgba(74,222,128,0.6)] bg-gradient-to-br from-emerald-700/40 to-emerald-900/40':'border-sky-300 text-sky-300 hover:scale-[1.05] hover:text-brand bg-gradient-to-br from-slate-700/40 to-slate-900/40 hover:from-brand/30 hover:to-purple-700/30'} transition-all duration-200 select-none backdrop-blur-sm ring-1 ring-white/5`}
                  style={minWidth}
                  title={t.blankId}
                >{filled ? blank.answer.toUpperCase() : '_'.repeat(Math.max(4, Math.min(blank.length, 10)))}</span>
              );
            }
            return <span key={i} className="mr-1">{t.text}</span>;
          })}
        </div>
      ))}
    </div>
  );
};
