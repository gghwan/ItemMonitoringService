import { ko } from './locales/ko';
import { en } from './locales/en';

// 한국어 주석: 아주 가벼운 i18n 헬퍼입니다.
// - React Context 없이 함수 기반으로만 동작
// - 의존성 최소화
// - t('home.title') / tWithVars('home.body', { amount: 1000 }) 형태로 사용

export type SupportedLocale = 'ko' | 'en';

const locales = {
  ko,
  en
} as const;

let currentLocale: SupportedLocale = 'ko';

export function setLocale(locale: SupportedLocale): void {
  currentLocale = locale;
}

export function getLocale(): SupportedLocale {
  return currentLocale;
}

export function t(path: string): string {
  const segments = path.split('.');
  let node: any = locales[currentLocale];

  for (const segment of segments) {
    if (node == null) {
      return path;
    }
    node = node[segment];
  }

  if (typeof node === 'string') {
    return node;
  }

  return path;
}

export function tWithVars(path: string, vars: Record<string, string | number>): string {
  const template = t(path);

  return template.replace(/\{(\w+)\}/g, (_match, key: string) => {
    const value = vars[key];
    return value != null ? String(value) : '';
  });
}


