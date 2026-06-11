import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated,
  StatusBar,
  ScrollView,
  Share,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Colors, Typography, Spacing, BorderRadius } from '../theme/colors';
import { useData, FlatPassage } from '../data/loader';
import { useNidaStore } from '../store/useStore';
import { useLanguage } from '../i18n/useLanguage';

type Phase = 'idle' | 'arriving' | 'revealed';

function colorFor(key: string): string {
  switch (key) {
    case 'gold': return Colors.gold;
    case 'purple': return Colors.purple;
    case 'teal': return Colors.teal;
    case 'sand': return Colors.sakinSand;
    default: return Colors.gold;
  }
}

export function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();
  const { passages } = useData();
  const { isSaved, toggleSaved, recordDraw } = useNidaStore();

  const [phase, setPhase] = useState<Phase>('idle');
  const [intention, setIntention] = useState('');
  const [passage, setPassage] = useState<FlatPassage | null>(null);

  const seal = useRef(new Animated.Value(1)).current;
  const sealOpacity = useRef(new Animated.Value(1)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardTranslate = useRef(new Animated.Value(16)).current;

  const pulse = useRef(
    Animated.loop(
      Animated.sequence([
        Animated.timing(seal, { toValue: 1.06, duration: 1800, useNativeDriver: true }),
        Animated.timing(seal, { toValue: 1, duration: 1800, useNativeDriver: true }),
      ]),
    ),
  ).current;

  React.useEffect(() => {
    pulse.start();
    return () => pulse.stop();
  }, [pulse]);

  const draw = () => {
    if (phase !== 'idle') return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setPhase('arriving');
    pulse.stop();

    Animated.timing(sealOpacity, {
      toValue: 0,
      duration: 650,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      const next = passages[Math.floor(Math.random() * passages.length)];
      setPassage(next);
      recordDraw(next.id, intention);
      setPhase('revealed');
      cardOpacity.setValue(0);
      cardTranslate.setValue(16);
      Animated.parallel([
        Animated.timing(cardOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(cardTranslate, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]).start();
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }, 750);
  };

  const reset = () => {
    Haptics.selectionAsync();
    setPhase('idle');
    setPassage(null);
    sealOpacity.setValue(1);
    seal.setValue(1);
    pulse.start();
  };

  const onShare = async () => {
    if (!passage) return;
    const message = t('passage.shareText', {
      text: passage.text,
      author: passage.author,
      book: passage.bookTitle,
    });
    try {
      await Share.share({ message });
    } catch {
      // ignore
    }
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 6) return t('greeting.night');
    if (h < 12) return t('greeting.morning');
    if (h < 18) return t('greeting.day');
    return t('greeting.evening');
  };

  const accent = passage ? colorFor(passage.color) : Colors.gold;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

        <View style={styles.header}>
          <Text style={styles.greeting}>{greeting()}</Text>
          <Text style={styles.title}>Nidalar</Text>
        </View>

        {phase !== 'revealed' ? (
          <View style={styles.idleWrap}>
            <Text style={styles.eyebrow}>{t('home.eyebrow')}</Text>

            <Text style={styles.intentionLabel}>{t('home.intention.label')}</Text>
            <TextInput
              style={styles.intentionInput}
              placeholder={t('home.intention.placeholder')}
              placeholderTextColor={Colors.textMuted}
              value={intention}
              onChangeText={setIntention}
              multiline
              editable={phase === 'idle'}
            />

            <View style={styles.sealArea}>
              <Animated.View
                style={{
                  opacity: sealOpacity,
                  transform: [{ scale: seal }],
                }}
              >
                <TouchableOpacity
                  style={styles.seal}
                  onPress={draw}
                  activeOpacity={0.85}
                  disabled={phase !== 'idle'}
                  accessibilityRole="button"
                  accessibilityLabel={t('home.cta')}
                >
                  <View style={styles.sealRing}>
                    <View style={styles.sealInner}>
                      <Text style={styles.sealSymbol}>✦</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </Animated.View>
              <Text style={styles.cta}>
                {phase === 'arriving' ? t('home.arriving') : t('home.cta')}
              </Text>
              {phase === 'idle' && <Text style={styles.hint}>{t('home.hint')}</Text>}
            </View>
          </View>
        ) : (
          passage && (
            <Animated.View
              style={[
                styles.revealWrap,
                { opacity: cardOpacity, transform: [{ translateY: cardTranslate }] },
              ]}
            >
              <Text style={[styles.arrivedEyebrow, { color: accent }]}>
                {t('home.arrived.eyebrow')}
              </Text>

              <ScrollView
                style={styles.cardScroll}
                contentContainerStyle={styles.cardContent}
                showsVerticalScrollIndicator={false}
              >
                <View style={[styles.card, { borderColor: accent + '40' }]}>
                  <Text style={styles.emoji}>{passage.emoji}</Text>
                  <View style={[styles.themeTag, { borderColor: accent + '50' }]}>
                    <Text style={[styles.themeTagText, { color: accent }]}>{passage.theme}</Text>
                  </View>

                  <Text style={styles.passageText}>{passage.text}</Text>

                  <View style={[styles.divider, { backgroundColor: accent }]} />

                  <Text style={[styles.author, { color: accent }]}>{passage.author}</Text>
                  <Text style={styles.bookRef}>
                    {t('passage.from', { book: passage.bookTitle })} · {passage.ref}
                  </Text>

                  {intention.trim().length > 0 && (
                    <View style={styles.intentionBox}>
                      <Text style={styles.intentionBoxLabel}>{t('passage.intention.label')}</Text>
                      <Text style={styles.intentionBoxText}>{intention.trim()}</Text>
                    </View>
                  )}

                  <Text style={styles.footerText}>{t('home.footer')}</Text>
                </View>
              </ScrollView>

              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={[styles.actionBtn, { borderColor: accent }]}
                  onPress={() => toggleSaved(passage.id, intention)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.actionBtnText, { color: accent }]}>
                    {isSaved(passage.id) ? `✓ ${t('passage.saved')}` : `✦ ${t('passage.save')}`}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionBtn, { borderColor: accent }]}
                  onPress={onShare}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.actionBtnText, { color: accent }]}>
                    ↗ {t('passage.share')}
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.againBtn} onPress={reset} activeOpacity={0.8}>
                <Text style={styles.againBtnText}>{t('home.cta.again')}</Text>
              </TouchableOpacity>
            </Animated.View>
          )
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },

  header: {
    alignItems: 'center',
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xs,
  },
  greeting: {
    fontSize: Typography.size.xs,
    color: Colors.textMuted,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.semibold,
    color: Colors.textPrimary,
    letterSpacing: 1,
    marginTop: 2,
  },

  idleWrap: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    justifyContent: 'space-between',
  },
  eyebrow: {
    textAlign: 'center',
    fontSize: Typography.size.xs,
    color: Colors.textMuted,
    letterSpacing: 1.2,
    marginTop: Spacing.lg,
  },
  intentionLabel: {
    marginTop: Spacing.xl,
    textAlign: 'center',
    fontSize: Typography.size.md,
    color: Colors.textSecondary,
    fontWeight: Typography.weight.light,
    lineHeight: Typography.size.md * 1.5,
    fontStyle: 'italic',
  },
  intentionInput: {
    marginTop: Spacing.md,
    minHeight: 56,
    maxHeight: 110,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.backgroundCard,
    color: Colors.textPrimary,
    padding: Spacing.md,
    fontSize: Typography.size.sm,
    textAlignVertical: 'top',
  },

  sealArea: {
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  seal: {
    width: 152,
    height: 152,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sealRing: {
    width: 152,
    height: 152,
    borderRadius: 76,
    borderWidth: 1,
    borderColor: Colors.gold + '55',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.goldGlow,
  },
  sealInner: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 1,
    borderColor: Colors.gold + '80',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.backgroundCard,
  },
  sealSymbol: {
    fontSize: 40,
    color: Colors.gold,
  },
  cta: {
    marginTop: Spacing.sm,
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.semibold,
    color: Colors.textPrimary,
    letterSpacing: 0.6,
  },
  hint: {
    fontSize: Typography.size.xs,
    color: Colors.textMuted,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },

  revealWrap: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  arrivedEyebrow: {
    textAlign: 'center',
    fontSize: Typography.size.xs,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
  },
  cardScroll: { flex: 1 },
  cardContent: { paddingBottom: Spacing.md },
  card: {
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.backgroundCard,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  emoji: { fontSize: 28, marginBottom: Spacing.xs },
  themeTag: {
    borderWidth: 1,
    borderRadius: BorderRadius.round,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    marginBottom: Spacing.lg,
  },
  themeTagText: {
    fontSize: 10,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    fontWeight: Typography.weight.semibold,
  },
  passageText: {
    fontSize: Typography.size.lg,
    lineHeight: Typography.size.lg * 1.8,
    color: Colors.textPrimary,
    fontFamily: Typography.fontFamily.serif,
    fontWeight: Typography.weight.regular,
    textAlign: 'center',
  },
  divider: {
    width: 28,
    height: 1,
    opacity: 0.4,
    marginVertical: Spacing.lg,
  },
  author: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semibold,
    letterSpacing: 0.5,
  },
  bookRef: {
    fontSize: Typography.size.xs,
    color: Colors.textMuted,
    marginTop: 2,
    letterSpacing: 0.5,
  },
  intentionBox: {
    marginTop: Spacing.lg,
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    paddingTop: Spacing.md,
    alignItems: 'center',
  },
  intentionBoxLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  intentionBoxText: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  footerText: {
    marginTop: Spacing.lg,
    fontSize: Typography.size.xs,
    color: Colors.textMuted,
    fontStyle: 'italic',
    textAlign: 'center',
  },

  actionsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  actionBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: BorderRadius.round,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  actionBtnText: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semibold,
    letterSpacing: 0.5,
  },
  againBtn: {
    marginTop: Spacing.sm,
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  againBtnText: {
    fontSize: Typography.size.xs,
    color: Colors.textMuted,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
});
