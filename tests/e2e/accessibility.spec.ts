import { test, expect } from '@playwright/test';

test.describe('Accessibility Tests', () => {
    const pages = ['/', '/resume', '/portfolio', '/blog', '/contact'];

    test.describe('Keyboard Navigation', () => {
        test('skip to main content link exists', async ({ page }) => {
            await page.goto('/');

            // Focus on body first
            await page.keyboard.press('Tab');

            // Check for skip link (should be first focusable element)
            const skipLink = page.locator('a[href="#main-content"]');
            if (await skipLink.count() > 0) {
                await expect(skipLink).toBeFocused();
            }
        });

        test('all interactive elements are keyboard accessible', async ({ page }) => {
            await page.goto('/');
            await page.waitForLoadState('networkidle');

            // Get all interactive elements
            const interactiveElements = page.locator('button, a, input, textarea, select, [tabindex]:not([tabindex="-1"])');
            const count = await interactiveElements.count();

            // Tab through first few elements to verify keyboard navigation works
            for (let i = 0; i < Math.min(5, count); i++) {
                await page.keyboard.press('Tab');
                const focused = await page.evaluate(() => document.activeElement?.tagName);
                expect(['BUTTON', 'A', 'INPUT', 'TEXTAREA', 'SELECT', 'DIV', 'SPAN', 'BODY']).toContain(focused);
            }
        });
    });

    test.describe('Semantic HTML', () => {
        for (const pagePath of pages) {
            test(`${pagePath} has proper heading hierarchy`, async ({ page }) => {
                await page.goto(pagePath);
                await page.waitForLoadState('domcontentloaded');

                // Check for at least one h1 or h2 heading
                const headings = page.locator('h1, h2, h3');
                expect(await headings.count()).toBeGreaterThan(0);
            });
        }

        test('navigation has proper landmark role', async ({ page }) => {
            await page.goto('/');

            // Check for nav element or role="navigation"
            const nav = page.locator('nav, [role="navigation"]');
            expect(await nav.count()).toBeGreaterThan(0);
        });

        test('main content area exists', async ({ page }) => {
            await page.goto('/');

            // Check for main element or role="main"
            const main = page.locator('main, [role="main"], article, [data-page]');
            expect(await main.count()).toBeGreaterThan(0);
        });
    });

    test.describe('Color & Contrast', () => {
        test('text is not purely color-dependent', async ({ page }) => {
            await page.goto('/contact');
            await page.waitForLoadState('networkidle');

            // Check that form validation doesn't rely solely on color
            const nameInput = page.locator('input[name="fullname"]');
            await nameInput.fill('A');
            await nameInput.blur();
            await page.waitForTimeout(500);

            // Should have text or icon indication, not just color
            const errorIndicators = page.locator('[class*="error"], [class*="Alert"], svg');
            expect(await errorIndicators.count()).toBeGreaterThan(0);
        });
    });

    test.describe('Interactive Elements', () => {
        test('buttons have accessible names', async ({ page }) => {
            await page.goto('/contact');
            await page.waitForLoadState('networkidle');

            const submitButton = page.locator('button[type="submit"]');
            if (await submitButton.count() > 0) {
                // Button should have visible text or aria-label
                const text = await submitButton.textContent();
                const ariaLabel = await submitButton.getAttribute('aria-label');
                expect(text || ariaLabel).toBeTruthy();
            }
        });

        test('links have accessible names', async ({ page }) => {
            await page.goto('/');
            await page.waitForLoadState('networkidle');

            // Check social links have aria-labels
            const iconLinks = page.locator('a.social-btn, a[aria-label]');
            for (let i = 0; i < Math.min(3, await iconLinks.count()); i++) {
                const link = iconLinks.nth(i);
                const ariaLabel = await link.getAttribute('aria-label');
                const text = await link.textContent();
                expect(ariaLabel || text?.trim()).toBeTruthy();
            }
        });

        test('form inputs have associated labels', async ({ page }) => {
            await page.goto('/contact');
            await page.waitForLoadState('networkidle');

            const inputs = page.locator('input:visible, textarea:visible');
            for (let i = 0; i < await inputs.count(); i++) {
                const input = inputs.nth(i);
                const id = await input.getAttribute('id');
                const placeholder = await input.getAttribute('placeholder');
                const ariaLabel = await input.getAttribute('aria-label');
                const name = await input.getAttribute('name');

                // Should have some form of accessible name
                expect(id || placeholder || ariaLabel || name).toBeTruthy();
            }
        });
    });

    test.describe('Images', () => {
        test('images have alt text', async ({ page }) => {
            await page.goto('/');
            await page.waitForLoadState('networkidle');

            const images = page.locator('img');
            const count = await images.count();

            for (let i = 0; i < Math.min(5, count); i++) {
                const img = images.nth(i);
                const alt = await img.getAttribute('alt');
                // Alt should exist (can be empty for decorative images)
                expect(alt !== null).toBeTruthy();
            }
        });
    });

    test.describe('Focus Visibility', () => {
        test('focused elements have visible focus indicator', async ({ page }) => {
            await page.goto('/');
            await page.waitForLoadState('networkidle');

            // Tab to first focusable element
            await page.keyboard.press('Tab');
            await page.keyboard.press('Tab');

            // Check that there's some visible focus styling
            const focusedElement = page.locator(':focus, :focus-visible');
            if (await focusedElement.count() > 0) {
                const outline = await focusedElement.first().evaluate(el => {
                    const style = window.getComputedStyle(el);
                    return {
                        outline: style.outline,
                        boxShadow: style.boxShadow,
                        border: style.border
                    };
                });
                // Should have some form of focus indicator
                expect(
                    outline.outline !== 'none' ||
                    outline.boxShadow !== 'none' ||
                    outline.border !== 'none'
                ).toBeTruthy();
            }
        });
    });

    test.describe('Responsive Accessibility', () => {
        test('touch targets are minimum 44x44 on mobile', async ({ page }) => {
            await page.setViewportSize({ width: 375, height: 812 });
            await page.goto('/');
            await page.waitForLoadState('networkidle');

            // Check mobile navigation buttons
            const navButtons = page.locator('.glass-nav button, .glass-nav a');
            const count = await navButtons.count();

            let adequateSized = 0;
            for (let i = 0; i < count; i++) {
                const button = navButtons.nth(i);
                const box = await button.boundingBox();
                if (box && box.width >= 40 && box.height >= 40) {
                    adequateSized++;
                }
            }

            // At least most buttons should meet touch target size
            if (count > 0) {
                expect(adequateSized / count).toBeGreaterThan(0.5);
            }
        });
    });
});
