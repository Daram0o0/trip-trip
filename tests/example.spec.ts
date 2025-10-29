import { test, expect } from '@playwright/test';

test('homepage loads correctly', async ({ page }) => {
  await page.goto('/');

  // Check if the page title is correct
  await expect(page).toHaveTitle(/Create Next App/);

  // Check if the page loads without errors
  await expect(page.locator('body')).toBeVisible();
});

test('login page loads correctly', async ({ page }) => {
  await page.goto('/auth/login');

  // Check if login page loads
  await expect(page).toHaveURL(/.*auth\/login/);
});

test('signup page loads correctly', async ({ page }) => {
  await page.goto('/auth/signup');

  // Check if signup page loads
  await expect(page).toHaveURL(/.*auth\/signup/);
});

test('boards page loads correctly', async ({ page }) => {
  await page.goto('/boards');

  // Check if boards page loads
  await expect(page).toHaveURL(/.*boards/);
});
