import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Share } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../theme/colors';
import { FlatPassage } from '../data/loader';
import { useNidaStore } from '../store/useStore';
import { useLanguage } from '../i18n/useLanguage';
import { ShareImageModal } from './ShareImageModal';

function colorFor(key: string): string {
  switch (key) {
    case 'gold': return Colors.gold;
    case 'purple': return Colors.purple;
    case 'teal': return Colors.teal;
    case 'sand': return Colors.sakinSand;
    default: return Colors.gold;
  }
}

interface Props {
  passage: FlatPassage | null;
  onClose: () => void;
}

export function PassageModal({ passage, onClose }: Props) {
  const { t } = useLanguage();
  const { isSaved, toggleSaved } = useNidaStore();
  const [shareImagePassage, setShareImagePassage] = useState<FlatPassage | null>(null);

  if (!passage) return null;
  const accent = colorFor(passage.color);

  const onShare = async () => {
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

  return (
    <Modal visible animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
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
          </ScrollView>

          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[styles.actionBtn, { borderColor: accent }]}
              onPress={() => toggleSaved(passage.id)}
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
              <Text style={[styles.actionBtnText, { color: accent }]}>↗ {t('passage.share')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, { borderColor: accent }]}
              onPress={() => setShareImagePassage(passage)}
              activeOpacity={0.8}
            >
              <Text style={[styles.actionBtnText, { color: accent }]}>
                ✦ {t('passage.shareImage')}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.8}>
            <Text style={styles.closeBtnText}>{t('common.close')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ShareImageModal passage={shareImagePassage} onClose={() => setShareImagePassage(null)} />
    </Modal>
  );
}

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
    maxHeight: '82%',
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.divider,
    alignSelf: 'center',
    marginBottom: Spacing.md,
  },
  content: {
    alignItems: 'center',
    paddingBottom: Spacing.md,
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
