import React from 'react';
import { ScrollView, ScrollViewProps, StyleSheet } from 'react-native';
import { theme } from '@theme/index';

type ScreenContainerProps = {
  children: React.ReactNode;
} & ScrollViewProps;

// 한국어 주석: Figma 디자인을 옮기기 쉽게, 공통 패딩/배경/스크롤 설정을 모아둔 컨테이너입니다.
// 각 화면에서는 가능한 한 이 컴포넌트를 사용해 레이아웃을 잡고 세부 스타일만 조정합니다.

export function ScreenContainer(props: ScreenContainerProps): JSX.Element {
  const { children, contentContainerStyle, ...rest } = props;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, contentContainerStyle]}
      {...rest}
    >
      {children}
    </ScrollView>
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
  }
});


