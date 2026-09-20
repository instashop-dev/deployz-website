# Deployz Design System

## 0. Research Log

- Existing-site extraction: `src/layouts/Base.astro` defines the current public shell and six local tokens. The public routes are `/`, `/how-it-works`, `/security`, `/pricing`, `/get-started`, `/blog`, `/docs`, and `/404`.
- Dashboard source: `apps/web/components.json`, `apps/web/src/app/globals.css`, and `docs/ui-system.md` define the radix-nova, neutral, CSS-variable, Inter, Lucide, and direct-composition rules.
- Public reference: the Vercel reference supplies restrained hierarchy, compact navigation, direct calls to action, and generous whitespace only. Do not copy its assets, trademark, copy, fonts, or exact tokens.
- Skipped lanes: lazyweb and image drafts are not needed. This is an existing public site with an approved dashboard token source and one constrained layout reference.
- 2026 monochrome-depth revision: light theme stays, hue accent stays forbidden. Depth now comes from an elevation scale, an inverse surface, a mono typographic voice, dot-grid and glow backdrops, a terminal hero visual, and reduced-motion-safe scroll reveals. Zero client hydration stays a hard rule; the reveal script is a plain inline script, not a module and not an island.

## 1. Atmosphere & Identity

Deployz is quiet, direct, and technical, with the confidence of a top-tier developer-tools company. The signature is premium monochrome: near-black on white, strong display type, a monospace voice for technical labels, layered elevation, and one high-contrast dark surface (the terminal and the closing call to action) used sparingly for impact. No brand hue exists. Trust comes from precision: hairline borders, exact spacing, tabular numerals, and purposeful motion.

## 2. Color

The public site uses the dashboard-compatible radix-nova neutral light tokens below. Page files use semantic token utilities only. They do not use raw palette colors. Zero chroma is allowed in brand tokens; the only chromatic token is the semantic destructive red. The public site has no theme switcher. Do not add a dark selector or dark-mode behavior in this work.

| Role | Token | Value | Use |
| --- | --- | --- | --- |
| Page surface | `--background` | `oklch(1 0 0)` | Body and main background |
| Main text | `--foreground` | `oklch(0.145 0 0)` | Headings and primary text |
| Card surface | `--card` | `oklch(1 0 0)` | Card background |
| Card text | `--card-foreground` | `oklch(0.145 0 0)` | Card content |
| Popover surface | `--popover` | `oklch(1 0 0)` | Registry popovers only |
| Popover text | `--popover-foreground` | `oklch(0.145 0 0)` | Registry popover content |
| Primary action | `--primary` | `oklch(0.205 0 0)` | Primary Button and strong action |
| Primary action text | `--primary-foreground` | `oklch(0.985 0 0)` | Text on primary action |
| Secondary surface | `--secondary` | `oklch(0.97 0 0)` | Secondary Button and quiet grouping |
| Secondary text | `--secondary-foreground` | `oklch(0.205 0 0)` | Text on secondary surface |
| Muted surface | `--muted` | `oklch(0.97 0 0)` | Low-emphasis region |
| Muted text | `--muted-foreground` | `oklch(0.556 0 0)` | Supporting copy and metadata |
| Accent surface | `--accent` | `oklch(0.97 0 0)` | Registry hover treatment |
| Accent text | `--accent-foreground` | `oklch(0.205 0 0)` | Text on accent surface |
| Inverse surface | `--surface-inverse` | `oklch(0.145 0 0)` | Terminal window and dark CTA panel |
| Inverse surface text | `--surface-inverse-foreground` | `oklch(0.985 0 0)` | Text on the inverse surface |
| Destructive state | `--destructive` | `oklch(0.577 0.245 27.325)` | Destructive Alert or Button only |
| Structural border | `--border` | `oklch(0.922 0 0)` | Card, Separator, and form border |
| Form input border | `--input` | `oklch(0.922 0 0)` | Registry input border |
| Keyboard ring | `--ring` | `oklch(0.708 0 0)` | Visible focus ring |
| Radius base | `--radius` | `0.625rem` | Registry radius scale |

Rules for the inverse surface:

- Text on the inverse surface uses `text-surface-inverse-foreground` with an opacity modifier. Keep opacity at `/60` or higher; `/60` is the floor that still meets 4.5:1 contrast.
- Structure on the inverse surface uses `border-surface-inverse-foreground/10` through `/20`.
- The inverse surface is reserved for the hero terminal and the closing call to action. Do not spread dark panels across the page.

The dashboard dark token map remains its dashboard concern. A later, approved public dark mode must use that same source map. It must not create a second public palette.

## 3. Typography

The public site uses the dashboard font direction. Load Inter locally. Do not make a remote font request. The mono stack is a first-class typographic voice: eyebrows, step numbers, stats numerals, terminal text, and footer column labels use it.

| Role | Size | Weight | Line height | Tracking | Use |
| --- | --- | --- | --- | --- | --- |
| Display | `2.5rem`, then `3.75rem` from 640 pixels, then `4.5rem` from 1024 pixels | 600 | 1.05 | `-0.035em` | Home-page statement |
| Page title | `2.25rem` | 600 | 1.2 | `-0.02em` | One `h1` per route |
| Section title | `1.5rem`, then `1.875rem` from 640 pixels | 600 | 1.33, then 1.2 | `-0.025em` | `h2` |
| Card title | `1.125rem` | 600 | 1.55 | `0` | `h3`, card, and article title |
| Lead | `1.125rem` | 400 | 1.55 | `0` | Text below a page title |
| Body | `1rem` | 400 | 1.625 | `0` | Standard reading text |
| Supporting text | `0.875rem` | 400 | 1.5 | `0` | Metadata and supporting copy |
| Technical label | `0.75rem` | 500 | 1.4 | `0.02em` | Code label or small identifier |
| Mono eyebrow | `0.75rem` | 500 | 1.4 | `0.14em`, uppercase | Section kicker above an `h2` |
| Mono stat | `1.25rem` to `1.5rem` | 500 | 1.2 | tight, `tabular-nums` | Stats band figures |
| Terminal text | `0.8rem`, then `0.875rem` from 640 pixels | 400 | 1.75 (`leading-7`) | `0` | Hero terminal lines |

- Sans stack: `Inter Variable`, `Inter`, `ui-sans-serif`, `system-ui`, `-apple-system`, `BlinkMacSystemFont`, `"Segoe UI"`, `sans-serif`.
- Mono stack: `ui-monospace`, `"SFMono-Regular"`, `Menlo`, `Consolas`, `"Liberation Mono"`, `monospace`.
- Body text is never smaller than `0.875rem`.
- Paragraph text uses `--foreground`. Apply `text-muted-foreground` at the use site only for supporting text.
- Use `font-semibold` and `tracking-tight` for titles. Display tracking may reach `-0.035em`; never tighter.
- Use mono text where it improves technical recognition: eyebrows, numerals, identifiers, terminal. Do not set body paragraphs in mono.
- Eyebrows sit above section titles, one per section, with `mt-3` to the `h2`. Do not stack two eyebrows.

## 4. Spacing & Layout

Spacing uses a 4-pixel base. Use these intent tokens through the matching Tailwind spacing utilities.

| Token | Value | Use |
| --- | --- | --- |
| `space-1` | `0.25rem` | Tight icon and label gap |
| `space-2` | `0.5rem` | Compact inline group |
| `space-3` | `0.75rem` | Compact stack |
| `space-4` | `1rem` | Default inner gap |
| `space-6` | `1.5rem` | Card padding and section inner gap |
| `space-8` | `2rem` | Related content groups |
| `space-12` | `3rem` | Section separation on small screens |
| `space-16` | `4rem` | Section separation on medium screens |
| `space-20` | `5rem` | Hero or large section separation |
| `space-24` | `6rem` | Section separation on large screens |

- The site shell uses a centered content width of `72rem` and inline padding of `1rem` at 375 pixels, `1.5rem` at 768 pixels, and `2rem` at 1280 pixels.
- The home-page hero is centered: eyebrow, display `h1`, lead, two calls to action, then the terminal visual at `max-w-3xl`, then a three-cell control strip at `max-w-4xl`. From 1024 pixels the hero keeps this single centered column; there is no second hero column.
- The bento benefit grid uses `lg:grid-cols-3` with the primary benefit at `lg:col-span-2 lg:row-span-2` and the two supporting benefits stacked in the third column.
- Marketing pages use three section tiers. A standard section gap is `space-12`, then `space-16` from 768 pixels, then `space-24` from 1024 pixels. A group that supports the section before it uses `space-8`, `space-12`, and `space-16`. The gap from a section title to its content is `space-6`, then `space-8` from 768 pixels.
- Use a single-column content flow at 375 pixels. Keep primary navigation and auth actions visible.
- Use CSS grid and flex mechanics directly. Do not turn browser mechanics into new tokens.
- Each public interactive use must be at least 44 pixels high. Apply `min-h-11` at the use site. Apply `min-w-11` to icon-only controls. Do not edit generated shadcn component source to meet this rule.
- Anchored sections use `scroll-mt-24` so the sticky header does not cover the target.

## 5. Components

Use only direct shadcn composition. Generated primitive source stays unchanged. Use built-in variants and layout classes. Do not create wrappers or future components.

### Button

- **Structure:** generated `Button`, or `buttonVariants()` classes on an anchor when the action changes location.
- **Applicable variants:** `default` for the primary action, `outline` for a secondary action, and `ghost` for low-emphasis navigation. `default` and `outline` carry `shadow-xs`; `default` lifts to `shadow-sm` on hover. No other shadow edits at use sites.
- **Spacing:** use `space-2` for icon and label groups. Use `min-h-11` at public action use sites.
- **States:** default, hover, active, focus-visible, and disabled. A link button has default, hover, active, and focus-visible states.
- **Accessibility:** use an anchor for navigation and a button for an action. Keep a visible label.
- **Motion:** generated transitions plus the small hover shadow change only.

### Card

- **Structure:** generated `Card` parts when each part is present.
- **Applicable variants:** the generated default Card only. Add `shadow-e1` at the use site when the card sits on the page background.
- **Bento cells:** hand-composed `li` with `rounded-xl border bg-card shadow-e1`, hover lift (`hover:-translate-y-0.5 hover:shadow-e2 hover:border-foreground/20`, 200 ms). Icons sit in a `size-11` bordered, rounded square on `bg-muted/60`.
- **States:** hover lift for bento cells only. Do not make a static Card appear interactive.
- **Accessibility:** keep headings and links semantic.
- **Motion:** the hover lift animates `transform`, `box-shadow`, and `border-color` only.

### Badge

- Generated `Badge` with short status text. Use generated variants only. Color never carries status without text.

### Alert and Separator

- Generated use only, unchanged from the registry.

### Hero Terminal Visual

- **Structure:** an inverse-surface window: `rounded-xl bg-surface-inverse shadow-e3 ring-1 ring-foreground/10`. Header row has three neutral window dots (`bg-surface-inverse-foreground/20`, decorative, `aria-hidden`), a mono title at `/60`, and an optional `LIVE` pill with a `animate-pulse` dot at `/70`. Body is a `pre` with `whitespace-pre-wrap break-words` and mono text.
- **Content:** short, factual install output. `$` prompt and dim output lines use `/60` text; command and success lines use full inverse foreground. Keep every line at or under 44 characters so the window does not wrap at 375 pixels.
- **Accessibility:** the window is decorative support for the adjacent copy; keep `aria-hidden` off the text and let it read as plain text. Never encode meaning in the `LIVE` pulse alone.
- **Motion:** the `animate-pulse` dot only, which the global reduced-motion rule stops.

### Background Treatments

- **Dot grid:** `bg-grid-dots` (light) and `bg-grid-dots-inverse` (dark), always masked with a radial `mask-image` so the pattern fades out, always `pointer-events-none` and `aria-hidden`, always at `-z-10` inside a `relative` section.
- **Glow:** `hero-glow` behind the hero top edge only. One glow per page.
- Do not apply background treatments to reading sections.

### Illustration

- Inline SVG in the page file stays allowed for explanatory line drawings on secondary pages. Monochrome, 1.5-pixel stroke, token utilities only. Static, no motion.

### Site Shell

- **Structure:** skip link, sticky `header` (`sticky top-0 z-40` with `bg-background/85`, `backdrop-blur-md`, `border-b border-border/80`), named primary `nav`, one `main` with a stable target id, and `footer` with `border-t`.
- **Footer:** column titles are mono eyebrows (`text-xs`, `tracking-[0.14em]`, uppercase, `text-foreground`). Links keep the 44-pixel rule.
- **States:** the active primary navigation link uses `aria-current="page"`. Every link has default, hover, active, and focus-visible states.
- **Accessibility:** the skip link becomes visible on keyboard focus and targets `main`.
- **Motion:** no menu drawer or client behavior. Header reflow is static at breakpoints.

### Scroll Reveal

- **Structure:** a plain inline `<script is:inline>` (no `type="module"`, no hydration) at the end of `body` in `Base.astro`. It adds `js` to the `html` element only when `IntersectionObserver` exists, then adds `revealed` to each `.reveal` element when it enters the viewport.
- **CSS:** the hidden start state exists only inside `@media (prefers-reduced-motion: no-preference)` and only under `html.js`. Delay comes from a `--reveal-delay` custom property; stagger steps of 60 ms, maximum 240 ms total per group.
- **Rules:** animate `opacity` and `transform` only; 280 ms `ease-out`; one reveal group per section; never reveal text the user is actively reading at the top of the page load path without also showing it without JavaScript.
- **No-JS and reduced-motion:** without the `js` class or with reduced motion, all content renders fully visible. This is a progressive-enhancement requirement, not an option.

## 6. Motion & Interaction

The public site ships zero hydration: no Astro client directive, no hydrated island, no React runtime, no client-side navigation. The only script is the scroll-reveal inline script in Section 5.

| Interaction | Timing | Rule |
| --- | --- | --- |
| Button and link feedback | Up to 150 ms | Color, opacity, or shadow transition only |
| Scroll reveal | 280 ms, 60 ms stagger | `opacity` and `transform` only, gated by `prefers-reduced-motion: no-preference` and `html.js` |
| Bento hover lift | 200 ms | `transform`, `box-shadow`, `border-color` only |
| Terminal `LIVE` dot | `animate-pulse` | Stopped by the global reduced-motion rule |
| Keyboard focus | Immediate | Ring remains visible until focus moves |

- Do not add decorative animation beyond the table above, animation libraries, parallax, or autoplay carousels.
- Under `prefers-reduced-motion: reduce`, the global rule in `globals.css` forces all transitions and animations to 0.01 ms. Do not remove that rule. The Playwright contract measures it.
- The server-rendered HTML stays complete and readable with JavaScript disabled.

## 7. Depth & Surface

Depth uses an explicit neutral elevation scale plus a border hierarchy. All shadows are layered, low-opacity black; no hue tint.

| Token | Value | Use |
| --- | --- | --- |
| `--shadow-e1` | `0 1px 2px oklch(0 0 0 / 0.05), 0 1px 3px oklch(0 0 0 / 0.04)` | Resting cards, bento cells, stats band |
| `--shadow-e2` | `0 2px 4px oklch(0 0 0 / 0.06), 0 4px 12px oklch(0 0 0 / 0.05)` | Hovered cards, lifted buttons |
| `--shadow-e3` | `0 4px 8px oklch(0 0 0 / 0.07), 0 12px 32px oklch(0 0 0 / 0.09)` | Terminal window, dark CTA panel |

| Level | Treatment | Use |
| --- | --- | --- |
| Base | `--background`, no elevation | Page and prose |
| Hairline | `--border` on `gap-px` grid rows or `border-t` rows | Stats band, control strip, list rows |
| Card | border + `shadow-e1` | Report card, bento cells |
| Elevated | `shadow-e3` + `ring-1 ring-foreground/10` | Terminal, dark CTA |
| Inverse | `bg-surface-inverse` + masked `bg-grid-dots-inverse` | Terminal, dark CTA |
| Focus | generated `--ring` focus-visible treatment | Keyboard interaction |

- Use `gap-px` on a `bg-border` grid for hairline-divided bands (stats, control strip); cells take `bg-background`.
- The sticky header uses translucency and blur (`bg-background/85 backdrop-blur-md`), not a shadow.
- Do not add gradients other than the neutral `hero-glow` and the masked dot patterns. Do not add glass cards, noise, or colored shadows.
- Use the generated radius scale based on `--radius`. Do not add a new radius token. Vercel is not a token, type, component, or depth source for Deployz.

## 8. Accessibility Constraints & Accepted Debt

### Constraints

- Target WCAG 2.2 AA. Maintain at least 4.5:1 contrast for normal text and 3:1 contrast for large text and essential UI boundaries.
- Text on the inverse surface uses `/60` opacity or higher. `/50` and below fail 4.5:1 and are forbidden for text.
- Every interactive element supports keyboard use and has a visible focus indicator that uses `--ring` (or the inverse-foreground ring inside dark panels).
- Use semantic `header`, named `nav`, `main`, `footer`, `article`, `time`, headings, lists, buttons, and anchors for their native purposes.
- Provide one visible-on-focus skip link to the main landmark. Use one `h1` per route and do not skip heading levels.
- Meet the 44-pixel public target size with `min-h-11` at use sites only.
- Preserve route content at 375, 768, and 1280 pixels without horizontal overflow, including at half-width viewports. Terminal and mono text must wrap (`whitespace-pre-wrap break-words`) instead of overflowing.
- Respect `prefers-reduced-motion: reduce`: the global 0.01 ms rule must stay, and reveal start states must not apply outside `prefers-reduced-motion: no-preference`.
- Use text with any status. Do not make meaning depend on color, icon, position, or motion alone.
- Do not add hydrated client behavior. The server-rendered public HTML remains usable when JavaScript is unavailable, including all reveal-marked content.
- The Playwright contract in `tests/site.spec.ts` enforces: one `h1` per route, ordered headings, named landmarks, skip link, `aria-current` navigation, local Inter font, no module scripts or islands, no console errors, no axe serious or critical violations, no half-width overflow, 44-pixel targets, and reduced-motion compliance. Run it before every design change.

### Accepted Debt

| Item | Location | Why accepted | Owner / Exit |
| --- | --- | --- | --- |
