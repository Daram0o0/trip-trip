'use client';

import React, { useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './auth.provider';
import { useModal } from '../modal/modal.provider';
import Modal from '@/commons/components/modal';
import { URLS } from '@/commons/constants/url';

// 테스트 환경 변수 및 전역 변수 타입 선언
declare global {
  interface Window {
    __TEST_BYPASS__?: boolean;
  }
}

/**
 * 권한 검증 GUARD 훅
 * 회원 전용 기능에 대한 접근 권한을 검증하고, 권한이 없을 경우 로그인 모달을 표시합니다.
 *
 * @example
 * ```tsx
 * const { guardAuth } = useAuthGuard();
 *
 * const handleMemberOnlyAction = () => {
 *   if (guardAuth()) {
 *     // 권한이 있을 때만 실행
 *     console.log('회원 전용 기능 실행');
 *   }
 * };
 * ```
 */
export function useAuthGuard() {
  const { isAuthenticated } = useAuth();
  const { openModal, closeModal } = useModal();
  const router = useRouter();
  const modalShownRef = useRef(false);
  const sessionModalShownRef = useRef(false);

  /**
   * 테스트 환경 여부 확인
   */
  const isTestEnvironment = useCallback(() => {
    return process.env.NEXT_PUBLIC_TEST_ENV === 'test';
  }, []);

  /**
   * 로그인 검사 패스 여부 확인
   */
  const shouldBypassAuthCheck = useCallback(() => {
    // 테스트 환경에서는 기본적으로 로그인된 상태로 간주
    if (isTestEnvironment()) {
      // 전역 변수가 명시적으로 false로 설정된 경우에만 검사 수행
      return window.__TEST_BYPASS__ !== false;
    }
    return false;
  }, [isTestEnvironment]);

  /**
   * 실제 로그인 상태 확인
   */
  const checkActualAuthStatus = useCallback(() => {
    // 테스트 환경에서 패스 설정이 되어 있으면 로그인된 것으로 간주
    if (shouldBypassAuthCheck()) {
      return true;
    }

    // 실제 환경에서는 항상 인증 상태를 검사
    return isAuthenticated;
  }, [isAuthenticated, shouldBypassAuthCheck]);

  /**
   * 로그인 모달 표시
   */
  const showLoginModal = useCallback(() => {
    // 이미 모달이 표시된 경우 중복 표시 방지
    if (modalShownRef.current || sessionModalShownRef.current) {
      return;
    }

    modalShownRef.current = true;
    sessionModalShownRef.current = true;

    const handleLoginConfirm = () => {
      closeModal();
      modalShownRef.current = false;
      router.push(URLS.auth.login);
    };

    const handleLoginCancel = () => {
      closeModal();
      modalShownRef.current = false;
    };

    const loginModal = (
      <Modal
        variant="info"
        actions="dual"
        title="로그인이 필요합니다"
        description="이 기능을 사용하려면 로그인이 필요합니다. 로그인하시겠습니까?"
        confirmText="로그인하러가기"
        cancelText="취소"
        onConfirm={handleLoginConfirm}
        onCancel={handleLoginCancel}
      />
    );

    openModal(loginModal);
  }, [openModal, closeModal, router]);

  /**
   * 권한 검증 함수
   * 회원 전용 기능 실행 전에 호출하여 권한을 검증합니다.
   *
   * @returns 권한이 있으면 true, 없으면 false
   */
  const guardAuth = useCallback(() => {
    const hasPermission = checkActualAuthStatus();

    if (!hasPermission) {
      showLoginModal();
      return false;
    }

    return true;
  }, [checkActualAuthStatus, showLoginModal]);

  /**
   * 테스트 환경에서 권한 검증을 강제로 실행하는 함수
   * 비회원 가드 테스트가 필요한 경우에만 사용
   *
   * @returns 권한이 있으면 true, 없으면 false
   */
  const forceAuthCheck = useCallback(() => {
    // 테스트 환경에서 강제로 인증 검사를 실행
    if (isTestEnvironment()) {
      const originalBypass = window.__TEST_BYPASS__;
      window.__TEST_BYPASS__ = false;

      const result = guardAuth();

      // 원래 상태로 복원
      window.__TEST_BYPASS__ = originalBypass;

      return result;
    }

    return guardAuth();
  }, [isTestEnvironment, guardAuth]);

  /**
   * 테스트 환경 설정 함수들
   */
  const testUtils = {
    /**
     * 테스트 환경에서 로그인 상태로 설정 (기본값)
     */
    setLoggedIn: useCallback(() => {
      if (isTestEnvironment()) {
        window.__TEST_BYPASS__ = true;
      }
    }, [isTestEnvironment]),

    /**
     * 테스트 환경에서 비로그인 상태로 설정 (비회원 가드 테스트용)
     */
    setLoggedOut: useCallback(() => {
      if (isTestEnvironment()) {
        window.__TEST_BYPASS__ = false;
      }
    }, [isTestEnvironment]),

    /**
     * 현재 테스트 환경 여부 확인
     */
    isTestEnv: isTestEnvironment,

    /**
     * 현재 로그인 상태 확인 (테스트 환경 고려)
     */
    getCurrentAuthStatus: checkActualAuthStatus,

    /**
     * 세션 모달 표시 상태 리셋 (테스트용)
     */
    resetModalState: useCallback(() => {
      sessionModalShownRef.current = false;
    }, []),
  };

  return {
    guardAuth,
    forceAuthCheck,
    testUtils,
  };
}

export default useAuthGuard;
