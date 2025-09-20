import React from 'react';
import { Section } from './Section';

const tips = [
  { title: 'Open with Coverage', body: 'Start with a word that hits common consonants and at least two vowels to maximize early information.' },
  { title: 'Track Letter States', body: 'Greens lock position; yellows must move; grays are gone. Mentally bucket them to avoid wasted repeats.' },
  { title: 'Avoid Blind Repeats', body: 'Reusing a gray letter wastes a slot unless you are testing for duplicates deliberately.' },
  { title: 'Leverage Pattern Locks', body: 'When two greens appear, anchor your next guesses around that skeleton to collapse the search space.' },
  { title: 'Endgame Precision', body: 'By guess 4–5, shift from exploration to exact elimination so guess 6 is forced.' }
];

export const TipsSection: React.FC = () => (
  <Section id="tips" title="Strategy Tips" eyebrow="Improve">
    <div className="grid md:grid-cols-2 gap-6">
      {tips.map(t => (
        <div key={t.title} className="p-4 rounded-md bg-[#222224] border border-[#303033] hover:border-brand/50 transition-colors">
          <h3 className="font-semibold mb-1 text-slate-100 text-sm tracking-wide">{t.title}</h3>
          <p className="text-xs leading-relaxed text-slate-300">{t.body}</p>
        </div>
      ))}
    </div>
  </Section>
);
