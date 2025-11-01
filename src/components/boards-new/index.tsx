'use client';

import React from 'react';
import styles from './styles.module.css';
import Input from '@/commons/components/input';
import Button from '@/commons/components/button';
import { useAuth } from '@/commons/providers/auth/auth.provider';
import { useBoardForm, useImageCleanup } from './hooks/index.form.hook';

interface BoardsNewProps {
  mode?: 'create' | 'edit';
  initialData?: {
    author?: string;
    password?: string;
    title?: string;
    content?: string;
    postcode?: string;
    address?: string;
    detailAddress?: string;
    youtubeLink?: string;
  };
}

/**
 * BoardsNew 컴포넌트
 *
 * 게시물 작성/수정 페이지의 폼을 제공하는 컴포넌트입니다.
 * 프로젝트 디자인 시스템을 기반으로 구현되었습니다.
 *
 * @example
 * ```tsx
 * <BoardsNew mode="create" />
 * <BoardsNew mode="edit" initialData={boardData} />
 * ```
 */
const BoardsNew = ({ mode = 'create', initialData }: BoardsNewProps) => {
  const { user } = useAuth();

  // 현재 로그인된 사용자의 이름 가져오기
  const currentUserName =
    user && typeof user === 'object' && 'name' in user
      ? (user as { name: string }).name
      : '';

  const {
    register,
    errors,
    onSubmit,
    isSubmitDisabled,
    postcode,
    address,
    detailAddress,
    setDetailAddress,
    openPostcode,
    imagePreviews,
    uploadStatuses,
    handleImageUpload,
    handleMultipleFiles,
    handleRemoveImage,
    handleCancel,
    watch,
  } = useBoardForm(
    initialData?.postcode,
    initialData?.address,
    initialData?.detailAddress,
    currentUserName || initialData?.author, // 로그인된 사용자 이름 우선 사용
    initialData?.password,
    initialData?.title,
    initialData?.content,
    initialData?.youtubeLink
  );

  // 컴포넌트 언마운트 시 미리보기 URL 해제
  useImageCleanup(imagePreviews);

  return (
    <div className={styles.container} data-testid="boards-new-container">
      {/* 제목 영역: 1280 * 28 */}
      <h1 className={styles.title}>
        {mode === 'edit' ? '게시물 수정' : '게시물 작성'}
      </h1>

      {/* Gap 영역: 1280 * 40 */}
      <div className={styles.gap}></div>

      {/* 게시물 폼 영역: 1280 * 1440 */}
      <form
        className={styles.form}
        onSubmit={e => {
          e.preventDefault();
          onSubmit(e);
        }}
        noValidate
      >
        {/* input1 영역: 작성자, 비밀번호 */}
        <div className={styles.inputRow}>
          <div className={styles.inputHalf}>
            <Input
              label="작성자"
              required
              placeholder="작성자를 입력하세요"
              disabled={mode === 'edit' || !!currentUserName} // 로그인된 사용자가 있으면 readonly
              value={watch('writer') || ''}
              {...register('writer')}
              error={errors.writer?.message}
              readOnly={!!currentUserName} // 로그인된 사용자가 있으면 readonly
            />
          </div>
          <div className={styles.inputHalf}>
            <Input
              label="비밀번호"
              required
              type="password"
              placeholder="비밀번호를 입력하세요"
              disabled={mode === 'edit'}
              value={watch('password') || ''}
              {...register('password')}
              error={errors.password?.message}
            />
          </div>
        </div>

        {/* 구분선 */}
        <div className={styles.divider}></div>

        {/* input2 영역: 제목 */}
        <div className={styles.inputFull}>
          <Input
            label="제목"
            required
            placeholder="제목을 입력하세요"
            value={watch('title') || ''}
            {...register('title')}
            error={errors.title?.message}
          />
        </div>

        {/* 구분선 */}
        <div className={styles.divider}></div>

        {/* input3 영역: 내용 */}
        <div className={styles.inputFull}>
          <Input
            label="내용"
            required
            isTextarea
            placeholder="내용을 입력하세요"
            value={watch('contents') || ''}
            {...register('contents')}
            error={errors.contents?.message}
          />
        </div>

        {/* 구분선 */}
        <div className={styles.divider}></div>

        {/* input4 영역: 주소 */}
        <div className={styles.inputFull}>
          <div className={styles.addressSection}>
            {/* 우편번호 검색 */}
            <div className={styles.postcodeRow}>
              <div className={styles.postcodeInput}>
                <Input
                  label="주소"
                  placeholder="01234"
                  className={styles.postcodeField}
                  value={postcode || ''}
                  readOnly
                  data-testid="postcode-input"
                  {...register('boardAddress.zipcode')}
                  error={errors.boardAddress?.zipcode?.message}
                />
              </div>
              <Button
                variant="outline"
                size="medium"
                className={styles.postcodeButton}
                aria-label="우편번호 검색"
                onClick={openPostcode}
                data-testid="postcode-search-button"
                type="button"
              >
                우편번호 검색
              </Button>
            </div>

            {/* 주소 입력 필드들 */}
            <div className={styles.addressFields}>
              <Input
                placeholder="주소를 입력해 주세요"
                className={styles.addressField}
                value={address || ''}
                readOnly
                data-testid="address-input"
                {...register('boardAddress.address')}
                error={errors.boardAddress?.address?.message}
              />
              <Input
                placeholder="상세주소"
                className={styles.addressField}
                value={detailAddress || ''}
                data-testid="detail-address-input"
                {...register('boardAddress.addressDetail', {
                  onChange: e => setDetailAddress(e.target.value),
                })}
                error={errors.boardAddress?.addressDetail?.message}
              />
            </div>
          </div>
        </div>

        {/* Daum Postcode 모달은 useModal을 통해 렌더링됨 */}

        {/* 구분선 */}
        <div className={styles.divider}></div>

        {/* input5 영역: 연락처 */}
        <div className={styles.inputFull}>
          <Input
            label="유튜브 링크"
            placeholder="링크를 입력하세요"
            value={watch('youtubeUrl') || ''}
            {...register('youtubeUrl')}
            error={errors.youtubeUrl?.message}
          />
        </div>

        {/* 구분선 */}
        <div className={styles.divider}></div>

        {/* input6 영역: 이미지 업로드 */}
        <div className={styles.inputFull}>
          <div className={styles.imageUploadSection}>
            <div className={styles.imageUploadLabel}>
              <span className={styles.labelText}>사진 첨부</span>
            </div>
            <div className={styles.imageUploadGrid}>
              {[0, 1, 2].map(index => {
                const hasImage = imagePreviews[index];
                const uploadStatus = uploadStatuses[index] || 'idle';
                const isUploading = uploadStatus === 'uploading';
                const hasError = uploadStatus === 'error';

                return (
                  <label
                    key={index}
                    className={`${styles.imageUploadBox} ${
                      isUploading
                        ? styles.imageUploadBoxUploading
                        : styles.imageUploadBoxPointer
                    }`}
                  >
                    {hasImage ? (
                      <>
                        <img
                          src={imagePreviews[index]!}
                          alt={`업로드된 이미지 ${index + 1}`}
                          className={`${styles.imagePreview} ${
                            isUploading ? styles.imagePreviewUploading : ''
                          }`}
                        />
                        {isUploading && (
                          <div
                            role="status"
                            aria-busy="true"
                            aria-live="polite"
                            className={styles.uploadingOverlay}
                          >
                            <div
                              className={styles.uploadingSpinner}
                              aria-label="업로드 중"
                            />
                            <span className={styles.uploadingText}>
                              업로드 중...
                            </span>
                          </div>
                        )}
                        {hasError && (
                          <div role="alert" className={styles.errorOverlay}>
                            <span className={styles.errorTitle}>
                              업로드 실패
                            </span>
                            <span className={styles.errorMessage}>
                              클릭하여 다시 시도
                            </span>
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={e => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleRemoveImage(index);
                          }}
                          className={styles.removeButton}
                          aria-label="이미지 제거"
                        >
                          ×
                        </button>
                      </>
                    ) : (
                      <>
                        <div className={styles.uploadIcon}>+</div>
                        <div className={styles.uploadText}>
                          클릭해서 사진 업로드
                        </div>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className={styles.fileInput}
                      aria-label="이미지 업로드"
                      disabled={isUploading}
                      multiple
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const files = e.target.files;
                        const inputElement = e.target;

                        // 파일이 없거나 업로드 중이면 무시
                        if (!files || files.length === 0 || isUploading) {
                          return;
                        }

                        // FileList를 배열로 변환하여 처리
                        const fileArray = Array.from(files);

                        // 여러 파일 선택 시 빈 슬롯에 자동 배정
                        if (fileArray.length > 1) {
                          handleMultipleFiles(files, index).finally(() => {
                            // 같은 파일을 다시 선택할 수 있도록 value 초기화 (finally에서만 수행)
                            inputElement.value = '';
                          });
                        } else {
                          // 단일 파일 선택 시 기존 로직 사용
                          const file = fileArray[0];
                          handleImageUpload(file, index).finally(() => {
                            // 같은 파일을 다시 선택할 수 있도록 value 초기화 (finally에서만 수행)
                            inputElement.value = '';
                          });
                        }
                      }}
                    />
                  </label>
                );
              })}
            </div>
            {errors.images && (
              <div role="alert" className={styles.imageError}>
                {errors.images.message}
              </div>
            )}
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className={styles.buttonArea}>
          <Button
            variant="outline"
            size="medium"
            className={styles.cancelButton}
            onClick={handleCancel}
            type="button"
          >
            취소
          </Button>
          <Button
            variant="secondary"
            size="medium"
            disabled={isSubmitDisabled}
            className={styles.submitButton}
            type="submit"
          >
            {mode === 'edit' ? '수정하기' : '등록하기'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BoardsNew;
