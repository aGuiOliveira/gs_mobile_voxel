import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, radius, spacing } from '../theme';

interface Props {
  icon: string;
  label: string;
  value: string;
  accent?: string;
}

/** Cartão compacto de destaque numérico (usado no dashboard e nos resultados). */
export function StatCard({ icon, label, value, accent = colors.accent }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={[styles.value, { color: accent }]} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 140,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.xs,
  },
  icon: {
    fontSize: fontSize.lg,
  },
  value: {
    fontSize: fontSize.xl,
    fontWeight: '800',
  },
  label: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
});
