# Deployz Design System (v3.0)

This file records the implemented marketing design system. The canonical specification is `DEPLOYZ_FINAL_DESIGN_SYSTEM.md` v3.0 (14 October 2026). This file replaces the earlier "monochrome depth" system (terminal hero, dot grids, glows, elevation scale, mono labels, scroll reveals). Do not bring those back.

> **North star:** powerful through clarity, appealing through precision, minimal without becoming empty.

## 1. Direction

- White canvas, near-black type, generous whitespace, one disciplined cobalt blue.
- Light theme only. There is no theme toggle and no `.dark` token set on the marketing site.
- Signature: the solid, bold Deployz mark against thin, ordered, architectural connectors.
- Attention budget (heuristic): about 80% calm neutral surfaces and text, 15% structure (diagrams, hairlines, frames), 5% blue.
- Do not build: hero gradients, glows, dot or grid backgrounds, parallax, glass panes, fake terminals or logs, stock 3D clouds, dashboard collages, boxes around every sentence, invented logos or statistics, continuous motion.

## 2. Logo

- Source: `public/deployz-icon-master.svg` (black mark). Favicons, `site.webmanifest`, and `safari-pinned-tab.svg` are unchanged.
- `src/components/site/Logo.astro` renders the mark plus the lowercase `deployz` wordmark text with a 9px gap. Header size 28px, footer 26px, diagram badge 18px.
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

One family: Inter Variable from `@fontsource-variable/inter` (local). System monospace only for real technical tokens (file paths, variable names).

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
- No all-caps labels and no pill tags on headings. Eyebrows are optional and sparse.

## 5. Layout

| Primitive | Implementation |
| --- | --- |
| Container | `container-site`: 1120px content, gutters 20px (<640), 24px (640–1023), 32px (≥1024) |
| Section rhythm | `section-y`: 64px, 80px (≥640), 104px (≥1024) |
| Header height | 60px mobile, 64px desktop (`--header-height`) |
| Radius | 8px controls, 12px genuine frames (`rounded-xl`), nothing larger |
| Shadow | Only floating menus: `shadow-menu` (`0 10px 30px rgb(17 17 17 / .08)`) |

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
| Site header | `SiteHeader.astro` | Sticky, solid white (no blur), hairline. ≥1024px: full nav, Sign in, CTA. <1024px: CTA + menu button; links in a disclosure panel. Inline script (not a module) handles `aria-expanded`, Escape, click-away, focus. Without JavaScript the links show as a static row. |
| Site footer | `SiteFooter.astro` | Logo plus two open link groups and copyright. |
| Logo | `Logo.astro` | Approved mark plus wordmark text. |
| Section | `Section.astro` | `container-site` + `section-y`; `tone="subtle"`, `divider`. |
| Section heading | `SectionHeading.astro` | Optional eyebrow, h2, optional lead; left or centered. |
| Page header | `PageHeader.astro` | Inner-page h1, lead, actions slot, optional `aside` visual slot. |
| FAQ list | `FaqList.astro` | Native `<details>`, 56px rows, plus/minus icon, hairlines. |
| Deployment diagram | `DeploymentDiagram.astro` | Signature hero diagram (see section 7). |
| Diagram system | `diagram/*.astro` | `Connector.astro` and the page diagrams (see section 7). |
| Product preview | `ProductPreview.astro` | Home Configure / Deploy / Manage tabs (ARIA tabs, Arrow/Home/End keys). Each panel is a labelled, simplified illustration built from real product labels, not a screenshot. Without JavaScript all panels show. Replace with real anonymized screenshots when they exist. |
| Closing CTA | `CtaSection.astro` | Centered closing section with one **Get Started Free** button. It is the one `bg-surface-subtle` section on each page that uses it. |

Control utilities (in `globals.css`):

- `btn btn-primary` — charcoal, 44px min height, 8px radius, hover `#292929`. Add `btn-lg` (48px) for hero CTAs.
- `btn btn-secondary` — white with `#D4D4D8` border.
- `link-arrow` — blue, underlined navigational link with an arrow, 44px target. Prose has no inline links (every link must keep a 44px target).
- Focus: 2px blue outline with 2px offset on every interactive element.

`src/components/ui/button.tsx` (shadcn) uses the same tokens for any future React island. Interactive marketing UI uses native HTML first.

## 7. Diagrams

- One diagram system for the whole site: `src/styles/diagrams.css` plus `src/components/site/diagram/` (see its `README.md`). Original HTML/CSS. No graphing or animation libraries.
- Layout follows the figure width (CSS container queries on `.dg`), not the viewport: vertical below 760px container width, horizontal above. Mobile is the vertical composition, never a scaled drawing, never hidden.
- Stroke 1.5px; neutral `#D4D4D8`; the single Deployz-controlled connector in blue `#2563EB`. A dashed connector with a crossed marker shows a connection that does not exist.
- Nodes: 12px radius, 20px padding (24px when horizontal), role label 12px with a 16px Lucide icon, title 16px, text 14px. Items inside a node are 8px-radius chips.
- The Deployz node may use `bg-brand-subtle` + `border-brand-border`. Never a solid blue card. At most one blue node and one blue connector per diagram.
- Account boundary: `bg-surface-subtle`, `border-border-strong`, role label top-left.
- Connectors are `aria-hidden`; every figure has a caption (visible or `sr-only`) that states the relationships, and node text is real text.
- Text in diagrams comes from verified product behavior and existing site copy only.

| Diagram | Component | Page | Explains |
| --- | --- | --- | --- |
| Hero flow | `DeploymentDiagram.astro` | `/` | GitHub → Deployz (blue) → customer AWS with the application container and its resources. |
| Journey | `diagram/JourneyDiagram.astro` | `/how-it-works` | You prepare → installation link → your customer connects AWS → Deployz deploys and you manage. Maps to steps 1–4 on the page. |
| Fleet | `diagram/FleetDiagram.astro` | `/use-cases` header | One release process installed into each customer's own AWS account, each with its own status. |
| Billing | `diagram/BillingDiagram.astro` | `/pricing` | Deployz bills the vendor; AWS bills the AWS account owner. |
| Relay | `diagram/RelayDiagram.astro` | `/security` | The relay in the customer account starts every request over outbound HTTPS; no inbound connections. |

The product preview (`ProductPreview.astro`) is a simplified interface illustration, not a diagram. Its labels follow the product (for example the install steps "Create infrastructure", "Start application", "Check application", "Set up HTTPS").

## 8. Page compositions

| Page | Composition |
| --- | --- |
| `/` | Seven sections: centered hero + diagram; problem (split, text only); solution + three benefits (quiet grid); 3-step process rail; product preview tabs; security summary + FAQ (split); closing CTA. |
| `/how-it-works` | Left-aligned header; journey diagram (process at a glance); connect and analyze (split); review and configure (quiet grid); customer AWS connection (split + step rail); deploy and manage (quiet grid); compatibility (split, good fit / not supported); closing CTA. |
| `/use-cases` | Left-aligned header with the fleet diagram aside; three customer-request sections (split, quote heading); who Deployz is for; closing CTA. |
| `/pricing` | Left-aligned header; one bounded plan frame + included list; cost estimator (range input, inline script); Deployz vs AWS billing diagram; billing FAQ; closing CTA. |
| `/security` | Left-aligned header; what runs where; AWS access; outbound-only relay diagram; responsibilities, data, secrets, routing; lifecycle disclosures + team; closing CTA. |
| `/docs` | Docs header, in-page navigation, 720px prose column, contained overflow for tables and code. |
| `/blog` | Editorial list with dates and hairlines. |
| `/404` | Short centered message. |

## 9. Motion and accessibility

- Motion: color transitions only (150ms), using `transition-[color]` so that the focus outline never animates. No entrance animations, no transforms, no `transition-all`. `prefers-reduced-motion` disables all transitions.
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
