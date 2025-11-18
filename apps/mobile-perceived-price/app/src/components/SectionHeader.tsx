import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { theme } from '@theme/index';

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  style?: ViewStyle;
};

// 한국어 주석: 섹션 타이틀/설명을 공통으로 렌더링하는 헤더 컴포넌트입니다.
// Figma에서 섹션마다 반복되는 타이틀/설명 패턴을 그대로 재사용할 수 있도록 설계합니다.

export function SectionHeader(props: SectionHeaderProps): JSX.Element {
  const { title, subtitle, style } = props;

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm
  },
  title: {
    ...theme.typography.heading2,
    color: theme.colors.textPrimary
  },
  subtitle: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: 2
  }
});


