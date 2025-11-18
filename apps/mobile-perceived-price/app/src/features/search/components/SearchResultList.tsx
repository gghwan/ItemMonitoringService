import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import type { Item } from '../../../types';
import { theme } from '@theme/index';

type Props = {
  items: Item[];
  onPressItem: (itemCode: string) => void;
};

// 한국어 주석: 검색 결과 리스트 컴포넌트입니다. US1의 재사용 가능한 리스트 역할을 합니다.

export function SearchResultList(props: Props): JSX.Element {
  const { items, onPressItem } = props;

  return (
    <FlatList
      data={items}
      keyExtractor={(item): string => item.code}
      renderItem={({ item }) => (
        <Pressable style={styles.row} onPress={(): void => onPressItem(item.code)}>
          <View>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemMeta}>{item.unitLabel}</Text>
          </View>
        </Pressable>
      )}
      ItemSeparatorComponent={Separator}
      keyboardShouldPersistTaps="handled"
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
  }
});


