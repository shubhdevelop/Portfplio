import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'content', 'blog');

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  content: string;
  author?: string;
  readTime?: string;
}

export function getBlogPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  return fs.readdirSync(postsDirectory)
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      // Keep the original filename as slug (spaces will be URL encoded)
      return file.replace(/\.md$/, '');
    });
}

export function getBlogPostBySlug(slug: string): BlogPost | null {
  try {
    // Decode URL-encoded slug to get the actual filename
    let decodedSlug = decodeURIComponent(slug);
    
    // Try to find the file - first with the decoded slug, then try variations
    let fullPath = path.join(postsDirectory, `${decodedSlug}.md`);
    
    if (!fs.existsSync(fullPath)) {
      // Try with spaces replaced by hyphens (for backwards compatibility)
      const hyphenatedSlug = decodedSlug.replace(/\s+/g, '-');
      fullPath = path.join(postsDirectory, `${hyphenatedSlug}.md`);
      
      if (!fs.existsSync(fullPath)) {
        // Try original slug without decoding
        fullPath = path.join(postsDirectory, `${slug}.md`);
        
        if (!fs.existsSync(fullPath)) {
          return null;
        }
        decodedSlug = slug;
      } else {
        decodedSlug = hyphenatedSlug;
      }
    }
    
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    // Normalize leading whitespace so frontmatter is correctly detected
    const normalizedContents = fileContents.replace(/^\s+---/, '---');
    const { data, content } = matter(normalizedContents);

    return {
      slug: decodedSlug, // Store the actual filename as slug
      title: data.title || '',
      date: data.date || '',
      description: data.description || '',
      tags: data.tags || [],
      content,
      author: data.author || 'Shubham Raj',
      readTime: data.readTime || calculateReadTime(content),
    };
  } catch (error) {
    console.error(`Error reading blog post ${slug}:`, error);
    return null;
  }
}

export function getAllBlogPosts(): BlogPost[] {
  const slugs = getBlogPostSlugs();
  const posts = slugs
    .map((slug) => getBlogPostBySlug(slug))
    .filter((post): post is BlogPost => {
      // Filter out posts that are null or missing required fields
      return post !== null && post.title !== '' && post.date !== '';
    })
    .sort((a, b) => {
      if (a.date < b.date) {
        return 1;
      } else {
        return -1;
      }
    });
  return posts;
}

function calculateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

