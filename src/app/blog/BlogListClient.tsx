"use client";

import Link from 'next/link';
import { Blog } from '@/types/types';
import { useTheme } from '@/hooks/theme';
import { Moon, Sun } from 'lucide-react';

function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();
  
  return (
    <button 
      onClick={toggleTheme}
      className={`p-2 border-2 hover:scale-105 active:scale-95 transition-all ${
        isDarkMode 
          ? 'border-zinc-100 text-yellow-400 hover:bg-zinc-800' 
          : 'border-zinc-900 text-zinc-900 hover:bg-zinc-200'
      }`}
      aria-label="Toggle Dark Mode"
    >
      {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}

export default function BlogListClient({ blogs }: { blogs: Blog[] }) {
  const { isDarkMode } = useTheme();

  return (
    <div className={`min-h-screen transition-colors ${
      isDarkMode 
        ? 'bg-[#111] text-zinc-100' 
        : 'bg-[#eae8dc] text-zinc-900'
    }`}>
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-16">
        <div className="flex justify-between items-start mb-8">
          <Link 
            href="/"
            className={`inline-flex items-center gap-2 font-pixel text-[10px] uppercase transition-colors ${
              isDarkMode 
                ? 'text-green-400 hover:text-green-300' 
                : 'text-red-700 hover:text-red-600'
            }`}
          >
            ← Back to Portfolio
          </Link>
          
          <ThemeToggle />
        </div>

        <h1 className={`font-pixel text-3xl md:text-4xl mb-8 ${
          isDarkMode ? 'text-zinc-100' : 'text-zinc-900'
        }`}>
          Blog Posts
        </h1>

        {blogs.length === 0 ? (
          <div className={`text-center py-12 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
            <p className="font-mono text-sm">No blog posts yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogs.map((blog) => (
            <Link
              key={blog.title}
              href={blog.readLink || '#'}
              className={`block p-6 border-2 transition-colors ${
                isDarkMode
                  ? 'border-zinc-100 bg-zinc-800 hover:bg-zinc-700'
                  : 'border-zinc-900 bg-white hover:bg-red-50/50'
              }`}
            >
              <h2 className={`font-pixel text-lg mb-2 ${
                isDarkMode ? 'text-zinc-100' : 'text-zinc-900'
              }`}>
                {blog.title}
              </h2>
              <p className={`font-mono text-xs uppercase mb-3 ${
                isDarkMode ? 'text-zinc-400' : 'text-zinc-500'
              }`}>
                {blog.tagline}
              </p>
              <p className={`font-sans text-sm mb-4 ${
                isDarkMode ? 'text-zinc-300' : 'text-zinc-700'
              }`}>
                {blog.description}
              </p>
              {blog.date && (
                <p className={`font-mono text-xs ${
                  isDarkMode ? 'text-zinc-400' : 'text-zinc-500'
                }`}>
                  {new Date(blog.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              )}
            </Link>
          ))}
          </div>
        )}
      </div>
    </div>
  );
}

