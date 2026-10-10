import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Lang } from '../i18n';
import { useStore } from '../store/useStore';
import { C, F } from '../theme/tokens';

// TR · EN: sessiz bir dil seçici.
export function LangToggle() {
  const { lang, setLang } = useStore();
  const pick = (l: Lang) => {
    if (l === lang) return;
    Haptics.selectionAsync().catch(() => {});
    setLang(l);
  };
  return (
    <View style={styles.row} accessibilityRole="radiogroup">
      {(['tr', 'en'] as Lang[]).map((l, i) => (
        <React.Fragment key={l}>
          {i > 0 && <Text style={styles.dot}>·</Text>}
          <Pressable onPress={() => pick(l)} hitSlop={8} accessibilityRole="radio" accessibilityState={{ selected: l === lang }}
            accessibilityLabel={l === 'tr' ? 'Türkçe' : 'English'}>
            <Text style={[styles.item, l === lang && styles.on]}>{l.toUpperCase()}</Text>
          </Pressable>
        </React.Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  item: { fontFamily: F.regular, fontSize: 13, letterSpacing: 1.5, color: C.inkMuted },
  on: { color: C.gold },
  dot: { color: C.inkMuted, fontSize: 13 },
});
