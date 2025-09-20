import { PATCH_TEMPLATES } from '../data/templates';
import { ALL_CATEGORIES, TermCategory } from '../data/terms';
import { seedHash, mulberry32, pickWeighted, pickArray } from './rng';

export interface PuzzleToken {
  text: string;
  blankId?: string; // if part of a blank group
}

export interface PuzzleLine {
  raw: string; // full line after substitution
  tokens: PuzzleToken[]; // tokens in order
}

export interface PuzzleBlank {
  id: string;
  answer: string;
  filled: boolean;
  length: number;
}

export interface DailyPuzzle {
  date: string; // YYYY-MM-DD UTC
  lines: PuzzleLine[];
  blanks: Record<string, PuzzleBlank>;
  blankOrder: string[]; // stable order for UI
  version: number;
}

function categoryById(id: string): TermCategory | undefined {
  return ALL_CATEGORIES.find(c => c.id === id);
}

function getUtcDateString(date = new Date()): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth()+1).padStart(2,'0');
  const d = String(date.getUTCDate()).padStart(2,'0');
  return `${y}-${m}-${d}`;
}

interface GenerateOptions {
  date?: Date;
  templateCount?: number; // 2 or 3 typical
  seedOffset?: number; // for testing alt days
}

export function generateDailyPuzzle(opts: GenerateOptions = {}): DailyPuzzle {
  const dateStr = getUtcDateString(opts.date);
  const seedBase = dateStr.replace(/-/g,'');
  const hash = seedHash(seedBase) + (opts.seedOffset || 0);
  const rng = mulberry32(hash >>> 0);

  const templateCount = opts.templateCount || (rng() < 0.35 ? 3 : 2);

  const weightedTemplates = PATCH_TEMPLATES.map(t => ({ value: t, weight: t.weight }));
  const picked = pickWeighted(rng, weightedTemplates, templateCount);

  const lines: PuzzleLine[] = [];
  const blanks: Record<string, PuzzleBlank> = {};
  const blankOrder: string[] = [];
  let blankCounter = 1;

  for (const tpl of picked) {
    // Build line by replacing placeholders
    let line = tpl.pattern;
    // For repeated placeholder IDs we want consistent word reuse within same line instance.
    const localWordCache: Record<string,string> = {};
    for (const ph of tpl.placeholders) {
      if (!localWordCache[ph]) {
        const cat = categoryById(ph);
        if (!cat) continue; // skip unknown
        localWordCache[ph] = pickArray(rng, cat.words);
      }
    }
    // Replace tokens
    for (const [ph, val] of Object.entries(localWordCache)) {
      const re = new RegExp(`{${ph}}`,'g');
      line = line.replace(re, val);
    }

    // Tokenize: simple split on spaces, preserve punctuation
    const rawTokens = line.split(/\s+/);
    const tokens: PuzzleToken[] = rawTokens.map(t => ({ text: t }));

    // Decide blanks: choose 1-2 per line, prefer longer unique words
    const candidateIndices = tokens
      .map((tok,i)=>({tok,i,base: tok.text.replace(/[^a-z]/gi,'').toLowerCase()}))
      .filter(x=>x.base.length >= 4);
    // Shuffle candidateIndices via rng order
    candidateIndices.sort(()=>rng()-0.5);
    const blanksForLine = candidateIndices.slice(0, Math.min(2, Math.max(1, candidateIndices.length ? 2 : 0)));

    for (const c of blanksForLine) {
      if (!c.base) continue;
      // If we already created a blank for this base in this puzzle, reuse (all occurrences fill together)
      let existingId = Object.values(blanks).find(b => b.answer === c.base)?.id;
      if (!existingId) {
        existingId = `B${blankCounter++}`;
        blanks[existingId] = {
          id: existingId,
            answer: c.base,
            filled: false,
            length: c.base.length
        };
        blankOrder.push(existingId);
      }
      // Mask every token whose normalized base matches
      tokens.forEach(tk => {
        const norm = tk.text.replace(/[^a-z]/gi,'').toLowerCase();
        if (norm === c.base) {
          tk.blankId = existingId;
        }
      });
    }

    lines.push({ raw: line, tokens });
  }

  return { date: dateStr, lines, blanks, blankOrder, version: 1 };
}
