'use client';

import React, { forwardRef, useState } from 'react';
import styles from './styles.module.css';

// Utility function for conditional class names
const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'small' | 'medium' | 'large';
  theme?: 'light' | 'dark';
  label?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  rightButton?: React.ReactNode;
  isTextarea?: boolean;
  maxLength?: number;
  showCount?: boolean;
  disabled?: boolean;
}

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
      leftIcon,
      rightIcon,
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      error ? styles['input--error'] : '',
      isFocused ? styles['input--focused'] : '',
      disabled ? styles['input--disabled'] : '',
      leftIcon ? styles['input--with-left-icon'] : '',
      (rightIcon || rightButton) ? styles['input--with-right-icon'] : '',
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
      required ? styles['label--required'] : '',
      error ? styles['label--error'] : ''
    );

    const helperTextClasses = cn(
      styles.helperText,
      styles[`helperText--${size}`],
      styles[`helperText--${theme}`],
      error ? styles['helperText--error'] : ''
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
          {leftIcon && <div className={styles.leftIcon}>{leftIcon}</div>}
          
          <div className={styles.inputWrapper}>
            {renderInput()}
            {showCount && maxLength && (
              <div className={countClasses}>
                {String(inputValue).length}/{maxLength}
              </div>
            )}
          </div>
          
          {rightIcon && <div className={styles.rightIcon}>{rightIcon}</div>}
          {rightButton && <div className={styles.rightButton}>{rightButton}</div>}
        </div>
        
        {(error || helperText) && (
          <div className={styles.helperTextContainer}>
            <span className={helperTextClasses}>
              {error || helperText}
            </span>
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;