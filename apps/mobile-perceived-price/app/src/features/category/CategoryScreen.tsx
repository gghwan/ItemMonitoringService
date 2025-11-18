import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { theme } from '@theme/index';
import { t } from '../../i18n';
import { ScreenContainer } from '@components/ScreenContainer';

// 한국어 주석: 추후 카테고리 리스트/필터가 들어갈 자리입니다.

export function CategoryScreen(): JSX.Element {
  return (
    <ScreenContainer>
      <Text style={styles.title}>{t('category.title')}</Text>
      <Text style={styles.body}>{t('category.body')}</Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    ...theme.typography.heading1,
    color: theme.colors.textPrimary
  },
  body: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md
  }
});


