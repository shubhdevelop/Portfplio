export interface Heading {
  id: string;
  text: string;
  level: 2 | 3;
}

export function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s-]/gu, '')
      .trim()
      .replace(/\s+/g, '-') || 'section'
  );
}

/** Returns a function that yields unique ids, appending -1, -2 on repeats. */
export function createIdAllocator() {
  const seen = new Map<string, number>();
  return (text: string) => {
    const base = slugify(text);
    const n = seen.get(base) ?? 0;
    seen.set(base, n + 1);
    return n === 0 ? base : `${base}-${n}`;
  };
}

function stripInlineMarkdown(s: string): string {
  return s
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*_`]/g, '')
    .replace(/\$([^$]*)\$/g, '$1')
    .trim();
}

/** Extracts h2/h3 headings from markdown, ignoring fenced code. */
export function extractHeadings(markdown: string): Heading[] {
  const alloc = createIdAllocator();
  const out: Heading[] = [];
  let fenced = false;
  for (const line of markdown.split('\n')) {
    if (/^\s*```/.test(line)) {
      fenced = !fenced;
      continue;
    }
    if (fenced) continue;
    const m = /^(#{1,6})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!m) continue;
    const text = stripInlineMarkdown(m[2]);
    const id = alloc(text);
    if (m[1].length === 2 || m[1].length === 3) {
      out.push({ id, text, level: m[1].length as 2 | 3 });
    }
  }
  return out;
}

// rehype plugin: assigns the same ids extractHeadings computes.
interface HastNode {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
}

function nodeText(n: HastNode): string {
  if (n.type === 'text') return n.value ?? '';
  return (n.children ?? []).map(nodeText).join('');
}

export function rehypeHeadingIds() {
  return (tree: HastNode) => {
    const alloc = createIdAllocator();
    const walk = (n: HastNode) => {
      if (n.type === 'element' && n.tagName && /^h[1-6]$/.test(n.tagName)) {
        n.properties = { ...n.properties, id: alloc(nodeText(n).trim()) };
      }
      n.children?.forEach(walk);
    };
    walk(tree);
  };
}
