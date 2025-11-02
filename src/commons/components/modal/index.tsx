import React from 'react';
import Image from 'next/image';
import Button from '../button';
import styles from './styles.module.css';

export interface ModalProps {
  variant?: 'info' | 'danger';
  actions?: 'single' | 'dual';
  theme?: 'light' | 'dark';
  icon?: 'none' | 'check' | 'close';
  size?: 's' | 'm';
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  className?: string;
}

export default function Modal({
  variant = 'info',
  actions = 'single',
  theme = 'light',
  icon = 'none',
  size = 'm',
  title,
  description,
  confirmText = '확인',
  cancelText = '취소',
  onConfirm,
  onCancel,
  className = '',
}: ModalProps) {
  const modalClasses = [
    styles.modal,
    styles[variant],
    styles[actions],
    styles[theme],
    styles[size],
    icon !== 'none' ? styles.withIcon : styles.noIcon,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const getPrimaryActionVariant = (): 'primary' | 'secondary' | 'outline' => {
    // 요구사항: 기본 버튼은 secondary 사용
    return 'secondary';
  };

  const getSecondaryButtonVariant = (): 'primary' | 'secondary' | 'outline' => {
    // 요구사항: dual일 때 outline과 secondary 조합
    return 'outline';
  };

  return (
    <div className={modalClasses}>
      <div className={styles.content}>
        {icon !== 'none' && (
          <div className={styles.iconWrapper} aria-hidden="true">
            {icon === 'check' && (
              <Image
                src="/icons/filled/check.svg"
                alt=""
                width={28}
                height={28}
                className={styles.icon}
              />
            )}
            {icon === 'close' && (
              <Image
                src="/icons/outline/close.svg"
                alt=""
                width={28}
                height={28}
                className={styles.icon}
              />
            )}
          </div>
        )}
        <div className={styles.textContent}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.description}>{description}</p>
        </div>
      </div>

      <div className={styles.actions}>
        {actions === 'dual' && (
          <Button
            variant={getSecondaryButtonVariant()}
            size="medium"
            onClick={onCancel}
            className={styles.cancelButton}
          >
            {cancelText}
          </Button>
        )}
        <Button
          variant={getPrimaryActionVariant()}
          size="medium"
          onClick={onConfirm}
          className={styles.confirmButton}
          data-testid="modal-confirm-button"
        >
          {confirmText}
        </Button>
      </div>
    </div>
  );
}
