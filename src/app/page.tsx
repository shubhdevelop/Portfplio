import type { Metadata } from "next";
import Home from "@/component/Home";
import { getAllBlogPosts } from "@/lib/blog";
import { blogPath } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Page() {
  const posts = getAllBlogPosts()
    .filter((p) => !p.noindex)
    .slice(0, 5)
    .map((p) => ({
      title: p.title,
      tagline: p.tags.join(" • "),
      description: p.description,
      tags: p.tags,
      date: p.date,
      readLink: blogPath(p.slug),
      slug: p.slug,
    }));

  return <Home posts={posts} />;
}
