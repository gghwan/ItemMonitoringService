import React, { useRef } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, StyleSheet, Text, View } from 'react-native';
import { AppCard } from '@components/AppCard';
import { theme } from '@theme/index';
import type { InterpretationCard as Interpretation } from '../../../types';
import { logInterpretationScrollDepth } from '../../../utils/analytics';
import { t } from '../../../i18n';

type Props = {
  itemCode: string;
  interpretation: Interpretation;
};

// 한국어 주석: AI 해석 카드 섹션입니다. 스크롤 깊이를 로깅하여 KPI를 측정합니다.

export function InterpretationCard(props: Props): JSX.Element {
  const { itemCode, interpretation } = props;
  const maxOffsetRef = useRef<number>(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>): void => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const maxScrollable = contentSize.height - layoutMeasurement.height;

    if (maxScrollable <= 0) {
      return;
    }

    const ratio = Math.min(contentOffset.y / maxScrollable, 1);
    if (ratio > maxOffsetRef.current) {
      maxOffsetRef.current = ratio;
      logInterpretationScrollDepth(itemCode, ratio);
    }
  };

  return (
    <AppCard style={styles.card}>
      <Text style={styles.title}>{t('detail.whyExpensiveTitle')}</Text>
      <View style={styles.bodyContainer}>
        <Text style={styles.body} onScroll={handleScroll}>
          {interpretation.body}
        </Text>
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: theme.spacing.md
  },
  title: {
    ...theme.typography.subtitle,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm
  },
  bodyContainer: {
    maxHeight: 200
  },
  body: {
    ...theme.typography.body,
    color: theme.colors.textSecondary
  }
});


