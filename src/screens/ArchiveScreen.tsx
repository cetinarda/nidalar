import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius } from '../theme/colors';
import { useData, FlatPassage } from '../data/loader';
import { useNidaStore } from '../store/useStore';
import { useLanguage } from '../i18n/useLanguage';
import { PassageModal } from '../components/PassageModal';

function colorFor(key: string): string {
  switch (key) {
    case 'gold': return Colors.gold;
    case 'purple': return Colors.purple;
    case 'teal': return Colors.teal;
    case 'sand': return Colors.sakinSand;
    default: return Colors.gold;
  }
}

export function ArchiveScreen() {
  const insets = useSafeAreaInsets();
  const { t, lang } = useLanguage();
  const { passages } = useData();
  const { saved, history, removeSaved } = useNidaStore();
  const [activePassage, setActivePassage] = useState<FlatPassage | null>(null);

  const savedPassages = useMemo(
    () =>
      saved
        .map(s => {
          const p = passages.find(pp => pp.id === s.passageId);
          return p ? { ...p, savedAt: s.savedAt } : null;
        })
        .filter((p): p is FlatPassage & { savedAt: string } => !!p),
    [saved, passages],
  );

  const recentHistory = useMemo(() => history.slice(0, 12), [history]);

  const dateFormatter = useMemo(
    () => new Intl.DateTimeFormat(lang === 'tr' ? 'tr-TR' : 'en-US', { day: 'numeric', month: 'short' }),
    [lang],
  );

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <View style={styles.header}>
        <Text style={styles.title}>{t('archive.title')}</Text>
        <Text style={styles.subtitle}>{t('archive.subtitle')}</Text>
      </View>

      {savedPassages.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>◇</Text>
          <Text style={styles.emptyTitle}>{t('archive.empty.title')}</Text>
          <Text style={styles.emptySub}>{t('archive.empty.sub')}</Text>
        </View>
      ) : (
        <FlatList
          data={savedPassages}
          keyExtractor={p => p.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const accent = colorFor(item.color);
            return (
              <TouchableOpacity
                style={[styles.card, { borderColor: accent + '30' }]}
                activeOpacity={0.8}
                onPress={() => setActivePassage(item)}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.emoji}>{item.emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.theme, { color: accent }]}>{item.theme}</Text>
                    <Text style={styles.author}>{item.author} · {item.bookTitle}</Text>
                  </View>
                  <TouchableOpacity onPress={() => removeSaved(item.id)} hitSlop={8}>
                    <Text style={styles.remove}>{t('archive.removeAction')}</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.snippet} numberOfLines={3}>{item.text}</Text>
              </TouchableOpacity>
            );
          }}
          ListFooterComponent={
            recentHistory.length > 0 ? (
              <View style={styles.historySection}>
                <Text style={styles.historyTitle}>{t('archive.history')}</Text>
                {recentHistory.map((h, idx) => {
                  const p = passages.find(pp => pp.id === h.passageId);
                  if (!p) return null;
                  const accent = colorFor(p.color);
                  return (
                    <TouchableOpacity
                      key={`${h.passageId}-${h.date}-${idx}`}
                      style={styles.historyRow}
                      activeOpacity={0.7}
                      onPress={() => setActivePassage(p)}
                    >
                      <View style={[styles.historyDot, { backgroundColor: accent }]} />
                      <Text style={styles.historyDate}>{dateFormatter.format(new Date(h.date))}</Text>
                      <Text style={styles.historyTheme} numberOfLines={1}>{p.theme} · {p.author}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : null
          }
        />
      )}

      <PassageModal passage={activePassage} onClose={() => setActivePassage(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  title: {
    fontSize: Typography.size.xxl,
    fontWeight: Typography.weight.semibold,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: Typography.size.xs,
    color: Colors.textMuted,
    marginTop: 2,
    letterSpacing: 0.5,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
  },
  emptyIcon: {
    fontSize: 32,
    color: Colors.textMuted,
    marginBottom: Spacing.xs,
  },
  emptyTitle: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.semibold,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  emptySub: {
    fontSize: Typography.size.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: Typography.size.sm * 1.6,
  },
  list: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  card: {
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.backgroundCard,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  emoji: { fontSize: 20 },
  theme: {
    fontSize: 10,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    fontWeight: Typography.weight.semibold,
  },
  author: {
    fontSize: Typography.size.xs,
    color: Colors.textMuted,
    marginTop: 1,
  },
  remove: {
    fontSize: 10,
    color: Colors.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  snippet: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
    lineHeight: Typography.size.sm * 1.7,
    fontFamily: Typography.fontFamily.serif,
  },
  historySection: {
    marginTop: Spacing.lg,
  },
  historyTitle: {
    fontSize: 10,
    color: Colors.textMuted,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  historyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  historyDate: {
    fontSize: Typography.size.xs,
    color: Colors.textMuted,
    width: 56,
  },
  historyTheme: {
    fontSize: Typography.size.xs,
    color: Colors.textSecondary,
    flex: 1,
  },
});
