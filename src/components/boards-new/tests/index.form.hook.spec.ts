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
  // 로그인 토큰과 사용자 정보가 저장될 때까지 대기 (API 응답 대기 포함)
  await page.waitForFunction(
    () =>
      !!localStorage.getItem('accessToken') && !!localStorage.getItem('user'),
    {
      timeout: 10000,
    }
  );
}

test.describe('Boards New Form Hook', () => {
  test.beforeEach(async ({ page }) => {
    // 로그인 먼저 수행
    await login(page);

    // 게시물 작성 페이지로 이동
    await page.goto('/boards/new');

    // 페이지 로드 대기 - data-testid 사용 (network 통신이 아니므로 2000ms 미만으로 조정)
    await page.waitForSelector('[data-testid="boards-new-container"]', {
      timeout: 2000,
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

test.describe('Boards Edit Form Hook', () => {
  const GRAPHQL_ENDPOINT = 'http://main-practice.codebootcamp.co.kr/graphql';

  test.describe('성공 시나리오', () => {
    test('게시물 수정 성공 - 실제 API 사용 및 zipcode 로딩 확인', async ({
      page,
      request,
    }) => {
      await login(page);

      // 1) 게시물 작성 (zipcode 포함)
      const createBoardRes = await request.post(GRAPHQL_ENDPOINT, {
        data: {
          query: `mutation($createBoardInput: CreateBoardInput!) {
            createBoard(createBoardInput: $createBoardInput) {
              _id
            }
          }`,
          variables: {
            createBoardInput: {
              writer: '테스트작성자',
              password: 'testpass123',
              title: '수정 테스트 게시물',
              contents: '수정 테스트 내용입니다.',
              boardAddress: {
                zipcode: '12345',
                address: '서울시 강남구 테스트로 123',
                addressDetail: '101호',
              },
            },
          },
        },
      });
      const createData = await createBoardRes.json();
      const boardId = createData.data.createBoard._id;
      expect(boardId).toBeTruthy();

      // 2) 수정 페이지로 이동 및 로드 대기
      await page.goto(`/boards/${boardId}/edit`);
      await page.waitForSelector('[data-testid="boards-new-container"]', {
        timeout: 2000,
      });

      // 3) zipcode가 제대로 로드되었는지 확인
      const postcodeInput = page.getByTestId('postcode-input');
      await expect(postcodeInput).toBeVisible({ timeout: 500 });
      const postcodeValue = await postcodeInput.inputValue();
      expect(postcodeValue).toBe('12345');

      // 4) 주소도 확인
      const addressInput = page.getByTestId('address-input');
      await expect(addressInput).toBeVisible({ timeout: 500 });
      const addressValue = await addressInput.inputValue();
      expect(addressValue).toBe('서울시 강남구 테스트로 123');

      // 5) 제목 수정
      const titleInput = page.locator('input[type="text"]').nth(1);
      await titleInput.clear();
      await titleInput.fill('수정된 제목');

      // 6) 수정하기 버튼 클릭
      const submitButton = page.locator('button:has-text("수정하기")');
      await expect(submitButton).toBeEnabled({ timeout: 500 });
      await submitButton.click();

      // 7) 비밀번호 확인 모달 표시 확인
      // 모달 내부의 비밀번호 입력 필드 찾기 (모달이 열린 후)
      await page.waitForTimeout(500); // 모달 렌더링 대기
      const passwordModal = page.locator('input[type="password"]').nth(1); // 두 번째 password input (모달 내부)
      await expect(passwordModal).toBeVisible({ timeout: 2000 });

      // 8) 비밀번호 입력 및 확인
      await passwordModal.fill('testpass123');
      const confirmButton = page.locator('button:has-text("확인")').first();
      await expect(confirmButton).toBeEnabled({ timeout: 500 });

      // 9) updateBoard API 응답 확인
      const updateBoardResponsePromise = page.waitForResponse(
        response => {
          const url = response.url();
          const method = response.request().method();
          const postData = response.request().postData();
          return (
            url.includes('/graphql') &&
            method === 'POST' &&
            (postData?.includes('UpdateBoard') ?? false)
          );
        },
        { timeout: 2000 }
      );

      await confirmButton.click();

      const updateBoardResponse = await updateBoardResponsePromise;
      const updateBoardData = await updateBoardResponse.json();

      // _id가 정상적으로 반환되는지 확인
      expect(updateBoardData.data.updateBoard).toBeDefined();
      expect(updateBoardData.data.updateBoard._id).toBeTruthy();

      // 10) 수정 완료 모달 표시 확인
      const successModal = page.locator('text=수정완료');
      await expect(successModal).toBeVisible({ timeout: 2000 });

      // 11) 모달 확인 버튼 클릭
      const modalConfirmButton = page
        .locator('button:has-text("확인")')
        .first();
      await modalConfirmButton.click({ timeout: 500 });

      // 12) 게시물 상세 페이지로 이동 확인
      await expect(page).toHaveURL(`/boards/${boardId}`, { timeout: 2000 });

      // 13) 수정된 내용이 반영되었는지 확인
      await page.waitForSelector('[data-testid="board-detail-page"]', {
        timeout: 2000,
      });
      const titleElement = page.locator('text=수정된 제목');
      await expect(titleElement).toBeVisible({ timeout: 500 });

      // 14) 다시 수정 페이지로 이동하여 zipcode가 여전히 로드되는지 확인
      const editButton = page.getByTestId('board-detail-edit-button');
      await expect(editButton).toBeVisible({ timeout: 500 });
      await editButton.click();

      await page.waitForSelector('[data-testid="boards-new-container"]', {
        timeout: 2000,
      });

      // 15) zipcode가 다시 로드되었는지 확인
      const postcodeInput2 = page.getByTestId('postcode-input');
      await expect(postcodeInput2).toBeVisible({ timeout: 500 });
      const postcodeValue2 = await postcodeInput2.inputValue();
      expect(postcodeValue2).toBe('12345');
    });

    test('수정 페이지에서 zipcode가 제대로 로드된다', async ({
      page,
      request,
    }) => {
      await login(page);

      // 1) zipcode가 있는 게시물 찾기
      let boardWithZipcode: { _id: string; boardAddress?: any } | null = null;
      for (let pageNum = 1; pageNum <= 5; pageNum++) {
        const resList = await request.post(GRAPHQL_ENDPOINT, {
          data: {
            query: `query($page:Int){ fetchBoards(page:$page){ _id boardAddress{ zipcode address } } }`,
            variables: { page: pageNum },
          },
        });
        const listJson = await resList.json();
        const boards = listJson.data.fetchBoards as Array<{
          _id: string;
          boardAddress?: { zipcode?: string; address?: string };
        }>;
        boardWithZipcode =
          boards.find(
            board =>
              board.boardAddress?.zipcode &&
              board.boardAddress.zipcode.trim() !== ''
          ) || null;
        if (boardWithZipcode) break;
      }

      // zipcode가 있는 게시물이 없으면 새로 생성
      if (!boardWithZipcode) {
        const createRes = await request.post(GRAPHQL_ENDPOINT, {
          data: {
            query: `mutation($createBoardInput: CreateBoardInput!) {
              createBoard(createBoardInput: $createBoardInput) {
                _id
              }
            }`,
            variables: {
              createBoardInput: {
                writer: '테스트작성자',
                password: 'testpass123',
                title: 'zipcode 테스트',
                contents: 'zipcode 테스트 내용',
                boardAddress: {
                  zipcode: '54321',
                  address: '서울시 강남구 테스트 주소',
                  addressDetail: '202호',
                },
              },
            },
          },
        });
        const createData = await createRes.json();
        boardWithZipcode = { _id: createData.data.createBoard._id };
      }

      const boardId = boardWithZipcode._id;

      // 2) 수정 페이지로 이동
      await page.goto(`/boards/${boardId}/edit`);
      await page.waitForSelector('[data-testid="boards-new-container"]', {
        timeout: 2000,
      });

      // 3) zipcode 입력 필드가 표시되고 값이 있는지 확인
      const postcodeInput = page.getByTestId('postcode-input');
      await expect(postcodeInput).toBeVisible({ timeout: 500 });
      const postcodeValue = await postcodeInput.inputValue();
      // zipcode가 있으면 빈 문자열이 아니어야 함
      expect(postcodeValue).toBeTruthy();
    });
  });

  test.describe('비밀번호 오류 시나리오', () => {
    test('비밀번호 오류 시 모달 표시 및 폼 상태 유지', async ({
      page,
      request,
    }) => {
      await login(page);

      // 1) 게시물 작성
      const createBoardRes = await request.post(GRAPHQL_ENDPOINT, {
        data: {
          query: `mutation($createBoardInput: CreateBoardInput!) {
            createBoard(createBoardInput: $createBoardInput) {
              _id
            }
          }`,
          variables: {
            createBoardInput: {
              writer: '테스트작성자',
              password: 'testpass123',
              title: '비밀번호 오류 테스트',
              contents: '비밀번호 오류 테스트 내용',
            },
          },
        },
      });
      const createData = await createBoardRes.json();
      const boardId = createData.data.createBoard._id;

      // 2) 수정 페이지로 이동
      await page.goto(`/boards/${boardId}/edit`);
      await page.waitForSelector('[data-testid="boards-new-container"]', {
        timeout: 2000,
      });

      // 3) 제목 수정
      const titleInput = page.locator('input[type="text"]').nth(1);
      const originalTitle = await titleInput.inputValue();
      await titleInput.clear();
      await titleInput.fill('수정된 제목');

      // 4) 수정하기 버튼 클릭
      const submitButton = page.locator('button:has-text("수정하기")');
      await submitButton.click();

      // 5) 비밀번호 확인 모달 표시 확인
      // 모달 내부의 비밀번호 입력 필드 찾기 (모달이 열린 후)
      await page.waitForTimeout(500); // 모달 렌더링 대기
      const passwordModal = page.locator('input[type="password"]').nth(1); // 두 번째 password input (모달 내부)
      await expect(passwordModal).toBeVisible({ timeout: 2000 });

      // 6) 틀린 비밀번호 입력
      await passwordModal.fill('wrongpassword');
      const confirmButton = page.locator('button:has-text("확인")').first();
      await confirmButton.click();

      // 7) 비밀번호 오류 모달 표시 확인
      const errorModal = page.locator('text=/비밀번호.*틀렸|비밀번호.*일치/');
      await expect(errorModal).toBeVisible({ timeout: 2000 });

      // 8) 모달 확인 버튼 클릭
      const errorConfirmButton = page
        .locator('button:has-text("확인")')
        .first();
      await errorConfirmButton.click({ timeout: 500 });

      // 9) 페이지가 이동하지 않고 수정 페이지에 남아있는지 확인
      await expect(page).toHaveURL(`/boards/${boardId}/edit`, { timeout: 500 });

      // 10) 폼 상태가 유지되었는지 확인 (제목이 수정된 상태로 유지)
      const titleValue = await titleInput.inputValue();
      expect(titleValue).toBe('수정된 제목');
    });
  });
});
