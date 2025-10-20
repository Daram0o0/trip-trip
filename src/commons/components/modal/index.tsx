import React from 'react';
import Button from '../button';
import styles from './styles.module.css';

export interface ModalProps {
  variant?: 'info' | 'danger';
  actions?: 'single' | 'dual';
  theme?: 'light' | 'dark';
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
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // 피그마 디자인에는 아이콘이 없으므로 아이콘 관련 코드 제거

  const getButtonVariant = (): 'primary' | 'secondary' | 'tertiary' => {
    if (variant === 'danger') return 'primary';
    return 'primary';
  };

  const getSecondaryButtonVariant = ():
    | 'primary'
    | 'secondary'
    | 'tertiary' => {
    return 'secondary';
  };

  return (
    <div className={modalClasses}>
      <div className={styles.content}>
        <div className={styles.textContent}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.description}>{description}</p>
        </div>
      </div>

      <div className={styles.actions}>
        {actions === 'dual' && (
          <Button
            variant={getSecondaryButtonVariant()}
            theme="light"
            size="medium"
            onClick={onCancel}
            className={styles.cancelButton}
          >
            {cancelText}
          </Button>
        )}
        <Button
          variant={getButtonVariant()}
          theme="light"
          size="medium"
          onClick={onConfirm}
          className={styles.confirmButton}
        >
          {confirmText}
        </Button>
      </div>
    </div>
  );
}
