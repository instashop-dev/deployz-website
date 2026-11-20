# Deployz Marketing Website SEO Plan

Version 1.0 | 19 November 2026 | Scope: https://deployz.dev (Astro project in this repository)

This plan tells you how to increase qualified organic traffic to deployz.dev. It has an audit of the current site, a list of fixes in priority order, a keyword and page map, a content plan, and a measurement plan.

For blog work, docs/DEPLOYZ_BLOG_MASTER_GUIDELINES.md has priority over this plan. This plan does not change those rules. It only supplies SEO inputs for them.

## 1 Goal and success measures

**Goal:** Make Deployz the most useful search result for small software vendors whose customers ask, "Can this run in our AWS account?"

Measure these items. Record a baseline in the first 30 days. Then set targets from the baseline. Do not use targets that you cannot measure.

| Measure | Source | Why |
| --- | --- | --- |
| Non-brand impressions and clicks | Google Search Console (GSC), Bing Webmaster Tools | Shows discovery by people who do not know Deployz yet |
| Indexed pages vs. sitemap pages | GSC Pages report | Shows crawl and index health |
| Click-through rate for each target page | GSC | Shows title and description quality |
| Average position for each keyword cluster (section 4) | GSC, filtered by query | Shows progress per topic |
| Organic sessions to signup clicks (`data-cta`) | GA4 (only after cookie consent) | Shows business value |
| Signups and readiness reports from organic visitors | Product analytics in app.deployz.dev | Shows qualified demand |
| Referring domains | GSC Links report, Bing | Shows authority |
| Citations in AI answers for core questions | Manual monthly check (section 9) | Shows visibility in AI search |

GA4 loads only after consent. Thus GA4 undercounts organic visits. Use GSC as the source of truth for search data. Report this attribution limit with each result.

## 2 Current state (audit of 19 November 2026)

The audit used the source code and a production build (`npm run build`, 17 pages).

### 2.1 Strengths

- The site is static HTML from Astro. It has no client JavaScript islands. Pages are fast and crawlers can read all text.
- Each page has a unique title, a meta description, a canonical URL and Open Graph tags (`src/layouts/Base.astro`).
- Each page has one `<h1>` (`src/components/site/PageHeader.astro` and `src/pages/index.astro`). The heading order is logical.
- The sitemap (`@astrojs/sitemap`) lists all 16 public pages. `robots.txt` points to it. The 404 page has `noindex`.
- Blog posts have truthful `BlogPosting` structured data, RSS, publication dates and related posts.
- One publication check (`src/lib/blog.ts`) removes drafts and future posts from routes, the sitemap and RSS.
- Old URLs have 301 redirects (`public/_redirects`).
- Two search landing pages exist: `/byoc-deployments/` and `/deploy-saas-to-customer-aws/`.

### 2.2 Problems

| # | Problem | Evidence | Impact |
| --- | --- | --- | --- |
| P1 | The site is also available on a `workers.dev` hostname | `wrangler.jsonc` has `"workers_dev": true` | Duplicate copy of the site on a second host. Search engines can index it. |
| P2 | Customer deployments get URLs on `deployz.dev` subdomains | `src/pages/docs/index.astro`, "HTTPS and custom domains" | Customer apps can appear in search under the Deployz domain. Low-quality or abusive content on a subdomain can hurt trust in the main domain. |
| P3 | The two search landing pages are orphans | No page links to `/byoc-deployments/` or `/deploy-saas-to-customer-aws/`. Only the sitemap lists them. | Low crawl priority and almost no internal link authority for the most important commercial pages. |
| P4 | No site-level structured data | Home and pricing pages have no JSON-LD | No `Organization`, `WebSite` or `SoftwareApplication` signals for the brand and the product. |
| P5 | Weak social preview image | `og:image` is the 512 × 512 logo. `twitter:card` is `summary`. | Small, generic previews when people share links. Lower click rate from social, chat and community posts. |
| P6 | HTTP is not sent to HTTPS | Live check: `http://deployz.dev/pricing/` returns 200. (`www` correctly returns 301 to the apex host.) | Crawlers can see a duplicate `http://` copy of each page. |
| P7 | Some meta descriptions are long | `/how-it-works/`, `/security/` and `/deploy-saas-to-customer-aws/` are about 165–170 characters | Search engines cut the text. |
| P8 | Blog titles are long | Template adds " — Deployz Blog". The result is about 80 characters. | Search engines cut the title. The brand suffix uses space that the topic needs. |
| P9 | Documentation is one page | `/docs/` has seven topics on one URL | One URL cannot rank for many specific questions, for example connector IAM access or supported architecture. |
| P10 | No `lastmod` in the sitemap | Default `@astrojs/sitemap` settings | Search engines get no signal when a page changes. |
| P11 | No search engine accounts are documented | No verification file or record in the repository | Unknown. Confirm that GSC and Bing Webmaster Tools are set up. |
| P12 | Only two blog posts | `src/content/blog/` | Little topical depth. Few pages can earn links. |
| P13 | No automated SEO checks | `tests/site.spec.ts` | A later change can remove a canonical, a title or structured data without notice. |

## 3 Technical SEO fixes

Do these tasks in order. Each task names the files to change and the check that shows it is complete.

### 3.1 Priority 0 (week 1)

1. **Remove the duplicate `workers.dev` host (P1).**
   - Set `"workers_dev": false` in `wrangler.jsonc`. Deploy with the manual wrangler deploy. Status: the setting is changed in the repository. It takes effect at the next deploy.
   - If a preview host is necessary, send `X-Robots-Tag: noindex` from that host only.
   - Check: the `workers.dev` URL does not return the site, or it returns `noindex`. Use GSC URL Inspection on the production URLs.

2. **Make one canonical host (P6).**
   - Make sure that `www.deployz.dev` sends a 301 redirect to `https://deployz.dev` with the same path. Use a Cloudflare redirect rule.
   - Check: `curl -I https://www.deployz.dev/pricing/` returns 301 to `https://deployz.dev/pricing/`.
   - Status (19 November 2026): **correct**. The `www` host returns 301 to the apex host.
   - Also send HTTP to HTTPS. On 19 November 2026, `http://deployz.dev/pricing/` returned 200, not a redirect. The HSTS header protects browsers that visited before, but crawlers can see a duplicate `http://` copy. Turn on **Always Use HTTPS** in the Cloudflare dashboard (SSL/TLS, Edge Certificates). Check: `curl -I http://deployz.dev/pricing/` returns 301 to `https://deployz.dev/pricing/`.

3. **Keep one trailing slash rule.**
   - All internal links, canonicals and sitemap URLs use a trailing slash. Keep this rule for all new links.
   - Status (19 November 2026): Cloudflare static assets send `/pricing` to `/pricing/` with a 307 redirect. The page with the slash returns 200. This is acceptable, because each page has one canonical URL and all links use it.
   - Do not set `trailingSlash: 'always'` in `astro.config.mjs`. All pages are prerendered, so the host controls this behavior, not Astro. The setting changes only the dev and preview servers, and the end-to-end tests use URLs without a slash.

4. **Link the orphan landing pages (P3).**
   - Add `/byoc-deployments/` and `/deploy-saas-to-customer-aws/` to the footer "Product" group in `src/components/site/SiteFooter.astro`.
   - Add one contextual link to each page from the home page body, from `/how-it-works/` and from `/use-cases/`.
   - Add a contextual link from each related blog post.
   - Check: in the build, each page has at least three internal links from body content, plus the footer link.
   - Status: done in the repository. `/deploy-saas-to-customer-aws/` gets body links from the home page, `/how-it-works/`, `/byoc-deployments/` and the post "Your customer wants your SaaS in their AWS account". `/byoc-deployments/` gets body links from the home page, `/use-cases/`, `/deploy-saas-to-customer-aws/` and the AI data privacy post. Both pages are in the footer.

5. **Set up search engine accounts (P11).**
   - Verify `deployz.dev` as a Domain property in GSC (DNS record). Verify it in Bing Webmaster Tools (import from GSC).
   - Submit `https://deployz.dev/sitemap-index.xml` in both tools.
   - Record the account owners in the team's private notes, not in this repository.

6. **Decide the customer deployment domain (P2). This is a product decision.**
   - Recommended: serve default customer URLs from a separate domain that is used only for deployments, as hosting platforms do. Add that domain to the Public Suffix List. Then the reputation of a customer app does not affect `deployz.dev`.
   - Short-term action: send `X-Robots-Tag: noindex` for default customer URLs from the Deployz Cloudflare proxy. Customer custom domains are not affected.
   - Coordinate with the product repository (https://github.com/thalia-apps/deployz). This change affects existing deployments. Plan redirects for existing default URLs.

### 3.2 Priority 1 (weeks 2–3)

7. **Add site-level structured data (P4).**
   - Add an optional `structuredData` prop to `src/layouts/Base.astro`. Render it as JSON-LD in the head, as the blog template does now.
   - Home page: `Organization` (name, URL, logo, `sameAs` with real profiles only, `contactPoint` with `help@deployz.dev`) and `WebSite`.
   - Pricing page: `SoftwareApplication` with `applicationCategory: "DeveloperApplication"`, `operatingSystem: "Web"` and an `Offer` (price `49`, currency `USD`). Read prices from `src/lib/site.ts`. Do not add `aggregateRating` until real, published reviews exist.
   - Blog posts and inner pages: `BreadcrumbList` (Home › Blog › Post).
   - Do not add `FAQPage` markup to get rich results. Google shows FAQ rich results only for a small set of authoritative sites. Keep the FAQ text in HTML, because it helps AI answers.
   - Check: Google Rich Results Test and the Schema.org validator show no errors.
   - Status: done in the repository. `Base.astro` has the `structuredData` and `breadcrumbs` props. The builders are in `src/lib/seo.ts`. The home page has `Organization` and `WebSite`. `Organization` has no `sameAs`, because the site links to no company profile now. Add `sameAs` when the `/about/` page links to real profiles. The pricing page has `SoftwareApplication` with an `Offer` from `BASE_PRICE` and `ENVIRONMENT_PRICE`. All other public pages have a `BreadcrumbList`. There is no `FAQPage`, rating or review markup. After the deploy, run the Rich Results Test on the live URLs.

8. **Make real social preview images (P5).**
   - Make one 1200 × 630 image for each main page and a template for blog posts. Use the marketing design system (`DESIGN.md`). Generate the images at build time with a fixed template, or make them by hand.
   - Add `og:image:width`, `og:image:height` and a page-specific `og:image:alt`. Set `twitter:card` to `summary_large_image`.
   - Add `image` to the `BlogPosting` data when a post has a cover or a preview image.
   - Check: the LinkedIn Post Inspector and an X card preview show the large image.
   - Status: done in the repository. `scripts/og-images.mjs` (`npm run og-images`) makes the PNG files in `public/og/` with the Chromium of Playwright. It adds no dependency. There is one image for each main page, one default image and one image for each blog post that is not a draft. Run the script again after you add a post or change a headline in the script. If a post has no image file, the post uses the default image. `BlogPosting.image` contains the cover (if the post has one) and the preview image. After the deploy, check the LinkedIn Post Inspector and the X card preview.

9. **Fix title and description lengths (P7, P8).**
   - Keep titles at about 60 characters or fewer. Keep descriptions at about 150–155 characters.
   - Change the blog title template in `src/pages/blog/[slug].astro`. Use `{title} | Deployz`. If the post title has more than 50 characters, use the post title only.
   - Apply the page changes in section 5.
   - Status: done in the repository. The home and docs titles are changed as section 5 tells. The descriptions of `/how-it-works/`, `/security/`, `/deploy-saas-to-customer-aws/`, `/byoc-deployments/` and `/pricing/` are 155 characters or fewer. All titles are 60 characters or fewer. The two blog post titles have more than 60 characters, so each post has an optional `seoTitle` in the frontmatter. The `<title>` uses `seoTitle` (if it exists), and the page heading keeps `title`.

10. **Add `lastmod` to the sitemap (P10).**
    - Use the `serialize` option of `@astrojs/sitemap`. For blog posts, use `updatedDate` or `pubDate`. For other pages, use the date of the last substantive change. Do not use the build date for every page, because it is not true.
    - Status: done in the repository. `scripts/sitemap-lastmod.mjs` gives the `serialize` function. A blog post uses `updatedDate` or `pubDate`. Another page uses the date of the last git commit that changed its source file (and the legal Markdown file that it imports). If git is not available, the URL has no `lastmod`. Build from a full clone, not a shallow clone, so that the dates are correct.

11. **Add automated SEO checks (P13).**
    - In `tests/site.spec.ts`, add checks for each page in the sitemap:
      - one `<h1>`;
      - a unique `<title>` of 60 characters or fewer and a description of 160 characters or fewer;
      - a canonical URL that is equal to the page URL;
      - JSON-LD that parses without errors;
      - no `noindex` on public pages;
      - each landing page has at least one internal link from body content.
    - Run the tests before each release.
    - Status: done in the repository. The `SEO contract` group in `tests/site.spec.ts` reads `dist/sitemap-0.xml` and does these checks on each URL. It also checks the social image tags and files, the pricing `Offer` against the page text, the `BlogPosting` data, and the sitemap `lastmod` values.

### 3.3 Priority 2 (weeks 4–8)

12. **Split the documentation into topic pages (P9).**
    - Keep `/docs/` as an overview page with links. Move each topic to its own URL, for example:
      - `/docs/requirements/`
      - `/docs/supported-architecture/`
      - `/docs/aws-connector-access/` (IAM actions, CloudFormation stack)
      - `/docs/data-and-secrets/`
      - `/docs/updates-and-removal/`
      - `/docs/billing/`
    - Give each page its own title, description and `BreadcrumbList`. Keep the current anchor links on `/docs/` as links to the new pages.
    - Verify each fact against the product repository before you publish. Documentation pages describe the product. Keep sales copy out of them.

13. **Decide the AI crawler policy.**
    - The current `robots.txt` allows all crawlers. This is the recommended setting, because AI assistants answer many vendor questions now.
    - If the team wants to block training crawlers but allow AI search crawlers, list each crawler by its user agent. Record the decision and the date in `robots.txt` comments.
    - Optional: add `/llms.txt` with a short product summary and links to the docs pages. It costs little. Its effect is not proven, so do not expect results from it.

14. **Watch performance.**
    - The site is fast now. Keep it fast. Check Core Web Vitals in GSC each month.
    - Preload only the Latin Inter font subset that the page uses. Make sure each image has `width` and `height`.
    - Keep new pages free of client JavaScript unless an interaction needs it.

## 4 Keyword and intent map

The keyword lists are hypotheses. Check them with GSC data, a keyword research tool and the questions that prospects ask in sales calls and support. Do not choose a topic only because of search volume (blog guidelines, section 3).

Give each cluster one primary page. Do not let two pages target the same main query.

| Cluster | Example queries (to validate) | Intent | Primary page | Status |
| --- | --- | --- | --- | --- |
| Deploy into customer AWS | deploy SaaS to customer AWS account; deploy app into customer's AWS; install software in customer AWS account | Commercial, problem-aware | `/deploy-saas-to-customer-aws/` | Exists, orphan |
| BYOC | BYOC SaaS; bring your own cloud deployment; BYOC on AWS; how to offer BYOC | Commercial, solution-aware | `/byoc-deployments/` | Exists, orphan |
| BYOC definitions and comparisons | what is BYOC; BYOC vs self-hosted; BYOC vs single-tenant SaaS; customer-hosted vs on-premises | Informational | New blog post (Decisions) | Planned |
| Customer AWS access | cross-account IAM role for SaaS vendor; vendor access to customer AWS; CloudFormation stack for vendor access; least-privilege vendor IAM | Informational, technical | `/docs/aws-connector-access/` plus a Guides post | Planned |
| App readiness | Dockerfile for customer deployment; health check for ECS Fargate; prepare app for single-tenant deployment | Informational, technical | `/how-it-works/` plus a Guides post | Partly exists |
| Updates and operations | update software in customer environments; roll back customer deployment; database migrations across tenants | Informational | Guides and Engineering posts | Planned |
| AI apps in customer cloud | deploy AI app in customer cloud; AI app data privacy customer AWS; private AI agent deployment | Informational | Existing post `ai-app-customer-cloud-data-privacy` plus `/use-cases/` | Exists |
| Cost and pricing | cost to offer BYOC; customer-hosted deployment pricing; AWS cost of single-tenant deployment | Commercial | `/pricing/` plus a Decisions post | Partly exists |
| Security and compliance | security questionnaire customer-hosted SaaS; data residency SaaS AWS; SOC 2 BYOC | Commercial, trust | `/security/` plus a Guides post | Partly exists |
| Alternatives and comparisons | alternatives to building a BYOC platform; names of other customer-hosted deployment tools | Commercial, late stage | New `/compare/` pages | Planned, needs verified sources |
| Brand | deployz; deployz pricing; deployz login | Navigational | Home, `/pricing/` | Exists |

**Brand check:** search for "deployz" and similar spellings. If other products use the same or a similar name, use the full phrase "Deployz customer AWS deployments" in brand profiles. Keep the name, logo and description the same on every profile.

## 5 On-page changes for each page

Apply these changes after you check the queries in section 4. Keep the current factual claims. Change wording only where the change makes the page clearer for the reader and for search.

| Page | Primary query | Recommended change |
| --- | --- | --- |
| `/` | deploy SaaS into customer AWS | Title: "Deploy Your SaaS Into Customer AWS Accounts \| Deployz". Put the query first and the brand last. Add body links to `/byoc-deployments/` and `/deploy-saas-to-customer-aws/`. Add `Organization` and `WebSite` JSON-LD. |
| `/how-it-works/` | how to deploy into a customer AWS account | Trim the description to 155 characters or fewer. Link each step to the matching docs page after the split (task 12). |
| `/byoc-deployments/` | BYOC deployments on AWS | Keep the title. Add a short "What is BYOC?" answer in the first 100 words. Link to the BYOC definitions post when it exists. |
| `/deploy-saas-to-customer-aws/` | deploy SaaS to customer AWS account | Trim the description. Link to the "Your customer wants your SaaS in their AWS account" post and to `/security/`. |
| `/use-cases/` | customer-hosted deployment use cases | Link each persona section to one relevant post. Consider separate persona pages only when each page has distinct, verified content. |
| `/pricing/` | BYOC pricing, customer-hosted deployment pricing | Keep the price in the title. Add `SoftwareApplication` and `Offer` JSON-LD. Link to the cost post when it exists. |
| `/security/` | customer-hosted SaaS security | Trim the description. Link to `/docs/aws-connector-access/` and to `/gdpr/`. |
| `/docs/` | Deployz documentation | Title: "Deployz Docs: Requirements, AWS Architecture and Access". Then split the page (task 12). |
| `/about/` | brand | Keep. Add links to real company and founder profiles. Use these links in `Organization.sameAs`. |
| `/blog/` | customer-hosted software guides | Keep. Add the category to each list item when the archive grows. |
| Blog posts | Each post's central question | Use the new title template (task 9). Add at least one link to a commercial page and one to a related post. |
| Legal pages | none | Keep them indexable. They support trust. Do not optimize them for search. |

## 6 Site architecture and internal links

Use this structure. Add a section only when it has enough useful pages (blog guidelines, section 3).

```text
/                                  Home (product, main query)
├── /how-it-works/                 Product process
├── /use-cases/                    Personas
├── /pricing/                      Pricing
├── /security/                     Security and architecture
├── /byoc-deployments/             Landing page: BYOC
├── /deploy-saas-to-customer-aws/  Landing page: customer AWS
├── /compare/                      Comparison pages (planned, after verification)
├── /docs/                         Docs overview
│   └── /docs/<topic>/             Docs topic pages (planned)
├── /blog/                         Blog index
│   └── /blog/<slug>/              Articles
└── /about/, legal pages
```

Internal link rules:

1. Each commercial page gets links from the footer and from at least three body paragraphs on other pages.
2. Each blog post links to one commercial page that matches its topic. Use a descriptive anchor, for example "BYOC deployments on AWS". Do not use "click here".
3. Each blog post links to one or two related posts. Use the existing `related` field.
4. Each docs page links to the next logical docs page and to the matching product page.
5. When you publish a post, add a link to it from one existing page. Do not leave new pages as orphans.
6. When you change a URL, add a 301 redirect in `public/_redirects`. Never reuse an old URL for a different topic.

## 7 Content plan

Follow the blog guidelines for each article: write a brief, verify facts in the product repository, use a real author and get human review. The guidelines set the publication rate at about two articles each month. Quality has priority over this rate.

### 7.1 Blog topic candidates (first six months)

Validate each topic with prospect and support questions before you write it. Check that no existing article answers the same central question.

| Order | Working title | Category | Persona | Cluster |
| --- | --- | --- | --- | --- |
| 1 | What is BYOC? A practical definition for small SaaS teams | Decisions | Small SaaS teams | BYOC definitions |
| 2 | BYOC, self-hosted or single-tenant SaaS: which one does your customer need? | Decisions | Founders | BYOC definitions |
| 3 | What AWS access should you ask for in a customer's account? | Guides | Developers | Customer AWS access |
| 4 | Prepare your app for customer-hosted deployment: Dockerfile, health check and migrations | Guides | Developers | App readiness |
| 5 | What does it cost to run your SaaS in a customer's AWS account? | Decisions | Indie developers | Cost and pricing |
| 6 | Build or buy your customer deployment tooling? | Decisions | Founders | Alternatives |
| 7 | How to ship updates and rollbacks to many customer AWS accounts | Guides | Developers | Updates and operations |
| 8 | How to answer a security questionnaire for a customer-hosted deployment | Guides | Small SaaS teams | Security and compliance |
| 9 | Deploying an AI agent in a customer's AWS account: credentials and model calls | Guides | AI builders | AI apps |
| 10 | Hand over a client app to the client's AWS account: a checklist for agencies | Guides | Agencies | Customer AWS access |
| 11 | How Deployz checks whether a repository is ready to deploy | Engineering | Developers | App readiness |
| 12 | Remove a deployment from a customer's AWS account without leftovers | Guides | Developers | Updates and operations |

Cost articles must show the AWS Region, resource sizes, assumptions and exclusions. They must show Deployz charges apart from AWS charges.

### 7.2 Pages other than blog posts

1. **Docs topic pages** (task 12). These pages answer exact technical questions. They are often the best result for long-tail queries.
2. **Comparison pages** in `/compare/`. Start with "Build your own BYOC platform vs. Deployz". Add pages that name other products only when you can support each claim with current primary sources, such as the other product's documentation and pricing page. Show the date of the check on the page. Review these pages every 90 days. Be fair: state where the other option is a better choice.
3. **Free tool (optional, later).** An AWS cost estimator for one customer environment, or an IAM permission explainer, can earn links. Build it only if it uses verified data and stays maintained.

### 7.3 Content refresh

- Review pricing, comparisons and instructions every 90 days. Review stable guides every six months.
- Each quarter, find pages with many impressions and a low click rate in GSC. Improve their titles and descriptions first.
- Find pages at positions 8–20 in GSC. Improve their depth and internal links.
- Change `updatedDate` only for substantive revisions.

## 8 Authority and off-page work

Get links and mentions that a real vendor audience sees. Do not buy links. Do not use link exchanges, private blog networks or automated directory submissions.

1. **Profiles:** create or complete consistent profiles on GitHub, LinkedIn, X, Product Hunt and relevant software directories. Use the same name, description and logo.
2. **Launch posts:** plan one Product Hunt launch and one "Show HN" post. Prepare honest copy and a working demo first.
3. **AWS ecosystem:** check the requirements for the AWS Partner Network and for an AWS Marketplace listing. Both can give links and trust. They are business decisions, not only SEO tasks.
4. **Communities:** answer real questions about BYOC and customer-hosted deployment in developer communities. Disclose your connection to Deployz. Link to a guide only when it answers the question.
5. **Guest articles and podcasts:** pitch practical topics, for example "What we learned from customer AWS deployments", to SaaS and DevOps publications.
6. **Linkable assets:** use the diagrams, checklists and cost examples in posts as resources that other sites can cite. Ask for attribution.
7. **Mentions without links:** search for "Deployz" mentions each month. Ask the author for a link when it helps their readers.

## 9 AI search visibility

Many buyers now ask AI assistants, for example ChatGPT, Claude, Perplexity and Google AI features, questions such as "How can I deploy my SaaS into a customer's AWS account?"

1. Answer the main question in the first paragraph of each page and post. The current blog posts already do this.
2. Use clear facts that a model can quote: supported resources, prices, limits and steps. The docs page has these facts. The split in task 12 makes each fact easier to find and cite.
3. Keep the entity data the same everywhere: name, description, URL and category.
4. Keep important text in the HTML. Do not put it only in images or diagrams. The current diagrams use SVG with text, which is good.
5. Each month, ask the main AI assistants the ten most important questions from section 4. Record whether they mention or cite Deployz, and which pages they cite. Use this record to choose content updates.

## 10 Measurement and reporting

**Weekly (15 minutes):**
- GSC: new errors in the Pages, Core Web Vitals and Enhancements reports.
- New pages are indexed within about two weeks.

**Monthly:**
- Non-brand clicks and impressions, by cluster.
- Top 20 queries and top 10 pages.
- Organic signup clicks (GA4, with the consent limit) and organic signups (product analytics).
- New referring domains.
- AI visibility check (section 9).

**Quarterly:**
- Compare results with the baseline and the targets.
- Update the keyword map (section 4) and the content plan (section 7).
- Do the content refresh (section 7.3).

Do not add identity tracking to fill gaps in attribution.

## 11 Roadmap

| Time | Work | Done when |
| --- | --- | --- |
| Days 1–7 | Tasks 1–6 (P0): duplicate hosts, trailing slash, orphan links, GSC and Bing, customer domain decision | No duplicate hosts. Landing pages have internal links. Sitemap submitted. Domain decision recorded. |
| Days 8–21 | Tasks 7–11 (P1): structured data, social images, titles and descriptions, `lastmod`, SEO tests | Validators show no errors. SEO tests pass in the release check. |
| Days 22–60 | Task 12 docs split. Blog posts 1–4. Footer and body links for new pages. | Six docs topic pages indexed. Four new posts published and linked. |
| Days 61–90 | Blog posts 5–6. First comparison page. Product Hunt or Show HN launch. First quarterly review. | Baseline and targets recorded. First external links earned. |
| Months 4–6 | Blog posts 7–12. More comparison pages after verification. Content refresh. | Plan updated from GSC data. |

## 12 Open decisions

The team must decide these items. They change what the plan does next.

1. Domain for default customer deployment URLs (task 6).
2. AI crawler policy (task 13).
3. Which competitor products to name on comparison pages, and who verifies the claims.
4. Whether to apply for the AWS Partner Network or AWS Marketplace.
5. Who owns the monthly SEO report.
