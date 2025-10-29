'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useRouter } from 'next/navigation';
import { URLS } from '@/commons/constants/url';

type Nullable<T> = T | null;

interface AuthContextValue {
  isAuthenticated: boolean;
  user: Nullable<unknown>;
  accessToken: Nullable<string>;
  login: () => void;
  logout: () => void;
  getUser: () => Nullable<unknown>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const ACCESS_TOKEN_KEY = 'accessToken';
const USER_KEY = 'user';
const AUTH_STORAGE_EVENT = 'auth-storage';

function getInitialToken(): Nullable<string> {
  if (typeof window === 'undefined') return null;
  try {
    const token = window.localStorage.getItem(ACCESS_TOKEN_KEY);
    return token || null;
  } catch {
    return null;
  }
}

function getInitialUser(): Nullable<unknown> {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function dispatchAuthStorageEvent() {
  if (typeof window === 'undefined') return;
  try {
    window.dispatchEvent(new CustomEvent(AUTH_STORAGE_EVENT));
  } catch {
    // noop
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState<Nullable<string>>(() =>
    getInitialToken()
  );
  const [user, setUser] = useState<Nullable<unknown>>(() => getInitialUser());

  const isMountedRef = useRef(false);

  // 로그인: 로그인 페이지로 이동만 수행
  const login = useCallback(() => {
    router.push(URLS.auth.login);
  }, [router]);

  // 로그아웃: 로컬스토리지 비우고 로그인 페이지로 이동
  const logout = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(ACCESS_TOKEN_KEY);
        window.localStorage.removeItem(USER_KEY);
      }
    } catch {
      // ignore storage errors
    }
    setAccessToken(null);
    setUser(null);
    dispatchAuthStorageEvent();
    router.replace(URLS.auth.login);
  }, [router]);

  const getUser = useCallback(() => user, [user]);

  // 실시간 동기화: storage 이벤트 및 커스텀 이벤트 수신
  useEffect(() => {
    isMountedRef.current = true;
    const handleSync = () => {
      setAccessToken(getInitialToken());
      setUser(getInitialUser());
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === null || e.key === ACCESS_TOKEN_KEY || e.key === USER_KEY) {
        handleSync();
      }
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener(AUTH_STORAGE_EVENT, handleSync as EventListener);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener(
        AUTH_STORAGE_EVENT,
        handleSync as EventListener
      );
    };
  }, []);

  // 마운트 이후에도 토큰/유저가 외부에서 갱신될 수 있으므로 setItem 감시용 래퍼 제공(선택적)
  // 필요 시, 로그인 성공 로직에서 반드시 setItem 후 dispatchAuthStorageEvent() 호출하도록 유도

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: Boolean(accessToken),
      user,
      accessToken,
      login,
      logout,
      getUser,
    }),
    [accessToken, user, login, logout, getUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
