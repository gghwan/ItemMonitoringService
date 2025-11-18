import React from 'react';
import { Keyboard, Pressable, View, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { theme } from '@theme/index';
import { ScreenContainer } from '@components/ScreenContainer';
import { SearchBar } from '@components/SearchBar';
import type { RootStackParamList } from '@app/navigation';
import { logSearchQuery, logSearchSelectItem } from '../../utils/analytics';
import { useSearchStore } from '../../state/searchStore';
import { SearchResultList } from './components/SearchResultList';
import { t } from '../../i18n';

// 한국어 주석: 공공데이터 품목코드를 사용하는 검색 화면의 목업 버전입니다.

type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'Search'>;

const SUGGESTIONS = [
  t('search.suggestionRice'),
  t('search.suggestionEggs'),
  t('search.suggestionMilk')
];

export function SearchScreen(): JSX.Element {
  const navigation = useNavigation<NavigationProps>();
  const { query, results, updateQuery } = useSearchStore();

  const handlePressItem = (itemCode: string): void => {
    logSearchSelectItem(itemCode);
    navigation.navigate('ItemDetail', { itemCode });
  };

  const handleSubmit = (): void => {
    const trimmed = query.trim();
    if (trimmed.length > 0) {
      logSearchQuery(trimmed);
      if (results.length > 0) {
        // 한국어 주석: 엔터를 누르면 현재 필터된 결과 중 첫 번째 품목 상세로 이동합니다.
        handlePressItem(results[0].code);
      }
      Keyboard.dismiss();
    }
  };

  return (
    <ScreenContainer>
      <SearchBar
        placeholder={t('search.placeholder')}
        value={query}
        returnKeyType="search"
        onSubmitEditing={handleSubmit}
        onChangeText={(text): void => {
          updateQuery(text);
        }}
      />

      {query.trim().length === 0 && (
        <View style={styles.suggestionsRow}>
          {SUGGESTIONS.map((label) => (
            <Pressable
              key={label}
              style={styles.suggestionChip}
              onPress={(): void => {
                updateQuery(label);
                logSearchQuery(label);
              }}
            >
              <Text style={styles.suggestionText}>{label}</Text>
            </Pressable>
          ))}
        </View>
      )}

      <SearchResultList items={results} onPressItem={handlePressItem} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  suggestionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.sm
  },
  suggestionChip: {
    borderRadius: 16,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    backgroundColor: theme.colors.surface,
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.sm
  },
  suggestionText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary
  }
});


