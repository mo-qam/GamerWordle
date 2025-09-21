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

// Average gamer friendly recognizable franchises / genre terms (5-letter focus for puzzle pool)
export const AVERAGE_GAMER: TermCategory = {
  id: 'avg',
  label: 'Average Gamer Terms',
  words: [
    // Widely-known, strictly 5-letter, non-IP gaming terms
    'games','level','score','quest','armor','skill','guild','timer','patch','event','combo','retro','pixel','spawn','power','loots','party','grind','steam','arena','alien','ninja','block','board','enemy','magic','input','mouse','audio','pause','start','rules','items','point','round','stage','lobby','title','speed','bonus','clear','enter','equip','fight','final','input','logic','match','music','pause','press','reset','share','shoot','skill','sound','space','stack','stats','super','table','theme','track','trial','value','video','world','zones'
  ]
};

// Hardcore / niche genre & mechanics vocabulary (favor 5-letter valid tokens)
export const HARDCORE_GAMER: TermCategory = {
  id: 'hard',
  label: 'Hardcore Gamer Terms',
  words: [
    // Widely-known, strictly 5-letter, genre/mechanics terms (no slang, no obscure)
    'parry','dodge','souls','rogue','build','macro','micro','frame','glass','reset','burst','stack','greed','choke','aggro','strat','block','guard','input','macro','melee','racer','score','shoot','skill','speed','split','steal','sweep','sword','tanks','timer','track','trick','ultra','zones','arena','combo','event','final','grind','logic','match','music','pause','press','share','sound','space','stats','super','table','theme','trial','value','video','world'
  ]
};

export const ALL_CATEGORIES: TermCategory[] = [
  WEAPONS,DAMAGE_TYPES,MECHANICS,ROLES,VERBS,QUALIFIERS,ATTRIBUTES,STATUS,ECONOMY,
  AVERAGE_GAMER,HARDCORE_GAMER
];

export type PlaceholderId = TermCategory['id'];
