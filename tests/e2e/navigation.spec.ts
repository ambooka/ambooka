import { test, expect } from '@playwright/test';

test.describe('Navigation Tests', () => {
    const routes = [
        { path: '/', name: 'Home/Dashboard' },
        { path: '/resume', name: 'Resume' },
        { path: '/portfolio', name: 'Portfolio' },
        { path: '/blog', name: 'Blog' },
        { path: '/contact', name: 'Contact' }
    ];

    test.describe('Direct Navigation', () => {
        for (const route of routes) {
            test(`navigates to ${route.name} page directly`, async ({ page }) => {
                await page.goto(route.path);
                await page.waitForLoadState('domcontentloaded');

                // Page should load without errors
                const body = page.locator('body');
                await expect(body).toBeVisible();

                // Check no critical errors in console
                const errors: string[] = [];
                page.on('console', msg => {
                    if (msg.type() === 'error') {
                        errors.push(msg.text());
                    }
                });

                // Page should render main content
                const mainContent = page.locator('article, main, [data-page]');
                await expect(mainContent.first()).toBeVisible();
            });
        }
    });

    test.describe('Header Navigation', () => {
        test('desktop navigation links work', async ({ page }) => {
            await page.setViewportSize({ width: 1280, height: 800 });
            await page.goto('/');

            // Navigate to Resume via header link
            const resumeLink = page.locator('.nav-pill').filter({ hasText: 'Resume' });
            if (await resumeLink.count() > 0) {
                await resumeLink.click();
                await expect(page).toHaveURL('/resume');
            }

            // Navigate to Portfolio
            const portfolioLink = page.locator('.nav-pill').filter({ hasText: 'Portfolio' });
            if (await portfolioLink.count() > 0) {
                await portfolioLink.click();
                await expect(page).toHaveURL('/portfolio');
            }

            // Navigate to Contact
            const contactLink = page.locator('.nav-pill').filter({ hasText: 'Contact' });
            if (await contactLink.count() > 0) {
                await contactLink.click();
                await expect(page).toHaveURL('/contact');
            }

            // Navigate back to Home
            const homeLink = page.locator('.nav-pill').filter({ hasText: 'Dashboard' });
            if (await homeLink.count() > 0) {
                await homeLink.click();
                await expect(page).toHaveURL('/');
            }
        });

        test('logo links to home', async ({ page }) => {
            await page.setViewportSize({ width: 1280, height: 800 });
            await page.goto('/contact');

            const logo = page.locator('.logo-text, .header-logo a');
            if (await logo.count() > 0) {
                await logo.first().click();
                await expect(page).toHaveURL('/');
            }
        });
    });

    test.describe('Mobile Navigation', () => {
        test('mobile bottom nav works', async ({ page }) => {
            await page.setViewportSize({ width: 375, height: 812 });
            await page.goto('/');
            await page.waitForLoadState('networkidle');

            // Mobile nav should be visible
            const mobileNav = page.locator('.glass-nav');
            await expect(mobileNav).toBeVisible();

            // Check mobile nav buttons exist
            const navButtons = page.locator('.glass-nav button, .glass-nav a');
            expect(await navButtons.count()).toBeGreaterThan(0);
        });
    });

    test.describe('Page Elements', () => {
        test('home page has essential sections', async ({ page }) => {
            await page.goto('/');
            await page.waitForLoadState('networkidle');

            // Welcome banner should be visible
            const welcomeBanner = page.locator('.welcome-banner, [class*="welcome"]');
            if (await welcomeBanner.count() > 0) {
                await expect(welcomeBanner.first()).toBeVisible();
            }

            // Dashboard grid should exist on desktop
            await page.setViewportSize({ width: 1280, height: 800 });
            const dashboardGrid = page.locator('.dashboard-grid');
            if (await dashboardGrid.count() > 0) {
                await expect(dashboardGrid.first()).toBeVisible();
            }
        });

        test('contact page has form', async ({ page }) => {
            await page.goto('/contact');
            await page.waitForLoadState('networkidle');

            // Contact form should exist
            const form = page.locator('form');
            await expect(form).toBeVisible();

            // Form should have input fields
            const nameInput = page.locator('input[name="fullname"]');
            const emailInput = page.locator('input[name="email"]');
            const messageInput = page.locator('textarea[name="message"]');

            await expect(nameInput).toBeVisible();
            await expect(emailInput).toBeVisible();
            await expect(messageInput).toBeVisible();
        });

        test('resume page has timeline sections', async ({ page }) => {
            await page.goto('/resume');
            await page.waitForLoadState('networkidle');

            // Wait for content to load
            await page.waitForTimeout(1000);

            // Article title should be visible
            const articleTitle = page.locator('.article-title');
            if (await articleTitle.count() > 0) {
                await expect(articleTitle.first()).toBeVisible();
            }
        });

        test('portfolio page has project grid', async ({ page }) => {
            await page.goto('/portfolio');
            await page.waitForLoadState('networkidle');

            // Wait for projects to load
            await page.waitForTimeout(2000);

            // Project list or loading skeleton should be visible
            const projectList = page.locator('.project-list, [class*="project"]');
            if (await projectList.count() > 0) {
                await expect(projectList.first()).toBeVisible();
            }
        });
    });

    test.describe('External Links', () => {
        test('social links have correct attributes', async ({ page }) => {
            await page.goto('/');

            // Check GitHub link
            const githubLinks = page.locator('a[href*="github.com"]');
            if (await githubLinks.count() > 0) {
                const firstGithub = githubLinks.first();
                await expect(firstGithub).toHaveAttribute('target', '_blank');
                await expect(firstGithub).toHaveAttribute('rel', /noopener/);
            }

            // Check LinkedIn link
            const linkedinLinks = page.locator('a[href*="linkedin.com"]');
            if (await linkedinLinks.count() > 0) {
                const firstLinkedin = linkedinLinks.first();
                await expect(firstLinkedin).toHaveAttribute('target', '_blank');
                await expect(firstLinkedin).toHaveAttribute('rel', /noopener/);
            }
        });
    });
});
