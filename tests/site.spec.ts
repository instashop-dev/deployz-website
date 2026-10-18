import { mkdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { AxeBuilder } from '@axe-core/playwright';
import { expect, test, type Page, type TestInfo } from '@playwright/test';

const baselineOnly = process.env.SITE_CONTRACT_MODE === 'baseline';

const routes = [
  { path: '/', label: 'home' },
  { path: '/how-it-works', label: 'how-it-works' },
  { path: '/security', label: 'security' },
  { path: '/pricing', label: 'pricing' },
  { path: '/use-cases', label: 'use-cases' },
  { path: '/about', label: 'about' },
  { path: '/byoc-deployments', label: 'byoc-deployments' },
  { path: '/deploy-saas-to-customer-aws', label: 'deploy-saas-to-customer-aws' },
  { path: '/privacy', label: 'privacy' },
  { path: '/terms', label: 'terms' },
  { path: '/gdpr', label: 'gdpr' },
  { path: '/dpa', label: 'dpa' },
  { path: '/blog', label: 'blog' },
  { path: '/docs', label: 'docs' },
  { path: '/404', label: 'not-found' },
] as const;
type Route = (typeof routes)[number];
type EvidenceRoute = Route | { readonly path: '/does-not-exist'; readonly label: 'unknown' };

const SIGNUP_URL = 'https://app.deployz.dev/sign-up';
const LOGIN_URL = 'https://app.deployz.dev/sign-in';
const CTA_LABEL = 'Get Started Free';

const pageTitles = [
  { path: '/', title: 'Deployz — Deploy Your SaaS Into Customer AWS' },
  { path: '/how-it-works', title: 'How Deployz Works — From GitHub to Customer AWS' },
  { path: '/use-cases', title: 'Deployz Use Cases — Deploying Into Customer AWS' },
  { path: '/about', title: 'About Deployz — Customer-Hosted Deployment for Small Teams' },
  { path: '/byoc-deployments', title: 'BYOC Deployments for SaaS on AWS — Deployz' },
  { path: '/deploy-saas-to-customer-aws', title: "Deploy Your SaaS Into a Customer's AWS Account — Deployz" },
  { path: '/pricing', title: 'Deployz Pricing — $49/month + $19 per Customer Environment' },
  { path: '/security', title: 'Deployz Security & Architecture — Customer AWS' },
] as const;

async function recordRouteEvidence(
  page: Page,
  testInfo: TestInfo,
  route: EvidenceRoute,
  status: number | undefined,
): Promise<void> {
  const headingCount = await page.locator('h1').count();
  const evidenceDirectory = process.env.SITE_EVIDENCE_DIR;

  if (!evidenceDirectory) {
    console.log(`route=${route.path} status=${status} h1=${headingCount} url=${page.url()}`);
    return;
  }

  await mkdir(evidenceDirectory, { recursive: true });
  const screenshotPath = join(evidenceDirectory, `${testInfo.project.name}-${route.label}.png`);
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log(`route=${route.path} status=${status} h1=${headingCount} url=${page.url()} screenshot=${screenshotPath}`);
}

test.describe('baseline route smoke', () => {
  for (const route of routes) {
    test(`${route.label} renders one page heading`, async ({ page }, testInfo) => {
      const response = await page.goto(route.path);

      expect(response).not.toBeNull();
      expect(response?.status()).toBeLessThan(500);
      await expect(page.locator('h1')).toHaveCount(1);
      await recordRouteEvidence(page, testInfo, route, response?.status());
    });
  }

  test('an unknown route returns Astro preview not-found output', async ({ page }, testInfo) => {
    const response = await page.goto('/does-not-exist');

    expect(response).not.toBeNull();
    expect(response?.status()).toBe(404);
    await expect(page.locator('h1')).toHaveCount(1);
    await recordRouteEvidence(page, testInfo, { path: '/does-not-exist', label: 'unknown' }, response?.status());
  });
});

test.describe('public design-system contract', () => {
  test.skip(baselineOnly, 'The baseline run isolates current route behavior.');

  test('keeps heading levels in a logical order', async ({ page }) => {
    for (const route of routes) {
      await page.goto(route.path);
      const levels = await page.locator('h1, h2, h3, h4, h5, h6').evaluateAll((headings) =>
        headings.map((heading) => Number(heading.tagName.slice(1))),
      );

      expect(levels.length).toBeGreaterThan(0);
      expect(levels[0]).toBe(1);
      for (let index = 1; index < levels.length; index += 1) {
        expect(levels[index]).toBeLessThanOrEqual(levels[index - 1] + 1);
      }
    }
  });

  test('provides named landmarks and a keyboard skip link', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('header')).toHaveCount(1);
    await expect(page.getByRole('navigation', { name: /primary/i })).toHaveCount(1);
    await expect(page.locator('main#main-content')).toHaveCount(1);
    await expect(page.locator('footer')).toHaveCount(1);

    const skipLink = page.locator('a[href="#main-content"]');
    await page.keyboard.press('Tab');
    await expect(skipLink).toBeFocused();
    await expect(skipLink).toBeVisible();
  });

  test('marks the current primary navigation link', async ({ page }) => {
    for (const route of ['/how-it-works/', '/pricing/'] as const) {
      await page.goto(route);
      const navigation = page.getByRole('navigation', { name: /primary/i });
      await expect(navigation.locator(`a[href="${route}"]`)).toHaveAttribute('aria-current', 'page');
    }
  });

  test('uses the product authentication destinations', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('header a', { hasText: 'Log In' })).toHaveAttribute('href', LOGIN_URL);
    await expect(page.locator('footer').getByRole('link', { name: 'Log In' })).toHaveAttribute('href', LOGIN_URL);
    // Security, Use Cases, and About are footer-only links.
    for (const href of ['/security/', '/use-cases/', '/about/']) {
      await expect(page.getByRole('navigation', { name: /primary/i }).locator(`a[href="${href}"]`)).toHaveCount(0);
      await expect(page.locator(`footer a[href="${href}"]`)).toHaveCount(1);
    }
    for (const href of ['/privacy/', '/terms/', '/gdpr/', '/dpa/']) {
      await expect(page.locator(`footer a[href="${href}"]`)).toHaveCount(1);
    }
  });

  test('sets the approved title, description, and canonical URL on each core page', async ({ page }) => {
    for (const { path, title } of pageTitles) {
      await page.goto(path);

      await expect(page).toHaveTitle(title);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /\S/);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', new URL(path === '/' ? path : `${path}/`, 'https://deployz.dev').href);
    }
  });

  test('sends every Get Started Free call to action to the sign-up page', async ({ page }) => {
    for (const { path } of pageTitles) {
      await page.goto(path);
      const actions = page.locator(`a:text-is("${CTA_LABEL}")`);

      expect(await actions.count(), path).toBeGreaterThan(1);
      for (const action of await actions.all()) {
        await expect(action).toHaveAttribute('href', SIGNUP_URL);
      }
      await expect(page.getByRole('link', { name: /check my application/i })).toHaveCount(0);
    }
  });

  test('keeps the approved homepage heading and section count', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('h1')).toHaveText('Deploy into customer AWS');
    await expect(page.locator('main > section')).toHaveCount(7);
    // No pricing preview on the homepage.
    await expect(page.locator('main')).not.toContainText('$49');
  });

  test('has no editorial markers or unverified claims', async ({ page }) => {
    for (const route of routes) {
      await page.goto(route.path);
      const text = await page.locator('body').innerText();

      expect(text, route.path).not.toMatch(/\[(VERIFY|CONDITIONAL)\]|one-click|zero access|least privilege|works with any app|unlimited free/i);
      // Never claim a completed Deployz SOC 2 audit.
      expect(text, route.path).not.toMatch(/Deployz is SOC 2|SOC 2 (certified|compliant)\b(?!\?)|Deployz (is|has been) audited/i);
    }
  });

  test('switches product preview tabs with the mouse and the keyboard', async ({ page }) => {
    await page.goto('/');
    const tabs = page.getByRole('tab');
    await expect(tabs).toHaveCount(3);
    await expect(page.getByRole('tabpanel')).toHaveCount(1);
    await expect(page.getByRole('tabpanel')).toContainText('See what passed');

    await page.getByRole('tab', { name: 'Manage' }).click();
    await expect(page.getByRole('tab', { name: 'Manage' })).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('tabpanel')).toContainText('release updates');

    await page.getByRole('tab', { name: 'Manage' }).focus();
    await page.keyboard.press('ArrowLeft');
    await expect(page.getByRole('tab', { name: 'Deploy' })).toBeFocused();
    await expect(page.getByRole('tabpanel')).toContainText('deployment progress');
    await page.keyboard.press('Home');
    await expect(page.getByRole('tab', { name: 'Configure' })).toHaveAttribute('aria-selected', 'true');
  });

  test('opens and closes FAQ answers', async ({ page }) => {
    await page.goto('/');
    const question = page.locator('details').filter({ hasText: 'Does my customer need an AWS account?' });

    await expect(question).not.toHaveAttribute('open', '');
    await question.locator('summary').click();
    await expect(question).toHaveAttribute('open', '');
    await expect(question).toContainText('They do not need a Deployz account.');
    await question.locator('summary').click();
    await expect(question).not.toHaveAttribute('open', '');
  });

  test('estimates the monthly Deployz charge', async ({ page }) => {
    await page.goto('/pricing');
    const slider = page.getByLabel('Billable customer environments');
    const total = page.locator('[data-estimator-total]');

    await expect(slider).toHaveValue('3');
    await expect(total).toHaveText('$106');
    // The estimate assumes an active subscription: the $49 base stays at zero environments.
    for (const [value, expected] of [['0', '$49'], ['1', '$68'], ['10', '$239'], ['30', '$619']] as const) {
      await slider.fill(value);
      await expect(total).toHaveText(expected);
    }
    await slider.fill('3');
    await slider.focus();
    await page.keyboard.press('End');
    await expect(total).toHaveText('$619');
  });

  test('opens the mobile menu with the same destinations', async ({ page }) => {
    const viewport = page.viewportSize();
    test.skip(!viewport || viewport.width >= 1024, 'The menu button shows below 1024px.');
    await page.goto('/');
    const button = page.getByRole('button', { name: 'Menu' });

    await button.click();
    await expect(button).toHaveAttribute('aria-expanded', 'true');
    for (const name of ['How It Works', 'Pricing', 'Docs', 'Log In']) {
      await expect(page.locator('#site-menu').getByRole('link', { name, exact: true })).toBeVisible();
    }
    await page.keyboard.press('Escape');
    await expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  test('ships redirects, security headers, and robots rules', async () => {
    const [redirects, headers, robots] = await Promise.all(
      ['dist/_redirects', 'dist/_headers', 'dist/robots.txt'].map((file) => readFile(file, 'utf8')),
    );

    expect(redirects).toContain(`/get-started ${SIGNUP_URL} 301`);
    expect(redirects).toContain('/case-studies /use-cases/ 301');
    expect(redirects).toContain('/case-studies/ /use-cases/ 301');
    expect(redirects).toContain('/who-its-for /use-cases/ 301');
    expect(redirects).toContain('/who-its-for/ /use-cases/ 301');
    expect(redirects).toContain('/features /how-it-works/ 301');
    expect(redirects).toContain('/features/ /how-it-works/ 301');
    expect(headers).toMatch(/Content-Security-Policy:.*frame-ancestors 'none'/);
    expect(headers).toContain('X-Content-Type-Options: nosniff');
    // Cloudflare Web Analytics injects its beacon at the edge; the CSP must allow it.
    expect(headers).toMatch(/script-src[^;]*https:\/\/static\.cloudflareinsights\.com/);
    expect(headers).toMatch(/connect-src[^;]*https:\/\/cloudflareinsights\.com/);
    expect(robots).toContain('Sitemap: https://deployz.dev/sitemap-index.xml');
  });

  test('has no placeholder links or internal product-stage words', async ({ page }) => {
    for (const route of routes) {
      await page.goto(route.path);

      await expect(page.locator('a[href="#"], a[href=""], a:not([href])')).toHaveCount(0);
      await expect(page.locator('body')).not.toContainText(/(MVP|beta|early access|experimental|work in progress)/i);
    }
  });

  test('serves every brand icon that the page head and the web manifest reference', async ({ page, request }) => {
    await page.goto('/');
    const paths = await page
      .locator('link[rel~="icon"], link[rel="apple-touch-icon"], link[rel="mask-icon"], link[rel="manifest"]')
      .evaluateAll((links) => links.map((link) => new URL((link as HTMLLinkElement).href).pathname));
    const manifest = await (await request.get('/site.webmanifest')).json();
    paths.push(...manifest.icons.map((icon: { src: string }) => icon.src));

    expect(paths.length).toBeGreaterThan(0);
    for (const path of paths) {
      expect((await request.get(path)).status(), path).toBe(200);
    }
  });

  test('resolves every internal link', async ({ page, request }) => {
    const paths = new Set<string>();
    for (const route of routes) {
      await page.goto(route.path);
      const hrefs = await page.locator('a[href^="/"]').evaluateAll((links) =>
        links.map((link) => new URL((link as HTMLAnchorElement).href).pathname),
      );
      hrefs.forEach((href) => paths.add(href));
    }

    for (const path of paths) {
      expect((await request.get(path)).status(), path).toBe(200);
    }
  });

  test('shows a keyboard focus indicator on an auth action', async ({ page }) => {
    await page.goto('/');
    const primaryAction = page.getByRole('navigation', { name: /primary/i }).getByRole('link', { name: CTA_LABEL }).last();

    for (let index = 0; index < 12; index += 1) {
      await page.keyboard.press('Tab');
      if (await primaryAction.evaluate((element) => element === document.activeElement)) {
        break;
      }
    }

    await expect(primaryAction).toBeFocused();
    const hasVisibleFocus = await primaryAction.evaluate((element) => {
      const styles = getComputedStyle(element);
      return styles.outlineStyle !== 'none' || styles.boxShadow !== 'none';
    });
    expect(hasVisibleFocus).toBe(true);
  });

  test('uses the local Inter font stack', async ({ page }) => {
    await page.goto('/');
    const fontFamily = await page.locator('html').evaluate((element) => getComputedStyle(element).fontFamily);

    expect(fontFamily).toMatch(/inter/i);
  });

  test('has no serious or critical axe violations', async ({ page }) => {
    // One axe scan per route (about 1s each); parallel projects need more than the default 30s.
    test.setTimeout(90_000);
    for (const route of routes) {
      await page.goto(route.path);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze();
      const blockingViolations = results.violations.filter(
        (violation) => violation.impact === 'serious' || violation.impact === 'critical',
      );

      expect(blockingViolations, route.path).toEqual([]);
    }
  });

  test('does not overflow required responsive and zoom-equivalent widths', async ({ page }) => {
    const viewport = page.viewportSize();
    expect(viewport).not.toBeNull();

    for (const width of [viewport!.width, Math.ceil(viewport!.width / 2)]) {
      await page.setViewportSize({ width, height: Math.ceil(viewport!.height / 2) });
      for (const route of routes) {
        await page.goto(route.path);
        const overflow = await page.locator('body *').evaluateAll((elements) =>
          elements.flatMap((element) => {
            const bounds = element.getBoundingClientRect();
            if (bounds.left >= -1 && bounds.right <= window.innerWidth + 1) {
              return [];
            }

            return [{
              element: element.tagName.toLowerCase(),
              text: element.textContent?.trim().slice(0, 60),
              left: Math.round(bounds.left),
              right: Math.round(bounds.right),
              viewport: window.innerWidth,
            }];
          }),
        );
        expect(overflow, `${route.path} at ${width}px`).toEqual([]);
        await expect(page.getByRole('main')).toBeVisible();
      }
    }
  });

  test('keeps visible interactive targets at least 44 pixels high', async ({ page }) => {
    for (const route of routes) {
      await page.goto(route.path);
      const undersized = await page.locator('body a, body button').evaluateAll((elements) =>
        elements.flatMap((element) => {
          const bounds = element.getBoundingClientRect();
          const rendered = bounds.width > 0 || bounds.height > 0;
          if (!rendered || bounds.height >= 44) {
            return [];
          }

          return [{ text: element.textContent?.trim(), height: Math.round(bounds.height) }];
        }),
      );

      expect(undersized, route.path).toEqual([]);
    }
  });

  test('respects reduced-motion preferences', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    await expect
      .poll(() => page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches))
      .toBe(true);
    const longestTransition = await page.evaluate(() => {
      const durations = [...document.querySelectorAll('*')].flatMap((element) =>
        getComputedStyle(element).transitionDuration.split(',').map((duration) => duration.trim()),
      );
      return Math.max(
        0,
        ...durations.map((duration) =>
          duration.endsWith('ms') ? Number.parseFloat(duration) : Number.parseFloat(duration) * 1_000,
        ),
      );
    });

    expect(longestTransition).toBeLessThanOrEqual(10);
  });

  test('has no browser console or page errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') {
        errors.push(message.text());
      }
    });
    page.on('pageerror', (error) => errors.push(error.message));

    for (const route of routes) {
      await page.goto(route.path);
    }

    expect(errors).toEqual([]);
  });

  test('ships static HTML without hydrated Astro or React output', async () => {
    const files = [
      'dist/index.html',
      'dist/how-it-works/index.html',
      'dist/security/index.html',
      'dist/pricing/index.html',
      'dist/use-cases/index.html',
      'dist/about/index.html',
      'dist/byoc-deployments/index.html',
      'dist/deploy-saas-to-customer-aws/index.html',
      'dist/privacy/index.html',
      'dist/terms/index.html',
      'dist/gdpr/index.html',
      'dist/dpa/index.html',
      'dist/blog/index.html',
      'dist/docs/index.html',
      'dist/404.html',
    ] as const;
    const output = await Promise.all(files.map(async (file) => readFile(file, 'utf8')));

    for (const html of output) {
      expect(html).not.toMatch(/<astro-island\b/i);
      expect(html).not.toMatch(/(?:@astrojs\/react|react-dom|client:(?:load|idle|visible|media|only))/i);
      expect(html).not.toMatch(/<script\b[^>]*(?:type=["']module["']|data-astro-(?:rerun|exec))/i);
    }
  });
});
