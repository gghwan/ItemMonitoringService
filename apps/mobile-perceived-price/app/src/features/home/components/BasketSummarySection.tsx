import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppCard } from '@components/AppCard';
import { theme } from '@theme/index';
import type { BasketItem } from '../../../types';
import { t, tWithVars } from '../../../i18n';

type Props = {
  items: BasketItem[];
  onPress: () => void;
};

// 한국어 주석: 홈 화면에서 장바구니 요약을 보여주는 섹션입니다.

export function BasketSummarySection(props: Props): JSX.Element {
  const { items, onPress } = props;
  const count = items.length;

  return (
    <AppCard style={styles.card}>
      <Text style={styles.title}>{t('home.basketSummary')}</Text>
      <Text style={styles.body}>
        {count === 0
          ? t('home.basketEmpty')
          : tWithVars('basket.countLabel', { count })}
      </Text>
      <Text style={styles.link} onPress={onPress}>
        {t('home.basketViewLink')}
      </Text>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: theme.spacing.sm
  },
  title: {
    ...theme.typography.subtitle,
    color: theme.colors.textPrimary
  },
  body: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm
  },
  link: {
    ...theme.typography.caption,
    color: theme.colors.primary,
    marginTop: theme.spacing.sm
  }
});


