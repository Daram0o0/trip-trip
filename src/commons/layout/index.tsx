'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import styles from './styles.module.css';

export type WireframeLayoutVariant = 'default' | 'auth';

interface WireframeLayoutProps {
  children: React.ReactNode;
  variant?: WireframeLayoutVariant;
}

export default function WireframeLayout({ children }: WireframeLayoutProps) {
  const pathname = usePathname();
  const isAuthPage = pathname.includes('auth');

  if (isAuthPage) {
    return (
      <div className={styles.authRoot}>
        <div className={styles.authWrapper}>
          <div className={styles.authChildren}>{children}</div>
          <div className={styles.authImage} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <header className={styles.header} />
      <div className={styles.banner} />
      <div className={styles.gap} />
      <main className={styles.children}>{children}</main>
    </div>
  );
}
