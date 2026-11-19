// Shared SEO data: the site URL, the default social image, and structured data builders.
import { BASE_PRICE, ENVIRONMENT_PRICE, SUPPORT_EMAIL } from '@/lib/site';

export const SITE_URL = 'https://deployz.dev';

/** Social preview images are 1200 × 630 PNG files in public/og/ (made by scripts/og-images.mjs). */
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;
export const DEFAULT_OG_IMAGE = '/og/default.png';
export const DEFAULT_OG_IMAGE_ALT = 'Deployz: deploy your SaaS into customer AWS accounts';

export interface Crumb {
  name: string;
  path: string;
}

const absolute = (path: string) => new URL(path, SITE_URL).href;

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;

/*
 * Organization and WebSite data for the home page.
 * Add `sameAs` only when the site links to a real company profile (see docs/SEO_PLAN.md, section 5, /about/).
 */
export function homeStructuredData() {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': ORGANIZATION_ID,
      name: 'Deployz',
      url: absolute('/'),
      logo: absolute('/android-chrome-512x512.png'),
      email: SUPPORT_EMAIL,
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: SUPPORT_EMAIL,
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: 'Deployz',
      url: absolute('/'),
      publisher: { '@id': ORGANIZATION_ID },
    },
  ];
}

/*
 * SoftwareApplication data for the pricing page. The prices come from src/lib/site.ts,
 * the same constants that the pricing page copy uses. Do not add ratings or reviews
 * until real, published reviews exist.
 */
export function pricingStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Deployz',
    url: absolute('/'),
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web',
    description: `Deploy your SaaS into your customers' AWS accounts. $${BASE_PRICE} a month plus $${ENVIRONMENT_PRICE} a month per billable customer environment.`,
    publisher: { '@type': 'Organization', '@id': ORGANIZATION_ID, name: 'Deployz', url: absolute('/') },
    offers: {
      '@type': 'Offer',
      url: absolute('/pricing/'),
      price: BASE_PRICE,
      priceCurrency: 'USD',
      priceSpecification: [
        {
          '@type': 'UnitPriceSpecification',
          name: 'Base subscription',
          price: BASE_PRICE,
          priceCurrency: 'USD',
          unitCode: 'MON',
          unitText: 'MONTH',
        },
        {
          '@type': 'UnitPriceSpecification',
          name: 'Each billable customer environment',
          price: ENVIRONMENT_PRICE,
          priceCurrency: 'USD',
          unitCode: 'MON',
          unitText: 'MONTH',
        },
      ],
    },
  };
}

/** BreadcrumbList data: Home, then each crumb in order. */
export function breadcrumbStructuredData(crumbs: Crumb[]) {
  const trail = [{ name: 'Home', path: '/' }, ...crumbs];
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: absolute(crumb.path),
    })),
  };
}

/** Serializes JSON-LD for a script tag. "<" is escaped so that no string can close the tag. */
export function toJsonLd(data: object): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
