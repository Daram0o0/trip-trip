import { expect, test } from '@playwright/test';

const GRAPHQL_ENDPOINT = 'http://main-practice.codebootcamp.co.kr/graphql';

test.describe('Boards binding - real APIs', () => {
  test('UI 바인딩이 실제 API 데이터와 일치한다', async ({ page, request }) => {
    await page.goto('/boards');
    await page.getByTestId('boards-page').waitFor();

    // 서버 데이터 조회: count, best
    const resCount = await request.post(GRAPHQL_ENDPOINT, {
      data: { query: `query { fetchBoardsCount }` },
    });
    expect(resCount.ok()).toBeTruthy();
    const countJson = await resCount.json();
    const totalCount: number = countJson.data.fetchBoardsCount;
    expect(typeof totalCount).toBe('number');

    const resBest = await request.post(GRAPHQL_ENDPOINT, {
      data: {
        query: `query { fetchBoardsOfTheBest { _id } }`,
      },
    });
    expect(resBest.ok()).toBeTruthy();
    const bestJson = await resBest.json();
    const bestLength: number = (bestJson.data.fetchBoardsOfTheBest ?? [])
      .length;

    // 갤러리: 베스트 카드 개수 일치 확인
    const hotCards = page.locator('[data-testid^="hot-card-"]');
    await expect(hotCards.first()).toBeVisible();
    await expect(hotCards).toHaveCount(bestLength);

    // 리스트: 첫 행의 번호가 totalCount와 같아야 함 (page=1, index=0)
    const firstRow = page.locator('[data-testid^="board-item-"]').first();
    await expect(firstRow).toBeVisible();
    const firstNumberText = await firstRow.locator('div').nth(0).innerText();
    const firstNumber = parseInt(firstNumberText.replace(/[^0-9]/g, ''), 10);
    expect(firstNumber).toBe(totalCount);
  });
});

test.describe('Boards binding - failure scenario (mock)', () => {
  test('fetchBoards 실패 모킹 시에도 페이지가 안정적으로 렌더', async ({
    page,
  }) => {
    await page.route(GRAPHQL_ENDPOINT, route => {
      const postData = route.request().postDataJSON() as { query?: string };
      if (
        typeof postData?.query === 'string' &&
        postData.query.includes('fetchBoards')
      ) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ errors: [{ message: 'Mocked error' }] }),
        });
      }
      return route.continue();
    });

    await page.goto('/boards');
    await page.getByTestId('boards-page').waitFor();

    // 크래시 없이 주요 섹션 타이틀이 노출되어야 함
    await expect(page.getByText('오늘 핫한 트립토크')).toBeVisible();
  });
});
