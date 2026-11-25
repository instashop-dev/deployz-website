import { getCollection, type CollectionEntry } from 'astro:content';

export type BlogPost = CollectionEntry<'blog'>;

/*
 * The one publication check for routes, the blog index, the sitemap, and RSS.
 * A post is public when it is not a draft and its publication date is not in the future.
 * A future date needs a new build on or after that date. The dev server (`npm run dev`, local
 * only) also shows drafts so that editors can preview them. Production builds never include them.
 */
export function isPublished(post: BlogPost, now = new Date()): boolean {
  return !post.data.draft && post.data.pubDate !== undefined && post.data.pubDate <= now;
}

export function isVisible(post: BlogPost): boolean {
  return import.meta.env.DEV || isPublished(post);
}

/** Visible posts, newest first. Undated drafts sort first. */
export async function getVisiblePosts(): Promise<BlogPost[]> {
  const posts = await getCollection('blog', isVisible);
  return posts.sort((a, b) => (b.data.pubDate?.getTime() ?? Infinity) - (a.data.pubDate?.getTime() ?? Infinity));
}

export function postUrl(post: BlogPost): string {
  return `/blog/${post.id}/`;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
}

export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Reading time in whole minutes at 200 words per minute, from the Markdown body without links and markup. */
export function readingMinutes(post: BlogPost): number {
  const text = (post.body ?? '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`|-]/g, ' ');
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** Words in the Markdown body, with the same cleanup as readingMinutes(). */
export function wordCount(post: BlogPost): number {
  const text = (post.body ?? '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`|-]/g, ' ');
  return text.split(/\s+/).filter(Boolean).length;
}

/*
 * A public category archive exists only when the category has at least this many published posts
 * (guidelines, section 3: avoid empty public archives).
 */
export const CATEGORY_ARCHIVE_MIN_POSTS = 5;

export const CATEGORIES = ['Guides', 'Decisions', 'Engineering'] as const;
export type Category = (typeof CATEGORIES)[number];

export function categorySlug(category: Category): string {
  return category.toLowerCase();
}

/** Categories that have a public archive page, with their published posts, newest first. */
export async function getCategoryArchives(): Promise<{ category: Category; posts: BlogPost[] }[]> {
  const published = (await getVisiblePosts()).filter((post) => isPublished(post));
  return CATEGORIES.map((category) => ({ category, posts: published.filter((post) => post.data.category === category) })).filter(
    (archive) => archive.posts.length >= CATEGORY_ARCHIVE_MIN_POSTS,
  );
}

/** The one contextual next step for each `cta` value (guidelines, section 8). */
export const POST_CTAS = {
  'how-it-works': { title: 'See the full process', text: 'Follow an application from GitHub to a customer’s AWS account.', href: '/how-it-works/', label: 'See how Deployz works' },
  signup: { title: 'Check your application', text: 'Connect GitHub and get a readiness report. The evaluation is free; AWS charges still apply.', href: 'SIGNUP', label: 'Get Started Free' },
  pricing: { title: 'Estimate your Deployz cost', text: 'Deployz charges are separate from the AWS charges that your customer pays.', href: '/pricing/', label: 'See pricing' },
  docs: { title: 'Read the documentation', text: 'Requirements, setup steps, and reference for vendors and their customers.', href: '/docs', label: 'Open the docs' },
  security: { title: 'Review the security model', text: 'What the Deployz connector can do in a customer account, and what data reaches Deployz.', href: '/security/', label: 'See security and architecture' },
} as const;
