import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Platform, Share } from 'react-native';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { Colors, Typography, Spacing, BorderRadius } from '../theme/colors';
import { FlatPassage } from '../data/loader';
import { useLanguage } from '../i18n/useLanguage';

function colorFor(key: string): string {
  switch (key) {
    case 'gold': return Colors.gold;
    case 'purple': return Colors.purple;
    case 'teal': return Colors.teal;
    case 'sand': return Colors.sakinSand;
    default: return Colors.gold;
  }
}

type CardTheme = 'ink' | 'paper';

const THEME_STYLES: Record<CardTheme, { bg: string; text: string; muted: string }> = {
  ink: { bg: Colors.background, text: Colors.textPrimary, muted: Colors.textMuted },
  paper: { bg: Colors.sakinCream, text: '#2A2440', muted: '#8A7FA8' },
};

interface Props {
  passage: FlatPassage | null;
  onClose: () => void;
}

export function ShareImageModal({ passage, onClose }: Props) {
  const { t } = useLanguage();
  const [theme, setTheme] = useState<CardTheme>('ink');
  const shotRef = useRef<ViewShot>(null);

  if (!passage) return null;
  const accent = colorFor(passage.color);
  const palette = THEME_STYLES[theme];

  const onShareImage = async () => {
    if (Platform.OS === 'web') {
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
      return;
    }
    try {
      const uri = await shotRef.current?.capture?.();
      if (!uri) return;
      const available = await Sharing.isAvailableAsync();
      if (available) {
        await Sharing.shareAsync(uri);
      }
    } catch {
      // ignore
    }
  };

  return (
    <Modal visible animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.previewWrap}>
            <ViewShot ref={shotRef} options={{ format: 'png', quality: 1 }}>
              <View style={[styles.card, { backgroundColor: palette.bg, borderColor: accent + '40' }]}>
                <View style={[styles.cardAccentLine, { backgroundColor: accent }]} />
                <Text style={[styles.cardText, { color: palette.text }]}>{passage.text}</Text>
                <View style={[styles.cardDivider, { backgroundColor: accent }]} />
                <Text style={[styles.cardAuthor, { color: accent }]}>{passage.author}</Text>
                <Text style={[styles.cardBook, { color: palette.muted }]}>{passage.bookTitle}</Text>
                <Text style={[styles.cardBrand, { color: palette.muted }]}>NİDALAR</Text>
              </View>
            </ViewShot>
          </View>

          <View style={styles.themeRow}>
            <TouchableOpacity
              style={[styles.themeBtn, theme === 'ink' && styles.themeBtnActive]}
              onPress={() => setTheme('ink')}
              activeOpacity={0.8}
            >
              <Text style={[styles.themeBtnText, theme === 'ink' && styles.themeBtnTextActive]}>
                {t('share.theme.ink')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.themeBtn, theme === 'paper' && styles.themeBtnActive]}
              onPress={() => setTheme('paper')}
              activeOpacity={0.8}
            >
              <Text style={[styles.themeBtnText, theme === 'paper' && styles.themeBtnTextActive]}>
                {t('share.theme.paper')}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.shareBtn, { borderColor: accent }]}
            onPress={onShareImage}
            activeOpacity={0.8}
          >
            <Text style={[styles.shareBtnText, { color: accent }]}>↗ {t('share.action')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.8}>
            <Text style={styles.closeBtnText}>{t('common.close')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const CARD_SIZE = 300;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.backgroundCard,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.lg,
    alignItems: 'center',
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.divider,
    marginBottom: Spacing.md,
  },
  previewWrap: {
    marginBottom: Spacing.md,
  },
  card: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardAccentLine: {
    position: 'absolute',
    top: Spacing.lg,
    left: Spacing.lg,
    width: 24,
    height: 2,
    opacity: 0.6,
  },
  cardText: {
    fontSize: Typography.size.md,
    lineHeight: Typography.size.md * 1.7,
    fontFamily: Typography.fontFamily.serif,
    textAlign: 'center',
  },
  cardDivider: {
    width: 22,
    height: 1,
    opacity: 0.5,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  cardAuthor: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semibold,
    letterSpacing: 0.5,
  },
  cardBook: {
    fontSize: Typography.size.xs,
    marginTop: 2,
  },
  cardBrand: {
    position: 'absolute',
    bottom: Spacing.md,
    fontSize: 9,
    letterSpacing: 3,
  },
  themeRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  themeBtn: {
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: BorderRadius.round,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.background,
  },
  themeBtnActive: {
    borderColor: Colors.gold,
    backgroundColor: Colors.goldGlow,
  },
  themeBtnText: {
    fontSize: Typography.size.xs,
    color: Colors.textSecondary,
    letterSpacing: 0.5,
  },
  themeBtnTextActive: {
    color: Colors.goldLight,
    fontWeight: Typography.weight.semibold,
  },
  shareBtn: {
    width: '100%',
    borderWidth: 1,
    borderRadius: BorderRadius.round,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  shareBtnText: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semibold,
    letterSpacing: 0.5,
  },
  closeBtn: {
    marginTop: Spacing.sm,
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  closeBtnText: {
    fontSize: Typography.size.xs,
    color: Colors.textMuted,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
});
