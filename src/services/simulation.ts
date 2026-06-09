import { SimulationInput, SimulationResult, OptimizationLevel } from '../types';
import { getComponent } from '../data/components';
import { getMaterial, REFERENCE_DENSITY } from '../data/materials';
import { getVehicle } from '../data/launchVehicles';

/**
 * Núcleo da "otimização" simulada.
 *
 * Não roda elementos finitos de verdade — em vez disso, combina dados de
 * catálogo (faixa típica de redução por componente, material e veículo) com
 * fórmulas simples para produzir um resultado plausível e variado.
 * É 100% determinístico: a mesma entrada gera sempre o mesmo resultado.
 */

const LEVEL_FACTOR: Record<OptimizationLevel, number> = {
  conservador: 0.78,
  moderado: 1.0,
  agressivo: 1.18,
};

/** Hash determinístico simples (string -> inteiro positivo). */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // força 32 bits
  }
  return Math.abs(hash);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function round(value: number, decimals = 2): number {
  const f = 10 ** decimals;
  return Math.round(value * f) / f;
}

/** Calcula o resultado da otimização de forma síncrona e pura. */
export function computeSimulation(input: SimulationInput): SimulationResult {
  const component = getComponent(input.componentId);
  const material = getMaterial(input.materialId);
  const vehicle = getVehicle(input.vehicleId);

  const [minRange, maxRange] = component.reductionRange;
  const midpoint = (minRange + maxRange) / 2;

  // Pequena variação determinística (-2,5% a +2,5%) para dar realismo.
  const seed = hashString(`${input.projectName}|${input.componentId}|${input.materialId}`);
  const jitter = ((seed % 1000) / 1000 - 0.5) * 5;

  let reductionPct = midpoint * LEVEL_FACTOR[input.level] * material.reductionFactor + jitter;
  reductionPct = clamp(reductionPct, minRange * 0.8, maxRange * 1.05);
  reductionPct = clamp(reductionPct, 8, 60);

  // Massa base escala com a densidade do material em relação ao alumínio.
  const massBeforeKg = component.baseMassKg * (material.density / REFERENCE_DENSITY);
  const massAfterKg = massBeforeKg * (1 - reductionPct / 100);
  const massSavedKg = massBeforeKg - massAfterKg;

  const quantity = Math.max(1, Math.floor(input.quantity));
  const costSavedPerUnitUsd = massSavedKg * vehicle.costPerKg;
  const costSavedUsd = costSavedPerUnitUsd * quantity;

  // Otimização topológica preserva a maior parte da rigidez ao remover massa.
  const stiffnessRetainedPct = clamp(100 - reductionPct * 0.18 - (seed % 30) / 10, 80, 99);

  return {
    reductionPct: round(reductionPct, 1),
    massBeforeKg: round(massBeforeKg, 3),
    massAfterKg: round(massAfterKg, 3),
    massSavedKg: round(massSavedKg, 3),
    costPerKg: vehicle.costPerKg,
    costSavedPerUnitUsd: round(costSavedPerUnitUsd, 0),
    costSavedUsd: round(costSavedUsd, 0),
    stiffnessRetainedPct: round(stiffnessRetainedPct, 1),
  };
}

/**
 * Versão assíncrona que simula o tempo de "processamento" do otimizador.
 * Usada pela tela de simulação para exibir o progresso ao usuário.
 */
export function runSimulation(
  input: SimulationInput,
  delayMs = 1800,
): Promise<SimulationResult> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(computeSimulation(input)), delayMs);
  });
}
