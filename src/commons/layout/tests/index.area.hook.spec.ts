import { test, expect } from '@playwright/test';

test.describe('Area Hook Tests', () => {
  test.describe('Header Area Visibility', () => {
    test('should show header on boards list page', async ({ page }) => {
      await page.goto('/boards');
      await page.waitForSelector('[data-testid="layout-root"]', {
        timeout: 500,
      });

      const header = page.locator('header');
      const logoArea = page.locator('[data-testid="logo-area"]');

      await expect(header).toBeVisible();
      await expect(logoArea).toBeVisible();
    });

    test('should show header on board detail page', async ({ page }) => {
      await page.goto('/boards/1');
      await page.waitForSelector('[data-testid="layout-root"]', {
        timeout: 500,
      });

      const header = page.locator('header');
      const logoArea = page.locator('[data-testid="logo-area"]');

      await expect(header).toBeVisible();
      await expect(logoArea).toBeVisible();
    });

    test('should show header on board create page', async ({ page }) => {
      await page.goto('/boards/new');
      await page.waitForSelector('[data-testid="layout-root"]', {
        timeout: 500,
      });

      const header = page.locator('header');
      const logoArea = page.locator('[data-testid="logo-area"]');

      await expect(header).toBeVisible();
      await expect(logoArea).toBeVisible();
    });

    test('should hide header on login page', async ({ page }) => {
      await page.goto('/auth/login');
      await page.waitForSelector('[data-testid="layout-root"]', {
        timeout: 500,
      });

      const header = page.locator('header');

      await expect(header).not.toBeVisible();
    });

    test('should hide header on signup page', async ({ page }) => {
      await page.goto('/auth/signup');
      await page.waitForSelector('[data-testid="layout-root"]', {
        timeout: 500,
      });

      const header = page.locator('header');

      await expect(header).not.toBeVisible();
    });
  });

  test.describe('Banner Area Visibility', () => {
    test('should show banner on boards list page', async ({ page }) => {
      await page.goto('/boards');
      await page.waitForSelector('[data-testid="layout-root"]', {
        timeout: 400,
      });

      // Banner가 존재하는지만 확인 (carousel 로딩은 기다리지 않음)
      const banner = page.locator('[data-testid="banner-area"]');
      await expect(banner).toBeVisible({ timeout: 400 });
    });

    test('should show banner on board detail page', async ({ page }) => {
      await page.goto('/boards/1');
      await page.waitForSelector('[data-testid="layout-root"]', {
        timeout: 400,
      });

      const banner = page.locator('[data-testid="banner-area"]');
      await expect(banner).toBeVisible({ timeout: 400 });
    });

    test('should hide banner on board create page', async ({ page }) => {
      await page.goto('/boards/new');
      await page.waitForSelector('[data-testid="layout-root"]', {
        timeout: 400,
      });

      const banner = page.locator('[data-testid="banner-area"]');
      await expect(banner).not.toBeVisible({ timeout: 400 });
    });

    test('should hide banner on board edit page', async ({ page }) => {
      await page.goto('/boards/1/edit');
      await page.waitForSelector('[data-testid="layout-root"]', {
        timeout: 400,
      });

      const banner = page.locator('[data-testid="banner-area"]');
      await expect(banner).not.toBeVisible({ timeout: 400 });
    });

    test('should hide banner on login page', async ({ page }) => {
      await page.goto('/auth/login');
      await page.waitForSelector('[data-testid="layout-root"]', {
        timeout: 400,
      });

      const banner = page.locator('[data-testid="banner-area"]');
      await expect(banner).not.toBeVisible({ timeout: 400 });
    });

    test('should hide banner on signup page', async ({ page }) => {
      await page.goto('/auth/signup');
      await page.waitForSelector('[data-testid="layout-root"]', {
        timeout: 400,
      });

      const banner = page.locator('[data-testid="banner-area"]');
      await expect(banner).not.toBeVisible({ timeout: 400 });
    });
  });

  test.describe('Image Area Visibility', () => {
    test('should show image on login page', async ({ page }) => {
      await page.goto('/auth/login');
      await page.waitForSelector('[data-testid="layout-root"]', {
        timeout: 500,
      });

      const authImage = page.locator('[class*="authImage"]');

      await expect(authImage).toBeVisible();
    });

    test('should show image on signup page', async ({ page }) => {
      await page.goto('/auth/signup');
      await page.waitForSelector('[data-testid="layout-root"]', {
        timeout: 500,
      });

      const authImage = page.locator('[class*="authImage"]');

      await expect(authImage).toBeVisible();
    });

    test('should hide image on boards list page', async ({ page }) => {
      await page.goto('/boards');
      await page.waitForSelector('[data-testid="layout-root"]', {
        timeout: 500,
      });

      const authImage = page.locator('[class*="authImage"]');

      await expect(authImage).not.toBeVisible();
    });

    test('should hide image on board detail page', async ({ page }) => {
      await page.goto('/boards/1');
      await page.waitForSelector('[data-testid="layout-root"]', {
        timeout: 500,
      });

      const authImage = page.locator('[class*="authImage"]');

      await expect(authImage).not.toBeVisible();
    });
  });

  test.describe('Skip Tests for Specific Routes', () => {
    test.skip('should skip test for accommodation purchase', async ({
      page,
    }) => {
      await page.goto('/accommodation');
      // This test is skipped as per requirements
    });

    test.skip('should skip test for mypage', async ({ page }) => {
      await page.goto('/mypage');
      // This test is skipped as per requirements
    });
  });
});
