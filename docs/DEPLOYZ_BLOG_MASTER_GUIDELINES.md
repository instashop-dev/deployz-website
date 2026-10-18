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

Balance founder decisions with developer execution. Cover the first deployment and subsequent updates, failures and ownership. Start with three useful articles, then aim for two per month. Quality takes priority over cadence.

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

AI may assist with research, drafts and editing. A real person remains accountable. Verify citations and test claims. Never invent authors, customers, benchmarks or experience.

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

Required metadata: title, stable slug, description, approved category, real author, publication date and draft status. Optional: substantive update date, cover with suitable alt text, featured flag and related posts. Validate dates, unique slugs, assets and internal references. Keep private editorial metadata outside public output.

Use one publication eligibility check across routes, listings, sitemap and RSS. Exclude drafts and future posts from public output. Protect unpublished previews with access controls. Scheduled publication needs a rebuild or existing publishing trigger.

**Index:** clear heading, one-sentence introduction, optional featured post, simple responsive article list. Show title, short description, category and date. Add navigation and footer links. Avoid duplicate featured entries in a small archive.

**Article:** readable content column, real author, publication and meaningful update dates, logical headings, responsive media and code, one contextual CTA and up to two useful related posts. Use a table of contents only when helpful. Preserve keyboard access, visible focus, contrast and mobile readability.

Use accurate diagrams and current screenshots. Cover artwork is optional. Optimize images and specify dimensions. Keep text and links in rendered HTML. Add descriptive metadata, canonical URLs, social previews, sitemap, RSS and truthful Article or BlogPosting structured data. Preserve slugs; redirect changed URLs.

## 8 Review and maintenance

For each article, check the brief, factual evidence, originality, title, category, internal links, visuals and CTA. Complete accountable human review. Use the existing release process and the task's publication authorization.

For content edits, run relevant validation and inspect the rendered article on mobile and desktop. For template or pipeline changes, also verify keyboard use, code and table overflow, metadata, structured data, draft exclusion, future dates, feeds, redirects and 404s. Run the project's applicable build, type, lint and frontend checks. Do not run AWS tests for blog UI work.

Use one relevant next step: documentation, pricing or the actual product onboarding flow. Avoid repeated banners and intrusive popups. Measure relevant discovery, CTA clicks, signups and activation with existing analytics. Report attribution limits; do not add identity tracking to fill gaps.

Review volatile pricing, comparisons and instructions about every 90 days; review stable guides about every six months. Correct known errors promptly. Change updated dates only for substantive revisions. Merge overlapping coverage and maintain redirects. Share articles only through authorized channels.

## 9 Agent entry point

Keep this file at docs/DEPLOYZ_BLOG_MASTER_GUIDELINES.md in the marketing repository, unless its existing documentation structure requires another location. Link it from the documentation index and existing agent instruction files. Preserve their unrelated rules.

Suggested instruction:
> Before any blog task, read docs/DEPLOYZ_BLOG_MASTER_GUIDELINES.md. Follow it for topics, categories, titles, content, implementation and review. Load supporting sources only as needed.

This is the canonical agent reference. Keep examples and temporary plans elsewhere. Update it when strategy or publishing rules change; do not duplicate its rules across prompts.

**Final check:** Does this help a relevant vendor make a better decision or complete a useful task, with claims they can trust?

Astro reference: https://docs.astro.build/en/guides/content-collections/
