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
