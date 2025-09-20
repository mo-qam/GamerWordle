import { PlaceholderId } from './terms';

export interface PatchTemplate {
  id: string;
  pattern: string; // Contains tokens like {weapon} {attr} etc
  placeholders: PlaceholderId[]; // Order of appearance
  weight: number; // For future weighting
  difficulty: number; // 1 (easy) - 5 (hard)
}

// Keep generic; no references to specific franchises.
export const PATCH_TEMPLATES: PatchTemplate[] = [
  {
    id: 'w_attr_verb',
    pattern: "{weapon} {attr} {verb}.",
    placeholders: ['weapon','attr','verb'],
    weight: 4,
    difficulty: 1
  },
  {
    id: 'w_attr_qual_verb',
    pattern: "{weapon} {attr} {qual} {verb}.",
    placeholders: ['weapon','attr','qual','verb'],
    weight: 3,
    difficulty: 2
  },
  {
    id: 'role_mechanic_attr',
    pattern: "{role} {mechanic} now affects {attr}.",
    placeholders: ['role','mechanic','attr'],
    weight: 2,
    difficulty: 2
  },
  {
    id: 'mechanic_status_interaction',
    pattern: "{mechanic} interaction with {status} {verb}.",
    placeholders: ['mechanic','status','verb'],
    weight: 2,
    difficulty: 2
  },
  {
    id: 'economy_drop_adjust',
    pattern: "{economy} yield of {material} {verb}.",
    placeholders: ['economy','economy','verb'], // second economy acts like material category for now
    weight: 1,
    difficulty: 3
  },
  {
    id: 'status_attr_adjust',
    pattern: "{status} {attr} application {verb}.",
    placeholders: ['status','attr','verb'],
    weight: 2,
    difficulty: 2
  },
  {
    id: 'dual_weapon_scaling',
    pattern: "Dual {weapon} scaling with {attr} {verb}.",
    placeholders: ['weapon','attr','verb'],
    weight: 1,
    difficulty: 3
  },
  {
    id: 'attr_balance_pass',
    pattern: "Global {attr} values {verb}.",
    placeholders: ['attr','verb'],
    weight: 2,
    difficulty: 1
  },
  {
    id: 'mechanic_refine',
    pattern: "{mechanic} timing {qual} {verb}.",
    placeholders: ['mechanic','qual','verb'],
    weight: 2,
    difficulty: 3
  },
  {
    id: 'role_verb_attr',
    pattern: "{role} {attr} {verb} in early progression.",
    placeholders: ['role','attr','verb'],
    weight: 1,
    difficulty: 3
  }
];
