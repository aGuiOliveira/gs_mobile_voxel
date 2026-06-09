import AsyncStorage from '@react-native-async-storage/async-storage';
import { AggregateStats, Project } from '../types';

/**
 * Camada de persistência dos projetos usando AsyncStorage.
 * Toda leitura é defensiva: dados corrompidos não derrubam o app.
 */

const STORAGE_KEY = '@voxelsat/projects';

/** Gera um id único sem dependências externas. */
export function createId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function getProjects(): Promise<Project[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Mais recentes primeiro.
    return (parsed as Project[]).sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
    console.warn('Falha ao ler projetos do armazenamento:', error);
    return [];
  }
}

export async function getProject(id: string): Promise<Project | null> {
  const projects = await getProjects();
  return projects.find((p) => p.id === id) ?? null;
}

export async function saveProject(project: Project): Promise<void> {
  const projects = await getProjects();
  const next = [project, ...projects.filter((p) => p.id !== project.id)];
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export async function deleteProject(id: string): Promise<void> {
  const projects = await getProjects();
  const next = projects.filter((p) => p.id !== id);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export async function getAggregateStats(): Promise<AggregateStats> {
  const projects = await getProjects();
  return projects.reduce<AggregateStats>(
    (acc, p) => ({
      projectCount: acc.projectCount + 1,
      totalMassSavedKg: acc.totalMassSavedKg + p.result.massSavedKg * Math.max(1, p.quantity),
      totalCostSavedUsd: acc.totalCostSavedUsd + p.result.costSavedUsd,
    }),
    { projectCount: 0, totalMassSavedKg: 0, totalCostSavedUsd: 0 },
  );
}
