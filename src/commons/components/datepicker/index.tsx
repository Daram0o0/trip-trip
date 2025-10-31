'use client';

import React, { forwardRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import styles from './styles.module.css';

export interface DatePickerProps {
  /**
   * 날짜 선택기의 크기
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * 테마 (light/dark)
   */
  theme?: 'light' | 'dark';

  /**
   * 비활성화 상태
   */
  disabled?: boolean;

  /**
   * 최소 날짜
   */
  minDate?: string;

  /**
   * 최대 날짜
   */
  maxDate?: string;

  /**
   * 시작일
   */
  startDate?: string;

  /**
   * 종료일
   */
  endDate?: string;

  /**
   * 날짜 기간 변경 핸들러
   */
  onDateRangeChange?: (
    startDate: string | null,
    endDate: string | null
  ) => void;

  /**
   * 추가 CSS 클래스
   */
  className?: string;
}

/**
 * DatePicker 컴포넌트
 *
 * 날짜 기간 선택을 지원하는 재사용 가능한 날짜 선택기 컴포넌트입니다.
 * yyyy.mm.dd - yyyy.mm.dd 형식으로 시작일과 종료일을 선택할 수 있습니다.
 * 피그마 디자인 시스템을 기반으로 구현되었습니다.
 *
 * @example
 * ```tsx
 * <DatePicker size="medium" theme="light" />
 * ```
 *
 * @example
 * ```tsx
 * <DatePicker
 *   size="large"
 *   theme="dark"
 *   minDate="2024-01-01"
 *   maxDate="2024-12-31"
 *   onDateRangeChange={(startDate, endDate) => console.log(startDate, endDate)}
 * />
 * ```
 */
// 날짜 문자열을 input type="date" 형식으로 변환
const formatDateForInput = (dateString: string): string => {
  if (!dateString) return '';
  return dateString.replace(/\./g, '-');
};

const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(
  (
    {
      size = 'medium',
      theme = 'light',
      disabled = false,
      minDate,
      maxDate,
      startDate,
      endDate,
      onDateRangeChange,
      className,
    },
    ref
  ) => {
    const [startDateValue, setStartDateValue] = useState(startDate || '');
    const [endDateValue, setEndDateValue] = useState(endDate || '');
    const [isStartFocused, setIsStartFocused] = useState(false);
    const [isEndFocused, setIsEndFocused] = useState(false);

    // 외부 prop 변경 시 내부 state 동기화
    useEffect(() => {
      setStartDateValue(startDate || '');
    }, [startDate]);

    useEffect(() => {
      setEndDateValue(endDate || '');
    }, [endDate]);

    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setStartDateValue(newValue);
      onDateRangeChange?.(newValue || null, endDateValue || null);
    };

    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setEndDateValue(newValue);
      onDateRangeChange?.(startDateValue || null, newValue || null);
    };

    const handleStartFocus = () => {
      setIsStartFocused(true);
    };

    const handleStartBlur = () => {
      setIsStartFocused(false);
    };

    const handleEndFocus = () => {
      setIsEndFocused(true);
    };

    const handleEndBlur = () => {
      setIsEndFocused(false);
    };

    const inputClasses = cn(
      styles.datePicker,
      styles[`datePicker--${size}`],
      styles[`datePicker--${theme}`],
      {
        [styles['datePicker--focused']]: isStartFocused || isEndFocused,
        [styles['datePicker--disabled']]: disabled,
      },
      className
    );

    const containerClasses = cn(
      styles.dateRangeContainer,
      styles[`dateRangeContainer--${size}`],
      styles[`dateRangeContainer--${theme}`]
    );

    return (
      <div ref={ref} className={containerClasses}>
        <div className={styles.dateInputWrapper}>
          <input
            type="date"
            className={cn(inputClasses, {
              [styles['datePicker--focused']]: isStartFocused,
              [styles['datePicker--filled']]: !!startDateValue,
            })}
            value={formatDateForInput(startDateValue)}
            onChange={handleStartDateChange}
            onFocus={handleStartFocus}
            onBlur={handleStartBlur}
            disabled={disabled}
            min={minDate}
            max={endDateValue || maxDate}
            placeholder="시작일"
          />
          <span className={styles.dateSeparator}>-</span>
          <input
            type="date"
            className={cn(inputClasses, {
              [styles['datePicker--focused']]: isEndFocused,
              [styles['datePicker--filled']]: !!endDateValue,
            })}
            value={formatDateForInput(endDateValue)}
            onChange={handleEndDateChange}
            onFocus={handleEndFocus}
            onBlur={handleEndBlur}
            disabled={disabled}
            min={startDateValue || minDate}
            max={maxDate}
            placeholder="종료일"
          />
        </div>
      </div>
    );
  }
);

DatePicker.displayName = 'DatePicker';

export default DatePicker;
