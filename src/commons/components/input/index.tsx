'use client';

import React, { forwardRef, useState } from 'react';
import { cn } from '@/lib/utils';
import styles from './styles.module.css';

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * 입력 필드의 시각적 스타일 변형
   */
  variant?: 'primary' | 'secondary' | 'tertiary';

  /**
   * 입력 필드의 크기
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * 테마 (light/dark)
   */
  theme?: 'light' | 'dark';

  /**
   * 라벨 텍스트
   */
  label?: string;

  /**
   * 필수 입력 여부
   */
  required?: boolean;

  /**
   * 에러 메시지
   */
  error?: string;

  /**
   * 도움말 텍스트
   */
  helperText?: string;

  /**
   * 우측 버튼
   */
  rightButton?: React.ReactNode;

  /**
   * 텍스트에어리어 여부
   */
  isTextarea?: boolean;

  /**
   * 최대 입력 길이
   */
  maxLength?: number;

  /**
   * 글자 수 표시 여부
   */
  showCount?: boolean;

  /**
   * 비활성화 상태
   */
  disabled?: boolean;
}

/**
 * Input 컴포넌트
 *
 * 다양한 variant, size, theme를 지원하는 재사용 가능한 입력 필드 컴포넌트입니다.
 * 피그마 디자인 시스템을 기반으로 구현되었습니다.
 *
 * @example
 * ```tsx
 * <Input variant="primary" size="medium" label="이름" required />
 * ```
 *
 * @example
 * ```tsx
 * <Input
 *   variant="secondary"
 *   isTextarea
 *   label="내용"
 *   maxLength={100}
 *   showCount
 * />
 * ```
 */
const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  (
    {
      variant = 'primary',
      size = 'medium',
      theme = 'light',
      label,
      required = false,
      error,
      helperText,
      rightButton,
      isTextarea = false,
      maxLength,
      showCount = false,
      disabled = false,
      className,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const [inputValue, setInputValue] = useState(value || '');
    const [isFocused, setIsFocused] = useState(false);

    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      const newValue = e.target.value;
      setInputValue(newValue);
      onChange?.(e as React.ChangeEvent<HTMLInputElement>);
    };

    const handleFocus = () => {
      setIsFocused(true);
    };

    const handleBlur = () => {
      setIsFocused(false);
    };

    const inputClasses = cn(
      styles.input,
      styles[`input--${variant}`],
      styles[`input--${size}`],
      styles[`input--${theme}`],
      {
        [styles['input--error']]: !!error,
        [styles['input--focused']]: isFocused,
        [styles['input--disabled']]: disabled,
        [styles['input--filled']]: !!inputValue,
        [styles['input--with-right-icon']]: !!rightButton,
      },
      className
    );

    const containerClasses = cn(
      styles.container,
      styles[`container--${variant}`],
      styles[`container--${size}`],
      styles[`container--${theme}`]
    );

    const labelClasses = cn(
      styles.label,
      styles[`label--${size}`],
      styles[`label--${theme}`],
      {
        [styles['label--required']]: required,
        [styles['label--error']]: !!error,
      }
    );

    const helperTextClasses = cn(
      styles.helperText,
      styles[`helperText--${size}`],
      styles[`helperText--${theme}`],
      {
        [styles['helperText--error']]: !!error,
      }
    );

    const countClasses = cn(
      styles.count,
      styles[`count--${size}`],
      styles[`count--${theme}`]
    );

    const renderInput = () => {
      if (isTextarea) {
        return (
          <textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            className={inputClasses}
            value={inputValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            maxLength={maxLength}
            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        );
      }

      return (
        <input
          ref={ref as React.Ref<HTMLInputElement>}
          type="text"
          className={inputClasses}
          value={inputValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          maxLength={maxLength}
          {...props}
        />
      );
    };

    return (
      <div className={containerClasses}>
        {label && (
          <div className={styles.labelContainer}>
            <label className={labelClasses}>
              {label}
              {required && <span className={styles.required}>*</span>}
            </label>
          </div>
        )}

        <div className={styles.inputContainer}>
          <div className={styles.inputWrapper}>
            {renderInput()}
            {showCount && maxLength && (
              <div className={countClasses}>
                {String(inputValue).length}/{maxLength}
              </div>
            )}
          </div>

          {rightButton && (
            <div className={styles.rightButton}>{rightButton}</div>
          )}
        </div>

        {(error || helperText) && (
          <span className={helperTextClasses}>{error || helperText}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
