import { ComponentType } from '../types';

/**
 * Catálogo de componentes estruturais típicos de um satélite.
 * `baseMassKg` é a massa de uma peça maciça (sem otimização) em alumínio.
 * `reductionRange` é a faixa de redução de massa tipicamente alcançável
 * com otimização topológica para aquele tipo de peça.
 */
export const COMPONENTS: ComponentType[] = [
  {
    id: 'antenna-bracket',
    name: 'Suporte de antena',
    icon: '📡',
    description: 'Fixa a antena ao corpo do satélite.',
    baseMassKg: 1.2,
    reductionRange: [25, 45],
  },
  {
    id: 'solar-panel-mount',
    name: 'Suporte de painel solar',
    icon: '🔆',
    description: 'Estrutura que sustenta os painéis solares.',
    baseMassKg: 2.5,
    reductionRange: [30, 50],
  },
  {
    id: 'battery-tray',
    name: 'Bandeja de bateria',
    icon: '🔋',
    description: 'Aloja e protege o módulo de baterias.',
    baseMassKg: 3.0,
    reductionRange: [20, 40],
  },
  {
    id: 'truss',
    name: 'Treliça estrutural',
    icon: '🛰️',
    description: 'Esqueleto principal que une os módulos.',
    baseMassKg: 5.0,
    reductionRange: [35, 55],
  },
  {
    id: 'reaction-wheel-bracket',
    name: 'Suporte de roda de reação',
    icon: '⚙️',
    description: 'Apoio para o sistema de controle de atitude.',
    baseMassKg: 0.8,
    reductionRange: [20, 38],
  },
  {
    id: 'payload-interface',
    name: 'Interface de carga útil',
    icon: '📦',
    description: 'Conecta a carga útil à plataforma.',
    baseMassKg: 4.0,
    reductionRange: [25, 45],
  },
  {
    id: 'thruster-mount',
    name: 'Suporte de propulsor',
    icon: '🚀',
    description: 'Base que sustenta o sistema de propulsão.',
    baseMassKg: 1.5,
    reductionRange: [22, 40],
  },
];

export function getComponent(id: string): ComponentType {
  return COMPONENTS.find((c) => c.id === id) ?? COMPONENTS[0];
}
