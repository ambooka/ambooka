import { test, expect } from "@playwright/test";

test.describe("SEO & Metadata Tests", () => {
  test("Home Page SEO", async ({ page }) => {
    await page.goto("/");

    // 1. Title
    await expect(page).toHaveTitle(
      "Abdulrahman Ambooka Msah | Software Developer | ERPNext/Frappe & Systems Integration",
    );

    // 2. Meta Description
    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute(
      "content",
      /Custom business applications/,
    );
    await expect(description).toHaveAttribute("content", /ERPNext/);

    // 3. Canonical URL
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute("href", /^https:\/\/ambooka\.dev\/?$/);

    // 4. JSON-LD Person Schema
    const jsonLd = page.locator('script[type="application/ld+json"]');
    const schemas = await jsonLd.allTextContents();
    const schema = schemas.map(value => JSON.parse(value)).find(value => value["@type"] === "Person");
    expect(schema).toBeDefined();

    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema["@type"]).toBe("Person");
    expect(schema.name).toBe("Abdulrahman Ambooka Msah");
    expect(schema.jobTitle).toBe(
      "Software Developer | ERPNext/Frappe & Systems Integration",
    );
    expect(schema.url).toBe("https://ambooka.dev");
    expect(schema.sameAs).toContain("https://github.com/ambooka");

    // 5. Open Graph
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      "Abdulrahman Ambooka Msah | Software Developer | ERPNext/Frappe & Systems Integration",
    );
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
      "content",
      "website",
    );
  });

  test("Contact Page SEO", async ({ page }) => {
    await page.goto("/contact");
    await expect(page).toHaveTitle(/Contact/);
    // Note: Assuming "Contact | Abdulrahman Ambooka Msah" or similar template
  });

  test("Resume Page SEO", async ({ page }) => {
    await page.goto("/resume");
    await expect(page).toHaveTitle(/Resume/);
  });
});
