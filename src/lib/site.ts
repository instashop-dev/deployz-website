// Product destinations shared by every page. Every "Get Started Free" button uses SIGNUP_URL.
export const SIGNUP_URL = 'https://app.deployz.dev/sign-up';
export const LOGIN_URL = 'https://app.deployz.dev/sign-in';
export const SUPPORT_EMAIL = 'help@deployz.dev';
export const CTA_LABEL = 'Get Started Free';

// The documentation is a separate Mintlify site. Cloudflare serves it on deployz.dev/docs, so this
// build has no /docs pages. Use the Mintlify canonical form: no trailing slash. Mintlify publishes
// its own sitemap (https://deployz.dev/docs/sitemap.xml).
export const DOCS_URL = '/docs';
export const DOCS_REQUIREMENTS_URL = '/docs/prepare/requirements';
export const DOCS_API_PIPELINE_URL = '/docs/api/pipeline';

// Published prices (USD per month). The pricing page, its estimator, and the FAQs read these.
export const BASE_PRICE = 49;
export const ENVIRONMENT_PRICE = 19;
