# Blog Posts

This directory contains markdown blog posts. Each blog post should be a `.md` file with frontmatter.

## Frontmatter Format

Each blog post should start with frontmatter in YAML format:

```yaml
---
title: "Your Blog Post Title"
date: "2025-11-01"
description: "A brief description of your blog post"
tags: ["Tag1", "Tag2", "Tag3"]
author: "Shubham Raj"
---
```

## Required Fields

- `title`: The title of the blog post
- `date`: Publication date in YYYY-MM-DD format
- `description`: A brief description for SEO and previews
- `tags`: Array of tags/categories

## Optional Fields

- `author`: Author name (defaults to "Shubham Raj")
- `readTime`: Custom read time (auto-calculated if not provided)

## Example

See `example.md` for a complete example.

## File Naming

Use kebab-case for filenames (e.g., `my-blog-post.md`). The filename (without .md) becomes the URL slug.

