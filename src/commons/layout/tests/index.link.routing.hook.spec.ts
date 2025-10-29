import { test, expect } from '@playwright/test';

test.describe('Layout Link Routing', () => {
  test.beforeEach(async ({ page }) => {
    // 페이지 로드 대기 - data-testid 사용
    await page.goto('/');
    await page.waitForSelector('[data-testid="layout-root"]', {
      timeout: 1000,
    });
  });

  test('로고 클릭시 게시물목록페이지로 이동', async ({ page }) => {
    // 로고 영역 클릭
    const logoArea = page.locator('[data-testid="logo-area"]');
    await expect(logoArea).toBeVisible();

    await logoArea.click();

    // URL 변경 확인
    await expect(page).toHaveURL('/boards');
  });

  test('트립토크 네비게이션 클릭시 게시물목록페이지로 이동 및 액티브 상태', async ({
    page,
  }) => {
    // 트립토크 네비게이션 클릭
    const triptalkNav = page.locator('[data-testid="nav-triptalk"]');
    await expect(triptalkNav).toBeVisible();

    await triptalkNav.click();

    // URL 변경 확인
    await expect(page).toHaveURL('/boards');

    // 트립토크가 액티브 상태인지 확인
    await expect(triptalkNav).toHaveClass(/navItemActive/);

    // 숙박권 구매와 마이페이지는 비액티브 상태인지 확인
    const accommodationNav = page.locator('[data-testid="nav-accommodation"]');
    const mypageNav = page.locator('[data-testid="nav-mypage"]');

    await expect(accommodationNav).not.toHaveClass(/navItemActive/);
    await expect(mypageNav).not.toHaveClass(/navItemActive/);
  });

  test('로그인 버튼 클릭시 로그인 페이지로 이동', async ({ page }) => {
    // 로그인 버튼 클릭
    const loginButton = page.locator('[data-testid="login-button"]');
    await expect(loginButton).toBeVisible();

    await loginButton.click();

    // URL 변경 확인
    await expect(page).toHaveURL('/auth/login');
  });

  test('숙박권 구매 네비게이션 클릭시 액티브 상태 변경', async ({ page }) => {
    // 숙박권 구매 네비게이션 클릭
    const accommodationNav = page.locator('[data-testid="nav-accommodation"]');
    await expect(accommodationNav).toBeVisible();

    await accommodationNav.click();

    // 숙박권 구매가 액티브 상태인지 확인
    await expect(accommodationNav).toHaveClass(/navItemActive/);

    // 트립토크와 마이페이지는 비액티브 상태인지 확인
    const triptalkNav = page.locator('[data-testid="nav-triptalk"]');
    const mypageNav = page.locator('[data-testid="nav-mypage"]');

    await expect(triptalkNav).not.toHaveClass(/navItemActive/);
    await expect(mypageNav).not.toHaveClass(/navItemActive/);
  });

  test('마이 페이지 네비게이션 클릭시 액티브 상태 변경', async ({ page }) => {
    // 마이 페이지 네비게이션 클릭
    const mypageNav = page.locator('[data-testid="nav-mypage"]');
    await expect(mypageNav).toBeVisible();

    await mypageNav.click();

    // 마이 페이지가 액티브 상태인지 확인
    await expect(mypageNav).toHaveClass(/navItemActive/);

    // 트립토크와 숙박권 구매는 비액티브 상태인지 확인
    const triptalkNav = page.locator('[data-testid="nav-triptalk"]');
    const accommodationNav = page.locator('[data-testid="nav-accommodation"]');

    await expect(triptalkNav).not.toHaveClass(/navItemActive/);
    await expect(accommodationNav).not.toHaveClass(/navItemActive/);
  });

  test('네비게이션 아이템에 cursor: pointer 스타일 적용', async ({ page }) => {
    // 로고 영역 cursor 스타일 확인
    const logoArea = page.locator('[data-testid="logo-area"]');
    await expect(logoArea).toHaveCSS('cursor', 'pointer');

    // 트립토크 네비게이션 cursor 스타일 확인
    const triptalkNav = page.locator('[data-testid="nav-triptalk"]');
    await expect(triptalkNav).toHaveCSS('cursor', 'pointer');

    // 로그인 버튼 cursor 스타일 확인
    const loginButton = page.locator('[data-testid="login-button"]');
    await expect(loginButton).toHaveCSS('cursor', 'pointer');
  });

  test('숙박권 구매와 마이페이지 클릭시 액티브 상태 변경', async ({ page }) => {
    // 숙박권 구매 네비게이션 클릭
    const accommodationNav = page.locator('[data-testid="nav-accommodation"]');
    await accommodationNav.click();

    // 숙박권 구매가 액티브 상태인지 확인
    await expect(accommodationNav).toHaveClass(/navItemActive/);

    // 마이 페이지 네비게이션 클릭
    const mypageNav = page.locator('[data-testid="nav-mypage"]');
    await mypageNav.click();

    // 마이 페이지가 액티브 상태인지 확인
    await expect(mypageNav).toHaveClass(/navItemActive/);

    // 숙박권 구매는 비액티브 상태가 되는지 확인
    await expect(accommodationNav).not.toHaveClass(/navItemActive/);
  });
});
