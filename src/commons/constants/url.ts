// URL 경로와 해당 메타데이터를 중앙집중식으로 관리하기 위한 상수와 헬퍼들

export type RouteAccess = 'public' | 'member';

export interface RouteVisibility {
  header: boolean;
  banner: boolean;
  image: boolean;
}

export interface RouteMeta {
  path: string;
  access: RouteAccess;
  visibility: RouteVisibility;
}

// 라우트 경로 상수 (Next.js App Router의 동적 세그먼트 표기 유지)
export const ROUTE_PATHS = {
  auth: {
    login: '/auth/login',
    signup: '/auth/signup',
  },
  boards: {
    list: '/boards',
    detail: '/boards/[id]',
    create: '/boards/new',
    edit: '/boards/[id]/edit',
  },
} as const;

// 동적 경로 빌더들: 링크 생성 시 안전하게 사용
export function buildBoardDetailPath(boardId: string | number): string {
  return `/boards/${String(boardId)}`;
}

export function buildBoardEditPath(boardId: string | number): string {
  return `/boards/${String(boardId)}/edit`;
}

// 각 경로별 접근 권한 및 노출 요소 정의
export const ROUTE_META: Record<string, RouteMeta> = {
  // 1) 로그인
  [ROUTE_PATHS.auth.login]: {
    path: ROUTE_PATHS.auth.login,
    access: 'public',
    visibility: { header: false, banner: false, image: true },
  },

  // 2) 회원가입
  [ROUTE_PATHS.auth.signup]: {
    path: ROUTE_PATHS.auth.signup,
    access: 'public',
    visibility: { header: false, banner: false, image: true },
  },

  // 3) 보드목록
  [ROUTE_PATHS.boards.list]: {
    path: ROUTE_PATHS.boards.list,
    access: 'public',
    visibility: { header: true, banner: true, image: false },
  },

  // 4) 보드상세 (동적)
  [ROUTE_PATHS.boards.detail]: {
    path: ROUTE_PATHS.boards.detail,
    access: 'member',
    visibility: { header: true, banner: true, image: false },
  },

  // 5) 보드생성
  [ROUTE_PATHS.boards.create]: {
    path: ROUTE_PATHS.boards.create,
    access: 'member',
    visibility: { header: true, banner: false, image: false },
  },

  // 6) 보드수정 (동적)
  [ROUTE_PATHS.boards.edit]: {
    path: ROUTE_PATHS.boards.edit,
    access: 'member',
    visibility: { header: true, banner: false, image: false },
  },
};

// 현재 경로에 대응되는 메타를 조회 (동적 경로도 패턴 매칭)
export function getRouteMeta(currentPath: string): RouteMeta | undefined {
  if (!currentPath) return undefined;

  const exact = ROUTE_META[currentPath];
  if (exact) return exact;

  // 동적 경로 패턴 처리
  if (currentPath.startsWith('/boards/')) {
    const segments = currentPath.split('/').filter(Boolean);
    if (segments.length === 2) {
      return ROUTE_META[ROUTE_PATHS.boards.detail];
    }
    if (segments.length === 3 && segments[2] === 'edit') {
      return ROUTE_META[ROUTE_PATHS.boards.edit];
    }
  }

  return undefined;
}

// 접근 제어 및 레이아웃 노출 제어에 활용 가능한 헬퍼
export function isPublicRoute(pathOrMeta: string | RouteMeta): boolean {
  const meta =
    typeof pathOrMeta === 'string' ? getRouteMeta(pathOrMeta) : pathOrMeta;
  return meta?.access === 'public';
}

export function shouldShowHeader(pathOrMeta: string | RouteMeta): boolean {
  const meta =
    typeof pathOrMeta === 'string' ? getRouteMeta(pathOrMeta) : pathOrMeta;
  return Boolean(meta?.visibility.header);
}

export function shouldShowBanner(pathOrMeta: string | RouteMeta): boolean {
  const meta =
    typeof pathOrMeta === 'string' ? getRouteMeta(pathOrMeta) : pathOrMeta;
  return Boolean(meta?.visibility.banner);
}

export function shouldShowImage(pathOrMeta: string | RouteMeta): boolean {
  const meta =
    typeof pathOrMeta === 'string' ? getRouteMeta(pathOrMeta) : pathOrMeta;
  return Boolean(meta?.visibility.image);
}

export const URLS = {
  ...ROUTE_PATHS,
  build: {
    boardDetail: buildBoardDetailPath,
    boardEdit: buildBoardEditPath,
  },
};

export type Urls = typeof URLS;
