import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { AppCard } from '@components/AppCard';
import { theme } from '@theme/index';
import type { PerceivedPriceBaseline } from '../../../types';
import { t, tWithVars } from '../../../i18n';

type Props = {
  baseline: PerceivedPriceBaseline;
  actualPrice: number;
};

// 한국어 주석: 체감 기준가격 범위와 실제 가격의 차이를 보여주는 섹션입니다.

export function PerceivedBaselineSection(props: Props): JSX.Element {
  const { baseline, actualPrice } = props;

  return (
    <AppCard style={styles.card}>
      <Text style={styles.title}>{t('detail.perceivedVsActualTitle')}</Text>
      <Text style={styles.body}>
        {tWithVars('detail.perceivedVsActualBody', {
          baselineLow: baseline.lowerBound.toLocaleString(),
          baselineHigh: baseline.upperBound.toLocaleString(),
          actual: actualPrice.toLocaleString()
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


