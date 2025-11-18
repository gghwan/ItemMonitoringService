import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppNavigator } from './src/app/navigation';
import { theme } from './src/app/theme';

// 한국어 주석: Expo에서 사용하는 앱 진입점입니다.

const queryClient = new QueryClient();

export default function App(): JSX.Element {
  const [fontsLoaded] = useFonts({
    // 한국어 주석:
    // Pretendard 공식 저장소(https://github.com/orioncactus/pretendard)의 릴리즈에서
    // Regular/Medium/SemiBold/Bold 파일을 내려받아 assets/fonts 에 추가한 뒤,
    // 실제 파일명/확장자에 맞춰 require 경로를 조정해 주세요.
    'Pretendard-Regular': require('./assets/fonts/Pretendard-Regular.otf'),
    'Pretendard-Medium': require('./assets/fonts/Pretendard-Medium.otf'),
    'Pretendard-SemiBold': require('./assets/fonts/Pretendard-SemiBold.otf'),
    'Pretendard-Bold': require('./assets/fonts/Pretendard-Bold.otf')
  });

  if (!fontsLoaded) {
    // TODO: 필요 시 Splash / 로딩 화면으로 대체
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <AppNavigator />
      </SafeAreaView>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background
  }
});


