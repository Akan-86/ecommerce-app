import { test, expect } from "@playwright/test";

// Navigation: homepage → products via UI

test("user can navigate to products via navbar", async ({ page }) => {
  await page.goto("http://localhost:3000");

  // click products link from navbar
  await page.getByRole("link", { name: /products|ürünler/i }).click();

  await expect(page).toHaveURL(/products/);
});

// Search: suggestions appear and navigate

test("search suggestions work and navigate", async ({ page }) => {
  await page.goto("http://localhost:3000");

  const searchInput = page.getByPlaceholder(/search/i);

  await searchInput.fill("a");

  // wait for suggestions
  await page.waitForSelector("[role='option']");

  // click first suggestion
  await page.locator("[role='option']").first().click();

  // should go to product page
  await expect(page).toHaveURL(/products\/\w+/);
});

// Language switch (i18n)

test("user can switch language", async ({ page }) => {
  await page.goto("http://localhost:3000");

  // switch language (assuming button exists)
  await page.getByRole("button", { name: /tr|en/i }).click();

  // check UI changed (example: products label)
  await expect(page.getByText(/ürünler|products/i)).toBeVisible();
});

// Edge: search empty state

test("search shows empty state when no results", async ({ page }) => {
  await page.goto("http://localhost:3000");

  const searchInput = page.getByPlaceholder(/search/i);

  await searchInput.fill("zzzzzzzz");

  await page.waitForTimeout(500);

  await expect(page.getByText(/no results|sonuç yok/i)).toBeVisible();
});
