import React from 'react';
import { Section } from './Section';

const benefits = [
  { icon: '🎯', title: 'Daily Focus Burst', body: 'One quick cognitive warm‑up: pattern scan, hypothesis, refine.' },
  { icon: '🧠', title: 'Vocabulary Lift', body: 'Reinforces mid-frequency gaming & systems terminology.' },
  { icon: '⚡', title: 'Fast Loop', body: 'Micro session design—60–180 seconds typical completion window.' },
  { icon: '📈', title: 'Skill Tracking', body: 'Share string + internal stats let you watch consistency improve.' },
  { icon: '🤝', title: 'Social Sync', body: 'Same target word worldwide—implicit shared mini‑event each day.' },
  { icon: '🌙', title: 'Low Friction', body: 'No login, no clutter—open, solve, done.' }
];

export const BenefitsSection: React.FC = () => (
  <Section id="benefits" title="Why Play" eyebrow="Benefits">
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
      {benefits.map(b => (
        <div key={b.title} className="p-5 rounded-lg bg-[#222224] border border-[#303033] flex flex-col gap-2 hover:border-brand/50 transition-colors">
          <div className="text-2xl" aria-hidden>{b.icon}</div>
          <h3 className="text-sm font-semibold text-slate-100 tracking-wide">{b.title}</h3>
          <p className="text-xs text-slate-300 leading-relaxed">{b.body}</p>
        </div>
      ))}
    </div>
  </Section>
);
