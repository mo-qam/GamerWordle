// Simple audio manager with lightweight embedded sounds (generated sine tones)
// Avoids bundling external binary assets for now.

interface PlayOptions { volume?: number; playbackRate?: number; }

type SfxKey = 'guessHit' | 'guessMiss' | 'blankFill' | 'hintReveal' | 'modalOpen' | 'modalClose' | 'share' | 'typeKey' | 'enterKey' | 'backKey';

const ctx = typeof window !== 'undefined' ? new (window.AudioContext || (window as any).webkitAudioContext)() : null;

// Utility to generate a short tone buffer
function tone(freq: number, durationMs: number, type: OscillatorType = 'sine'): Promise<AudioBuffer> {
  if(!ctx) return Promise.reject();
  const duration = durationMs / 1000;
  const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i=0; i<data.length; i++) {
    const t = i / ctx.sampleRate;
    // basic envelope (attack/decay)
    const env = Math.min(t / 0.01, 1) * (1 - Math.min(Math.max((t - (duration - 0.05)) / 0.05, 0), 1));
    data[i] = Math.sin(2 * Math.PI * freq * t) * env * 0.7;
  }
  return Promise.resolve(buffer);
}

// Build a simple triad chord by layering tones
async function chord(frequencies: number[], durationMs: number): Promise<AudioBuffer> {
  if(!ctx) return Promise.reject();
  const parts = await Promise.all(frequencies.map(f=> tone(f, durationMs, 'sine')));
  const duration = durationMs/1000;
  const out = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
  const data = out.getChannelData(0);
  parts.forEach(p=>{
    const d = p.getChannelData(0);
    for(let i=0;i<d.length;i++){ data[i] += d[i] / parts.length; }
  });
  return out;
}

// White noise burst (for backspace)
function noise(durationMs: number): Promise<AudioBuffer> {
  if(!ctx) return Promise.reject();
  const duration = durationMs/1000;
  const buf = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for(let i=0;i<data.length;i++){
    const t = i/ctx.sampleRate;
    const env = Math.min(t/0.008,1) * (1-Math.min(Math.max((t-(duration-0.04))/0.04,0),1));
    data[i] = (Math.random()*2-1) * 0.55 * env;
  }
  return Promise.resolve(buf);
}

const cache: Partial<Record<string, AudioBuffer>> = {};

async function getBuffer(key: string, gen: ()=>Promise<AudioBuffer>): Promise<AudioBuffer> {
  if (cache[key]) return cache[key]!;
  const buf = await gen();
  cache[key] = buf;
  return buf;
}

async function playBuffer(buf: AudioBuffer, { volume=1, playbackRate=1 }: PlayOptions = {}) {
  if(!ctx) return;
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const gain = ctx.createGain();
  gain.gain.value = volume;
  src.playbackRate.value = playbackRate;
  src.connect(gain).connect(ctx.destination);
  src.start();
}

const generators: Record<SfxKey, ()=>Promise<AudioBuffer>> = {
  guessHit: () => tone(520, 120, 'sine'),
  guessMiss: () => tone(180, 160, 'sine'),
  blankFill: () => tone(720, 140, 'triangle'),
  hintReveal: () => tone(400, 110, 'square'),
  typeKey: () => tone(360, 55, 'square'),
  enterKey: () => chord([480, 600, 720], 190),
  backKey: () => noise(110),
  modalOpen: () => tone(300, 130, 'sine'),
  modalClose: () => tone(240, 120, 'sine'),
  share: () => tone(600, 150, 'triangle'),
};

let enabled = true;

// Default volume per effect
const volumeMap: Partial<Record<SfxKey, number>> = {
  typeKey: 0.32,
  backKey: 0.38,
  enterKey: 0.55,
  guessHit: 0.85,
  guessMiss: 0.75,
  modalOpen: 0.55,
  modalClose: 0.5,
  share: 0.65,
  hintReveal: 0.6,
  blankFill: 0.6,
};

export function setSfxEnabled(v: boolean) { enabled = v; localStorage.setItem('pnd_sfx', v ? '1':'0'); }
export function getSfxEnabled() { return enabled; }

export async function initSfxPreference() {
  const val = localStorage.getItem('pnd_sfx');
  if (val !== null) enabled = val === '1';
}

export async function playSfx(key: SfxKey, opts?: PlayOptions) {
  if(!enabled) return;
  try {
    const buf = await getBuffer(key, generators[key]);
    let finalOpts = { ...opts } as PlayOptions;
    if(finalOpts.volume === undefined){
      const v = volumeMap[key];
      if(v !== undefined) finalOpts.volume = v;
    }
    if(key === 'typeKey' || key === 'enterKey' || key === 'backKey'){
      const base = opts?.playbackRate ?? 1;
      finalOpts.playbackRate = base * (0.95 + Math.random()*0.1); // +/-5%
    }
    playBuffer(buf, finalOpts);
  } catch {/* ignore */}
}
