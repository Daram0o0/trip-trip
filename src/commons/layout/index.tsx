'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Button } from '../components/button';
import { shouldShowBanner } from '@/commons/constants/url';
import styles from './styles.module.css';

export type WireframeLayoutVariant = 'default' | 'auth';

interface WireframeLayoutProps {
  children: React.ReactNode;
  variant?: WireframeLayoutVariant;
}

// Header 컴포넌트
function Header() {
  const pathname = usePathname();

  const navigationItems = [
    {
      label: '트립토크',
      href: '/triptalk',
      isActive: pathname === '/triptalk',
    },
    {
      label: '숙박권 구매',
      href: '/accommodation',
      isActive: pathname === '/accommodation',
    },
    { label: '마이 페이지', href: '/mypage', isActive: pathname === '/mypage' },
  ];

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        {/* 왼쪽 영역: 로고 + 네비게이션 */}
        <div className={styles.headerLeft}>
          <div className={styles.logoArea}>
            <Image
              src="/icons/filled/triptrip_logo.svg"
              alt="TripTrip Logo"
              width={52}
              height={32}
              priority
            />
          </div>
          <nav className={styles.navigation}>
            {navigationItems.map(item => (
              <a
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${item.isActive ? styles.navItemActive : ''}`}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        {/* 오른쪽 영역: 로그인 버튼 */}
        <div className={styles.headerRight}>
          <Button
            variant="primary"
            size="small"
            rightIcon={
              <Image
                src="/icons/outline/right_icon.svg"
                alt="Right Icon"
                width={24}
                height={24}
              />
            }
          >
            로그인
          </Button>
        </div>
      </div>
    </header>
  );
}

// Banner Carousel 컴포넌트
function BannerCarousel() {
  const bannerImages = [
    '/images/banner1.png',
    '/images/banner2.png',
    '/images/banner3.png',
  ];

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 3000 }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className={styles.banner}>
      <div className={styles.carouselContainer}>
        <div className={styles.carouselViewport} ref={emblaRef}>
          <div className={styles.carouselTrack}>
            {bannerImages.map((image, index) => (
              <div key={index} className={styles.carouselSlide}>
                <Image
                  src={image}
                  alt={`Banner ${index + 1}`}
                  fill
                  className={styles.bannerImage}
                  priority={index === 0}
                />
              </div>
            ))}
          </div>
        </div>

        {/* 네비게이션 인디케이터 */}
        <div className={styles.carouselIndicators}>
          {bannerImages.map((_, index) => (
            <button
              key={index}
              className={`${styles.indicator} ${index === selectedIndex ? styles.indicatorActive : ''}`}
              onClick={() => scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
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
      <Header />
      {shouldShowBanner(pathname) && <BannerCarousel />}
      <div className={styles.gap} />
      <main className={styles.children}>{children}</main>
    </div>
  );
}
