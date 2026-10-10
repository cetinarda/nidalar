import React from 'react';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BeliefDelta } from '../components/Belief';
import { Rich } from '../components/Rich';
import { Eyebrow } from '../components/ui';
import { RITUAL } from '../content/ritual';
import { Entry, useStore } from '../store/useStore';
import { C, F, S, type } from '../theme/tokens';

// Defter: kişisel kayıtlar yalnızca bu cihazda saklanır.
export function DefterScreen() {
  const insets = useSafeAreaInsets();
  const { entries, remove } = useStore();
  const aynas = entries.filter(e => e.kind === 'ayna');
  const avg = aynas.length
    ? Math.round(aynas.reduce((n, e) => n + (e.kind === 'ayna' ? e.before - e.after : 0), 0) / aynas.length)
    : null;

  const confirmRemove = (e: Entry) => {
    if (Platform.OS === 'web') return remove(e.id);
    Alert.alert('Silinsin mi?', undefined, [
      { text: 'Vazgeç', style: 'cancel' },
      { text: 'Sil', style: 'destructive', onPress: () => remove(e.id) },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={[styles.wrap, { paddingTop: insets.top + S.lg }]} showsVerticalScrollIndicator={false}>
      <Eyebrow>Defter</Eyebrow>
      <Rich style={[type.display, { marginTop: S.sm }]}>{'Düşüncenin *izleri.*'}</Rich>

      {avg !== null && (
        <View style={styles.stat}>
          <Text style={styles.statN}>{avg > 0 ? `−${avg}` : avg === 0 ? '0' : `+${-avg}`}</Text>
          <Text style={type.small}>
            {`${aynas.length} aynada, kesinliğin ortalama ${Math.abs(avg)} puan ${avg >= 0 ? 'yumuşadı' : 'arttı'}.`}
          </Text>
        </View>
      )}

      {entries.length === 0 && (
        <Text style={[type.body, { marginTop: S.xl }]}>
          Henüz boş. Bir ritüel adımı ya da bir ayna burada iz bırakır. Kayıtların yalnızca bu cihazda kalır.
        </Text>
      )}

      {entries.map(e => (
        <Pressable key={e.id} onLongPress={() => confirmRemove(e)} style={styles.entry}>
          <Text style={styles.meta}>
            {new Date(e.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}
            {'  ·  '}
            {e.kind === 'ayna' ? 'Ayna' : RITUAL.find(r => r.key === e.step)?.title.replace(/\*/g, '')}
          </Text>
          {e.kind === 'ayna' ? (
            <>
              <Text style={[type.body, { color: C.ink, marginTop: S.xs }]}>“{e.thought}”</Text>
              <View style={{ marginTop: S.sm }}>
                <BeliefDelta before={e.before} after={e.after} compact />
              </View>
              {!!e.bridge && <Rich style={[type.small, { marginTop: S.sm }]}>{`*${e.bridge}*`}</Rich>}
            </>
          ) : (
            <Text style={[type.body, { marginTop: S.xs }]}>{e.text || '—'}</Text>
          )}
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: S.lg, paddingBottom: S.xxl, maxWidth: 520, width: '100%', alignSelf: 'center' },
  stat: { marginTop: S.xl, paddingVertical: S.lg, borderTopWidth: 1, borderBottomWidth: 1, borderColor: C.line },
  statN: { fontFamily: F.serif, fontSize: 48, color: C.gold },
  entry: { paddingVertical: S.lg, borderBottomWidth: 1, borderColor: C.line },
  meta: { fontFamily: F.regular, fontSize: 12, letterSpacing: 1.5, color: C.inkMuted, textTransform: 'uppercase' },
});
