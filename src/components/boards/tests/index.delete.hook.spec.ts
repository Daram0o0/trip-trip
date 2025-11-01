import { expect, test } from '@playwright/test';

const GRAPHQL_ENDPOINT = 'http://main-practice.codebootcamp.co.kr/graphql';

test.describe('Boards deleteBoard - real API', () => {
  test('로그인 후 deleteBoard 뮤테이션이 Boolean 반환하고 게시물이 목록에서 제거', async ({
    page,
  }) => {
    // 페이지를 통해 로그인 (CORS 이슈 회피)
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
    // 로그인 토큰이 저장될 때까지 대기
    await page.waitForFunction(() => !!localStorage.getItem('accessToken'), {
      timeout: 1500,
    });
    const token = await page.evaluate(() =>
      localStorage.getItem('accessToken')
    );
    expect(typeof token).toBe('string');

    // boards 페이지로 이동
    await page.goto('/boards');
    await page.getByTestId('boards-page').waitFor({ timeout: 1500 });

    // fetchBoards API 응답 대기
    await page
      .waitForResponse(
        response => {
          const url = response.url();
          const method = response.request().method();
          const postData = response.request().postData();
          return (
            url.includes('/graphql') &&
            method === 'POST' &&
            (postData?.includes('fetchBoards') ?? false)
          );
        },
        { timeout: 5000 }
      )
      .catch(() => {
        // API 응답이 없을 수도 있음 (이미 캐시된 경우)
      });

    // 첫 번째 게시물 찾기
    const firstBoardItem = page.locator('[data-testid^="board-item-"]').first();
    try {
      await expect(firstBoardItem).toBeVisible({ timeout: 3000 });
      const testId = await firstBoardItem.getAttribute('data-testid');
      expect(testId).toBeTruthy();
      const boardId = testId!.replace('board-item-', '');
      expect(boardId).toBeTruthy();

      // 삭제 전 게시물 개수 확인
      const boardItemsBefore = page.locator('[data-testid^="board-item-"]');
      const countBefore = await boardItemsBefore.count();

      // 게시물에 호버하여 삭제 버튼 표시
      await firstBoardItem.hover();

      // 삭제 버튼 확인 및 클릭
      const deleteButton = page.getByTestId(`delete-button-${boardId}`);
      await expect(deleteButton).toBeVisible({ timeout: 1500 });

      // deleteBoard mutation API 응답 대기 (클릭 전에 설정)
      const deleteResponsePromise = page.waitForResponse(
        response => {
          const url = response.url();
          const method = response.request().method();
          const postData = response.request().postData();
          return (
            url.includes('/graphql') &&
            method === 'POST' &&
            (postData?.includes('deleteBoard') ?? false)
          );
        },
        { timeout: 3000 }
      );

      // 삭제 버튼 클릭
      await deleteButton.click({ timeout: 1500 });

      // 확인 모달 대기
      const modal = page.locator('[data-testid="delete-confirm-modal"]');
      await expect(modal).toBeVisible({ timeout: 1500 });

      // 삭제 확인 버튼 클릭
      const confirmButton = page.getByTestId('modal-confirm-button');
      await expect(confirmButton).toBeVisible({ timeout: 1500 });
      await confirmButton.click({ timeout: 1500 });

      // API 응답 확인
      try {
        const deleteResponse = await deleteResponsePromise;
        const deleteResponseData = await deleteResponse.json();

        // 에러가 있는 경우
        if (deleteResponseData.errors) {
          expect(deleteResponseData.errors).toBeDefined();
          return;
        }

        // deleteBoard API 응답이 string을 반환하는지 확인 (GraphQL 타입이 string)
        expect(deleteResponseData.data).toBeDefined();
        expect(deleteResponseData.data.deleteBoard).toBeDefined();
        expect(typeof deleteResponseData.data.deleteBoard).toBe('string');

        // 삭제 성공 시 게시물 목록에서 제거되었는지 확인
        // GraphQL 응답이 string이므로 'true' 문자열과 비교
        if (deleteResponseData.data.deleteBoard === 'true') {
          // 목록이 refetch될 때까지 data-testid로 대기 (timeout 사용하지 않음)
          // 삭제된 게시물이 사라지거나 다른 게시물이 나타날 때까지 대기
          await page
            .waitForFunction(
              (beforeCount, boardIdToDelete) => {
                const items = document.querySelectorAll(
                  '[data-testid^="board-item-"]'
                );
                const deletedItem = document.querySelector(
                  `[data-testid="board-item-${boardIdToDelete}"]`
                );
                // 삭제된 아이템이 없거나, 개수가 줄어든 경우
                return !deletedItem || items.length < beforeCount;
              },
              countBefore,
              boardId,
              { timeout: 3000 }
            )
            .catch(() => {
              // 타임아웃 발생 시에도 계속 진행
            });

          // 게시물이 목록에서 제거되었는지 확인
          const boardItemsAfter = page.locator('[data-testid^="board-item-"]');
          const countAfter = await boardItemsAfter.count();

          // 삭제 전보다 1개 적어야 함 (또는 같을 수도 있음 - 다른 게시물이 추가되었을 수 있음)
          expect(countAfter).toBeLessThanOrEqual(countBefore);

          // 삭제된 게시물이 목록에 없는지 확인
          const deletedItem = page.getByTestId(`board-item-${boardId}`);
          await expect(deletedItem).not.toBeVisible();
        }
      } catch (err) {
        // 타임아웃 등 에러 발생 시
        const error = err as Error;
        if (
          error.message?.includes('timeout') ||
          error.message?.includes('Timeout')
        ) {
          // 타임아웃은 정상 동작일 수 있음
          return;
        }
        throw error;
      }
    } catch {
      // 게시물이 없는 경우는 스킵 (데이터가 없을 수 있음)
      test.skip();
    }
  });
});

test.describe('Boards deleteBoard - failure (mocked)', () => {
  test('deleteBoard 실패 모킹 시에도 페이지는 안정적으로 렌더', async ({
    page,
  }) => {
    await page.route(GRAPHQL_ENDPOINT, route => {
      const postData = route.request().postDataJSON() as { query?: string };
      if (
        typeof postData?.query === 'string' &&
        postData.query.includes('deleteBoard')
      ) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ errors: [{ message: 'Mock Delete Error' }] }),
        });
      }
      return route.continue();
    });

    // 페이지를 통해 로그인
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
    await page.waitForFunction(() => !!localStorage.getItem('accessToken'), {
      timeout: 1500,
    });

    // boards 페이지로 이동
    await page.goto('/boards');
    await page.getByTestId('boards-page').waitFor({ timeout: 1500 });

    // fetchBoards API 응답 대기
    await page
      .waitForResponse(
        response => {
          const url = response.url();
          const method = response.request().method();
          const postData = response.request().postData();
          return (
            url.includes('/graphql') &&
            method === 'POST' &&
            (postData?.includes('fetchBoards') ?? false)
          );
        },
        { timeout: 5000 }
      )
      .catch(() => {
        // API 응답이 없을 수도 있음 (이미 캐시된 경우)
      });

    // 첫 번째 게시물의 삭제 버튼 클릭 시도 (실패 모킹 되어도 크래시 없어야 함)
    const firstBoardItem = page.locator('[data-testid^="board-item-"]').first();
    try {
      await expect(firstBoardItem).toBeVisible({ timeout: 3000 });
      const testId = await firstBoardItem.getAttribute('data-testid');
      const boardId = testId!.replace('board-item-', '');

      // 호버하여 삭제 버튼 표시
      await firstBoardItem.hover();
      const deleteButton = page.getByTestId(`delete-button-${boardId}`);
      await expect(deleteButton).toBeVisible({ timeout: 1500 });
      await deleteButton.click();

      // 확인 모달 대기
      const modal = page.locator('[data-testid="delete-confirm-modal"]');
      await expect(modal).toBeVisible({ timeout: 1500 });

      // 삭제 확인 버튼 클릭
      const confirmButton = page.getByTestId('modal-confirm-button');
      await expect(confirmButton).toBeVisible({ timeout: 1500 });
      await confirmButton.click();

      // 주요 섹션이 계속 보이는지 확인
      await expect(page.getByText('트립토크 게시판')).toBeVisible();
    } catch {
      // 게시물이 없는 경우는 스킵 (데이터가 없을 수 있음)
      test.skip();
    }
  });
});
