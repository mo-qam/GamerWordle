import React from 'react';
import { Section } from './Section';

const faqs = [
  { q: 'When does the word reset?', a: 'At midnight UTC a fresh daily word is seeded.' },
  { q: 'Can a letter appear twice?', a: 'Yes, duplicates are possible—tile colors account for remaining unseen copies.' },
  { q: 'Do I need gaming knowledge?', a: 'Words are general gaming or patch related vocabulary—no niche lore required.' },
  { q: 'Will there be a hard mode?', a: 'Planned: forcing revealed greens/yellows to remain in future guesses.' },
  { q: 'Mobile friendly?', a: 'Yes—the layout and keyboard adapt to small screens.' }
];

export const FAQSection: React.FC = () => (
  <Section id="faq" title="FAQ" eyebrow="Answers" darker>
    <div className="divide-y divide-[#2c2c2e]">
      {faqs.map(f => (
        <div key={f.q} className="py-4">
          <h3 className="font-semibold text-slate-100 mb-1 text-sm tracking-wide">{f.q}</h3>
          <p className="text-xs text-slate-300 leading-relaxed">{f.a}</p>
        </div>
      ))}
    </div>
  </Section>
);
