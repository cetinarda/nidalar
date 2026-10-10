import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { C, F, S } from '../theme/tokens';
import { useT } from '../i18n';

const STEPS = Array.from({ length: 11 }, (_, i) => i * 10);

// 0–100 inanç ölçeği: sürükleme yerine dokunulan 11 nokta.
export function BeliefPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const { t } = useT();
  return (
    <View>
      <Text style={styles.big}>%{value}</Text>
      <View style={styles.row}>
        {STEPS.map(v => (
          <Pressable
            key={v}
            hitSlop={8}
            accessibilityLabel={`%${v}`}
            onPress={() => {
              Haptics.selectionAsync().catch(() => {});
              onChange(v);
            }}
            style={styles.cell}
          >
            <View style={[styles.tick, v <= value && styles.tickOn, v === value && styles.tickNow]} />
          </Pressable>
        ))}
      </View>
      <View style={styles.legend}>
        <Text style={styles.legendText}>{t('belief.none')}</Text>
        <Text style={styles.legendText}>{t('belief.some')}</Text>
        <Text style={styles.legendText}>{t('belief.full')}</Text>
      </View>
    </View>
  );
}

// Önce / sonra: Galiba'nın tek ölçüsü.
export function BeliefDelta({ before, after, compact }: { before: number; after: number; compact?: boolean }) {
  const { t } = useT();
  return (
    <View style={{ gap: compact ? 6 : S.sm }}>
      <Bar label={t('belief.before')} value={before} color={C.coral} compact={compact} />
      <Bar label={t('belief.after')} value={after} color={C.gold} compact={compact} />
    </View>
  );
}

function Bar({ label, value, color, compact }: { label: string; value: number; color: string; compact?: boolean }) {
  return (
    <View style={styles.barRow}>
      <Text style={[styles.barLabel, compact && { width: 44 }]}>{label}</Text>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${Math.max(value, 2)}%`, backgroundColor: color }]} />
      </View>
      <Text style={styles.barValue}>%{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  big: { fontFamily: F.serif, fontSize: 72, color: C.ink, textAlign: 'center' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: S.md, height: 36 },
  cell: { flex: 1, alignItems: 'center', justifyContent: 'center', height: 36 },
  tick: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.line },
  tickOn: { backgroundColor: C.lilacSoft },
  tickNow: { width: 18, height: 18, borderRadius: 9, backgroundColor: C.gold },
  legend: { flexDirection: 'row', justifyContent: 'space-between', marginTop: S.xs },
  legendText: { fontFamily: F.light, fontSize: 13, color: C.inkMuted },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: S.sm },
  barLabel: { width: 52, fontFamily: F.light, fontSize: 13, color: C.inkMuted },
  track: { flex: 1, height: 4, borderRadius: 2, backgroundColor: C.line, overflow: 'hidden' },
  fill: { height: 4, borderRadius: 2 },
  barValue: { width: 44, textAlign: 'right', fontFamily: F.regular, fontSize: 13, color: C.inkSoft },
});
