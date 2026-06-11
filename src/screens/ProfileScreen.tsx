import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius } from '../theme/colors';
import { useNidaStore } from '../store/useStore';
import { useLanguage, setLanguage } from '../i18n/useLanguage';

export function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { t, lang } = useLanguage();
  const { saved, history, clearAllData } = useNidaStore();

  const onClear = () => {
    Alert.alert(
      t('profile.clearData.confirmTitle'),
      t('profile.clearData.confirmBody'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('profile.clearData.confirm'), style: 'destructive', onPress: () => clearAllData() },
      ],
    );
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{t('profile.title')}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t('profile.stats.title')}</Text>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{history.length}</Text>
              <Text style={styles.statLabel}>{t('profile.stats.totalDraws')}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{saved.length}</Text>
              <Text style={styles.statLabel}>{t('profile.stats.saved')}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t('profile.language')}</Text>
          <View style={styles.langRow}>
            <TouchableOpacity
              style={[styles.langBtn, lang === 'tr' && styles.langBtnActive]}
              onPress={() => setLanguage('tr')}
              activeOpacity={0.8}
            >
              <Text style={[styles.langBtnText, lang === 'tr' && styles.langBtnTextActive]}>
                {t('profile.language.tr')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.langBtn, lang === 'en' && styles.langBtnActive]}
              onPress={() => setLanguage('en')}
              activeOpacity={0.8}
            >
              <Text style={[styles.langBtnText, lang === 'en' && styles.langBtnTextActive]}>
                {t('profile.language.en')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t('profile.about.title')}</Text>
          <Text style={styles.aboutText}>{t('profile.about.body')}</Text>
        </View>

        <TouchableOpacity style={styles.clearBtn} onPress={onClear} activeOpacity={0.8}>
          <Text style={styles.clearBtnText}>{t('profile.clearData')}</Text>
        </TouchableOpacity>

        <Text style={styles.version}>{t('common.familyTag')} · {t('profile.version')}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  title: {
    fontSize: Typography.size.xxl,
    fontWeight: Typography.weight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  statBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.backgroundCard,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  statValue: {
    fontSize: Typography.size.xxl,
    fontWeight: Typography.weight.bold,
    color: Colors.gold,
  },
  statLabel: {
    fontSize: Typography.size.xs,
    color: Colors.textMuted,
    marginTop: 4,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  langRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  langBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: BorderRadius.round,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    backgroundColor: Colors.backgroundCard,
  },
  langBtnActive: {
    borderColor: Colors.gold,
    backgroundColor: Colors.goldGlow,
  },
  langBtnText: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.weight.medium,
  },
  langBtnTextActive: {
    color: Colors.goldLight,
    fontWeight: Typography.weight.semibold,
  },
  aboutText: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
    lineHeight: Typography.size.sm * 1.7,
  },
  clearBtn: {
    marginTop: Spacing.md,
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.error + '50',
    borderRadius: BorderRadius.round,
  },
  clearBtnText: {
    fontSize: Typography.size.xs,
    color: Colors.error,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  version: {
    textAlign: 'center',
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: Spacing.xl,
    letterSpacing: 1,
  },
});
