import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BottomTabs } from './BottomTabs';
import { ItemDetailScreen } from '@features/item-detail/ItemDetailScreen';
import { SearchScreen } from '@features/search/SearchScreen';
import { t } from '../../i18n';

// 한국어 주석: 루트 스택 네비게이션. 탭 + 검색 + 상세를 포함합니다.

export type RootStackParamList = {
  Tabs: undefined;
  Search: undefined;
  ItemDetail: { itemCode: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator(): JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Tabs"
          component={BottomTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Search"
          component={SearchScreen}
          options={{ title: t('search.title') }}
        />
        <Stack.Screen
          name="ItemDetail"
          component={ItemDetailScreen}
          options={{ title: t('detail.title') }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}



