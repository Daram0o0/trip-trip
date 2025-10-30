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
    await expect(page.getByTestId('boards-page')).toBeVisible({ timeout: 480 });
  });

  test('핫한 트립토크 카드 클릭 시 상세로 이동', async ({ page }) => {
    // 첫 번째 카드 클릭
    const firstHotCard = page.getByTestId(/hot-card-/).first();
    await expect(firstHotCard).toBeVisible({ timeout: 450 });
    const firstId = await firstHotCard.getAttribute('data-testid');
    await firstHotCard.click();

    await expect(page).toHaveURL(/\/boards\/(\d+)/, { timeout: 450 });
    // id 매칭 확인 (data-testid="hot-card-<id>")
    const idFromTestId = firstId?.split('hot-card-')[1];
    await expect(page).toHaveURL(new RegExp(`/boards/${idFromTestId}$`), {
      timeout: 450,
    });
  });

  test('게시글 목록 아이템 클릭 시 상세로 이동', async ({ page }) => {
    const firstListItem = page.getByTestId(/board-item-/).first();
    await expect(firstListItem).toBeVisible({ timeout: 450 });
    const testId = await firstListItem.getAttribute('data-testid');
    await firstListItem.click();

    await expect(page).toHaveURL(/\/boards\/(\d+)/, { timeout: 450 });
    const idFromTestId = testId?.split('board-item-')[1];
    await expect(page).toHaveURL(new RegExp(`/boards/${idFromTestId}$`), {
      timeout: 450,
    });
  });

  test('트립토크 등록 버튼 클릭 시 작성 페이지로 이동', async ({ page }) => {
    const writeButton = page.getByTestId('write-button');
    await expect(writeButton).toBeVisible({ timeout: 450 });
    await writeButton.click();
    await expect(page).toHaveURL('/boards/new', { timeout: 450 });
  });
});
