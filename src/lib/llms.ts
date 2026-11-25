// Text exports for answer engines: /llms.txt, /llms-full.txt and /blog/<slug>.md.
import { formatDate, isoDate, postUrl, type BlogPost } from '@/lib/blog';

/** The post as Markdown: title, metadata, short answer, body, takeaways and sources. Site links become absolute. */
export function postMarkdown(post: BlogPost, site: URL): string {
  const { title, description, author, pubDate, updatedDate, summary, keyTakeaways, sources, category } = post.data;
  const url = new URL(postUrl(post), site).href;
  const body = (post.body ?? '').replace(/\]\((\/[^)]*)\)/g, (_match, path: string) => `](${new URL(path, site).href})`);
  const lines = [
    `# ${title}`,
    '',
    `> ${description}`,
    '',
    `- URL: ${url}`,
    `- Category: ${category}`,
    ...(author ? [`- Author: ${author}`] : []),
    ...(pubDate ? [`- Published: ${isoDate(pubDate)}`] : []),
    ...(updatedDate ? [`- Updated: ${isoDate(updatedDate)}`] : []),
    '',
    ...(summary ? ['## Short answer', '', summary, ''] : []),
    body.trim(),
    '',
    ...(keyTakeaways.length > 0 ? ['## Key takeaways', '', ...keyTakeaways.map((item) => `- ${item}`), ''] : []),
    ...(sources.length > 0 ? ['## Sources', '', ...sources.map((source) => `- [${source.title}](${source.url})`), ''] : []),
  ];
  return `${lines.join('\n').trim()}\n`;
}

/** One line for a post in llms.txt. */
export function postIndexLine(post: BlogPost, site: URL): string {
  const date = post.data.pubDate ? ` (${formatDate(post.data.pubDate)})` : '';
  return `- [${post.data.title}](${new URL(`/blog/${post.id}.md`, site).href})${date}: ${post.data.summary ?? post.data.description}`;
}
