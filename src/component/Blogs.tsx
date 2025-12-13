"use client";

import { useTheme } from "@/hooks/theme";
import { Blog } from "@/types/types";
import BlogCard from "./BlogCard";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Blogs() {
    const { isDarkMode } = useTheme();
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      async function fetchBlogs() {
        try {
          const response = await fetch('/api/blog');
          const data = await response.json();
          setBlogs(data);
        } catch (error) {
          console.error('Error fetching blogs:', error);
        } finally {
          setLoading(false);
        }
      }
      fetchBlogs();
    }, []);
  
    return (
      <section className={`border-b-2 transition-colors ${
        isDarkMode ? 'bg-zinc-900 border-zinc-100' : 'bg-[#fdfbf7] border-zinc-900'
      }`}>
        <div className={`border-b-2 p-4 md:p-6 flex justify-between items-center sticky top-0 z-10 ${
          isDarkMode ? 'border-zinc-100 bg-zinc-800 text-zinc-100' : 'border-zinc-900 bg-zinc-900 text-white'
        }`}>
          <h3 className={`font-pixel text-sm md:text-lg tracking-wide ${isDarkMode ? 'text-green-400' : 'text-yellow-400'}`}>
            Featured Blogs
          </h3>
          <Link 
            href="/blog"
            className={`font-pixel text-[8px] md:text-[10px] uppercase transition-colors border px-2 py-1 ${
              isDarkMode 
                ? 'border-zinc-100 hover:bg-zinc-100 hover:text-zinc-900' 
                : 'border-white hover:bg-white hover:text-zinc-900'
            }`}
          >
            View All ↗
          </Link>
        </div>
        
        {loading ? (
          <div className={`p-8 text-center ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
            <p className="font-mono text-sm">Loading blogs...</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className={`p-8 text-center ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
            <p className="font-mono text-sm">No blog posts yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2">
            {blogs.map((blog, idx) => (
              <BlogCard 
                key={blog.title} 
                blog={blog} 
                isFirst={idx === 0}
                isLastRow={idx >= 2} 
              />
            ))}
          </div>
        )}
      </section>
    );
  };

