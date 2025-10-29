'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { useLoginUserMutation } from '@/commons/graphql/react-query-hooks';
import { useModal } from '@/commons/providers/modal/modal.provider';
import Modal from '@/commons/components/modal';
import { URLS } from '@/commons/constants/url';

const ACCESS_TOKEN_KEY = 'accessToken';
const USER_KEY = 'user';
const AUTH_STORAGE_EVENT = 'auth-storage';

// dispatchAuthStorageEvent 함수는 auth.provider.tsx에서 export되지 않으므로 여기서 정의합니다
function dispatchAuthStorageEvent() {
  if (typeof window === 'undefined') return;
  try {
    window.dispatchEvent(new CustomEvent(AUTH_STORAGE_EVENT));
  } catch {
    // noop
  }
}

// Validation schema
const loginSchema = z.object({
  email: z
    .string()
    .min(1, '이메일을 입력해주세요.')
    .refine(val => val.includes('@'), {
      message: '이메일 형식이 올바르지 않습니다.',
    }),
  password: z.string().min(1, '비밀번호를 입력해주세요.'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export function useLoginForm() {
  const router = useRouter();
  const { openModal, closeModal } = useModal();
  const successModalShownRef = useRef(false);
  const failureModalShownRef = useRef(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  const loginMutation = useLoginUserMutation({
    onSuccess: async data => {
      const accessToken = data.loginUser.accessToken;

      // localStorage에 accessToken 저장
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
      }

      // fetchUserLoggedIn API 호출을 위한 custom fetcher
      // Authorization 헤더가 필요하므로 직접 호출
      try {
        const userResponse = await fetch(
          'http://main-practice.codebootcamp.co.kr/graphql',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              query: `
                query FetchUserLoggedIn {
                  fetchUserLoggedIn {
                    _id
                    name
                  }
                }
              `,
            }),
          }
        );

        const userJson = await userResponse.json();

        if (userJson.errors) {
          throw new Error(userJson.errors[0].message);
        }

        const userData = userJson.data.fetchUserLoggedIn;

        // localStorage에 user 저장
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(
            USER_KEY,
            JSON.stringify({ _id: userData._id, name: userData.name })
          );
        }

        // 스토리지 이벤트 디스패치
        dispatchAuthStorageEvent();

        // 로그인 성공 모달 표시 (한 번만)
        if (!successModalShownRef.current) {
          successModalShownRef.current = true;
          openModal(
            <Modal
              variant="info"
              actions="single"
              title="로그인 성공"
              description="로그인에 성공했습니다."
              confirmText="확인"
              onConfirm={() => {
                closeModal();
                successModalShownRef.current = false;
                router.push(URLS.boards.list);
              }}
            />
          );
        }
      } catch {
        // fetchUserLoggedIn 실패 시에도 실패 모달 표시
        if (!failureModalShownRef.current) {
          failureModalShownRef.current = true;
          openModal(
            <Modal
              variant="danger"
              actions="single"
              title="로그인 실패"
              description="로그인에 실패했습니다. 다시 시도해주세요."
              confirmText="확인"
              onConfirm={() => {
                closeModal();
                failureModalShownRef.current = false;
              }}
            />
          );
        }
      }
    },
    onError: () => {
      // 로그인 실패 모달 표시 (한 번만)
      if (!failureModalShownRef.current) {
        failureModalShownRef.current = true;
        openModal(
          <Modal
            variant="danger"
            actions="single"
            title="로그인 실패"
            description="이메일 또는 비밀번호가 올바르지 않습니다."
            confirmText="확인"
            onConfirm={() => {
              closeModal();
              failureModalShownRef.current = false;
            }}
          />
        );
      }
    },
  });

  const onSubmit = handleSubmit(data => {
    successModalShownRef.current = false;
    failureModalShownRef.current = false;
    loginMutation.mutate({
      email: data.email,
      password: data.password,
    });
  });

  const isSubmitDisabled = !isValid || loginMutation.isPending;

  return {
    register,
    errors,
    onSubmit,
    isSubmitDisabled,
    isPending: loginMutation.isPending,
  };
}
