import { test, expect } from "@playwright/test";

test("products page renders correctly", async ({ page }) => {
  await page.goto("http://localhost:3000/products");

  await page.waitForLoadState("domcontentloaded");

  await expect(page).toHaveURL(/products/);
});
