import React from 'react';
import { cn } from '@/lib/utils';
import styles from './styles.module.css';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 버튼의 시각적 스타일 변형
   */
  variant?: 'primary' | 'secondary' | 'outline';

  /**
   * 버튼의 크기
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * 테마 (light/dark)
   */
  theme?: 'light' | 'dark';

  /**
   * 버튼이 비활성화 상태인지 여부
   */
  disabled?: boolean;

  /**
   * 버튼 텍스트
   */
  children: React.ReactNode;

  /**
   * 좌측 아이콘 (rightIcon과 동시에 사용할 수 없음)
   */
  leftIcon?: React.ReactNode;

  /**
   * 우측 아이콘 (leftIcon과 동시에 사용할 수 없음)
   */
  rightIcon?: React.ReactNode;

  /**
   * 버튼 너비 (className으로 제어)
   */
  className?: string;

  /**
   * 클릭 핸들러
   */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;

  /**
   * 버튼이 전체 너비를 사용할지 여부
   */
  fullWidth?: boolean;
}

/**
 * Button 컴포넌트
 *
 * 다양한 variant, size, theme를 지원하는 재사용 가능한 버튼 컴포넌트입니다.
 * 피그마 디자인 시스템을 기반으로 구현되었습니다.
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="medium" onClick={handleClick}>
 *   클릭하세요
 * </Button>
 * ```
 *
 * @example
 * ```tsx
 * <Button variant="outline" leftIcon={<SearchIcon />}>
 *   검색
 * </Button>
 * ```
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'medium',
      theme = 'light',
      disabled = false,
      children,
      leftIcon,
      rightIcon,
      className,
      onClick,
      fullWidth = false,
      ...props
    },
    ref
  ) => {
    // 핵심요구사항: 양쪽 아이콘을 모두 가진 경우는 없어야 함
    if (leftIcon && rightIcon) {
      console.warn(
        'Button: leftIcon과 rightIcon을 동시에 사용할 수 없습니다. leftIcon만 사용됩니다.'
      );
    }

    const buttonClasses = cn(
      styles.button,
      styles[`button--${variant}`],
      styles[`button--${size}`],
      styles[`button--${theme}`],
      {
        [styles['button--disabled']]: disabled,
        [styles['button--with-left-icon']]: !!leftIcon && !rightIcon,
        [styles['button--with-right-icon']]: !!rightIcon && !leftIcon,
        [styles['button--full-width']]: fullWidth,
      },
      className
    );

    return (
      <button
        ref={ref}
        className={buttonClasses}
        disabled={disabled}
        onClick={onClick}
        {...props}
      >
        {leftIcon && !rightIcon && (
          <span className={styles['button__left-icon']}>{leftIcon}</span>
        )}

        <span className={styles['button__label']}>{children}</span>

        {rightIcon && !leftIcon && (
          <span className={styles['button__right-icon']}>{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
