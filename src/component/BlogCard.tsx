import { useTheme } from "@/hooks/theme";
import { Blog } from "@/types/types";
import { ArrowRight } from "lucide-react";

export default function BlogCard({ blog, isFirst, isLastRow }: { blog: Blog, isFirst: boolean, isLastRow: boolean }) {
    const { isDarkMode } = useTheme();
    return (
      <div className={`
        p-8 transition-colors group relative overflow-hidden flex flex-col
        ${!isFirst ? 'md:border-l border-t md:border-t-0' : ''}
        ${isLastRow ? 'border-t' : 'border-b'}
        ${isDarkMode 
          ? 'border-zinc-100 hover:bg-zinc-800 text-zinc-100' 
          : 'border-zinc-900 hover:bg-red-50/50 text-zinc-900'}
      `}>
        {/* Date Badge */}
        {blog.date && (
          <span className={`absolute top-4 right-4 text-[8px] font-pixel px-2 py-1 ${
            isDarkMode
              ? 'bg-zinc-100 text-zinc-900 shadow-[2px_2px_0px_0px_#22c55e]'
              : 'bg-zinc-900 text-white shadow-[2px_2px_0px_0px_#c92a2a]'
          }`}>
            {blog.date}
          </span>
        )}
        
        <h4 className={`font-pixel text-lg md:text-xl mb-3 leading-tight transition-colors mt-2 ${
          isDarkMode ? 'group-hover:text-green-400' : 'group-hover:text-red-700'
        }`}>
          {blog.title}
        </h4>
        <p className={`font-mono text-xs uppercase tracking-wider mb-4 border-b border-dotted inline-block pb-1 ${
          isDarkMode ? 'text-zinc-400 border-zinc-600' : 'text-zinc-500 border-zinc-400'
        }`}>
          {blog.tagline}
        </p>
        <p className={`font-sans text-sm mb-6 leading-relaxed ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
          {blog.description}
        </p>
        
        <div className="mt-auto">
          <div className="flex flex-wrap gap-2 mb-6 font-pixel text-[8px] uppercase">
            {blog.tags.map(tag => (
              <span key={tag} className={`border-2 px-2 py-1 ${
                isDarkMode
                  ? 'border-zinc-100 bg-zinc-800 text-zinc-100 shadow-[2px_2px_0px_0px_#555]'
                  : 'border-zinc-900 bg-white text-zinc-900 shadow-[2px_2px_0px_0px_#ccc]'
              }`}>
                {tag}
              </span>
            ))}
          </div>
          <a 
            href={blog.readLink || '#'} 
            target="_blank" 
            rel="noopener noreferrer"
            className={`inline-flex items-center font-bold text-xs decoration-2 underline-offset-4 font-pixel group-hover:translate-x-2 transition-transform ${
              isDarkMode ? 'hover:text-green-400' : 'hover:text-red-700'
            }`}
          >
            Read More <ArrowRight className="w-4 h-4 ml-2" />
          </a>
        </div>
      </div>
    );
  };

