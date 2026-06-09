import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';
import { useFocusEffect, useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { Project } from '../types';
import { deleteProject, getProject } from '../services/storage';
import {
  Button,
  EmptyState,
  ResultView,
  ScreenContainer,
  SectionTitle,
} from '../components';
import { formatDate } from '../utils/format';
import { colors, spacing } from '../theme';

type Nav = NativeStackNavigationProp<RootStackParamList, 'ProjectDetail'>;
type Rt = RouteProp<RootStackParamList, 'ProjectDetail'>;

export function ProjectDetailScreen() {
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<Rt>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);
      getProject(params.projectId)
        .then((p) => active && setProject(p))
        .finally(() => active && setLoading(false));
      return () => {
        active = false;
      };
    }, [params.projectId]),
  );

  function onDelete() {
    Alert.alert('Excluir projeto', 'Tem certeza que deseja excluir este projeto?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          await deleteProject(params.projectId);
          navigation.goBack();
        },
      },
    ]);
  }

  if (loading) {
    return (
      <ScreenContainer scroll={false}>
        <ActivityIndicator color={colors.primary} size="large" />
      </ScreenContainer>
    );
  }

  // Caso de erro tratado: registro não encontrado.
  if (!project) {
    return (
      <ScreenContainer>
        <EmptyState
          icon="🔎"
          title="Projeto não encontrado"
          message="Este projeto pode ter sido removido. Volte ao histórico."
        />
        <Button label="Voltar ao histórico" onPress={() => navigation.goBack()} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <SectionTitle title={project.projectName} subtitle={`Criado em ${formatDate(project.createdAt)}`} />

      <ResultView input={project} result={project.result} />

      <View style={styles.actions}>
        <Button label="Excluir projeto" variant="danger" icon="🗑️" onPress={onDelete} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  actions: {
    marginTop: spacing.md,
  },
});
