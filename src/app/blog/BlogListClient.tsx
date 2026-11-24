"use client";

import Link from 'next/link';
import SiteNav from '@/component/SiteNav';
import { useTheme } from '@/hooks/theme';
import type { Blog } from '@/types/types';

export default function BlogListClient({ blogs }: { blogs: Blog[] }) {
  const { isDarkMode } = useTheme();
  const muted = isDarkMode ? 'text-zinc-400' : 'text-zinc-600';

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#111] text-zinc-100' : 'bg-[#eae8dc] text-zinc-900'}`}>
      <SiteNav />
      <main className="mx-auto max-w-3xl px-4 py-10 md:px-8 md:py-14">
        <h1 className="mb-8 font-pixel text-xl md:text-2xl">Blog</h1>

        {blogs.length === 0 ? (
          <p className={`font-mono text-sm ${muted}`}>No posts yet.</p>
        ) : (
          <ul className={`divide-y ${isDarkMode ? 'divide-zinc-800' : 'divide-zinc-300'}`}>
            {blogs.map((blog) => (
              <li key={blog.slug}>
                <Link href={blog.readLink || '#'} className="group block py-5">
                  <div className={`mb-1 font-mono text-xs ${muted}`}>
                    {blog.date &&
                      new Date(blog.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        timeZone: 'UTC',
                      })}
                    {blog.tags.length > 0 && ` · ${blog.tags.join(' · ')}`}
                  </div>
                  <h2
                    className={`mb-1 text-lg font-semibold group-hover:underline underline-offset-4 ${
                      isDarkMode ? 'group-hover:text-green-400' : 'group-hover:text-red-700'
                    }`}
                  >
                    {blog.title}
                  </h2>
                  <p className={`text-sm leading-relaxed ${muted}`}>{blog.description}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
