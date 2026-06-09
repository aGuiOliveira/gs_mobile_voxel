import { SimulationInput } from '../types';

/**
 * Validações de formulário do cadastro de projeto.
 * Cada função retorna uma mensagem de erro (string) ou `null` se válido.
 */

export function validateProjectName(name: string): string | null {
  const trimmed = name.trim();
  if (!trimmed) return 'Informe um nome para o projeto.';
  if (trimmed.length < 3) return 'O nome deve ter ao menos 3 caracteres.';
  if (trimmed.length > 40) return 'O nome deve ter no máximo 40 caracteres.';
  return null;
}

export function validateQuantity(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return 'Informe a quantidade de unidades.';
  const n = Number(trimmed);
  if (!Number.isFinite(n)) return 'Quantidade inválida.';
  if (!Number.isInteger(n)) return 'A quantidade deve ser um número inteiro.';
  if (n < 1) return 'A quantidade deve ser ao menos 1.';
  if (n > 100000) return 'A quantidade máxima é 100.000.';
  return null;
}

export interface FormErrors {
  projectName?: string;
  quantity?: string;
  componentId?: string;
  vehicleId?: string;
}

/** Valida o formulário inteiro de uma vez. Retorna um mapa de erros. */
export function validateForm(
  draft: Partial<SimulationInput> & { quantityText: string },
): FormErrors {
  const errors: FormErrors = {};

  const nameError = validateProjectName(draft.projectName ?? '');
  if (nameError) errors.projectName = nameError;

  const qtyError = validateQuantity(draft.quantityText ?? '');
  if (qtyError) errors.quantity = qtyError;

  if (!draft.componentId) errors.componentId = 'Selecione um componente.';
  if (!draft.vehicleId) errors.vehicleId = 'Selecione um veículo de lançamento.';

  return errors;
}

export function hasErrors(errors: FormErrors): boolean {
  return Object.keys(errors).length > 0;
}
