import { LetterState } from './classicEval';
import { SharePayload } from './share';

export function buildPromptShareText(id: string, attempts: string[], states: LetterState[][], solved: boolean, difficulty?: string): SharePayload {
  const diff = difficulty ? `(${difficulty}) ` : '';
  const header = `GamerWordle ${diff}${id} ${solved? attempts.length:'X'}/${attempts.length}`;
  const body = states.map(row => row.map(st => {
    if(st === 'correct') return '🟩';
    if(st === 'present') return '🟨';
    if(st === 'absent') return '⬛';
    return '▫️';
  }).join('')).join('\n');
  const url = typeof location !== 'undefined' ? location.origin : '';
  return { text: `${header}\n${body}\n${url}`.trim() };
}
