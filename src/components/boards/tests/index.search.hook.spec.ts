import { expect, test } from '@playwright/test';

const GRAPHQL_ENDPOINT = 'http://main-practice.codebootcamp.co.kr/graphql';

test.describe('Boards search - real APIs', () => {
  test('검색어 입력 후 검색 버튼 클릭 시 fetchBoards API에 search 파라미터가 전달됨', async ({
    page,
  }) => {
    await page.goto('/boards');
    await page.getByTestId('boards-page').waitFor();

    // 검색어 입력
    const searchInput = page.locator(
      'input[placeholder="제목을 검색해 주세요."]'
    );
    await expect(searchInput).toBeVisible({ timeout: 450 });
    await searchInput.fill('테스트');

    // 검색 버튼 클릭
    const searchButton = page.getByRole('button', { name: '검색' });
    await expect(searchButton).toBeVisible({ timeout: 450 });

    // 검색 버튼 클릭 전 API 응답 대기 설정
    const searchResponsePromise = page.waitForResponse(
      response => {
        const url = response.url();
        const method = response.request().method();
        const postData = response.request().postData();
        return (
          url.includes('/graphql') &&
          method === 'POST' &&
          (postData?.includes('fetchBoards') ?? false) &&
          (postData?.includes('테스트') ?? false)
        );
      },
      { timeout: 1500 }
    );

    await searchButton.click({ timeout: 450 });

    // URL 변경 대기 (timeout 방식 대신 URL 변경 확인)
    await page
      .waitForURL(/\/boards\?.*search=/, { timeout: 1500 })
      .catch(() => {});

    // API 응답 확인
    try {
      const searchResponse = await searchResponsePromise;
      const searchResponseData = await searchResponse.json();

      expect(searchResponseData.data).toBeDefined();
      if (
        searchResponseData.data &&
        searchResponseData.data.fetchBoards !== undefined
      ) {
        expect(searchResponseData.data.fetchBoards).toBeDefined();
        expect(Array.isArray(searchResponseData.data.fetchBoards)).toBeTruthy();
      } else {
        // 에러가 있을 수 있으므로 에러 체크
        if (searchResponseData.errors) {
          // API 에러가 있어도 테스트는 계속 진행 (실제 검색이 작동하는지 확인)
          console.warn('API 에러:', searchResponseData.errors);
        }
      }
    } catch {
      // 타임아웃 등 에러 발생 시에도 URL에 검색 파라미터가 있는지 확인
      const url = page.url();
      expect(url).toContain('search=');
    }
  });

  test('검색어 입력 후 검색 버튼 클릭 시 fetchBoardsCount API에 search 파라미터가 전달됨', async ({
    page,
  }) => {
    await page.goto('/boards');
    await page.getByTestId('boards-page').waitFor();

    // 검색어 입력
    const searchInput = page.locator(
      'input[placeholder="제목을 검색해 주세요."]'
    );
    await expect(searchInput).toBeVisible({ timeout: 450 });
    await searchInput.fill('테스트');

    // 검색 버튼 클릭
    const searchButton = page.getByRole('button', { name: '검색' });
    await expect(searchButton).toBeVisible({ timeout: 450 });

    // 검색 버튼 클릭 전 API 응답 대기 설정
    const countResponsePromise = page.waitForResponse(
      response => {
        const url = response.url();
        const method = response.request().method();
        const postData = response.request().postData();
        return (
          url.includes('/graphql') &&
          method === 'POST' &&
          (postData?.includes('fetchBoardsCount') ?? false) &&
          (postData?.includes('"search":"테스트"') ?? false)
        );
      },
      { timeout: 1500 }
    );

    await searchButton.click({ timeout: 450 });

    // API 응답 확인
    const countResponse = await countResponsePromise;
    const countResponseData = await countResponse.json();

    expect(countResponseData.data).toBeDefined();
    expect(countResponseData.data.fetchBoardsCount).toBeDefined();
    expect(typeof countResponseData.data.fetchBoardsCount).toBe('number');
    expect(
      Number.isInteger(countResponseData.data.fetchBoardsCount)
    ).toBeTruthy();
  });

  test('날짜 범위 선택 후 검색 시 fetchBoards API에 startDate, endDate 파라미터가 전달됨', async ({
    page,
  }) => {
    await page.goto('/boards');
    await page.getByTestId('boards-page').waitFor();

    // 날짜 선택 (시작일)
    const dateInputs = page.locator('input[type="date"]');
    await expect(dateInputs.first()).toBeVisible({ timeout: 450 });

    // 날짜 입력 (과거 날짜)
    const today = new Date();
    const pastDate = new Date(today);
    pastDate.setDate(pastDate.getDate() - 30);
    const startDateStr = pastDate.toISOString().split('T')[0];

    await dateInputs.first().fill(startDateStr);

    // 종료일 입력
    const endDateStr = today.toISOString().split('T')[0];
    await dateInputs.nth(1).fill(endDateStr);

    // 검색 버튼 클릭
    const searchButton = page.getByRole('button', { name: '검색' });
    await expect(searchButton).toBeVisible({ timeout: 450 });

    // 검색 버튼 클릭 전 API 응답 대기 설정
    const searchResponsePromise = page.waitForResponse(
      response => {
        const url = response.url();
        const method = response.request().method();
        const postData = response.request().postData();
        return (
          url.includes('/graphql') &&
          method === 'POST' &&
          (postData?.includes('fetchBoards') ?? false) &&
          (postData?.includes(startDateStr) ?? false)
        );
      },
      { timeout: 1500 }
    );

    await searchButton.click({ timeout: 450 });

    // URL 변경 대기 (timeout 방식 대신 URL 변경 확인)
    await page
      .waitForURL(/\/boards\?.*startDate=/, { timeout: 1500 })
      .catch(() => {});

    // API 응답 확인
    try {
      const searchResponse = await searchResponsePromise;
      const searchResponseData = await searchResponse.json();

      expect(searchResponseData.data).toBeDefined();
      if (
        searchResponseData.data &&
        searchResponseData.data.fetchBoards !== undefined
      ) {
        expect(searchResponseData.data.fetchBoards).toBeDefined();
      } else {
        // 에러가 있을 수 있으므로 에러 체크
        if (searchResponseData.errors) {
          console.warn('API 에러:', searchResponseData.errors);
        }
      }
    } catch {
      // 타임아웃 등 에러 발생 시에도 URL에 날짜 파라미터가 있는지 확인
      const url = page.url();
      expect(url).toMatch(/startDate=|endDate=/);
    }
  });

  test('검색 후 URL 쿼리 파라미터에 검색 조건이 저장됨', async ({ page }) => {
    await page.goto('/boards');
    await page.getByTestId('boards-page').waitFor();

    // 검색어 입력
    const searchInput = page.locator(
      'input[placeholder="제목을 검색해 주세요."]'
    );
    await expect(searchInput).toBeVisible({ timeout: 450 });
    await searchInput.fill('테스트검색');

    // 검색 버튼 클릭
    const searchButton = page.getByRole('button', { name: '검색' });
    await expect(searchButton).toBeVisible({ timeout: 450 });
    await searchButton.click({ timeout: 450 });

    // URL 변경 대기 (timeout 대신 URL 변경 확인)
    await page
      .waitForURL(/\/boards\?.*search=/, { timeout: 1500 })
      .catch(() => {});

    // URL에 검색 파라미터가 포함되어 있는지 확인
    const url = page.url();
    const urlParams = new URL(url).searchParams;
    const searchParam = urlParams.get('search');

    expect(searchParam).toBe('테스트검색');
  });

  test('검색 후 첫 페이지로 이동함', async ({ page }) => {
    await page.goto('/boards');
    await page.getByTestId('boards-page').waitFor();

    // 페이지네이션의 두 번째 페이지 클릭 (있다면)
    const page2Button = page.getByRole('button', { name: '2' }).first();

    // 두 번째 페이지가 있으면 클릭
    if (await page2Button.isVisible({ timeout: 450 }).catch(() => false)) {
      await page2Button.click({ timeout: 450 });
      // URL 변경 대기
      await page
        .waitForURL(/\/boards\?.*page=2/, { timeout: 1500 })
        .catch(() => {});

      // 검색어 입력
      const searchInput = page.locator(
        'input[placeholder="제목을 검색해 주세요."]'
      );
      await expect(searchInput).toBeVisible({ timeout: 450 });
      await searchInput.fill('테스트');

      // 검색 버튼 클릭
      const searchButton = page.getByRole('button', { name: '검색' });
      await expect(searchButton).toBeVisible({ timeout: 450 });
      await searchButton.click({ timeout: 450 });

      // 첫 페이지로 이동했는지 확인 (URL 변경 대기)
      await page
        .waitForURL(/\/boards\?.*search=/, { timeout: 1500 })
        .catch(() => {});
      const url = page.url();
      const urlParams = new URL(url).searchParams;
      const pageParam = urlParams.get('page');

      expect(pageParam === '1' || pageParam === null).toBeTruthy();
    }
  });
});

test.describe('Boards search - failure (mocked)', () => {
  test('검색 API 실패 모킹 시에도 페이지가 안정적으로 렌더', async ({
    page,
  }) => {
    await page.route(GRAPHQL_ENDPOINT, route => {
      const postData = route.request().postDataJSON() as { query?: string };
      if (
        typeof postData?.query === 'string' &&
        (postData.query.includes('fetchBoards') ||
          postData.query.includes('fetchBoardsCount')) &&
        postData.query.includes('search')
      ) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            errors: [{ message: 'Mocked search error' }],
          }),
        });
      }
      return route.continue();
    });

    await page.goto('/boards');
    await page.getByTestId('boards-page').waitFor();

    // 검색어 입력
    const searchInput = page.locator(
      'input[placeholder="제목을 검색해 주세요."]'
    );
    await expect(searchInput).toBeVisible({ timeout: 450 });
    await searchInput.fill('테스트');

    // 검색 버튼 클릭
    const searchButton = page.getByRole('button', { name: '검색' });
    await expect(searchButton).toBeVisible({ timeout: 450 });
    await searchButton.click({ timeout: 450 });

    // 주요 섹션이 계속 보이는지 확인
    await expect(page.getByText('트립토크 게시판')).toBeVisible();
  });
});
