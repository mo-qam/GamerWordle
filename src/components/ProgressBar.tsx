import React from 'react';

interface Props { current: number; total: number; }
export const ProgressBar: React.FC<Props> = ({ current, total }) => {
  const pct = total ? (current / total) * 100 : 0;
  return (
    <div className="w-full mt-4 mb-2">
      <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-brand via-purple-500 to-pink-500 transition-[width] duration-500" style={{ width: pct + '%' }} />
      </div>
      <div className="mt-1 flex justify-between text-[0.6rem] tracking-wide uppercase text-slate-500 dark:text-slate-400">
        <span>Progress</span><span>{current}/{total}</span>
      </div>
    </div>
  );
};
