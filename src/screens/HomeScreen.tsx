import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { AggregateStats } from '../types';
import { getAggregateStats } from '../services/storage';
import { Button, Card, ScreenContainer, StatCard } from '../components';
import { formatInt, formatMass, formatUsd } from '../utils/format';
import { colors, fontSize, spacing } from '../theme';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const [stats, setStats] = useState<AggregateStats>({
    projectCount: 0,
    totalMassSavedKg: 0,
    totalCostSavedUsd: 0,
  });

  // Recarrega as estatísticas sempre que a tela ganha foco.
  useFocusEffect(
    useCallback(() => {
      let active = true;
      getAggregateStats().then((s) => {
        if (active) setStats(s);
      });
      return () => {
        active = false;
      };
    }, []),
  );

  return (
    <ScreenContainer>
      <View style={styles.hero}>
        <Text style={styles.logo}>🛰️ VoxelSat</Text>
        <Text style={styles.tagline}>
          Otimização topológica para estruturas de satélites
        </Text>
        <Text style={styles.subtitle}>
          Menos massa, menor custo de lançamento, mais espaço para inovar.
        </Text>
      </View>

      <View style={styles.statsRow}>
        <StatCard
          icon="🗂️"
          label="Projetos"
          value={formatInt(stats.projectCount)}
          accent={colors.primary}
        />
        <StatCard
          icon="⚖️"
          label="Massa economizada"
          value={formatMass(stats.totalMassSavedKg)}
          accent={colors.success}
        />
      </View>
      <StatCard
        icon="💰"
        label="Economia total de lançamento estimada"
        value={formatUsd(stats.totalCostSavedUsd)}
        accent={colors.warning}
      />

      <Button
        label="Novo projeto de otimização"
        icon="✨"
        onPress={() => navigation.navigate('NewProject')}
      />
      <View style={styles.secondaryRow}>
        <Button
          label="Aprender"
          variant="secondary"
          icon="📚"
          style={styles.flex}
          onPress={() => navigation.navigate('Tabs', { screen: 'Learn' })}
        />
        <Button
          label="Histórico"
          variant="secondary"
          icon="🗂️"
          style={styles.flex}
          onPress={() => navigation.navigate('Tabs', { screen: 'History' })}
        />
      </View>

      <Card>
        <Text style={styles.infoTitle}>Como funciona</Text>
        <Text style={styles.infoText}>
          1. Cadastre um componente estrutural do satélite.{'\n'}
          2. Escolha material, nível de otimização e veículo de lançamento.{'\n'}
          3. Rode a simulação e veja quanta massa e custo você economiza.{'\n'}
          4. Salve e acompanhe tudo no histórico.
        </Text>
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  hero: {
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  logo: {
    color: colors.text,
    fontSize: fontSize.xxl,
    fontWeight: '900',
  },
  tagline: {
    color: colors.accent,
    fontSize: fontSize.md,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  secondaryRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  flex: {
    flex: 1,
  },
  infoTitle: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: '800',
    marginBottom: spacing.sm,
  },
  infoText: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    lineHeight: 22,
  },
});
