export type AppColors = {
  primary: string;
  primarySoft: string;
  primaryStrong: string;
  background: string;
  surface: string;
  surfaceElevated: string;
  textPrimary: string;
  textSecondary: string;
  borderSoft: string;
  accentPositive: string;
  accentNegative: string;
  badgeBackground: string;
  badgeText: string;
  divider: string;
  warning: string;
  info: string;
};

export const appColors: AppColors = {
  // 한국어 주석:
  // 생활물가_디자인시스템 Figma를 참고해 구성한 팔레트입니다.
  // - primary 계열: 핵심 액션(검색, CTA, 주요 지표 하이라이트)
  // - background / surface: 앱 전체 배경, 카드/섹션 배경
  // - text 계열: 본문/보조 텍스트
  // - accent*: 체감 인덱스의 상승/하락(+) 시각화
  primary: '#2B5CF6',
  primarySoft: '#E5ECFF',
  primaryStrong: '#1E3CC8',
  background: '#F5F7FA',
  surface: '#F9FAFB',
  surfaceElevated: '#FFFFFF',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  borderSoft: '#E5E7EB',
  accentPositive: '#16A34A',
  accentNegative: '#DC2626',
  // 뱃지/라벨, 구분선, 경고/안내 색상
  badgeBackground: '#EEF2FF',
  badgeText: '#4F46E5',
  divider: '#E5E7EB',
  warning: '#F97316',
  info: '#0EA5E9'
};


