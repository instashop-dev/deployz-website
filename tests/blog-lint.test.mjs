// Unit tests for scripts/blog-lint.mjs. Run: npm run test:blog
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { lintPost, proseOf, splitFrontmatter } from '../scripts/blog-lint.mjs';

const NOW = new Date('2026-11-25T12:00:00Z');

function post(frontmatter, body, file = `src/content/blog/${frontmatter.slug}.md`) {
  return { file, data: frontmatter, body };
}

const base = {
  title: 'What AWS access should you ask for in a customer account?',
  description: 'Learn which AWS permissions a vendor needs in a customer account, how a scoped connector works, and what to explain to the customer security team.',
  summary: 'Ask only for the permissions that your deployment creates and manages, scoped by tags, and explain each one to the customer before they approve it.',
  slug: 'aws-access-in-customer-account',
  category: 'Guides',
  draft: true,
};

const goodBody = `Intro paragraph.

## What does the connector need?

See [how Deployz works](/how-it-works/) and the [requirements](/docs/prepare/requirements).

## How do you explain it?

Short sentences here.
`;

test('splitFrontmatter reads YAML and the body', () => {
  const { data, body } = splitFrontmatter('---\ntitle: "A"\nsources:\n  - title: X\n    url: https://a.example\n---\nBody');
  assert.equal(data.title, 'A');
  assert.equal(data.sources[0].url, 'https://a.example');
  assert.equal(body, 'Body');
});

test('a complete draft has no errors', () => {
  const result = lintPost(post(base, goodBody), [], '', NOW);
  assert.deepEqual(result.errors, []);
  assert.equal(result.status, 'draft');
});

test('a draft without a summary or commercial link gets warnings, a published post gets errors', () => {
  const body = '## One\n\nText.\n\n## Two\n\nText.\n';
  const draft = lintPost(post({ ...base, summary: undefined }, body), [], '', NOW);
  assert.equal(draft.errors.length, 0);
  assert.ok(draft.warnings.some((w) => w.includes('summary')));

  const live = lintPost(post({ ...base, summary: undefined, draft: false, pubDate: '2026-11-01', author: 'Team Deployz' }, body), [], '', NOW);
  assert.ok(live.errors.some((e) => e.includes('summary')));
  assert.ok(live.errors.some((e) => e.includes('commercial page')));
});

test('a published byline must be in authors.json', () => {
  const live = { ...base, draft: false, pubDate: '2026-11-01', author: 'Jane Invented' };
  assert.ok(lintPost(post(live, goodBody), [], '', NOW, ['Team Deployz']).errors.some((e) => e.includes('not in src/content/authors.json')));
  assert.ok(!lintPost(post({ ...live, author: 'Team Deployz' }, goodBody), [], '', NOW, ['Team Deployz']).errors.some((e) => e.includes('authors.json')));
});

test('banned claims are errors', () => {
  const result = lintPost(post(base, `${goodBody}\nAll data stays in your account and Deployz is SOC 2 certified.\n`), [], '', NOW);
  assert.equal(result.errors.filter((e) => e.startsWith('Unsupported claim')).length, 2);
});

test('a claim in inline code is discussion, not a claim', () => {
  const result = lintPost(post(base, `${goodBody}\nDo not write \`zero lock-in\`.\n`), [], '', NOW);
  assert.equal(result.errors.length, 0);
});

test('link rules: trailing slashes, docs form, missing posts, link text', () => {
  const body = `${goodBody}\n[x](/pricing) [y](/docs/prepare/) [z](/blog/missing/) [here](/security/)\n`;
  const result = lintPost(post(base, body), [], '', NOW);
  assert.ok(result.errors.some((e) => e.includes('Site links end with a slash')));
  assert.ok(result.errors.some((e) => e.includes('Docs links have no trailing slash')));
  assert.ok(result.errors.some((e) => e.includes('does not exist')));
  assert.ok(result.errors.some((e) => e.includes('descriptive link text')));
});

test('a published post cannot link to a draft', () => {
  const draft = post({ ...base, slug: 'later-post', title: 'Later', description: 'Other description' }, goodBody);
  const live = post({ ...base, draft: false, pubDate: '2026-11-01', author: 'Team Deployz' }, `${goodBody}\n[later](/blog/later-post/)\n`);
  const result = lintPost(live, [draft, live], '', NOW);
  assert.ok(result.errors.some((e) => e.includes('not published before this one')));
});

test('long titles, headings that skip levels and h1 in the body are errors', () => {
  const result = lintPost(post({ ...base, title: 'x'.repeat(61) }, '# Title\n\n## A\n\n#### B\n\n## C\n'), [], '', NOW);
  assert.ok(result.errors.some((e) => e.includes('search title')));
  assert.ok(result.errors.some((e) => e.includes('level-1')));
  assert.ok(result.errors.some((e) => e.includes('skips a level')));
});

test('proseOf removes code and link targets', () => {
  assert.equal(proseOf('a `b` [c](/d) ```\ne\n```').replace(/\s+/g, ' ').trim(), 'a c');
});
