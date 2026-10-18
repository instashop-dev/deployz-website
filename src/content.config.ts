import { glob } from 'astro/loaders';
import { defineCollection, reference, z } from 'astro:content';

/*
 * Blog articles (src/content/blog/*.md). The rules for topics, metadata, and publication are in
 * docs/DEPLOYZ_BLOG_MASTER_GUIDELINES.md. The `slug` field sets the entry ID and the URL.
 * A draft can omit the author and the publication date. A published post must have both.
 */
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string().min(1),
        description: z.string().min(1),
        slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
        category: z.enum(['Guides', 'Decisions', 'Engineering']),
        author: z.string().min(1).optional(),
        pubDate: z.coerce.date().optional(),
        updatedDate: z.coerce.date().optional(),
        draft: z.boolean().default(false),
        featured: z.boolean().default(false),
        cover: image().optional(),
        coverAlt: z.string().optional(),
        related: z.array(reference('blog')).max(2).default([]),
      })
      .superRefine((post, ctx) => {
        if (!post.draft && !post.author) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['author'], message: 'A published post needs a real author.' });
        }
        if (!post.draft && !post.pubDate) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['pubDate'], message: 'A published post needs a publication date.' });
        }
        if (post.cover && !post.coverAlt) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['coverAlt'], message: 'A cover image needs alt text.' });
        }
        if (post.pubDate && post.updatedDate && post.updatedDate < post.pubDate) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['updatedDate'], message: 'The update date is before the publication date.' });
        }
      }),
});

export const collections = { blog };
