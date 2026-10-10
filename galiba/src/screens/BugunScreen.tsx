import React, { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Art } from '../components/Art';
import { DayNumbers } from '../components/DayNumbers';
import { Rich } from '../components/Rich';
import { Button, Eyebrow } from '../components/ui';
import { RITUAL, RitualStep } from '../content/ritual';
import { NidaSheet } from './NidaSheet';
import { PROGRAM } from '../content/program';
import { today, useStore } from '../store/useStore';
import { C, F, S, type } from '../theme/tokens';

const DAYS = PROGRAM.flatMap(w => w.days);

function dateLabel() {
  return new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'long' });
}

export function BugunScreen({ onOpenEsik }: { onOpenEsik: () => void }) {
  const insets = useSafeAreaInsets();
  const { entries, doneDays } = useStore();
  const [open, setOpen] = useState<RitualStep | null>(null);
  const [nida, setNida] = useState(false);

  const todays = entries.filter(e => e.kind === 'ritual' && e.date === today());
  const doneSteps = new Set(todays.map(e => (e.kind === 'ritual' ? e.step : '')));
  const day = DAYS.find(d => !doneDays.includes(d.n)) ?? DAYS[DAYS.length - 1];
  const minutes = RITUAL.reduce((n, s) => n + s.minutes, 0);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={[styles.wrap, { paddingTop: insets.top + S.lg }]} showsVerticalScrollIndicator={false}>
        <Eyebrow>{dateLabel()}</Eyebrow>
        <View style={{ marginTop: S.sm }}>
          <DayNumbers size="compact" />
        </View>

        <View style={styles.day}>
          <Text style={styles.dayN}>Gün {day.n} / 21</Text>
          <Text style={[type.title, { marginTop: S.xs }]}>{day.idea}</Text>
          <Text style={[type.body, { marginTop: S.sm }]}>{day.question}</Text>
        </View>

        <View style={styles.ritualHead}>
          <Eyebrow>Ritüel</Eyebrow>
          <Text style={type.small}>{doneSteps.size}/4 · {minutes} dk</Text>
        </View>

        {RITUAL.map(step => {
          const done = doneSteps.has(step.key);
          return (
            <Pressable
              key={step.key}
              onPress={() => setOpen(step)}
              style={({ pressed }) => [styles.step, pressed && { opacity: 0.6 }]}
              accessibilityRole="button"
            >
              <Text style={[styles.stepN, done && { color: C.gold }]}>{done ? '✓' : step.n}</Text>
              <Rich style={[styles.stepTitle, done && { color: C.inkMuted }]}>{step.title}</Rich>
              <Text style={type.small}>{step.minutes} dk</Text>
            </Pressable>
          );
        })}

        {doneSteps.size === 4 && (
          <Rich style={[type.body, { marginTop: S.lg, color: C.ink }]}>
            {'İç ve dış *“evet”*. Bugünlük bu kadar yeter.'}
          </Rich>
        )}

        <Pressable onPress={() => setNida(true)} style={({ pressed }) => [styles.nida, pressed && { opacity: 0.6 }]}
          accessibilityRole="button">
          <Eyebrow>Nida</Eyebrow>
          <Rich style={[styles.stepTitle, { marginTop: S.xs }]}>{'Bir *nida* gelsin.'}</Rich>
          <Text style={[type.small, { marginTop: 2 }]}>Senin kelimelerine yakın bir söz; anlamını sen ver.</Text>
        </Pressable>

        <Pressable onPress={onOpenEsik} style={{ marginTop: S.xxl, alignSelf: 'center' }}>
          <Text style={type.small}>Eşik serisini yeniden aç  →</Text>
        </Pressable>
      </ScrollView>

      <RitualSheet step={open} onClose={() => setOpen(null)} />
      <NidaSheet visible={nida} onClose={() => setNida(false)} />
    </View>
  );
}

function RitualSheet({ step, onClose }: { step: RitualStep | null; onClose: () => void }) {
  const insets = useSafeAreaInsets();
  const { entries, saveRitual } = useStore();
  const existing = step
    ? entries.find(e => e.kind === 'ritual' && e.step === step.key && e.date === today())
    : undefined;
  const [text, setText] = useState('');

  React.useEffect(() => {
    setText(existing && existing.kind === 'ritual' ? existing.text : '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step?.key]);

  if (!step) return null;

  const save = () => {
    saveRitual(step.key, text);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    onClose();
  };

  return (
    <Modal visible animationType="slide" onRequestClose={onClose} presentationStyle="pageSheet">
      <KeyboardAvoidingView style={styles.sheet} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={[styles.wrap, { paddingTop: S.lg, paddingBottom: insets.bottom + S.xl }]}
          keyboardShouldPersistTaps="handled">
          <View style={styles.sheetTop}>
            <Eyebrow>{`Adım ${step.n}${step.key === 'beden' ? ' · ritüel' : ''}`}</Eyebrow>
            <Button quiet label="Kapat" onPress={onClose} />
          </View>
          <Art name={step.art} height={200} />
          <Rich style={[type.display, { marginTop: S.md }]}>{step.title}</Rich>
          <Text style={[type.body, { marginTop: S.md }]}>{step.guide}</Text>
          <Text style={[type.body, { marginTop: S.lg, color: C.ink }]}>{step.prompt}</Text>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder={step.placeholder}
            placeholderTextColor={C.inkMuted}
            multiline
            style={styles.input}
          />
          <Button label={step.yes} onPress={save} style={{ marginTop: S.lg }} />
          {step.key === 'beden' && (
            <Text style={[type.small, { marginTop: S.md, textAlign: 'center' }]}>
              Bu bir imgeleme pratiği; dikkatini toplar, bilim iddiası taşımaz.
            </Text>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: S.lg, paddingBottom: S.xxl, maxWidth: 520, width: '100%', alignSelf: 'center' },
  day: { marginTop: S.xl, paddingVertical: S.lg, borderTopWidth: 1, borderBottomWidth: 1, borderColor: C.line },
  dayN: { fontFamily: F.regular, fontSize: 13, letterSpacing: 2, color: C.gold },
  ritualHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: S.xl, marginBottom: S.sm },
  step: { flexDirection: 'row', alignItems: 'center', gap: S.md, paddingVertical: S.md, borderBottomWidth: 1, borderColor: C.line },
  stepN: { width: 24, fontFamily: F.regular, fontSize: 14, color: C.inkMuted },
  stepTitle: { flex: 1, fontFamily: F.light, fontSize: 20, color: C.ink },
  sheet: { flex: 1, backgroundColor: C.bg },
  nida: { marginTop: S.xl, paddingVertical: S.lg, borderTopWidth: 1, borderBottomWidth: 1, borderColor: C.line },
  sheetTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  input: {
    marginTop: S.sm, minHeight: 96, fontFamily: F.light, fontSize: 17, lineHeight: 26, color: C.ink,
    borderBottomWidth: 1, borderColor: C.lilacSoft, paddingVertical: S.sm, textAlignVertical: 'top', outlineWidth: 0,
  },
});
