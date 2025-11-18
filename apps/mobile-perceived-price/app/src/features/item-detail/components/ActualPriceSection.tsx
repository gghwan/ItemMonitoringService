import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppCard } from '@components/AppCard';
import { theme } from '@theme/index';
import type { Region } from '../../../types';
import { t, tWithVars } from '../../../i18n';

type Props = {
  region: Region;
  actualPrice: number;
};

// 한국어 주석: 지역 실제 가격과 비교 텍스트를 렌더링하는 섹션입니다.

export function ActualPriceSection(props: Props): JSX.Element {
  const { region, actualPrice } = props;

  return (
    <AppCard style={styles.card}>
      <Text style={styles.title}>{t('detail.regionalPriceTitle')}</Text>
      <Text style={styles.body}>
        {tWithVars('detail.regionalPriceBody', {
          region: region.name,
          price: actualPrice.toLocaleString()
        })}
      </Text>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: theme.spacing.md
  },
  title: {
    ...theme.typography.subtitle,
    color: theme.colors.textPrimary
  },
  body: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm
  }
});


