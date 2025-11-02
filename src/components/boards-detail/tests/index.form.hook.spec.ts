import { test, expect } from '@playwright/test';

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
  // 로그인 토큰과 사용자 정보가 저장될 때까지 대기
  await page.waitForFunction(
    () =>
      !!localStorage.getItem('accessToken') && !!localStorage.getItem('user'),
    {
      timeout: 10000,
    }
  );
}

test.describe('Boards Detail Comment Form Hook', () => {
  // 테스트에 사용할 게시물 ID (실제 게시물이 있어야 함)
  let boardId: string;

  test.beforeAll(async ({ browser }) => {
    // 먼저 로그인하고 게시물 ID 가져오기
    const context = await browser.newContext();
    const page = await context.newPage();

    await login(page);

    // 게시물 목록 페이지로 이동하여 첫 번째 게시물 ID 가져오기
    await page.goto('/boards');
    await page.waitForSelector('[data-testid="boards-page"]', {
      timeout: 2000,
    });

    // 첫 번째 게시물 링크 클릭하여 상세 페이지로 이동
    const firstBoardLink = page.locator('a[href*="/boards/"]').first();
    if ((await firstBoardLink.count()) > 0) {
      const href = await firstBoardLink.getAttribute('href');
      if (href) {
        boardId = href.split('/boards/')[1];
      }
    }

    await context.close();
  });

  test.describe('성공 시나리오', () => {
    test('댓글 작성 성공 - 로그인된 사용자 - 실제 API 사용', async ({
      page,
    }) => {
      // 로그인 먼저 수행
      await login(page);

      // 게시물 상세 페이지로 이동
      if (!boardId) {
        // boardId가 없으면 목록에서 첫 번째 게시물 찾기
        await page.goto('/boards');
        await page.waitForSelector('[data-testid="boards-page"]', {
          timeout: 2000,
        });
        const firstBoardLink = page.locator('a[href*="/boards/"]').first();
        await firstBoardLink.click();
      } else {
        await page.goto(`/boards/${boardId}`);
      }

      // 페이지 로드 대기
      await page.waitForSelector('[data-testid="board-detail-page"]', {
        timeout: 2000,
      });

      // 별점 클릭 (5점 선택)
      const stars = page.locator('[data-testid^="star-"]');
      const firstStar = stars.first();
      await firstStar.click({ timeout: 500 });

      // 댓글 내용 입력
      const commentInput = page.locator(
        '[data-testid="comment-contents-input"]'
      );
      await commentInput.fill('테스트 댓글입니다.');

      // 댓글 등록 버튼 활성화 확인
      const submitButton = page.locator(
        '[data-testid="comment-submit-button"]'
      );
      await expect(submitButton).toBeEnabled({ timeout: 500 });

      // 댓글 등록 버튼 클릭
      await submitButton.click();

      // createBoardComment API 응답 확인 (network 통신이므로 2000ms 미만)
      const commentResponsePromise = page.waitForResponse(
        response => {
          const url = response.url();
          const method = response.request().method();
          const postData = response.request().postData();
          return (
            url.includes('/graphql') &&
            method === 'POST' &&
            ((postData?.includes('createBoardComment') ||
              postData?.includes('CreateBoardComment')) ??
              false)
          );
        },
        { timeout: 2000 }
      );

      const commentResponse = await commentResponsePromise;
      const commentData = await commentResponse.json();

      // BoardComment가 정상적으로 반환되는지 확인
      expect(commentData.data.createBoardComment).toBeDefined();
      expect(commentData.data.createBoardComment._id).toBeTruthy();
      expect(commentData.data.createBoardComment.contents).toBeTruthy();
      expect(commentData.data.createBoardComment.rating).toBeGreaterThanOrEqual(
        1
      );

      // 댓글 작성 성공 모달 표시 확인
      const modal = page.locator('text=작성완료');
      await expect(modal).toBeVisible({ timeout: 2000 });

      // 모달 확인 버튼 클릭
      const confirmButton = page.locator('button:has-text("확인")');
      await confirmButton.click({ timeout: 500 });

      // 폼이 초기화되었는지 확인 (댓글 내용이 비어있음)
      const clearedCommentInput = page.locator(
        '[data-testid="comment-contents-input"]'
      );
      await expect(clearedCommentInput).toHaveValue('', { timeout: 500 });
    });

    test('댓글 작성 성공 - 비로그인 사용자 - 실제 API 사용', async ({
      page,
    }) => {
      // localStorage 초기화 (로그인하지 않은 상태)
      await page.goto('/');
      await page.evaluate(() => {
        localStorage.clear();
      });

      // 게시물 상세 페이지로 이동
      if (!boardId) {
        await page.goto('/boards');
        await page.waitForSelector('[data-testid="boards-page"]', {
          timeout: 2000,
        });
        const firstBoardLink = page.locator('a[href*="/boards/"]').first();
        await firstBoardLink.click();
      } else {
        await page.goto(`/boards/${boardId}`);
      }

      // 페이지 로드 대기
      await page.waitForSelector('[data-testid="board-detail-page"]', {
        timeout: 2000,
      });

      // 작성자 입력
      const writerInput = page.locator('[data-testid="comment-author-input"]');
      await writerInput.fill('비회원작성자');

      // 비밀번호 입력
      const passwordInput = page.locator(
        '[data-testid="comment-password-input"]'
      );
      await passwordInput.fill('testpass123');

      // 별점 클릭 (5점 선택)
      const stars = page.locator('[data-testid^="star-"]');
      const firstStar = stars.first();
      await firstStar.click({ timeout: 500 });

      // 댓글 내용 입력
      const commentInput = page.locator(
        '[data-testid="comment-contents-input"]'
      );
      await commentInput.fill('비회원 댓글 테스트입니다.');

      // 댓글 등록 버튼 활성화 확인
      const submitButton = page.locator(
        '[data-testid="comment-submit-button"]'
      );
      await expect(submitButton).toBeEnabled({ timeout: 500 });

      // 댓글 등록 버튼 클릭
      await submitButton.click();

      // createBoardComment API 응답 확인
      const commentResponsePromise = page.waitForResponse(
        response => {
          const url = response.url();
          const method = response.request().method();
          const postData = response.request().postData();
          return (
            url.includes('/graphql') &&
            method === 'POST' &&
            ((postData?.includes('createBoardComment') ||
              postData?.includes('CreateBoardComment')) ??
              false)
          );
        },
        { timeout: 2000 }
      );

      const commentResponse = await commentResponsePromise;
      const commentData = await commentResponse.json();

      // BoardComment가 정상적으로 반환되는지 확인
      expect(commentData.data.createBoardComment).toBeDefined();
      expect(commentData.data.createBoardComment._id).toBeTruthy();
      expect(commentData.data.createBoardComment.contents).toBeTruthy();

      // 댓글 작성 성공 모달 표시 확인
      const modal = page.locator('text=작성완료');
      await expect(modal).toBeVisible({ timeout: 2000 });
    });
  });

  test.describe('실패 시나리오', () => {
    test('댓글 작성 실패 - 필수 필드 미입력', async ({ page }) => {
      await page.goto('/');
      await page.evaluate(() => {
        localStorage.clear();
      });

      // 게시물 상세 페이지로 이동
      if (!boardId) {
        await page.goto('/boards');
        await page.waitForSelector('[data-testid="boards-page"]', {
          timeout: 2000,
        });
        const firstBoardLink = page.locator('a[href*="/boards/"]').first();
        await firstBoardLink.click();
      } else {
        await page.goto(`/boards/${boardId}`);
      }

      // 페이지 로드 대기
      await page.waitForSelector('[data-testid="board-detail-page"]', {
        timeout: 2000,
      });

      // 댓글 등록 버튼은 비활성화 상태
      const submitButton = page.locator(
        '[data-testid="comment-submit-button"]'
      );
      await expect(submitButton).toBeDisabled({ timeout: 500 });

      // 별점을 선택하지 않고 댓글만 입력
      const commentInput = page.locator(
        '[data-testid="comment-contents-input"]'
      );
      await commentInput.fill('별점 없이 댓글 작성 테스트');

      // 여전히 비활성화 상태 (별점이 없으므로)
      await expect(submitButton).toBeDisabled({ timeout: 500 });
    });

    test('댓글 작성 실패 - 별점 미선택', async ({ page }) => {
      await login(page);

      // 게시물 상세 페이지로 이동
      if (!boardId) {
        await page.goto('/boards');
        await page.waitForSelector('[data-testid="boards-page"]', {
          timeout: 2000,
        });
        const firstBoardLink = page.locator('a[href*="/boards/"]').first();
        await firstBoardLink.click();
      } else {
        await page.goto(`/boards/${boardId}`);
      }

      // 페이지 로드 대기
      await page.waitForSelector('[data-testid="board-detail-page"]', {
        timeout: 2000,
      });

      // 별점을 선택하지 않고 댓글만 입력
      const commentInput = page.locator(
        '[data-testid="comment-contents-input"]'
      );
      await commentInput.fill('별점 없이 댓글 작성 테스트');

      // 댓글 등록 버튼은 비활성화 상태
      const submitButton = page.locator(
        '[data-testid="comment-submit-button"]'
      );
      await expect(submitButton).toBeDisabled({ timeout: 500 });
    });

    test('댓글 작성 실패 - 댓글 내용 초과 (100자)', async ({ page }) => {
      await login(page);

      // 게시물 상세 페이지로 이동
      if (!boardId) {
        await page.goto('/boards');
        await page.waitForSelector('[data-testid="boards-page"]', {
          timeout: 2000,
        });
        const firstBoardLink = page.locator('a[href*="/boards/"]').first();
        await firstBoardLink.click();
      } else {
        await page.goto(`/boards/${boardId}`);
      }

      // 페이지 로드 대기
      await page.waitForSelector('[data-testid="board-detail-page"]', {
        timeout: 2000,
      });

      // 별점 선택
      const stars = page.locator('[data-testid^="star-"]');
      const firstStar = stars.first();
      await firstStar.click({ timeout: 500 });

      // 100자 초과 댓글 입력 (101자)
      const longComment = '가'.repeat(101);
      const commentInput = page.locator(
        '[data-testid="comment-contents-input"]'
      );
      await commentInput.fill(longComment);

      // maxLength 속성으로 인해 100자로 제한됨을 확인
      const value = await commentInput.inputValue();
      expect(value.length).toBeLessThanOrEqual(100);
    });
  });

  test.describe('유효성 검증', () => {
    test('필수 필드 입력 시 버튼 활성화', async ({ page }) => {
      await page.goto('/');
      await page.evaluate(() => {
        localStorage.clear();
      });

      // 게시물 상세 페이지로 이동
      if (!boardId) {
        await page.goto('/boards');
        await page.waitForSelector('[data-testid="boards-page"]', {
          timeout: 2000,
        });
        const firstBoardLink = page.locator('a[href*="/boards/"]').first();
        await firstBoardLink.click();
      } else {
        await page.goto(`/boards/${boardId}`);
      }

      await page.waitForSelector('[data-testid="board-detail-page"]', {
        timeout: 2000,
      });

      const submitButton = page.locator(
        '[data-testid="comment-submit-button"]'
      );

      // 초기 상태: 비활성화
      await expect(submitButton).toBeDisabled({ timeout: 500 });

      // 작성자 입력
      const writerInput = page.locator('[data-testid="comment-author-input"]');
      await writerInput.fill('테스트');

      // 여전히 비활성화 (비밀번호, 별점, 댓글 없음)
      await expect(submitButton).toBeDisabled({ timeout: 500 });

      // 비밀번호 입력
      const passwordInput = page.locator(
        '[data-testid="comment-password-input"]'
      );
      await passwordInput.fill('test');

      // 여전히 비활성화 (별점, 댓글 없음)
      await expect(submitButton).toBeDisabled({ timeout: 500 });

      // 별점 선택
      const stars = page.locator('[data-testid^="star-"]');
      const firstStar = stars.first();
      await firstStar.click({ timeout: 500 });

      // 여전히 비활성화 (댓글 없음)
      await expect(submitButton).toBeDisabled({ timeout: 500 });

      // 댓글 입력
      const commentInput = page.locator(
        '[data-testid="comment-contents-input"]'
      );
      await commentInput.fill('테스트 댓글');

      // 모든 필수 필드 입력 완료 - 버튼 활성화
      await expect(submitButton).toBeEnabled({ timeout: 500 });
    });
  });
});
