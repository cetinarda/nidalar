import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Rich } from '../components/Rich';
import { Button, Eyebrow } from '../components/ui';
import { CLOSINGS, isReverse, makePath, makeSky, MIN_SPAN, nextSpan, ROUNDS } from '../content/oyun';
import { useStore } from '../store/useStore';
import { C, F, S, type } from '../theme/tokens';
import { useT } from '../i18n';

// Işık Yolu: yıldızlar nefes ritminde sırayla yanar, kullanıcı aynı yolu çizer.
// intro → nefes → izle → çiz → tur sonu → … → bitiş
type Phase = 'intro' | 'breath' | 'show' | 'play' | 'done' | 'end';

const STEP_MS = 950;
const native = Platform.OS !== 'web';

export function OyunSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const insets = useSafeAreaInsets();
  const { game, saveGame } = useStore();
  const { t, lang } = useT();

  const [phase, setPhase] = useState<Phase>('intro');
  const [round, setRound] = useState(0);
  const [span, setSpan] = useState(MIN_SPAN);
  const [seed, setSeed] = useState(1);
  const [shown, setShown] = useState(-1);
  const [tapped, setTapped] = useState<number[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [wrong, setWrong] = useState<number | null>(null);
  const [hint, setHint] = useState<number | null>(null);
  const [longest, setLongest] = useState(0);
  const [message, setMessage] = useState('');
  const [board, setBoard] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const sky = useMemo(() => makeSky(seed), [seed]);
  const path = useMemo(() => makePath(sky, span, seed), [sky, span, seed]);
  const reverse = isReverse(round, span);
  const expected = reverse ? [...path].reverse() : path;

  const later = (fn: () => void, ms: number) => timers.current.push(setTimeout(fn, ms));
  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => clearTimers, []);

  // Nefes halkası
  const ring = useRef(new Animated.Value(0)).current;
  // İpucu nabzı
  const pulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(pulse, { toValue: 1, duration: 900, easing: Easing.inOut(Easing.sin), useNativeDriver: native }),
      Animated.timing(pulse, { toValue: 0, duration: 900, easing: Easing.inOut(Easing.sin), useNativeDriver: native }),
    ]));
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const startRound = (r: number, nextSpanValue: number) => {
    clearTimers();
    setRound(r);
    setSpan(nextSpanValue);
    setSeed(Date.now() % 100000);
    setTapped([]);
    setMistakes(0);
    setWrong(null);
    setHint(null);
    setShown(-1);
    setPhase('breath');
    ring.setValue(0);
    AccessibilityInfo.isReduceMotionEnabled().catch(() => false).then(reduce => {
      Animated.timing(ring, {
        toValue: 1, duration: reduce ? 0 : 3600, easing: Easing.inOut(Easing.sin), useNativeDriver: native,
      }).start();
    });
    later(() => setPhase('show'), 3800);
  };

  // İzle: yıldızlar sırayla yanar.
  useEffect(() => {
    if (phase !== 'show') return;
    for (let i = 0; i < span; i++) {
      later(() => {
        setShown(i);
        Haptics.selectionAsync().catch(() => {});
      }, 400 + i * STEP_MS);
    }
    later(() => {
      setShown(-1);
      setPhase('play');
    }, 400 + span * STEP_MS + 600);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const begin = () => {
    setLongest(0);
    startRound(0, Math.max(MIN_SPAN, game.lastSpan - 1));
  };

  const finishRound = (m: number) => {
    const ns = nextSpan(span, m);
    if (m <= 1) setLongest(l => Math.max(l, span));
    setMessage(
      m === 0 ? (ns > span ? t('oyun.done0up') : t('oyun.done0'))
        : m === 1 ? t('oyun.done1')
          : t('oyun.done2'),
    );
    setPhase('done');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    later(() => {
      if (round + 1 >= ROUNDS) {
        const best = Math.max(longest, m <= 1 ? span : 0);
        saveGame(best, ns);
        setPhase('end');
      } else {
        startRound(round + 1, ns);
      }
    }, 1900);
  };

  const tap = (id: number) => {
    if (phase !== 'play' || tapped.includes(id)) return;
    const want = expected[tapped.length];
    if (id === want) {
      Haptics.selectionAsync().catch(() => {});
      const next = [...tapped, id];
      setTapped(next);
      setHint(null);
      if (next.length === expected.length) finishRound(mistakes);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      setMistakes(m => m + 1);
      setWrong(id);
      setHint(want);
      later(() => setWrong(null), 600);
    }
  };

  const close = () => {
    clearTimers();
    setPhase('intro');
    onClose();
  };

  // Çizgiler: izlerken yolun yanan kısmı, çizerken dokunulan sıra.
  const litIds = phase === 'show' ? path.slice(0, shown + 1) : phase === 'play' || phase === 'done' ? tapped : [];
  const lineIds = phase === 'done' ? expected : litIds;
  const pos = (id: number) => ({ x: sky[id].x * board, y: sky[id].y * board });

  const caption =
    phase === 'breath' ? t('oyun.breath')
      : phase === 'show' ? t('oyun.watch')
        : phase === 'play' ? (reverse ? t('oyun.reverse') : t('oyun.draw'))
          : message;

  return (
    <Modal visible={visible} animationType="fade" onRequestClose={close} presentationStyle="fullScreen">
      <View style={[styles.root, { paddingTop: insets.top + S.md, paddingBottom: insets.bottom + S.lg }]}>
        <View style={styles.top}>
          <Eyebrow>{phase === 'intro' || phase === 'end' ? t('oyun.eyebrow') : t('oyun.round', { r: round + 1, t: ROUNDS })}</Eyebrow>
          <Button quiet label={t('common.close')} onPress={close} />
        </View>

        {phase === 'intro' && (
          <View style={styles.center}>
            <Rich style={type.display}>{t('oyun.title')}</Rich>
            <Text style={[type.body, { marginTop: S.md }]}>
              {t('oyun.p1')}
            </Text>
            <Text style={[type.body, { marginTop: S.sm }]}>
              {t('oyun.p2')}
            </Text>
            <Text style={[type.small, { marginTop: S.lg }]}>
              {t('oyun.meta', { r: ROUNDS }) + (game.best ? t('oyun.best', { n: game.best }) : '')}
            </Text>
            <Button label={t('oyun.start')} onPress={begin} style={{ marginTop: S.xl }} />
          </View>
        )}

        {phase === 'end' && (
          <View style={styles.center}>
            <Rich style={type.display}>{t('oyun.endTitle')}</Rich>
            <Text style={styles.big}>{longest || '—'}</Text>
            <Text style={type.small}>{longest ? t('oyun.endLong') : t('oyun.endShort')}</Text>
            <Text style={[type.body, { marginTop: S.lg, color: C.ink }]}>{CLOSINGS[lang][game.plays % CLOSINGS[lang].length]}</Text>
            <Button label={t('oyun.finish')} onPress={close} style={{ marginTop: S.xl }} />
            <Button quiet label={t('oyun.again')} onPress={begin} style={{ alignSelf: 'center', marginTop: S.sm }} />
          </View>
        )}

        {phase !== 'intro' && phase !== 'end' && (
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <View style={styles.board} onLayout={e => setBoard(e.nativeEvent.layout.width)}>
              {board > 0 && (
                <>
                  <Svg width={board} height={board} style={StyleSheet.absoluteFill}>
                    {lineIds.slice(1).map((id, i) => {
                      const a = pos(lineIds[i]);
                      const b = pos(id);
                      return (
                        <React.Fragment key={`${lineIds[i]}-${id}`}>
                          <Line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={C.coral} strokeOpacity={0.18} strokeWidth={8} strokeLinecap="round" />
                          <Line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={C.coral} strokeWidth={2} strokeLinecap="round" />
                        </React.Fragment>
                      );
                    })}
                  </Svg>

                  {sky.map(s => {
                    const p = pos(s.id);
                    const lit = litIds.includes(s.id) || (phase === 'done' && expected.includes(s.id));
                    const current = phase === 'show' && path[shown] === s.id;
                    return (
                      <Pressable
                        key={s.id}
                        onPress={() => tap(s.id)}
                        disabled={phase !== 'play'}
                        accessibilityLabel={t('oyun.star', { n: s.id + 1 })}
                        style={[styles.hit, { left: p.x - 24, top: p.y - 24 }]}
                      >
                        {hint === s.id && (
                          <Animated.View style={[styles.hint, { opacity: pulse }]} />
                        )}
                        {(lit || current) && <View style={[styles.halo, current && styles.haloNow]} />}
                        <View style={[styles.star, lit && styles.starLit, wrong === s.id && styles.starWrong]} />
                      </Pressable>
                    );
                  })}

                  {phase === 'breath' && (
                    <View style={styles.breathWrap} pointerEvents="none">
                      <Animated.View
                        style={[styles.breath, {
                          opacity: ring.interpolate({ inputRange: [0, 1], outputRange: [0.25, 0.9] }),
                          transform: [{ scale: ring.interpolate({ inputRange: [0, 1], outputRange: [0.55, 1] }) }],
                        }]}
                      />
                    </View>
                  )}
                </>
              )}
            </View>
            <Text style={styles.caption}>{caption}</Text>
            {reverse && phase === 'show' && <Text style={[type.small, { textAlign: 'center' }]}>{t('oyun.reverseNote')}</Text>}
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg, paddingHorizontal: S.lg },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  center: { flex: 1, justifyContent: 'center', maxWidth: 520, width: '100%', alignSelf: 'center' },
  big: { fontFamily: F.serif, fontSize: 72, color: C.gold, marginTop: S.lg },
  board: { width: '100%', maxWidth: 380, aspectRatio: 1, alignSelf: 'center' },
  hit: { position: 'absolute', width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  star: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.ink, opacity: 0.45 },
  starLit: { width: 14, height: 14, borderRadius: 7, backgroundColor: C.gold, opacity: 1 },
  starWrong: { width: 12, height: 12, borderRadius: 6, backgroundColor: 'transparent', borderWidth: 2, borderColor: C.coral, opacity: 1 },
  halo: { position: 'absolute', width: 34, height: 34, borderRadius: 17, backgroundColor: C.gold, opacity: 0.16 },
  haloNow: { width: 44, height: 44, borderRadius: 22, opacity: 0.28 },
  hint: { position: 'absolute', width: 36, height: 36, borderRadius: 18, borderWidth: 1.5, borderColor: C.gold },
  breathWrap: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  breath: { width: 140, height: 140, borderRadius: 70, borderWidth: 2, borderColor: C.coral, backgroundColor: 'rgba(242,193,78,0.06)' },
  caption: { fontFamily: F.italic, fontSize: 22, lineHeight: 30, color: C.ink, textAlign: 'center', marginTop: S.lg, minHeight: 60 },
});
