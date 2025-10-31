import { test, expect } from '@playwright/test';

test.describe('Auth Signup Form Hook', () => {
  test.beforeEach(async ({ page }) => {
    // localStorage 초기화
    await page.goto('/auth/signup');
    await page.evaluate(() => {
      localStorage.clear();
    });

    // 페이지 로드 대기 - data-testid 사용
    await page.waitForSelector('[data-testid="auth-signup-container"]', {
      timeout: 1500,
    });
  });

  test.describe('성공 시나리오', () => {
    test('회원가입 성공 - 실제 API 사용', async ({ page }) => {
      // 모든 인풋이 입력되면 회원가입버튼 활성화 확인
      const emailInput = page.locator('input[type="text"]').first();
      const nameInput = page.locator('input[type="text"]').nth(1);
      const passwordInput = page.locator('input[type="password"]').first();
      const passwordConfirmInput = page
        .locator('input[type="password"]')
        .nth(1);
      const signupButton = page.locator('button[type="submit"]');

      // 초기 상태: 버튼 비활성화
      await expect(signupButton).toBeDisabled();

      // timestamp를 포함한 이메일 생성
      const timestamp = Date.now();
      const email = `test${timestamp}@test.com`;
      const password = 'testpass123';
      const name = '테스트사용자';

      // 이메일 입력
      await emailInput.fill(email);

      // 이름 입력
      await nameInput.fill(name);

      // 비밀번호 입력
      await passwordInput.fill(password);

      // 비밀번호 확인 입력
      await passwordConfirmInput.fill(password);

      // 버튼 활성화 확인
      await expect(signupButton).toBeEnabled({ timeout: 500 });

      // 회원가입 버튼 클릭
      await signupButton.click();

      // createUser API 응답 확인 (_id 포함)
      const signupResponsePromise = page.waitForResponse(
        response => {
          const url = response.url();
          const method = response.request().method();
          const postData = response.request().postData();
          return (
            url.includes('/graphql') &&
            method === 'POST' &&
            (postData?.includes('CreateUser') ?? false)
          );
        },
        { timeout: 10000 }
      );

      const signupResponse = await signupResponsePromise;
      const signupData = await signupResponse.json();

      // _id가 정상적으로 반환되는지 확인
      expect(signupData.data.createUser).toBeDefined();
      expect(signupData.data.createUser._id).toBeTruthy();

      // 회원가입 성공 모달 표시 확인
      const modal = page.locator('text=가입완료');
      await expect(modal).toBeVisible({ timeout: 2000 });

      // 모달 확인 버튼 클릭
      const confirmButton = page.locator('button:has-text("확인")');
      await confirmButton.click({ timeout: 1500 });

      // 로그인 페이지로 이동 확인 (네트워크 통신이므로 2000ms)
      await expect(page).toHaveURL(/.*\/auth\/login/, { timeout: 2000 });
    });
  });

  test.describe('실패 시나리오', () => {
    test('회원가입 실패 - API 모킹', async ({ page }) => {
      const emailInput = page.locator('input[type="text"]').first();
      const nameInput = page.locator('input[type="text"]').nth(1);
      const passwordInput = page.locator('input[type="password"]').first();
      const passwordConfirmInput = page
        .locator('input[type="password"]')
        .nth(1);
      const signupButton = page.locator('button[type="submit"]');

      // API 모킹: createUser 실패 응답 (회원가입 버튼 클릭 전에 설정)
      await page.route('**/graphql', async route => {
        const request = route.request();
        const postData = request.postData() || '';

        if (postData.includes('CreateUser')) {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              errors: [
                {
                  message: '이미 등록된 이메일입니다.',
                },
              ],
            }),
          });
        } else {
          await route.continue();
        }
      });

      // 이메일 입력
      await emailInput.fill('test@test.com');

      // 이름 입력
      await nameInput.fill('테스트사용자');

      // 비밀번호 입력
      await passwordInput.fill('testpass123');

      // 비밀번호 확인 입력
      await passwordConfirmInput.fill('testpass123');

      // 회원가입 버튼 클릭
      await signupButton.click();

      // 회원가입 실패 모달 표시 확인 (네트워크 통신이므로 2000ms)
      const modalTitle = page.locator('text=가입실패');
      await expect(modalTitle).toBeVisible({ timeout: 2000 });

      // 모달 확인 버튼 클릭
      const confirmButton = page.locator('button:has-text("확인")');
      await confirmButton.click({ timeout: 1500 });

      // 모달이 닫히고 회원가입 페이지에 남아있는지 확인
      await expect(modalTitle).not.toBeVisible({ timeout: 500 });
      await expect(page).toHaveURL(/.*\/auth\/signup/, { timeout: 500 });
    });

    test('이메일 형식 검증 실패', async ({ page }) => {
      const emailInput = page.locator('input[type="text"]').first();
      const nameInput = page.locator('input[type="text"]').nth(1);
      const passwordInput = page.locator('input[type="password"]').first();
      const passwordConfirmInput = page
        .locator('input[type="password"]')
        .nth(1);
      const signupButton = page.locator('button[type="submit"]');

      // 이메일 형식이 잘못된 경우
      await emailInput.fill('invalid-email');
      await nameInput.fill('테스트사용자');
      await passwordInput.fill('testpass123');
      await passwordConfirmInput.fill('testpass123');

      // 버튼이 비활성화되어 있는지 확인 (검증 실패)
      await expect(signupButton).toBeDisabled({ timeout: 500 });

      // 에러 메시지 확인
      const errorMessage = page.locator(
        'text=/이메일 형식이 올바르지 않습니다/'
      );
      await expect(errorMessage).toBeVisible({ timeout: 500 });
    });

    test('비밀번호 형식 검증 실패 - 영문 미포함', async ({ page }) => {
      const emailInput = page.locator('input[type="text"]').first();
      const nameInput = page.locator('input[type="text"]').nth(1);
      const passwordInput = page.locator('input[type="password"]').first();
      const passwordConfirmInput = page
        .locator('input[type="password"]')
        .nth(1);
      const signupButton = page.locator('button[type="submit"]');

      // 비밀번호에 영문이 없는 경우
      await emailInput.fill('test@test.com');
      await nameInput.fill('테스트사용자');
      await passwordInput.fill('12345678');
      await passwordConfirmInput.fill('12345678');

      // 버튼이 비활성화되어 있는지 확인
      await expect(signupButton).toBeDisabled({ timeout: 500 });

      // 에러 메시지 확인
      const errorMessage = page.locator(
        'text=/영문과 숫자를 포함한 8자리 이상의 비밀번호를 입력해주세요/'
      );
      await expect(errorMessage).toBeVisible({ timeout: 500 });
    });

    test('비밀번호 형식 검증 실패 - 숫자 미포함', async ({ page }) => {
      const emailInput = page.locator('input[type="text"]').first();
      const nameInput = page.locator('input[type="text"]').nth(1);
      const passwordInput = page.locator('input[type="password"]').first();
      const passwordConfirmInput = page
        .locator('input[type="password"]')
        .nth(1);
      const signupButton = page.locator('button[type="submit"]');

      // 비밀번호에 숫자가 없는 경우
      await emailInput.fill('test@test.com');
      await nameInput.fill('테스트사용자');
      await passwordInput.fill('testpass');
      await passwordConfirmInput.fill('testpass');

      // 버튼이 비활성화되어 있는지 확인
      await expect(signupButton).toBeDisabled({ timeout: 500 });

      // 에러 메시지 확인
      const errorMessage = page.locator(
        'text=/영문과 숫자를 포함한 8자리 이상의 비밀번호를 입력해주세요/'
      );
      await expect(errorMessage).toBeVisible({ timeout: 500 });
    });

    test('비밀번호 형식 검증 실패 - 8자리 미만', async ({ page }) => {
      const emailInput = page.locator('input[type="text"]').first();
      const nameInput = page.locator('input[type="text"]').nth(1);
      const passwordInput = page.locator('input[type="password"]').first();
      const passwordConfirmInput = page
        .locator('input[type="password"]')
        .nth(1);
      const signupButton = page.locator('button[type="submit"]');

      // 비밀번호가 8자리 미만인 경우
      await emailInput.fill('test@test.com');
      await nameInput.fill('테스트사용자');
      await passwordInput.fill('test12');
      await passwordConfirmInput.fill('test12');

      // 버튼이 비활성화되어 있는지 확인
      await expect(signupButton).toBeDisabled({ timeout: 500 });

      // 에러 메시지 확인
      const errorMessage = page.locator(
        'text=/영문과 숫자를 포함한 8자리 이상의 비밀번호를 입력해주세요/'
      );
      await expect(errorMessage).toBeVisible({ timeout: 500 });
    });

    test('비밀번호 확인 불일치 검증 실패', async ({ page }) => {
      const emailInput = page.locator('input[type="text"]').first();
      const nameInput = page.locator('input[type="text"]').nth(1);
      const passwordInput = page.locator('input[type="password"]').first();
      const passwordConfirmInput = page
        .locator('input[type="password"]')
        .nth(1);
      const signupButton = page.locator('button[type="submit"]');

      // 비밀번호와 비밀번호 확인이 일치하지 않는 경우
      await emailInput.fill('test@test.com');
      await nameInput.fill('테스트사용자');
      await passwordInput.fill('testpass123');
      await passwordConfirmInput.fill('testpass456');

      // 버튼이 비활성화되어 있는지 확인
      await expect(signupButton).toBeDisabled({ timeout: 500 });

      // 에러 메시지 확인
      const errorMessage = page.locator('text=/비밀번호가 일치하지 않습니다/');
      await expect(errorMessage).toBeVisible({ timeout: 500 });
    });

    test('이름 미입력 검증 실패', async ({ page }) => {
      const emailInput = page.locator('input[type="text"]').first();
      const passwordInput = page.locator('input[type="password"]').first();
      const passwordConfirmInput = page
        .locator('input[type="password"]')
        .nth(1);
      const signupButton = page.locator('button[type="submit"]');

      // 이름만 입력하지 않은 경우
      await emailInput.fill('test@test.com');
      await passwordInput.fill('testpass123');
      await passwordConfirmInput.fill('testpass123');

      // 버튼이 비활성화되어 있는지 확인
      await expect(signupButton).toBeDisabled({ timeout: 500 });
    });
  });
});
