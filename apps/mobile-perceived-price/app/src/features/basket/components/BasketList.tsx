import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import type { BasketItem } from '../../../types';
import { theme } from '@theme/index';
import { t } from '../../../i18n';

type Props = {
  items: BasketItem[];
  onPressItem: (itemCode: string) => void;
};

// 한국어 주석: 장바구니 목록 UI 컴포넌트입니다.

export function BasketList(props: Props): JSX.Element {
  const { items, onPressItem } = props;

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{t('basket.empty')}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(item): string => item.id}
      renderItem={({ item }) => (
        <Pressable
          style={styles.row}
          onPress={(): void => onPressItem(item.item.code)}
        >
          <View>
            <Text style={styles.itemName}>{item.item.name}</Text>
            <Text style={styles.itemMeta}>{item.region.name}</Text>
          </View>
        </Pressable>
      )}
      ItemSeparatorComponent={Separator}
    />
  );
}

function Separator(): JSX.Element {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  row: {
    paddingVertical: theme.spacing.md
  },
  itemName: {
    ...theme.typography.subtitle,
    color: theme.colors.textPrimary
  },
  itemMeta: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: 2
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.colors.borderSoft
  },
  emptyContainer: {
    paddingVertical: theme.spacing.lg,
    alignItems: 'center'
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary
  }
});


