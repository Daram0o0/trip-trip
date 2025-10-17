'use client';

import React from 'react';
import styles from './styles.module.css';

export interface PaginationProps {
  /**
   * 현재 페이지 번호 (1부터 시작)
   */
  currentPage: number;
  /**
   * 전체 페이지 수
   */
  totalPages: number;
  /**
   * 페이지 변경 핸들러
   */
  onPageChange: (page: number) => void;
  /**
   * 표시할 페이지 번호 개수 (기본값: 5)
   */
  visiblePages?: number;
  /**
   * variant 스타일
   */
  variant?: 'primary' | 'secondary' | 'tertiary';
  /**
   * 크기
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * 테마
   */
  theme?: 'light' | 'dark';
  /**
   * 추가 CSS 클래스
   */
  className?: string;
  /**
   * 이전/다음 버튼 숨기기
   */
  hideNavigation?: boolean;
  /**
   * 첫 페이지/마지막 페이지로 이동 버튼 표시
   */
  showFirstLast?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  visiblePages = 5,
  variant = 'primary',
  size = 'medium',
  theme = 'light',
  className,
  hideNavigation = false,
  showFirstLast = false,
}) => {
  // 페이지 번호 배열 생성
  const generatePageNumbers = (): number[] => {
    const pages: number[] = [];
    const halfVisible = Math.floor(visiblePages / 2);
    
    let startPage = Math.max(1, currentPage - halfVisible);
    const endPage = Math.min(totalPages, startPage + visiblePages - 1);
    
    // 끝 페이지가 totalPages에 가까우면 시작 페이지 조정
    if (endPage - startPage + 1 < visiblePages) {
      startPage = Math.max(1, endPage - visiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const pageNumbers = generatePageNumbers();
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const handlePrevious = () => {
    if (!isFirstPage) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (!isLastPage) {
      onPageChange(currentPage + 1);
    }
  };

  const handleFirst = () => {
    if (!isFirstPage) {
      onPageChange(1);
    }
  };

  const handleLast = () => {
    if (!isLastPage) {
      onPageChange(totalPages);
    }
  };

  // 컴포넌트 클래스명 생성 (기존 컴포넌트 패턴과 일관성 유지)
  const containerClass = [
    styles.container,
    styles[variant],
    styles[size],
    styles[theme],
    className
  ].filter(Boolean).join(' ');

  const buttonClass = (page: number) => [
    styles.pageButton,
    styles[variant],
    styles[size],
    styles[theme],
    page === currentPage ? styles.active : ''
  ].filter(Boolean).join(' ');

  const navButtonClass = (disabled: boolean) => [
    styles.navButton,
    styles[variant],
    styles[size],
    styles[theme],
    disabled ? styles.disabled : ''
  ].filter(Boolean).join(' ');

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className={containerClass} role="navigation" aria-label="페이지네이션">
      <div className={styles.paginationContent}>
        {/* 첫 페이지 버튼 */}
        {showFirstLast && !isFirstPage && (
          <button
            type="button"
            className={navButtonClass(false)}
            onClick={handleFirst}
            aria-label="첫 페이지로 이동"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={styles.icon}
            >
              <path
                d="M18.41 16.59L13.82 12L18.41 7.41L17 6L11 12L17 18L18.41 16.59ZM6 6H8V18H6V6Z"
                fill="currentColor"
              />
            </svg>
          </button>
        )}

        {/* 이전 페이지 버튼 */}
        {!hideNavigation && (
          <button
            type="button"
            className={navButtonClass(isFirstPage)}
            onClick={handlePrevious}
            disabled={isFirstPage}
            aria-label="이전 페이지로 이동"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={styles.icon}
            >
              <path
                d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12L15.41 7.41Z"
                fill="currentColor"
              />
            </svg>
          </button>
        )}

        {/* 페이지 번호들 */}
        <div className={styles.pageNumbers}>
          {pageNumbers.map((page) => (
            <button
              key={page}
              type="button"
              className={buttonClass(page)}
              onClick={() => handlePageClick(page)}
              aria-label={`${page}페이지로 이동`}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </button>
          ))}
        </div>

        {/* 다음 페이지 버튼 */}
        {!hideNavigation && (
          <button
            type="button"
            className={navButtonClass(isLastPage)}
            onClick={handleNext}
            disabled={isLastPage}
            aria-label="다음 페이지로 이동"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={styles.icon}
            >
              <path
                d="M8.59 16.59L10 18L16 12L10 6L8.59 7.41L13.17 12L8.59 16.59Z"
                fill="currentColor"
              />
            </svg>
          </button>
        )}

        {/* 마지막 페이지 버튼 */}
        {showFirstLast && !isLastPage && (
          <button
            type="button"
            className={navButtonClass(false)}
            onClick={handleLast}
            aria-label="마지막 페이지로 이동"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={styles.icon}
            >
              <path
                d="M5.59 7.41L10.18 12L5.59 16.59L7 18L13 12L7 6L5.59 7.41ZM16 6H18V18H16V6Z"
                fill="currentColor"
              />
            </svg>
          </button>
        )}
      </div>
    </nav>
  );
};

export default Pagination;
