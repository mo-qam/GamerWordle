import React, { useEffect, useRef } from 'react';

interface FireworksProps {
  trigger: boolean;
  duration?: number; // ms
}

interface Particle { x:number; y:number; vx:number; vy:number; life:number; maxLife:number; color:string; }

const COLORS = ['#f472b6','#818cf8','#c084fc','#34d399','#fbbf24','#60a5fa'];

export const Fireworks: React.FC<FireworksProps> = ({ trigger, duration = 3500 }) => {
  const canvasRef = useRef<HTMLCanvasElement|null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const startRef = useRef<number|undefined>();

  useEffect(()=>{
    if(!trigger) return;
    const canvas = canvasRef.current; if(!canvas) return;
    const ctx = canvas.getContext('2d'); if(!ctx) return;

    let frame: number;
    particlesRef.current = [];
    startRef.current = performance.now();

    function resize(){
      if(!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function spawnBurst(){
      if(!canvas) return;
      const cx = (Math.random()*0.6+0.2) * canvas.width;
      const cy = (Math.random()*0.4+0.15) * canvas.height;
      const count = 45 + Math.floor(Math.random()*25);
      for(let i=0;i<count;i++){
        const angle = (Math.PI*2) * (i/count) + Math.random()*0.2;
        const speed = 1.5 + Math.random()*3.5;
        particlesRef.current.push({
          x: cx, y: cy,
          vx: Math.cos(angle)*speed,
            vy: Math.sin(angle)*speed - 1.2,
          life: 0,
          maxLife: 900 + Math.random()*600,
          color: COLORS[Math.floor(Math.random()*COLORS.length)]
        });
      }
    }

    // initial bursts
    for(let b=0;b<3;b++) setTimeout(spawnBurst, b*220);
    // mid bursts
    const midInterval = setInterval(()=>{ if(performance.now() - (startRef.current||0) < duration-600) spawnBurst(); }, 600);

    function tick(now:number){
      if(!canvas || !ctx) return;
      const elapsed = now - (startRef.current||0);
      ctx.clearRect(0,0,canvas.width, canvas.height);

      // fade backdrop
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0)';
  ctx.fillRect(0,0,canvas.width, canvas.height);
  ctx.restore();

      const g = 0.028;
      particlesRef.current.forEach(p=>{
        p.life += 16.6;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += g;
      });
      particlesRef.current = particlesRef.current.filter(p=> p.life < p.maxLife);

      particlesRef.current.forEach(p=>{
        const t = p.life / p.maxLife;
        const alpha = t < 0.7 ? 1 - t*0.7 : Math.max(0, 1 - (t-0.7)/0.3);
        ctx.beginPath();
        ctx.fillStyle = p.color + Math.floor(alpha*255).toString(16).padStart(2,'0');
        ctx.arc(p.x, p.y, 2.2 + (1-t)*1.5, 0, Math.PI*2);
        ctx.fill();
      });

      if(elapsed < duration || particlesRef.current.length){
        frame = requestAnimationFrame(tick);
      }
    }

    frame = requestAnimationFrame(tick);
    return ()=>{ cancelAnimationFrame(frame); clearInterval(midInterval); window.removeEventListener('resize', resize); };
  }, [trigger, duration]);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-[60]" aria-hidden="true" />;
};
