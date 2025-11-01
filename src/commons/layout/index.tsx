'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Button } from '../components/button';
import { useLayoutRouting } from './hooks/index.link.routing.hook';
import { useLayoutAuth } from './hooks/index.auth.hook';
import { useArea } from './hooks/index.area.hook';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import styles from './styles.module.css';

export type WireframeLayoutVariant = 'default' | 'auth';

interface WireframeLayoutProps {
  children: React.ReactNode;
  variant?: WireframeLayoutVariant;
}

// Header 컴포넌트
function Header() {
  const pathname = usePathname();
  const [activeNav, setActiveNav] = useState<string | null>(null);
  const {
    handleLogoClick,
    handleTriptalkClick,
    handleAccommodationClick,
    handleMypageClick,
  } = useLayoutRouting();
  const { isAuthenticated, userName, handleLogin, handleLogout } =
    useLayoutAuth();

  const handleTriptalkClickWithState = useCallback(() => {
    setActiveNav(null); // 다른 액티브 상태 초기화
    handleTriptalkClick();
  }, [handleTriptalkClick]);

  const handleAccommodationClickWithState = useCallback(() => {
    setActiveNav('accommodation');
    handleAccommodationClick();
  }, [handleAccommodationClick]);

  const handleMypageClickWithState = useCallback(() => {
    setActiveNav('mypage');
    handleMypageClick();
  }, [handleMypageClick]);

  const navigationItems = [
    {
      label: '트립토크',
      href: '/boards',
      isActive: pathname === '/boards' && activeNav === null,
      onClick: handleTriptalkClickWithState,
    },
    {
      label: '숙박권 구매',
      href: '#accommodation',
      isActive: activeNav === 'accommodation',
      onClick: handleAccommodationClickWithState,
    },
    {
      label: '마이 페이지',
      href: '#mypage',
      isActive: activeNav === 'mypage',
      onClick: handleMypageClickWithState,
    },
  ];

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        {/* 왼쪽 영역: 로고 + 네비게이션 */}
        <div className={styles.headerLeft}>
          <div
            className={styles.logoArea}
            onClick={handleLogoClick}
            data-testid="logo-area"
          >
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
                onClick={e => {
                  e.preventDefault();
                  item.onClick();
                }}
                className={`${styles.navItem} ${item.isActive ? styles.navItemActive : ''}`}
                data-testid={`nav-${item.label === '트립토크' ? 'triptalk' : item.label === '숙박권 구매' ? 'accommodation' : 'mypage'}`}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        {/* 오른쪽 영역: 로그인 버튼 또는 프로필 메뉴 */}
        <div className={styles.headerRight}>
          {isAuthenticated ? (
            <div data-testid="profile-area">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger
                      className={cn(styles.profileTrigger)}
                      data-testid="profile-trigger"
                    >
                      <div className={styles.profileContent}>
                        <Image
                          src="/images/profile/img.png"
                          alt="Profile"
                          width={32}
                          height={32}
                          className={styles.profileImage}
                        />
                        <span
                          className={styles.profileName}
                          data-testid="user-name"
                        >
                          {userName || '사용자'}
                        </span>
                      </div>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent
                      className={cn(styles.profileMenuContent)}
                    >
                      <button
                        onClick={handleLogout}
                        data-testid="logout-button"
                        className={styles.logoutButton}
                      >
                        로그아웃
                      </button>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          ) : (
            <Button
              variant="primary"
              size="small"
              onClick={handleLogin}
              rightIcon={
                <Image
                  src="/icons/outline/right_icon.svg"
                  alt="Right Icon"
                  width={24}
                  height={24}
                />
              }
              data-testid="login-button"
            >
              로그인
            </Button>
          )}
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
    <div className={styles.banner} data-testid="banner-area">
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
  const { visibility, isAuthPage } = useArea();

  if (isAuthPage) {
    return (
      <div className={styles.authRoot} data-testid="layout-root">
        <div className={styles.authWrapper}>
          <div className={styles.authChildren}>{children}</div>
          {visibility.image && (
            <div className={styles.authImage}>
              <Image
                src="/images/main.png"
                alt="Main Background"
                fill
                className={styles.bannerImage}
                priority
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.root} data-testid="layout-root">
      {visibility.header && <Header />}
      {visibility.banner && <BannerCarousel />}
      <div className={styles.gap} />
      <main className={styles.children}>{children}</main>
    </div>
  );
}
