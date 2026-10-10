import React from 'react';
import { Text, TextStyle, StyleProp } from 'react-native';
import { C, F } from '../theme/tokens';

// `*vurgu*` → altın, italik serif. Kartlardaki tek parlak an.
export function Rich({ children, style }: { children: string; style?: StyleProp<TextStyle> }) {
  const parts = children.split('*');
  return (
    <Text style={style}>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <Text key={i} style={accent}>{part}</Text>
        ) : (
          part
        ),
      )}
    </Text>
  );
}

const accent: TextStyle = {
  fontFamily: F.italic,
  color: C.gold,
  fontSize: undefined,
  textShadowColor: C.goldGlow,
  textShadowRadius: 14,
};
