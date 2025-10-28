'use client';

import React from 'react';
import Input from '@/commons/components/input';
import Button from '@/commons/components/button';
import styles from './styles.module.css';
import Image from 'next/image';

/**
 * AuthLogin 컴포넌트
 *
 * 트립트립 로그인 폼을 제공하는 컴포넌트입니다.
 * 피그마 디자인을 기반으로 구현되었습니다.
 */
const AuthLogin: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        {/* 로고 영역 */}
        <div className={styles.logoContainer}>
          <div className={styles.logo}>
            <Image
              src="/icons/filled/triptrip_logo.svg"
              alt="TripTrip Logo"
              width={52}
              height={32}
            />
            {/* 로고 이미지가 있다면 여기에 추가 */}
            {/* <div className={styles.logoPlaceholder}>로고</div> */}
          </div>
        </div>

        {/* 환영 메시지 */}
        <h1 className={styles.welcomeTitle}>트립트립에 오신걸 환영합니다.</h1>

        {/* 로그인 안내 메시지 */}
        <p className={styles.loginSubtitle}>트립트립에 로그인 하세요.</p>

        {/* 폼 영역 */}
        <div className={styles.form}>
          {/* 이메일 입력 */}
          <div className={styles.inputWrapper}>
            <Input
              variant="primary"
              size="medium"
              theme="light"
              placeholder="이메일을 입력해 주세요."
              className={styles.input}
            />
          </div>

          {/* 비밀번호 입력 */}
          <div className={styles.inputWrapper}>
            <Input
              variant="primary"
              size="medium"
              theme="light"
              type="password"
              placeholder="비밀번호를 입력해 주세요."
              className={styles.input}
            />
          </div>

          {/* 로그인 버튼 */}
          <div className={styles.buttonWrapper}>
            <Button
              variant="secondary"
              size="large"
              theme="light"
              className={styles.loginButton}
            >
              로그인
            </Button>
          </div>

          {/* 회원가입 링크 */}
          <div className={styles.signupWrapper}>
            <button className={styles.signupLink}>회원가입</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLogin;
