import { test, expect } from "@playwright/test";

test("products page loads", async ({ page }) => {
  await page.goto("http://localhost:3000/products");

  await page.waitForLoadState("networkidle");

  await expect(page).toHaveURL(/products/);
});
