import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { theme } from '@theme/index';
import { AppCard } from '@components/AppCard';
import { SearchBar } from '@components/SearchBar';
import { ScreenContainer } from '@components/ScreenContainer';
import { SectionHeader } from '@components/SectionHeader';
import { BasketSummarySection } from './components/BasketSummarySection';
import { ConsumptionSummaryChart } from './components/ConsumptionSummaryChart';
import { TopChangersSection } from './components/TopChangersSection';
import { useBasketStore } from '../../state/basketStore';
import { useLocationStore } from '../../state/locationStore';
import { fetchHomePriceSummary } from '../../services/priceRepository';
import { logHomePerceivedIndexImpression } from '../../utils/analytics';
import type { RootStackParamList } from '@app/navigation';
import { t, tWithVars } from '../../i18n';

type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'Tabs'>;

// 한국어 주석: 현재는 목업 데이터만 보여주는 Home 화면 껍데기입니다.

export function HomeScreen(): JSX.Element {
  const navigation = useNavigation<NavigationProps>();
  const { items } = useBasketStore();
  const { region, status, resolve } = useLocationStore();

  useEffect(() => {
    resolve();
  }, [resolve]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['homeSummary', region?.code],
    queryFn: () => fetchHomePriceSummary(region?.code),
    enabled: status === 'success' || status === 'permission-denied'
  });

  if (status === 'loading' || isLoading) {
    return (
      <ScreenContainer contentContainerStyle={styles.centered}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
      </ScreenContainer>
    );
  }

  if (isError || !data) {
    return (
      <ScreenContainer contentContainerStyle={styles.centered}>
        <Text style={styles.errorText}>{t('common.errorGeneric')}</Text>
      </ScreenContainer>
    );
  }

  const { perceivedIndex } = data;

  logHomePerceivedIndexImpression(perceivedIndex.region.code);

  return (
    <ScreenContainer>
      <Text style={styles.locationLabel}>{perceivedIndex.region.name}</Text>
      <Text style={styles.title}>{t('home.title')}</Text>

      <View style={styles.searchRow}>
        <SearchBar
          placeholder={t('home.searchPlaceholder')}
          onFocus={(): void => navigation.navigate('Search')}
        />
      </View>

      <AppCard style={styles.moduleCard}>
        <Text style={styles.moduleTitle}>{t('home.basketTodayTitle')}</Text>
        <Text style={styles.moduleBody}>
          {tWithVars('home.basketTodayBody', {
            extraCost: perceivedIndex.perceivedExtraCost.toLocaleString()
          })}
        </Text>
      </AppCard>

      <SectionHeader title={t('home.basketSummary')} />
      <BasketSummarySection
        items={items}
        onPress={(): void => navigation.navigate('Basket' as never)}
      />

      <SectionHeader title={t('home.consumptionPattern')} />
      <ConsumptionSummaryChart
        data={[
          { label: t('consumption.food'), ratio: 0.4 },
          { label: t('consumption.cafe'), ratio: 0.2 },
          { label: t('consumption.delivery'), ratio: 0.15 },
          { label: t('consumption.other'), ratio: 0.25 }
        ]}
      />

      <SectionHeader title={t('home.topPriceChanges')} />
      <TopChangersSection
        items={[
          { name: t('item.eggs'), changePercent: 8.2 },
          { name: t('item.rice10kg'), changePercent: 6.1 },
          { name: t('item.milk1l'), changePercent: 4.5 }
        ]}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  centered: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  locationLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary
  },
  title: {
    ...theme.typography.heading1,
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.sm
  },
  searchRow: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.md
  },
  moduleCard: {
    marginTop: theme.spacing.sm
  },
  moduleTitle: {
    ...theme.typography.subtitle,
    color: theme.colors.textPrimary
  },
  moduleBody: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm
  },
  errorText: {
    ...theme.typography.body,
    color: theme.colors.accentNegative
  }
});


