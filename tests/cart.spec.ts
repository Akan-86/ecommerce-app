import { test, expect } from "@playwright/test";

// Helper to go to first product
test("user can add product to cart", async ({ page }) => {
  await page.goto("http://localhost:3000/products");

  // wait for products
  await page.waitForSelector("[data-testid='product-card']", { timeout: 5000 });

  // click first product
  const firstProduct = page.locator("[data-testid='product-card']").first();
  await firstProduct.click();

  // wait for product page
  await expect(page).toHaveURL(/products\/\w+/);

  // add to cart
  await page.getByRole("button", { name: /add to cart/i }).click();

  // open cart
  await page.getByRole("button", { name: /cart/i }).click();

  // verify item exists
  await expect(page.getByText(/\$/)).toBeVisible();
});

test("cart persists after navigation", async ({ page }) => {
  await page.goto("http://localhost:3000/products");

  await page.waitForSelector("[data-testid='product-card']");

  await page.locator("[data-testid='product-card']").first().click();

  await page.getByRole("button", { name: /add to cart/i }).click();

  // navigate away
  await page.goto("http://localhost:3000/");

  // open cart
  await page.getByRole("button", { name: /cart/i }).click();

  // still exists
  await expect(page.getByText(/\$/)).toBeVisible();
});

test("user can remove item from cart", async ({ page }) => {
  await page.goto("http://localhost:3000/products");

  await page.waitForSelector("[data-testid='product-card']");

  await page.locator("[data-testid='product-card']").first().click();

  await page.getByRole("button", { name: /add to cart/i }).click();

  await page.getByRole("button", { name: /cart/i }).click();

  // remove item
  await page.getByRole("button", { name: /remove/i }).click();

  // empty state
  await expect(page.getByText(/empty cart/i)).toBeVisible();
});

test("user cannot checkout with empty cart", async ({ page }) => {
  await page.goto("http://localhost:3000/cart");

  await expect(page.getByText(/empty cart/i)).toBeVisible();

  const checkoutBtn = page.getByRole("button", { name: /checkout/i });

  await expect(checkoutBtn).toBeDisabled();
});
