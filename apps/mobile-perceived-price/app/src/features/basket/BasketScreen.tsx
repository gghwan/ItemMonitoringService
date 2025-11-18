import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { theme } from '@theme/index';
import type { RootStackParamList } from '@app/navigation';
import { useBasketStore } from '../../state/basketStore';
import { BasketList } from './components/BasketList';
import { logEvent } from '../../utils/analytics';
import { t } from '../../i18n';
import { ScreenContainer } from '@components/ScreenContainer';

// 한국어 주석: 장바구니 요약/리스트 화면. 저장된 품목을 ItemDetail로 네비게이션합니다.

type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'Tabs'>;

export function BasketScreen(): JSX.Element {
  const navigation = useNavigation<NavigationProps>();
  const { items, hydrate } = useBasketStore();

  useEffect(() => {
    hydrate();
    logEvent('basket_screen_view', { count: items.length });
  }, [hydrate, items.length]);

  const handlePressItem = (itemCode: string): void => {
    navigation.navigate('ItemDetail', { itemCode });
  };

  return (
    <ScreenContainer>
      <Text style={styles.title}>{t('basket.title')}</Text>
      <BasketList items={items} onPressItem={handlePressItem} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg
  },
  title: {
    ...theme.typography.heading1,
    color: theme.colors.textPrimary
  }
});


