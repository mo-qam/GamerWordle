import { LetterState } from './classicEval';
import { SharePayload } from './share';

export function buildGamerShareText(id: string, guesses: string[], states: LetterState[][], solved: boolean, prompt: string): SharePayload {
  const header = `GamerWordle ${id} ${solved? guesses.length:'X'}/${guesses.length}`;
  const grid = states.map(row => row.map(st => st==='correct'?'🟩': st==='present'?'🟨':'⬛').join('')).join('\n');
  const url = typeof location !== 'undefined' ? location.origin : '';
  return { text: `${header}\n${prompt}\n${grid}\n${url}`.trim() };
}