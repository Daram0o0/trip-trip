'use client';

import React from 'react';
import Input from '@/commons/components/input';
import Button from '@/commons/components/button';
import styles from './styles.module.css';

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
  return (
    <div className={styles.container}>
      {/* 제목 영역: 1280 * 28 */}
      <h1 className={styles.title}>
        {mode === 'edit' ? '게시물 수정' : '게시물 작성'}
      </h1>

      {/* Gap 영역: 1280 * 40 */}
      <div className={styles.gap}></div>

      {/* 게시물 폼 영역: 1280 * 1440 */}
      <main className={styles.form}>
        {/* input1 영역: 작성자, 비밀번호 */}
        <div className={styles.inputRow}>
          <div className={styles.inputHalf}>
            <Input
              label="작성자"
              required
              placeholder="작성자를 입력하세요"
              defaultValue={initialData?.author}
              disabled={mode === 'edit'}
            />
          </div>
          <div className={styles.inputHalf}>
            <Input
              label="비밀번호"
              required
              type="password"
              placeholder="비밀번호를 입력하세요"
              defaultValue={initialData?.password}
              disabled={mode === 'edit'}
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
            defaultValue={initialData?.title}
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
            defaultValue={initialData?.content}
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
                  required
                  placeholder="01234"
                  className={styles.postcodeField}
                  defaultValue={initialData?.postcode}
                />
              </div>
              <Button
                variant="outline"
                size="medium"
                className={styles.postcodeButton}
                aria-label="우편번호 검색"
              >
                우편번호 검색
              </Button>
            </div>

            {/* 주소 입력 필드들 */}
            <div className={styles.addressFields}>
              <Input
                placeholder="주소를 입력해 주세요"
                className={styles.addressField}
                defaultValue={initialData?.address}
              />
              <Input
                placeholder="상세주소"
                className={styles.addressField}
                defaultValue={initialData?.detailAddress}
              />
            </div>
          </div>
        </div>

        {/* 구분선 */}
        <div className={styles.divider}></div>

        {/* input5 영역: 연락처 */}
        <div className={styles.inputFull}>
          <Input
            label="유튜브 링크"
            placeholder="링크를 입력하세요"
            defaultValue={initialData?.youtubeLink}
          />
        </div>

        {/* 구분선 */}
        <div className={styles.divider}></div>

        {/* input6 영역: 이미지 업로드 */}
        <div className={styles.inputFull}>
          <div className={styles.imageUploadSection}>
            <div className={styles.imageUploadLabel}>
              <span className={styles.labelText}>사진 첨부</span>
              <span className={styles.required}>*</span>
            </div>
            <div className={styles.imageUploadGrid}>
              <div className={styles.imageUploadBox}>
                <div className={styles.uploadIcon}>+</div>
                <div className={styles.uploadText}>클릭해서 사진 업로드</div>
                <input
                  type="file"
                  accept="image/*"
                  className={styles.fileInput}
                  aria-label="이미지 업로드"
                />
              </div>
              <div className={styles.imageUploadBox}>
                <div className={styles.uploadIcon}>+</div>
                <div className={styles.uploadText}>클릭해서 사진 업로드</div>
                <input
                  type="file"
                  accept="image/*"
                  className={styles.fileInput}
                  aria-label="이미지 업로드"
                />
              </div>
              <div className={styles.imageUploadBox}>
                <div className={styles.uploadIcon}>+</div>
                <div className={styles.uploadText}>클릭해서 사진 업로드</div>
                <input
                  type="file"
                  accept="image/*"
                  className={styles.fileInput}
                  aria-label="이미지 업로드"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className={styles.buttonArea}>
          <Button
            variant="outline"
            size="medium"
            className={styles.cancelButton}
          >
            취소
          </Button>
          <Button
            variant="secondary"
            size="medium"
            disabled={true}
            className={styles.submitButton}
          >
            {mode === 'edit' ? '수정하기' : '등록하기'}
          </Button>
        </div>
      </main>
    </div>
  );
};

export default BoardsNew;
