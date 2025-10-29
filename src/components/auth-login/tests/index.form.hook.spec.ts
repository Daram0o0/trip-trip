import { test, expect } from '@playwright/test';

test.describe('Auth Login Form Hook', () => {
  test.beforeEach(async ({ page }) => {
    // localStorage 초기화
    await page.goto('/auth/login');
    await page.evaluate(() => {
      localStorage.clear();
    });

    // 페이지 로드 대기 - data-testid 사용
    await page.waitForSelector('[data-testid="auth-login-container"]', {
      timeout: 500,
    });
  });

  test.describe('성공 시나리오', () => {
    test('로그인 성공 - 실제 API 사용', async ({ page }) => {
      // 모든 인풋이 입력되면 로그인버튼 활성화 확인
      const emailInput = page.locator('input[type="text"]').first();
      const passwordInput = page.locator('input[type="password"]');
      const loginButton = page.locator('button[type="submit"]');

      // 초기 상태: 버튼 비활성화
      await expect(loginButton).toBeDisabled();

      // 이메일 입력
      await emailInput.fill('a@a.aa');

      // 비밀번호 입력
      await passwordInput.fill('aaaaaaaa8');

      // 버튼 활성화 확인
      await expect(loginButton).toBeEnabled({ timeout: 500 });

      // 로그인 버튼 클릭
      await loginButton.click();

      // loginUser API 응답 확인 (accessToken 포함)
      const loginResponsePromise = page.waitForResponse(
        response => {
          const url = response.url();
          const method = response.request().method();
          const postData = response.request().postData();
          return (
            url.includes('/graphql') &&
            method === 'POST' &&
            (postData?.includes('LoginUser') ?? false)
          );
        },
        { timeout: 5000 }
      );

      const loginResponse = await loginResponsePromise;
      const loginData = await loginResponse.json();

      // accessToken이 정상적으로 반환되는지 확인
      expect(loginData.data.loginUser).toBeDefined();
      expect(loginData.data.loginUser.accessToken).toBeTruthy();

      // fetchUserLoggedIn API 응답 확인 (_id, name 포함)
      const userResponsePromise = page.waitForResponse(
        response => {
          const url = response.url();
          const method = response.request().method();
          const postData = response.request().postData();
          return (
            url.includes('/graphql') &&
            method === 'POST' &&
            (postData?.includes('FetchUserLoggedIn') ?? false)
          );
        },
        { timeout: 5000 }
      );

      const userResponse = await userResponsePromise;
      const userData = await userResponse.json();

      // _id, name이 정상적으로 반환되는지 확인
      expect(userData.data.fetchUserLoggedIn).toBeDefined();
      expect(userData.data.fetchUserLoggedIn._id).toBeTruthy();
      expect(userData.data.fetchUserLoggedIn.name).toBeTruthy();

      // localStorage 확인
      const accessToken = await page.evaluate(() =>
        localStorage.getItem('accessToken')
      );
      expect(accessToken).toBeTruthy();

      const user = await page.evaluate(() => localStorage.getItem('user'));
      expect(user).toBeTruthy();
      const userObj = JSON.parse(user!);
      expect(userObj._id).toBeTruthy();
      expect(userObj.name).toBeTruthy();

      // 로그인 성공 모달 표시 확인
      const modal = page.locator('text=로그인 성공');
      await expect(modal).toBeVisible({ timeout: 2000 });

      // 모달 확인 버튼 클릭
      const confirmButton = page.locator('button:has-text("확인")');
      await confirmButton.click({ timeout: 500 });

      // 게시글 페이지로 이동 확인 (네트워크 통신이므로 2000ms)
      await expect(page).toHaveURL(/.*\/boards/, { timeout: 2000 });
    });
  });

  test.describe('실패 시나리오', () => {
    test('로그인 실패 - API 모킹', async ({ page }) => {
      const emailInput = page.locator('input[type="text"]').first();
      const passwordInput = page.locator('input[type="password"]');
      const loginButton = page.locator('button[type="submit"]');

      // API 모킹: loginUser 실패 응답 (로그인 버튼 클릭 전에 설정)
      await page.route('**/graphql', async route => {
        const request = route.request();
        const postData = request.postData() || '';

        if (postData.includes('LoginUser')) {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              errors: [
                {
                  message: '이메일 또는 비밀번호가 올바르지 않습니다.',
                },
              ],
            }),
          });
        } else {
          await route.continue();
        }
      });

      // 이메일 입력
      await emailInput.fill('wrong@email.com');

      // 비밀번호 입력
      await passwordInput.fill('wrongpassword');

      // 로그인 버튼 클릭
      await loginButton.click();

      // 로그인 실패 모달 표시 확인 (네트워크 통신이므로 2000ms)
      const modalTitle = page.locator('text=로그인 실패');
      await expect(modalTitle).toBeVisible({ timeout: 2000 });

      // 모달 확인 버튼 클릭
      const confirmButton = page.locator('button:has-text("확인")');
      await confirmButton.click({ timeout: 500 });

      // 모달이 닫히고 로그인 페이지에 남아있는지 확인
      await expect(modalTitle).not.toBeVisible({ timeout: 500 });
      await expect(page).toHaveURL(/.*\/auth\/login/, { timeout: 500 });
    });

    test('이메일 형식 검증 실패', async ({ page }) => {
      const emailInput = page.locator('input[type="text"]').first();
      const passwordInput = page.locator('input[type="password"]');
      const loginButton = page.locator('button[type="submit"]');

      // 이메일 형식이 잘못된 경우
      await emailInput.fill('invalid-email');
      await passwordInput.fill('password123');

      // 버튼이 비활성화되어 있는지 확인 (검증 실패)
      await expect(loginButton).toBeDisabled({ timeout: 500 });

      // 에러 메시지 확인
      const errorMessage = page.locator(
        'text=/이메일 형식이 올바르지 않습니다/'
      );
      await expect(errorMessage).toBeVisible({ timeout: 500 });
    });

    test('비밀번호 미입력 검증 실패', async ({ page }) => {
      const emailInput = page.locator('input[type="text"]').first();
      const passwordInput = page.locator('input[type="password"]');
      const loginButton = page.locator('button[type="submit"]');

      // 이메일만 입력
      await emailInput.fill('test@test.com');

      // 버튼이 비활성화되어 있는지 확인
      await expect(loginButton).toBeDisabled({ timeout: 500 });

      // 비밀번호 입력
      await passwordInput.fill('password123');

      // 버튼 활성화 확인
      await expect(loginButton).toBeEnabled({ timeout: 500 });
    });
  });
});
