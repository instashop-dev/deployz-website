import type { APIContext } from 'astro';
import { getVisiblePosts, isPublished } from '@/lib/blog';
import { postMarkdown } from '@/lib/llms';

// /llms-full.txt: the full Markdown of every published post, newest first.
export async function GET({ site }: APIContext) {
  const posts = (await getVisiblePosts()).filter((post) => isPublished(post));
  const header = "# The Deployz Blog: full text\n\n> Practical guides for delivering software to your customers' cloud.\n";
  const text = [header, ...posts.map((post) => postMarkdown(post, site!))].join('\n---\n\n');
  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
