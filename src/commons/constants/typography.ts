/**
 * Typography Design Tokens
 * 피그마 파운데이션에서 추출한 typography 토큰들
 */

// Font Family Tokens
export const fontFamilies = {
  // 한국어 폰트
  korean: {
    primary: 'Pretendard Variable, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif',
    variable: 'Pretendard Variable, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif',
  },
  // 영문 폰트 (추후 확장 가능)
  english: {
    primary: 'Pretendard Variable, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", sans-serif',
    variable: 'Pretendard Variable, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", sans-serif',
  },
} as const;

// Font Weight Tokens
export const fontWeights = {
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

// Font Size Tokens (모바일/데스크톱 분기 지원)
export const fontSizes = {
  mobile: {
    xs: '11px',
    sm: '12px',
    base: '13px',
    md: '14px',
    lg: '16px',
    xl: '18px',
    '2xl': '20px',
    '3xl': '24px',
    '4xl': '28px',
  },
  desktop: {
    xs: '11px',
    sm: '12px',
    base: '13px',
    md: '14px',
    lg: '16px',
    xl: '18px',
    '2xl': '20px',
    '3xl': '24px',
    '4xl': '28px',
  },
} as const;

// Line Height Tokens (모바일/데스크톱 분기 지원)
export const lineHeights = {
  mobile: {
    xs: '20px',
    sm: '20px',
    base: '20px',
    md: '20px',
    lg: '24px',
    xl: '24px',
    '2xl': '24px',
    '3xl': '28px',
    '4xl': '32px',
  },
  desktop: {
    xs: '20px',
    sm: '20px',
    base: '20px',
    md: '20px',
    lg: '24px',
    xl: '24px',
    '2xl': '24px',
    '3xl': '28px',
    '4xl': '32px',
  },
} as const;

// Letter Spacing Tokens
export const letterSpacings = {
  tight: '-0.025em',
  normal: '0em',
  wide: '0.025em',
} as const;

// Paragraph Spacing Tokens
export const paragraphSpacings = {
  none: '0px',
  sm: '8px',
  md: '16px',
  lg: '24px',
} as const;

// Paragraph Indent Tokens
export const paragraphIndents = {
  none: '0px',
  sm: '16px',
  md: '24px',
  lg: '32px',
} as const;

// Typography Scale (사전 정의된 조합)
export const typography = {
  // Display Styles
  display: {
    large: {
      fontFamily: fontFamilies.korean.primary,
      fontSize: fontSizes.desktop['4xl'],
      fontWeight: fontWeights.bold,
      lineHeight: lineHeights.desktop['4xl'],
      letterSpacing: letterSpacings.normal,
    },
    medium: {
      fontFamily: fontFamilies.korean.primary,
      fontSize: fontSizes.desktop['3xl'],
      fontWeight: fontWeights.bold,
      lineHeight: lineHeights.desktop['3xl'],
      letterSpacing: letterSpacings.normal,
    },
    small: {
      fontFamily: fontFamilies.korean.primary,
      fontSize: fontSizes.desktop['2xl'],
      fontWeight: fontWeights.semibold,
      lineHeight: lineHeights.desktop['2xl'],
      letterSpacing: letterSpacings.normal,
    },
  },
  // Heading Styles
  heading: {
    h1: {
      fontFamily: fontFamilies.korean.primary,
      fontSize: fontSizes.desktop['3xl'],
      fontWeight: fontWeights.bold,
      lineHeight: lineHeights.desktop['3xl'],
      letterSpacing: letterSpacings.normal,
    },
    h2: {
      fontFamily: fontFamilies.korean.primary,
      fontSize: fontSizes.desktop['2xl'],
      fontWeight: fontWeights.semibold,
      lineHeight: lineHeights.desktop['2xl'],
      letterSpacing: letterSpacings.normal,
    },
    h3: {
      fontFamily: fontFamilies.korean.primary,
      fontSize: fontSizes.desktop.xl,
      fontWeight: fontWeights.semibold,
      lineHeight: lineHeights.desktop.xl,
      letterSpacing: letterSpacings.normal,
    },
    h4: {
      fontFamily: fontFamilies.korean.primary,
      fontSize: fontSizes.desktop.lg,
      fontWeight: fontWeights.medium,
      lineHeight: lineHeights.desktop.lg,
      letterSpacing: letterSpacings.normal,
    },
    h5: {
      fontFamily: fontFamilies.korean.primary,
      fontSize: fontSizes.desktop.md,
      fontWeight: fontWeights.medium,
      lineHeight: lineHeights.desktop.md,
      letterSpacing: letterSpacings.normal,
    },
    h6: {
      fontFamily: fontFamilies.korean.primary,
      fontSize: fontSizes.desktop.sm,
      fontWeight: fontWeights.medium,
      lineHeight: lineHeights.desktop.sm,
      letterSpacing: letterSpacings.normal,
    },
  },
  // Body Text Styles
  body: {
    large: {
      fontFamily: fontFamilies.korean.primary,
      fontSize: fontSizes.desktop.lg,
      fontWeight: fontWeights.regular,
      lineHeight: lineHeights.desktop.lg,
      letterSpacing: letterSpacings.normal,
    },
    medium: {
      fontFamily: fontFamilies.korean.primary,
      fontSize: fontSizes.desktop.md,
      fontWeight: fontWeights.regular,
      lineHeight: lineHeights.desktop.md,
      letterSpacing: letterSpacings.normal,
    },
    small: {
      fontFamily: fontFamilies.korean.primary,
      fontSize: fontSizes.desktop.sm,
      fontWeight: fontWeights.regular,
      lineHeight: lineHeights.desktop.sm,
      letterSpacing: letterSpacings.normal,
    },
  },
  // Label Styles
  label: {
    large: {
      fontFamily: fontFamilies.korean.primary,
      fontSize: fontSizes.desktop.md,
      fontWeight: fontWeights.medium,
      lineHeight: lineHeights.desktop.md,
      letterSpacing: letterSpacings.normal,
    },
    medium: {
      fontFamily: fontFamilies.korean.primary,
      fontSize: fontSizes.desktop.sm,
      fontWeight: fontWeights.medium,
      lineHeight: lineHeights.desktop.sm,
      letterSpacing: letterSpacings.normal,
    },
    small: {
      fontFamily: fontFamilies.korean.primary,
      fontSize: fontSizes.desktop.xs,
      fontWeight: fontWeights.medium,
      lineHeight: lineHeights.desktop.xs,
      letterSpacing: letterSpacings.normal,
    },
  },
  // Caption Styles
  caption: {
    large: {
      fontFamily: fontFamilies.korean.primary,
      fontSize: fontSizes.desktop.sm,
      fontWeight: fontWeights.regular,
      lineHeight: lineHeights.desktop.sm,
      letterSpacing: letterSpacings.normal,
    },
    medium: {
      fontFamily: fontFamilies.korean.primary,
      fontSize: fontSizes.desktop.xs,
      fontWeight: fontWeights.regular,
      lineHeight: lineHeights.desktop.xs,
      letterSpacing: letterSpacings.normal,
    },
  },
} as const;

// Mobile Typography Scale (모바일용 조정된 스타일)
export const mobileTypography = {
  // Display Styles
  display: {
    large: {
      fontFamily: fontFamilies.korean.primary,
      fontSize: fontSizes.mobile['3xl'],
      fontWeight: fontWeights.bold,
      lineHeight: lineHeights.mobile['3xl'],
      letterSpacing: letterSpacings.normal,
    },
    medium: {
      fontFamily: fontFamilies.korean.primary,
      fontSize: fontSizes.mobile['2xl'],
      fontWeight: fontWeights.bold,
      lineHeight: lineHeights.mobile['2xl'],
      letterSpacing: letterSpacings.normal,
    },
    small: {
      fontFamily: fontFamilies.korean.primary,
      fontSize: fontSizes.mobile.xl,
      fontWeight: fontWeights.semibold,
      lineHeight: lineHeights.mobile.xl,
      letterSpacing: letterSpacings.normal,
    },
  },
  // Heading Styles
  heading: {
    h1: {
      fontFamily: fontFamilies.korean.primary,
      fontSize: fontSizes.mobile['2xl'],
      fontWeight: fontWeights.bold,
      lineHeight: lineHeights.mobile['2xl'],
      letterSpacing: letterSpacings.normal,
    },
    h2: {
      fontFamily: fontFamilies.korean.primary,
      fontSize: fontSizes.mobile.xl,
      fontWeight: fontWeights.semibold,
      lineHeight: lineHeights.mobile.xl,
      letterSpacing: letterSpacings.normal,
    },
    h3: {
      fontFamily: fontFamilies.korean.primary,
      fontSize: fontSizes.mobile.lg,
      fontWeight: fontWeights.semibold,
      lineHeight: lineHeights.mobile.lg,
      letterSpacing: letterSpacings.normal,
    },
    h4: {
      fontFamily: fontFamilies.korean.primary,
      fontSize: fontSizes.mobile.md,
      fontWeight: fontWeights.medium,
      lineHeight: lineHeights.mobile.md,
      letterSpacing: letterSpacings.normal,
    },
    h5: {
      fontFamily: fontFamilies.korean.primary,
      fontSize: fontSizes.mobile.sm,
      fontWeight: fontWeights.medium,
      lineHeight: lineHeights.mobile.sm,
      letterSpacing: letterSpacings.normal,
    },
    h6: {
      fontFamily: fontFamilies.korean.primary,
      fontSize: fontSizes.mobile.xs,
      fontWeight: fontWeights.medium,
      lineHeight: lineHeights.mobile.xs,
      letterSpacing: letterSpacings.normal,
    },
  },
  // Body Text Styles
  body: {
    large: {
      fontFamily: fontFamilies.korean.primary,
      fontSize: fontSizes.mobile.md,
      fontWeight: fontWeights.regular,
      lineHeight: lineHeights.mobile.md,
      letterSpacing: letterSpacings.normal,
    },
    medium: {
      fontFamily: fontFamilies.korean.primary,
      fontSize: fontSizes.mobile.sm,
      fontWeight: fontWeights.regular,
      lineHeight: lineHeights.mobile.sm,
      letterSpacing: letterSpacings.normal,
    },
    small: {
      fontFamily: fontFamilies.korean.primary,
      fontSize: fontSizes.mobile.xs,
      fontWeight: fontWeights.regular,
      lineHeight: lineHeights.mobile.xs,
      letterSpacing: letterSpacings.normal,
    },
  },
  // Label Styles
  label: {
    large: {
      fontFamily: fontFamilies.korean.primary,
      fontSize: fontSizes.mobile.sm,
      fontWeight: fontWeights.medium,
      lineHeight: lineHeights.mobile.sm,
      letterSpacing: letterSpacings.normal,
    },
    medium: {
      fontFamily: fontFamilies.korean.primary,
      fontSize: fontSizes.mobile.xs,
      fontWeight: fontWeights.medium,
      lineHeight: lineHeights.mobile.xs,
      letterSpacing: letterSpacings.normal,
    },
    small: {
      fontFamily: fontFamilies.korean.primary,
      fontSize: fontSizes.mobile.xs,
      fontWeight: fontWeights.medium,
      lineHeight: lineHeights.mobile.xs,
      letterSpacing: letterSpacings.normal,
    },
  },
  // Caption Styles
  caption: {
    large: {
      fontFamily: fontFamilies.korean.primary,
      fontSize: fontSizes.mobile.xs,
      fontWeight: fontWeights.regular,
      lineHeight: lineHeights.mobile.xs,
      letterSpacing: letterSpacings.normal,
    },
    medium: {
      fontFamily: fontFamilies.korean.primary,
      fontSize: fontSizes.mobile.xs,
      fontWeight: fontWeights.regular,
      lineHeight: lineHeights.mobile.xs,
      letterSpacing: letterSpacings.normal,
    },
  },
} as const;

// English Typography Scale (영문용 스타일)
export const englishTypography = {
  // Display Styles
  display: {
    large: {
      fontFamily: fontFamilies.english.primary,
      fontSize: fontSizes.desktop['4xl'],
      fontWeight: fontWeights.bold,
      lineHeight: lineHeights.desktop['4xl'],
      letterSpacing: letterSpacings.tight,
    },
    medium: {
      fontFamily: fontFamilies.english.primary,
      fontSize: fontSizes.desktop['3xl'],
      fontWeight: fontWeights.bold,
      lineHeight: lineHeights.desktop['3xl'],
      letterSpacing: letterSpacings.tight,
    },
    small: {
      fontFamily: fontFamilies.english.primary,
      fontSize: fontSizes.desktop['2xl'],
      fontWeight: fontWeights.semibold,
      lineHeight: lineHeights.desktop['2xl'],
      letterSpacing: letterSpacings.tight,
    },
  },
  // Heading Styles
  heading: {
    h1: {
      fontFamily: fontFamilies.english.primary,
      fontSize: fontSizes.desktop['3xl'],
      fontWeight: fontWeights.bold,
      lineHeight: lineHeights.desktop['3xl'],
      letterSpacing: letterSpacings.tight,
    },
    h2: {
      fontFamily: fontFamilies.english.primary,
      fontSize: fontSizes.desktop['2xl'],
      fontWeight: fontWeights.semibold,
      lineHeight: lineHeights.desktop['2xl'],
      letterSpacing: letterSpacings.tight,
    },
    h3: {
      fontFamily: fontFamilies.english.primary,
      fontSize: fontSizes.desktop.xl,
      fontWeight: fontWeights.semibold,
      lineHeight: lineHeights.desktop.xl,
      letterSpacing: letterSpacings.tight,
    },
    h4: {
      fontFamily: fontFamilies.english.primary,
      fontSize: fontSizes.desktop.lg,
      fontWeight: fontWeights.medium,
      lineHeight: lineHeights.desktop.lg,
      letterSpacing: letterSpacings.normal,
    },
    h5: {
      fontFamily: fontFamilies.english.primary,
      fontSize: fontSizes.desktop.md,
      fontWeight: fontWeights.medium,
      lineHeight: lineHeights.desktop.md,
      letterSpacing: letterSpacings.normal,
    },
    h6: {
      fontFamily: fontFamilies.english.primary,
      fontSize: fontSizes.desktop.sm,
      fontWeight: fontWeights.medium,
      lineHeight: lineHeights.desktop.sm,
      letterSpacing: letterSpacings.normal,
    },
  },
  // Body Text Styles
  body: {
    large: {
      fontFamily: fontFamilies.english.primary,
      fontSize: fontSizes.desktop.lg,
      fontWeight: fontWeights.regular,
      lineHeight: lineHeights.desktop.lg,
      letterSpacing: letterSpacings.normal,
    },
    medium: {
      fontFamily: fontFamilies.english.primary,
      fontSize: fontSizes.desktop.md,
      fontWeight: fontWeights.regular,
      lineHeight: lineHeights.desktop.md,
      letterSpacing: letterSpacings.normal,
    },
    small: {
      fontFamily: fontFamilies.english.primary,
      fontSize: fontSizes.desktop.sm,
      fontWeight: fontWeights.regular,
      lineHeight: lineHeights.desktop.sm,
      letterSpacing: letterSpacings.normal,
    },
  },
  // Label Styles
  label: {
    large: {
      fontFamily: fontFamilies.english.primary,
      fontSize: fontSizes.desktop.md,
      fontWeight: fontWeights.medium,
      lineHeight: lineHeights.desktop.md,
      letterSpacing: letterSpacings.normal,
    },
    medium: {
      fontFamily: fontFamilies.english.primary,
      fontSize: fontSizes.desktop.sm,
      fontWeight: fontWeights.medium,
      lineHeight: lineHeights.desktop.sm,
      letterSpacing: letterSpacings.normal,
    },
    small: {
      fontFamily: fontFamilies.english.primary,
      fontSize: fontSizes.desktop.xs,
      fontWeight: fontWeights.medium,
      lineHeight: lineHeights.desktop.xs,
      letterSpacing: letterSpacings.normal,
    },
  },
  // Caption Styles
  caption: {
    large: {
      fontFamily: fontFamilies.english.primary,
      fontSize: fontSizes.desktop.sm,
      fontWeight: fontWeights.regular,
      lineHeight: lineHeights.desktop.sm,
      letterSpacing: letterSpacings.normal,
    },
    medium: {
      fontFamily: fontFamilies.english.primary,
      fontSize: fontSizes.desktop.xs,
      fontWeight: fontWeights.regular,
      lineHeight: lineHeights.desktop.xs,
      letterSpacing: letterSpacings.normal,
    },
  },
} as const;

// Utility Functions
export const getTypography = (language: 'korean' | 'english' = 'korean', device: 'mobile' | 'desktop' = 'desktop') => {
  if (language === 'english') {
    return englishTypography;
  }
  return device === 'mobile' ? mobileTypography : typography;
};

export const getFontFamily = (language: 'korean' | 'english' = 'korean', variant: 'primary' | 'variable' = 'primary') => {
  return fontFamilies[language][variant];
};

export const getFontSize = (device: 'mobile' | 'desktop' = 'desktop', size: keyof typeof fontSizes.mobile) => {
  return fontSizes[device][size];
};

export const getLineHeight = (device: 'mobile' | 'desktop' = 'desktop', size: keyof typeof lineHeights.mobile) => {
  return lineHeights[device][size];
};

// Type Definitions
export type FontFamily = typeof fontFamilies;
export type FontWeight = typeof fontWeights;
export type FontSize = typeof fontSizes;
export type LineHeight = typeof lineHeights;
export type LetterSpacing = typeof letterSpacings;
export type ParagraphSpacing = typeof paragraphSpacings;
export type ParagraphIndent = typeof paragraphIndents;
export type Typography = typeof typography;
export type MobileTypography = typeof mobileTypography;
export type EnglishTypography = typeof englishTypography;
