'use client';

import React, { forwardRef, useState } from 'react';
import styles from './styles.module.css';

// Utility function for conditional class names
const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export interface SearchbarProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'size' | 'onChange'
  > {
  /**
   * 검색바의 variant 스타일
   */
  variant?: 'primary' | 'secondary' | 'tertiary';

  /**
   * 검색바의 크기
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * 테마 (라이트/다크)
   */
  theme?: 'light' | 'dark';

  /**
   * 플레이스홀더 텍스트
   */
  placeholder?: string;

  /**
   * 검색 아이콘 표시 여부
   */
  showIcon?: boolean;

  /**
   * 검색바 비활성화 상태
   */
  disabled?: boolean;

  /**
   * 검색바 읽기 전용 상태
   */
  readOnly?: boolean;

  /**
   * 검색바 값
   */
  value?: string;

  /**
   * 검색바 값 변경 핸들러
   */
  onChange?: (value: string) => void;

  /**
   * 검색 실행 핸들러 (Enter 키 또는 검색 아이콘 클릭)
   */
  onSearch?: (value: string) => void;

  /**
   * 포커스 핸들러
   */
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;

  /**
   * 블러 핸들러
   */
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;

  /**
   * 추가 CSS 클래스명
   */
  className?: string;

  /**
   * 추가 스타일
   */
  style?: React.CSSProperties;
}

const Searchbar = forwardRef<HTMLInputElement, SearchbarProps>(
  (
    {
      variant = 'primary',
      size = 'medium',
      theme = 'light',
      placeholder = '제목을 검색해 주세요.',
      showIcon = true,
      disabled = false,
      readOnly = false,
      value,
      onChange,
      onSearch,
      onFocus,
      onBlur,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [internalValue, setInternalValue] = useState('');

    const currentValue = value !== undefined ? value : internalValue;

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;

      if (value === undefined) {
        setInternalValue(newValue);
      }

      onChange?.(newValue);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        onSearch?.(currentValue);
      }
    };

    const handleSearchClick = () => {
      onSearch?.(currentValue);
    };

    const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(event);
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(event);
    };

    const searchbarClasses = cn(
      styles.searchbar,
      styles[variant],
      styles[size],
      styles[theme],
      isFocused ? styles.focused : '',
      disabled ? styles.disabled : '',
      readOnly ? styles.readonly : '',
      className
    );

    const inputClasses = cn(
      styles.input,
      styles[`input-${variant}`],
      styles[`input-${size}`],
      styles[`input-${theme}`]
    );

    const iconClasses = cn(
      styles.icon,
      styles[`icon-${variant}`],
      styles[`icon-${size}`],
      styles[`icon-${theme}`]
    );

    return (
      <div className={searchbarClasses} style={style}>
        {showIcon && (
          <div className={styles.iconContainer}>
            <svg
              className={iconClasses}
              onClick={handleSearchClick}
              role="button"
              tabIndex={disabled ? -1 : 0}
              onKeyDown={(e: React.KeyboardEvent<SVGSVGElement>) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSearchClick();
                }
              }}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>
        )}
        <input
          ref={ref}
          type="text"
          className={inputClasses}
          placeholder={placeholder}
          value={currentValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          readOnly={readOnly}
          {...props}
        />
      </div>
    );
  }
);

Searchbar.displayName = 'Searchbar';

export default Searchbar;
