import { test, expect } from "@playwright/test";

test("user can navigate to products from homepage", async ({ page }) => {
  await page.goto("http://localhost:3000");

  await page.waitForLoadState("domcontentloaded");

  await page.goto("http://localhost:3000/products");

  await expect(page).toHaveURL(/products/);
});
