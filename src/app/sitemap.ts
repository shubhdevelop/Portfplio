import type { MetadataRoute } from 'next';
import { getAllBlogPosts } from '@/lib/blog';
import { absoluteUrl, blogPath } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllBlogPosts().filter((post) => !post.noindex);
  const latest = posts[0]?.date;

  return [
    { url: absoluteUrl('/'), lastModified: latest },
    { url: absoluteUrl('/blog'), lastModified: latest },
    { url: absoluteUrl('/tools/cache-address-calculator') },
    ...posts.map((post) => ({
      url: absoluteUrl(blogPath(post.slug)),
      lastModified: post.date,
    })),
  ];
}
