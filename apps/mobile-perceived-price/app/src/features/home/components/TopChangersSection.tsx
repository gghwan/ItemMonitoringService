import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppCard } from '@components/AppCard';
import { theme } from '@theme/index';
import { t } from '../../../i18n';

type TopChanger = {
  name: string;
  changePercent: number;
};

type Props = {
  items: TopChanger[];
};

// 한국어 주석: 가격 변동이 큰 품목 TOP 리스트를 보여주는 섹션입니다. 현재는 목업 데이터만 사용합니다.

export function TopChangersSection(props: Props): JSX.Element {
  const { items } = props;

  return (
    <AppCard style={styles.card}>
      {items.length === 0 ? (
        <Text style={styles.empty}>{t('home.noTopChanges')}</Text>
      ) : (
        items.map((item) => (
          <View key={item.name} style={styles.row}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.change}>
              {item.changePercent > 0 ? '+' : ''}
              {item.changePercent.toFixed(1)}%
            </Text>
          </View>
        ))
      )}
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: theme.spacing.sm
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 4
  },
  name: {
    ...theme.typography.body,
    color: theme.colors.textPrimary
  },
  change: {
    ...theme.typography.body,
    color: theme.colors.accentNegative
  },
  empty: {
    ...theme.typography.body,
    color: theme.colors.textSecondary
  }
});


