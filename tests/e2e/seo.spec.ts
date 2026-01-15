import { test, expect } from '@playwright/test';

test.describe('SEO & Metadata Tests', () => {

    test('Home Page SEO', async ({ page }) => {
        await page.goto('/');

        // 1. Title
        await expect(page).toHaveTitle(/Abdulrahman Ambooka | MLOps Architect & AI Engineer/);

        // 2. Meta Description
        const description = page.locator('meta[name="description"]');
        await expect(description).toHaveAttribute('content', /Computer Science Graduate/);
        await expect(description).toHaveAttribute('content', /MLOps/);

        // 3. Canonical URL
        const canonical = page.locator('link[rel="canonical"]');
        await expect(canonical).toHaveAttribute('href', 'https://ambooka.dev/');

        // 4. JSON-LD Person Schema
        const jsonLd = page.locator('script[type="application/ld+json"]');
        await expect(jsonLd).toHaveCount(1);

        const jsonContent = await jsonLd.innerText();
        const schema = JSON.parse(jsonContent);

        expect(schema['@context']).toBe('https://schema.org');
        expect(schema['@type']).toBe('Person');
        expect(schema.name).toBe('Abdulrahman Ambooka');
        expect(schema.jobTitle).toBe('MLOps Architect & Software Engineer');
        expect(schema.url).toBe('https://ambooka.dev');
        expect(schema.sameAs).toContain('https://github.com/ambooka');

        // 5. Open Graph
        await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', 'Abdulrahman Ambooka | MLOps Architect & AI Engineer');
        await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'website');
    });

    test('Contact Page SEO', async ({ page }) => {
        await page.goto('/contact');
        await expect(page).toHaveTitle(/Contact/);
        // Note: Assuming "Contact | Abdulrahman Ambooka" or similar template
    });

    test('Resume Page SEO', async ({ page }) => {
        await page.goto('/resume');
        await expect(page).toHaveTitle(/Resume/);
    });
});
