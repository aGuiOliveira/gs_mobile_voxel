/**
 * Funções de formatação para exibir dados de forma clara.
 * Implementadas manualmente para não depender de Intl (que varia entre
 * dispositivos no React Native).
 */

/** Insere separador de milhar (1234567 -> "1.234.567"). */
function withThousands(value: number): string {
  const fixed = Math.round(value).toString();
  return fixed.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/** Formata um valor em dólares: 1234567 -> "US$ 1.234.567". */
export function formatUsd(value: number): string {
  return `US$ ${withThousands(value)}`;
}

/** Formata massa em kg ou g conforme a grandeza. */
export function formatMass(kg: number): string {
  if (kg < 1) {
    return `${Math.round(kg * 1000)} g`;
  }
  return `${kg.toFixed(2).replace('.', ',')} kg`;
}

/** Formata porcentagem: 34.5 -> "34,5%". */
export function formatPercent(value: number): string {
  return `${value.toFixed(1).replace('.', ',')}%`;
}

/** Formata número inteiro com separador de milhar. */
export function formatInt(value: number): string {
  return withThousands(value);
}

/** Formata uma data (epoch ms) -> "08/06/2026 às 19:53". */
export function formatDate(epochMs: number): string {
  const d = new Date(epochMs);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} às ${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
}
