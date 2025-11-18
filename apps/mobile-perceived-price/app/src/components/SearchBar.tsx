import React from 'react';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';
import { theme } from '@theme/index';

type SearchBarProps = {
  onFocus?: () => void;
} & TextInputProps;

// 한국어 주석: Home / Search 화면에서 공통으로 사용하는 검색 입력 컴포넌트입니다.
// Figma 검색바 스타일(라운드, 연한 배경, 기본 바디 텍스트)을 그대로 옮기기 위한 껍데기입니다.

export function SearchBar(props: SearchBarProps): JSX.Element {
  const { onFocus, style, ...rest } = props;

  return (
    <TextInput
      placeholderTextColor={theme.colors.textSecondary}
      style={[styles.input, style]}
      onFocus={onFocus}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 44,
    borderRadius: 22,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    color: theme.colors.textPrimary,
    borderWidth: 1,
    borderColor: theme.colors.borderSoft,
    ...theme.typography.body
  }
});


