import { LaunchVehicle } from '../types';

/**
 * Veículos de lançamento e custo aproximado por kg até a órbita baixa (LEO).
 * Valores públicos estimados, apenas para fins didáticos da simulação.
 */
export const LAUNCH_VEHICLES: LaunchVehicle[] = [
  { id: 'falcon9', name: 'Falcon 9', provider: 'SpaceX', costPerKg: 2700 },
  { id: 'falcon-heavy', name: 'Falcon Heavy', provider: 'SpaceX', costPerKg: 1400 },
  { id: 'electron', name: 'Electron', provider: 'Rocket Lab', costPerKg: 25000 },
  { id: 'ariane6', name: 'Ariane 6', provider: 'ESA / ArianeGroup', costPerKg: 10000 },
  { id: 'atlas5', name: 'Atlas V', provider: 'ULA', costPerKg: 13000 },
  { id: 'starship', name: 'Starship', provider: 'SpaceX', costPerKg: 300 },
];

export function getVehicle(id: string): LaunchVehicle {
  return LAUNCH_VEHICLES.find((v) => v.id === id) ?? LAUNCH_VEHICLES[0];
}
