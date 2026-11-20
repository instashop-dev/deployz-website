// Makes the 1200 × 630 social preview images in public/og/.
//
// Run: node scripts/og-images.mjs
// Run it again after you change a page headline below, or after you add or rename a blog post.
// The script uses the Chromium of @playwright/test (a dev dependency), so it adds no dependency.
// Colors and type come from DESIGN.md: white surface, charcoal text, one brand-blue element, Inter.
import { mkdirSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from '@playwright/test';

const WIDTH = 1200;
const HEIGHT = 630;
const OUT = 'public/og';

// The prices come from src/lib/site.ts, the same constants that the pricing page uses.
const siteSource = readFileSync('src/lib/site.ts', 'utf8');
const price = (name) => {
  const value = siteSource.match(new RegExp(`export const ${name} = ([0-9]+);`))?.[1];
  if (!value) throw new Error(`${name} is not in src/lib/site.ts`);
  return value;
};
const BASE_PRICE = price('BASE_PRICE');
const ENVIRONMENT_PRICE = price('ENVIRONMENT_PRICE');

const pages = [
  { file: 'default', eyebrow: 'Deployz', headline: 'Deploy your SaaS into customer AWS accounts', sub: 'Connect GitHub, send an installation link, and manage updates.' },
  { file: 'home', eyebrow: 'Deployz', headline: 'Deploy your SaaS into customer AWS accounts', sub: 'Connect GitHub, send an installation link, and manage updates.' },
  { file: 'how-it-works', eyebrow: 'How it works', headline: 'From GitHub to customer AWS', sub: 'Connect a repository, build a release, and deploy with guardrails.' },
  { file: 'security', eyebrow: 'Security', headline: 'Security and architecture in customer AWS', sub: 'Where apps run, what the connector can do, and what data Deployz gets.' },
  { file: 'pricing', eyebrow: 'Pricing', headline: `$${BASE_PRICE} a month + $${ENVIRONMENT_PRICE} per customer environment`, sub: 'Free evaluation with no card. AWS bills infrastructure separately.' },
  { file: 'use-cases', eyebrow: 'Use cases', headline: 'Deploying into customer AWS', sub: 'For small SaaS teams, indie developers, and AI product builders.' },
  { file: 'about', eyebrow: 'About', headline: 'Customer-hosted deployment for small teams', sub: 'Why we started Deployz and why we focus on AWS.' },
  { file: 'byoc-deployments', eyebrow: 'BYOC deployments', headline: 'BYOC deployments for SaaS on AWS', sub: "Install, update, and monitor your SaaS in each customer's AWS account." },
  { file: 'deploy-saas-to-customer-aws', eyebrow: 'Guide', headline: "Deploy your SaaS into a customer's AWS account", sub: 'Templates, a home-built platform, or Deployz: who does what.' },
  { file: 'docs', eyebrow: 'Documentation', headline: 'Requirements, AWS architecture and access', sub: 'Connector access, data handling, updates, removal, and billing.' },
  { file: 'blog', eyebrow: 'Deployz Blog', headline: 'Guides for customer-hosted software', sub: "Deploy and run software in your customers' AWS accounts." },
];

// One image for each blog post that is not a draft. The post template uses it when the file exists.
const posts = readdirSync('src/content/blog')
  .filter((file) => file.endsWith('.md'))
  .map((file) => {
    const frontmatter = readFileSync(join('src/content/blog', file), 'utf8').split('---')[1] ?? '';
    const field = (name) => frontmatter.match(new RegExp(`^${name}:\\s*"?([^"\\n]*)"?`, 'm'))?.[1];
    return { slug: field('slug') ?? file.replace(/\.md$/, ''), title: field('title'), category: field('category'), draft: field('draft') === 'true' };
  })
  .filter((post) => !post.draft && post.title)
  .map((post) => ({ file: `blog/${post.slug}`, eyebrow: `Deployz Blog · ${post.category}`, headline: post.title, sub: '' }));

// A data URL, because a page from setContent() cannot load file:// fonts.
const font = `data:font/woff2;base64,${readFileSync('node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2').toString('base64')}`;
const logo = readFileSync('public/deployz-icon-master.svg', 'utf8');
const escape = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const html = ({ eyebrow, headline, sub }) => `<!doctype html>
<html><head><meta charset="utf-8"><style>
  @font-face { font-family: 'Inter Variable'; src: url('${font}') format('woff2'); font-weight: 100 900; }
  * { box-sizing: border-box; margin: 0; }
  html, body { width: ${WIDTH}px; height: ${HEIGHT}px; }
  body { font-family: 'Inter Variable', sans-serif; background: #FFFFFF; color: #111111; display: flex; flex-direction: column; padding: 64px 72px 0; position: relative; overflow: hidden; }
  .grid { position: absolute; inset: 0; background-image: linear-gradient(#F4F4F5 1px, transparent 1px), linear-gradient(90deg, #F4F4F5 1px, transparent 1px); background-size: 48px 48px; mask-image: linear-gradient(90deg, transparent 35%, #000 100%); }
  .brand { position: relative; display: flex; align-items: center; gap: 14px; font-size: 34px; font-weight: 600; letter-spacing: -0.02em; }
  .brand svg { width: 44px; height: 44px; }
  .eyebrow { position: relative; margin-top: 72px; font-size: 26px; font-weight: 500; color: #1D4ED8; }
  h1 { position: relative; margin-top: 16px; max-width: 1000px; font-size: ${headline.length > 48 ? 58 : 66}px; line-height: 1.08; font-weight: 600; letter-spacing: -0.035em; }
  p { position: relative; margin-top: 24px; max-width: 920px; font-size: 28px; line-height: 1.4; color: #52525B; }
  .foot { position: absolute; left: 0; right: 0; bottom: 0; height: 88px; padding: 0 72px; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #E4E4E7; background: #FAFAFA; }
  .flow { display: flex; align-items: center; gap: 12px; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 20px; color: #52525B; }
  .chip { padding: 8px 14px; border: 1px solid #D4D4D8; border-radius: 8px; background: #FFFFFF; }
  .chip-brand { border-color: #2563EB; color: #1D4ED8; box-shadow: 0 0 0 4px #EFF6FF; }
  .line { width: 28px; height: 1.5px; background: #D4D4D8; }
  .url { font-size: 22px; font-weight: 500; color: #71717A; }
</style></head><body>
  <div class="grid"></div>
  <div class="brand">${logo}<span>deployz</span></div>
  <div class="eyebrow">${escape(eyebrow)}</div>
  <h1>${escape(headline)}</h1>
  ${sub ? `<p>${escape(sub)}</p>` : ''}
  <div class="foot">
    <div class="flow"><span class="chip">GitHub</span><span class="line"></span><span class="chip chip-brand">Deployz</span><span class="line"></span><span class="chip">Customer AWS</span></div>
    <div class="url">deployz.dev</div>
  </div>
</body></html>`;

mkdirSync(join(OUT, 'blog'), { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT }, deviceScaleFactor: 1 });
for (const image of [...pages, ...posts]) {
  await page.setContent(html(image), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  const fontLoaded = await page.evaluate(() => document.fonts.check("600 66px 'Inter Variable'"));
  if (!fontLoaded) throw new Error('The Inter font did not load.');
  await page.screenshot({ path: join(OUT, `${image.file}.png`), type: 'png' });
  console.log(`${OUT}/${image.file}.png`);
}
await browser.close();
