// Galiba — gece eriği zemin, tek altın vurgu, mercan ve lila yalnızca illüstrasyonda.
// Kural: bir ekranda en fazla bir altın vurgu. Gerisi sessiz.

export const C = {
  bg: '#1A1222',
  bgDeep: '#140E1B',
  surface: '#221830',
  line: 'rgba(240,232,220,0.08)',

  ink: '#F2ECE4',
  inkSoft: 'rgba(242,236,228,0.72)',
  inkMuted: 'rgba(242,236,228,0.42)',

  gold: '#F2C14E',
  goldGlow: 'rgba(242,193,78,0.35)',
  coral: '#E8855B',
  lilac: '#8C6FE0',
  lilacSoft: 'rgba(140,111,224,0.55)',
} as const;

export const F = {
  light: 'Jost_300Light',
  regular: 'Jost_400Regular',
  medium: 'Jost_500Medium',
  serif: 'CormorantGaramond_600SemiBold',
  italic: 'CormorantGaramond_500Medium_Italic',
} as const;

// Türkçe büyük harf: CSS/RN uppercase "i"yi "I" yapar; bu yüzden metni kendimiz çeviriyoruz.
export const upper = (s: string) => s.toLocaleUpperCase('tr-TR');

export const S = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 } as const;

export const type = {
  eyebrow: { fontFamily: F.regular, fontSize: 12, letterSpacing: 4, color: C.inkMuted },
  display: { fontFamily: F.light, fontSize: 34, lineHeight: 42, color: C.ink },
  title: { fontFamily: F.light, fontSize: 26, lineHeight: 34, color: C.ink },
  body: { fontFamily: F.light, fontSize: 17, lineHeight: 27, color: C.inkSoft },
  small: { fontFamily: F.light, fontSize: 14, lineHeight: 21, color: C.inkMuted },
} as const;
