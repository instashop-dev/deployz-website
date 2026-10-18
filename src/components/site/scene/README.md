# Scene system (illustrations v2)

Product-grade illustrations in one visual language: "blueprint precision". Styles: `src/styles/scene.css`. Reference implementation: `src/components/site/DeploymentDiagram.astro` (home hero).

| Part | Class / component | Use |
| --- | --- | --- |
| Root | `<figure class="sc">` | Inline-size container named `sc`. Layout follows the figure width. |
| Stage | `.sc-stage` (`.sc-stage-plain` without the cobalt light) | 16px frame with a dot grid that fades to the edges and a faint cobalt light behind the focal point. |
| Flow | `.sc-flow` | Cards and beams. Vertical (max 440px, centered) below 960px container width, horizontal above. Set `--sc-cols`. |
| Card | `.sc-card`, `.sc-card-brand` | White card with layered soft depth. The brand card has a cobalt ring and glow: the one Deployz focal point. |
| Card parts | `.sc-head` (+ `.sc-head-title` with `<small>`), `.sc-body`, `.sc-foot` | Header row with an icon tile, body, subtle footer. |
| Icon tile | `.sc-icon`, `-brand`, `-dark`, `-sm` | 28px (22px small) rounded tile with a 16px Lucide icon, the Deployz mark, or the GitHub mark. |
| Tokens | `.sc-mono`, `.sc-label`, `.sc-kv` | Monospace for real technical tokens (repo, branch, commit, region, version, paths). Key/value rows. |
| Status | `.sc-badge`, `-live`, `-brand`, `-warn`, `.sc-dot`, `.sc-dot-pulse` | Pills. Green "Live" only for a live state. |
| Checks | `.sc-checks` + `Mark.astro` (`done`, `warn`, `brand`, `idle`) | Checklists with a state mark. |
| Progress | `.sc-progress > span[style=width]` | 4px cobalt bar. |
| Fake control | `.sc-btn`, `.sc-btn-dark` | Non-interactive span that looks like a product button. |
| Boundary | `.sc-boundary` + `.sc-boundary-tag` | Dashed AWS account (or VPC) boundary with its label on the top border. |
| Resources | `.sc-tiles` > `.sc-tile` (+ `.sc-tile-text`) | Small resource tiles with an icon. |
| Beam | `Beam.astro` | Connector with a travelling light, ports at both ends, and a mono label chip on the line. `variant="brand"` (the Deployz path), `neutral`, `blocked` (dashed, crossed chip). `reverse`, `delay`. |
| Lanes | `.sc-lanes` | Two parallel beams between the same parts. |

Rules:

- Text and labels must match verified product behavior (real UI labels, real AWS services). Example values (repo name, commit, version, region) are clearly illustrative.
- The whole stage is `aria-hidden="true"`; the figure has an `sr-only` (or visible) `figcaption` that states what the scene shows.
- One brand card and one brand beam per scene. Green only for live or passed states.
- Motion: the beam light, the live pulse, and one small state loop per card. All of it stops under `prefers-reduced-motion`.
- No images, no new libraries, no scripts.
