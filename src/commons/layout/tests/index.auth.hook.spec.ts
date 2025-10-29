import { test, expect } from '@playwright/test';

test.describe('Layout Auth Hook - 비로그인 유저', () => {
  test('비회원으로 /boards에 접속하여 페이지 로드 확인', async ({ page }) => {
    await page.goto('/boards');
    await page.waitForSelector('[data-testid="layout-root"]', { timeout: 500 });
    await expect(page).toHaveURL('/boards');
  });

  test('layout의 로그인버튼 노출여부 확인', async ({ page }) => {
    await page.goto('/boards');
    await page.waitForSelector('[data-testid="layout-root"]', { timeout: 500 });

    const loginButton = page.locator('[data-testid="login-button"]');
    await expect(loginButton).toBeVisible();
  });

  test('로그인버튼 클릭하여 /auth/login 페이지로 이동', async ({ page }) => {
    await page.goto('/boards');
    await page.waitForSelector('[data-testid="layout-root"]', { timeout: 500 });

    const loginButton = page.locator('[data-testid="login-button"]');
    await loginButton.click();

    await page.waitForSelector('[data-testid="auth-login-container"]', {
      timeout: 500,
    });
    await expect(page).toHaveURL('/auth/login');
  });
});

test.describe('Layout Auth Hook - 로그인 유저', () => {
  test('로그인 전체 플로우 테스트', async ({ page }) => {
    // 1. 비회원으로 /auth/login에 접속하여 페이지 로드 확인
    await page.goto('/auth/login');
    await page.waitForSelector('[data-testid="auth-login-container"]', {
      timeout: 500,
    });

    // 2. 로그인시도
    const emailInput = page.locator('input[type="text"]').first();
    const passwordInput = page.locator('input[type="password"]');
    const loginSubmitButton = page.locator('button[type="submit"]');

    await emailInput.fill('a@a.aa');
    await passwordInput.fill('aaaaaaaa8');
    await loginSubmitButton.click();

    // 3. 로그인 성공 후, 완료 모달 클릭하여 /boards 페이지 로드 확인
    // 모달이 나타날 때까지 대기 (네트워크 통신 후 나타나므로 약간의 여유 필요)
    const confirmButton = page
      .locator('[data-testid="modal-confirm-button"]')
      .first();
    await expect(confirmButton).toBeVisible({ timeout: 2000 });
    await confirmButton.click();

    // /boards 페이지 로드 대기
    await page.waitForSelector('[data-testid="layout-root"]', { timeout: 500 });
    await expect(page).toHaveURL('/boards');

    // 4. layout에서 프로필, navigation menu(이름, 로그아웃 버튼) 노출여부 확인
    const profileArea = page.locator('[data-testid="profile-area"]');
    await expect(profileArea).toBeVisible();

    const userName = page.locator('[data-testid="user-name"]');
    await expect(userName).toBeVisible();

    // 프로필 트리거를 클릭하여 메뉴 열기
    const profileTrigger = page.locator('[data-testid="profile-trigger"]');
    await profileTrigger.click();

    // 메뉴가 열릴 때까지 대기 - logout-button이 보일 때까지 기다림
    const logoutButton = page.locator('[data-testid="logout-button"]');
    await expect(logoutButton).toBeVisible({ timeout: 500 });

    // 5. 로그아웃버튼 클릭하여 /auth/login 페이지 로드 확인
    await logoutButton.click();
    await page.waitForSelector('[data-testid="auth-login-container"]', {
      timeout: 500,
    });
    await expect(page).toHaveURL('/auth/login');

    // 6. /boards 접속하여 페이지 로드 확인
    await page.goto('/boards');
    await page.waitForSelector('[data-testid="layout-root"]', { timeout: 500 });
    await expect(page).toHaveURL('/boards');

    // 7. layout에 로그인버튼 노출여부 확인
    const loginButton = page.locator('[data-testid="login-button"]');
    await expect(loginButton).toBeVisible();
  });
});
