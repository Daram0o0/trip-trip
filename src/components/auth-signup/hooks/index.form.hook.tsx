'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useModal } from '@/commons/providers/modal/modal.provider';
import Modal from '@/commons/components/modal';
import { URLS } from '@/commons/constants/url';

// Validation schema
const signupSchema = z
  .object({
    email: z
      .string()
      .min(1, '이메일을 입력해주세요.')
      .refine(val => val.includes('@'), {
        message: '이메일 형식이 올바르지 않습니다.',
      }),
    password: z
      .string()
      .min(1, '비밀번호를 입력해주세요.')
      .refine(
        val => {
          const hasLetter = /[a-zA-Z]/.test(val);
          const hasNumber = /[0-9]/.test(val);
          return hasLetter && hasNumber && val.length >= 8;
        },
        {
          message: '영문과 숫자를 포함한 8자리 이상의 비밀번호를 입력해주세요.',
        }
      ),
    passwordConfirm: z.string().min(1, '비밀번호 확인을 입력해주세요.'),
    name: z.string().min(1, '이름을 입력해주세요.'),
  })
  .refine(data => data.password === data.passwordConfirm, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['passwordConfirm'],
  });

export type SignupFormData = z.infer<typeof signupSchema>;

async function createUserMutation(variables: {
  createUserInput: {
    email: string;
    password: string;
    name: string;
  };
}): Promise<{ createUser: { _id: string } }> {
  const response = await fetch(
    'http://main-practice.codebootcamp.co.kr/graphql',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
        mutation CreateUser($createUserInput: CreateUserInput!) {
          createUser(createUserInput: $createUserInput) {
            _id
          }
        }
      `,
        variables,
      }),
    }
  );

  const json = await response.json();

  if (json.errors) {
    throw new Error(json.errors[0]?.message || '회원가입에 실패했습니다.');
  }

  return json.data;
}

export function useSignupForm() {
  const router = useRouter();
  const { openModal, closeModal } = useModal();
  const successModalShownRef = useRef(false);
  const failureModalShownRef = useRef(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
  });

  const signupMutation = useMutation({
    mutationFn: createUserMutation,
    onSuccess: () => {
      // 회원가입 성공 모달 표시 (한 번만)
      if (!successModalShownRef.current) {
        successModalShownRef.current = true;
        openModal(
          <Modal
            variant="info"
            actions="single"
            title="가입완료"
            description="회원가입에 성공했습니다."
            confirmText="확인"
            onConfirm={() => {
              closeModal();
              successModalShownRef.current = false;
              router.push(URLS.auth.login);
            }}
          />
        );
      }
    },
    onError: () => {
      // 회원가입 실패 모달 표시 (한 번만)
      if (!failureModalShownRef.current) {
        failureModalShownRef.current = true;
        openModal(
          <Modal
            variant="danger"
            actions="single"
            title="가입실패"
            description="회원가입에 실패했습니다. 다시 시도해주세요."
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
    signupMutation.mutate({
      createUserInput: {
        email: data.email,
        password: data.password,
        name: data.name,
      },
    });
  });

  const isSubmitDisabled = !isValid || signupMutation.isPending;

  return {
    register,
    errors,
    onSubmit,
    isSubmitDisabled,
    isPending: signupMutation.isPending,
  };
}
