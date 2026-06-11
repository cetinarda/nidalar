import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius } from '../theme/colors';
import { useData, Book, FlatPassage } from '../data/loader';
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

export function LibraryScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();
  const { books } = useData();
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [activePassage, setActivePassage] = useState<FlatPassage | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return books;
    return books.filter(
      b =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.tradition.toLowerCase().includes(q),
    );
  }, [books, query]);

  const renderBook = ({ item }: { item: Book }) => {
    const accent = colorFor(item.color);
    const isOpen = expanded === item.id;
    return (
      <View style={[styles.bookCard, { borderColor: accent + '30' }]}>
        <TouchableOpacity
          style={styles.bookHeader}
          onPress={() => setExpanded(isOpen ? null : item.id)}
          activeOpacity={0.8}
        >
          <Text style={styles.bookEmoji}>{item.emoji}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.bookTitle}>{item.title}</Text>
            <Text style={styles.bookAuthor}>{item.author}</Text>
            <Text style={[styles.bookTradition, { color: accent }]}>
              {item.tradition} · {t('library.passages', { n: item.passages.length })}
            </Text>
          </View>
          <Text style={[styles.chevron, { color: accent }]}>{isOpen ? '−' : '+'}</Text>
        </TouchableOpacity>

        {isOpen && (
          <View style={styles.passageList}>
            {item.passages.map(p => (
              <TouchableOpacity
                key={p.id}
                style={styles.passageRow}
                activeOpacity={0.7}
                onPress={() =>
                  setActivePassage({
                    ...p,
                    bookId: item.id,
                    bookTitle: item.title,
                    author: item.author,
                    emoji: item.emoji,
                    color: item.color,
                  })
                }
              >
                <View style={[styles.passageDot, { backgroundColor: accent }]} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.passageTheme}>{p.theme}</Text>
                  <Text style={styles.passageSnippet} numberOfLines={2}>
                    {p.text}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <View style={styles.header}>
        <Text style={styles.title}>{t('library.title')}</Text>
        <Text style={styles.subtitle}>{t('library.subtitle', { n: books.length })}</Text>
      </View>

      <TextInput
        style={styles.search}
        placeholder={t('library.search.placeholder')}
        placeholderTextColor={Colors.textMuted}
        value={query}
        onChangeText={setQuery}
      />

      <FlatList
        data={filtered}
        keyExtractor={b => b.id}
        renderItem={renderBook}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>{t('library.empty')}</Text>}
        showsVerticalScrollIndicator={false}
      />

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
  search: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.backgroundCard,
    color: Colors.textPrimary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: Typography.size.sm,
  },
  list: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  bookCard: {
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.backgroundCard,
    marginBottom: Spacing.sm,
    overflow: 'hidden',
  },
  bookHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
  },
  bookEmoji: { fontSize: 24 },
  bookTitle: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.semibold,
    color: Colors.textPrimary,
  },
  bookAuthor: {
    fontSize: Typography.size.xs,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  bookTradition: {
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  chevron: {
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.light,
    paddingHorizontal: Spacing.xs,
  },
  passageList: {
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  passageRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  passageDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 6,
  },
  passageTheme: {
    fontSize: 10,
    color: Colors.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  passageSnippet: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
    lineHeight: Typography.size.sm * 1.6,
    fontFamily: Typography.fontFamily.serif,
  },
  empty: {
    textAlign: 'center',
    color: Colors.textMuted,
    marginTop: Spacing.xl,
    fontSize: Typography.size.sm,
  },
});
