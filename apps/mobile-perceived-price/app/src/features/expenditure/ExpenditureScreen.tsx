import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { theme } from '@theme/index';
import { t } from '../../i18n';
import { ScreenContainer } from '@components/ScreenContainer';

// 한국어 주석: 지출 관리 탭 화면의 기본 껍데기입니다.
// 추후 카드 소비 패턴 그래프, 카테고리별 비중, 알림 등을 이 화면에 배치합니다.

export function ExpenditureScreen(): JSX.Element {
  return (
    <ScreenContainer>
      <Text style={styles.title}>{t('expenditure.title')}</Text>
      <Text style={styles.body}>{t('expenditure.body')}</Text>
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


