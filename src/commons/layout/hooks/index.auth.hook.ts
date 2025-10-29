import { useAuth } from '@/commons/providers/auth/auth.provider';

/**
 * Layout에서 사용하는 인증 관련 Hook
 * 로그인 상태에 따른 UI 분기와 인증 기능을 제공합니다.
 */
export function useLayoutAuth() {
  const { isAuthenticated, user, login, logout } = useAuth();

  // 유저 이름 추출 (user 객체에서 name 필드 추출)
  const getUserName = (): string | null => {
    if (!user || typeof user !== 'object') return null;
    const userObj = user as { name?: string };
    return userObj.name || null;
  };

  const userName = getUserName();

  // 로그인 버튼 클릭 핸들러
  const handleLogin = () => {
    login(); // auth provider의 login 함수 호출 (로그인 페이지로 이동)
  };

  // 로그아웃 버튼 클릭 핸들러
  const handleLogout = () => {
    logout(); // auth provider의 logout 함수 호출
  };

  return {
    isAuthenticated,
    user,
    userName,
    handleLogin,
    handleLogout,
  };
}
