"use client";

import { Moon, Sun } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '@/hooks/theme';

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Blog' },
  { href: '/tools/cache-address-calculator', label: 'Calculator' },
];

export default function SiteNav() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <header
      className={`sticky top-0 z-20 border-b backdrop-blur ${
        isDarkMode ? 'border-zinc-700 bg-[#111]/90' : 'border-zinc-300 bg-[#eae8dc]/90'
      }`}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 md:px-8"
      >
        <ul className="flex items-center gap-5 font-mono text-xs">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`underline-offset-4 hover:underline ${
                  isDarkMode ? 'text-zinc-300 hover:text-green-400' : 'text-zinc-700 hover:text-red-700'
                }`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
          className={`p-1.5 ${isDarkMode ? 'text-yellow-400' : 'text-zinc-900'}`}
        >
          {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </nav>
    </header>
  );
}
