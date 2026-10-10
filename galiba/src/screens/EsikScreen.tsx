import React, { useRef, useState } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Art } from '../components/Art';
import { Rich } from '../components/Rich';
import { Button } from '../components/ui';
import { ESIK, Card } from '../content/esik';
import { DayNumbers } from '../components/DayNumbers';
import { LangToggle } from '../components/LangToggle';
import { useT } from '../i18n';
import { C, F, S, type, upper } from '../theme/tokens';

// Eşik: 8 kartlık açılış serisi. Yatay kaydırılır, son kartta içeri geçilir.
export function EsikScreen({ onDone }: { onDone: () => void }) {
  const insets = useSafeAreaInsets();
  const [w, setW] = useState(0);
  const [i, setI] = useState(0);
  const ref = useRef<ScrollView>(null);
  const { t, lang } = useT();
  const cards = ESIK[lang];
  const total = cards.length;

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!w) return;
    const next = Math.round(e.nativeEvent.contentOffset.x / w);
    if (next !== i) {
      setI(next);
      Haptics.selectionAsync().catch(() => {});
    }
  };

  const go = (n: number) => ref.current?.scrollTo({ x: n * w, animated: true });

  return (
    <View style={[styles.root, { paddingTop: insets.top }]} onLayout={e => setW(e.nativeEvent.layout.width)}>
      <View style={styles.top}>
        <Text style={styles.brand}>galiba</Text>
        <View style={styles.topRight}>
          <LangToggle />
          {i < total - 1 && <Button quiet label={t('esik.skip')} onPress={onDone} />}
        </View>
      </View>

      {w > 0 && (
        <ScrollView
          ref={ref}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={32}
        >
          {cards.map((card, idx) => (
            <ScrollView key={idx} style={{ width: w }} contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
              <CardView card={card} />
              {idx === total - 1 && (
                <Button label={t('esik.enter')} onPress={onDone} style={{ marginTop: S.xl }} />
              )}
              {card.next && (
                <Pressable onPress={() => go(idx + 1)} style={{ marginTop: S.lg }}>
                  <Text style={styles.next}>{card.next}  →</Text>
                </Pressable>
              )}
            </ScrollView>
          ))}
        </ScrollView>
      )}

      <View style={[styles.footer, { paddingBottom: insets.bottom + S.md }]}>
        <View style={styles.dots}>
          {cards.map((_, d) => (
            <Pressable key={d} onPress={() => go(d)} hitSlop={6}>
              <View style={[styles.dot, d === i && styles.dotOn]} />
            </Pressable>
          ))}
        </View>
        <Text style={styles.count}>
          {String(i + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </Text>
      </View>
    </View>
  );
}

function CardView({ card }: { card: Card }) {
  const art = <Art name={card.art} height={card.cover ? 250 : 210} />;
  return (
    <View>
      {card.artTop && art}
      {card.eyebrow && (
        <Text style={[type.eyebrow, card.cover && styles.coverEyebrow, { marginTop: S.md }]}>{upper(card.eyebrow)}</Text>
      )}
      {card.cover && <View style={{ marginTop: S.lg }}><DayNumbers /></View>}
      {card.title && <Rich style={[type.display, { marginTop: card.artTop ? S.lg : S.sm }]}>{card.title}</Rich>}
      {card.paragraphs.map((p, k) => (
        <Rich key={k} style={[card.cover ? (k === 0 ? styles.coverHook : styles.coverGloss) : type.body, { marginTop: S.md }]}>{p}</Rich>
      ))}
      {card.list?.map((item, k) => (
        <View key={k} style={styles.listRow}>
          <Text style={styles.listN}>{item.n}</Text>
          <Text style={[type.body, { flex: 1 }]}>{item.text}</Text>
        </View>
      ))}
      {card.coda && <Rich style={[type.body, styles.coda]}>{card.coda}</Rich>}
      {!card.artTop && <View style={{ marginTop: S.lg }}>{art}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: S.lg, height: 44 },
  brand: { fontFamily: F.italic, fontSize: 22, color: C.ink },
  page: { paddingHorizontal: S.lg, paddingBottom: S.xl },
  coverEyebrow: { color: C.gold, textAlign: 'center', letterSpacing: 6 },
  topRight: { flexDirection: 'row', alignItems: 'center', gap: S.md },
  coverGloss: { ...type.small, textAlign: 'center' },
  coverHook: { ...type.body, fontSize: 20, lineHeight: 30, color: C.ink, textAlign: 'center' },
  listRow: { flexDirection: 'row', gap: S.md, marginTop: S.md },
  listN: { fontFamily: F.regular, fontSize: 17, lineHeight: 27, color: C.gold },
  coda: { marginTop: S.lg, color: C.ink },
  next: { ...type.small, fontSize: 15 },
  footer: { paddingHorizontal: S.lg, paddingTop: S.sm, alignItems: 'center', gap: S.sm },
  dots: { flexDirection: 'row', gap: 8 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.inkMuted, opacity: 0.5 },
  dotOn: { backgroundColor: C.ink, opacity: 1 },
  count: { fontFamily: F.light, fontSize: 12, letterSpacing: 3, color: C.inkMuted },
});
