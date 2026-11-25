import type { APIContext } from 'astro';
import { getVisiblePosts, isPublished, type BlogPost } from '@/lib/blog';
import { postMarkdown } from '@/lib/llms';

/*
 * A plain Markdown copy of each published post at /blog/<slug>.md, for answer engines and readers
 * that prefer text. The HTML page names it with <link rel="alternate" type="text/markdown">.
 */
export async function getStaticPaths() {
  const posts = (await getVisiblePosts()).filter((post) => isPublished(post));
  return posts.map((post) => ({ params: { slug: post.id }, props: { post } }));
}

export function GET({ props, site }: APIContext<{ post: BlogPost }>) {
  return new Response(postMarkdown(props.post, site!), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
}
