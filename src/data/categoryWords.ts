// Contains all 5-letter words for each category, keyed by category id
// Example: { weapon: ['sword', ...], ... }
import { TermCategory, WEAPONS, DAMAGE_TYPES, MECHANICS, ROLES, VERBS, QUALIFIERS, ATTRIBUTES, STATUS, ECONOMY, AVERAGE_GAMER, HARDCORE_GAMER } from './terms';

export const CATEGORY_WORDS: Record<string, string[]> = {
  weapon: WEAPONS.words,
  damage: DAMAGE_TYPES.words,
  mechanic: MECHANICS.words,
  role: ROLES.words,
  verb: VERBS.words,
  qual: QUALIFIERS.words,
  attr: ATTRIBUTES.words,
  status: STATUS.words,
  economy: ECONOMY.words,
  avg: AVERAGE_GAMER.words,
  hard: HARDCORE_GAMER.words,
};
