import { mkdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { AxeBuilder } from '@axe-core/playwright';
import { expect, test, type Page, type TestInfo } from '@playwright/test';

const baselineOnly = process.env.SITE_CONTRACT_MODE === 'baseline';

const routes = [
  { path: '/', label: 'home' },
  { path: '/blog', label: 'blog' },
  { path: '/docs', label: 'docs' },
  { path: '/404', label: 'not-found' },
] as const;
type Route = (typeof routes)[number];
type EvidenceRoute = Route | { readonly path: '/does-not-exist'; readonly label: 'unknown' };

const authLinks = [
  { name: 'Sign in', href: 'https://app.deployz.dev/sign-in' },
  { name: 'Sign up', href: 'https://app.deployz.dev/sign-up' },
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
    for (const route of ['/blog', '/docs'] as const) {
      await page.goto(route);
      const navigation = page.getByRole('navigation', { name: /primary/i });
      await expect(navigation.locator(`a[href="${route}"]`)).toHaveAttribute('aria-current', 'page');
    }
  });

  test('uses the product authentication destinations', async ({ page }) => {
    await page.goto('/');

    for (const authLink of authLinks) {
      await expect(page.getByRole('link', { name: authLink.name })).toHaveAttribute('href', authLink.href);
    }
  });

  test('shows a keyboard focus indicator on an auth action', async ({ page }) => {
    await page.goto('/');
    const signUp = page.getByRole('link', { name: 'Sign up' });

    for (let index = 0; index < 12; index += 1) {
      await page.keyboard.press('Tab');
      if (await signUp.evaluate((element) => element === document.activeElement)) {
        break;
      }
    }

    await expect(signUp).toBeFocused();
    const hasVisibleFocus = await signUp.evaluate((element) => {
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
          if (bounds.height >= 44) {
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
    const files = ['dist/index.html', 'dist/blog/index.html', 'dist/docs/index.html', 'dist/404.html'] as const;
    const output = await Promise.all(files.map(async (file) => readFile(file, 'utf8')));

    for (const html of output) {
      expect(html).not.toMatch(/<astro-island\b/i);
      expect(html).not.toMatch(/(?:@astrojs\/react|react-dom|client:(?:load|idle|visible|media|only))/i);
      expect(html).not.toMatch(/<script\b[^>]*(?:type=["']module["']|data-astro-(?:rerun|exec))/i);
    }
  });
});
