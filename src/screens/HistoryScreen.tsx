import React, { useCallback, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { Project } from '../types';
import { getProjects } from '../services/storage';
import { getComponent } from '../data/components';
import {
  Button,
  Card,
  EmptyState,
  ScreenContainer,
  SectionTitle,
} from '../components';
import { formatDate, formatPercent, formatUsd } from '../utils/format';
import { colors, fontSize, spacing } from '../theme';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function HistoryScreen() {
  const navigation = useNavigation<Nav>();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);
      setError(false);
      getProjects()
        .then((list) => {
          if (active) setProjects(list);
        })
        .catch(() => active && setError(true))
        .finally(() => active && setLoading(false));
      return () => {
        active = false;
      };
    }, []),
  );

  return (
    <ScreenContainer>
      <SectionTitle
        title="Histórico"
        subtitle="Seus projetos de otimização salvos no dispositivo."
      />

      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.primary} />
        </View>
      )}

      {!loading && error && (
        <EmptyState
          icon="⚠️"
          title="Falha ao carregar"
          message="Não foi possível ler os projetos salvos. Tente novamente."
        />
      )}

      {!loading && !error && projects.length === 0 && (
        <>
          <EmptyState
            icon="🗂️"
            title="Nenhum projeto ainda"
            message="Crie seu primeiro projeto de otimização para vê-lo aqui."
          />
          <Button
            label="Novo projeto"
            icon="✨"
            onPress={() => navigation.navigate('NewProject')}
          />
        </>
      )}

      {!loading &&
        !error &&
        projects.map((p) => {
          const component = getComponent(p.componentId);
          return (
            <Card
              key={p.id}
              onPress={() => navigation.navigate('ProjectDetail', { projectId: p.id })}
              style={styles.item}
            >
              <Text style={styles.itemIcon}>{component.icon}</Text>
              <View style={styles.itemBody}>
                <Text style={styles.itemTitle}>{p.projectName}</Text>
                <Text style={styles.itemSub}>
                  {component.name} · {formatDate(p.createdAt)}
                </Text>
                <Text style={styles.itemStats}>
                  📉 {formatPercent(p.result.reductionPct)} · 💰 {formatUsd(p.result.costSavedUsd)}
                </Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </Card>
          );
        })}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  loading: {
    paddingVertical: spacing.xxl,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  itemIcon: {
    fontSize: fontSize.xl,
  },
  itemBody: {
    flex: 1,
    gap: 2,
  },
  itemTitle: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: '800',
  },
  itemSub: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
  itemStats: {
    color: colors.accent,
    fontSize: fontSize.sm,
    fontWeight: '700',
    marginTop: 2,
  },
  chevron: {
    color: colors.textMuted,
    fontSize: fontSize.xl,
    fontWeight: '700',
  },
});
