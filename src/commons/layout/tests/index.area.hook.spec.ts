import { test, expect } from '@playwright/test';

test.describe('Area Hook Tests', () => {
  // 테스트 환경에서 AuthGuard 우회를 위한 플래그 설정
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      (window as unknown as { __TEST_ENV__?: boolean }).__TEST_ENV__ = true;
    });
  });
  test.describe('Header Area Visibility', () => {
    test('should show header on boards list page', async ({ page }) => {
      await page.goto('/boards');
      // Next.js 하이드레이션 완료 대기
      await page.waitForLoadState('networkidle');
      // body가 로드될 때까지 대기 (더 안정적)
      await page.waitForSelector('body', { timeout: 10000 });
      // 추가 대기 시간 (하이드레이션 완료)
      await page.waitForTimeout(2000);
      // layout-root가 렌더링될 때까지 대기 (더 관대한 조건)
      try {
        await page.waitForSelector('[data-testid="layout-root"]', {
          timeout: 5000,
        });
      } catch {
        // data-testid가 없으면 body만으로도 진행
        console.log(
          'data-testid="layout-root" not found, continuing with body'
        );
      }

      const header = page.locator('header');
      const logoArea = page.locator('[data-testid="logo-area"]');

      await expect(header).toBeVisible();
      await expect(logoArea).toBeVisible();
    });

    test('should show header on board detail page', async ({ page }) => {
      await page.goto('/boards/1');
      // Next.js 하이드레이션 완료 대기
      await page.waitForLoadState('networkidle');
      // body가 로드될 때까지 대기 (더 안정적)
      await page.waitForSelector('body', { timeout: 10000 });
      // 추가 대기 시간 (하이드레이션 완료)
      await page.waitForTimeout(2000);
      // layout-root가 렌더링될 때까지 대기 (더 관대한 조건)
      try {
        await page.waitForSelector('[data-testid="layout-root"]', {
          timeout: 5000,
        });
      } catch {
        // data-testid가 없으면 body만으로도 진행
        console.log(
          'data-testid="layout-root" not found, continuing with body'
        );
      }

      const header = page.locator('header');
      const logoArea = page.locator('[data-testid="logo-area"]');

      await expect(header).toBeVisible();
      await expect(logoArea).toBeVisible();
    });

    test('should show header on board create page', async ({ page }) => {
      await page.goto('/boards/new');
      // Next.js 하이드레이션 완료 대기
      await page.waitForLoadState('networkidle');
      // body가 로드될 때까지 대기 (더 안정적)
      await page.waitForSelector('body', { timeout: 10000 });
      // 추가 대기 시간 (하이드레이션 완료)
      await page.waitForTimeout(2000);
      // layout-root가 렌더링될 때까지 대기 (더 관대한 조건)
      try {
        await page.waitForSelector('[data-testid="layout-root"]', {
          timeout: 5000,
        });
      } catch {
        // data-testid가 없으면 body만으로도 진행
        console.log(
          'data-testid="layout-root" not found, continuing with body'
        );
      }

      const header = page.locator('header');
      const logoArea = page.locator('[data-testid="logo-area"]');

      await expect(header).toBeVisible();
      await expect(logoArea).toBeVisible();
    });

    test('should hide header on login page', async ({ page }) => {
      await page.goto('/auth/login');
      // Next.js 하이드레이션 완료 대기
      await page.waitForLoadState('networkidle');
      // body가 로드될 때까지 대기 (더 안정적)
      await page.waitForSelector('body', { timeout: 10000 });
      // 추가 대기 시간 (하이드레이션 완료)
      await page.waitForTimeout(2000);
      // layout-root가 렌더링될 때까지 대기 (더 관대한 조건)
      try {
        await page.waitForSelector('[data-testid="layout-root"]', {
          timeout: 5000,
        });
      } catch {
        // data-testid가 없으면 body만으로도 진행
        console.log(
          'data-testid="layout-root" not found, continuing with body'
        );
      }

      const header = page.locator('header');

      await expect(header).not.toBeVisible();
    });

    test('should hide header on signup page', async ({ page }) => {
      await page.goto('/auth/signup');
      // Next.js 하이드레이션 완료 대기
      await page.waitForLoadState('networkidle');
      // body가 로드될 때까지 대기 (더 안정적)
      await page.waitForSelector('body', { timeout: 10000 });
      // 추가 대기 시간 (하이드레이션 완료)
      await page.waitForTimeout(2000);
      // layout-root가 렌더링될 때까지 대기 (더 관대한 조건)
      try {
        await page.waitForSelector('[data-testid="layout-root"]', {
          timeout: 5000,
        });
      } catch {
        // data-testid가 없으면 body만으로도 진행
        console.log(
          'data-testid="layout-root" not found, continuing with body'
        );
      }

      const header = page.locator('header');

      await expect(header).not.toBeVisible();
    });
  });

  test.describe('Banner Area Visibility', () => {
    test('should show banner on boards list page', async ({ page }) => {
      await page.goto('/boards');
      // Next.js 하이드레이션 완료 대기
      await page.waitForLoadState('networkidle');
      // body가 로드될 때까지 대기 (더 안정적)
      await page.waitForSelector('body', { timeout: 10000 });
      // 추가 대기 시간 (하이드레이션 완료)
      await page.waitForTimeout(2000);
      // layout-root가 렌더링될 때까지 대기 (더 관대한 조건)
      try {
        await page.waitForSelector('[data-testid="layout-root"]', {
          timeout: 5000,
        });
      } catch {
        // data-testid가 없으면 body만으로도 진행
        console.log(
          'data-testid="layout-root" not found, continuing with body'
        );
      }

      // Banner가 존재하는지만 확인 (carousel 로딩은 기다리지 않음)
      const banner = page.locator('[data-testid="banner-area"]');
      await expect(banner).toBeVisible({ timeout: 3000 });
    });

    test('should show banner on board detail page', async ({ page }) => {
      await page.goto('/boards/1');
      // Next.js 하이드레이션 완료 대기
      await page.waitForLoadState('networkidle');
      // body가 로드될 때까지 대기 (더 안정적)
      await page.waitForSelector('body', { timeout: 10000 });
      // 추가 대기 시간 (하이드레이션 완료)
      await page.waitForTimeout(2000);
      // layout-root가 렌더링될 때까지 대기 (더 관대한 조건)
      try {
        await page.waitForSelector('[data-testid="layout-root"]', {
          timeout: 5000,
        });
      } catch {
        // data-testid가 없으면 body만으로도 진행
        console.log(
          'data-testid="layout-root" not found, continuing with body'
        );
      }

      const banner = page.locator('[data-testid="banner-area"]');
      await expect(banner).toBeVisible({ timeout: 3000 });
    });

    test('should hide banner on board create page', async ({ page }) => {
      await page.goto('/boards/new');
      // Next.js 하이드레이션 완료 대기
      await page.waitForLoadState('networkidle');
      // body가 로드될 때까지 대기 (더 안정적)
      await page.waitForSelector('body', { timeout: 10000 });
      // 추가 대기 시간 (하이드레이션 완료)
      await page.waitForTimeout(2000);
      // layout-root가 렌더링될 때까지 대기 (더 관대한 조건)
      try {
        await page.waitForSelector('[data-testid="layout-root"]', {
          timeout: 5000,
        });
      } catch {
        // data-testid가 없으면 body만으로도 진행
        console.log(
          'data-testid="layout-root" not found, continuing with body'
        );
      }

      const banner = page.locator('[data-testid="banner-area"]');
      await expect(banner).not.toBeVisible({ timeout: 3000 });
    });

    test('should hide banner on board edit page', async ({ page }) => {
      await page.goto('/boards/1/edit');
      // Next.js 하이드레이션 완료 대기
      await page.waitForLoadState('networkidle');
      // body가 로드될 때까지 대기 (더 안정적)
      await page.waitForSelector('body', { timeout: 10000 });
      // 추가 대기 시간 (하이드레이션 완료)
      await page.waitForTimeout(2000);
      // layout-root가 렌더링될 때까지 대기 (더 관대한 조건)
      try {
        await page.waitForSelector('[data-testid="layout-root"]', {
          timeout: 5000,
        });
      } catch {
        // data-testid가 없으면 body만으로도 진행
        console.log(
          'data-testid="layout-root" not found, continuing with body'
        );
      }

      const banner = page.locator('[data-testid="banner-area"]');
      await expect(banner).not.toBeVisible({ timeout: 3000 });
    });

    test('should hide banner on login page', async ({ page }) => {
      await page.goto('/auth/login');
      // Next.js 하이드레이션 완료 대기
      await page.waitForLoadState('networkidle');
      // body가 로드될 때까지 대기 (더 안정적)
      await page.waitForSelector('body', { timeout: 10000 });
      // 추가 대기 시간 (하이드레이션 완료)
      await page.waitForTimeout(2000);
      // layout-root가 렌더링될 때까지 대기 (더 관대한 조건)
      try {
        await page.waitForSelector('[data-testid="layout-root"]', {
          timeout: 5000,
        });
      } catch {
        // data-testid가 없으면 body만으로도 진행
        console.log(
          'data-testid="layout-root" not found, continuing with body'
        );
      }

      const banner = page.locator('[data-testid="banner-area"]');
      await expect(banner).not.toBeVisible({ timeout: 3000 });
    });

    test('should hide banner on signup page', async ({ page }) => {
      await page.goto('/auth/signup');
      await page.waitForSelector('[data-testid="layout-root"]', {
        timeout: 1500,
      });

      const banner = page.locator('[data-testid="banner-area"]');
      await expect(banner).not.toBeVisible({ timeout: 1500 });
    });
  });

  test.describe('Image Area Visibility', () => {
    test('should show image on login page', async ({ page }) => {
      await page.goto('/auth/login');
      // Next.js 하이드레이션 완료 대기
      await page.waitForLoadState('networkidle');
      // body가 로드될 때까지 대기 (더 안정적)
      await page.waitForSelector('body', { timeout: 10000 });
      // 추가 대기 시간 (하이드레이션 완료)
      await page.waitForTimeout(2000);
      // layout-root가 렌더링될 때까지 대기 (더 관대한 조건)
      try {
        await page.waitForSelector('[data-testid="layout-root"]', {
          timeout: 5000,
        });
      } catch {
        // data-testid가 없으면 body만으로도 진행
        console.log(
          'data-testid="layout-root" not found, continuing with body'
        );
      }

      const authImage = page.locator('[class*="authImage"]');

      await expect(authImage).toBeVisible();
    });

    test('should show image on signup page', async ({ page }) => {
      await page.goto('/auth/signup');
      // Next.js 하이드레이션 완료 대기
      await page.waitForLoadState('networkidle');
      // body가 로드될 때까지 대기 (더 안정적)
      await page.waitForSelector('body', { timeout: 10000 });
      // 추가 대기 시간 (하이드레이션 완료)
      await page.waitForTimeout(2000);
      // layout-root가 렌더링될 때까지 대기 (더 관대한 조건)
      try {
        await page.waitForSelector('[data-testid="layout-root"]', {
          timeout: 5000,
        });
      } catch {
        // data-testid가 없으면 body만으로도 진행
        console.log(
          'data-testid="layout-root" not found, continuing with body'
        );
      }

      const authImage = page.locator('[class*="authImage"]');

      await expect(authImage).toBeVisible();
    });

    test('should hide image on boards list page', async ({ page }) => {
      await page.goto('/boards');
      // Next.js 하이드레이션 완료 대기
      await page.waitForLoadState('networkidle');
      // body가 로드될 때까지 대기 (더 안정적)
      await page.waitForSelector('body', { timeout: 10000 });
      // 추가 대기 시간 (하이드레이션 완료)
      await page.waitForTimeout(2000);
      // layout-root가 렌더링될 때까지 대기 (더 관대한 조건)
      try {
        await page.waitForSelector('[data-testid="layout-root"]', {
          timeout: 5000,
        });
      } catch {
        // data-testid가 없으면 body만으로도 진행
        console.log(
          'data-testid="layout-root" not found, continuing with body'
        );
      }

      const authImage = page.locator('[class*="authImage"]');

      await expect(authImage).not.toBeVisible();
    });

    test('should hide image on board detail page', async ({ page }) => {
      await page.goto('/boards/1');
      // Next.js 하이드레이션 완료 대기
      await page.waitForLoadState('networkidle');
      // body가 로드될 때까지 대기 (더 안정적)
      await page.waitForSelector('body', { timeout: 10000 });
      // 추가 대기 시간 (하이드레이션 완료)
      await page.waitForTimeout(2000);
      // layout-root가 렌더링될 때까지 대기 (더 관대한 조건)
      try {
        await page.waitForSelector('[data-testid="layout-root"]', {
          timeout: 5000,
        });
      } catch {
        // data-testid가 없으면 body만으로도 진행
        console.log(
          'data-testid="layout-root" not found, continuing with body'
        );
      }

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
