import { NavigatorScreenParams } from '@react-navigation/native';
import { SimulationInput, SimulationResult } from '../types';

/** Abas inferiores principais. */
export type TabParamList = {
  Home: undefined;
  Learn: undefined;
  History: undefined;
};

/** Pilha raiz que envolve as abas e o fluxo de criação de projeto. */
export type RootStackParamList = {
  Tabs: NavigatorScreenParams<TabParamList> | undefined;
  NewProject: undefined;
  Simulation: { input: SimulationInput };
  Result: { input: SimulationInput; result: SimulationResult };
  Confirmation: { projectId: string; result: SimulationResult };
  ProjectDetail: { projectId: string };
};
