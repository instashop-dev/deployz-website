import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getVisiblePosts, isPublished, postUrl } from '@/lib/blog';

// The feed lists published posts only, also on the dev server.
export async function GET(context: APIContext) {
  const posts = (await getVisiblePosts()).filter((post) => isPublished(post));

  return rss({
    title: 'Deployz Blog',
    description: "Practical guides for delivering software to your customers' cloud.",
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      link: postUrl(post),
      pubDate: post.data.pubDate,
      categories: [post.data.category],
    })),
  });
}
