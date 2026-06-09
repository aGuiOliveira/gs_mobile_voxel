import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { Project } from '../types';
import { createId, saveProject } from '../services/storage';
import { Button, ResultView, ScreenContainer, SectionTitle } from '../components';
import { colors, fontSize, spacing } from '../theme';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Result'>;
type Rt = RouteProp<RootStackParamList, 'Result'>;

export function ResultScreen() {
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<Rt>();
  const { input, result } = params;
  const [saving, setSaving] = useState(false);

  async function onSave() {
    try {
      setSaving(true);
      const project: Project = {
        ...input,
        id: createId(),
        createdAt: Date.now(),
        result,
      };
      await saveProject(project);
      navigation.replace('Confirmation', { projectId: project.id, result });
    } catch (error) {
      console.warn('Falha ao salvar projeto:', error);
      Alert.alert('Erro', 'Não foi possível salvar o projeto. Tente novamente.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScreenContainer>
      <SectionTitle
        title={input.projectName}
        subtitle="Resultado da simulação de otimização topológica."
      />

      <ResultView input={input} result={result} />

      <View style={styles.actions}>
        <Button label="Salvar projeto" icon="💾" loading={saving} onPress={onSave} />
        <Button
          label="Descartar"
          variant="ghost"
          onPress={() => navigation.navigate('Tabs', { screen: 'Home' })}
        />
        <Text style={styles.note}>
          Valores estimados para fins didáticos, baseados em faixas típicas de
          otimização topológica.
        </Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  actions: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  note: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    textAlign: 'center',
  },
});
