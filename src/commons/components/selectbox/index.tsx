'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import styles from './styles.module.css';

export interface SelectboxOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface SelectboxProps {
  options: SelectboxOption[];
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'small' | 'medium' | 'large';
  theme?: 'light' | 'dark';
  disabled?: boolean;
  className?: string;
  onChange?: (value: string) => void;
  onOpen?: () => void;
  onClose?: () => void;
}

export const Selectbox: React.FC<SelectboxProps> = ({
  options = [],
  value,
  defaultValue,
  placeholder = '선택하세요',
  variant = 'primary',
  size = 'medium',
  theme = 'light',
  disabled = false,
  className,
  onChange,
  onOpen,
  onClose,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value || defaultValue || '');
  const selectboxRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const handleSelect = useCallback((optionValue: string) => {
    if (disabled) return;
    
    setSelectedValue(optionValue);
    setIsOpen(false);
    onChange?.(optionValue);
    onClose?.();
  }, [disabled, onChange, onClose]);

  const handleToggle = () => {
    if (disabled) return;
    
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    
    if (newIsOpen) {
      onOpen?.();
    } else {
      onClose?.();
    }
  };

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectboxRef.current && !selectboxRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        onClose?.();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // 키보드 네비게이션
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      const currentIndex = options.findIndex(option => option.value === selectedValue);
      
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          const nextIndex = currentIndex < options.length - 1 ? currentIndex + 1 : 0;
          setSelectedValue(options[nextIndex].value);
          break;
        case 'ArrowUp':
          event.preventDefault();
          const prevIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1;
          setSelectedValue(options[prevIndex].value);
          break;
        case 'Enter':
        case ' ':
          event.preventDefault();
          handleSelect(selectedValue);
          break;
        case 'Escape':
          event.preventDefault();
          setIsOpen(false);
          onClose?.();
          break;
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, selectedValue, options, onClose, handleSelect]);

  const selectedOption = options.find(option => option.value === selectedValue);

  const selectboxClasses = cn(
    styles.selectbox,
    styles[variant],
    styles[size],
    styles[theme],
    {
      [styles.open]: isOpen,
      [styles.disabled]: disabled,
    },
    className
  );

  const triggerClasses = cn(
    styles.trigger,
    styles[variant],
    styles[size],
    styles[theme],
    {
      [styles.open]: isOpen,
      [styles.disabled]: disabled,
    }
  );

  const listClasses = cn(
    styles.list,
    styles[variant],
    styles[size],
    styles[theme],
    {
      [styles.open]: isOpen,
    }
  );

  return (
    <div ref={selectboxRef} className={selectboxClasses}>
      <button
        type="button"
        className={triggerClasses}
        onClick={handleToggle}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={selectedOption?.label || placeholder}
      >
        <div className={styles.triggerContent}>
          {selectedOption?.icon && (
            <span className={styles.triggerIcon}>
              {selectedOption.icon}
            </span>
          )}
          <span className={styles.triggerLabel}>
            {selectedOption?.label || placeholder}
          </span>
        </div>
        <span className={cn(styles.triggerArrow, isOpen && styles.open)}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 9L12 15L18 9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      {isOpen && (
        <ul
          ref={listRef}
          className={listClasses}
          role="listbox"
          aria-label="옵션 목록"
        >
          {options.map((option) => (
            <li
              key={option.value}
              className={cn(styles.option, 
                option.value === selectedValue && styles.selected,
                option.disabled && styles.disabled
              )}
              onClick={() => !option.disabled && handleSelect(option.value)}
              role="option"
              aria-selected={option.value === selectedValue}
              aria-disabled={option.disabled}
            >
              {option.icon && (
                <span className={styles.optionIcon}>
                  {option.icon}
                </span>
              )}
              <span className={styles.optionLabel}>
                {option.label}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Selectbox;
