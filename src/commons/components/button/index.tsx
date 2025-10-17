import React from 'react';
import styles from './styles.module.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'small' | 'medium' | 'large';
  theme?: 'light' | 'dark';
  children: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  disabled?: boolean;
  fullWidth?: boolean;
}

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
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      className={buttonClasses}
      disabled={disabled}
      {...props}
    >
      {leftIcon && <span className={styles.leftIcon}>{leftIcon}</span>}
      <span className={styles.label}>{children}</span>
      {rightIcon && <span className={styles.rightIcon}>{rightIcon}</span>}
    </button>
  );
}