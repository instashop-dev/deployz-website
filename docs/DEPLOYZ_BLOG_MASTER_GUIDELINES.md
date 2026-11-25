# Deployz Blog Master Guidelines

Version 2.0 | 18 October 2026 | Standing reference for AI agents and editors

Read this file before any blog task. Apply only the sections relevant to the task. This compact edition replaces version 1.0 as the blog's standing reference. Product facts must come from current sources.

## 1 Purpose and positioning

**Promise:** Practical guides for delivering software to your customers' cloud.

Help small software vendors decide, prepare, deploy and operate customer-hosted applications. Build trust and qualified demand for Deployz. Optimize for useful answers, relevant signups and successful deployments.

Keep a practical, affordable, small-team perspective. Explain setup and ongoing work. Connect broad AWS or AI topics to a specific vendor problem. Keep product reference instructions in documentation and routine release entries in the changelog.

A vendor supplies the software. Its customer receives it. Customer-hosted describes whose account runs the application; it does not establish who operates it. Define BYOC on first use. Do not treat customer-hosted, on premises and air gapped as interchangeable.

## 2 Audiences

Choose one primary persona and reader role per article. Personas overlap; use them for planning, not separate blog sections.

| Persona | Main need | Priority |
| --- | --- | --- |
| Small SaaS teams | Meet customer deployment requests without building a platform | Primary |
| AI product and agent builders | Explain data, model calls, credentials and deployment boundaries | Primary |
| Indie developers and bootstrapped founders | Understand effort, costs and maintenance with limited resources | Primary |
| Commercial open-source teams | Offer repeatable installation and supported delivery | Secondary |
| Agencies and software studios | Standardize client ownership, handover and updates | Secondary |

Founders need business tradeoffs. Developers need application requirements and tested workflows. Some articles should help vendors explain responsibilities to their customers. Cover AI-assisted development and AI applications as distinct use cases. Priorities are starting hypotheses; revise them using actual vendor demand.

## 3 Topics and categories

Use one primary category per post:

- **Guides:** practical preparation, deployment, operation and troubleshooting.
- **Decisions:** costs, ownership, delivery models, comparisons and build or buy.
- **Engineering:** verified Deployz mechanisms, implementation lessons and improvements.

Keep persona, lifecycle stage and subjects as internal metadata. Add a category only when it serves a distinct reader need and has at least five credible existing or planned articles. Avoid overlapping labels and empty public archives. Add public filters or search only when the archive warrants them.

Choose topics from prospect questions, onboarding, support and real engineering experience. Check existing coverage first. Update an existing article when the central question is the same.

Proceed when the topic has a relevant vendor, a concrete problem, an evidence-backed answer and an actionable outcome. Include original value: a tested example, checklist, comparison, diagram or observed lesson. Search volume alone is insufficient.

Balance founder decisions with developer execution. Cover the first deployment and subsequent updates, failures and ownership. Publish one article every 3 days. Quality takes priority over cadence: when no topic passes the gates, skip the slot.

## 4 Titles and briefs

Use clear sentence-case titles that name a task, problem or decision. Make the promise specific and achievable. Name AWS or a framework when it defines scope. Avoid hype, unsupported superlatives and unnecessary dates.

Examples:
- Your customer wants your SaaS in their AWS account. Now what?
- Deploying an AI app in a customer's cloud: what stays private?
- Build or buy your customer deployment tooling?

Before drafting, record a short brief:

1. Primary persona, role, trigger and intended outcome.
2. Category, central question and scope.
3. Existing coverage and the article's distinct contribution.
4. Three title options and the selected title.
5. Outline, evidence, example or visual, relevant links and one next step.
6. Author, reviewer and any unresolved claims.

Keep the brief in the existing editorial workflow. Do not ship private notes or evidence in public content or client bundles.

## 5 Writing and evidence

Write as a thoughtful builder speaking to another builder. Use short sentences, concrete verbs and familiar words. Explain technical terms. Answer the main question early. Follow with choices or steps, evidence, limitations and a useful next action.

Use the length the task needs. Remove generic introductions, repeated benefits and filler. Use headings, tables and diagrams when they improve understanding. Avoid forced FAQs and fixed keyword or word-count targets.

AI may research, draft and edit. The Deployz team remains accountable for each article. Automated articles use the "Team Deployz" byline. Verify citations and test claims. Never invent authors, customers, benchmarks or experience.

Check facts before publication:

- Use current implementation and authoritative product documents for capabilities.
- Verify pricing, supported resources, permissions and limitations.
- Distinguish available, preview and planned features.
- Support comparisons with current primary sources or documented tests.
- State conditions and dates for measurements; label estimates and hypothetical examples.
- For cost examples, show region, resource sizes, assumptions and exclusions. Separate Deployz charges from AWS and other services.
- For walkthroughs, record versions, prerequisites, expected results, verification and cleanup. Test commands before recommending them.
- Obtain permission for identifiable customer material. Remove secrets and private account data.

Customer-hosted does not mean all data stays in the customer's account. Check inference, prompts, telemetry, logs, builds and external services. Describe actual AI analysis and deterministic checks without promising infallibility. Use current approved security wording. Provider attestations do not establish Deployz certification or customer compliance.

## 6 Repositories and source authority

**Blog host:** the existing Astro marketing project, in the same repository and deployment as the main website. Serve it under /blog. Locate that project's actual root, installed Astro version and conventions before editing.

**Product source:** https://github.com/thalia-apps/deployz. Use this repository to verify product claims. Its apps/web package uses Next.js; do not assume it is the Astro marketing project.

In the product repository, start with docs/README.md. Read only relevant authoritative sources, such as docs/product/mvp-scope.md, docs/product/user-flows.md, docs/architecture.md, docs/ai-analysis.md or the billing documents. Follow their links when more detail is needed. Do not copy a changing feature or pricing inventory into this guideline.

Use repository instructions for code and release rules, the marketing design system for appearance, and approved product sources for facts. Resolve conflicts against current evidence. Do not apply app-specific UI rules to the marketing site without checking their scope.

## 7 Astro implementation and page design

Reuse the existing Astro project, site layout, navigation, components, tokens, typography, SEO utilities and release workflow. Keep dependencies and client JavaScript minimal. No separate blog service, CMS, UI framework, app-backend or AWS changes are implied.

Use Markdown in an Astro content collection with schema validation. Use reviewed MDX components only when needed and supported by the project. Follow APIs for the installed Astro version. Reuse established content paths and field names; adapt them once rather than creating parallel schemas.

Required metadata: title, stable slug, description, approved category, real author, publication date and draft status. Optional: substantive update date, cover with suitable alt text, featured flag, related posts, answer-first summary, key takeaways, sources, reviewer and review date, and the closing call to action. Validate dates, unique slugs, assets and internal references. Keep private editorial metadata outside public output.

Use one publication eligibility check across routes, listings, sitemap and RSS. Exclude drafts and future posts from public output. Protect unpublished previews with access controls. Scheduled publication needs a rebuild or existing publishing trigger.

**Index:** clear heading, one-sentence introduction, optional featured post, simple responsive article list. Show title, short description, category and date. Add navigation and footer links. Avoid duplicate featured entries in a small archive.

**Article:** readable content column, real author, publication and meaningful update dates, logical headings, responsive media and code, one contextual CTA and up to two useful related posts. Use a table of contents only when helpful. Preserve keyboard access, visible focus, contrast and mobile readability.

Use accurate diagrams and current screenshots. Cover artwork is optional. Optimize images and specify dimensions. Keep text and links in rendered HTML. Add descriptive metadata, canonical URLs, social previews, sitemap, RSS and truthful Article or BlogPosting structured data. Preserve slugs; redirect changed URLs.

### Illustrations

Each article has at least one illustration. It shows the article's main idea, such as a data path, an account boundary, a flow or a comparison. It is never decoration. This rule applies to articles published on or after 26 November 2026; `npm run blog:lint` enforces it.

Draw it in the website's illustration language: "blueprint precision" (`DESIGN.md`, section 7). A Markdown post cannot use the scene components, so a blog illustration is a static SVG file that follows the same rules:

- **File.** Put an SVG file next to the post, named `<slug>-<name>.svg`. Reference it in the body with a Markdown image: `![Alt text](./<slug>-<name>.svg)`. Put it where it explains the text, usually after the paragraph that introduces it.
- **Canvas.** White stage (`#FFFFFF`). The article template adds the 1px frame and the 12px radius, so do not draw an outer frame. A faint dot grid that fades to the edges is allowed (dots `#D4D4D8`), as in the scene stage.
- **Parts.** Cards: white, 1px `#D4D4D8` outline, 12px radius, a bold title row. Boundaries (AWS account, VPC): dashed `#71717A` outline, 14px radius, with the label in a small tag on the top border. Connections: 1.5px lines, a small port (circle) at each end, and a short label on or next to the line. A connection that does not exist is dashed and marked as blocked.
- **Color.** Only the site palette: text `#111111`, muted text `#52525B` or `#71717A`, lines and surfaces `#A1A1AA`, `#D4D4D8`, `#E4E4E7`, `#F4F4F5`, `#FAFAFA`. Cobalt (`#2563EB`, with `#EFF6FF` and `#BFDBFE`) marks the one Deployz element: one brand card or one brand connection per illustration. Green (`#15803D`, `#F0FDF4`, `#BBF7D0`) only for live or passed states. Amber (`#A16207`, `#FFFBEB`, `#FDE68A`) only for needs input or changes needed. No other colors, no gradients other than the fading dot grid.
- **Type.** Inter (`font-family="Inter Variable, Inter, system-ui, sans-serif"`). Monospace (`ui-monospace, SFMono-Regular, Menlo, monospace`) only for real technical tokens: repository, branch, commit, Region, version, file path.
- **Layout.** A vertical composition, at most 480 units wide (400 is typical), so that it reads on a phone without a second layout. Text renders at 12px or more on a 343px column: at 400 units wide, use a font size of 14 or more.
- **Truth.** Labels follow the product and AWS exactly: real UI labels, statuses and AWS service names, checked like any other claim. Mark example values (repository, version, Region) as examples in the caption or the alt text. Do not show Deployz data paths more simply than the product facts state them.
- **Accessibility.** The alt text states what the illustration shows, including each connection and what it carries, so that a reader who cannot see it gets the same facts (at least 12 words). If the illustration needs a caption, write it as a sentence after the image.
- **Safety.** The file is static: no scripts, event handlers, animation, embedded images or fonts, links, or external references. Keep it under 100 KB.

Reference: `src/content/blog/ai-app-data-flow.svg`.

## 8 Review and maintenance

For each article, check the brief, factual evidence, originality, title, category, internal links, visuals (at least one illustration, section 7) and CTA. Complete an accountable review: the automated gates in section 10, or a named reviewer. Use the existing release process.

For content edits, run relevant validation and inspect the rendered article on mobile and desktop. For template or pipeline changes, also verify keyboard use, code and table overflow, metadata, structured data, draft exclusion, future dates, feeds, redirects and 404s. Run the project's applicable build, type, lint and frontend checks. Do not run AWS tests for blog UI work.

Use one relevant next step: documentation, pricing or the actual product onboarding flow. Avoid repeated banners and intrusive popups. Measure relevant discovery, CTA clicks, signups and activation with existing analytics. Report attribution limits; do not add identity tracking to fill gaps.

Review volatile pricing, comparisons and instructions about every 90 days; review stable guides about every six months. Correct known errors promptly. Change updated dates only for substantive revisions. Merge overlapping coverage and maintain redirects. Share articles only through authorized channels.

## 10 Automated content pipeline

The content engine in the deployz-marketing repository (`content/README.md`) does research, briefs, drafts, fact checks, SEO and AEO checks, refresh reminders and distribution drafts. A scheduled task runs it every day and publishes one article every 3 days without a human review. These rules apply to it and to any other automation:

1. The byline is "Team Deployz" (`src/content/authors.json`). Never invent a person as author or reviewer. Leave `reviewedBy` empty unless a named person did the fact check.
2. Each article has a brief (section 4) and a claims report. The report lists each claim, its source, and a verdict. A separate verification step writes the report, not the step that wrote the draft.
3. An article publishes only when every gate passes (`npm run content -- gate <id>`):
   - no contradicted or unverifiable claim, and no statement to avoid;
   - each quality score (usefulness, originality, accuracy, clarity) is 4 or more of 5;
   - `npm run blog:lint` passes, which includes at least one illustration that follows section 7;
   - the illustration's labels pass the same claim check as the text;
   - each `/docs` link goes to a page that exists, and no source URL returns an error.
4. When a gate fails, the engine revises the draft (at most three times). Then it stops and marks the topic `needs-attention`. A person decides what to do.
5. Changes arrive as pull requests titled `[content-engine]`. The content auto-merge workflow merges and deploys a pull request only when it changes blog posts, their illustrations (`src/content/blog/*.svg`) and their social images only, and every site check passes. A pull request that changes other files needs a person.
6. Kill switches: `autopilot.enabled` in deployz-marketing `content/config.json` stops publication; the repository variable `CONTENT_AUTOMERGE` stops the merge. Use them when a published article is wrong. Then correct the article promptly (section 8).
7. Answer engines: put the direct answer in `summary` and in the first paragraph. Use question headings where they match real reader questions. Cite primary sources in `sources`. The site publishes `/llms.txt`, `/llms-full.txt` and a Markdown copy of each post.

## 9 Agent entry point

Keep this file at docs/DEPLOYZ_BLOG_MASTER_GUIDELINES.md in the marketing repository, unless its existing documentation structure requires another location. Link it from the documentation index and existing agent instruction files. Preserve their unrelated rules.

Suggested instruction:
> Before any blog task, read docs/DEPLOYZ_BLOG_MASTER_GUIDELINES.md. Follow it for topics, categories, titles, content, implementation and review. Load supporting sources only as needed.

This is the canonical agent reference. Keep examples and temporary plans elsewhere. Update it when strategy or publishing rules change; do not duplicate its rules across prompts.

**Final check:** Does this help a relevant vendor make a better decision or complete a useful task, with claims they can trust?

Astro reference: https://docs.astro.build/en/guides/content-collections/
