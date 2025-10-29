'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { ROUTE_PATHS } from '@/commons/constants/url';

/**
 * Layout 컴포넌트의 라우팅 기능을 제공하는 훅
 * url.ts의 페이지URL에 정의된 경로로 이동하는 기능을 제공
 */
export function useLayoutRouting() {
  const router = useRouter();

  /**
   * 로고 클릭시 게시물목록페이지로 이동
   */
  const handleLogoClick = useCallback(() => {
    router.push(ROUTE_PATHS.boards.list);
  }, [router]);

  /**
   * 트립토크 네비게이션 클릭시 게시물목록페이지로 이동
   */
  const handleTriptalkClick = useCallback(() => {
    router.push(ROUTE_PATHS.boards.list);
  }, [router]);

  /**
   * 로그인 버튼 클릭시 로그인 페이지로 이동
   */
  const handleLoginClick = useCallback(() => {
    router.push(ROUTE_PATHS.auth.login);
  }, [router]);

  /**
   * 숙박권 구매 네비게이션 클릭시 액티브 상태만 변경 (스킵 대상)
   */
  const handleAccommodationClick = useCallback(() => {
    // 실제 페이지 이동은 하지 않고 액티브 상태만 변경
    // Next.js에서 존재하지 않는 경로로 이동하지 않음
  }, []);

  /**
   * 마이 페이지 네비게이션 클릭시 액티브 상태만 변경 (스킵 대상)
   */
  const handleMypageClick = useCallback(() => {
    // 실제 페이지 이동은 하지 않고 액티브 상태만 변경
    // Next.js에서 존재하지 않는 경로로 이동하지 않음
  }, []);

  return {
    handleLogoClick,
    handleTriptalkClick,
    handleLoginClick,
    handleAccommodationClick,
    handleMypageClick,
  };
}
