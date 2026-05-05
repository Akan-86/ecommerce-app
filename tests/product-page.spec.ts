import { test, expect } from "@playwright/test";

// Full purchase flow test

test("user can complete full purchase flow", async ({ page }) => {
  // go to products page
  await page.goto("http://localhost:3000/products");

  // wait for products
  await page.waitForSelector("[data-testid='product-card']");

  // click first product
  await page.locator("[data-testid='product-card']").first().click();

  // verify product page
  await expect(page).toHaveURL(/products\/\w+/);

  // add to cart
  await page.getByRole("button", { name: /add to cart/i }).click();

  // open cart
  await page.getByRole("button", { name: /cart/i }).click();

  // go to checkout
  await page.getByRole("button", { name: /checkout/i }).click();

  // verify checkout page
  await expect(page).toHaveURL(/checkout/);

  // simulate form fill (basic)
  await page.fill("input[name='email']", "test@test.com");
  await page.fill("input[name='name']", "Test User");

  // submit order
  await page.getByRole("button", { name: /pay|complete|order/i }).click();

  // success page
  await expect(page).toHaveURL(/success/);
});

// Edge case: invalid product id

test("invalid product page shows error", async ({ page }) => {
  await page.goto("http://localhost:3000/products/invalid-id");

  await expect(page.getByText(/not found|error/i)).toBeVisible();
});

// UX: product page loads correctly

test("product page shows essential info", async ({ page }) => {
  await page.goto("http://localhost:3000/products");

  await page.waitForSelector("[data-testid='product-card']");

  await page.locator("[data-testid='product-card']").first().click();

  // check title
  await expect(page.locator("h1")).toBeVisible();

  // check price
  await expect(page.getByText(/\$/)).toBeVisible();

  // check add to cart button
  await expect(
    page.getByRole("button", { name: /add to cart/i })
  ).toBeVisible();
});
