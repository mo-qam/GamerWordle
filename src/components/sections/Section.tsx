import React from 'react';

interface SectionProps { id: string; title: string; children: React.ReactNode; eyebrow?: string; darker?: boolean; }

export const Section: React.FC<SectionProps> = ({ id, title, children, eyebrow, darker }) => {
  return (
    <section id={id} className={`py-16 md:py-24 ${darker? 'bg-[#161617]':'bg-[#1d1d1f]'} border-t border-[#262628]`}> 
      <div className="max-w-4xl mx-auto px-5">
        <header className="mb-8">
          {eyebrow && <p className="text-xs tracking-wider uppercase text-brand mb-2 font-semibold">{eyebrow}</p>}
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-3">{title}<span className="h-1 w-16 inline-block bg-gradient-to-r from-brand to-purple-500 rounded-full"/></h2>
        </header>
        <div className="space-y-6 text-slate-300 text-sm leading-relaxed">
          {children}
        </div>
      </div>
    </section>
  );
};
