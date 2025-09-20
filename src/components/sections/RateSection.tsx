import React from 'react';
import { Section } from './Section';
// Classic share logic removed; section now purely informational for prompt mode.

export const RateSection: React.FC = () => {
  return (
    <Section id="rate" title="Share & Support" eyebrow="Community" darker>
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        <div className="flex-1 space-y-4">
          <p>Enjoy the daily GamerWordle puzzle? Use the Share button in the stats panel after your attempts to post your grid and invite a friend. More players means more curated categories, better prompts, and future features.</p>
          <div className="flex gap-3 flex-wrap">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="px-4 py-2 rounded-md bg-[#303033] hover:bg-[#3a3a3c] text-xs font-semibold tracking-wide text-slate-200">Star Repo</a>
          </div>
        </div>
        <div className="flex items-center gap-1 text-2xl" aria-label="rating mock">
          {'★★★★★'.split('').map((s,i)=>(<span key={i} className="text-[#6aaa64] drop-shadow">★</span>))}
        </div>
      </div>
    </Section>
  );
};
