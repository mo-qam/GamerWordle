import React from 'react';

interface Badge { id: string; label: string; achieved: boolean; description: string; }
interface Props { streak: number; accuracyPct: number; blanksSolved: number; total: number; }

function deriveBadges(streak: number, accuracyPct: number, blanksSolved: number, total: number): Badge[] {
  return [
    { id: 'streak3', label: 'Streak 3+', achieved: streak >= 3, description: 'Maintain a 3 day streak' },
    { id: 'streak7', label: 'Streak 7', achieved: streak >= 7, description: 'One full week streak' },
    { id: 'accurate70', label: 'Sharpshooter', achieved: accuracyPct >= 70, description: '70% accuracy or higher' },
    { id: 'allSolved', label: 'Full Clear', achieved: blanksSolved === total, description: 'Solve all blanks' }
  ];
}

export const Badges: React.FC<Props> = ({ streak, accuracyPct, blanksSolved, total }) => {
  const badges = deriveBadges(streak, accuracyPct, blanksSolved, total);
  return (
    <div className="mt-4">
      <h3 className="text-[0.7rem] tracking-wide uppercase text-slate-400 mb-2">Badges</h3>
      <div className="grid gap-2" style={{gridTemplateColumns:'repeat(auto-fit,minmax(110px,1fr))'}}>
        {badges.map(b => (
          <div key={b.id} className={`relative rounded-md px-2 py-2 border text-center text-[0.6rem] tracking-wide ${b.achieved? 'border-green-400/60 bg-green-500/10 text-green-300 shadow-glow':'border-slate-600 bg-slate-800/60 text-slate-400'} transition-colors`}> 
            <div className="font-semibold mb-0.5">{b.label}</div>
            <div className="opacity-70 leading-snug">{b.description}</div>
            {!b.achieved && <div className="absolute inset-0 rounded-md pointer-events-none animate-pulse-border" />}
          </div>
        ))}
      </div>
    </div>
  );
};
