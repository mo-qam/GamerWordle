export type LetterState = 'correct' | 'present' | 'absent' | 'empty';

export interface EvaluatedGuess {
  guess: string;
  states: LetterState[]; // length = answer length
}

export function evaluateGuess(guess: string, answer: string): LetterState[] {
  const len = answer.length;
  const res: LetterState[] = Array(len).fill('empty');
  const answerArr = answer.split('');
  const guessArr = guess.split('');
  const used = Array(len).fill(false);

  // pass 1: correct
  for (let i = 0; i < len; i++) {
    if (guessArr[i] === answerArr[i]) {
      res[i] = 'correct';
      used[i] = true;
    }
  }
  // pass 2: present
  for (let i = 0; i < len; i++) {
    if (res[i] === 'correct') continue;
    const ch = guessArr[i];
    let foundIndex = -1;
    for (let j = 0; j < len; j++) {
      if (!used[j] && answerArr[j] === ch) { foundIndex = j; break; }
    }
    if (foundIndex !== -1) {
      res[i] = 'present';
      used[foundIndex] = true;
    } else {
      res[i] = 'absent';
    }
  }
  return res;
}
