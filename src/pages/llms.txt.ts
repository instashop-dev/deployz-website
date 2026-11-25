import type { APIContext } from 'astro';
import { getVisiblePosts, isPublished } from '@/lib/blog';
import { postIndexLine } from '@/lib/llms';
import { BASE_PRICE, DOCS_URL, ENVIRONMENT_PRICE, SUPPORT_EMAIL } from '@/lib/site';

/*
 * /llms.txt (https://llmstxt.org): a short Markdown map of the site for AI assistants.
 * It repeats only facts that the site pages state. The prices come from src/lib/site.ts.
 * The Mintlify docs publish their own file at /docs/llms.txt.
 */
export async function GET({ site }: APIContext) {
  const posts = (await getVisiblePosts()).filter((post) => isPublished(post));
  const abs = (path: string) => new URL(path, site).href;
  const text = `# Deployz

> Deployz helps software vendors deploy their application into their customers' AWS accounts. The vendor connects GitHub, configures the application, and sends the customer an install link. The customer approves the Deployz connector in their own AWS account, and the application runs there. AWS is the supported cloud.

Pricing: $${BASE_PRICE} a month plus $${ENVIRONMENT_PRICE} a month for each billable customer environment. AWS charges are separate. Support: ${SUPPORT_EMAIL}.

## Product

- [How Deployz works](${abs('/how-it-works/')}): from GitHub to a customer's AWS account, step by step.
- [Security and architecture](${abs('/security/')}): what the connector can do, and what data reaches Deployz.
- [Pricing](${abs('/pricing/')}): plan prices, billable environments and the free evaluation.
- [Use cases](${abs('/use-cases/')}): who uses customer-hosted deployment, and why.
- [BYOC deployments on AWS](${abs('/byoc-deployments/')}): bring-your-own-cloud delivery for SaaS.
- [Deploy SaaS into a customer's AWS account](${abs('/deploy-saas-to-customer-aws/')}): the customer-hosted path.

## Documentation

- [Deployz documentation](${abs(DOCS_URL)}): requirements, guides, troubleshooting and the vendor API.
- [Documentation index for AI assistants](${abs(`${DOCS_URL}/llms.txt`)})

## Blog

${posts.map((post) => postIndexLine(post, site!)).join('\n') || '- No articles are published yet.'}

## Optional

- [Full text of all blog articles](${abs('/llms-full.txt')})
- [About Deployz](${abs('/about/')})
`;
  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
