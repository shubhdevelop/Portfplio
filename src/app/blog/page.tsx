import type { Metadata } from 'next';
import { getAllBlogPosts } from '@/lib/blog';
import { blogPath } from '@/lib/site';
import type { Blog } from '@/types/types';
import BlogListClient from './BlogListClient';

export const metadata: Metadata = {
  title: 'Blog | Shubham Raj',
  description:
    'Articles on CPU caches, network protocols, distributed systems, Redis, and systems programming by Shubham Raj.',
  alternates: { canonical: '/blog' },
};

export default function BlogListPage() {
  const blogs: Blog[] = getAllBlogPosts().map((post) => ({
    title: post.title,
    tagline: post.tags.join(' • ') || 'Blog Post',
    description: post.description,
    tags: post.tags,
    date: post.date,
    readLink: blogPath(post.slug),
    slug: post.slug,
  }));

  return <BlogListClient blogs={blogs} />;
}
