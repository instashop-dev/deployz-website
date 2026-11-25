#!/usr/bin/env node
// Blog quality gate: the SEO, answer-engine (AEO), and editorial rules that the content schema in
// src/content.config.ts cannot express. The rules come from docs/DEPLOYZ_BLOG_MASTER_GUIDELINES.md
// and docs/SEO_PLAN.md. The content engine in the deployz-marketing repository runs this script on
// each draft, and the blog workflow runs it on each pull request.
//
// Usage:
//   npm run blog:lint                       all posts
//   npm run blog:lint -- src/content/blog/x.md   one post (the other posts are still read for cross-checks)
//   npm run blog:lint -- --json             machine-readable result
//
// Exit code 1 when a post has an error. Warnings do not fail the run.

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const BLOG_DIR = join(ROOT, 'src/content/blog');
const PAGES_DIR = join(ROOT, 'src/pages');

export const LIMITS = { title: 60, descriptionMin: 110, descriptionMax: 160, sentenceWords: 26 };

/** Commercial pages. Each post links to at least one in its body (SEO plan, section 6, rule 2). */
export const COMMERCIAL_PAGES = ['/how-it-works/', '/pricing/', '/security/', '/use-cases/', '/byoc-deployments/', '/deploy-saas-to-customer-aws/'];

/** Site pages that exist in this build. /docs is the Mintlify site (no trailing slash). */
const SITE_PAGES = ['/', '/about/', '/blog/', ...COMMERCIAL_PAGES, '/privacy/', '/terms/', '/gdpr/', '/dpa/'];

/*
 * Claims that must not appear (deployz-marketing 07-claims-and-review.md, "Statements to avoid").
 * Each rule is a regular expression on lowercase prose. Quote a phrase in backticks to discuss it.
 */
export const BANNED_CLAIMS = [
  { pattern: /all (your |of the |customer )?data (stays|remains|never leaves)/, reason: 'Not all data stays in the customer account (model APIs, builds, metadata, proxy routing).' },
  { pattern: /deployz (is|has been) (soc ?2|iso ?27001|hipaa)[- ]?(certified|compliant|audited)/, reason: 'Deployz has not completed its own audit.' },
  { pattern: /works with any (app|application|stack)/, reason: 'The supported architecture has clear limits.' },
  { pattern: /free aws hosting|aws (resources|hosting) (are|is) free/, reason: 'The evaluation is free; AWS charges apply.' },
  { pattern: /instant(ly)? deploy|deploy(s|ed)? in (seconds|minutes)|one[- ]click deploy/, reason: 'No measured deployment time is published.' },
  { pattern: /zero lock-?in|no lock-?in/, reason: 'Default URLs and image pulls depend on Deployz.' },
  { pattern: /deployz cannot access|no access to (your|the customer'?s?) aws/, reason: 'The connector manages resources with the approved permissions.' },
  { pattern: /guarantee(d|s)? (uptime|compliance|savings|revenue|results)/, reason: 'No evidence supports guaranteed outcomes.' },
];

/** Words that the guidelines and AGENTS.md ask writers to avoid. Warnings only. */
export const STYLE_WORDS = [
  /\bsimply\b/, /\bobviously\b/, /\beasy\b/, /\beasily\b/, /\bseamless(ly)?\b/, /\beffortless(ly)?\b/, /\bpowerful\b/,
  /\brevolutionary\b/, /\bgame[- ]chang(er|ing)\b/, /\bcutting[- ]edge\b/, /\bleverage\b/, /\butilize\b/, /\bin today'?s\b/, /\bdelve\b/, /\bunlock\b/,
];

/** Splits a Markdown file into frontmatter data and body. */
export function splitFrontmatter(source) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: null, body: source };
  return { data: parseYaml(match[1]) ?? {}, body: match[2] };
}

/** Prose only: no code blocks, inline code, link targets, HTML tags, or images. */
export function proseOf(body) {
  return body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ');
}

export function linksOf(body) {
  const withoutCode = body.replace(/```[\s\S]*?```/g, ' ').replace(/`[^`]*`/g, ' ');
  return [...withoutCode.matchAll(/(!?)\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)].map((m) => ({ image: m[1] === '!', text: m[2], href: m[3] }));
}

export function isPublished(data, now = new Date()) {
  return data.draft !== true && data.pubDate !== undefined && new Date(data.pubDate) <= now;
}

/** Lints one post. `posts` is every post (for cross-checks); `pageSources` is the text of src/pages. */
export function lintPost(post, posts, pageSources = '', now = new Date()) {
  const errors = [];
  const warnings = [];
  const { data, body, file } = post;
  if (!data) return { file, errors: ['The file has no YAML frontmatter.'], warnings };

  const published = isPublished(data, now);
  const live = data.draft !== true; // published or scheduled
  const slug = data.slug;
  // Rules that block publication are errors for live posts and warnings for drafts.
  const gate = (message) => (live ? errors : warnings).push(message);

  if (slug && basename(file, '.md') !== slug) errors.push(`The file name must equal the slug ("${slug}.md").`);

  // Title and description lengths (SEO plan, task 9).
  const searchTitle = data.seoTitle ?? data.title ?? '';
  if (searchTitle.length > LIMITS.title) errors.push(`The search title has ${searchTitle.length} characters. Keep it at ${LIMITS.title} or fewer, or add a shorter seoTitle.`);
  const description = data.description ?? '';
  if (description.length > LIMITS.descriptionMax) errors.push(`The description has ${description.length} characters. Keep it at ${LIMITS.descriptionMax} or fewer.`);
  else if (description.length < LIMITS.descriptionMin) warnings.push(`The description has ${description.length} characters. Use about ${LIMITS.descriptionMin}–155 for a full search snippet.`);
  if (data.title && /[!]|\b(ultimate|best|definitive)\b/i.test(data.title)) warnings.push('The title uses hype words or an exclamation mark (guidelines, section 4).');

  // Answer-first content (AEO).
  if (!data.summary) gate('Add a `summary`: the direct answer to the central question, in 1–3 sentences.');
  else {
    if (data.summary.trim() === description.trim()) warnings.push('The summary repeats the description. Make the summary the answer, and the description the promise.');
    if (/^(in this (article|post|guide)|this (article|post|guide))/i.test(data.summary)) warnings.push('The summary describes the article. Write the answer itself.');
  }
  if (live && !data.author) errors.push('A published post needs a real author.');
  if (live && !data.reviewedBy) warnings.push('Add `reviewedBy` and `lastReviewed` after the fact check (guidelines, section 8).');

  // Headings.
  const headingLines = body.replace(/```[\s\S]*?```/g, '').split(/\r?\n/).filter((line) => /^#{1,6}\s/.test(line));
  if (headingLines.some((line) => /^#\s/.test(line))) errors.push('Do not use a level-1 heading in the body. The page title is the h1.');
  let previous = 1;
  for (const line of headingLines) {
    const level = line.match(/^#+/)[0].length;
    if (level > previous + 1) errors.push(`The heading "${line.trim()}" skips a level.`);
    previous = level;
  }
  if (headingLines.filter((line) => /^##\s/.test(line)).length < 2) warnings.push('Use at least two h2 sections so that readers and answer engines can find each part.');
  const questionHeadings = headingLines.filter((line) => /\?\s*$/.test(line)).length;
  if (headingLines.length >= 4 && questionHeadings === 0) warnings.push('No heading is a question. Question headings that match real reader questions help answer engines.');

  // Links.
  const links = linksOf(body);
  const internal = links.filter((link) => !link.image && link.href.startsWith('/'));
  const postSlugs = new Map(posts.filter((p) => p.data?.slug).map((p) => [p.data.slug, p.data]));
  if (!internal.some((link) => COMMERCIAL_PAGES.includes(link.href.split('#')[0]))) gate(`Link to one commercial page that matches the topic: ${COMMERCIAL_PAGES.join(', ')}.`);
  if (!internal.some((link) => link.href.startsWith('/docs'))) warnings.push('Link to the matching documentation page under /docs where one exists.');
  for (const link of internal) {
    const path = link.href.split('#')[0];
    if (path.startsWith('/docs')) {
      if (path.length > 5 && path.endsWith('/')) errors.push(`Docs links have no trailing slash: ${link.href}`);
      continue;
    }
    const blog = path.match(/^\/blog\/([a-z0-9-]+)\/$/);
    if (blog) {
      const target = postSlugs.get(blog[1]);
      if (!target) errors.push(`The link ${link.href} goes to a post that does not exist.`);
      else if (live && !isPublished(target, now) && !(target.draft !== true && data.pubDate && new Date(target.pubDate) <= new Date(data.pubDate))) {
        errors.push(`The link ${link.href} goes to a post that is not published before this one.`);
      }
      continue;
    }
    if (!path.endsWith('/')) errors.push(`Site links end with a slash: ${link.href}`);
    else if (!SITE_PAGES.includes(path) && !path.startsWith('/blog/')) warnings.push(`Check the link ${link.href}: it is not a known site page.`);
  }
  for (const link of links.filter((l) => !l.image && /^http:\/\//.test(l.href))) warnings.push(`Use HTTPS: ${link.href}`);
  for (const link of links.filter((l) => !l.image && /^(click here|here|read more|this)$/i.test(l.text.trim()))) errors.push(`Use descriptive link text, not "${link.text}".`);
  for (const source of data.sources ?? []) if (!/^https:\/\//.test(source.url ?? '')) errors.push(`Source URLs use HTTPS: ${source.url}`);

  // Images.
  for (const image of links.filter((l) => l.image)) {
    if (!image.text.trim()) errors.push(`The image ${image.href} needs alt text.`);
    if (!/^https?:/.test(image.href) && !existsSync(join(dirname(file), image.href))) errors.push(`The image ${image.href} does not exist.`);
  }
  for (const tag of body.match(/<img\b[^>]*>/g) ?? []) if (!/\balt="[^"]+"/.test(tag)) errors.push('An HTML image needs alt text.');

  // Claims and style.
  const prose = proseOf(body).toLowerCase();
  const allText = `${prose}\n${[data.title, data.description, data.summary, ...(data.keyTakeaways ?? [])].join('\n').toLowerCase()}`;
  for (const rule of BANNED_CLAIMS) if (rule.pattern.test(allText)) errors.push(`Unsupported claim (${rule.pattern.source}): ${rule.reason}`);
  const styleHits = STYLE_WORDS.filter((pattern) => pattern.test(allText)).map((pattern) => pattern.source.replace(/\\b/g, ''));
  if (styleHits.length) warnings.push(`Avoid these words: ${styleHits.join(', ')}.`);
  const sentences = prose.split(/(?<=[.!?])\s+/).map((s) => s.split(/\s+/).filter(Boolean).length).filter((n) => n > 3);
  const average = sentences.length ? sentences.reduce((a, b) => a + b, 0) / sentences.length : 0;
  if (average > LIMITS.sentenceWords) warnings.push(`Sentences average ${average.toFixed(1)} words. Aim for fewer than ${LIMITS.sentenceWords}.`);
  if (/\[(todo|tbd|citation needed|source|verify)[^\]]*\]/i.test(body)) gate('Resolve the [TODO], [TBD], or [verify] markers.');

  // Duplicates across posts.
  for (const other of posts) {
    if (other === post || !other.data) continue;
    if (other.data.title === data.title) errors.push(`Another post has the same title: ${other.data.slug}.`);
    if (other.data.description === data.description) errors.push(`Another post has the same description: ${other.data.slug}.`);
  }

  // Orphans and social images for published posts.
  if (published) {
    const linkedFromPost = posts.some((other) => other !== post && other.data && ((other.data.related ?? []).includes(slug) || other.body.includes(`/blog/${slug}/`)));
    if (!linkedFromPost && !pageSources.includes(`/blog/${slug}/`)) warnings.push('No other page links to this post. Add a link from one related page (SEO plan, section 6, rule 5).');
    if (!existsSync(join(ROOT, `public/og/blog/${slug}.png`))) warnings.push('The post has no social image. Run `npm run og-images`.');
  }

  return { file, slug, status: published ? 'published' : live ? 'scheduled' : 'draft', errors, warnings };
}

function readPosts() {
  return readdirSync(BLOG_DIR)
    .filter((name) => name.endsWith('.md'))
    .map((name) => {
      const file = join(BLOG_DIR, name);
      const { data, body } = splitFrontmatter(readFileSync(file, 'utf8'));
      return { file, data, body };
    });
}

function readPageSources(dir = PAGES_DIR) {
  return readdirSync(dir, { withFileTypes: true })
    .map((entry) => (entry.isDirectory() ? readPageSources(join(dir, entry.name)) : /\.(astro|ts|md)$/.test(entry.name) ? readFileSync(join(dir, entry.name), 'utf8') : ''))
    .join('\n');
}

function main(argv) {
  const json = argv.includes('--json');
  const targets = argv.filter((arg) => !arg.startsWith('--')).map((arg) => resolve(arg));
  const posts = readPosts();
  const pageSources = readPageSources();
  const selected = targets.length ? posts.filter((post) => targets.includes(resolve(post.file))) : posts;
  if (targets.length && selected.length !== targets.length) {
    console.error('A file is not in src/content/blog/.');
    process.exit(2);
  }
  const results = selected.map((post) => lintPost(post, posts, pageSources));
  const errorCount = results.reduce((n, r) => n + r.errors.length, 0);

  if (json) console.log(JSON.stringify({ ok: errorCount === 0, results }, null, 2));
  else {
    for (const result of results) {
      const name = result.file.slice(ROOT.length + 1).replace(/\\/g, '/');
      console.log(`${result.errors.length ? '✗' : '✓'} ${name} (${result.status ?? 'unknown'})`);
      for (const message of result.errors) console.log(`    error    ${message}`);
      for (const message of result.warnings) console.log(`    warning  ${message}`);
    }
    console.log(`\n${results.length} post(s), ${errorCount} error(s), ${results.reduce((n, r) => n + r.warnings.length, 0)} warning(s).`);
  }
  process.exit(errorCount ? 1 : 0);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main(process.argv.slice(2));
