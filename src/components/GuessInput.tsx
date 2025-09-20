import React, { useState } from 'react';

interface Props {
  onSubmitGuess: (guess: string) => void;
  disabled?: boolean;
}

export const GuessInput: React.FC<Props> = ({ onSubmitGuess, disabled }) => {
  const [val, setVal] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!val.trim()) return;
    onSubmitGuess(val);
    setVal('');
  };
  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
      <input
        value={val}
        onChange={e=>setVal(e.target.value)}
        placeholder="Guess a word"
        disabled={disabled}
        className="flex-1 rounded-md border border-slate-600/60 bg-slate-800/60 px-3 py-2 text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed" />
      <button
        type="submit"
        disabled={disabled}
        className="px-4 py-2 rounded-md font-semibold bg-brand hover:bg-brand-dark text-white transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
      >Enter</button>
    </form>
  );
};
