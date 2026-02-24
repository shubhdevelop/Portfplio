import { NextResponse } from 'next/server';
import { getAllBlogPosts } from '@/lib/blog';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const posts = getAllBlogPosts();
    const blogs = posts.map((post) => ({
      title: post.title,
      tagline: post.tags.join(' • ') || 'Blog Post',
      description: post.description,
      tags: post.tags,
      date: post.date,
      readLink: `/blog/${encodeURIComponent(post.slug)}`,
      slug: post.slug,
    }));
    return NextResponse.json(blogs);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json([], { status: 500 });
  }
}

