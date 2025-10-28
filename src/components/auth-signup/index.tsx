'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import Input from '@/commons/components/input';
import Button from '@/commons/components/button';
import styles from './styles.module.css';

export interface AuthSignupProps {
  className?: string;
}

/**
 * AuthSignup 컴포넌트
 *
 * 회원가입 폼을 제공하는 컴포넌트입니다.
 * 피그마 디자인을 기반으로 구현되었습니다.
 */
const AuthSignup: React.FC<AuthSignupProps> = ({ className }) => {
  return (
    <div className={cn(styles.container, className)}>
      <div className={styles.formContainer}>
        {/* 제목 */}
        <h1 className={styles.title}>회원가입</h1>

        {/* 설명 */}
        <p className={styles.description}>
          회원가입을 위해 아래 빈칸을 모두 채워 주세요.
        </p>

        {/* 폼 영역 */}
        <div className={styles.form}>
          {/* 이메일 입력 */}
          <div className={styles.inputWrapper}>
            <Input
              variant="primary"
              size="medium"
              theme="light"
              label="이메일"
              required
              placeholder="이메일을 입력해 주세요."
              className={styles.input}
            />
          </div>

          {/* 이름 입력 */}
          <div className={styles.inputWrapper}>
            <Input
              variant="primary"
              size="medium"
              theme="light"
              label="이름"
              required
              placeholder="이름을 입력해 주세요."
              className={styles.input}
            />
          </div>

          {/* 비밀번호 입력 */}
          <div className={styles.inputWrapper}>
            <Input
              variant="primary"
              size="medium"
              theme="light"
              label="비밀번호"
              required
              type="password"
              placeholder="비밀번호를 입력해 주세요."
              className={styles.input}
            />
          </div>

          {/* 비밀번호 확인 입력 */}
          <div className={styles.inputWrapper}>
            <Input
              variant="primary"
              size="medium"
              theme="light"
              label="비밀번호 확인"
              required
              type="password"
              placeholder="비밀번호를 한번 더 입력해 주세요."
              className={styles.input}
            />
          </div>

          {/* 회원가입 버튼 */}
          <div className={styles.buttonWrapper}>
            <Button
              variant="secondary"
              size="medium"
              theme="light"
              className={styles.submitButton}
            >
              회원가입
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthSignup;
