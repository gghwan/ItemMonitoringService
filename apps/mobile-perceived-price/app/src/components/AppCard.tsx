import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '@theme/index';

type AppCardProps = {
  children: React.ReactNode;
  style?: ViewStyle;
};

// 한국어 주석: 공통 카드 컴포넌트, 생활물가 Figma 카드 스타일의 기본 껍데기입니다.
// - radius, shadow, padding 모두 theme 기준으로 정의해서 화면마다 일관성을 유지합니다.

export function AppCard(props: AppCardProps): JSX.Element {
  const { children, style } = props;

  return <View style={[styles.container, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: 16,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.borderSoft,
    shadowColor: '#0F172A',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 24,
    elevation: 2
  }
});


