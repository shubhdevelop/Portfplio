import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBlogPostBySlug, getAllBlogPosts } from '@/lib/blog';
import { SITE_NAME, absoluteUrl, blogPath } from '@/lib/site';
import { extractHeadings } from '@/lib/headings';
import BlogPostClient, { type PostLink } from './BlogPostClient';

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
    authors: [{ name: post.author || SITE_NAME }],
    keywords: post.tags,
    alternates: { canonical: blogPath(post.slug) },
    robots: post.noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      title: post.title,
      description: post.description,
      url: blogPath(post.slug),
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

  const all = getAllBlogPosts();
  const i = all.findIndex((p) => p.slug === post.slug);
  const toLink = (p?: (typeof all)[number]): PostLink | null =>
    p ? { slug: p.slug, title: p.title, href: blogPath(p.slug) } : null;
  const newer = toLink(i > 0 ? all[i - 1] : undefined);
  const older = toLink(i >= 0 ? all[i + 1] : undefined);

  const url = absoluteUrl(blogPath(post.slug));
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': `${url}#article`,
        mainEntityOfPage: url,
        headline: post.title,
        description: post.description,
        datePublished: post.date,
        dateModified: post.date,
        author: { '@type': 'Person', name: post.author || SITE_NAME, url: absoluteUrl('/') },
        keywords: post.tags.join(', '),
        inLanguage: 'en',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/') },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: absoluteUrl('/blog') },
          { '@type': 'ListItem', position: 3, name: post.title, item: url },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        // Escape "<" so post text cannot terminate the script element.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <BlogPostClient post={post} headings={extractHeadings(post.content)} newer={newer} older={older} />
    </>
  );
}

