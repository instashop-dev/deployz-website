// Truthful <lastmod> dates for the sitemap (the `serialize` option of @astrojs/sitemap).
//
// - A blog post uses its `updatedDate`, else its `pubDate` (from the frontmatter).
// - Another page uses the date of the last git commit that changed its source file, or a legal
//   Markdown file that the page imports. Uncommitted changes do not count.
// - If no date is known (for example, git is not available), the URL has no <lastmod>.
// Never use the build time: it is not the date of a change.
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BLOG_DIR = 'src/content/blog';

function frontmatterField(source, name) {
  const frontmatter = source.split('---')[1] ?? '';
  return frontmatter.match(new RegExp(`^${name}:\\s*"?([^"\\n]*)"?`, 'm'))?.[1];
}

/** Blog post slug → ISO date (updatedDate ?? pubDate). */
function blogDates() {
  const dates = new Map();
  for (const file of readdirSync(BLOG_DIR).filter((name) => name.endsWith('.md'))) {
    const source = readFileSync(join(BLOG_DIR, file), 'utf8');
    const slug = frontmatterField(source, 'slug') ?? file.replace(/\.md$/, '');
    const date = frontmatterField(source, 'updatedDate') ?? frontmatterField(source, 'pubDate');
    if (date) dates.set(slug, new Date(date).toISOString());
  }
  return dates;
}

function lastCommitDate(files) {
  try {
    const output = execFileSync('git', ['log', '-1', '--format=%cI', '--', ...files], { encoding: 'utf8' }).trim();
    return output ? new Date(output).toISOString() : undefined;
  } catch {
    return undefined;
  }
}

/** The page source file for a URL path, and the legal Markdown files that the page imports. */
function sourceFiles(pathname) {
  const route = pathname.replace(/^\/|\/$/g, '');
  const candidates = route === '' ? ['src/pages/index.astro'] : [`src/pages/${route}.astro`, `src/pages/${route}/index.astro`];
  const page = candidates.find((file) => existsSync(file));
  if (!page) return [];
  const imports = [...readFileSync(page, 'utf8').matchAll(/legal\/([a-z0-9-]+\.md)/g)].map((match) => `src/legal/${match[1]}`);
  return [page, ...imports.filter((file) => existsSync(file))];
}

export function createLastmodSerializer() {
  const posts = blogDates();
  return (item) => {
    const { pathname } = new URL(item.url);
    const post = pathname.match(/^\/blog\/([^/]+)\/$/)?.[1];
    const files = post ? [] : sourceFiles(pathname);
    const lastmod = post ? posts.get(post) : files.length > 0 ? lastCommitDate(files) : undefined;
    return lastmod ? { ...item, lastmod } : item;
  };
}
