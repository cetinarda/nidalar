import React, { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Rich } from '../components/Rich';
import { Button, Eyebrow } from '../components/ui';
import { CHANNEL_COLOR, Convergence, Orb } from '../components/Resonance';
import { Channel, CHANNELS, PLACES, readVerdict, resonance, Scores, VERDICTS } from '../content/rezonans';
import { useStore } from '../store/useStore';
import { useT } from '../i18n';
import { localReply } from '../content/rezonansYanit';

const REZ_URL = process.env.EXPO_PUBLIC_REZONANS_URL || '/api/rezonans';
import { C, F, S, type, upper } from '../theme/tokens';

// Rezonans: fikir → küreye dokun (7 sn) → kalp → beden → zihin → üç yol birleşir → okuma.
type Phase = 'idea' | 'touch' | Channel | 'merge';

const HOLD_MS = 7000;

// Mobil web: uzun basışta yazı seçimi, kopyala menüsü ve kaydırma olmasın.
const NO_SELECT = Platform.OS === 'web'
  ? ({ userSelect: 'none', WebkitUserSelect: 'none', WebkitTouchCallout: 'none', touchAction: 'none' } as any)
  : null;
const ORDER: Channel[] = ['kalp', 'beden', 'zihin'];

export function RezonansSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const insets = useSafeAreaInsets();
  const { saveRezonans } = useStore();
  const { t, lang } = useT();

  const [phase, setPhase] = useState<Phase>('idea');
  const [idea, setIdea] = useState('');
  const [answers, setAnswers] = useState<Partial<Scores>>({});
  const [places, setPlaces] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [holding, setHolding] = useState(false);
  const [hint, setHint] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [saved, setSaved] = useState(false);
  const [answer, setAnswer] = useState('');
  const [reply, setReply] = useState<{ reply: string; step: string } | null>(null);
  const [asking, setAsking] = useState(false);

  const held = useRef(false);
  const prog = useRef(0);
  const lastBeat = useRef(0);

  // Dokunuş döngüsü: basılıyken halka 7 sn'de dolar, bırakınca yavaşça geri çekilir.
  useEffect(() => {
    if (phase !== 'touch') return;
    let raf = 0;
    let last = Date.now();
    const tick = () => {
      const now = Date.now();
      const dt = now - last;
      last = now;
      const before = prog.current;
      prog.current = held.current
        ? Math.min(1, before + dt / HOLD_MS)
        : Math.max(0, before - dt / 1800);
      if (prog.current !== before) setProgress(prog.current);
      // kalp atışı gibi: basılıyken saniyede bir hafif titreşim
      if (held.current && now - lastBeat.current > 1000) {
        lastBeat.current = now;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      }
      if (prog.current >= 1) {
        held.current = false;
        setHolding(false);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
        setTimeout(() => setPhase('kalp'), 700);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  const pressIn = () => {
    held.current = true;
    setHolding(true);
    setHint(false);
  };
  const pressOut = () => {
    if (!held.current) return;
    held.current = false;
    setHolding(false);
    if (prog.current < 1) setHint(true);
  };

  const reset = () => {
    setPhase('idea');
    setIdea('');
    setAnswers({});
    setPlaces([]);
    setProgress(0);
    prog.current = 0;
    setHint(false);
    setRevealed(false);
    setSaved(false);
    setAnswer('');
    setReply(null);
  };

  const close = () => {
    reset();
    onClose();
  };

  const scores = { kalp: answers.kalp ?? 0, beden: answers.beden ?? 0, zihin: answers.zihin ?? 0 };
  const verdict = readVerdict(scores);
  const reading = VERDICTS[lang][verdict];
  const channels = CHANNELS[lang];
  const channelIndex = ORDER.indexOf(phase as Channel);
  const def = channelIndex >= 0 ? channels[channelIndex] : null;
  const chosen = def ? def.options.find(o => o.value === answers[def.key]) : undefined;

  const save = () => {
    saveRezonans({ idea: idea.trim(), ...scores, places, verdict, answer: answer.trim() || undefined, reply: reply ? `${reply.reply} ${reply.step}` : undefined });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    setSaved(true);
  };

  // Okumanın sorusuna cevap → ikinci yanıt. Önce sunucu (Groq), olmazsa cihazdaki kurallı yanıt.
  const respond = async () => {
    const a = answer.trim();
    if (!a) return;
    setAsking(true);
    Haptics.selectionAsync().catch(() => {});
    let out: { reply: string; step: string } | null = null;
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 12000);
      const res = await fetch(REZ_URL, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        signal: ctrl.signal,
        body: JSON.stringify({
          dil: lang, fikir: idea.trim(), kalp: scores.kalp, beden: scores.beden, zihin: scores.zihin,
          beden_yerleri: places, okuma: reading.title.replace(/\*/g, ''), soru: reading.question, cevap: a,
        }),
      });
      clearTimeout(timer);
      if (res.ok) {
        const d = await res.json();
        if (d?.yanit) out = { reply: d.yanit, step: d.adim ?? '' };
      }
    } catch {
      // bağlantı yok ya da anahtar tanımlı değil: cihazda yanıt
    }
    setReply(out ?? localReply(a, lang));
    setAsking(false);
  };

  return (
    <Modal visible={visible} animationType="fade" onRequestClose={close} presentationStyle="fullScreen">
      <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={[styles.wrap, { paddingTop: insets.top + S.md, paddingBottom: insets.bottom + S.xl }]}
          keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} scrollEnabled={phase !== 'touch'}>
          <View style={styles.top}>
            <Eyebrow>{def ? t('rez.step', { name: def.name, n: channelIndex + 1 }) : t('rez.eyebrow')}</Eyebrow>
            <Button quiet label={t('common.close')} onPress={close} />
          </View>

          {(def || phase === 'merge') && (
            <View style={styles.dots}>
              {ORDER.map((k, i) => (
                <View key={k} style={[styles.dot, { backgroundColor: CHANNEL_COLOR[k], opacity: answers[k] !== undefined || i === channelIndex ? 1 : 0.25 }]} />
              ))}
            </View>
          )}

          {phase === 'idea' && (
            <View style={styles.block}>
              <View style={{ alignItems: 'center' }}>
                <Orb progress={0} size={200} />
              </View>
              <Rich style={[type.display, { marginTop: S.md }]}>{t('rez.ideaTitle')}</Rich>
              <Text style={[type.body, { marginTop: S.sm }]}>{t('rez.ideaSub')}</Text>
              <TextInput value={idea} onChangeText={setIdea} placeholder={t('rez.ideaPh')} placeholderTextColor={C.inkMuted}
                multiline style={styles.input} />
              <Button label={t('common.continue')} onPress={() => setPhase('touch')} disabled={!idea.trim()} style={{ marginTop: S.xl }} />
            </View>
          )}

          {phase === 'touch' && (
            <View style={[styles.block, { alignItems: 'center' }]}>
              <Text style={styles.idea}>“{idea.trim()}”</Text>
              <Pressable
                onPressIn={pressIn}
                onPressOut={pressOut}
                accessibilityRole="button"
                accessibilityLabel={t('rez.orb')}
                style={[styles.orbHit, NO_SELECT]}
              >
                <Orb progress={progress} size={280} />
              </Pressable>
              <Rich style={[type.title, { textAlign: 'center' }]}>{t('rez.touchTitle')}</Rich>
              <Text style={[type.body, { textAlign: 'center', marginTop: S.sm }]}>
                {holding ? t('rez.holding') : hint ? t('rez.touchHint') : t('rez.touchSub')}
              </Text>
              <Text style={[type.small, { textAlign: 'center', marginTop: S.lg }]}>{t('rez.touchNote')}</Text>
            </View>
          )}

          {def && (
            <View style={styles.block}>
              <Text style={styles.idea}>“{idea.trim()}”</Text>
              <Rich style={[type.display, { marginTop: S.lg }]}>{def.title}</Rich>
              <Text style={[type.body, { marginTop: S.sm }]}>{def.guide}</Text>
              <View style={{ marginTop: S.lg, gap: S.sm }}>
                {def.options.map(o => {
                  const on = answers[def.key] === o.value;
                  return (
                    <Pressable key={o.value} onPress={() => { Haptics.selectionAsync().catch(() => {}); setAnswers(a => ({ ...a, [def.key]: o.value })); }}
                      style={[styles.chip, on && { borderColor: CHANNEL_COLOR[def.key], backgroundColor: 'rgba(255,255,255,0.03)' }]}>
                      <Text style={[styles.chipText, on && { color: C.ink }]}>{o.label}</Text>
                    </Pressable>
                  );
                })}
              </View>
              {def.key === 'beden' && chosen?.place && (
                <>
                  <Text style={[styles.label, { marginTop: S.lg }]}>{upper(t('rez.where'))}</Text>
                  <View style={styles.places}>
                    {PLACES[lang].map(pl => {
                      const on = places.includes(pl);
                      return (
                        <Pressable key={pl} onPress={() => setPlaces(ps => (on ? ps.filter(x => x !== pl) : [...ps, pl]))}
                          style={[styles.place, on && { borderColor: C.lilac }]}>
                          <Text style={[styles.chipText, { fontSize: 14 }, on && { color: C.ink }]}>{pl}</Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </>
              )}
              <Button
                label={t('common.continue')}
                disabled={answers[def.key] === undefined}
                onPress={() => setPhase(channelIndex < 2 ? ORDER[channelIndex + 1] : 'merge')}
                style={{ marginTop: S.xl }}
              />
            </View>
          )}

          {phase === 'merge' && (
            <View style={styles.block}>
              <Text style={styles.idea}>“{idea.trim()}”</Text>
              <View style={{ alignItems: 'center' }}>
                <Convergence scores={scores} level={resonance(scores)} onDone={() => setTimeout(() => setRevealed(true), 300)} />
              </View>
              {!revealed ? (
                <Text style={[styles.caption]}>{t('rez.merge')}</Text>
              ) : (
                <>
                  <Rich style={type.display}>{reading.title}</Rich>
                  <Text style={[type.body, { marginTop: S.sm }]}>{reading.body}</Text>
                  <View style={{ marginTop: S.lg, gap: S.md }}>
                    {ORDER.map((k, i) => {
                      const c = channels[i];
                      const o = c.options.find(x => x.value === scores[k]);
                      return (
                        <View key={k} style={styles.readRow}>
                          <View style={[styles.readDot, { backgroundColor: CHANNEL_COLOR[k] }]} />
                          <View style={{ flex: 1 }}>
                            <Text style={styles.label}>{upper(c.name)}</Text>
                            <Text style={[type.body, { color: C.ink }]}>
                              {o?.label}{k === 'beden' && places.length ? ` (${places.join(', ')})` : ''}
                            </Text>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                  <Rich style={[type.body, { marginTop: S.lg }]}>{`*${reading.question}*`}</Rich>
                  <TextInput value={answer} onChangeText={setAnswer} placeholder={t('rez.answerPh')} placeholderTextColor={C.inkMuted}
                    multiline editable={!reply} style={[styles.input, { minHeight: 56 }]} />
                  {!reply && (
                    <Button label={asking ? t('rez.answering') : t('rez.answer')} onPress={respond}
                      disabled={!answer.trim() || asking} style={{ marginTop: S.md }} />
                  )}
                  {!reply && <Text style={[type.small, { marginTop: S.sm }]}>{t('rez.aiNote')}</Text>}
                  {reply && (
                    <View style={styles.reply}>
                      <Text style={[type.body, { color: C.ink }]}>{reply.reply}</Text>
                      {!!reply.step && (
                        <>
                          <Text style={[styles.label, { marginTop: S.md }]}>{upper(t('rez.smallStep'))}</Text>
                          <Text style={type.body}>{reply.step}</Text>
                        </>
                      )}
                    </View>
                  )}
                  {saved ? (
                    <Rich style={[type.body, { marginTop: S.xl, textAlign: 'center' }]}>{t('common.addedJournal')}</Rich>
                  ) : (
                    <Button label={t('common.addToJournal')} onPress={save} style={{ marginTop: S.xl }} />
                  )}
                  <Button quiet label={t('rez.again')} onPress={reset} style={{ alignSelf: 'center', marginTop: S.sm }} />
                  <Text style={[type.small, { marginTop: S.md, textAlign: 'center' }]}>{t('rez.note')}</Text>
                </>
              )}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  wrap: { paddingHorizontal: S.lg, maxWidth: 520, width: '100%', alignSelf: 'center', flexGrow: 1 },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dots: { flexDirection: 'row', gap: 8, marginTop: S.sm },
  dot: { width: 8, height: 8, borderRadius: 4 },
  block: { marginTop: S.lg },
  idea: { fontFamily: F.italic, fontSize: 18, lineHeight: 26, color: C.inkSoft, textAlign: 'center' },
  orbHit: { marginVertical: S.lg, borderRadius: 140 },
  input: {
    marginTop: S.lg, minHeight: 72, fontFamily: F.light, fontSize: 18, lineHeight: 27, color: C.ink,
    borderBottomWidth: 1, borderColor: C.lilacSoft, paddingVertical: S.sm, textAlignVertical: 'top', outlineWidth: 0,
  },
  chip: { borderWidth: 1, borderColor: C.line, borderRadius: 14, paddingVertical: 12, paddingHorizontal: S.md },
  chipText: { fontFamily: F.light, fontSize: 16, lineHeight: 23, color: C.inkSoft },
  label: { fontFamily: F.regular, fontSize: 12, letterSpacing: 2, color: C.inkMuted, marginBottom: 2 },
  places: { flexDirection: 'row', flexWrap: 'wrap', gap: S.sm, marginTop: S.sm },
  place: { borderWidth: 1, borderColor: C.line, borderRadius: 999, paddingVertical: 6, paddingHorizontal: 14 },
  caption: { fontFamily: F.italic, fontSize: 22, color: C.ink, textAlign: 'center', marginTop: S.md },
  readRow: { flexDirection: 'row', gap: S.md, alignItems: 'flex-start' },
  reply: { marginTop: S.lg, paddingLeft: S.md, borderLeftWidth: 2, borderColor: C.gold },
  readDot: { width: 10, height: 10, borderRadius: 5, marginTop: 6 },
});
