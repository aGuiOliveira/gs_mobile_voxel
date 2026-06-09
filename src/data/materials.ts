import { Material, MaterialId } from '../types';

/**
 * Catálogo de materiais usados em estruturas aeroespaciais.
 * A densidade do alumínio (2,70 g/cm³) é a referência para a massa base
 * dos componentes — os demais materiais escalam a massa por essa razão.
 */
export const REFERENCE_DENSITY = 2.7;

export const MATERIALS: Material[] = [
  {
    id: 'aluminum',
    name: 'Alumínio 6061',
    density: 2.7,
    yieldStrength: 276,
    reductionFactor: 1.0,
    description: 'Leve e versátil. Padrão da indústria espacial.',
    color: '#9AA4BF',
  },
  {
    id: 'titanium',
    name: 'Titânio Ti-6Al-4V',
    density: 4.43,
    yieldStrength: 880,
    reductionFactor: 0.9,
    description: 'Alta resistência, porém mais difícil de otimizar.',
    color: '#C0C6D6',
  },
  {
    id: 'cfrp',
    name: 'Fibra de carbono (CFRP)',
    density: 1.6,
    yieldStrength: 600,
    reductionFactor: 1.15,
    description: 'Ultraleve. Permite geometrias mais agressivas.',
    color: '#48E0C8',
  },
  {
    id: 'steel',
    name: 'Aço inoxidável',
    density: 7.85,
    yieldStrength: 520,
    reductionFactor: 0.85,
    description: 'Robusto e barato, mas pesado para o espaço.',
    color: '#7E8AA8',
  },
];

export function getMaterial(id: MaterialId | string): Material {
  return MATERIALS.find((m) => m.id === id) ?? MATERIALS[0];
}
