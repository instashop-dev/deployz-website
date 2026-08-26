# deployz-website

Marketing site, documentation, and blog for Deployz — https://deployz.dev.
Built with Astro. Fully static output.

## Develop

```
npm install
npm run dev
```

Local preview: http://localhost:4321

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
