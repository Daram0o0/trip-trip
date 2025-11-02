'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useModal } from '@/commons/providers/modal/modal.provider';
import Modal from '@/commons/components/modal';
import { useAuth } from '@/commons/providers/auth/auth.provider';

// 사용자 이름 추출 헬퍼 함수
const getUserNameFromUser = (userObj: unknown): string | null => {
  if (!userObj || typeof userObj !== 'object') return null;
  const obj = userObj as { name?: string; _id?: string };
  return obj.name || null;
};

// localStorage에서 user 정보를 안전하게 가져오는 함수
const getUserFromLocalStorage = (): string => {
  if (typeof window === 'undefined') return '';
  try {
    const userStr = window.localStorage.getItem('user');
    if (userStr) {
      const userFromStorage = JSON.parse(userStr) as {
        name?: string;
        _id?: string;
      };
      return userFromStorage?.name || '';
    }
  } catch {
    // localStorage 파싱 오류는 무시 (빈 문자열 반환)
  }
  return '';
};

// 로그인 상태에 따라 동적으로 schema 생성
const createCommentFormSchema = (isAuthenticated: boolean) => {
  const baseSchema = z.object({
    rating: z
      .number()
      .min(1, '별점을 선택해주세요.')
      .max(5, '별점은 5점까지입니다.'),
    contents: z
      .string()
      .min(1, '댓글 내용을 입력해주세요.')
      .max(100, '댓글은 100자 이하로 입력해주세요.'),
  });

  if (isAuthenticated) {
    // 로그인된 경우: writer, password optional
    return baseSchema.extend({
      writer: z.string().optional(),
      password: z.string().optional(),
    });
  } else {
    // 로그인되지 않은 경우: writer, password required
    return baseSchema.extend({
      writer: z.string().min(1, '작성자를 입력해주세요.'),
      password: z.string().min(1, '비밀번호를 입력해주세요.'),
    });
  }
};

export type CommentFormData = z.infer<
  ReturnType<typeof createCommentFormSchema>
>;

async function createBoardCommentMutation(variables: {
  boardId: string;
  createBoardCommentInput: {
    writer?: string;
    password?: string;
    rating: number;
    contents: string;
  };
}): Promise<{
  createBoardComment: {
    _id: string;
    writer?: string | null;
    contents: string;
    rating: number;
    createdAt: string;
  };
}> {
  const response = await fetch(
    'http://main-practice.codebootcamp.co.kr/graphql',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
        mutation CreateBoardComment($boardId: ID!, $createBoardCommentInput: CreateBoardCommentInput!) {
          createBoardComment(boardId: $boardId, createBoardCommentInput: $createBoardCommentInput) {
            _id
            writer
            contents
            rating
            createdAt
          }
        }
      `,
        variables,
      }),
    }
  );

  const json = await response.json();

  if (json.errors) {
    throw new Error(json.errors[0]?.message || '댓글 작성에 실패했습니다.');
  }

  return json.data;
}

interface UseCommentFormParams {
  boardId: string;
}

interface UseCommentFormResult {
  register: ReturnType<typeof useForm<CommentFormData>>['register'];
  errors: ReturnType<typeof useForm<CommentFormData>>['formState']['errors'];
  touchedFields: ReturnType<
    typeof useForm<CommentFormData>
  >['formState']['touchedFields'];
  isSubmitted: boolean;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  isSubmitDisabled: boolean;
  isPending: boolean;
  rating: number;
  setRating: (rating: number) => void;
  ratingTouched: boolean;
  watch: ReturnType<typeof useForm<CommentFormData>>['watch'];
}

export function useCommentForm({
  boardId,
}: UseCommentFormParams): UseCommentFormResult {
  const { isAuthenticated, user } = useAuth();
  const queryClient = useQueryClient();
  const { openModal, closeModal } = useModal();
  const successModalShownRef = useRef(false);
  const failureModalShownRef = useRef(false);
  const [rating, setRating] = useState<number>(0);
  const [ratingTouched, setRatingTouched] = useState<boolean>(false);

  // 로그인된 사용자 이름 가져오기
  const getUserName = useCallback((): string => {
    if (isAuthenticated && user) {
      const userName = getUserNameFromUser(user);
      if (userName) return userName;
    }
    if (isAuthenticated) {
      return getUserFromLocalStorage();
    }
    return '';
  }, [isAuthenticated, user]);

  const initialWriter = getUserName();

  // 로그인 상태 변경 시 schema 재생성
  const schema = createCommentFormSchema(isAuthenticated);

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, isSubmitted },
    setValue,
    watch,
    trigger,
    clearErrors,
  } = useForm<CommentFormData>({
    resolver: zodResolver(schema),
    mode: 'onTouched', // 터치된 필드에만 에러 표시
    defaultValues: {
      writer: initialWriter || '',
      password: '',
      rating: 0,
      contents: '',
    },
  });

  // 로그인 상태 변경 시 검증 다시 수행
  useEffect(() => {
    trigger();
  }, [isAuthenticated, trigger]);

  // 로그인 상태에 따라 writer 초기값 동기화 (항상 최신 사용자 이름 유지)
  useEffect(() => {
    if (isAuthenticated) {
      const userName = getUserName();
      if (userName) {
        setValue('writer', userName, {
          shouldValidate: false,
          shouldTouch: false,
        });
      }
    } else {
      setValue('writer', '', { shouldValidate: false, shouldTouch: false });
    }
  }, [isAuthenticated, user, setValue, getUserName]);

  // 컴포넌트 마운트 시에도 작성자 이름 설정
  useEffect(() => {
    if (isAuthenticated) {
      const userName = getUserName();
      if (userName) {
        setValue('writer', userName, {
          shouldValidate: false,
          shouldTouch: false,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 마운트 시에만 실행

  // rating state와 form value 동기화 (rating이 변경될 때만)
  useEffect(() => {
    if (rating > 0) {
      setRatingTouched(true);
      setValue('rating', rating, { shouldValidate: true, shouldTouch: true });
    } else {
      setValue('rating', 0, { shouldValidate: false, shouldTouch: false });
    }
  }, [rating, setValue]);

  const createCommentMutation = useMutation({
    mutationFn: createBoardCommentMutation,
    onSuccess: () => {
      // 댓글 목록 최신화
      queryClient.invalidateQueries({
        queryKey: ['fetchBoardComments', boardId, 1],
      });

      // 작성완료 모달 표시 (한 번만)
      if (!successModalShownRef.current) {
        successModalShownRef.current = true;
        openModal(
          <Modal
            variant="info"
            actions="single"
            title="작성완료"
            description="댓글이 성공적으로 작성되었습니다."
            confirmText="확인"
            onConfirm={() => {
              closeModal();
              successModalShownRef.current = false;
            }}
          />
        );
      }

      // 폼 초기화 (작성자 제외하고 초기화)
      // 에러 메시지 모두 제거
      clearErrors();

      // 비밀번호, 댓글 내용만 초기화 (작성자는 유지)
      setValue('password', '', { shouldValidate: false, shouldTouch: false });
      setValue('contents', '', { shouldValidate: false, shouldTouch: false });
      setValue('rating', 0, { shouldValidate: false, shouldTouch: false });

      // 로그인된 경우 작성자 이름 항상 유지
      if (isAuthenticated) {
        const userName = getUserName();
        if (userName) {
          setValue('writer', userName, {
            shouldValidate: false,
            shouldTouch: false,
          });
        }
      }

      setRating(0);
      setRatingTouched(false);
    },
    onError: () => {
      // 작성실패 모달 표시 (한 번만)
      if (!failureModalShownRef.current) {
        failureModalShownRef.current = true;
        openModal(
          <Modal
            variant="danger"
            actions="single"
            title="작성실패"
            description="댓글 작성에 실패했습니다. 다시 시도해주세요."
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

  const onSubmit = handleSubmit(
    data => {
      // 중복 요청 방지
      if (createCommentMutation.isPending) {
        return;
      }

      // 별점 체크
      if (data.rating < 1 || data.rating > 5) {
        return;
      }

      successModalShownRef.current = false;
      failureModalShownRef.current = false;

      // 로그인된 경우 writer는 user 정보에서 가져오기
      const finalWriter = isAuthenticated ? getUserName() : data.writer;

      createCommentMutation.mutate({
        boardId,
        createBoardCommentInput: {
          writer: finalWriter || undefined,
          password: data.password || undefined,
          rating: data.rating,
          contents: data.contents,
        },
      });
    },
    errors => {
      // validation 실패 시 별점 필드도 touched로 표시
      if (errors.rating) {
        setRatingTouched(true);
        setValue('rating', rating, { shouldValidate: true });
      }
    }
  );

  const watchedWriter = watch('writer');
  const watchedPassword = watch('password');
  const watchedContents = watch('contents');

  // 필수 필드 체크 (로그인 상태에 따라 다름)
  const hasRequiredFields = isAuthenticated
    ? // 로그인된 사용자: 별점 + 비밀번호 + 댓글 내용 (작성자는 자동 입력)
      rating >= 1 &&
      watchedPassword &&
      watchedPassword.trim().length > 0 &&
      watchedContents &&
      watchedContents.trim().length > 0
    : // 비로그인 사용자: 작성자 + 비밀번호 + 별점 + 댓글 내용
      watchedWriter &&
      watchedWriter.trim().length > 0 &&
      watchedPassword &&
      watchedPassword.trim().length > 0 &&
      rating >= 1 &&
      watchedContents &&
      watchedContents.trim().length > 0;

  const isSubmitDisabled =
    !hasRequiredFields ||
    createCommentMutation.isPending ||
    (!!errors.writer && !isAuthenticated) ||
    !!errors.password ||
    !!errors.contents ||
    !!errors.rating;

  // 디버깅용 로그 (개발 환경에서만)
  if (process.env.NODE_ENV === 'development') {
    console.log('댓글 폼 상태:', {
      isAuthenticated,
      rating,
      watchedWriter,
      watchedPassword,
      watchedContents,
      hasRequiredFields,
      isSubmitDisabled,
      errors,
      isPending: createCommentMutation.isPending,
    });
  }

  return {
    register,
    errors,
    touchedFields,
    isSubmitted,
    onSubmit,
    isSubmitDisabled,
    isPending: createCommentMutation.isPending,
    rating,
    setRating,
    ratingTouched,
    watch,
  };
}
