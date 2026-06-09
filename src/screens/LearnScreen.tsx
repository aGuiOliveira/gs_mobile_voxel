import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ScreenContainer, Card, SectionTitle, StructurePreview } from '../components';
import { LEARN_CARDS } from '../data/learnContent';
import { colors, fontSize, spacing } from '../theme';

/** Tela educativa: explica o conceito de otimização topológica. */
export function LearnScreen() {
  return (
    <ScreenContainer>
      <SectionTitle
        title="Aprender"
        subtitle="Entenda a otimização topológica e por que ela é estratégica no espaço."
      />

      <Card style={styles.demoCard}>
        <View style={styles.demoRow}>
          <StructurePreview variant="before" reductionPct={45} seed={7} size={130} />
          <Text style={styles.arrow}>→</Text>
          <StructurePreview variant="after" reductionPct={45} seed={7} size={130} />
        </View>
        <Text style={styles.demoCaption}>
          A mesma peça antes e depois da otimização: o material permanece só onde
          é necessário.
        </Text>
      </Card>

      {LEARN_CARDS.map((card) => (
        <Card key={card.id}>
          <Text style={styles.cardTitle}>
            {card.icon}  {card.title}
          </Text>
          <Text style={styles.cardBody}>{card.body}</Text>
        </Card>
      ))}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  demoCard: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  demoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  arrow: {
    color: colors.textMuted,
    fontSize: fontSize.xl,
    fontWeight: '800',
  },
  demoCaption: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    textAlign: 'center',
  },
  cardTitle: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: '800',
    marginBottom: spacing.sm,
  },
  cardBody: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    lineHeight: 22,
  },
});
