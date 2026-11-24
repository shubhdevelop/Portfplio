"use client";

import 'katex/dist/katex.min.css';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import SiteNav from '@/component/SiteNav';
import { useTheme } from '@/hooks/theme';
import type { BlogPost } from '@/lib/blog';
import { type Heading, rehypeHeadingIds } from '@/lib/headings';

export interface PostLink {
  slug: string;
  title: string;
  href: string;
}

interface BlogPostClientProps {
  post: BlogPost;
  headings: Heading[];
  newer: PostLink | null;
  older: PostLink | null;
}

function Toc({ headings, dark }: { headings: Heading[]; dark: boolean }) {
  return (
    <ul className="space-y-1.5 text-sm">
      {headings.map((h) => (
        <li key={h.id} className={h.level === 3 ? 'pl-3' : ''}>
          <a
            href={`#${h.id}`}
            className={`block leading-snug ${
              dark ? 'text-zinc-400 hover:text-green-400' : 'text-zinc-600 hover:text-red-700'
            }`}
          >
            {h.text}
          </a>
        </li>
      ))}
    </ul>
  );
}

export default function BlogPostClient({ post, headings, newer, older }: BlogPostClientProps) {
  const { isDarkMode: dark } = useTheme();
  const muted = dark ? 'text-zinc-400' : 'text-zinc-600';
  const body = dark ? 'text-zinc-300' : 'text-zinc-700';
  const heading = dark ? 'text-zinc-100' : 'text-zinc-900';
  const border = dark ? 'border-zinc-700' : 'border-zinc-300';
  const accent = dark ? 'text-green-400 hover:text-green-300' : 'text-red-700 hover:text-red-600';

  return (
    <div className={`min-h-screen ${dark ? 'bg-[#111] text-zinc-100' : 'bg-[#eae8dc] text-zinc-900'}`}>
      <style>{`
        html { scroll-behavior: smooth; }
        .post-body h1, .post-body h2, .post-body h3, .post-body h4, .post-body h5 { scroll-margin-top: 5rem; }
        .katex-display { overflow-x: auto; overflow-y: hidden; margin: 1.25em 0 !important; padding: 0.75em 0; }
        .katex { font-size: 1.05em; color: ${dark ? '#e4e4e7' : '#18181b'}; }
      `}</style>

      <SiteNav />

      <div className="mx-auto flex max-w-5xl gap-12 px-4 py-8 md:px-8 md:py-12">
        <main className="min-w-0 max-w-3xl flex-1">
          <nav aria-label="Breadcrumb" className={`mb-6 font-mono text-xs ${muted}`}>
            <ol className="flex flex-wrap items-center gap-2">
              <li><Link href="/" className="hover:underline">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/blog" className="hover:underline">Blog</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="max-w-[50vw] truncate">{post.title}</li>
            </ol>
          </nav>

          <header className="mb-8">
            <h1 className={`mb-4 text-2xl font-bold leading-tight md:text-4xl ${heading}`}>{post.title}</h1>
            <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs ${muted}`}>
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  timeZone: 'UTC',
                })}
              </time>
              {post.readTime && <span>· {post.readTime}</span>}
              {post.tags.length > 0 && <span>· {post.tags.join(' · ')}</span>}
            </div>
          </header>

          {headings.length > 2 && (
            <details className={`mb-8 border-y py-3 lg:hidden ${border}`}>
              <summary className={`cursor-pointer font-mono text-xs uppercase ${muted}`}>On this page</summary>
              <div className="mt-3">
                <Toc headings={headings} dark={dark} />
              </div>
            </details>
          )}

          <article className="post-body">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeKatex, rehypeHeadingIds]}
              components={{
                h1: ({ node, ...props }) => <h2 className={`mt-10 mb-3 text-2xl font-bold ${heading}`} {...props} />,
                h2: ({ node, ...props }) => <h2 className={`mt-10 mb-3 text-2xl font-bold ${heading}`} {...props} />,
                h3: ({ node, ...props }) => <h3 className={`mt-8 mb-2 text-xl font-semibold ${heading}`} {...props} />,
                h4: ({ node, ...props }) => <h4 className={`mt-6 mb-2 text-lg font-semibold ${heading}`} {...props} />,
                h5: ({ node, ...props }) => <h5 className={`mt-6 mb-2 text-base font-semibold ${heading}`} {...props} />,
                h6: ({ node, ...props }) => <h6 className={`mt-4 mb-2 text-base font-semibold ${heading}`} {...props} />,
                p: ({ node, ...props }) => <p className={`mb-4 text-base leading-7 ${body}`} {...props} />,
                strong: ({ node, ...props }) => <strong className={`font-semibold ${heading}`} {...props} />,
                img: ({ node, alt, ...props }) => (
                  // biome-ignore lint/performance/noImgElement: markdown images are plain SVG/static assets
                  <img
                    {...props}
                    alt={alt ?? ''}
                    className={`my-6 h-auto w-full ${dark ? 'invert' : ''}`}
                    loading="lazy"
                  />
                ),
                table: ({ node, ...props }) => (
                  <div className={`my-6 overflow-x-auto border ${border}`}>
                    <table className="min-w-full border-collapse font-mono text-sm" {...props} />
                  </div>
                ),
                thead: ({ node, ...props }) => <thead className={dark ? 'bg-zinc-800' : 'bg-zinc-200'} {...props} />,
                tr: ({ node, ...props }) => <tr className={`border-t ${border}`} {...props} />,
                th: ({ node, ...props }) => <th className="px-3 py-2 text-left font-medium" {...props} />,
                td: ({ node, ...props }) => <td className={`px-3 py-2 ${body}`} {...props} />,
                code: ({ node, className, ...props }) =>
                  className ? (
                    <code className={className} {...props} />
                  ) : (
                    <code
                      className={`rounded px-1.5 py-0.5 font-mono text-[0.9em] ${
                        dark ? 'bg-zinc-800 text-green-400' : 'bg-zinc-200 text-red-700'
                      }`}
                      {...props}
                    />
                  ),
                pre: ({ node, ...props }) => (
                  <pre
                    className={`mb-5 overflow-x-auto rounded border p-4 font-mono text-sm ${
                      dark ? 'border-zinc-700 bg-zinc-900' : 'border-zinc-300 bg-[#fdfbf7]'
                    }`}
                    {...props}
                  />
                ),
                a: ({ node, href, children, ...props }) => {
                  const cls = `underline decoration-1 underline-offset-2 ${accent}`;
                  if (href?.startsWith('/')) {
                    return <Link href={href} className={cls}>{children}</Link>;
                  }
                  if (href?.startsWith('#')) {
                    return <a href={href} className={cls} {...props}>{children}</a>;
                  }
                  return (
                    <a href={href} className={cls} target="_blank" rel="noopener noreferrer" {...props}>
                      {children}
                    </a>
                  );
                },
                ul: ({ node, ...props }) => <ul className={`mb-4 ml-6 list-disc space-y-1.5 ${body}`} {...props} />,
                ol: ({ node, ...props }) => <ol className={`mb-4 ml-6 list-decimal space-y-1.5 ${body}`} {...props} />,
                li: ({ node, ...props }) => <li className="pl-1 leading-7" {...props} />,
                blockquote: ({ node, ...props }) => (
                  <blockquote className={`my-4 border-l-4 pl-4 ${border} ${muted}`} {...props} />
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </article>

          {(newer || older) && (
            <nav aria-label="More posts" className={`mt-14 grid gap-4 border-t pt-6 sm:grid-cols-2 ${border}`}>
              {older ? (
                <Link href={older.href} className="group block">
                  <span className={`font-mono text-xs ${muted}`}>← Older</span>
                  <span className={`block font-semibold group-hover:underline ${heading}`}>{older.title}</span>
                </Link>
              ) : (
                <span />
              )}
              {newer && (
                <Link href={newer.href} className="group block sm:text-right">
                  <span className={`font-mono text-xs ${muted}`}>Newer →</span>
                  <span className={`block font-semibold group-hover:underline ${heading}`}>{newer.title}</span>
                </Link>
              )}
            </nav>
          )}
        </main>

        {headings.length > 2 && (
          <aside className="hidden w-56 shrink-0 lg:block">
            <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
              <p className={`mb-3 font-mono text-xs uppercase ${muted}`}>On this page</p>
              <Toc headings={headings} dark={dark} />
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
