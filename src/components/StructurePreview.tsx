import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { colors, fontSize, spacing } from '../theme';

interface Props {
  /** Percentual de redução de massa; controla quanto material é removido. */
  reductionPct: number;
  /** Semente para variação determinística do padrão entre projetos. */
  seed?: number;
  variant: 'before' | 'after';
  size?: number;
}

const COLS = 14;
const ROWS = 11;
const CELL = 12;
const PAD = 1;

/** Hash leve para ruído determinístico por célula. */
function noise(x: number, y: number, seed: number): number {
  const n = Math.sin((x * 127.1 + y * 311.7 + seed * 0.013) ) * 43758.5453;
  return n - Math.floor(n); // 0..1
}

/**
 * "Importância estrutural" de cada célula para uma peça em balanço:
 * engaste na borda esquerda e carga no centro-direita. Mantemos as células
 * que formam o quadro e as duas escoras (treliça) entre apoio e carga.
 */
function importance(col: number, row: number, seed: number): number {
  const nx = col / (COLS - 1);
  const ny = row / (ROWS - 1);

  // Distância a duas linhas que vão dos cantos esquerdos até a carga (1, 0.5).
  const distToLine = (x0: number, y0: number, x1: number, y1: number) => {
    const dx = x1 - x0;
    const dy = y1 - y0;
    const len2 = dx * dx + dy * dy;
    const t = Math.max(0, Math.min(1, ((nx - x0) * dx + (ny - y0) * dy) / len2));
    const px = x0 + t * dx;
    const py = y0 + t * dy;
    return Math.hypot(nx - px, ny - py);
  };

  const strutTop = 1 - distToLine(0, 0.05, 1, 0.5) * 3.2;
  const strutBottom = 1 - distToLine(0, 0.95, 1, 0.5) * 3.2;
  const leftWall = nx < 0.12 ? 1 : 0; // engaste
  const midBar = 1 - Math.abs(ny - 0.5) * 3.5; // banzo central

  const base = Math.max(strutTop, strutBottom, leftWall, midBar * 0.8);
  return base + noise(col, row, seed) * 0.18;
}

export function StructurePreview({ reductionPct, seed = 1, variant, size = 200 }: Props) {
  const keptCells = useMemo(() => {
    const cells: { col: number; row: number; score: number }[] = [];
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        cells.push({ col, row, score: importance(col, row, seed) });
      }
    }
    if (variant === 'before') return cells; // peça maciça: todas as células

    const targetDensity = Math.max(0.1, 1 - reductionPct / 100);
    const keepCount = Math.round(targetDensity * cells.length);
    return [...cells]
      .sort((a, b) => b.score - a.score)
      .slice(0, keepCount);
  }, [reductionPct, seed, variant]);

  const viewW = COLS * CELL;
  const viewH = ROWS * CELL;
  const gradId = `grad-${variant}`;
  const fill = variant === 'before' ? colors.textMuted : `url(#${gradId})`;

  return (
    <View style={styles.wrapper}>
      <Svg width={size} height={(size * viewH) / viewW} viewBox={`0 0 ${viewW} ${viewH}`}>
        <Defs>
          <LinearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={colors.accent} />
            <Stop offset="1" stopColor={colors.primary} />
          </LinearGradient>
        </Defs>
        {/* Contorno do domínio de projeto */}
        <Rect
          x={0.5}
          y={0.5}
          width={viewW - 1}
          height={viewH - 1}
          rx={6}
          fill="none"
          stroke={colors.border}
          strokeWidth={1}
        />
        {keptCells.map(({ col, row }) => (
          <Rect
            key={`${col}-${row}`}
            x={col * CELL + PAD}
            y={row * CELL + PAD}
            width={CELL - PAD * 2}
            height={CELL - PAD * 2}
            rx={2}
            fill={fill}
            opacity={variant === 'before' ? 0.55 : 1}
          />
        ))}
      </Svg>
      <Text style={styles.caption}>{variant === 'before' ? 'Antes (maciço)' : 'Depois (otimizado)'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  caption: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
});
