'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { ROUTE_PATHS, buildBoardEditPath } from '@/commons/constants/url';

/**
 * Board detail 컴포넌트의 라우팅 기능을 제공하는 훅
 * url.ts의 페이지URL에 정의된 경로로 이동하는 기능을 제공
 */
export function useBoardDetailLinkRouting(boardId: string | number) {
  const router = useRouter();

  /**
   * 목록으로 버튼 클릭시 게시물 목록 페이지로 이동
   */
  const handleListClick = useCallback(() => {
    router.push(ROUTE_PATHS.boards.list);
  }, [router]);

  /**
   * 수정하기 버튼 클릭시 게시물 수정 페이지로 이동
   */
  const handleEditClick = useCallback(() => {
    const editPath = buildBoardEditPath(boardId);
    router.push(editPath);
  }, [router, boardId]);

  return {
    handleListClick,
    handleEditClick,
  };
}
