import { useTheme } from "@/hooks/theme";
import { Blog } from "@/types/types";
import BlogCard from "./BlogCard";

export default function Blogs() {
    const { isDarkMode } = useTheme();
    const blogs: Blog[] = [
      {
        title: "The Hyper Efficient Chef: A Recipe for Understanding Redis's RESP Protocol",
        tagline: "Systems Programming Deep Dive",
        description: "Redis is a powerful in-memory data store that powers millions of applications. Understanding its RESP (Redis Serialization Protocol) is crucial for efficient interaction. This blog dives deep into the protocol's design, its role in Redis, and how it enables high-performance data access.",
        tags: ["Redis", "Systems Programming"],
        date: "Nov 2025",
        readLink: "https://beyond-surface-level.hashnode.dev/the-hyper-efficient-chef-a-recipe-for-understanding-rediss-resp"
      },

    ];
  
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
          <a 
            href="#" 
            target="_blank" 
            rel="noopener noreferrer" 
            className={`font-pixel text-[8px] md:text-[10px] uppercase transition-colors border px-2 py-1 ${
              isDarkMode 
                ? 'border-zinc-100 hover:bg-zinc-100 hover:text-zinc-900' 
                : 'border-white hover:bg-white hover:text-zinc-900'
            }`}
          >
            View All ↗
          </a>
        </div>
        
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
      </section>
    );
  };

