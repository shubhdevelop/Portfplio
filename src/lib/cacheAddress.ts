export interface CacheGeometry {
  capacityBytes: bigint;
  lineBytes: bigint;
  ways: bigint;
  addressBits: number;
}

export interface Decomposition {
  sets: bigint;
  offsetBits: number;
  indexBits: number;
  tagBits: number;
  offset: bigint;
  index: bigint;
  tag: bigint;
  blockNumber: bigint;
}

export type DecomposeResult =
  | { ok: true; value: Decomposition }
  | { ok: false; error: string };

const isPowerOfTwo = (n: bigint) => n > 0n && (n & (n - 1n)) === 0n;
const log2 = (n: bigint) => n.toString(2).length - 1;

export function decompose(g: CacheGeometry, address: bigint): DecomposeResult {
  if (!Number.isInteger(g.addressBits) || g.addressBits < 1 || g.addressBits > 64) {
    return { ok: false, error: 'Address width must be between 1 and 64 bits.' };
  }
  if (!isPowerOfTwo(g.lineBytes)) {
    return { ok: false, error: 'Line size must be a power of two.' };
  }
  if (g.ways < 1n) {
    return { ok: false, error: 'Ways must be at least 1.' };
  }
  const setBytes = g.lineBytes * g.ways;
  if (g.capacityBytes < setBytes || g.capacityBytes % setBytes !== 0n) {
    return { ok: false, error: 'Capacity must be a multiple of line size × ways.' };
  }
  const sets = g.capacityBytes / setBytes;
  if (!isPowerOfTwo(sets)) {
    return { ok: false, error: 'Capacity ÷ (line size × ways) must be a power of two.' };
  }

  const offsetBits = log2(g.lineBytes);
  const indexBits = log2(sets);
  const tagBits = g.addressBits - offsetBits - indexBits;
  if (tagBits < 0) {
    return { ok: false, error: 'Address is too narrow for this cache: offset + index bits exceed the address width.' };
  }
  if (address < 0n || address >= 1n << BigInt(g.addressBits)) {
    return { ok: false, error: `Address does not fit in ${g.addressBits} bits.` };
  }

  const b = BigInt(offsetBits);
  const s = BigInt(indexBits);
  return {
    ok: true,
    value: {
      sets,
      offsetBits,
      indexBits,
      tagBits,
      offset: address & (g.lineBytes - 1n),
      index: (address >> b) & (sets - 1n),
      tag: address >> (b + s),
      blockNumber: address >> b,
    },
  };
}
