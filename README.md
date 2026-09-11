# deployz-website

Marketing site, documentation, and blog for Deployz — https://deployz.dev.
Built with Astro, Tailwind CSS, React, and standard shadcn/ui components. The output is fully static and does not hydrate React in the browser.

## Develop

```
npm install
npm run dev
```

Local preview: http://localhost:4321

## Verify

```text
npm run check
npm run build
npm run test:e2e
```

The browser tests run the production preview at mobile, tablet, and desktop viewport sizes.

## Deploy on Cloudflare (Workers static assets)

```
npm run deploy
```

`wrangler.jsonc` serves `dist/` as a Worker named `deployz-website` on
https://deployz-website.thapi.workers.dev, with a custom domain route for `deployz.dev`.

Notes:

- The `deployz.dev` custom domain attach fails with error 100117 until the existing
  root A/AAAA DNS records for `deployz.dev` are deleted (a previous site serves there
  now). Delete them in the Cloudflare dashboard, then run `npm run deploy` again.
- Resource tag `project=deployz` on the Worker requires an API token with Tag edit
  permission (`wrangler login` OAuth cannot call the Tagging API):
  `PUT /accounts/<account_id>/tags` with `resource_type=worker`,
  `resource_id=deployz-website`, `tags={"project":"deployz"}`.
