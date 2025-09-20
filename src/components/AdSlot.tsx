import React from 'react';

interface Props {
  id: string;
  type?: 'banner' | 'square' | 'footer';
}

// Simple placeholder; real ad code can be dynamically injected later.
export const AdSlot: React.FC<Props> = ({ id, type='banner' }) => {
  const minH = type==='banner'? 'h-[60px]': type==='footer'? 'h-[90px]':'h-[250px]';
  return (
    <div
      data-ad-slot={id}
      className={`mt-5 ${minH} rounded-lg border border-dashed border-slate-600/50 bg-slate-800/40 flex items-center justify-center text-[0.65rem] tracking-wide text-slate-400`}
    >
      AD SLOT {id.toUpperCase()} ({type})
    </div>
  );
};
