import React from 'react';
import { Section } from './Section';

export const HowToSection: React.FC = () => (
  <Section id="how-to" title="How To Play" eyebrow="Guide">
    <ol className="list-decimal ml-5 space-y-3">
      {[ 
        {t:'Enter Letters', d:'Type letters or use the on‑screen keyboard to build a 5‑letter word.'},
        {t:'Submit', d:'Press Enter to lock your guess. Tiles flip to show feedback.'},
        {t:'Color Feedback', d:'Green = correct spot, Yellow = in word wrong spot, Gray = not present.'},
        {t:'Refine', d:'Use keyboard coloring to eliminate impossibilities and narrow the answer.'},
  {t:'Solve Daily', d:'You have 6 attempts to uncover the daily gamer word.'}
      ].map(step => (
        <li key={step.t}>
          <p className="font-semibold text-slate-200">{step.t}</p>
          <p>{step.d}</p>
        </li>
      ))}
    </ol>
  </Section>
);
