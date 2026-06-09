import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { runSimulation } from '../services/simulation';
import {
  ensureNotificationPermission,
  notifyOptimizationComplete,
} from '../services/notifications';
import { getComponent } from '../data/components';
import { Button, ScreenContainer } from '../components';
import { colors, fontSize, spacing } from '../theme';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Simulation'>;
type Rt = RouteProp<RootStackParamList, 'Simulation'>;

const STEPS = [
  'Gerando malha de elementos…',
  'Aplicando cargas e apoios…',
  'Otimizando distribuição de material…',
  'Calculando massa e custo…',
];

export function SimulationScreen() {
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<Rt>();
  const input = params.input;

  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const startedRef = useRef(false);

  function start() {
    setError(null);
    setStepIndex(0);

    // Avança as mensagens de progresso enquanto "processa".
    const interval = setInterval(() => {
      setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
    }, 500);

    ensureNotificationPermission().catch(() => undefined);

    runSimulation(input)
      .then(async (result) => {
        clearInterval(interval);
        await notifyOptimizationComplete(
          'Otimização concluída ✅',
          `${getComponent(input.componentId).name}: ${result.reductionPct
            .toFixed(1)
            .replace('.', ',')}% de massa reduzida.`,
        );
        navigation.replace('Result', { input, result });
      })
      .catch((e) => {
        clearInterval(interval);
        console.warn('Falha na simulação:', e);
        setError('Não foi possível concluir a simulação. Tente novamente.');
      });

    return interval;
  }

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    const interval = start();
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return (
      <ScreenContainer scroll={false}>
        <View style={styles.center}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.title}>Erro na simulação</Text>
          <Text style={styles.subtitle}>{error}</Text>
          <View style={styles.actions}>
            <Button
              label="Tentar novamente"
              onPress={() => {
                startedRef.current = true;
                start();
              }}
            />
            <Button label="Voltar" variant="ghost" onPress={() => navigation.goBack()} />
          </View>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll={false}>
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.title}>Otimizando estrutura…</Text>
        <Text style={styles.subtitle}>{STEPS[stepIndex]}</Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    gap: spacing.md,
  },
  title: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: '800',
    marginTop: spacing.md,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    textAlign: 'center',
  },
  errorIcon: {
    fontSize: 48,
  },
  actions: {
    marginTop: spacing.md,
    gap: spacing.sm,
    alignSelf: 'stretch',
  },
});
