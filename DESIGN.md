# Deployz Design System (v3.1)

This file records the implemented marketing design system. The canonical specification is `DEPLOYZ_FINAL_DESIGN_SYSTEM.md` v3.0 (14 October 2026). This file replaces the earlier "monochrome depth" system (terminal hero, dot grids, glows, elevation scale, mono labels, scroll reveals). Do not bring those back on page surfaces. v3.1 (15 October 2026) adds the illustration scene system in section 7, which uses a fading dot grid, card depth, and mono tokens inside illustration stages only.

> **North star:** powerful through clarity, appealing through precision, minimal without becoming empty.

## 1. Direction

- White canvas, near-black type, generous whitespace, one disciplined cobalt blue.
- Light theme only. There is no theme toggle and no `.dark` token set on the marketing site.
- Signature: the solid, bold Deployz mark against thin, ordered, architectural connectors.
- Attention budget (heuristic): about 80% calm neutral surfaces and text, 15% structure (diagrams, hairlines, frames), 5% blue.
- Do not build on page surfaces: hero gradients, glows, dot or grid backgrounds, parallax, glass panes, fake terminals, stock 3D clouds, dashboard collages, boxes around every sentence, invented logos or statistics.
- Exception, illustrations only (since v3.1, 15 October 2026): inside a scene stage (section 7) a fading dot grid, one faint cobalt light, layered card depth, and two kinds of quiet motion (the beam light and the live pulse) are allowed. They never leave the stage.

## 2. Logo

- Source: `public/deployz-icon-master.svg` (black mark). Favicons, `site.webmanifest`, and `safari-pinned-tab.svg` are unchanged.
- `src/components/site/Logo.astro` renders the mark plus the lowercase `deployz` wordmark text with a 9px gap. Header size 28px, footer 26px. Illustrations use the mark alone at 16px in an icon tile.
- The repository has no inverse (white) logo asset. Do not place the logo on a dark surface, and do not use `filter: invert()`.
- Never: blue logo, background tile, glow, rotation, skew, shadow, or a logo-shaped frame.

## 3. Color tokens

Defined once in `src/styles/globals.css` (`:root`) and mapped to Tailwind with `@theme inline`. Page code uses token utilities, not raw palette classes.

| Purpose | Variable | Value | Tailwind |
| --- | --- | --- | --- |
| Page background | `--background` | `#FFFFFF` | `bg-background` |
| Main text | `--foreground` | `#111111` | `text-foreground` |
| Soft section surface | `--surface-subtle` | `#FAFAFA` | `bg-surface-subtle` |
| Card | `--card` | `#FFFFFF` | `bg-card` |
| Primary action | `--primary` | `#111111` | `bg-primary` |
| Primary hover | `--primary-hover` | `#292929` | `bg-primary-hover` |
| Text on primary | `--primary-foreground` | `#FFFFFF` | `text-primary-foreground` |
| Secondary text (paragraphs) | `--muted-foreground` | `#52525B` | `text-muted-foreground` |
| Tertiary text (short labels) | `--text-subtle` | `#71717A` | `text-subtle` |
| Structural border | `--border` | `#E4E4E7` | `border-border` |
| Strong border | `--border-strong` | `#D4D4D8` | `border-border-strong` |
| Brand blue | `--brand` | `#2563EB` | `text-brand` |
| Brand blue hover | `--brand-hover` | `#1D4ED8` | `text-brand-hover` |
| Blue tint | `--brand-subtle` | `#EFF6FF` | `bg-brand-subtle` |
| Blue hairline | `--brand-border` | `#BFDBFE` | `border-brand-border` |
| Focus ring | `--ring` | `#2563EB` | `outline-ring` |
| Inverse surface | `--surface-inverse` | `#111111` | `bg-surface-inverse` |
| Inverse text | `--surface-inverse-foreground` | `#FAFAFA` | `text-surface-inverse-foreground` |
| Success / warning / error | `--success` / `--warning` / `--destructive` | `#15803D` / `#A16207` / `#B91C1C` | real states only |

The shadcn variables (`card-foreground`, `popover`, `secondary`, `muted`, `accent`, `input`, `chart-*`, `sidebar-*`, and others) stay complete. `--accent` stays a neutral hover surface. Blue is always `--brand`, never `--accent`.

Usage contract: charcoal buttons; blue for links, focus, active states, and the one Deployz-controlled element in a diagram. No blue sections, no blue logo, no decorative status colors.

## 4. Typography

One family: Inter Variable from `@fontsource-variable/inter` (local). System monospace only for real technical tokens (file paths, variable names, and in illustrations: repo, branch, commit, region, version).

| Utility | Mobile | ≥640px | ≥1024px | Weight | Tracking |
| --- | --- | --- | --- | --- | --- |
| `text-display` (home h1) | 36/1.12 | 48/1.1 | 60/1.08 | 600 | -0.035em |
| `text-h1` (inner h1) | 34/1.18 | 42/1.14 | 48/1.12 | 600 | -0.03em |
| `text-h2` | 28/1.23 | 32/1.2 | 38/1.18 | 600 | -0.025em |
| `text-h3` | 20/1.3 | 20/1.3 | 22/1.3 | 600 | -0.015em |
| `text-lead` | 16/1.65 | 18/1.65 | 18/1.65 | 400 | normal |
| Body | 16/1.65 | | | 400 | normal |
| `text-eyebrow` | 12/1.5 | | | 600 | sentence case |

- Headings use `text-wrap: balance`; paragraphs use `text-wrap: pretty` (set in the base layer). No cosmetic `<br>`.
- Measures: hero h1 870px, hero lead 650px, section h2 780px, prose 720px, FAQ 760px.
- No all-caps labels and no pill tags on headings. Eyebrows are optional and sparse. Exceptions: the home audience badge and the How It Works step labels are blue pills (`bg-brand-subtle`, `border-brand-border`, `text-brand-hover`).

## 5. Layout

| Primitive | Implementation |
| --- | --- |
| Container | `container-site`: 1120px content, gutters 20px (<640), 24px (640–1023), 32px (≥1024) |
| Section rhythm | `section-y`: 64px, 80px (≥640), 104px (≥1024) |
| Header height | 60px mobile, 64px desktop (`--header-height`) |
| Radius | 8px controls, 12px genuine frames (`rounded-xl`). Illustrations only: 14px boundaries, 16px stages. |
| Shadow | Floating menus: `shadow-menu` (`0 10px 30px rgb(17 17 17 / .08)`). Illustration cards: `--sc-shadow` and `--sc-shadow-brand` in `scene.css` only. |

Four composition families, varied across a page (no more than two adjacent sections in one family):

1. **Centered thesis** — optional eyebrow, heading, explanation, action or visual.
2. **Editorial split** — `lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]` (or 4/8) heading column and body column.
3. **Process rail** — numbered steps on a thin connecting line; vertical on mobile.
4. **Quiet grid** — two or three columns with a top hairline, no boxes.

At most one `bg-surface-subtle` full-width section per page. Separate sections with whitespace and hairlines, not alternating backgrounds.

## 6. Components

All marketing components are static Astro in `src/components/site/`.

| Component | File | Notes |
| --- | --- | --- |
| Site header | `SiteHeader.astro` | Links: How It Works, Who It's For, Pricing, Docs. Security is linked from the footer only. Sticky, solid white (no blur), hairline. ≥1024px: full nav, Sign in, CTA. <1024px: CTA + menu button; links in a disclosure panel. Inline script (not a module) handles `aria-expanded`, Escape, click-away, focus. Without JavaScript the links show as a static row. |
| Site footer | `SiteFooter.astro` | Logo plus two open link groups (Product; Resources: Documentation, Blog, Log In) and copyright. The two landing pages are reachable from the sitemap, not the footer. |
| Logo | `Logo.astro` | Approved mark plus wordmark text. |
| Section | `Section.astro` | `container-site` + `section-y`; `tone="subtle"`, `divider`. |
| Section heading | `SectionHeading.astro` | Optional eyebrow, h2, optional lead; left or centered. |
| Page header | `PageHeader.astro` | Inner-page h1, lead, actions slot, optional `aside` visual slot, optional full-width `visual` slot below the text. |
| FAQ list | `FaqList.astro` | Native `<details>`, 56px rows, plus/minus icon, hairlines. |
| Deployment diagram | `DeploymentDiagram.astro` | Signature hero diagram (see section 7). |
| Scene system | `scene/*.astro`, `diagram/*.astro` | Illustration parts and the page scenes (see section 7). |
| Product preview | `ProductPreview.astro` | Home Configure / Deploy / Manage tabs (ARIA tabs, Arrow/Home/End keys). Each panel is a labelled, simplified illustration built from real product labels, not a screenshot. Without JavaScript all panels show. Replace with real anonymized screenshots when they exist. |
| Closing CTA | `CtaSection.astro` | Centered closing section with one **Get Started Free** button. It is the one `bg-surface-subtle` section on each page that uses it. |

Control utilities (in `globals.css`):

- `btn btn-primary` — charcoal, 44px min height, 8px radius, hover `#292929`. Add `btn-lg` (48px) for hero CTAs.
- `btn btn-secondary` — white with `#D4D4D8` border.
- `link-arrow` — blue, underlined navigational link with an arrow, 44px target. Prose has no inline links (every link must keep a 44px target).
- Focus: 2px blue outline with 2px offset on every interactive element.

`src/components/ui/button.tsx` (shadcn) uses the same tokens for any future React island. Interactive marketing UI uses native HTML first.

## 7. Illustrations (scene system, v3.1)

Direction: **blueprint precision**. Every illustration is a small, believable product scene, in the style of strong developer-tool sites: real interface labels, real AWS services, monospace technical tokens, soft card depth, and cobalt deploy beams. It explains the product. It is never decoration.

- One system: `src/styles/scene.css` plus `src/components/site/scene/` (`Beam.astro`, `Mark.astro`, `GithubMark.astro`, `README.md`). Original HTML/CSS. No graphing, animation, or icon libraries beyond Lucide.
- **Stage** (`.sc-stage`): 16px frame, dot grid that fades to the edges, one faint cobalt light behind the focal point.
- **Cards** (`.sc-card`): header row with a 28px icon tile, body, optional footer, layered soft shadow. One `.sc-card-brand` (cobalt ring and glow) per scene marks the Deployz focal point. Never a solid blue card.
- **Boundaries** (`.sc-boundary`): dashed AWS account or VPC frames with the label tag on the top border.
- **Beams** (`Beam.astro`): 1.5px track, a port at each end, a mono label chip on the line, and a travelling light. One brand beam per scene; `blocked` (dashed, crossed chip) for a connection that does not exist.
- **Status**: green only for live or passed states, amber for needs input or changes needed, cobalt for in progress.
- **Layout** follows the figure width (container queries): vertical below 960px, horizontal above. Mobile is a real vertical composition, never a scaled drawing.
- **Accessibility**: the stage is `aria-hidden`; each figure has an `sr-only` or visible caption that states what the scene shows. Text is at least 12px.
- **Motion**: only the beam light and the live pulse. Both stop under `prefers-reduced-motion`.
- **Truth**: labels follow the product (for example readiness "X of Y checks passed", install steps "Create infrastructure", "Start application", "Check application", "Set up HTTPS", fleet statuses "Live", "Updating", "Waiting for customer"). Example values (repo, commit, version, region, the roadmap chips) are illustrative.

| Scene | Component | Page | Shows |
| --- | --- | --- | --- |
| Deploy flow | `DeploymentDiagram.astro` | `/` hero | GitHub repo → Deployz readiness report and release → the app live in customer AWS with its resources. |
| Product preview | `ProductPreview.astro` | `/` | Configure / Deploy / Manage tabs on a stage. Simplified interface, not a screenshot. |
| Journey | `diagram/JourneyDiagram.astro` | `/how-it-works` | Readiness report and release (steps 1–2) → installation link page (step 3) → live deployment with the install steps (step 4). |
| AI and guardrails | `diagram/GuardrailsDiagram.astro` | `/how-it-works` step 1 | Analysis (rule-based checks, one AI-inferred value with the real "Inferred by AI analysis" hint) → your review (detected values, needs input) → Deployz guardrails (schema, supported resources, preflight, size profile) producing CloudFormation. |
| Fleet | `diagram/FleetDiagram.astro` | `/who-its-for` header | One release branching into three customer AWS accounts, each with its own status. |
| Build vs. Deployz | `diagram/BuildVsBuyDiagram.astro` | `/pricing` | The same six pieces of work twice. Build it yourself: "Your team" owns all six. With Deployz: your team owns the product; Deployz owns the five deployment rows. |
| Infrastructure | `diagram/InfraDiagram.astro` | `/how-it-works` | Customer AWS account: edge (ACM, ALB), dedicated VPC (web service, workers, RDS, ElastiCache), account level (S3, Secrets Manager). |
| Architecture | `diagram/RelayDiagram.astro` | `/security` | Customer account with VPC resources and the connector; outbound HTTPS to Deployz; no inbound path. |

## 8. Page compositions

| Page | Composition |
| --- | --- |
| `/` | Seven sections: centered hero (audience line "For B2B SaaS Teams", H1 "Deploy into customer AWS", primary + secondary action) + diagram; three benefits (quiet grid); 4-step process rail; product preview tabs; ownership (quiet grid); FAQ (split); closing CTA. |
| `/how-it-works` | Left-aligned header with the journey diagram below the text (PageHeader `visual` slot); step 1 connect GitHub and analyze your repo (split: text and the AI-and-guardrails definition list, then the guardrails diagram; anchor `#ai-guardrails`); 2 configure and build a release (quiet grid); 3 customer connects AWS (split + step rail); 4 deploy and manage updates (quiet grid of four); what Deployz creates in customer AWS (heading, infrastructure diagram, two-column definition list); compatibility (split); closing CTA. Step labels are blue pills. `/features` redirects here. |
| `/who-its-for` | Left-aligned header with the fleet diagram aside; four personas (2×2 quiet grid: audience, headline, text, two checks); what you can build (split, definition list); good fit / not a fit (split); closing CTA. `/use-cases` redirects here. |
| `/byoc-deployments` | Landing page. Header with CTA; hosted SaaS vs. BYOC vs. self-hosted (quiet grid of definition lists, BYOC column with the brand hairline); what a BYOC platform needs (split); limits; closing CTA. |
| `/deploy-saas-to-customer-aws` | Landing page. Header with CTA; three ways teams do it (quiet grid); you / your customer / Deployz (split); FAQ (split); closing CTA. |
| `/pricing` | Left-aligned header; one bounded plan frame (price and CTA beside the free evaluation) with the included list below in two columns; cost estimator for an active subscription (range input, inline script); value section (build vs. Deployz diagram, three benefits, punchline); billing FAQ; closing CTA. |
| `/security` | Left-aligned header with the connector diagram below the text (PageHeader `visual` slot); AWS access + connector permissions + responsibilities; what Deployz receives with short notes on secrets, code and AI, routing; built on audited infrastructure (split: provider SOC 2 coverage, two FAQs); after deployment FAQ + team; closing CTA. |
| `/docs` | Docs header, in-page navigation, 720px prose column, contained overflow for tables and code. |
| `/blog` | Editorial list with dates and hairlines. |
| `/404` | Short centered message. |

## 9. Motion and accessibility

- Motion: color transitions only (150ms), using `transition-[color]` so that the focus outline never animates. No entrance animations, no `transition-all`. Illustrations may run the beam light and the live pulse (section 7). `prefers-reduced-motion` disables all transitions and hides both animations.
- WCAG 2.2 AA: secondary text `#52525B` for paragraphs; tertiary `#71717A` only for short labels.
- Every link and button has a target of at least 44px.
- One h1 per page; headings in order; named landmarks; skip link to `#main-content`.
- No horizontal page overflow at any width down to 187px. Tables and code blocks scroll inside their own container.

## 10. Technical rules

- Astro 5 static output, Tailwind 4, shadcn variables, Cloudflare Wrangler deploy. No framework migration.
- Zero hydration: no `client:*`, no module scripts. Small `is:inline` scripts only where native HTML is not sufficient (header menu, product preview tabs, pricing estimator).
- Do not add animation, icon, UI, graphing, or font libraries. Lucide (`lucide-react`, rendered at build time) is the icon set, 16–20px, used sparingly.
- Preserve routes, copy, hrefs, anchors, metadata, favicons, and the manifest. Every **Get Started Free** button uses `SIGNUP_URL` from `src/lib/site.ts`. `/get-started` redirects to sign-up through `public/_redirects`.
- `public/_headers` sets the security headers and CSP. Keep scripts and styles inline or same-origin, or update the CSP.
- Quality gate: `npm run build`, `npx astro check`, and `npx playwright test` (route smoke, landmarks, focus, axe, overflow, 44px targets, reduced motion, no hydration).
