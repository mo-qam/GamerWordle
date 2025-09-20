import React, { useState } from 'react';
import { useGamerWordGame } from '../state/useGamerWordGame';
import { loadStreakLevel, saveStreakLevel, awardForPuzzle, levelXpRequirement } from '../state/streakLevel';
import { GamerWordBoard } from '../components/GamerWordBoard';
import { shareResult } from '../logic/share';
import { buildGamerShareText } from '../logic/gamerShare';
import { playSfx, initSfxPreference, setSfxEnabled, getSfxEnabled } from '../audio/sfx';
import { Confetti } from '../components/Confetti';
import { LogoMark } from '../components/LogoMark';
import { HowToSection } from '../components/sections/HowToSection';
import { TipsSection } from '../components/sections/TipsSection';
import { FAQSection } from '../components/sections/FAQSection';
import { BenefitsSection } from '../components/sections/BenefitsSection';
import { RateSection } from '../components/sections/RateSection';

export const App: React.FC = () => {
  const [showStats, setShowStats] = useState(false);
  const [theme, setTheme] = useState<'dark'|'light'>(()=> (localStorage.getItem('pnd_theme') as 'dark'|'light') || 'dark');
  const [sfxEnabled, setSfxEnabledState] = useState<boolean>(true);
  const [activeDate, setActiveDate] = useState<string | undefined>(undefined);
  const gamerGame = useGamerWordGame(activeDate);
  const [currentInput, setCurrentInput] = useState('');
  const [slState, setSlState] = useState(()=> loadStreakLevel());
  React.useEffect(()=>{ initSfxPreference().then(()=> setSfxEnabledState(getSfxEnabled())); }, []);
  React.useEffect(()=>{
    const root = document.documentElement;
    const body = document.body;
    if(theme === 'dark') {
      root.classList.add('dark');
      body.classList.remove('light');
    } else {
      root.classList.remove('dark');
      body.classList.add('light');
    }
    localStorage.setItem('pnd_theme', theme);
  }, [theme]);
  React.useEffect(()=>{ /* mode removed */ }, []);

  React.useEffect(()=>{
    function onKey(e: KeyboardEvent){
      if(showStats) return;
      if(e.key === 'Enter'){ playSfx('enterKey'); attemptSubmit(); }
      else if(e.key === 'Backspace'){ setCurrentInput(v=> v.slice(0,-1)); playSfx('backKey'); }
      else if(/^[a-zA-Z]$/.test(e.key)){ setCurrentInput(v=> v.length < gamerGame.wordLength ? v + e.key.toLowerCase(): v); playSfx('typeKey'); }
    }
    window.addEventListener('keydown', onKey);
    return ()=> window.removeEventListener('keydown', onKey);
  }, [currentInput, showStats, gamerGame.wordLength]);
  const [statusMsg, setStatusMsg] = useState<string>('');
  const [failedNotified, setFailedNotified] = useState(false);
  const [shakeRowIndex, setShakeRowIndex] = useState<number|null>(null);
  React.useEffect(()=>{
    if(statusMsg){ const t=setTimeout(()=> setStatusMsg(''), 1400); return ()=> clearTimeout(t); }
  }, [statusMsg]);

  React.useEffect(()=>{
    if(gamerGame.failed && !failedNotified){
      playSfx('guessMiss');
      setFailedNotified(true);
      setStatusMsg(`Out of attempts • Answer: ${gamerGame.answer.toUpperCase()}`);
    }
    if(gamerGame.solved){
      setFailedNotified(true); // lock further failure notice
    }
  }, [gamerGame.failed, gamerGame.solved, gamerGame.answer, failedNotified]);
  function attemptSubmit(){
    const result = gamerGame.submit(currentInput);
    if(!result.ok){
      if(result.reason === 'length') setStatusMsg(`Must be ${gamerGame.wordLength} letters`);
      else if(result.reason === 'limit') setStatusMsg('No attempts left');
      else if(result.reason === 'solved') setStatusMsg('Already solved');
      playSfx('guessMiss');
      return;
    }
    const wasSolved = gamerGame.solved;
    if(currentInput === gamerGame.answer){
      playSfx('guessHit');
    } else {
      playSfx('guessMiss');
    }
    setCurrentInput('');
    // After a short timeout (state update), if solved newly, award.
    setTimeout(()=>{
      if(!wasSolved && gamerGame.solved){
        setSlState(prev => {
          const updated = awardForPuzzle(prev, gamerGame.dateKey, true, gamerGame.guesses.length, gamerGame.maxGuesses);
          saveStreakLevel(updated);
          return updated;
        });
      }
    }, 30);
  }
  return (
  <div className="min-h-screen wordle-bg text-white font-sans transition-colors relative overflow-x-hidden">
    <div className="pointer-events-none absolute inset-0 opacity-[0.07] pattern-grid" />
  <Confetti trigger={gamerGame.solved} />
      <header className="mx-auto max-w-xl px-3 sm:px-4 pt-[calc(0.65rem+env(safe-area-inset-top))] pb-2 border-b border-[#3a3a3c]">
        <div className="flex items-start md:items-center gap-2 md:gap-3 flex-wrap md:flex-nowrap relative">
          <div className="relative">
            <div className="absolute inset-0 rounded-md bg-gradient-to-br from-indigo-600/40 via-fuchsia-600/35 to-rose-600/35 blur-[3px]" />
            <div className="p-1 rounded-md border border-indigo-400/40 backdrop-blur-sm bg-[#0f172abf] shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_4px_12px_-2px_rgba(0,0,0,0.6)]">
              <LogoMark className="relative w-7 h-7" />
            </div>
          </div>
          <h1 className="m-0 flex-shrink text-[0.95rem] sm:text-base md:text-[1.18rem] font-extrabold tracking-[0.12em] sm:tracking-[0.16em] md:tracking-[0.18em] uppercase leading-none md:leading-snug flex items-baseline gap-1 max-w-[72vw] md:max-w-none">
            <span className="text-indigo-300 drop-shadow-[0_0_6px_rgba(99,102,241,0.55)]">Gamer</span>
            <span className="text-pink-300 drop-shadow-[0_0_6px_rgba(236,72,153,0.55)]">Wordle</span>
            <span className="sr-only">GamerWordle</span>
          </h1>
          <div className="absolute -bottom-1 left-[5.2rem] md:left-[5.6rem] right-0 h-px bg-gradient-to-r from-indigo-400/70 via-fuchsia-400/60 to-transparent pointer-events-none hidden md:block" />
          <div className="flex gap-1.5 md:gap-2 items-center ml-auto flex-nowrap md:whitespace-nowrap mt-2 md:mt-0">
          <div className="flex items-center gap-1.5 text-[0.52rem] font-semibold tracking-wide bg-slate-700/50 dark:bg-slate-700/60 px-1.5 py-1 rounded border border-slate-500/40">
            <div className="flex flex-col items-center leading-none">
              <span>STREAK</span>
              <span className="text-brand text-xs">{slState.streak}</span>
            </div>
            <div className="w-px h-6 bg-slate-500/40"/>
            <div className="flex flex-col items-center leading-none">
              <span>LVL</span>
              <span className="text-amber-400 text-xs">{slState.level}</span>
            </div>
            <div className="w-12 sm:w-14 h-1 rounded bg-slate-600 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-brand to-brand-dark" style={{ width: `${Math.min(100, (slState.xp / levelXpRequirement(slState.level)) * 100)}%` }} />
            </div>
          </div>
          <button onClick={()=>setTheme(t=> t==='dark'?'light':'dark')} className="flex items-center gap-1 rounded-md border border-slate-300 dark:border-slate-600/60 bg-white/70 dark:bg-slate-800/60 backdrop-blur px-3 py-1.5 text-[0.7rem] tracking-wide text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700/60 active:scale-[0.96] transition-all order-3 md:order-none">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {theme==='dark'? <circle cx="12" cy="12" r="5" /> : <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />}
            </svg>
            {theme==='dark'?'Light':'Dark'}
          </button>
          <button onClick={()=>{ setShowStats(s=>!s); playSfx(showStats? 'modalClose':'modalOpen'); }} className="flex items-center gap-1 rounded-md border border-slate-300 dark:border-slate-600/60 bg-white/70 dark:bg-slate-800/60 backdrop-blur px-3 py-1.5 text-[0.7rem] tracking-wide text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700/60 active:scale-[0.96] transition-all order-1 md:order-none">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20v-6"/><path d="M6 20V10"/><path d="M18 20V4"/></svg>
            Stats
          </button>
          <button onClick={()=>{ const next = !sfxEnabled; setSfxEnabled(next); setSfxEnabledState(next); playSfx('hintReveal'); }} className={`flex items-center gap-1 rounded-md border border-slate-300 dark:border-slate-600/60 px-3 py-1.5 text-[0.7rem] tracking-wide transition-all active:scale-[0.96] order-2 md:order-none ${sfxEnabled? 'bg-brand text-white hover:bg-brand-dark':'bg-white/70 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700/60'}`}> 
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {sfxEnabled ? <path d="M11 5 6 9H2v6h4l5 4V5z"/> : <><path d="m2 2 20 20" /><path d="M11 5 6 9H2v6h4l5 4V5z"/></>}
            </svg>
            {sfxEnabled? 'SFX':'Muted'}
          </button>
          </div>
        </div>
      </header>
  {statusMsg && (
    <div className="fixed z-50 top-[5.25rem] md:top-24 left-1/2 -translate-x-1/2 bg-[#538d4e] text-white px-4 py-2 rounded shadow text-sm anim-pop pointer-events-none">
      {statusMsg}
    </div>
  )}
  <nav className="sticky top-0 z-40 backdrop-blur bg-[#121213cc] border-b border-[#262628] hidden md:block">
        <ul className="flex gap-6 max-w-4xl mx-auto px-6 text-[0.7rem] font-semibold tracking-wide uppercase text-slate-400">
          {['how-to','tips','benefits','faq','rate'].map(id => (
            <li key={id}><a href={`#${id}`} className="py-3 inline-block hover:text-slate-200 transition-colors">{id.replace('-',' ')}</a></li>
          ))}
        </ul>
      </nav>
      <main className="mx-auto max-w-xl px-4 pb-10 pt-6 flex flex-col items-center gap-6">
        <div className="w-full max-w-md mx-auto">
          <div className={gamerGame.failed && !gamerGame.solved ? 'animate-fade-fail anim-shake' : ''}>
          <GamerWordBoard
            prompt={gamerGame.prompt}
            wordLength={gamerGame.wordLength}
            guesses={gamerGame.guesses}
            states={gamerGame.states}
            current={currentInput}
            keyboardStates={gamerGame.keyboardStates as any}
            remaining={gamerGame.remaining}
            solved={gamerGame.solved}
            onChar={(c)=> setCurrentInput(v=> v.length < gamerGame.wordLength ? v + c.toLowerCase(): v)}
            onBack={()=> setCurrentInput(v=> v.slice(0,-1))}
            onEnter={attemptSubmit}
            onKeySound={()=> playSfx('typeKey')}
          />
          </div>
          {gamerGame.failed && !gamerGame.solved && (
            <div className="mt-3 w-full text-center text-[0.65rem] tracking-wide text-rose-400 animate-pulse">Failed – Answer: {gamerGame.answer.toUpperCase()}</div>
          )}
          <div className="text-[0.6rem] tracking-wide uppercase text-slate-500 mt-1 text-center">
            Progress: {gamerGame.progress.bestCorrect}/{gamerGame.wordLength} correct • {gamerGame.progress.bestPresent} present
          </div>
          <div className="w-full mt-1 h-2 rounded bg-slate-700/50 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand to-brand-dark transition-[width] duration-500 ease-out"
              style={{ width: `${(gamerGame.progress.bestCorrect / gamerGame.wordLength) * 100}%` }}
            />
          </div>
        </div>
      </main>
      <HowToSection />
      <TipsSection />
      <BenefitsSection />
      <FAQSection />
      <RateSection />
  {/* Archive temporarily removed for classic mode rework */}
      <footer className="mx-auto max-w-3xl px-4 pb-8 text-center text-[0.65rem] text-slate-500 dark:text-slate-500">
  <small>&copy; {new Date().getFullYear()} GamerWordle</small>
      </footer>
      {showStats && (
        <div className="fixed inset-0 z-40 flex justify-center items-start pt-[8vh] bg-slate-900/80 backdrop-blur-sm anim-fade-scale">
          <div className="w-[min(520px,90%)] rounded-xl border border-slate-700/60 bg-slate-900/90 p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <h2 className="m-0 text-lg tracking-wide font-semibold">Stats</h2>
              <button onClick={()=>{ setShowStats(false); playSfx('modalClose'); }} className="text-slate-400 hover:text-slate-200 text-sm active:scale-95 transition-transform">Close</button>
            </div>
            <div className="flex gap-2 mb-4">
                <button onClick={()=>{ const payload = buildGamerShareText(gamerGame.dateKey, gamerGame.guesses, gamerGame.states, gamerGame.solved, gamerGame.prompt); shareResult(payload); playSfx('share'); }} className="bg-brand hover:bg-brand-dark text-white font-semibold text-sm px-3 py-2 rounded-md transition-colors active:scale-95">Share</button>
              <button onClick={()=>{navigator.clipboard?.writeText(JSON.stringify({puzzle: gamerGame.dateKey, attempts: gamerGame.guesses.length}));}} className="border border-slate-600 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-[0.7rem] px-3 py-2 rounded-md transition-colors">Copy Meta</button>
            </div>
              <div className="text-sm text-slate-300 mb-4">Attempts: {gamerGame.guesses.length}/{gamerGame.maxGuesses} {gamerGame.solved && '• Solved'} {gamerGame.solved && `| Answer: ${gamerGame.answer.toUpperCase()}`}</div>
              <ol className="space-y-1 mb-2 text-[0.7rem] font-mono text-slate-400">
                {gamerGame.guesses.map((g,i)=>(<li key={i}>{i+1}. {g}</li>))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};
