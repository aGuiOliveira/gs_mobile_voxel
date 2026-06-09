import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from './Card';
import { colors, fontSize, radius, spacing } from '../theme';

interface Props {
  icon?: string;
  title: string;
  subtitle?: string;
  trailing?: string;
  selected: boolean;
  onPress: () => void;
}

/** Linha selecionável (rádio) usada para escolher componente, material, veículo. */
export function SelectableRow({
  icon,
  title,
  subtitle,
  trailing,
  selected,
  onPress,
}: Props) {
  return (
    <Card onPress={onPress} selected={selected} style={styles.card}>
      {!!icon && <Text style={styles.icon}>{icon}</Text>}
      <View style={styles.texts}>
        <Text style={styles.title}>{title}</Text>
        {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      {!!trailing && <Text style={styles.trailing}>{trailing}</Text>}
      <View style={[styles.radio, selected && styles.radioOn]}>
        {selected && <View style={styles.radioDot} />}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  icon: {
    fontSize: fontSize.lg,
  },
  texts: {
    flex: 1,
    gap: 2,
  },
  title: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
  trailing: {
    color: colors.accent,
    fontSize: fontSize.sm,
    fontWeight: '700',
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOn: {
    borderColor: colors.primary,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
});
