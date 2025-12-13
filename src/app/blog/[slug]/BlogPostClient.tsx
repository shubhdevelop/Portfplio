"use client";

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { useTheme } from '@/hooks/theme';
import { BlogPost } from '@/lib/blog';
import { ArrowLeft, Moon, Sun } from 'lucide-react';
import Link from 'next/link';

interface BlogPostClientProps {
  post: BlogPost;
}

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

export default function BlogPostClient({ post }: BlogPostClientProps) {
  const { isDarkMode } = useTheme();

  return (
    <div className={`min-h-screen transition-colors ${
      isDarkMode 
        ? 'bg-[#111] text-zinc-100' 
        : 'bg-[#eae8dc] text-zinc-900'
    }`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        .font-pixel { font-family: 'Press Start 2P', cursive; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        
        /* KaTeX block math styling */
        .katex-display {
          display: block;
          margin: 1.5em 0 !important;
          text-align: center;
          overflow-x: auto;
          overflow-y: hidden;
          padding: 1.5em 1em;
          border-radius: 8px;
          ${isDarkMode 
            ? 'background-color: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.3);' 
            : 'background-color: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3);'
          }
        }
        
        .katex-display > .katex {
          display: inline-block;
          text-align: initial;
        }
        
        /* Inline math styling */
        .katex {
          font-size: 1.1em;
        }
        
        /* Ensure proper spacing around block math */
        .katex-display + p,
        p + .katex-display {
          margin-top: 1.5em;
        }
        
        /* KaTeX color overrides for dark mode */
        ${isDarkMode ? `
          .katex {
            color: #e4e4e7;
          }
          .katex .base {
            color: #e4e4e7;
          }
        ` : `
          .katex {
            color: #18181b;
          }
          .katex .base {
            color: #18181b;
          }
        `}
      `}</style>

      <div className={`max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-16 ${
        isDarkMode ? 'bg-zinc-900' : 'bg-[#fdfbf7]'
      }`}>
        {/* Back Button and Theme Toggle */}
        <div className="flex justify-between items-center mb-8">
          <Link 
            href="/"
            className={`inline-flex items-center gap-2 font-pixel text-[10px] uppercase transition-colors ${
              isDarkMode 
                ? 'text-green-400 hover:text-green-300' 
                : 'text-red-700 hover:text-red-600'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Portfolio
          </Link>
          
          <ThemeToggle />
        </div>

        {/* Header */}
        <header className={`mb-8 pb-8 border-b-2 ${
          isDarkMode ? 'border-zinc-100' : 'border-zinc-900'
        }`}>
          <h1 className={`font-pixel text-2xl md:text-3xl mb-4 leading-tight ${
            isDarkMode ? 'text-zinc-100' : 'text-zinc-900'
          }`}>
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 font-mono text-xs">
            <span className={isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}>
              {new Date(post.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
            {post.readTime && (
              <span className={isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}>
                • {post.readTime}
              </span>
            )}
            {post.author && (
              <span className={isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}>
                • {post.author}
              </span>
            )}
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className={`font-pixel text-[8px] uppercase px-2 py-1 border-2 ${
                    isDarkMode
                      ? 'border-zinc-100 bg-zinc-800 text-zinc-100'
                      : 'border-zinc-900 bg-white text-zinc-900'
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Content */}
        <article className={`prose prose-lg max-w-none ${
          isDarkMode 
            ? 'prose-invert prose-headings:text-zinc-100 prose-p:text-zinc-300 prose-strong:text-zinc-100 prose-code:text-green-400 prose-pre:bg-zinc-800 prose-pre:border prose-pre:border-zinc-100' 
            : 'prose-headings:text-zinc-900 prose-p:text-zinc-700 prose-strong:text-zinc-900 prose-code:text-red-700 prose-pre:bg-zinc-100 prose-pre:border prose-pre:border-zinc-900'
        }`}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={{
              h1: ({ node, ...props }) => (
                <h1 className={`font-pixel text-xl md:text-2xl mb-4 mt-8 ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`} {...props} />
              ),
              h2: ({ node, ...props }) => (
                <h2 className={`font-pixel text-lg md:text-xl mb-3 mt-6 ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`} {...props} />
              ),
              h3: ({ node, ...props }) => (
                <h3 className={`font-pixel text-base md:text-lg mb-2 mt-4 ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`} {...props} />
              ),
              p: ({ node, ...props }) => (
                <p className={`font-sans text-base leading-relaxed mb-4 ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`} {...props} />
              ),
              code: ({ node, className, ...props }: any) => {
                const isInline = !className;
                return isInline ? (
                  <code
                    className={`font-mono text-sm px-1.5 py-0.5 rounded ${
                      isDarkMode
                        ? 'bg-zinc-800 text-green-400'
                        : 'bg-zinc-100 text-red-700'
                    }`}
                    {...props}
                  />
                ) : (
                  <code className={className} {...props} />
                );
              },
              pre: ({ node, ...props }) => (
                <pre
                  className={`font-mono text-sm p-4 rounded-lg overflow-x-auto mb-4 border-2 ${
                    isDarkMode
                      ? 'bg-zinc-800 border-zinc-100'
                      : 'bg-zinc-100 border-zinc-900'
                  }`}
                  {...props}
                />
              ),
              a: ({ node, ...props }) => (
                <a
                  className={`underline decoration-2 underline-offset-2 ${
                    isDarkMode
                      ? 'text-green-400 hover:text-green-300'
                      : 'text-red-700 hover:text-red-600'
                  }`}
                  target="_blank"
                  rel="noopener noreferrer"
                  {...props}
                />
              ),
              ul: ({ node, ...props }) => (
                <ul className={`list-disc list-outside mb-4 ml-6 space-y-2 ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`} {...props} />
              ),
              ol: ({ node, ...props }) => (
                <ol className={`list-decimal list-outside mb-4 ml-6 space-y-2 ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`} {...props} />
              ),
              li: ({ node, ...props }) => (
                <li className={`font-sans pl-2 leading-relaxed ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`} {...props} />
              ),
              blockquote: ({ node, ...props }) => (
                <blockquote
                  className={`border-l-4 pl-4 my-4 italic ${
                    isDarkMode
                      ? 'border-zinc-100 text-zinc-400'
                      : 'border-zinc-900 text-zinc-600'
                  }`}
                  {...props}
                />
              ),
              div: ({ node, className, ...props }: any) => {
                // Handle KaTeX block math divs
                if (className?.includes('katex-display') || className?.includes('math')) {
                  return (
                    <div 
                      className={`my-6 overflow-x-auto rounded-lg ${
                        isDarkMode 
                          ? 'bg-green-500/10 border border-green-500/30' 
                          : 'bg-red-500/10 border border-red-500/30'
                      }`}
                      {...props} 
                    />
                  );
                }
                return <div {...props} />;
              },
            }}
          >
            {post.content}
          </ReactMarkdown>
        </article>
      </div>
    </div>
  );
}

