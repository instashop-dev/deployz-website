# Claims and review

Evidence date: 17 November 2026. Product copy is based on local website source files. The public pricing, security, and process pages returned HTTP 200 on that date. The live pricing page contained USD 49 and USD 19 plan amounts. Three signed-in app views were captured. Deployment behavior was not tested for this kit.

## Claim sources

| Claim | Local source | Required detail |
| --- | --- | --- |
| Deployment into customer AWS | `../src/pages/index.astro` | AWS is the current supported cloud |
| Read-only GitHub access and advisory readiness report | `../src/pages/how-it-works.astro` | The report can miss code behavior; the vendor fixes code |
| Customer installation link and AWS approval | `../src/pages/how-it-works.astro` | No customer Deployz account; email verification and connector approval are required |
| One image and supported services | `../src/pages/how-it-works.astro` | Linux x86-64, HTTP service, same-image workers, new VPC |
| Release selection and rollbacks | `../src/pages/security.astro` | Updates are started by the vendor; rollbacks do not reverse database migrations |
| Customer owns resources and pays AWS | `../src/pages/index.astro` | Deployz fees are separate |
| Free evaluation | `../src/pages/pricing.astro` | One active test deployment per app in own AWS; AWS charges still apply |
| USD 49 base and USD 19 per billable environment | `../src/lib/site.ts`, `../src/pages/pricing.astro` | Subscriptions start at USD 68/month and bill at least one customer environment; AWS costs are separate |
| Data and metadata boundaries | `../src/pages/security.astro` | Deployment metadata reaches Deployz; code, builds, secrets, and routing have separate paths |
| No completed Deployz SOC 2 audit | `../src/pages/security.astro` | AWS and Cloudflare reports do not certify Deployz |
| Signup URL and support address | `../src/lib/site.ts` | Check links before publication |
| Brand colors and font | `../src/styles/globals.css` | White, near-black, blue #2563eb, Inter |

## Statements to avoid

- “All data stays in customer AWS.” App integrations, model APIs, builds, metadata, secrets, and proxy routing need separate explanations.
- “Deployz cannot access anything in AWS.” The connector can create and manage resources with the approved permissions.
- “Deployz is SOC 2 certified.” It has not completed its own audit.
- “Works with any app.” The supported architecture has clear limits.
- “Free AWS hosting.” The evaluation is free; AWS charges apply.
- “Instant deployment” or fixed setup times. No measured time is available for this kit.
- “Zero lock-in.” Default URLs and image pulls have Deployz dependencies.
- Guaranteed revenue, cost savings, uptime, compliance, or customer results. No evidence for those claims is included.

## Details for technical conversations

Builds run in Deployz's AWS account. AI may read redacted repository excerpts. The rule-based compiler creates infrastructure through the approved connector.

Deployz stores secrets encrypted before delivery to customer Secrets Manager. Values shared across customers remain encrypted in Deployz.

The default deployz.dev app URL uses the Deployz proxy on Cloudflare. Custom domains route directly to the customer's load balancer. New app tasks need the Deployz image registry.

Environment removal retains the database, its credentials, and S3 bucket. These can continue to cause AWS charges. Data deletion is a separate step.

Billable environment rules include readiness and connector status. Use the full pricing page for billing questions. Do not reduce these rules to “pay only while the app runs.”

## Review before release

1. Confirm that the described steps work in the current app.
2. Confirm prices and evaluation terms.
3. Open each public destination link.
4. Check that each claim matches its source and includes relevant limits.
5. Remove placeholders and all sensitive data from captures.
6. Check captions, text size, spelling, and one clear call to action.
7. Record the owner, release date, final URL, and status in the tracker.

If a product statement changes, update the source website and all affected marketing drafts together.

## Source differences

The app's `docs/product/mvp-scope.md` also lists SQS and scheduling as preview capabilities. This pack keeps the main message on the core supported architecture. It does not promote preview capabilities as general support. That document contains older billing-provider and sizing text that differs from the website and live UI. No payment-provider claim or fixed capacity claim is included in the sales copy.

## Pricing update before merge

The latest main branch adds the USD 68/month subscription minimum and a minimum of one billable customer environment. All pricing copy, the product sheet, FAQ, pricing graphics, sales deck, and video narration now include this rule. The current website names Polar as merchant of record. This pack makes no payment-provider claim.
