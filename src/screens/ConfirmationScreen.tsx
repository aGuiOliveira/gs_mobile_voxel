import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { Button, Card, ScreenContainer } from '../components';
import { formatMass, formatPercent, formatUsd } from '../utils/format';
import { colors, fontSize, spacing } from '../theme';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Confirmation'>;
type Rt = RouteProp<RootStackParamList, 'Confirmation'>;

/** Tela de status: confirma que o projeto foi salvo com sucesso. */
export function ConfirmationScreen() {
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<Rt>();
  const { projectId, result } = params;

  return (
    <ScreenContainer scroll={false}>
      <View style={styles.center}>
        <Text style={styles.icon}>✅</Text>
        <Text style={styles.title}>Projeto salvo!</Text>
        <Text style={styles.subtitle}>
          Sua simulação foi registrada e já aparece no histórico.
        </Text>

        <Card style={styles.summary}>
          <Text style={styles.summaryLine}>
            📉 {formatPercent(result.reductionPct)} de massa reduzida
          </Text>
          <Text style={styles.summaryLine}>
            ⚖️ {formatMass(result.massSavedKg)} economizados por unidade
          </Text>
          <Text style={styles.summaryLine}>
            💰 {formatUsd(result.costSavedUsd)} de economia no lançamento
          </Text>
        </Card>

        <View style={styles.actions}>
          <Button
            label="Ver detalhes"
            icon="🔍"
            onPress={() => navigation.replace('ProjectDetail', { projectId })}
          />
          <Button
            label="Ir para o histórico"
            variant="secondary"
            onPress={() => navigation.navigate('Tabs', { screen: 'History' })}
          />
          <Button
            label="Voltar ao início"
            variant="ghost"
            onPress={() => navigation.navigate('Tabs', { screen: 'Home' })}
          />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  icon: {
    fontSize: 64,
  },
  title: {
    color: colors.text,
    fontSize: fontSize.xl,
    fontWeight: '900',
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    textAlign: 'center',
  },
  summary: {
    alignSelf: 'stretch',
    marginTop: spacing.md,
    gap: spacing.xs,
  },
  summaryLine: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  actions: {
    alignSelf: 'stretch',
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
});
