import { expect, test } from '@playwright/test';

const GRAPHQL_ENDPOINT = 'http://main-practice.codebootcamp.co.kr/graphql';

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
  // 로그인 토큰이 저장될 때까지 대기 (API 응답 대기 포함)
  await page.waitForFunction(() => !!localStorage.getItem('accessToken'), {
    timeout: 10000,
  });
}

test.describe('Board detail binding - real APIs', () => {
  test('상세 UI가 실제 API 데이터와 일치한다', async ({ page, request }) => {
    await login(page);
    // 1) 임의의 게시글 ID 조회
    const resList = await request.post(GRAPHQL_ENDPOINT, {
      data: {
        query: `query($page:Int){ fetchBoards(page:$page){ _id title } }`,
        variables: { page: 1 },
      },
    });
    expect(resList.ok()).toBeTruthy();
    const listJson = await resList.json();
    const firstId: string = listJson.data.fetchBoards?.[0]?._id;
    expect(firstId).toBeTruthy();

    // 2) 상세 페이지 이동 및 로드 대기 (고정 testid)
    await page.goto(`/boards/${firstId}`);
    await page.getByTestId('board-detail-page').waitFor();

    // 3) 서버에서 실제 상세/댓글 데이터 로드
    const resDetail = await request.post(GRAPHQL_ENDPOINT, {
      data: {
        query: `query($boardId:ID!){ fetchBoard(boardId:$boardId){ _id title writer createdAt likeCount dislikeCount images contents boardAddress{ address addressDetail } } }`,
        variables: { boardId: firstId },
      },
    });
    expect(resDetail.ok()).toBeTruthy();
    const detailJson = await resDetail.json();
    const serverDetail = detailJson.data.fetchBoard as {
      _id: string;
      title: string;
      writer?: string | null;
      createdAt: string;
      likeCount?: number | null;
      dislikeCount?: number | null;
      images?: string[] | null;
      contents: string;
      boardAddress?: {
        address?: string | null;
        addressDetail?: string | null;
      } | null;
    };

    // 4) UI 검증: 타이틀/작성자/날짜/좋아요/싫어요/본문
    await expect(page.getByTestId('board-title')).toHaveText(
      serverDetail.title
    );
    await expect(page.getByTestId('board-writer')).toHaveText(
      serverDetail.writer ?? ''
    );

    const createdDate = new Date(serverDetail.createdAt)
      .toISOString()
      .split('T')[0]
      .replaceAll('-', '.');
    await expect(page.getByTestId('board-date')).toHaveText(createdDate);

    await expect(page.getByTestId('board-like-count')).toHaveText(
      String(serverDetail.likeCount ?? 0)
    );
    await expect(page.getByTestId('board-dislike-count')).toHaveText(
      String(serverDetail.dislikeCount ?? 0)
    );

    await expect(page.getByTestId('board-contents')).toBeVisible();

    // 5) 댓글 데이터 확인: 길이가 1 이상이면 댓글 아이템 노출, 아니면 "회고가 없습니다."
    const resComments = await request.post(GRAPHQL_ENDPOINT, {
      data: {
        query: `query($boardId:ID!,$page:Int){ fetchBoardComments(boardId:$boardId,page:$page){ _id } }`,
        variables: { boardId: firstId, page: 1 },
      },
    });
    expect(resComments.ok()).toBeTruthy();
    const commentsJson = await resComments.json();
    const commentsLen: number = (commentsJson.data.fetchBoardComments ?? [])
      .length;

    if (commentsLen > 0) {
      await expect(page.locator('[data-testid^="comment-item-"]')).toHaveCount(
        commentsLen
      );
    } else {
      await expect(page.getByTestId('no-comments')).toHaveText(
        '회고가 없습니다.'
      );
    }
  });
});

test.describe('Board detail binding - failure scenario (mock)', () => {
  test('fetchBoard 실패 모킹 시에도 페이지가 안정적으로 렌더', async ({
    page,
  }) => {
    await login(page);
    await page.route(GRAPHQL_ENDPOINT, route => {
      const postData = route.request().postDataJSON() as { query?: string };
      if (
        typeof postData?.query === 'string' &&
        postData.query.includes('fetchBoard')
      ) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ errors: [{ message: 'Mocked error' }] }),
        });
      }
      return route.continue();
    });

    // 임의의 id로 접근 (실패를 모킹했으므로 id는 중요치 않음)
    await page.goto(`/boards/any-id`);
    await page.getByTestId('board-detail-page').waitFor();

    // 크래시 없이 주요 고정 텍스트/영역 노출
    await expect(page.getByText('댓글', { exact: true }).first()).toBeVisible();
  });
});

test.describe('Board detail link routing', () => {
  test('목록으로 버튼 클릭 시 게시물 목록 페이지로 이동', async ({
    page,
    request,
  }) => {
    await login(page);
    // 1) 임의의 게시글 ID 조회
    const resList = await request.post(GRAPHQL_ENDPOINT, {
      data: {
        query: `query($page:Int){ fetchBoards(page:$page){ _id title } }`,
        variables: { page: 1 },
      },
    });
    expect(resList.ok()).toBeTruthy();
    const listJson = await resList.json();
    const firstId: string = listJson.data.fetchBoards?.[0]?._id;
    expect(firstId).toBeTruthy();

    // 2) 상세 페이지 이동 및 로드 대기 (고정 testid)
    await page.goto(`/boards/${firstId}`);
    await page.getByTestId('board-detail-page').waitFor({ timeout: 1500 });

    // 3) 목록으로 버튼 클릭
    const listButton = page.getByTestId('board-detail-list-button');
    await expect(listButton).toBeVisible({ timeout: 1500 });

    // URL 변경 대기 (네비게이션이 시작되기 전에 promise 설정)
    const navigationPromise = page.waitForURL('/boards', { timeout: 1500 });
    await listButton.click();

    // 4) URL 변경 확인
    await navigationPromise;
    await expect(page).toHaveURL('/boards');
  });

  test('수정하기 버튼 클릭 시 게시물 수정 페이지로 이동', async ({
    page,
    request,
  }) => {
    await login(page);
    // 1) 임의의 게시글 ID 조회
    const resList = await request.post(GRAPHQL_ENDPOINT, {
      data: {
        query: `query($page:Int){ fetchBoards(page:$page){ _id title } }`,
        variables: { page: 1 },
      },
    });
    expect(resList.ok()).toBeTruthy();
    const listJson = await resList.json();
    const firstId: string = listJson.data.fetchBoards?.[0]?._id;
    expect(firstId).toBeTruthy();

    // 2) 상세 페이지 이동 및 로드 대기 (고정 testid)
    await page.goto(`/boards/${firstId}`);
    await page.getByTestId('board-detail-page').waitFor({ timeout: 1500 });

    // 3) 수정하기 버튼 클릭
    const editButton = page.getByTestId('board-detail-edit-button');
    await expect(editButton).toBeVisible({ timeout: 1500 });

    // URL 변경 대기 (네비게이션이 시작되기 전에 promise 설정)
    const navigationPromise = page.waitForURL(`/boards/${firstId}/edit`, {
      timeout: 1500,
    });
    await editButton.click();

    // 4) URL 변경 확인 (prompt에 /boards/[id]/new라고 되어 있지만 url.ts에는 edit만 있으므로 edit 사용)
    await navigationPromise;
    await expect(page).toHaveURL(`/boards/${firstId}/edit`);
  });
});

test.describe('Board detail like/dislike - success scenario (real API)', () => {
  test('likeBoard API가 Int!를 제대로 반환한다', async ({ page, request }) => {
    await login(page);
    // 1) 임의의 게시글 ID 조회
    const resList = await request.post(GRAPHQL_ENDPOINT, {
      data: {
        query: `query($page:Int){ fetchBoards(page:$page){ _id title } }`,
        variables: { page: 1 },
      },
    });
    expect(resList.ok()).toBeTruthy();
    const listJson = await resList.json();
    const firstId: string = listJson.data.fetchBoards?.[0]?._id;
    expect(firstId).toBeTruthy();

    // 2) 상세 페이지 이동 및 로드 대기 (고정 testid)
    await page.goto(`/boards/${firstId}`);
    await page.getByTestId('board-detail-page').waitFor();

    // 3) 좋아요 버튼 클릭 및 API 응답 대기
    const likeButton = page.getByTestId('board-like-button');
    await expect(likeButton).toBeVisible();

    // likeBoard mutation API 응답 대기
    const likeResponsePromise = page.waitForResponse(
      response => {
        const url = response.url();
        const method = response.request().method();
        const postData = response.request().postData();
        return (
          url.includes('/graphql') &&
          method === 'POST' &&
          (postData?.includes('likeBoard') ?? false)
        );
      },
      { timeout: 5000 }
    );

    await likeButton.click();
    const likeResponse = await likeResponsePromise;
    const likeResponseData = await likeResponse.json();

    // likeBoard API 응답이 Int!를 반환하는지 확인
    expect(likeResponseData.data.likeBoard).toBeDefined();
    expect(typeof likeResponseData.data.likeBoard).toBe('number');

    // 6) UI에서 좋아요 개수 업데이트 확인 (페이지 새로고침하여 상태 확인)
    await page.reload();
    await page.getByTestId('board-detail-page').waitFor();
    // 좋아요가 눌렸으므로 아이콘이 활성화되어 있어야 함
    const likeIcon = page.locator('[data-testid="board-like-button"] svg');
    await expect(likeIcon).toBeVisible();
  });

  test('dislikeBoard API가 Int!를 제대로 반환한다', async ({
    page,
    request,
  }) => {
    await login(page);
    // 1) 임의의 게시글 ID 조회
    const resList = await request.post(GRAPHQL_ENDPOINT, {
      data: {
        query: `query($page:Int){ fetchBoards(page:$page){ _id title } }`,
        variables: { page: 1 },
      },
    });
    expect(resList.ok()).toBeTruthy();
    const listJson = await resList.json();
    const firstId: string = listJson.data.fetchBoards?.[0]?._id;
    expect(firstId).toBeTruthy();

    // 2) 상세 페이지 이동 및 로드 대기 (고정 testid)
    await page.goto(`/boards/${firstId}`);
    await page.getByTestId('board-detail-page').waitFor();

    // 3) 싫어요 버튼 클릭 및 API 응답 대기
    const dislikeButton = page.getByTestId('board-dislike-button');
    await expect(dislikeButton).toBeVisible();

    // dislikeBoard mutation API 응답 대기
    const dislikeResponsePromise = page.waitForResponse(
      response => {
        const url = response.url();
        const method = response.request().method();
        const postData = response.request().postData();
        return (
          url.includes('/graphql') &&
          method === 'POST' &&
          (postData?.includes('dislikeBoard') ?? false)
        );
      },
      { timeout: 1500 }
    );

    await dislikeButton.click();
    const dislikeResponse = await dislikeResponsePromise;
    const dislikeResponseData = await dislikeResponse.json();

    // dislikeBoard API 응답이 Int!를 반환하는지 확인
    expect(dislikeResponseData.data.dislikeBoard).toBeDefined();
    expect(typeof dislikeResponseData.data.dislikeBoard).toBe('number');

    // 6) UI에서 싫어요 개수 업데이트 확인 (페이지 새로고침하여 상태 확인)
    await page.reload();
    await page.getByTestId('board-detail-page').waitFor();
    // 싫어요가 눌렸으므로 아이콘이 활성화되어 있어야 함
    const dislikeIcon = page.locator(
      '[data-testid="board-dislike-button"] svg'
    );
    await expect(dislikeIcon).toBeVisible();
  });
});

test.describe('Board detail like/dislike - failure scenario (mock API)', () => {
  test('likeBoard API 모킹 실패 시나리오', async ({ page, request }) => {
    await login(page);
    // 1) 실제 게시글 ID 조회
    const resList = await request.post(GRAPHQL_ENDPOINT, {
      data: {
        query: `query($page:Int){ fetchBoards(page:$page){ _id title } }`,
        variables: { page: 1 },
      },
    });
    expect(resList.ok()).toBeTruthy();
    const listJson = await resList.json();
    const firstId: string = listJson.data.fetchBoards?.[0]?._id;
    expect(firstId).toBeTruthy();

    // 2) likeBoard mutation만 모킹
    await page.route(GRAPHQL_ENDPOINT, route => {
      const postData = route.request().postDataJSON() as { query?: string };
      if (
        typeof postData?.query === 'string' &&
        postData.query.includes('likeBoard')
      ) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            errors: [{ message: 'Mocked likeBoard error' }],
          }),
        });
      }
      return route.continue();
    });

    // 3) 상세 페이지 이동 및 로드 대기
    await page.goto(`/boards/${firstId}`);
    await page.getByTestId('board-detail-page').waitFor();

    // 4) 좋아요 버튼 클릭
    const likeButton = page.getByTestId('board-like-button');
    await expect(likeButton).toBeVisible();
    await likeButton.click();

    // 5) 에러가 발생해도 페이지가 크래시되지 않아야 함
    await expect(page.getByTestId('board-detail-page')).toBeVisible();
  });

  test('dislikeBoard API 모킹 실패 시나리오', async ({ page, request }) => {
    await login(page);
    // 1) 실제 게시글 ID 조회
    const resList = await request.post(GRAPHQL_ENDPOINT, {
      data: {
        query: `query($page:Int){ fetchBoards(page:$page){ _id title } }`,
        variables: { page: 1 },
      },
    });
    expect(resList.ok()).toBeTruthy();
    const listJson = await resList.json();
    const firstId: string = listJson.data.fetchBoards?.[0]?._id;
    expect(firstId).toBeTruthy();

    // 2) dislikeBoard mutation만 모킹
    await page.route(GRAPHQL_ENDPOINT, route => {
      const postData = route.request().postDataJSON() as { query?: string };
      if (
        typeof postData?.query === 'string' &&
        postData.query.includes('dislikeBoard')
      ) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            errors: [{ message: 'Mocked dislikeBoard error' }],
          }),
        });
      }
      return route.continue();
    });

    // 3) 상세 페이지 이동 및 로드 대기
    await page.goto(`/boards/${firstId}`);
    await page.getByTestId('board-detail-page').waitFor();

    // 4) 싫어요 버튼 클릭
    const dislikeButton = page.getByTestId('board-dislike-button');
    await expect(dislikeButton).toBeVisible();
    await dislikeButton.click();

    // 5) 에러가 발생해도 페이지가 크래시되지 않아야 함
    await expect(page.getByTestId('board-detail-page')).toBeVisible();
  });
});
