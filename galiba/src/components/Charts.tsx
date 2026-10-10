import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { DAY_LABELS } from '../content/week';
import { AynaEntry } from '../store/useStore';
import { C, F, S, type } from '../theme/tokens';

// Defter infografikleri. Kural: her grafikte değerler yazıyla da var; renk tek başına anlam taşımaz.

// Haftanın ritüeli: her gün dört nokta, tamamlanan adım kadar dolu.
export function WeekRitual({ byDay, todayIndex }: { byDay: number[]; todayIndex: number }) {
  const total = byDay.reduce((a, b) => a + b, 0);
  return (
    <View>
      <View style={styles.weekRow}>
        {byDay.map((n, i) => (
          <View key={i} style={styles.dayCol} accessibilityLabel={`${DAY_LABELS[i]}: ${n}/4 adım`}>
            <View style={styles.stack}>
              {[3, 2, 1, 0].map(k => (
                <View key={k} style={[styles.pip, k < n && styles.pipOn]} />
              ))}
            </View>
            <Text style={[styles.dayLabel, i === todayIndex && { color: C.ink }]}>{DAY_LABELS[i]}</Text>
          </View>
        ))}
      </View>
      <Text style={[type.small, { marginTop: S.sm }]}>
        {`${byDay.filter(Boolean).length} gün · ${total}/28 adım`}
      </Text>
    </View>
  );
}

// Ayna dambılları: içi boş halka = önce, dolu nokta = sonra.
export function AynaDumbbells({ aynas }: { aynas: AynaEntry[] }) {
  return (
    <View style={{ gap: S.md }}>
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.ring, { position: 'relative', marginLeft: 0 }]} />
          <Text style={type.small}>önce</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { position: 'relative', marginLeft: 0 }]} />
          <Text style={type.small}>sonra</Text>
        </View>
      </View>
      {aynas.map(a => {
        const lo = Math.min(a.before, a.after);
        const hi = Math.max(a.before, a.after);
        return (
          <View key={a.id} accessibilityLabel={`${a.thought}: önce %${a.before}, sonra %${a.after}`}>
            <Text style={styles.thought} numberOfLines={1}>{a.thought}</Text>
            <View style={styles.dbRow}>
              <View style={styles.track}>
                <View style={[styles.span, { left: `${lo}%`, width: `${hi - lo}%` }]} />
                <View style={[styles.ring, { left: `${a.before}%` }]} />
                <View style={[styles.dot, { left: `${a.after}%` }]} />
              </View>
              <Text style={styles.dbValue}>{`%${a.before} → %${a.after}`}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

// En sık kesinlik kelimeleri: tek renk yatay çubuklar.
export function CertaintyBars({ words }: { words: [string, number][] }) {
  const max = Math.max(...words.map(w => w[1]), 1);
  return (
    <View style={{ gap: S.sm }}>
      {words.map(([w, n]) => (
        <View key={w} style={styles.barRow}>
          <Text style={styles.barLabel}>{w}</Text>
          <View style={styles.barTrack}>
            <View style={[styles.bar, { width: `${(n / max) * 100}%` }]} />
          </View>
          <Text style={styles.barValue}>{n}</Text>
        </View>
      ))}
    </View>
  );
}

// 21 günlük yol: tamamlanan günler dolu.
export function PathProgress({ done }: { done: number[] }) {
  return (
    <View>
      <View style={styles.pathRow}>
        {Array.from({ length: 21 }, (_, i) => (
          <View key={i} style={[styles.seg, done.includes(i + 1) && styles.segOn, (i + 1) % 7 === 0 && i < 20 && { marginRight: 6 }]} />
        ))}
      </View>
      <Text style={[type.small, { marginTop: S.sm }]}>{`${done.length}/21 gün`}</Text>
    </View>
  );
}

const MARK = 10;

const styles = StyleSheet.create({
  weekRow: { flexDirection: 'row', justifyContent: 'space-between' },
  dayCol: { alignItems: 'center', gap: 6, flex: 1 },
  stack: { gap: 3 },
  pip: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.line },
  pipOn: { backgroundColor: C.gold },
  dayLabel: { fontFamily: F.regular, fontSize: 11, color: C.inkMuted, letterSpacing: 0.5 },

  legend: { flexDirection: 'row', gap: S.md },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  thought: { fontFamily: F.light, fontSize: 14, color: C.inkSoft, marginBottom: 6 },
  dbRow: { flexDirection: 'row', alignItems: 'center', gap: S.sm },
  track: { flex: 1, height: MARK + 4, justifyContent: 'center' },
  span: { position: 'absolute', height: 2, backgroundColor: C.inkMuted, opacity: 0.6 },
  ring: {
    position: 'absolute', width: MARK, height: MARK, borderRadius: MARK / 2, marginLeft: -MARK / 2,
    borderWidth: 2, borderColor: C.coral, backgroundColor: C.bg,
  },
  dot: {
    position: 'absolute', width: MARK, height: MARK, borderRadius: MARK / 2, marginLeft: -MARK / 2,
    backgroundColor: C.gold, borderWidth: 2, borderColor: C.bg,
  },
  dbValue: { width: 84, textAlign: 'right', fontFamily: F.regular, fontSize: 13, color: C.inkSoft },

  barRow: { flexDirection: 'row', alignItems: 'center', gap: S.sm },
  barLabel: { width: 88, fontFamily: F.light, fontSize: 14, color: C.inkSoft },
  barTrack: { flex: 1, height: 6 },
  bar: { height: 6, borderRadius: 3, backgroundColor: C.gold, opacity: 0.85 },
  barValue: { width: 24, textAlign: 'right', fontFamily: F.regular, fontSize: 13, color: C.inkSoft },

  pathRow: { flexDirection: 'row', gap: 2 },
  seg: { flex: 1, height: 6, borderRadius: 3, backgroundColor: C.line },
  segOn: { backgroundColor: C.gold },
});
