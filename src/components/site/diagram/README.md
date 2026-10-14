# Diagram system

Every explanatory diagram uses one grammar. Styles: `src/styles/diagrams.css`. Rules: DESIGN.md section 7.

| Part | Class / component | Use |
| --- | --- | --- |
| Root | `<figure class="dg">` | Inline-size container named `dg`. Layout follows the figure width, not the viewport. |
| Flow | `.dg-flow` | Nodes and connectors. Vertical below 760px container width, horizontal above. Set `--dg-cols` for the tracks. |
| Node | `.dg-node` | White card, 12px radius, 20/24px padding. |
| Deployz node | `.dg-node-brand` | The one Deployz-controlled node. Blue tint, never solid blue. |
| Boundary | `.dg-boundary` | An AWS account or other ownership boundary. |
| Item | `.dg-chip`, `.dg-chip-strong`, `.dg-chip-brand`, `.dg-chip-meta` | Resources or small items inside a node. |
| Text | `.dg-role`, `.dg-title`, `.dg-text`, `.dg-rows` | 12px label with a 16px icon, 16px title, 14px text, hairline rows. |
| Tree | `.dg-tree` | Resources that hang from a parent chip. |
| Connector | `Connector.astro` | `variant="brand"` for the single Deployz-controlled connector, `variant="blocked"` for a connection that does not exist, `reverse` to point up or left. |
| Caption | `.dg-caption` | Visible caption under the figure. |

Rules:

- At most one blue connector and one blue node in a diagram.
- Connectors are `aria-hidden`. Give the figure a caption (visible or `sr-only`) that states the relationships.
- Text comes from verified product behavior and existing site copy. No invented metrics, logos, or screens.
- Icons: Lucide (rendered at build time), 16px, `strokeWidth={1.75}`, only in `.dg-role`.
- No animation, no shadows, no gradients.
