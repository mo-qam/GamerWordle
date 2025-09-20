export interface TermCategory {
  id: string;
  label: string;
  words: string[];
}

// All lowercase; UI can capitalize as needed. Generic to avoid IP.
export const WEAPONS: TermCategory = {
  id: 'weapon',
  label: 'Weapons',
  words: [
    'sword','greatsword','dagger','axe','hammer','mace','bow','crossbow','spear','halberd','staff','wand','pistol','rifle','launcher','blade','claw','whip','flail','scythe'
  ]
};

export const DAMAGE_TYPES: TermCategory = {
  id: 'damage',
  label: 'Damage Types',
  words: [
    'fire','ice','arcane','poison','bleed','shock','pierce','slash','crush','void','toxic','frost','ember','storm','venom'
  ]
};

export const MECHANICS: TermCategory = {
  id: 'mechanic',
  label: 'Mechanics',
  words: [
    'cooldown','stamina','evasion','stealth','crafting','channeling','parry','combo','heal','shield','absorb','summon','charge','enrage','taunt','glide','sprint','harvest','trade','reforge'
  ]
};

export const ROLES: TermCategory = {
  id: 'role',
  label: 'Roles',
  words: [
    'tank','healer','support','assassin','ranger','mage','bruiser','controller','builder','scout'
  ]
};

export const VERBS: TermCategory = {
  id: 'verb',
  label: 'Action Verbs',
  words: [
    'reduced','increased','adjusted','tweaked','lowered','raised','normalized','reworked','improved','fixed','buffed','nerfed','restored','stabilized','refined'
  ]
};

export const QUALIFIERS: TermCategory = {
  id: 'qual',
  label: 'Qualifiers',
  words: [
    'slightly','moderately','significantly','greatly','marginally','notably','considerably','substantially','dramatically','slightly'
  ]
};

export const ATTRIBUTES: TermCategory = {
  id: 'attr',
  label: 'Attributes',
  words: [
    'damage','range','speed','weight','cost','durability','efficiency','radius','effect','scaling','resistance','accuracy','spread','recoil','uptime','duration'
  ]
};

export const STATUS: TermCategory = {
  id: 'status',
  label: 'Status Effects',
  words: [
    'burn','freeze','shock','bleed','stun','slow','root','silence','weaken','corrupt','drain','fear'
  ]
};

export const ECONOMY: TermCategory = {
  id: 'economy',
  label: 'Economy',
  words: [
    'vendor','market','auction','token','shard','essence','currency','material','scrap','gem','ore','herb'
  ]
};

export const ALL_CATEGORIES: TermCategory[] = [
  WEAPONS,DAMAGE_TYPES,MECHANICS,ROLES,VERBS,QUALIFIERS,ATTRIBUTES,STATUS,ECONOMY
];

export type PlaceholderId = TermCategory['id'];
