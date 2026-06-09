/**
 * Tipos centrais do VoxelSat.
 * Mantém o modelo de dados do app em um único lugar, usado por serviços,
 * telas e componentes.
 */

export type MaterialId = 'aluminum' | 'titanium' | 'cfrp' | 'steel';

export interface Material {
  id: MaterialId;
  name: string;
  /** Densidade em g/cm³ (usada para estimar a massa do componente). */
  density: number;
  /** Tensão de escoamento aproximada em MPa (informativo). */
  yieldStrength: number;
  /** Fator que ajusta o quanto de material é possível remover (manufaturabilidade). */
  reductionFactor: number;
  description: string;
  color: string;
}

export interface ComponentType {
  id: string;
  name: string;
  /** Emoji usado como ícone leve, sem dependências de imagem. */
  icon: string;
  description: string;
  /** Massa de referência (peça maciça) em kg, considerando alumínio. */
  baseMassKg: number;
  /** Faixa típica de redução de massa em % para esse tipo de peça. */
  reductionRange: [number, number];
}

export type OptimizationLevel = 'conservador' | 'moderado' | 'agressivo';

export interface LaunchVehicle {
  id: string;
  name: string;
  provider: string;
  /** Custo aproximado de lançamento por kg até a órbita baixa (LEO), em US$. */
  costPerKg: number;
}

/** Dados informados pelo usuário no cadastro de um projeto. */
export interface SimulationInput {
  projectName: string;
  componentId: string;
  materialId: MaterialId;
  level: OptimizationLevel;
  vehicleId: string;
  /** Quantidade de unidades (ex.: tamanho da constelação de satélites). */
  quantity: number;
  /** Foto de referência da peça (URI local), opcional. */
  photoUri?: string | null;
}

/** Resultado calculado pela simulação de otimização topológica. */
export interface SimulationResult {
  reductionPct: number;
  massBeforeKg: number;
  massAfterKg: number;
  massSavedKg: number;
  costPerKg: number;
  costSavedPerUnitUsd: number;
  costSavedUsd: number;
  /** Rigidez estrutural mantida (%) — métrica simulada. */
  stiffnessRetainedPct: number;
}

/** Projeto persistido = entrada + resultado + metadados. */
export interface Project extends SimulationInput {
  id: string;
  createdAt: number;
  result: SimulationResult;
}

/** Estatísticas agregadas exibidas na tela inicial. */
export interface AggregateStats {
  projectCount: number;
  totalMassSavedKg: number;
  totalCostSavedUsd: number;
}
