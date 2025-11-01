'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useModal } from '@/commons/providers/modal/modal.provider';
import Modal from '@/commons/components/modal';
import { URLS } from '@/commons/constants/url';
import { usePostcodeBinding } from './index.postcode.hook';
import { flushSync } from 'react-dom';

// Validation schema
const boardFormSchema = z
  .object({
    writer: z.string().min(1, '작성자를 입력해주세요.'),
    password: z.string().min(1, '비밀번호를 입력해주세요.'),
    title: z.string().min(1, '제목을 입력해주세요.'),
    contents: z.string().min(1, '내용을 입력해주세요.'),
    boardAddress: z
      .object({
        zipcode: z.string().optional(),
        address: z.string().optional(),
        addressDetail: z.string().optional(),
      })
      .optional(),
    youtubeUrl: z
      .string()
      .optional()
      .refine(
        val => !val || val === '' || z.string().url().safeParse(val).success,
        {
          message: '올바른 URL 형식이 아닙니다.',
        }
      ),
    images: z.array(z.string()).optional(),
  })
  .refine(
    data => {
      // 주소 필드 중 하나라도 입력되면 우편번호와 기본주소는 필수
      if (data.boardAddress) {
        const { zipcode, address, addressDetail } = data.boardAddress;
        const hasAnyAddress = zipcode || address || addressDetail;

        if (hasAnyAddress) {
          // 하나라도 입력되었다면 우편번호와 기본주소는 필수
          return zipcode && zipcode.length > 0 && address && address.length > 0;
        }
      }
      return true;
    },
    {
      message: '주소를 입력할 경우 우편번호와 기본주소를 입력해주세요.',
      path: ['boardAddress'],
    }
  );

export type BoardFormData = z.infer<typeof boardFormSchema>;

async function uploadFileMutation(
  file: File
): Promise<{ uploadFile: { url: string } }> {
  // GraphQL multipart/form-data 형식으로 파일 업로드
  const formData = new FormData();

  // operations: GraphQL 쿼리와 변수 정의
  const operations = JSON.stringify({
    query: `
      mutation UploadFile($file: Upload!) {
        uploadFile(file: $file) {
          url
        }
      }
    `,
    variables: {
      file: null, // 파일은 map에서 매핑됨
    },
  });

  // map: 파일을 variables에 매핑
  const map = JSON.stringify({
    '0': ['variables.file'],
  });

  // FormData에 추가 (순서 중요: operations -> map -> 파일)
  formData.append('operations', operations);
  formData.append('map', map);
  formData.append('0', file); // 실제 파일 데이터 (키는 '0'으로 설정)

  try {
    const response = await fetch(
      'http://main-practice.codebootcamp.co.kr/graphql',
      {
        method: 'POST',
        // Content-Type은 브라우저가 자동으로 설정 (multipart/form-data + boundary)
        // 헤더를 명시적으로 설정하지 않음
        body: formData,
      }
    );

    // 응답 처리
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const json = await response.json();

    if (json.errors) {
      const errorMessage =
        json.errors[0]?.message || '파일 업로드에 실패했습니다.';
      throw new Error(errorMessage);
    }

    if (!json.data || !json.data.uploadFile || !json.data.uploadFile.url) {
      throw new Error('파일 업로드 응답 형식이 올바르지 않습니다.');
    }

    return json.data;
  } catch (error) {
    // 네트워크 에러나 기타 에러 처리
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('파일 업로드 중 알 수 없는 오류가 발생했습니다.');
  }
}

async function createBoardMutation(variables: {
  createBoardInput: {
    writer: string;
    password: string;
    title: string;
    contents: string;
    boardAddress?: {
      zipcode: string;
      address: string;
      addressDetail: string;
    };
    youtubeUrl?: string;
    images?: string[];
  };
}): Promise<{ createBoard: { _id: string } }> {
  const response = await fetch(
    'http://main-practice.codebootcamp.co.kr/graphql',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation CreateBoard($createBoardInput: CreateBoardInput!) {
            createBoard(createBoardInput: $createBoardInput) {
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
    throw new Error(json.errors[0]?.message || '게시물 작성에 실패했습니다.');
  }

  return json.data;
}

export function useBoardForm(
  initialPostcode?: string,
  initialAddress?: string,
  initialDetailAddress?: string,
  initialWriter?: string,
  initialPassword?: string,
  initialTitle?: string,
  initialContents?: string,
  initialYoutubeUrl?: string
) {
  const router = useRouter();
  const { openModal, closeModal } = useModal();
  const successModalShownRef = useRef(false);
  const failureModalShownRef = useRef(false);

  const { postcode, address, detailAddress, setDetailAddress, openPostcode } =
    usePostcodeBinding({
      postcode: initialPostcode,
      address: initialAddress,
      detailAddress: initialDetailAddress,
    });

  // 이미지 URL 배열 (최대 3개, 인덱스 고정)
  const [images, setImages] = useState<(string | null)[]>([]);
  // 미리보기 URL 배열 (최대 3개, 인덱스 고정)
  const [imagePreviews, setImagePreviews] = useState<(string | null)[]>([]);
  // 업로드 상태 배열 (최대 3개, 인덱스 고정)
  const [uploadStatuses, setUploadStatuses] = useState<
    ('idle' | 'uploading' | 'success' | 'error')[]
  >([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm<BoardFormData>({
    resolver: zodResolver(boardFormSchema),
    mode: 'onChange',
    defaultValues: {
      writer: initialWriter || '',
      password: initialPassword || '',
      title: initialTitle || '',
      contents: initialContents || '',
      boardAddress: initialPostcode
        ? {
            zipcode: initialPostcode,
            address: initialAddress || '',
            addressDetail: initialDetailAddress || '',
          }
        : undefined,
      youtubeUrl: initialYoutubeUrl || '',
      images: undefined,
    },
  });

  // 주소 필드 동기화 (useEffect로 처리)
  useEffect(() => {
    if (postcode || address || detailAddress) {
      // 하나라도 있으면 객체로 설정 (빈 문자열도 허용)
      setValue(
        'boardAddress',
        {
          zipcode: postcode || '',
          address: address || '',
          addressDetail: detailAddress || '',
        },
        { shouldValidate: true }
      );
    } else {
      // 모두 없으면 undefined로 설정
      setValue('boardAddress', undefined, { shouldValidate: true });
    }
  }, [postcode, address, detailAddress, setValue]);

  const uploadFileMutationQuery = useMutation({
    mutationFn: uploadFileMutation,
  });

  const createBoardMutationQuery = useMutation({
    mutationFn: createBoardMutation,
    onSuccess: data => {
      // 게시물 작성 성공 모달 표시 (한 번만)
      if (!successModalShownRef.current) {
        successModalShownRef.current = true;
        openModal(
          <Modal
            variant="info"
            actions="single"
            title="작성완료"
            description="게시물이 성공적으로 작성되었습니다."
            confirmText="확인"
            onConfirm={() => {
              closeModal();
              successModalShownRef.current = false;
              router.push(URLS.build.boardDetail(data.createBoard._id));
            }}
          />
        );
      }
    },
    onError: () => {
      // 게시물 작성 실패 모달 표시 (한 번만)
      if (!failureModalShownRef.current) {
        failureModalShownRef.current = true;
        openModal(
          <Modal
            variant="danger"
            actions="single"
            title="작성실패"
            description="게시물 작성에 실패했습니다. 다시 시도해주세요."
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

  // 업로드 중인지 추적하는 ref (중복 호출 방지)
  const uploadingRefs = useRef<Set<number>>(new Set());

  const handleImageUpload = async (file: File, index: number) => {
    // 인덱스 범위 체크
    if (index < 0 || index >= 3) {
      return;
    }

    // 이미 업로드 중인 경우 중복 호출 방지
    if (uploadingRefs.current.has(index)) {
      console.warn(`이미지 ${index}는 이미 업로드 중입니다.`);
      return;
    }

    // 파일 유효성 검증
    if (!file || !file.type.startsWith('image/')) {
      setUploadStatuses(prev => {
        const newStatuses = [...prev];
        newStatuses[index] = 'error';
        return newStatuses;
      });
      return;
    }

    // 업로드 시작 표시
    uploadingRefs.current.add(index);

    // 기존 미리보기 URL 해제 (메모리 관리)
    if (imagePreviews[index]) {
      URL.revokeObjectURL(imagePreviews[index]!);
    }

    // 미리보기 URL 즉시 생성 (선택 즉시 미리보기 표시)
    const previewUrl = URL.createObjectURL(file);

    // 미리보기 즉시 표시 (동기적으로 업데이트)
    flushSync(() => {
      setImagePreviews(prev => {
        const newPreviews = [...prev];
        newPreviews[index] = previewUrl;
        return newPreviews;
      });
    });

    // 업로드 상태를 'uploading'으로 설정
    setUploadStatuses(prev => {
      const newStatuses = [...prev];
      newStatuses[index] = 'uploading';
      return newStatuses;
    });

    try {
      const result = await uploadFileMutationQuery.mutateAsync(file);
      const url = result.uploadFile.url;

      // 업로드된 이미지 URL 저장
      setImages(prev => {
        const newImages = [...prev];
        newImages[index] = url;
        // 빈 슬롯 제거하여 실제 URL만 배열로 관리
        const filteredImages = newImages.filter(
          (img): img is string => img !== null
        );
        setValue(
          'images',
          filteredImages.length > 0 ? filteredImages : undefined
        );
        return newImages;
      });

      // 업로드 성공 상태
      setUploadStatuses(prev => {
        const newStatuses = [...prev];
        newStatuses[index] = 'success';
        return newStatuses;
      });
    } catch (error) {
      console.error('이미지 업로드 실패:', error);

      // 업로드 실패 시 미리보기 URL 해제 및 상태 초기화
      URL.revokeObjectURL(previewUrl);
      setImagePreviews(prev => {
        const newPreviews = [...prev];
        newPreviews[index] = null;
        return newPreviews;
      });

      setImages(prev => {
        const newImages = [...prev];
        newImages[index] = null;
        // 빈 슬롯 제거하여 실제 URL만 배열로 관리
        const filteredImages = newImages.filter(
          (img): img is string => img !== null
        );
        setValue(
          'images',
          filteredImages.length > 0 ? filteredImages : undefined
        );
        return newImages;
      });

      // 업로드 실패 상태
      setUploadStatuses(prev => {
        const newStatuses = [...prev];
        newStatuses[index] = 'error';
        return newStatuses;
      });
    } finally {
      // 업로드 완료 후 추적 제거
      uploadingRefs.current.delete(index);
    }
  };

  // 여러 파일을 처리하는 함수 (한 번에 여러 파일 선택 시 빈 슬롯에 자동 배정)
  const handleMultipleFiles = async (
    files: FileList,
    startIndex: number
  ): Promise<void> => {
    const fileArray = Array.from(files);
    const availableSlots: number[] = [];

    // 빈 슬롯 찾기 (startIndex부터 시작하여 빈 슬롯 탐색)
    for (
      let i = startIndex;
      i < 3 && availableSlots.length < fileArray.length;
      i++
    ) {
      // 업로드 중이 아니고 이미지가 없는 슬롯만 사용 가능
      if (!uploadingRefs.current.has(i) && !imagePreviews[i]) {
        availableSlots.push(i);
      }
    }

    // 사용 가능한 슬롯이 없으면 첫 번째 파일만 현재 인덱스에 처리
    if (availableSlots.length === 0) {
      if (fileArray.length > 0 && !uploadingRefs.current.has(startIndex)) {
        await handleImageUpload(fileArray[0], startIndex);
      }
      return;
    }

    // 각 파일을 사용 가능한 슬롯에 배정하여 순차적으로 업로드
    // Promise.all을 사용하지 않고 순차적으로 처리하여 state 업데이트 타이밍 보장
    // handleImageUpload 내부에서 미리보기와 상태를 처리하므로 여기서는 직접 호출만 수행
    for (
      let i = 0;
      i < Math.min(fileArray.length, availableSlots.length);
      i++
    ) {
      const file = fileArray[i];
      const slotIndex = availableSlots[i];

      // 업로드 실행 (비동기)
      // handleImageUpload 내부에서 중복 체크, 미리보기, 상태 업데이트를 모두 처리
      await handleImageUpload(file, slotIndex).catch(error => {
        console.error(`이미지 ${slotIndex} 업로드 실패:`, error);
      });
    }
  };

  const handleRemoveImage = (index: number) => {
    // 인덱스 범위 체크
    if (index < 0 || index >= 3) {
      return;
    }

    // 미리보기 URL 해제 (메모리 관리)
    if (imagePreviews[index]) {
      URL.revokeObjectURL(imagePreviews[index]!);
    }

    // 해당 인덱스의 이미지와 미리보기 제거
    setImages(prev => {
      const newImages = [...prev];
      newImages[index] = null;
      // 빈 슬롯 제거하여 실제 URL만 배열로 관리
      const filteredImages = newImages.filter(
        (img): img is string => img !== null
      );
      setValue(
        'images',
        filteredImages.length > 0 ? filteredImages : undefined
      );
      return newImages;
    });

    setImagePreviews(prev => {
      const newPreviews = [...prev];
      newPreviews[index] = null;
      return newPreviews;
    });

    setUploadStatuses(prev => {
      const newStatuses = [...prev];
      newStatuses[index] = 'idle';
      return newStatuses;
    });
  };

  const onSubmit = handleSubmit(data => {
    // 업로드 중이면 submit 차단
    if (uploadStatuses.some(status => status === 'uploading')) {
      return;
    }

    // 중복 요청 방지
    if (createBoardMutationQuery.isPending) {
      return;
    }

    successModalShownRef.current = false;
    failureModalShownRef.current = false;

    const boardAddress =
      data.boardAddress?.zipcode && data.boardAddress?.address
        ? {
            zipcode: data.boardAddress.zipcode,
            address: data.boardAddress.address,
            addressDetail: data.boardAddress.addressDetail || '',
          }
        : undefined;

    createBoardMutationQuery.mutate({
      createBoardInput: {
        writer: data.writer,
        password: data.password,
        title: data.title,
        contents: data.contents,
        boardAddress,
        youtubeUrl: data.youtubeUrl || undefined,
        images:
          images.filter((img): img is string => img !== null).length > 0
            ? images.filter((img): img is string => img !== null)
            : undefined,
      },
    });
  });

  const handleCancel = () => {
    router.push(URLS.boards.list);
  };

  // watch로 필드 값들 추적
  const watchedWriter = watch('writer');
  const watchedPassword = watch('password');
  const watchedTitle = watch('title');
  const watchedContents = watch('contents');

  const isSubmitDisabled =
    !isValid ||
    createBoardMutationQuery.isPending ||
    uploadFileMutationQuery.isPending ||
    uploadStatuses.some(status => status === 'uploading') ||
    !watchedWriter ||
    !watchedPassword ||
    !watchedTitle ||
    !watchedContents;

  return {
    register,
    errors,
    onSubmit,
    isSubmitDisabled,
    isPending: createBoardMutationQuery.isPending,
    postcode,
    address,
    detailAddress,
    setDetailAddress,
    openPostcode,
    images,
    imagePreviews,
    uploadStatuses,
    handleImageUpload,
    handleMultipleFiles,
    handleRemoveImage,
    handleCancel,
    watch,
  };
}

// 컴포넌트 언마운트 시 모든 미리보기 URL 해제를 위한 cleanup hook
export function useImageCleanup(imagePreviews: (string | null)[]) {
  useEffect(() => {
    return () => {
      // 컴포넌트 언마운트 시 모든 미리보기 URL 해제
      imagePreviews.forEach(preview => {
        if (preview) {
          URL.revokeObjectURL(preview);
        }
      });
    };
  }, [imagePreviews]);
}
