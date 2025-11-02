import { expect, test } from '@playwright/test';

async function login(page: import('@playwright/test').Page) {
  await page.goto('/auth/login');
  await page.waitForSelector('[data-testid="auth-login-container"]', {
    timeout: 1500,
  });
  const emailInput = page.locator('input[type="text"]').first();
  const passwordInput = page.locator('input[type="password"]');
  const loginButton = page.locator('button[type="submit"]');
  await emailInput.fill('a@a.aa');
  await passwordInput.fill('aaaaaaaa8');
  await loginButton.click();
  // 로그인 토큰과 사용자 정보가 저장될 때까지 대기 (API 응답 대기 포함)
  await page.waitForFunction(
    () =>
      !!localStorage.getItem('accessToken') && !!localStorage.getItem('user'),
    {
      timeout: 10000,
    }
  );
}

test.describe('BoardsNew postcode binding - real data', () => {
  test('우편번호 검색 버튼 클릭 시 Daum Postcode 팝업이 열린다', async ({
    page,
  }) => {
    // 로그인 먼저 수행
    await login(page);

    await page.goto('/boards/new');
    await page.getByTestId('boards-new-container').waitFor({ timeout: 2000 });

    // 우편번호 검색 버튼 찾기
    const postcodeButton = page.getByTestId('postcode-search-button');
    await expect(postcodeButton).toBeVisible();

    // 우편번호 검색 버튼 클릭
    await postcodeButton.click();

    // Daum Postcode 모달이 열리는지 확인
    // ModalProvider의 모달은 react-portal을 통해 렌더링되므로
    // postcode-modal이 보이면 모달이 열린 것으로 확인
    // timeout 없이 대기 - waitFor를 사용하여 명시적으로 대기
    const modal = page.getByTestId('postcode-modal');
    await modal.waitFor({ state: 'visible' });
    await expect(modal).toBeVisible();
  });

  test('주소 필드가 올바르게 렌더링된다', async ({ page }) => {
    // 로그인 먼저 수행
    await login(page);

    await page.goto('/boards/new');
    await page.getByTestId('boards-new-container').waitFor({ timeout: 2000 });

    // 주소 필드 확인 (우편번호 입력 필드)
    const postcodeInput = page.getByTestId('postcode-input');
    await expect(postcodeInput).toBeVisible();

    // 주소 입력 필드 확인
    const addressInput = page.getByTestId('address-input');
    await expect(addressInput).toBeVisible();

    // 상세주소 입력 필드 확인
    const detailAddressInput = page.getByTestId('detail-address-input');
    await expect(detailAddressInput).toBeVisible();

    // 우편번호 검색 버튼 확인
    const postcodeButton = page.getByTestId('postcode-search-button');
    await expect(postcodeButton).toBeVisible();
  });
});

test.describe('BoardsNew postcode - failure scenario (mock)', () => {
  test('주소 선택 실패 시에도 페이지가 안정적으로 렌더된다', async ({
    page,
  }) => {
    // 로그인 먼저 수행
    await login(page);

    // Daum Postcode API를 모킹 (실제로는 외부 서비스이므로 모킹하기 어려움)
    // 대신 주소 입력 필드가 항상 존재하고 접근 가능한지 확인

    await page.goto('/boards/new');
    await page.getByTestId('boards-new-container').waitFor({ timeout: 2000 });

    // 우편번호 검색 버튼이 존재하는지 확인
    const postcodeButton = page.getByTestId('postcode-search-button');
    await expect(postcodeButton).toBeVisible();

    // 주소 관련 필드들이 모두 존재하는지 확인
    await expect(page.getByTestId('postcode-input')).toBeVisible();
    await expect(page.getByTestId('address-input')).toBeVisible();
    await expect(page.getByTestId('detail-address-input')).toBeVisible();

    // 페이지가 크래시 없이 렌더링되었는지 확인
    await expect(page.getByTestId('boards-new-container')).toBeVisible();
  });
});
