# Deployz Design System

## 0. Research Log

- Existing-site extraction: `src/layouts/Base.astro` defines the current public shell and six local tokens. The public routes are `/`, `/how-it-works`, `/security`, `/pricing`, `/get-started`, `/blog`, `/docs`, and `/404`.
- Dashboard source: `apps/web/components.json`, `apps/web/src/app/globals.css`, and `docs/ui-system.md` define the radix-nova, neutral, CSS-variable, Inter, Lucide, and direct-composition rules.
- Public reference: the Vercel reference supplies restrained hierarchy, compact navigation, direct calls to action, and generous whitespace only. Do not copy its assets, trademark, copy, fonts, or exact tokens.
- Skipped lanes: lazyweb and image drafts are not needed. This is an existing public site with an approved dashboard token source and one constrained layout reference.

## 1. Atmosphere & Identity

Deployz is quiet, direct, and technical. It uses the dashboard's neutral shadcn foundation so the public site feels like a clear entry to the product. The signature is clear content hierarchy: concise navigation, one direct page purpose, compact section space, and neutral surfaces that make product information easy to scan.

## 2. Color

The public site uses the dashboard-compatible radix-nova neutral light tokens below. Page files use semantic token utilities only. They do not use raw palette colors. The public site has no theme switcher. Do not add a dark selector or dark-mode behavior in this work.

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
| Destructive state | `--destructive` | `oklch(0.577 0.245 27.325)` | Destructive Alert or Button only |
| Structural border | `--border` | `oklch(0.922 0 0)` | Card, Separator, and form border |
| Form input border | `--input` | `oklch(0.922 0 0)` | Registry input border |
| Keyboard ring | `--ring` | `oklch(0.708 0 0)` | Visible focus ring |
| Radius base | `--radius` | `0.625rem` | Registry radius scale |

The dashboard dark token map remains its dashboard concern. A later, approved public dark mode must use that same source map. It must not create a second public palette.

## 3. Typography

The public site uses the dashboard font direction. Load Inter locally. Do not make a remote font request. Use the mono stack only for technical labels, code, and inline identifiers.

| Role | Size | Weight | Line height | Tracking | Use |
| --- | --- | --- | --- | --- | --- |
| Display | `clamp(2.25rem, 6vw, 3rem)` | 600 | 1.1 | `-0.02em` | Home-page statement |
| Page title | `2.25rem` | 600 | 1.2 | `-0.02em` | One `h1` per route |
| Section title | `1.5rem`, then `1.875rem` from 640 pixels | 600 | 1.33, then 1.2 | `-0.025em` | `h2` |
| Card title | `1.125rem` | 600 | 1.55 | `0` | `h3`, card, and article title |
| Lead | `1.125rem` | 400 | 1.55 | `0` | Text below a page title |
| Body | `1rem` | 400 | 1.625 | `0` | Standard reading text |
| Supporting text | `0.875rem` | 400 | 1.5 | `0` | Metadata and supporting copy |
| Technical label | `0.75rem` | 500 | 1.4 | `0.02em` | Code label or small identifier |

- Sans stack: `Inter Variable`, `Inter`, `ui-sans-serif`, `system-ui`, `-apple-system`, `BlinkMacSystemFont`, `"Segoe UI"`, `sans-serif`.
- Mono stack: `ui-monospace`, `"SFMono-Regular"`, `Consolas`, `"Liberation Mono"`, `monospace`.
- Body text is never smaller than `0.875rem`.
- Paragraph text uses `--foreground`. Apply `text-muted-foreground` at the use site only for supporting text: text below a card title, metadata, and notes.
- Use `font-semibold` and `tracking-tight` for page titles. This matches the dashboard title rule.
- Use mono text only where it improves technical recognition. Do not use it as decoration.

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
- The content shell uses `48rem` for blog articles and reading content. Docs may use the site width when lists need more space.
- Section separation is the total gap between two sections. `main` and each `section` share it. Do not apply the full value to both.
- Marketing pages use three section tiers. A standard section gap is `space-12`, then `space-16` from 768 pixels, then `space-24` from 1024 pixels. A group that supports the section before it, such as the home-page stat strip, uses `space-8`, `space-12`, and `space-16`. The gap from a section title to its content is `space-6`, then `space-8` from 768 pixels.
- Use a single-column content flow at 375 pixels. Keep primary navigation and auth actions visible in a two-row static header.
- At 768 pixels, use the medium layout: a horizontal header and two-column supporting grids where content has two peer items.
- At 1280 pixels, retain the same content order, center the site shell, and use the full `72rem` width. Do not add a wider layout only for decoration. From 1024 pixels, the home-page hero puts the control diagram in a second column.
- Use CSS grid and flex mechanics directly for wrapping and intrinsic sizing. Do not turn browser mechanics into new tokens.
- Each public interactive use must be at least 44 pixels high. Apply `min-h-11` at the use site. Apply `min-w-11` to icon-only controls. Do not edit generated shadcn component source to meet this rule.

## 5. Components

Use only direct shadcn composition. Generated primitive source stays unchanged. Use built-in variants and layout classes. Do not create wrappers or future components.

### Button

- **Structure:** generated `Button`, or `Button asChild` around an anchor when the action changes location.
- **Applicable variants:** `default` for the primary action, `outline` for a secondary action, and `ghost` for low-emphasis navigation. Use only variants generated by shadcn.
- **Spacing:** use `space-2` for icon and label groups. Use `min-h-11` at public action use sites.
- **States:** default, hover, active, focus-visible, and disabled for non-anchor buttons. A link button has default, hover, active, and focus-visible states.
- **Accessibility:** use an anchor for navigation and a button for an action. Keep a visible label unless the control is icon-only and has an accessible name.
- **Motion:** use only the generated short color and opacity transitions. No layout animation.

### Card

- **Structure:** generated `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, and `CardFooter` when each part is present.
- **Applicable variants:** use the generated default Card only. Do not add a Card variant.
- **Spacing:** use `space-4` or `space-6` between composed regions.
- **States:** a static Card has its default state only. A Card that contains a link keeps the link as the focus target and uses the link's hover, active, and focus-visible states. Do not make a static Card appear interactive.
- **Accessibility:** keep headings and links semantic. Do not nest interactive controls.
- **Motion:** no Card entry animation. Use generated depth only.

### Badge

- **Structure:** generated `Badge` with short status or category text.
- **Applicable variants:** use only generated variants that match the content meaning. Do not create a public badge vocabulary in this task.
- **Spacing:** keep the generated compact padding. Do not use a Badge as a primary action.
- **States:** default static state. If a Badge is a link, the anchor supplies hover, active, and focus-visible states.
- **Accessibility:** color never carries status without text.
- **Motion:** no motion is required.

### Alert

- **Structure:** generated `Alert`, `AlertTitle`, and `AlertDescription`.
- **Applicable variants:** default for an informational notice and destructive only for true destructive or error content.
- **Spacing:** use `space-3` inside the alert content.
- **States:** static informational or destructive state. Do not add dismiss, loading, or toast behavior.
- **Accessibility:** the message must state its meaning in text. Do not rely on color or an icon alone.
- **Motion:** no motion is required.

### Separator

- **Structure:** generated horizontal `Separator` between groups that need structural separation.
- **Applicable variants:** generated default only.
- **Spacing:** place `space-6` or `space-8` around a major content group.
- **States:** static only.
- **Accessibility:** omit a decorative separator from the accessibility tree when the generated primitive supports it. Do not use it as the only grouping cue.
- **Motion:** no motion is required.

### Illustration

- **Structure:** inline SVG in the page file. Use a line drawing that explains the product: the control diagram, a workflow, an account boundary, or a price. Do not add decoration that explains nothing.
- **Applicable variants:** monochrome only. Use a 1.5-pixel stroke with round caps to match the Lucide icons. Use `fill-*` and `stroke-*` token utilities only: `foreground`, `background`, `muted`, `muted-foreground`, and `border`.
- **Spacing:** a page-title illustration uses the second hero column (`20rem` to `22rem`) from 1024 pixels and is hidden below that width. An illustration in a card or a section scales with its container.
- **States:** static only.
- **Accessibility:** use `aria-hidden="true"` when the adjacent text gives the same information. Use `role="img"` and an `aria-label` when the drawing carries meaning. Keep text in the SVG at 11 pixels or larger at the rendered size.
- **Motion:** no motion.

### Site Shell

- **Structure:** skip link, `header`, named primary `nav`, one `main` with a stable target id, and `footer`.
- **Spacing:** use the site shell width and breakpoints from Section 4.
- **States:** the active primary navigation link uses `aria-current="page"`. Every navigation and auth link has default, hover, active, and focus-visible states.
- **Accessibility:** the skip link becomes visible on keyboard focus and targets `main`. Header actions use the 44-pixel target rule.
- **Motion:** no menu drawer or client behavior. Header reflow is static at breakpoints.

### Content Shell

- **Structure:** page `h1`, optional lead text, content sections, and semantic route content. Blog lists use `article` and `time`. Docs preserve lists.
- **Spacing:** use `space-8` for related groups and `space-12` through `space-24` for sections.
- **States:** content is static. Links inside content have default, hover, active, and focus-visible states.
- **Accessibility:** each route has one `h1`, logical heading order, readable line length, and no horizontal overflow at the required viewports.
- **Motion:** no entrance or scroll animation.

## 6. Motion & Interaction

The public site is static by default. It uses zero client hydration: no Astro client directive, hydrated island, React runtime script, or client-side navigation behavior is allowed.

| Interaction | Timing | Rule |
| --- | --- | --- |
| Button and link feedback | Up to 150 ms | Generated color, opacity, or shadow transition only |
| Keyboard focus | Immediate | Ring remains visible until focus moves |
| Layout breakpoint change | None | Static CSS reflow only |

- Do not add decorative animation, scroll effects, animation libraries, or JavaScript motion.
- If a generated component has an essential transition, animate only `color`, `background-color`, `border-color`, `box-shadow`, `opacity`, or `transform`.
- Under `prefers-reduced-motion: reduce`, remove non-essential transitions and animations. Focus visibility and state clarity stay unchanged.

## 7. Depth & Surface

Use the dashboard-compatible shadcn depth system. Borders use `--border`. Cards keep the registry default border and subtle default shadcn depth. Do not add a custom shadow recipe, a shadow-as-border effect, gradients, glass effects, or decorative surface layers.

| Level | Treatment | Use |
| --- | --- | --- |
| Base | `--background` with no elevation | Page and prose |
| Structural | `--border` through generated primitive styles or a Separator | Header, footer, and content groups |
| Card | Generated Card border and subtle default shadcn depth | Related information group |
| Focus | Generated `--ring` focus-visible treatment | Keyboard interaction |

Use the generated radius scale based on `--radius`. Do not add a new radius token. Vercel is not a token, type, component, or depth source for Deployz.

## 8. Accessibility Constraints & Accepted Debt

### Constraints

- Target WCAG 2.2 AA. Maintain at least 4.5:1 contrast for normal text and 3:1 contrast for large text and essential UI boundaries.
- Every interactive element supports keyboard use and has a visible focus indicator that uses `--ring`.
- Use semantic `header`, named `nav`, `main`, `footer`, `article`, `time`, headings, lists, buttons, and anchors for their native purposes.
- Provide one visible-on-focus skip link to the main landmark. Use one `h1` per route and do not skip heading levels.
- Meet 44-pixel public target size with `min-h-11` and, for icon-only controls, `min-w-11` at use sites only. Do not change component source.
- Preserve route content at 375, 768, and 1280 pixels without horizontal overflow. The 375-pixel layout must keep core navigation and auth links visible.
- Respect `prefers-reduced-motion: reduce` as defined in Section 6.
- Use text with any status color. Do not make meaning depend on color, icon, position, or motion alone.
- Do not add hydrated client behavior. The server-rendered public HTML remains usable when JavaScript is unavailable.

### Accepted Debt

| Item | Location | Why accepted | Owner / Exit |
| --- | --- | --- | --- |
