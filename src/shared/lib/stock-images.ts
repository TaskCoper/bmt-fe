/**
 * Curated royalty-free interior / architecture photos (Unsplash) used as
 * stand-in imagery for the demo until the CMS provides real project photos.
 * Pick deterministically by a seed so a given item always shows the same photo.
 */
const POOL = [
  'photo-1600585154340-be6161a56a0c',
  'photo-1618221195710-dd6b41faaea6',
  'photo-1600566753086-00f18fb6b3ea',
  'photo-1600210492486-724fe5c67fb0',
  'photo-1600607687939-ce8a6c25118c',
  'photo-1600047509807-ba8f99d2cdde',
  'photo-1616486338812-3dadae4b4ace',
  'photo-1512917774080-9991f1c4c750',
  'photo-1580587771525-78b9dba3b914',
  'photo-1616137466211-f939a420be84',
  'photo-1567767292278-a4f21aa2d36e',
  'photo-1502672260266-1c1ef2d93688',
  'photo-1493809842364-78817add7ffb',
  'photo-1583847268964-b28dc8f51f92',
  'photo-1449844908441-8829872d2607',
  'photo-1560448204-e02f11c3d0e2',
  'photo-1522708323590-d24dbb6b0267',
  'photo-1484154218962-a197022b5858'
] as const

/**
 * "Before" photos — raw construction sites, bare/empty rooms and unfinished
 * interiors, so a before/after comparison shows a real transformation.
 */
const BEFORE_POOL = [
  'photo-1503387762-592deb58ef4e',
  'photo-1541888946425-d81bb19240f5',
  'photo-1504307651254-35680f356dfd',
  'photo-1517581177682-a085bb7ffb15',
  'photo-1581094794329-c8112a89af12',
  'photo-1560518883-ce09059eeffa',
  'photo-1560448204-603b3fc33ddc',
  'photo-1618090584176-7132b9911657',
  'photo-1621905251189-08b45d6a269e'
] as const

const BASE = 'https://images.unsplash.com/'

/** Stable 32-bit hash of a seed string. */
function hash(seed: string): number {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/** Deterministic finished-interior photo URL for a seed. */
export function stockImage(seed: string | number, width = 800): string {
  const photo = POOL[hash(String(seed)) % POOL.length]
  return `${BASE}${photo}?w=${width}&q=80&auto=format&fit=crop`
}

/** Deterministic "before" (raw/unfinished) photo URL for a seed. */
export function stockBeforeImage(seed: string | number, width = 800): string {
  const photo = BEFORE_POOL[hash(String(seed)) % BEFORE_POOL.length]
  return `${BASE}${photo}?w=${width}&q=80&auto=format&fit=crop`
}
