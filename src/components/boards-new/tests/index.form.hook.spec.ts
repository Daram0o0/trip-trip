import { test, expect } from '@playwright/test';

test.describe('Boards New Form Hook', () => {
  test.beforeEach(async ({ page }) => {
    // localStorage 초기화
    await page.goto('/boards/new');
    await page.evaluate(() => {
      localStorage.clear();
    });

    // 페이지 로드 대기 - data-testid 사용 (network 통신이 아니므로 500ms 미만)
    await page.waitForSelector('[data-testid="boards-new-container"]', {
      timeout: 500,
    });
  });

  test.describe('성공 시나리오', () => {
    test('게시물 작성 성공 - 실제 API 사용', async ({ page }) => {
      // 모든 필수 인풋이 입력되면 등록하기 버튼 활성화 확인
      const writerInput = page.locator('input[type="text"]').first();
      const passwordInput = page.locator('input[type="password"]').first();
      const titleInput = page.locator('input[type="text"]').nth(1);
      const contentsTextarea = page.locator('textarea').first();
      const submitButton = page.locator('button:has-text("등록하기")');

      // 초기 상태: 버튼 비활성화
      await expect(submitButton).toBeDisabled();

      // 작성자 입력
      await writerInput.fill('테스트작성자');

      // 비밀번호 입력
      await passwordInput.fill('testpass123');

      // 제목 입력
      await titleInput.fill('테스트 제목');

      // 내용 입력
      await contentsTextarea.fill('테스트 내용입니다.');

      // 버튼 활성화 확인
      await expect(submitButton).toBeEnabled({ timeout: 500 });

      // 등록하기 버튼 클릭
      await submitButton.click();

      // createBoard API 응답 확인 (_id 포함) (network 통신이므로 2000ms 미만)
      const createBoardResponsePromise = page.waitForResponse(
        response => {
          const url = response.url();
          const method = response.request().method();
          const postData = response.request().postData();
          return (
            url.includes('/graphql') &&
            method === 'POST' &&
            (postData?.includes('CreateBoard') ?? false)
          );
        },
        { timeout: 2000 }
      );

      const createBoardResponse = await createBoardResponsePromise;
      const createBoardData = await createBoardResponse.json();

      // _id가 정상적으로 반환되는지 확인
      expect(createBoardData.data.createBoard).toBeDefined();
      expect(createBoardData.data.createBoard._id).toBeTruthy();

      // 게시물 작성 성공 모달 표시 확인 (network 통신이므로 2000ms 미만)
      const modal = page.locator('text=작성완료');
      await expect(modal).toBeVisible({ timeout: 2000 });

      // 모달 확인 버튼 클릭 (network 통신이 아니므로 500ms 미만)
      const confirmButton = page.locator('button:has-text("확인")');
      await confirmButton.click({ timeout: 500 });

      // 게시물 상세 페이지로 이동 확인 (네트워크 통신이므로 2000ms)
      await expect(page).toHaveURL(/.*\/boards\/.+/, { timeout: 2000 });
    });

    test('게시물 작성 성공 - 주소 없이', async ({ page }) => {
      const writerInput = page.locator('input[type="text"]').first();
      const passwordInput = page.locator('input[type="password"]').first();
      const titleInput = page.locator('input[type="text"]').nth(1);
      const contentsTextarea = page.locator('textarea').first();
      const submitButton = page.locator('button:has-text("등록하기")');

      // 필수 필드만 입력
      await writerInput.fill('테스트작성자');
      await passwordInput.fill('testpass123');
      await titleInput.fill('테스트 제목');
      await contentsTextarea.fill('테스트 내용입니다.');

      // 버튼 활성화 확인 (주소 없어도 활성화됨)
      await expect(submitButton).toBeEnabled({ timeout: 500 });
    });
  });

  test.describe('실패 시나리오', () => {
    test('게시물 작성 실패 - API 모킹', async ({ page }) => {
      const writerInput = page.locator('input[type="text"]').first();
      const passwordInput = page.locator('input[type="password"]').first();
      const titleInput = page.locator('input[type="text"]').nth(1);
      const contentsTextarea = page.locator('textarea').first();
      const submitButton = page.locator('button:has-text("등록하기")');

      // API 모킹: createBoard 실패 응답 (등록하기 버튼 클릭 전에 설정)
      await page.route('**/graphql', async route => {
        const request = route.request();
        const postData = request.postData() || '';

        if (postData.includes('CreateBoard')) {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              errors: [
                {
                  message: '게시물 작성에 실패했습니다.',
                },
              ],
            }),
          });
        } else {
          await route.continue();
        }
      });

      // 필수 필드 입력
      await writerInput.fill('테스트작성자');
      await passwordInput.fill('testpass123');
      await titleInput.fill('테스트 제목');
      await contentsTextarea.fill('테스트 내용입니다.');

      // 등록하기 버튼 클릭
      await submitButton.click();

      // 게시물 작성 실패 모달 표시 확인 (network 통신이므로 2000ms 미만)
      const modalTitle = page.locator('text=작성실패');
      await expect(modalTitle).toBeVisible({ timeout: 2000 });

      // 모달 확인 버튼 클릭 (network 통신이 아니므로 500ms 미만)
      const confirmButton = page.locator('button:has-text("확인")');
      await confirmButton.click({ timeout: 500 });

      // 모달이 닫히고 게시물 작성 페이지에 남아있는지 확인
      await expect(modalTitle).not.toBeVisible({ timeout: 500 });
      await expect(page).toHaveURL(/.*\/boards\/new/, { timeout: 500 });
    });

    test('작성자 미입력 검증 실패', async ({ page }) => {
      const passwordInput = page.locator('input[type="password"]').first();
      const titleInput = page.locator('input[type="text"]').nth(1);
      const contentsTextarea = page.locator('textarea').first();
      const submitButton = page.locator('button:has-text("등록하기")');

      // 작성자만 입력하지 않은 경우
      await passwordInput.fill('testpass123');
      await titleInput.fill('테스트 제목');
      await contentsTextarea.fill('테스트 내용입니다.');

      // 버튼이 비활성화되어 있는지 확인 (검증 실패)
      await expect(submitButton).toBeDisabled({ timeout: 500 });

      // 에러 메시지 확인
      const errorMessage = page.locator('text=/작성자를 입력해주세요/');
      await expect(errorMessage).toBeVisible({ timeout: 500 });
    });

    test('비밀번호 미입력 검증 실패', async ({ page }) => {
      const writerInput = page.locator('input[type="text"]').first();
      const titleInput = page.locator('input[type="text"]').nth(1);
      const contentsTextarea = page.locator('textarea').first();
      const submitButton = page.locator('button:has-text("등록하기")');

      // 비밀번호만 입력하지 않은 경우
      await writerInput.fill('테스트작성자');
      await titleInput.fill('테스트 제목');
      await contentsTextarea.fill('테스트 내용입니다.');

      // 버튼이 비활성화되어 있는지 확인
      await expect(submitButton).toBeDisabled({ timeout: 500 });

      // 에러 메시지 확인
      const errorMessage = page.locator('text=/비밀번호를 입력해주세요/');
      await expect(errorMessage).toBeVisible({ timeout: 500 });
    });

    test('제목 미입력 검증 실패', async ({ page }) => {
      const writerInput = page.locator('input[type="text"]').first();
      const passwordInput = page.locator('input[type="password"]').first();
      const contentsTextarea = page.locator('textarea').first();
      const submitButton = page.locator('button:has-text("등록하기")');

      // 제목만 입력하지 않은 경우
      await writerInput.fill('테스트작성자');
      await passwordInput.fill('testpass123');
      await contentsTextarea.fill('테스트 내용입니다.');

      // 버튼이 비활성화되어 있는지 확인
      await expect(submitButton).toBeDisabled({ timeout: 500 });

      // 에러 메시지 확인
      const errorMessage = page.locator('text=/제목을 입력해주세요/');
      await expect(errorMessage).toBeVisible({ timeout: 500 });
    });

    test('내용 미입력 검증 실패', async ({ page }) => {
      const writerInput = page.locator('input[type="text"]').first();
      const passwordInput = page.locator('input[type="password"]').first();
      const titleInput = page.locator('input[type="text"]').nth(1);
      const submitButton = page.locator('button:has-text("등록하기")');

      // 내용만 입력하지 않은 경우
      await writerInput.fill('테스트작성자');
      await passwordInput.fill('testpass123');
      await titleInput.fill('테스트 제목');

      // 버튼이 비활성화되어 있는지 확인
      await expect(submitButton).toBeDisabled({ timeout: 500 });

      // 에러 메시지 확인
      const errorMessage = page.locator('text=/내용을 입력해주세요/');
      await expect(errorMessage).toBeVisible({ timeout: 500 });
    });

    test('유튜브 링크 형식 검증 실패', async ({ page }) => {
      const writerInput = page.locator('input[type="text"]').first();
      const passwordInput = page.locator('input[type="password"]').first();
      const titleInput = page.locator('input[type="text"]').nth(1);
      const contentsTextarea = page.locator('textarea').first();
      const youtubeInput = page.locator('input[type="text"]').last();
      const submitButton = page.locator('button:has-text("등록하기")');

      // 필수 필드 입력
      await writerInput.fill('테스트작성자');
      await passwordInput.fill('testpass123');
      await titleInput.fill('테스트 제목');
      await contentsTextarea.fill('테스트 내용입니다.');

      // 잘못된 URL 형식 입력
      await youtubeInput.fill('invalid-url');

      // 버튼이 비활성화되어 있는지 확인
      await expect(submitButton).toBeDisabled({ timeout: 500 });

      // 에러 메시지 확인
      const errorMessage = page.locator('text=/올바른 URL 형식이 아닙니다/');
      await expect(errorMessage).toBeVisible({ timeout: 500 });
    });
  });
});
