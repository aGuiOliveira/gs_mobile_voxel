import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { SimulationInput, SimulationResult } from '../types';
import { getComponent } from '../data/components';
import { getMaterial } from '../data/materials';
import { getVehicle } from '../data/launchVehicles';
import { formatInt, formatMass, formatPercent, formatUsd } from '../utils/format';
import { colors, fontSize, radius, spacing } from '../theme';
import { Card } from './Card';
import { StatCard } from './StatCard';
import { StructurePreview } from './StructurePreview';

interface Props {
  input: SimulationInput;
  result: SimulationResult;
}

/** Semente determinística para o padrão visual, a partir do nome do projeto. */
function seedFrom(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0;
  return Math.abs(h) % 9999;
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

/**
 * Exibe um resultado de simulação por completo. Reutilizado tanto na tela de
 * resultado (logo após a simulação) quanto no detalhe de um projeto salvo.
 */
export function ResultView({ input, result }: Props) {
  const component = getComponent(input.componentId);
  const material = getMaterial(input.materialId);
  const vehicle = getVehicle(input.vehicleId);
  const seed = seedFrom(input.projectName);

  return (
    <View style={styles.wrapper}>
      <Card style={styles.previewCard}>
        <View style={styles.previews}>
          <StructurePreview variant="before" reductionPct={result.reductionPct} seed={seed} size={150} />
          <Text style={styles.arrow}>→</Text>
          <StructurePreview variant="after" reductionPct={result.reductionPct} seed={seed} size={150} />
        </View>
      </Card>

      <View style={styles.stats}>
        <StatCard
          icon="📉"
          label="Massa reduzida"
          value={formatPercent(result.reductionPct)}
          accent={colors.success}
        />
        <StatCard
          icon="⚖️"
          label="Peso economizado / un."
          value={formatMass(result.massSavedKg)}
        />
      </View>
      <View style={styles.stats}>
        <StatCard
          icon="💰"
          label={input.quantity > 1 ? `Economia (${formatInt(input.quantity)} un.)` : 'Economia de lançamento'}
          value={formatUsd(result.costSavedUsd)}
          accent={colors.warning}
        />
        <StatCard
          icon="🧱"
          label="Rigidez mantida"
          value={formatPercent(result.stiffnessRetainedPct)}
          accent={colors.primary}
        />
      </View>

      {!!input.photoUri && (
        <Card>
          <Text style={styles.photoLabel}>Foto de referência</Text>
          <Image source={{ uri: input.photoUri }} style={styles.photo} resizeMode="cover" />
        </Card>
      )}

      <Card>
        <Text style={styles.detailsTitle}>Detalhes</Text>
        <DetailRow label="Componente" value={`${component.icon}  ${component.name}`} />
        <DetailRow label="Material" value={material.name} />
        <DetailRow label="Veículo" value={`${vehicle.name} — ${vehicle.provider}`} />
        <DetailRow label="Custo de lançamento" value={`${formatUsd(result.costPerKg)} / kg`} />
        <DetailRow label="Unidades" value={formatInt(input.quantity)} />
        <DetailRow label="Massa antes" value={formatMass(result.massBeforeKg)} />
        <DetailRow label="Massa depois" value={formatMass(result.massAfterKg)} />
        <DetailRow label="Economia por unidade" value={formatUsd(result.costSavedPerUnitUsd)} />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.md,
  },
  previewCard: {
    alignItems: 'center',
  },
  previews: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  arrow: {
    color: colors.textMuted,
    fontSize: fontSize.xl,
    fontWeight: '800',
  },
  stats: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  photoLabel: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  photo: {
    width: '100%',
    height: 180,
    borderRadius: radius.md,
  },
  detailsTitle: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: '800',
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.md,
  },
  rowLabel: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
  rowValue: {
    color: colors.text,
    fontSize: fontSize.sm,
    fontWeight: '700',
    flexShrink: 1,
    textAlign: 'right',
  },
});
