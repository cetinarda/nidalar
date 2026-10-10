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

// İhtimal Aynası: her ekranda tek soru.
// düşünce → inanç → ihtimaller → gözlem → yeniden inanç → köprü cümle
type Step = 0 | 1 | 2 | 3 | 4 | 5;

export function AynaScreen() {
  const insets = useSafeAreaInsets();
  const { saveAyna } = useStore();
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

  const parts = useMemo(() => splitCertainty(thought), [thought]);
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
          <Eyebrow>{`İhtimal aynası · ${step + 1}/6`}</Eyebrow>
          {step > 0 && <Button quiet label="Baştan" onPress={reset} />}
        </View>

        {step === 0 && (
          <>
            <Art name="mirror" height={170} />
            <Rich style={type.display}>{'Seni zorlayan *düşünce* ne?'}</Rich>
            <TextInput
              value={thought}
              onChangeText={setThought}
              placeholder="Arkadaşım cevap vermedi. Beni hiç önemsemiyor."
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
                  {hits} kesinlik kelimesi. Yanlış oldukları anlamına gelmez. Ne kadarı gözlem, ne kadarı yorum?
                </Text>
              </View>
            )}
            <Button label="Devam" onPress={next} disabled={!thought.trim()} style={styles.cta} />
          </>
        )}

        {step === 1 && (
          <>
            <Rich style={type.display}>{'Bu düşünceye ne kadar *inanıyorsun?*'}</Rich>
            <Text style={[type.small, styles.quote]}>“{thought.trim()}”</Text>
            <View style={{ marginTop: S.xl }}>
              <BeliefPicker value={before} onChange={setBefore} />
            </View>
            <Button label="Devam" onPress={next} style={styles.cta} />
          </>
        )}

        {step === 2 && (
          <>
            <Rich style={type.display}>{'Başka hangi *ihtimaller* var?'}</Rich>
            <Text style={[type.body, { marginTop: S.sm }]}>Doğru olduklarına inanman gerekmiyor. Sadece masaya koy.</Text>
            <View style={{ marginTop: S.lg, gap: S.sm }}>
              {ALTERNATIVES.map(a => {
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
              placeholder="Kendi ihtimalin…"
              placeholderTextColor={C.inkMuted}
              style={[styles.input, { minHeight: 48 }]}
            />
            <Button label="Devam" onPress={next} disabled={alts.length === 0 && !own.trim()} style={styles.cta} />
          </>
        )}

        {step === 3 && (
          <>
            <Rich style={type.display}>{'Hangi gözlem *fikrini değiştirirdi?*'}</Rich>
            <TextInput
              value={evidence}
              onChangeText={setEvidence}
              placeholder="Yarın kendiliğinden yazarsa…"
              placeholderTextColor={C.inkMuted}
              multiline
              style={styles.input}
            />
            <Pressable onPress={() => setFirstRight(v => !v)} style={[styles.chip, firstRight && styles.chipOn, { marginTop: S.lg }]}>
              <Text style={[styles.chipText, firstRight && { color: C.ink }]}>İlk okumam galiba doğru.</Text>
            </Pressable>
            {firstRight && (
              <Text style={[type.small, { marginTop: S.sm }]}>
                Bu da bir sonuç. Anlamak mazur görmek değildir; sınırını korumak da esnek düşünmenin parçası.
              </Text>
            )}
            <Button label="Devam" onPress={next} style={styles.cta} />
          </>
        )}

        {step === 4 && (
          <>
            <Rich style={type.display}>{'Şimdi ne kadar *inanıyorsun?*'}</Rich>
            <Text style={[type.small, styles.quote]}>“{thought.trim()}”</Text>
            <View style={{ marginTop: S.xl }}>
              <BeliefPicker value={after} onChange={setAfter} />
            </View>
            <Text style={[type.small, { marginTop: S.md }]}>Değişmemesi de bir cevap. Dürüst olan sayı, doğru sayıdır.</Text>
            <Button label="Devam" onPress={next} style={styles.cta} />
          </>
        )}

        {step === 5 && (
          <>
            <Rich style={type.display}>{after < before ? 'Bir ihtimal *daha var.*' : 'Bakmak da *bir adım.*'}</Rich>
            <View style={{ marginTop: S.xl }}>
              <BeliefDelta before={before} after={after} />
            </View>
            <Text style={[type.body, { marginTop: S.xl, color: C.ink }]}>İnanabileceğin bir köprü cümle seç:</Text>
            <View style={{ marginTop: S.sm, gap: S.sm }}>
              {BRIDGES.map(b => (
                <Pressable key={b} onPress={() => setBridge(b)} style={[styles.chip, bridge === b && styles.chipOn]}>
                  <Text style={[styles.chipText, bridge === b && { color: C.ink }]}>{b}</Text>
                </Pressable>
              ))}
            </View>
            {saved ? (
              <>
                <Rich style={[type.body, { marginTop: S.xl, textAlign: 'center' }]}>{'Deftere eklendi. *Galiba.*'}</Rich>
                <Button quiet label="Yeni bir düşünce" onPress={reset} style={{ alignSelf: 'center' }} />
              </>
            ) : (
              <Button label="Deftere ekle" onPress={save} style={styles.cta} />
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
