'use client';

import React, { useEffect, useState, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from './auth.provider';
import { useModal } from '@/commons/providers/modal/modal.provider';
import { getRouteMeta, isPublicRoute, URLS } from '@/commons/constants/url';
import Modal from '@/commons/components/modal';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { openModal, closeModal } = useModal();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const hasShownModalRef = useRef(false);

  // 테스트 환경 변수 확인
  const isTestEnv = process.env.NEXT_PUBLIC_TEST_ENV === 'test';

  useEffect(() => {
    // AuthProvider 초기화 대기
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    const routeMeta = getRouteMeta(pathname);

    // 경로가 정의되지 않은 경우는 접근 허용 (예: 404 페이지)
    if (!routeMeta) {
      setIsAuthorized(true);
      return;
    }

    // 테스트 환경에서는 모든 페이지 접근 허용
    if (isTestEnv) {
      setIsAuthorized(true);
      return;
    }

    // 실제 환경에서의 권한 검증
    const isPublic = isPublicRoute(routeMeta);

    if (isPublic) {
      // 공개 페이지는 항상 접근 허용
      setIsAuthorized(true);
    } else {
      // 멤버 전용 페이지는 로그인 필요
      if (isAuthenticated) {
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);

        // 모달이 아직 표시되지 않았다면 표시
        if (!hasShownModalRef.current) {
          hasShownModalRef.current = true;

          const handleLoginConfirm = () => {
            closeModal();
            router.push(URLS.auth.login);
          };

          openModal(
            <Modal
              variant="info"
              actions="single"
              title="로그인이 필요합니다"
              description="이 페이지에 접근하려면 로그인이 필요합니다."
              confirmText="확인"
              onConfirm={handleLoginConfirm}
            />
          );
        }
      }
    }
  }, [
    isInitialized,
    pathname,
    isAuthenticated,
    openModal,
    closeModal,
    router,
    isTestEnv,
  ]);

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
