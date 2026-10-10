import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle, StyleProp } from 'react-native';
import { C, F, S, type } from '../theme/tokens';

export function Eyebrow({ children }: { children: string }) {
  return <Text style={type.eyebrow}>{children}</Text>;
}

// Tek tip buton: altın çerçeveli hap ya da sessiz metin bağlantısı.
export function Button({ label, onPress, quiet, disabled, style }: {
  label: string; onPress: () => void; quiet?: boolean; disabled?: boolean; style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={({ pressed }) => [
        quiet ? styles.quiet : styles.pill,
        { opacity: disabled ? 0.35 : pressed ? 0.7 : 1 },
        style,
      ]}
    >
      <Text style={quiet ? styles.quietText : styles.pillText}>{label}</Text>
    </Pressable>
  );
}

export function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  pill: {
    borderWidth: 1,
    borderColor: C.gold,
    borderRadius: 999,
    paddingVertical: 14,
    paddingHorizontal: S.lg,
    alignItems: 'center',
  },
  pillText: { fontFamily: F.regular, fontSize: 15, letterSpacing: 1.5, color: C.gold },
  quiet: { paddingVertical: S.sm },
  quietText: { fontFamily: F.light, fontSize: 15, color: C.inkMuted },
  divider: { width: 56, height: 1, backgroundColor: C.line, marginVertical: S.lg },
});
