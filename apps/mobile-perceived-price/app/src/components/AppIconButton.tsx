import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '@theme/index';
import { Ionicons } from '@expo/vector-icons';

type AppIconButtonProps = {
  name: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  style?: ViewStyle;
  isPrimary?: boolean;
};

// 한국어 주석: 탭바 및 카드에서 사용하는 기본 아이콘 버튼입니다.

export function AppIconButton(props: AppIconButtonProps): JSX.Element {
  const { name, onPress, style, isPrimary = false } = props;

  return (
    <Pressable
      style={({ pressed }): ViewStyle => ({
        ...styles.base,
        ...(isPrimary ? styles.primary : styles.ghost),
        opacity: pressed ? 0.8 : 1,
        ...(style ?? {})
      })}
      onPress={onPress}
    >
      <Ionicons
        name={name}
        size={20}
        color={isPrimary ? theme.colors.surfaceElevated : theme.colors.textSecondary}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  primary: {
    backgroundColor: theme.colors.primary
  },
  ghost: {
    backgroundColor: 'transparent'
  }
});


