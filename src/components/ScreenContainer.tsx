import React from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '../theme';

interface Props {
  children: React.ReactNode;
  /** Quando true, usa ScrollView; quando false, View fixa (ex.: telas de loading). */
  scroll?: boolean;
  contentStyle?: ViewStyle;
}

/**
 * Contêiner base de tela: aplica fundo, respeita a área segura e oferece
 * rolagem opcional. Padroniza o espaçamento de todas as telas.
 */
export function ScreenContainer({ children, scroll = true, contentStyle }: Props) {
  const insets = useSafeAreaInsets();
  const padding = {
    paddingTop: insets.top + spacing.md,
    paddingBottom: insets.bottom + spacing.xl,
  };

  if (!scroll) {
    return (
      <View style={[styles.root, padding, styles.center, contentStyle]}>{children}</View>
    );
  }

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={[styles.content, padding, contentStyle]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  center: {
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
  },
});
