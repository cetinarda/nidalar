import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Art } from '../components/Art';
import { Rich } from '../components/Rich';
import { BeliefDelta, BeliefPicker } from '../components/Belief';
import { Button, Eyebrow } from '../components/ui';
import { ALTERNATIVES, BRIDGES, splitCertainty } from '../content/ayna';
import { useStore } from '../store/useStore';
import { C, F, S, type } from '../theme/tokens';
import { useT } from '../i18n';

// İhtimal Aynası: her ekranda tek soru.
// düşünce → inanç → ihtimaller → gözlem → yeniden inanç → köprü cümle
type Step = 0 | 1 | 2 | 3 | 4 | 5;

export function AynaScreen() {
  const insets = useSafeAreaInsets();
  const { saveAyna } = useStore();
  const { t, lang } = useT();
  const [step, setStep] = useState<Step>(0);
  const [thought, setThought] = useState('');
  const [before, setBefore] = useState(80);
  const [after, setAfter] = useState(80);
  const [alts, setAlts] = useState<string[]>([]);
  const [own, setOwn] = useState('');
  const [evidence, setEvidence] = useState('');
  const [firstRight, setFirstRight] = useState(false);
  const [bridge, setBridge] = useState('');
  const [saved, setSaved] = useState(false);

  const parts = useMemo(() => splitCertainty(thought, lang), [thought, lang]);
  const hits = parts.filter(p => p.hit).length;

  const reset = () => {
    setStep(0); setThought(''); setBefore(80); setAfter(80); setAlts([]); setOwn('');
    setEvidence(''); setFirstRight(false); setBridge(''); setSaved(false);
  };

  const next = () => {
    Haptics.selectionAsync().catch(() => {});
    if (step === 3) setAfter(before);
    setStep(s => Math.min(5, s + 1) as Step);
  };

  const toggleAlt = (a: string) =>
    setAlts(prev => (prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]));

  const save = () => {
    saveAyna({
      thought: thought.trim(),
      before,
      after,
      alternatives: [...alts, ...(own.trim() ? [own.trim()] : [])],
      bridge,
      firstReadRight: firstRight,
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    setSaved(true);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={[styles.wrap, { paddingTop: insets.top + S.lg }]}
        keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.top}>
          <Eyebrow>{t('ayna.eyebrow', { n: step + 1 })}</Eyebrow>
          {step > 0 && <Button quiet label={t('ayna.restart')} onPress={reset} />}
        </View>

        {step === 0 && (
          <>
            <Art name="mirror" height={170} />
            <Rich style={type.display}>{t('ayna.q1')}</Rich>
            <TextInput
              value={thought}
              onChangeText={setThought}
              placeholder={t('ayna.q1ph')}
              placeholderTextColor={C.inkMuted}
              multiline
              style={styles.input}
            />
            {hits > 0 && (
              <View style={styles.detector}>
                <Text style={type.body}>
                  {parts.map((p, i) =>
                    p.hit ? <Text key={i} style={styles.hit}>{p.t}</Text> : <Text key={i}>{p.t}</Text>,
                  )}
                </Text>
                <Text style={[type.small, { marginTop: S.sm }]}>
                  {t('ayna.hits', { n: hits })}
                </Text>
              </View>
            )}
            <Button label={t('common.continue')} onPress={next} disabled={!thought.trim()} style={styles.cta} />
          </>
        )}

        {step === 1 && (
          <>
            <Rich style={type.display}>{t('ayna.q2')}</Rich>
            <Text style={[type.small, styles.quote]}>“{thought.trim()}”</Text>
            <View style={{ marginTop: S.xl }}>
              <BeliefPicker value={before} onChange={setBefore} />
            </View>
            <Button label={t('common.continue')} onPress={next} style={styles.cta} />
          </>
        )}

        {step === 2 && (
          <>
            <Rich style={type.display}>{t('ayna.q3')}</Rich>
            <Text style={[type.body, { marginTop: S.sm }]}>{t('ayna.q3sub')}</Text>
            <View style={{ marginTop: S.lg, gap: S.sm }}>
              {ALTERNATIVES[lang].map(a => {
                const on = alts.includes(a);
                return (
                  <Pressable key={a} onPress={() => toggleAlt(a)} style={[styles.chip, on && styles.chipOn]}>
                    <Text style={[styles.chipText, on && { color: C.ink }]}>{a}</Text>
                  </Pressable>
                );
              })}
            </View>
            <TextInput
              value={own}
              onChangeText={setOwn}
              placeholder={t('ayna.own')}
              placeholderTextColor={C.inkMuted}
              style={[styles.input, { minHeight: 48 }]}
            />
            <Button label={t('common.continue')} onPress={next} disabled={alts.length === 0 && !own.trim()} style={styles.cta} />
          </>
        )}

        {step === 3 && (
          <>
            <Rich style={type.display}>{t('ayna.q4')}</Rich>
            <TextInput
              value={evidence}
              onChangeText={setEvidence}
              placeholder={t('ayna.q4ph')}
              placeholderTextColor={C.inkMuted}
              multiline
              style={styles.input}
            />
            <Pressable onPress={() => setFirstRight(v => !v)} style={[styles.chip, firstRight && styles.chipOn, { marginTop: S.lg }]}>
              <Text style={[styles.chipText, firstRight && { color: C.ink }]}>{t('ayna.firstRight')}</Text>
            </Pressable>
            {firstRight && (
              <Text style={[type.small, { marginTop: S.sm }]}>
                {t('ayna.firstRightNote')}
              </Text>
            )}
            <Button label={t('common.continue')} onPress={next} style={styles.cta} />
          </>
        )}

        {step === 4 && (
          <>
            <Rich style={type.display}>{t('ayna.q5')}</Rich>
            <Text style={[type.small, styles.quote]}>“{thought.trim()}”</Text>
            <View style={{ marginTop: S.xl }}>
              <BeliefPicker value={after} onChange={setAfter} />
            </View>
            <Text style={[type.small, { marginTop: S.md }]}>{t('ayna.q5note')}</Text>
            <Button label={t('common.continue')} onPress={next} style={styles.cta} />
          </>
        )}

        {step === 5 && (
          <>
            <Rich style={type.display}>{after < before ? t('ayna.endSoft') : t('ayna.endSame')}</Rich>
            <View style={{ marginTop: S.xl }}>
              <BeliefDelta before={before} after={after} />
            </View>
            <Text style={[type.body, { marginTop: S.xl, color: C.ink }]}>{t('ayna.bridge')}</Text>
            <View style={{ marginTop: S.sm, gap: S.sm }}>
              {BRIDGES[lang].map(b => (
                <Pressable key={b} onPress={() => setBridge(b)} style={[styles.chip, bridge === b && styles.chipOn]}>
                  <Text style={[styles.chipText, bridge === b && { color: C.ink }]}>{b}</Text>
                </Pressable>
              ))}
            </View>
            {saved ? (
              <>
                <Rich style={[type.body, { marginTop: S.xl, textAlign: 'center' }]}>{t('common.addedJournal')}</Rich>
                <Button quiet label={t('ayna.new')} onPress={reset} style={{ alignSelf: 'center' }} />
              </>
            ) : (
              <Button label={t('common.addToJournal')} onPress={save} style={styles.cta} />
            )}
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: S.lg, paddingBottom: S.xxl, maxWidth: 520, width: '100%', alignSelf: 'center' },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', minHeight: 36 },
  input: {
    marginTop: S.lg, minHeight: 88, fontFamily: F.light, fontSize: 18, lineHeight: 27, color: C.ink,
    borderBottomWidth: 1, borderColor: C.lilacSoft, paddingVertical: S.sm, textAlignVertical: 'top', outlineWidth: 0,
  },
  detector: { marginTop: S.lg },
  hit: { color: C.gold, textDecorationLine: 'underline', textDecorationColor: C.gold },
  quote: { marginTop: S.md, fontStyle: 'italic' },
  chip: { borderWidth: 1, borderColor: C.line, borderRadius: 14, paddingVertical: 12, paddingHorizontal: S.md },
  chipOn: { borderColor: C.gold, backgroundColor: 'rgba(242,193,78,0.06)' },
  chipText: { fontFamily: F.light, fontSize: 16, lineHeight: 23, color: C.inkSoft },
  cta: { marginTop: S.xl },
});
