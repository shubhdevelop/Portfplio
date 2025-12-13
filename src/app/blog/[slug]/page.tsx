import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBlogPostBySlug, getAllBlogPosts } from '@/lib/blog';
import BlogPostClient from './BlogPostClient';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

// Enable dynamic rendering for this route
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const posts = getAllBlogPosts();
    return posts.map((post) => {
      // Encode the slug for URL, but handle spaces and special characters
      const encodedSlug = encodeURIComponent(post.slug);
      return {
        slug: encodedSlug,
      };
    });
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: 'Blog Post Not Found',
    };
  }

  return {
    title: `${post.title} | Shubham Raj`,
    description: post.description,
    authors: [{ name: post.author || 'Shubham Raj' }],
    keywords: post.tags,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author || 'Shubham Raj'],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  
  // Decode the slug from URL
  const decodedSlug = decodeURIComponent(slug);
  const post = getBlogPostBySlug(decodedSlug);

  if (!post) {
    notFound();
  }

  return <BlogPostClient post={post} />;
}

