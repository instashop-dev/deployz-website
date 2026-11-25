import { file, glob } from 'astro/loaders';
import { defineCollection, reference, z } from 'astro:content';

/*
 * Blog articles (src/content/blog/*.md). The rules for topics, metadata, and publication are in
 * docs/DEPLOYZ_BLOG_MASTER_GUIDELINES.md. The `slug` field sets the entry ID and the URL.
 * A draft can omit the author and the publication date. A published post must have both.
 *
 * The content engine in the deployz-marketing repository (content/README.md) writes drafts in this
 * format. It never sets `draft: false`; a person does that at publication. `npm run blog:lint` checks
 * the SEO and answer-engine rules that the schema cannot express.
 */
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string().min(1),
        // Optional shorter title for the <title> tag and social cards. The page heading keeps `title`.
        seoTitle: z.string().min(1).max(60).optional(),
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
        // Answer-first summary: the direct answer to the post's central question, shown as "Short answer"
        // above the body and used in llms.txt and the BlogPosting `abstract`. Plain text, 1–3 sentences.
        summary: z.string().min(40).max(320).optional(),
        // Up to five self-contained statements that a reader (or an answer engine) can quote.
        keyTakeaways: z.array(z.string().min(1).max(200)).max(5).default([]),
        // External or product sources that support the claims. Rendered as a "Sources" list and as
        // BlogPosting `citation`. Use primary sources (AWS documentation, the Deployz docs).
        sources: z
          .array(z.object({ title: z.string().min(1), url: z.string().url(), publisher: z.string().min(1).optional() }))
          .max(12)
          .default([]),
        // The person who checked the facts against the product, and the date of that check.
        reviewedBy: z.string().min(1).optional(),
        lastReviewed: z.coerce.date().optional(),
        // The one contextual next step at the end of the article (guidelines, section 8).
        cta: z.enum(['how-it-works', 'signup', 'pricing', 'docs', 'security']).default('how-it-works'),
        // Table of contents. By default a post with four or more h2 headings gets one.
        toc: z.boolean().optional(),
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
        if (post.lastReviewed && !post.reviewedBy) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['reviewedBy'], message: 'A review date needs the name of the reviewer.' });
        }
      }),
});

/*
 * Authors (src/content/authors.json). Each entry is a real person or the team byline. A post's
 * `author` matches an entry `name`. The post page shows the bio and links, and the BlogPosting data
 * gets the author URL and profiles. Add only real profiles to `sameAs`.
 */
const authors = defineCollection({
  loader: file('src/content/authors.json'),
  schema: z.object({
    name: z.string().min(1),
    type: z.enum(['Person', 'Organization']).default('Person'),
    role: z.string().min(1).optional(),
    bio: z.string().min(1).max(300),
    url: z.string().url().optional(),
    sameAs: z.array(z.string().url()).default([]),
  }),
});

export const collections = { blog, authors };
