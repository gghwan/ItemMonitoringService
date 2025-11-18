import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@theme/index';
import { HomeScreen } from '@features/home/HomeScreen';
import { CategoryScreen } from '@features/category/CategoryScreen';
import { BasketScreen } from '@features/basket/BasketScreen';
import { ExpenditureScreen } from '@features/expenditure/ExpenditureScreen';
import { t } from '../../i18n';

// 한국어 주석: Figma 하단 탭 스타일을 참고한 기본 탭 네비게이션입니다.

export type RootTabParamList = {
  Home: undefined;
  Category: undefined;
  Basket: undefined;
  Expenditure: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export function BottomTabs(): JSX.Element {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          ...theme.typography.caption,
          marginBottom: 4
        },
        tabBarStyle: {
          backgroundColor: theme.colors.surfaceElevated,
          borderTopWidth: 0,
          elevation: 5,
          height: 64
        },
        tabBarIcon: ({ focused, color, size }) => {
          const iconName = getTabIconName(route.name);
          const tintColor = focused ? theme.colors.primary : color;

          return <Ionicons name={iconName} size={size} color={tintColor} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: t('nav.home') }}
      />
      <Tab.Screen
        name="Category"
        component={CategoryScreen}
        options={{ tabBarLabel: t('nav.category') }}
      />
      <Tab.Screen
        name="Basket"
        component={BasketScreen}
        options={{ tabBarLabel: t('nav.basket') }}
      />
      <Tab.Screen
        name="Expenditure"
        component={ExpenditureScreen}
        options={{ tabBarLabel: t('nav.expenditure') }}
      />
    </Tab.Navigator>
  );
}

function getTabIconName(routeName: keyof RootTabParamList): keyof typeof Ionicons.glyphMap {
  if (routeName === 'Home') {
    return 'home-outline';
  }

  if (routeName === 'Category') {
    return 'grid-outline';
  }

  if (routeName === 'Basket') {
    return 'bag-handle-outline';
  }

  return 'pie-chart-outline';
}


