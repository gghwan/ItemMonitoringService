// 한국어 주석: 환경별 설정을 관리하는 파일입니다.
// Expo에서는 EXPO_PUBLIC_ 접두사가 붙은 환경변수만 클라이언트 번들에 주입됩니다.

export type ApiConfig = {
  baseUrl: string;
};

export const apiConfig: ApiConfig = {
  // 개발 환경: 기본값은 로컬 백엔드 (Railway 로컬 실행)로 가정합니다.
  // 프로덕션 빌드에서는 EXPO_PUBLIC_API_BASE_URL을 Railway의 퍼블릭 URL로 설정합니다.
  baseUrl: process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:4000'
};


