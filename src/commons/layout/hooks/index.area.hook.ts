'use client';

import { usePathname } from 'next/navigation';
import {
  shouldShowHeader,
  shouldShowBanner,
  shouldShowImage,
  getRouteMeta,
  type RouteMeta,
} from '@/commons/constants/url';

export interface AreaVisibility {
  header: boolean;
  banner: boolean;
  image: boolean;
}

export interface UseAreaReturn {
  visibility: AreaVisibility;
  routeMeta: RouteMeta | undefined;
  isAuthPage: boolean;
}

/**
 * 현재 경로에 따라 각 영역(header, banner, image)의 노출 여부를 관리하는 hook
 *
 * @returns {UseAreaReturn} 영역별 노출 여부와 라우트 메타데이터
 */
export function useArea(): UseAreaReturn {
  const pathname = usePathname();

  // 인증 페이지 여부 확인
  const isAuthPage = pathname.includes('auth');

  // 현재 경로의 메타데이터 조회
  const routeMeta = getRouteMeta(pathname);

  // 각 영역별 노출 여부 계산
  const visibility: AreaVisibility = {
    header: shouldShowHeader(pathname),
    banner: shouldShowBanner(pathname),
    image: shouldShowImage(pathname),
  };

  return {
    visibility,
    routeMeta,
    isAuthPage,
  };
}

