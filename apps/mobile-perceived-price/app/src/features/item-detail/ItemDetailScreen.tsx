import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useEffect } from 'react';
import { theme } from '@theme/index';
import type { RootStackParamList } from '@app/navigation';
import { logItemDetailView, logBasketAddItem } from '../../utils/analytics';
import { ActualPriceSection } from './components/ActualPriceSection';
import { PerceivedBaselineSection } from './components/PerceivedBaselineSection';
import { InterpretationCard } from './components/InterpretationCard';
import { useItemDetailStore } from '../../state/itemDetailStore';
import { useLocationStore } from '../../state/locationStore';
import { useBasketStore } from '../../state/basketStore';
import { t } from '../../i18n';
import { ScreenContainer } from '@components/ScreenContainer';

// 한국어 주석: Result Page 구조를 반영한 품목 상세 화면의 껍데기입니다.

type RouteProps = RouteProp<RootStackParamList, 'ItemDetail'>;

export function ItemDetailScreen(): JSX.Element {
  const route = useRoute<RouteProps>();
  const { itemCode } = route.params;

  const { detail, isLoading, errorMessage, loadItemDetail } = useItemDetailStore();
  const { addItem } = useBasketStore();
  const { region: userRegion } = useLocationStore();

  useEffect(() => {
    loadItemDetail(itemCode, userRegion?.code)
      .then(() => {
        logItemDetailView(itemCode);
      })
      .catch(() => {
        // 에러는 store에서 처리
      });
  }, [itemCode, loadItemDetail]);

  if (isLoading || !detail) {
    return (
      <ScreenContainer contentContainerStyle={styles.centered}>
        <Text style={styles.loadingText}>{t('common.loading')}</Text>
      </ScreenContainer>
    );
  }

  if (errorMessage) {
    return (
      <ScreenContainer contentContainerStyle={styles.centered}>
        <Text style={styles.errorText}>{errorMessage ?? t('common.errorGeneric')}</Text>
      </ScreenContainer>
    );
  }

  const { region, baseline, actualPrice, interpretation } = detail;

  return (
    <ScreenContainer contentContainerStyle={styles.content}>
      <Text style={styles.itemTitle}>{itemCode}</Text>

      <ActualPriceSection region={region} actualPrice={actualPrice} />
      <PerceivedBaselineSection baseline={baseline} actualPrice={actualPrice} />
      <InterpretationCard itemCode={itemCode} interpretation={interpretation} />
      {/* 한국어 주석: 장바구니 추가 CTA - 현재는 단순 버튼, 이후 Figma 스타일 버튼 컴포넌트로 교체 */}
      <Text
        style={styles.addToBasket}
        onPress={(): void => {
          addItem(
            { code: baseline.itemCode, name: itemCode, category: 'other', unitLabel: '' },
            region
          );
          logBasketAddItem(itemCode);
        }}
      >
        {t('detail.addToBasket')}
      </Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  content: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg
  },
  itemTitle: {
    ...theme.typography.heading1,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.lg
  },
  centered: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  loadingText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary
  },
  errorText: {
    ...theme.typography.body,
    color: theme.colors.accentNegative
  },
  addToBasket: {
    ...theme.typography.subtitle,
    color: theme.colors.primary,
    marginTop: theme.spacing.lg
  }
});


