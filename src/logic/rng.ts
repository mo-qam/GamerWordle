// Deterministic seeding based on date string.
// xmur3 hash + mulberry32 PRNG.
export function seedHash(str: string): number {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  h = Math.imul(h ^ (h >>> 16), 2246822507);
  h = Math.imul(h ^ (h >>> 13), 3266489909);
  h ^= h >>> 16;
  return h >>> 0;
}

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function() {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function pickWeighted<T>(rng: () => number, items: {value: T; weight: number;}[], count: number): T[] {
  const pool = [...items];
  const chosen: T[] = [];
  for (let i = 0; i < count && pool.length; i++) {
    const total = pool.reduce((s,it)=>s+it.weight,0);
    let r = rng() * total;
    let idx = 0;
    for (; idx < pool.length; idx++) {
      r -= pool[idx].weight;
      if (r <= 0) break;
    }
    const [it] = pool.splice(idx,1);
    chosen.push(it.value);
  }
  return chosen;
}

export function pickArray<T>(rng: () => number, arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}
