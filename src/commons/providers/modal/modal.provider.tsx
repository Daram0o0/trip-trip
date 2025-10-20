'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import styles from './styles.module.css';

// 모달 컨텍스트 타입 정의
interface ModalContextType {
  isOpen: boolean;
  content: ReactNode | null;
  openModal: (content: ReactNode) => void;
  closeModal: () => void;
}

// 모달 컨텍스트 생성
const ModalContext = createContext<ModalContextType | undefined>(undefined);

// 모달 프로바이더 컴포넌트
export function ModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<ReactNode | null>(null);

  const openModal = useCallback((modalContent: ReactNode) => {
    setContent(modalContent);
    setIsOpen(true);
    // 모달이 열릴 때 body 스크롤 방지
    document.body.style.overflow = 'hidden';
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setContent(null);
    // 모달이 닫힐 때 body 스크롤 복원
    document.body.style.overflow = 'unset';
  }, []);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        closeModal();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, closeModal]);

  const value = {
    isOpen,
    content,
    openModal,
    closeModal,
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
      {/* 모달 포털 */}
      {isOpen &&
        typeof window !== 'undefined' &&
        createPortal(
          <div className={styles.modalOverlay} onClick={closeModal}>
            <div
              className={styles.modalContent}
              onClick={e => e.stopPropagation()}
            >
              <button
                className={styles.closeButton}
                onClick={closeModal}
                aria-label="모달 닫기"
              >
                ×
              </button>
              {content}
            </div>
          </div>,
          document.body
        )}
    </ModalContext.Provider>
  );
}

// 모달 훅
export function useModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}
