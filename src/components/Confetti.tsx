import React, { useEffect, useState } from 'react';

interface ConfettiPiece { id: number; left: string; delay: string; color: string; size: string; }

const COLORS = ['#6366f1','#fbbf24','#4ade80','#f472b6','#38bdf8'];

function makePieces(n=22): ConfettiPiece[] {
  return Array.from({ length: n }).map((_,i)=>({
    id: i,
    left: Math.random()*100 + '%',
    delay: (Math.random()*0.8).toFixed(2)+'s',
    color: COLORS[i % COLORS.length],
    size: (Math.random()*6 + 6).toFixed(0)+'px'
  }));
}

export const Confetti: React.FC<{trigger: boolean}> = ({ trigger }) => {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  useEffect(()=>{ if(trigger) setPieces(makePieces()); }, [trigger]);
  if(!trigger) return null;
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-50">
      {pieces.map(p => (
        <span key={p.id} style={{
          position:'absolute',
          top:'-10%',
          left:p.left,
          width:p.size,
          height:p.size,
          background:p.color,
          borderRadius:'2px',
          animation:'confetti 3.2s linear forwards',
          animationDelay: p.delay,
          transformOrigin:'center'
        }} />
      ))}
    </div>
  );
};
