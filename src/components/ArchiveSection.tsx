import React, { useMemo } from 'react';

interface ArchiveSectionProps {
  currentId: string;
  onSelect: (id: string)=>void;
  days?: number;
}

function recentDateKeys(days: number): string[] {
  const arr: string[] = [];
  const today = new Date();
  for(let i=0;i<days;i++){
    const d = new Date(today.getTime() - i*86400000);
    arr.push(d.toISOString().slice(0,10));
  }
  return arr;
}

export const ArchiveSection: React.FC<ArchiveSectionProps> = ({ currentId, onSelect, days = 14 }) => {
  const keys = useMemo(()=> recentDateKeys(days), [days]);
  return (
    <section id="archive" className="max-w-xl mx-auto px-4 py-8">
      <h2 className="text-sm tracking-wide uppercase text-slate-300 mb-3 font-semibold">Archive</h2>
      <div className="flex flex-wrap gap-2">
        {keys.map(k => {
          const active = k === currentId;
          return (
            <button
              key={k}
              onClick={()=> onSelect(k)}
              className={`px-3 py-1.5 text-xs rounded-md border transition-colors active:scale-95 ${active? 'bg-brand text-white border-brand-dark':'bg-slate-800/60 border-slate-600/50 text-slate-300 hover:bg-slate-700/60'}`}
            >{k}</button>
          );
        })}
      </div>
      <p className="mt-3 text-[0.6rem] leading-relaxed text-slate-500">Select a previous date to view or attempt that day's prompt. Progress is stored locally per puzzle.</p>
    </section>
  );
};
