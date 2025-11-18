import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '@theme/index';
import { t } from '../../../i18n';

// 한국어 주석: 사용자의 카테고리별 소비 비중을 간단한 막대 그래프로 표현하는 목업 컴포넌트입니다.
// 추후 실제 UserConsumptionProfile 데이터를 연결합니다.

type CategoryShare = {
  label: string;
  ratio: number; // 0~1
};

type Props = {
  data: CategoryShare[];
};

export function ConsumptionSummaryChart(props: Props): JSX.Element {
  const { data } = props;

  if (data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{t('home.noSpendingData')}</Text>
      </View>
    );
  }

  return (
    <View>
      {data.map((entry) => (
        <View key={entry.label} style={styles.row}>
          <Text style={styles.label}>{entry.label}</Text>
          <View style={styles.barBackground}>
            <View style={[styles.barFill, { width: `${entry.ratio * 100}%` }]} />
          </View>
          <Text style={styles.percent}>{Math.round(entry.ratio * 100)}%</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4
  },
  label: {
    ...theme.typography.caption,
    color: theme.colors.textPrimary,
    width: 80
  },
  barBackground: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.surface
  },
  barFill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.primary
  },
  percent: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    width: 40,
    textAlign: 'right'
  },
  emptyContainer: {
    paddingVertical: theme.spacing.sm
  },
  emptyText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary
  }
});


