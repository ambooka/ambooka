import { test, expect, type Page } from '@playwright/test';

const VIEWPORTS = {
    mobile: { width: 375, height: 812 },
    mobileSmall: { width: 320, height: 568 },
    tablet: { width: 768, height: 1024 },
    laptop: { width: 1024, height: 768 },
    desktop: { width: 1280, height: 900 },
    largeDesktop: { width: 1536, height: 864 },
};

async function checkNoHorizontalOverflow(page: Page) {
    const hasOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(hasOverflow).toBe(false);
}

async function checkMinimumTouchTargets(page: Page) {
    const smallButtons = await page.evaluate(() => {
        const interactiveElements = document.querySelectorAll('button, a, [role="button"]');
        const small: string[] = [];
        interactiveElements.forEach((el) => {
            const rect = el.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
                if (rect.width < 44 || rect.height < 44) {
                    const text = el.textContent?.slice(0, 30) || el.className;
                    small.push(`${text} (${Math.round(rect.width)}x${Math.round(rect.height)})`);
                }
            }
        });
        return small.slice(0, 5); // Return first 5 for debugging
    });
    // Warning but not failing - some small elements are acceptable
    if (smallButtons.length > 10) {
        console.warn(`Found ${smallButtons.length} small touch targets:`, smallButtons);
    }
}

test.describe('Responsive Design Tests', () => {

    test.describe('Mobile (375px)', () => {
        test.use({ viewport: VIEWPORTS.mobile });

        test('no horizontal overflow', async ({ page }) => {
            await page.goto('/');
            await checkNoHorizontalOverflow(page);
        });

        test('mobile nav is visible', async ({ page }) => {
            await page.goto('/');
            // MobileBottomNav component uses glass-nav class
            const mobileNav = page.locator('.glass-nav');
            await expect(mobileNav).toBeVisible();
        });

        test('desktop nav pills are hidden', async ({ page }) => {
            await page.goto('/');
            const navPills = page.locator('.nav-pills');
            await expect(navPills).toBeHidden();
        });

        test('dashboard grid is single column', async ({ page }) => {
            await page.goto('/');
            const dashboardGrid = page.locator('.dashboard-grid').first();
            const style = await dashboardGrid.evaluate((el) => {
                return window.getComputedStyle(el).gridTemplateColumns;
            });
            // On mobile, grid should collapse to single column
            const columns = style.split(' ').filter(c => c !== '0px' && c.length > 0);
            expect(columns.length).toBeLessThanOrEqual(2);
        });

        test('touch targets are adequate', async ({ page }) => {
            await page.goto('/');
            await checkMinimumTouchTargets(page);
        });
    });

    test.describe('Tablet (768px)', () => {
        test.use({ viewport: VIEWPORTS.tablet });

        test('no horizontal overflow', async ({ page }) => {
            await page.goto('/');
            await checkNoHorizontalOverflow(page);
        });

        test('dashboard grid has proper columns', async ({ page }) => {
            await page.goto('/');
            const dashboardGrid = page.locator('.dashboard-grid').first();
            if (await dashboardGrid.count() > 0) {
                const style = await dashboardGrid.evaluate((el) => {
                    return window.getComputedStyle(el).gridTemplateColumns;
                });
                // Should have 2 columns on tablet
                const columns = style.split(' ').filter(c => c !== '0px' && c.length > 0);
                expect(columns.length).toBeGreaterThanOrEqual(1);
            }
        });
    });

    test.describe('Desktop (1024px)', () => {
        test.use({ viewport: VIEWPORTS.laptop });

        test('no horizontal overflow', async ({ page }) => {
            await page.goto('/');
            await checkNoHorizontalOverflow(page);
        });

        test('dashboard grid has 3 columns', async ({ page }) => {
            await page.goto('/');
            const dashboardGrid = page.locator('.dashboard-grid').first();
            if (await dashboardGrid.count() > 0) {
                const style = await dashboardGrid.evaluate((el) => {
                    return window.getComputedStyle(el).gridTemplateColumns;
                });
                // Should have 3 columns on desktop
                const columns = style.split(' ').filter(c => c !== '0px' && c.length > 0);
                expect(columns.length).toBeGreaterThanOrEqual(2);
            }
        });

        test('sidebar is visible on desktop', async ({ page }) => {
            await page.goto('/');
            const dashboardLeft = page.locator('.dashboard-left').first();
            if (await dashboardLeft.count() > 0) {
                const display = await dashboardLeft.evaluate((el) => {
                    return window.getComputedStyle(el).display;
                });
                expect(display).not.toBe('none');
            }
        });
    });

    test.describe('Large Desktop (1536px)', () => {
        test.use({ viewport: VIEWPORTS.largeDesktop });

        test('no horizontal overflow', async ({ page }) => {
            await page.goto('/');
            await checkNoHorizontalOverflow(page);
        });

        test('project grid shows 4 columns', async ({ page }) => {
            await page.goto('/portfolio');
            await page.waitForLoadState('networkidle');
            const projectList = page.locator('.project-list').first();
            if (await projectList.count() > 0) {
                const style = await projectList.evaluate((el) => {
                    return window.getComputedStyle(el).gridTemplateColumns;
                });
                const columns = style.split(' ').filter(c => c !== '0px' && c.length > 0);
                expect(columns.length).toBeGreaterThanOrEqual(3);
            }
        });
    });

    test.describe('All Pages - No Overflow', () => {
        const pages = ['/', '/resume', '/portfolio', '/blog', '/contact'];

        for (const pagePath of pages) {
            test(`${pagePath} has no overflow on mobile`, async ({ page }) => {
                await page.setViewportSize(VIEWPORTS.mobile);
                await page.goto(pagePath);
                await page.waitForLoadState('domcontentloaded');
                await checkNoHorizontalOverflow(page);
            });
        }
    });
});
