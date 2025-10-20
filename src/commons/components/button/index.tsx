import React from 'react';
import styles from './styles.module.css';

/**
 * Button 컴포넌트의 Props 인터페이스
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 버튼의 스타일 변형 */
  variant?: 'primary' | 'secondary' | 'tertiary';
  /** 버튼의 크기 */
  size?: 'small' | 'medium' | 'large';
  /** 테마 설정 */
  theme?: 'light' | 'dark';
  /** 버튼 내부 텍스트 */
  children: React.ReactNode;
  /** 왼쪽 아이콘 */
  leftIcon?: React.ReactNode;
  /** 오른쪽 아이콘 */
  rightIcon?: React.ReactNode;
  /** 비활성화 상태 */
  disabled?: boolean;
  /** 전체 너비 사용 여부 */
  fullWidth?: boolean;
}

/**
 * 재사용 가능한 Button 컴포넌트
 *
 * @param props - ButtonProps 인터페이스를 따르는 props
 * @returns JSX.Element
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="medium">
 *   클릭하세요
 * </Button>
 * ```
 */
export default function Button({
  variant = 'primary',
  size = 'medium',
  theme = 'light',
  children,
  leftIcon,
  rightIcon,
  disabled = false,
  fullWidth = false,
  className = '',
  ...props
}: ButtonProps) {
  const buttonClasses = [
    styles.button,
    styles[variant],
    styles[size],
    styles[theme],
    disabled ? styles.disabled : '',
    fullWidth ? styles.fullWidth : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={buttonClasses} disabled={disabled} {...props}>
      {leftIcon && <span className={styles.leftIcon}>{leftIcon}</span>}
      <span className={styles.label}>{children}</span>
      {rightIcon && <span className={styles.rightIcon}>{rightIcon}</span>}
    </button>
  );
}
