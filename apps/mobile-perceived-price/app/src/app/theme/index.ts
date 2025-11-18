import { appColors, AppColors } from './colors';
import { appSpacing, AppSpacing } from './spacing';
import { appTypography, AppTypography } from './typography';

// 한국어 주석: 앱 전반에서 공통으로 사용할 테마 객체입니다.

export type AppTheme = {
  colors: AppColors;
  spacing: AppSpacing;
  typography: AppTypography;
};

export const theme: AppTheme = {
  colors: appColors,
  spacing: appSpacing,
  typography: appTypography
};


