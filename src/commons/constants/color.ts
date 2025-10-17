/**
 * 컬러 팔레트 정의
 * 피그마 파운데이션에서 추출한 컬러 시스템
 */

// Gray 색상 팔레트
export const gray = {
  w: '#ffffff',      // white
  50: '#f2f2f2',     // 매우 밝은 회색
  100: '#e4e4e4',    // 밝은 회색
  200: '#d4d3d3',    // 연한 회색
  300: '#c7c7c7',    // 중간 밝은 회색
  400: '#ababab',    // 중간 회색
  500: '#919191',    // 중간 어두운 회색
  600: '#777777',    // 어두운 회색
  700: '#5f5f5f',    // 매우 어두운 회색
  800: '#333333',    // 거의 검은색
  900: '#1c1c1c',    // 매우 어두운 회색
  B: '#000000',      // black
} as const;

// Root 색상 팔레트
export const root = {
  main: '#2974e5',   // 메인 파란색
  red: '#f66a6a',    // 빨간색
} as const;

// 전체 컬러 팔레트
export const colors = {
  gray,
  root,
} as const;

// 컬러 타입 정의
export type GrayColor = keyof typeof gray;
export type RootColor = keyof typeof root;
export type ColorKey = GrayColor | RootColor;

// 컬러 유틸리티 함수
export const getColor = (colorKey: ColorKey): string => {
  if (colorKey in gray) {
    return gray[colorKey as GrayColor];
  }
  if (colorKey in root) {
    return root[colorKey as RootColor];
  }
  return '#000000'; // 기본값
};

// CSS 변수명 생성 함수
export const getCSSVariableName = (colorKey: ColorKey): string => {
  if (colorKey in gray) {
    return `--color-gray-${colorKey}`;
  }
  if (colorKey in root) {
    return `--color-root-${colorKey}`;
  }
  return '--color-unknown';
};

// 모든 컬러의 CSS 변수명과 값 반환
export const getAllCSSVariables = (): Record<string, string> => {
  const variables: Record<string, string> = {};
  
  // Gray 색상들
  Object.entries(gray).forEach(([key, value]) => {
    variables[`--color-gray-${key}`] = value;
  });
  
  // Root 색상들
  Object.entries(root).forEach(([key, value]) => {
    variables[`--color-root-${key}`] = value;
  });
  
  return variables;
};