export type AppSpacing = {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
};

export const appSpacing: AppSpacing = {
  // 한국어 주석:
  // Figma 모바일 기준(375px)에서 자주 쓰는 여백 단위를 스케일로 정의합니다.
  // 컴포넌트/섹션 간 간격을 모두 이 스케일에 스냅시켜 일관성을 유지합니다.
  xs: 4,   // 아주 작은 간격 (아이콘 사이, 태그 내부 패딩 등)
  sm: 8,   // 작은 간격 (텍스트와 서브텍스트 사이 등)
  md: 16,  // 기본 간격 (카드 내부 패딩, 섹션 내부 여백)
  lg: 24,  // 섹션 간 간격, 상단 여백 등
  xl: 32   // 화면 최상단/최하단 여백, 큰 블록 간 간격
};


