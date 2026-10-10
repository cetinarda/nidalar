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
import { OyunSheet } from './OyunSheet';
import { PROGRAM } from '../content/program';
import { today, useStore } from '../store/useStore';
import { C, F, S, type } from '../theme/tokens';
import { localeOf, useT } from '../i18n';

function dateLabel() {
  return new Date().toLocaleDateString(localeOf(), { day: 'numeric', month: 'long', weekday: 'long' });
}

export function BugunScreen({ onOpenEsik }: { onOpenEsik: () => void }) {
  const insets = useSafeAreaInsets();
  const { entries, doneDays, game } = useStore();
  const { t, lang } = useT();
  const RITUAL_L = RITUAL[lang];
  const DAYS = PROGRAM[lang].flatMap(w => w.days);
  const [open, setOpen] = useState<RitualStep | null>(null);
  const [nida, setNida] = useState(false);
  const [oyun, setOyun] = useState(false);

  const todays = entries.filter(e => e.kind === 'ritual' && e.date === today());
  const doneSteps = new Set(todays.map(e => (e.kind === 'ritual' ? e.step : '')));
  const day = DAYS.find(d => !doneDays.includes(d.n)) ?? DAYS[DAYS.length - 1];
  const minutes = RITUAL_L.reduce((n, s) => n + s.minutes, 0);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={[styles.wrap, { paddingTop: insets.top + S.lg }]} showsVerticalScrollIndicator={false}>
        <Eyebrow>{dateLabel()}</Eyebrow>
        <View style={{ marginTop: S.sm }}>
          <DayNumbers size="compact" />
        </View>

        <View style={styles.day}>
          <Text style={styles.dayN}>{t('bugun.day', { n: day.n })}</Text>
          <Text style={[type.title, { marginTop: S.xs }]}>{day.idea}</Text>
          <Text style={[type.body, { marginTop: S.sm }]}>{day.question}</Text>
        </View>

        <View style={styles.ritualHead}>
          <Eyebrow>{t('bugun.ritual')}</Eyebrow>
          <Text style={type.small}>{t('bugun.ritualMeta', { done: doneSteps.size, min: minutes })}</Text>
        </View>

        {RITUAL_L.map(step => {
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
              <Text style={type.small}>{t('common.minutes', { n: step.minutes })}</Text>
            </Pressable>
          );
        })}

        {doneSteps.size === 4 && (
          <Rich style={[type.body, { marginTop: S.lg, color: C.ink }]}>
            {t('bugun.allDone')}
          </Rich>
        )}

        <Pressable onPress={() => setNida(true)} style={({ pressed }) => [styles.nida, pressed && { opacity: 0.6 }]}
          accessibilityRole="button">
          <Eyebrow>{t('bugun.nida')}</Eyebrow>
          <Rich style={[styles.stepTitle, { marginTop: S.xs }]}>{t('bugun.nidaTitle')}</Rich>
          <Text style={[type.small, { marginTop: 2 }]}>{t('bugun.nidaSub')}</Text>
        </Pressable>

        <Pressable onPress={() => setOyun(true)} style={({ pressed }) => [styles.oyun, pressed && { opacity: 0.6 }]}
          accessibilityRole="button">
          <Eyebrow>{t('bugun.game')}</Eyebrow>
          <Rich style={[styles.stepTitle, { marginTop: S.xs }]}>{t('bugun.gameTitle')}</Rich>
          <Text style={[type.small, { marginTop: 2 }]}>
            {t('bugun.gameSub') + (game.best ? t('bugun.gameBest', { n: game.best }) : '')}
          </Text>
        </Pressable>

        <Pressable onPress={onOpenEsik} style={{ marginTop: S.xxl, alignSelf: 'center' }}>
          <Text style={type.small}>{t('bugun.reopen')}</Text>
        </Pressable>
      </ScrollView>

      <RitualSheet step={open} onClose={() => setOpen(null)} />
      <NidaSheet visible={nida} onClose={() => setNida(false)} />
      <OyunSheet visible={oyun} onClose={() => setOyun(false)} />
    </View>
  );
}

function RitualSheet({ step, onClose }: { step: RitualStep | null; onClose: () => void }) {
  const insets = useSafeAreaInsets();
  const { entries, saveRitual } = useStore();
  const { t } = useT();
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
            <Eyebrow>{t('ritual.step', { n: step.n }) + (step.key === 'beden' ? t('ritual.tag') : '')}</Eyebrow>
            <Button quiet label={t('common.close')} onPress={onClose} />
          </View>
          <Art name={step.art} height={200} cue={step.key === 'beden'} />
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
              {t('ritual.note')}
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
  oyun: { paddingVertical: S.lg, borderBottomWidth: 1, borderColor: C.line },
  nida: { marginTop: S.xl, paddingVertical: S.lg, borderTopWidth: 1, borderBottomWidth: 1, borderColor: C.line },
  sheetTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  input: {
    marginTop: S.sm, minHeight: 96, fontFamily: F.light, fontSize: 17, lineHeight: 26, color: C.ink,
    borderBottomWidth: 1, borderColor: C.lilacSoft, paddingVertical: S.sm, textAlignVertical: 'top', outlineWidth: 0,
  },
});
