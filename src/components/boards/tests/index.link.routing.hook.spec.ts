import { test, expect } from '@playwright/test';

test.describe('Boards 링크 라우팅', () => {
  test.beforeEach(async ({ page }) => {
    // 테스트 환경 플래그 및 로그인 토큰 사전 주입 (로컬스토리지 실제 사용)
    await page.addInitScript(() => {
      // @ts-expect-error set test flag
      window.__TEST_ENV__ = true;
      try {
        window.localStorage.setItem('accessToken', 'e2e-token');
      } catch {}
    });

    await page.goto('/boards');
    await expect(page.getByTestId('boards-page')).toBeVisible({
      timeout: 1500,
    });
  });

  test('핫한 트립토크 카드 클릭 시 상세로 이동', async ({ page }) => {
    // 첫 번째 카드 클릭
    const firstHotCard = page.getByTestId(/hot-card-/).first();
    await expect(firstHotCard).toBeVisible({ timeout: 1500 });
    const firstId = await firstHotCard.getAttribute('data-testid');
    expect(firstId).toBeTruthy();
    await firstHotCard.click();

    await expect(page).toHaveURL(/\/boards\/(\d+)/, { timeout: 1500 });
    // id 매칭 확인 (data-testid="hot-card-<id>")
    const idFromTestId = firstId?.split('hot-card-')[1];
    expect(idFromTestId).toBeTruthy();
    await expect(page).toHaveURL(new RegExp(`/boards/${idFromTestId}$`), {
      timeout: 1500,
    });
  });

  test('게시글 목록 아이템 클릭 시 상세로 이동', async ({ page }) => {
    const firstListItem = page.getByTestId(/board-item-/).first();
    await expect(firstListItem).toBeVisible({ timeout: 1500 });
    const testId = await firstListItem.getAttribute('data-testid');
    expect(testId).toBeTruthy();
    const idFromTestId = testId?.split('board-item-')[1];
    expect(idFromTestId).toBeTruthy();

    // 클릭 전 URL 확인
    await expect(page).toHaveURL(/\/boards/, { timeout: 1500 });

    // 아이템 클릭
    await firstListItem.click();

    // URL 변경 대기 및 확인
    await expect(page).toHaveURL(/\/boards\/(\d+)/, { timeout: 1500 });
    await expect(page).toHaveURL(new RegExp(`/boards/${idFromTestId}$`), {
      timeout: 1500,
    });
  });

  test('트립토크 등록 버튼 클릭 시 작성 페이지로 이동', async ({ page }) => {
    const writeButton = page.getByTestId('write-button');
    await expect(writeButton).toBeVisible({ timeout: 1500 });
    await writeButton.click();
    await expect(page).toHaveURL('/boards/new', { timeout: 1500 });
  });
});
