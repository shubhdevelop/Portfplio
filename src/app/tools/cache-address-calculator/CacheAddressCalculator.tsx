"use client";

import Link from 'next/link';
import { useMemo, useState } from 'react';
import SiteNav from '@/component/SiteNav';
import { useTheme } from '@/hooks/theme';
import { decompose } from '@/lib/cacheAddress';

const UNITS = { B: 1n, KiB: 1024n, MiB: 1024n * 1024n } as const;
type Unit = keyof typeof UNITS;

function parseInteger(raw: string): bigint | null {
  const s = raw.trim().replace(/_/g, '');
  if (!/^(0x[0-9a-f]+|0b[01]+|\d+)$/i.test(s)) return null;
  return BigInt(s);
}

export default function CacheAddressCalculator() {
  const { isDarkMode } = useTheme();
  const [capacity, setCapacity] = useState('32');
  const [unit, setUnit] = useState<Unit>('KiB');
  const [lineBytes, setLineBytes] = useState('64');
  const [ways, setWays] = useState('8');
  const [addressBits, setAddressBits] = useState('48');
  const [address, setAddress] = useState('0x12345678');

  const result = useMemo(() => {
    const cap = parseInteger(capacity);
    const line = parseInteger(lineBytes);
    const w = parseInteger(ways);
    const bits = parseInteger(addressBits);
    const addr = parseInteger(address);
    if (cap === null || line === null || w === null || bits === null || addr === null) {
      return { ok: false as const, error: 'Enter whole numbers. The address can be decimal, 0x hex or 0b binary.' };
    }
    return decompose(
      { capacityBytes: cap * UNITS[unit], lineBytes: line, ways: w, addressBits: Number(bits) },
      addr,
    );
  }, [capacity, unit, lineBytes, ways, addressBits, address]);

  const border = isDarkMode ? 'border-zinc-100' : 'border-zinc-900';
  const muted = isDarkMode ? 'text-zinc-400' : 'text-zinc-600';
  const input = `w-full border-2 px-3 py-2 font-mono text-sm ${border} ${
    isDarkMode ? 'bg-zinc-800 text-zinc-100' : 'bg-white text-zinc-900'
  }`;
  const link = `underline decoration-2 underline-offset-2 ${
    isDarkMode ? 'text-green-400 hover:text-green-300' : 'text-red-700 hover:text-red-600'
  }`;

  let binary: { tag: string; index: string; offset: string } | null = null;
  if (result.ok) {
    const v = result.value;
    const addr = parseInteger(address) as bigint;
    const full = addr.toString(2).padStart(v.tagBits + v.indexBits + v.offsetBits, '0');
    binary = {
      tag: full.slice(0, v.tagBits),
      index: full.slice(v.tagBits, v.tagBits + v.indexBits),
      offset: full.slice(v.tagBits + v.indexBits),
    };
  }

  return (
    <div className={`min-h-screen transition-colors ${isDarkMode ? 'bg-[#111] text-zinc-100' : 'bg-[#eae8dc] text-zinc-900'}`}>
      <SiteNav />
      <div className="mx-auto max-w-3xl px-4 py-10 md:px-8 md:py-14">
        <h1 className="mb-4 font-pixel text-xl leading-tight md:text-2xl">Cache Tag, Index and Offset Calculator</h1>
        <p className={`mb-8 text-base leading-relaxed ${muted}`}>
          Enter a cache geometry and a memory address to split it into <strong>tag</strong>, <strong>set index</strong> and{' '}
          <strong>block offset</strong>. Works for direct-mapped (1 way), set-associative and fully associative caches
          (ways = lines, which gives one set and no index bits).
        </p>

        <form className="mb-8 grid gap-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
          <label className="block">
            <span className="mb-1 block font-mono text-xs uppercase">Cache capacity</span>
            <div className="flex gap-2">
              <input className={input} inputMode="numeric" value={capacity} onChange={(e) => setCapacity(e.target.value)} />
              <select className={`${input} w-28`} value={unit} onChange={(e) => setUnit(e.target.value as Unit)} aria-label="Capacity unit">
                {Object.keys(UNITS).map((u) => <option key={u}>{u}</option>)}
              </select>
            </div>
          </label>
          <label className="block">
            <span className="mb-1 block font-mono text-xs uppercase">Line size (bytes)</span>
            <input className={input} inputMode="numeric" value={lineBytes} onChange={(e) => setLineBytes(e.target.value)} />
          </label>
          <label className="block">
            <span className="mb-1 block font-mono text-xs uppercase">Ways (associativity)</span>
            <input className={input} inputMode="numeric" value={ways} onChange={(e) => setWays(e.target.value)} />
          </label>
          <label className="block">
            <span className="mb-1 block font-mono text-xs uppercase">Address width (bits)</span>
            <input className={input} inputMode="numeric" value={addressBits} onChange={(e) => setAddressBits(e.target.value)} />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1 block font-mono text-xs uppercase">Address (decimal, 0x hex or 0b binary)</span>
            <input className={input} value={address} onChange={(e) => setAddress(e.target.value)} spellCheck={false} />
          </label>
        </form>

        <section aria-live="polite" className={`mb-10 border-2 p-4 ${border} ${isDarkMode ? 'bg-zinc-900' : 'bg-[#fdfbf7]'}`}>
          <h2 className="mb-3 font-pixel text-sm">Result</h2>
          {result.ok && binary ? (
            <>
              <table className="mb-4 w-full border-collapse font-mono text-sm">
                <thead>
                  <tr className={`border-b ${border}`}>
                    <th className="py-2 text-left">Field</th>
                    <th className="py-2 text-left">Bits</th>
                    <th className="py-2 text-left">Binary</th>
                    <th className="py-2 text-left">Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="py-1">Tag</td><td>{result.value.tagBits}</td><td className="break-all">{binary.tag || '-'}</td><td>{`0x${result.value.tag.toString(16)} (${result.value.tag})`}</td></tr>
                  <tr><td className="py-1">Set index</td><td>{result.value.indexBits}</td><td className="break-all">{binary.index || '-'}</td><td>{result.value.index.toString()}</td></tr>
                  <tr><td className="py-1">Offset</td><td>{result.value.offsetBits}</td><td className="break-all">{binary.offset || '-'}</td><td>{result.value.offset.toString()}</td></tr>
                </tbody>
              </table>
              <p className={`font-mono text-xs ${muted}`}>
                Sets: {result.value.sets.toString()} · Block number: {result.value.blockNumber.toString()}
              </p>
            </>
          ) : (
            <p className="font-mono text-sm text-red-600">{result.ok ? '' : result.error}</p>
          )}
        </section>

        <section className="space-y-4 text-base leading-relaxed">
          <h2 className="font-pixel text-sm">How it is calculated</h2>
          <p className={muted}>
            The number of sets is S = capacity ÷ (line size × ways). The offset has log2(line size) bits, the index has
            log2(S) bits, and the tag takes the remaining high bits of the address. Each field is a shift and a mask.
          </p>
          <p className={muted}>
            Learn the theory in{' '}
            <Link className={link} href="/blog/cpu-cache-address-decomposition">the tag, index and offset tutorial</Link>, see{' '}
            <Link className={link} href="/blog/cpu-cache-address-decomposition-examples">worked examples</Link>, or try the{' '}
            <Link className={link} href="/blog/cpu-cache-address-decomposition-practice-problems">practice problems</Link>. For how
            lines, sets and ways are organised, read{' '}
            <Link className={link} href="/blog/cpu-cache-mapping-and-address-decomposition">CPU cache mapping explained</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
