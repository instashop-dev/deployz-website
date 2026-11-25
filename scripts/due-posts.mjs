#!/usr/bin/env node
// Lists the posts that become public today (UTC): not drafts, with a pubDate of today.
// The scheduled-publish workflow builds and deploys only when this list is not empty, because a
// post with a future pubDate is public only after a build on or after that date (src/lib/blog.ts).
// Usage: node scripts/due-posts.mjs [--date YYYY-MM-DD]. Prints one slug per line.

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { splitFrontmatter } from './blog-lint.mjs';

const dateFlag = process.argv.indexOf('--date');
const today = dateFlag > -1 ? process.argv[dateFlag + 1] : new Date().toISOString().slice(0, 10);
const dir = 'src/content/blog';

for (const name of readdirSync(dir).filter((file) => file.endsWith('.md'))) {
  const { data } = splitFrontmatter(readFileSync(join(dir, name), 'utf8'));
  if (!data || data.draft === true || !data.pubDate) continue;
  const pubDate = new Date(data.pubDate).toISOString().slice(0, 10);
  if (pubDate === today) console.log(data.slug);
}
