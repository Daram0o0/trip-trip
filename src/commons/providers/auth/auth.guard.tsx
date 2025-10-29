'use client';

import React, { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from './auth.provider';
import { getRouteMeta, isPublicRoute, URLS } from '@/commons/constants/url';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const redirectedPathRef = useRef<string | null>(null);

  // 테스트 환경 변수 확인 (Playwright 테스트에서만 우회)
  // 실제 개발/프로덕션 환경에서는 권한 검증 수행
  // window 객체에 테스트 플래그 확인 (런타임 접근 가능)
  const isTestEnv =
    typeof window !== 'undefined' &&
    ((window as unknown as { __TEST_ENV__?: boolean }).__TEST_ENV__ === true ||
      process.env.NEXT_PUBLIC_TEST_ENV === 'test');

  useEffect(() => {
    // AuthProvider 초기화 대기
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    // 로그인 페이지에서는 리다이렉트하지 않음
    if (pathname === URLS.auth.login) {
      setIsAuthorized(true);
      redirectedPathRef.current = null;
      return;
    }

    const routeMeta = getRouteMeta(pathname);

    // 경로가 정의되지 않은 경우는 접근 허용 (예: 404 페이지)
    if (!routeMeta) {
      setIsAuthorized(true);
      redirectedPathRef.current = null;
      return;
    }

    // 테스트 환경에서는 모든 페이지 접근 허용
    if (isTestEnv) {
      setIsAuthorized(true);
      redirectedPathRef.current = null;
      return;
    }

    // 실제 환경에서의 권한 검증
    const isPublic = isPublicRoute(routeMeta);

    if (isPublic) {
      // 공개 페이지는 항상 접근 허용
      setIsAuthorized(true);
      redirectedPathRef.current = null;
    } else {
      // 멤버 전용 페이지는 로그인 필요
      if (!isAuthenticated) {
        // 로그인하지 않았으면 즉시 로그인 페이지로 리다이렉트
        setIsAuthorized(false);

        // 이 경로에 대해 아직 리다이렉트하지 않았다면 리다이렉트
        if (
          redirectedPathRef.current !== pathname &&
          typeof window !== 'undefined'
        ) {
          redirectedPathRef.current = pathname;
          // window.location.replace를 사용하여 히스토리에 남기지 않고 리다이렉트
          window.location.replace(URLS.auth.login);
          return; // 리다이렉트 후 즉시 return
        }
      } else {
        // 로그인되어 있으면 접근 허용
        setIsAuthorized(true);
        redirectedPathRef.current = null;
      }
    }
  }, [isInitialized, pathname, isAuthenticated, isTestEnv]);

  // AuthProvider 초기화 전에는 빈 화면 표시
  if (!isInitialized) {
    return <div style={{ minHeight: '100vh' }} />;
  }

  // 권한이 없으면 빈 화면 표시
  if (!isAuthorized) {
    return <div style={{ minHeight: '100vh' }} />;
  }

  // 권한이 있으면 children 표시
  return <>{children}</>;
}
