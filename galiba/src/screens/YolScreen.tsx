import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Rich } from '../components/Rich';
import { Button, Eyebrow } from '../components/ui';
import { PRINCIPLES, PROGRAM } from '../content/program';
import { useStore } from '../store/useStore';
import { C, F, S, type } from '../theme/tokens';
import { useT } from '../i18n';
import { LangToggle } from '../components/LangToggle';

// 21 günlük yol. Seri sayacı yok; yalnızca hangi günlerden geçtiğin.
export function YolScreen() {
  const insets = useSafeAreaInsets();
  const { doneDays, toggleDay } = useStore();
  const { t, lang } = useT();
  const [open, setOpen] = useState<number | null>(null);

  return (
    <ScrollView contentContainerStyle={[styles.wrap, { paddingTop: insets.top + S.lg }]} showsVerticalScrollIndicator={false}>
      <Eyebrow>{t('yol.eyebrow', { n: doneDays.length })}</Eyebrow>
      <Rich style={[type.display, { marginTop: S.sm }]}>{t('yol.title')}</Rich>
      <Text style={[type.body, { marginTop: S.sm }]}>{t('yol.sub')}</Text>

      {PROGRAM[lang].map(week => (
        <View key={week.n} style={{ marginTop: S.xxl }}>
          <Eyebrow>{t('yol.week', { n: week.n })}</Eyebrow>
          <Rich style={[type.title, { marginTop: S.xs }]}>{week.title}</Rich>
          <Text style={[type.small, { marginTop: S.xs }]}>{week.sub}</Text>

          <View style={{ marginTop: S.md }}>
            {week.days.map(d => {
              const done = doneDays.includes(d.n);
              const isOpen = open === d.n;
              return (
                <View key={d.n} style={styles.day}>
                  <Pressable style={styles.dayRow} onPress={() => setOpen(isOpen ? null : d.n)}>
                    <Text style={[styles.dayN, done && { color: C.gold }]}>{done ? '✓' : String(d.n).padStart(2, '0')}</Text>
                    <Text style={[styles.dayIdea, done && !isOpen && { color: C.inkMuted }]}>{d.idea}</Text>
                  </Pressable>
                  {isOpen && (
                    <View style={styles.dayBody}>
                      <Text style={[type.body, { color: C.ink }]}>{d.question}</Text>
                      <Text style={[type.body, { marginTop: S.sm }]}>{d.try}</Text>
                      <Button
                        quiet={done}
                        label={done ? t('yol.undo') : t('yol.tried')}
                        onPress={() => {
                          Haptics.selectionAsync().catch(() => {});
                          toggleDay(d.n);
                          if (!done) setOpen(null);
                        }}
                        style={{ marginTop: S.md, alignSelf: 'flex-start' }}
                      />
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </View>
      ))}

      <View style={{ marginTop: S.xxl }}>
        <Eyebrow>{t('yol.principles')}</Eyebrow>
        {PRINCIPLES[lang].map(p => (
          <View key={p.title} style={{ marginTop: S.md }}>
            <Text style={[type.body, { color: C.ink }]}>{p.title}</Text>
            <Text style={type.small}>{p.sub}</Text>
          </View>
        ))}
      </View>
      <View style={styles.lang}>
        <Eyebrow>{t('lang.label')}</Eyebrow>
        <LangToggle />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: S.lg, paddingBottom: S.xxl, maxWidth: 520, width: '100%', alignSelf: 'center' },
  lang: { marginTop: S.xxl, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  day: { borderBottomWidth: 1, borderColor: C.line },
  dayRow: { flexDirection: 'row', gap: S.md, paddingVertical: 14, alignItems: 'baseline' },
  dayN: { width: 24, fontFamily: F.regular, fontSize: 13, color: C.inkMuted },
  dayIdea: { flex: 1, fontFamily: F.light, fontSize: 17, lineHeight: 24, color: C.ink },
  dayBody: { paddingLeft: 24 + S.md, paddingBottom: S.md },
});
