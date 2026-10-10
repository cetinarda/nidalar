import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { dayNumbers } from '../content/numbers';
import { C, F, S, type } from '../theme/tokens';
import { useT } from '../i18n';

// Günün sembolü: gün · ay · yılın rakam toplamı ve günün sayısı.
export function DayNumbers({ size = 'large' }: { size?: 'large' | 'compact' }) {
  const { lang } = useT();
  const t = dayNumbers(new Date(), lang);
  const large = size === 'large';
  return (
    <View style={{ alignItems: large ? 'center' : 'flex-start' }}>
      <Text style={[styles.symbol, !large && styles.symbolCompact]}>{t.symbol}</Text>
      <Text style={[type.small, large && { textAlign: 'center' }]}>{t.caption}</Text>
      <View style={[styles.row, large && { justifyContent: 'center' }]}>
        <Text style={styles.n}>{t.n}</Text>
        <Text style={styles.word}>{t.meaning.word}</Text>
      </View>
      <Text style={[type.body, { color: C.ink }, large && { textAlign: 'center' }]}>{t.meaning.line}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  symbol: {
    fontFamily: F.serif, fontSize: 60, lineHeight: 72, color: C.ink,
    textShadowColor: 'rgba(255,240,220,0.35)', textShadowRadius: 18,
  },
  symbolCompact: { fontSize: 44, lineHeight: 54 },
  row: { flexDirection: 'row', alignItems: 'baseline', gap: S.sm, marginTop: S.md, marginBottom: S.xs },
  n: { fontFamily: F.serif, fontSize: 26, color: C.gold },
  word: { fontFamily: F.italic, fontSize: 22, color: C.gold },
});
