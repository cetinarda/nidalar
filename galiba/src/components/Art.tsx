import React, { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, Platform, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, Ellipse, G, Line, Mask, Path, Pattern, RadialGradient, Rect, Stop } from 'react-native-svg';
import { C, F, S } from '../theme/tokens';

// Galiba'nın motifleri: pencere, mercek, katman, ayna, çatal yol, nefes, basamak.
// Dil: yarım ton nokta dokusu, parlayan ince çizgi, tek altın odak.
// Her illüstrasyon kendi id önekini kullanır; web'de çakışma olmasın.

export type ArtName = 'window' | 'lens' | 'layers' | 'mirror' | 'fork' | 'breath' | 'stones' | 'echo';

function Dots({ id, color, step = 6, r = 1.4 }: { id: string; color: string; step?: number; r?: number }) {
  return (
    <Pattern id={id} patternUnits="userSpaceOnUse" width={step} height={step}>
      <Circle cx={step / 2} cy={step / 2} r={r} fill={color} />
    </Pattern>
  );
}

function GlowPath({ d, color, w = 2.5 }: { d: string; color: string; w?: number }) {
  return (
    <G>
      <Path d={d} stroke={color} strokeOpacity={0.18} strokeWidth={w * 4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <Path d={d} stroke={color} strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </G>
  );
}

function GlowCircle({ cx, cy, r, color, w = 2.5 }: { cx: number; cy: number; r: number; color: string; w?: number }) {
  return (
    <G>
      <Circle cx={cx} cy={cy} r={r} stroke={color} strokeOpacity={0.18} strokeWidth={w * 4} fill="none" />
      <Circle cx={cx} cy={cy} r={r} stroke={color} strokeWidth={w} fill="none" />
    </G>
  );
}

function Stars({ seed }: { seed: number }) {
  const pts = [[24, 30], [276, 40], [52, 150], [262, 168], [150, 14], [214, 112], [30, 212], [286, 222]];
  return (
    <G>
      {pts.map(([x, y], i) => (
        <Circle key={i} cx={(x * (seed + i)) % 300} cy={y} r={i % 3 === 0 ? 1.3 : 0.8}
          fill={i % 4 === 0 ? C.coral : i % 3 === 0 ? C.gold : C.ink} opacity={0.5} />
      ))}
    </G>
  );
}

function StaticArt({ name, height }: { name: ArtName; height: number }) {
  const p = name;
  return (
    <Svg width="100%" height={height} viewBox="0 0 300 240">
      <Defs>
        <Dots id={`${p}-gd`} color={C.gold} />
        <Dots id={`${p}-gb`} color={C.gold} step={10} r={3} />
        <Dots id={`${p}-ld`} color={C.lilac} step={5} r={1.2} />
        <RadialGradient id={`${p}-fg`} cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor="#fff" stopOpacity="1" />
          <Stop offset="0.6" stopColor="#fff" stopOpacity="0.5" />
          <Stop offset="1" stopColor="#fff" stopOpacity="0" />
        </RadialGradient>
        <Mask id={`${p}-m`}>
          <Rect x="0" y="0" width="300" height="240" fill={`url(#${p}-fg)`} />
        </Mask>
      </Defs>
      <Stars seed={name.length + 1} />
      {render(name, p)}
    </Svg>
  );
}

function render(name: ArtName, p: string) {
  const gold = `url(#${p}-gd)`;
  const goldBig = `url(#${p}-gb)`;
  const lilac = `url(#${p}-ld)`;
  const fade = `url(#${p}-m)`;
  switch (name) {
    // İki camlı pencere: aynı manzara, iki farklı görünüş.
    case 'window':
      return (
        <G>
          <Rect x={40} y={10} width={220} height={220} fill={gold} opacity={0.4} mask={fade} />
          <Path d="M 98 210 L 98 100 A 52 52 0 0 1 202 100 L 202 210 Z" fill={C.bg} />
          <Path d="M 104 206 L 104 102 A 46 46 0 0 1 150 56 L 150 206 Z" fill={lilac} opacity={0.85} />
          <Path d="M 150 56 A 46 46 0 0 1 196 102 L 196 206 L 150 206 Z" fill={gold} opacity={0.9} />
          <GlowPath d="M 98 210 L 98 100 A 52 52 0 0 1 202 100 L 202 210 Z" color={C.coral} w={2} />
          <Line x1={150} y1={50} x2={150} y2={210} stroke={C.coral} strokeWidth={2} />
          <Line x1={70} y1={210} x2={230} y2={210} stroke={C.coral} strokeOpacity={0.5} strokeWidth={1} />
        </G>
      );
    // Mercek: içeride noktalar büyür; bakınca daha çok görünür.
    case 'lens':
      return (
        <G>
          <Rect x={20} y={20} width={260} height={200} fill={lilac} opacity={0.5} mask={fade} />
          <Circle cx={136} cy={108} r={62} fill={C.bg} />
          <Circle cx={136} cy={108} r={58} fill={goldBig} opacity={0.9} />
          <GlowCircle cx={136} cy={108} r={62} color={C.coral} />
          <GlowPath d="M 182 152 L 232 202" color={C.coral} w={5} />
        </G>
      );
    // Katmanlar: aynı merkezden geçen üç düzlem.
    case 'layers':
      return (
        <G>
          <Ellipse cx={150} cy={186} rx={118} ry={30} fill={lilac} opacity={0.8} />
          <Ellipse cx={150} cy={130} rx={98} ry={25} fill={C.bg} />
          <Ellipse cx={150} cy={130} rx={98} ry={25} stroke={C.coral} strokeWidth={1.6} fill="none" />
          <Ellipse cx={150} cy={78} rx={76} ry={20} fill={gold} opacity={0.85} />
          <GlowPath d="M 150 30 L 150 200" color={C.gold} w={1} />
          <Circle cx={150} cy={130} r={5} fill={C.gold} />
        </G>
      );
    // Ayna: bir şekil ve onun noktalı yankısı.
    case 'mirror':
      return (
        <G>
          <Circle cx={150} cy={110} r={92} fill={gold} opacity={0.3} mask={fade} />
          <Ellipse cx={122} cy={110} rx={50} ry={70} fill={lilac} opacity={0.7} />
          <Ellipse cx={178} cy={110} rx={50} ry={70} stroke={C.lilac} strokeWidth={1.2} strokeDasharray="1 5" fill="none" />
          <Ellipse cx={122} cy={110} rx={50} ry={70} stroke={C.coral} strokeWidth={2} fill="none" />
          <Circle cx={150} cy={110} r={6} fill={C.gold} />
        </G>
      );
    // Çatal yol: tek başlangıç, üç ihtimal.
    case 'fork':
      return (
        <G>
          <Rect x={0} y={196} width={300} height={44} fill={lilac} opacity={0.6} />
          <GlowPath d="M 150 214 L 150 150 Q 150 110 90 80 L 70 58" color={C.coral} w={2} />
          <GlowPath d="M 150 150 L 150 44" color={C.coral} w={2} />
          <GlowPath d="M 150 150 Q 150 116 210 92 L 232 74" color={C.coral} w={2} />
          <Circle cx={150} cy={36} r={34} fill={gold} opacity={0.6} mask={fade} />
          {[[70, 58], [150, 40], [232, 74]].map(([x, y], i) => (
            <G key={i}>
              <Circle cx={x} cy={y} r={10} stroke={C.ink} strokeOpacity={0.25} fill="none" />
              <Circle cx={x} cy={y} r={6} fill={C.gold} />
            </G>
          ))}
          <Circle cx={150} cy={150} r={4} fill={C.ink} />
        </G>
      );
    // Nefes: merkezden dışa yayılan halkalar.
    case 'breath':
      return (
        <G>
          {[100, 82, 64].map((r, i) => (
            <Circle key={r} cx={150} cy={120} r={r} stroke={C.lilac} strokeOpacity={0.25 + i * 0.2}
              strokeWidth={1.2} strokeDasharray={i === 1 ? '1 5' : undefined} fill="none" />
          ))}
          <GlowCircle cx={150} cy={120} r={46} color={C.coral} w={2} />
          <Circle cx={150} cy={120} r={40} fill={gold} opacity={0.7} mask={fade} />
          <Circle cx={150} cy={120} r={8} fill={C.gold} />
        </G>
      );
    // Basamak taşları: bir sonraki taş parlıyor.
    case 'stones':
      return (
        <G>
          <Rect x={0} y={150} width={300} height={90} fill={lilac} opacity={0.35} />
          {[[150, 214, 46, 12], [128, 176, 36, 9], [164, 146, 28, 7], [140, 122, 21, 5], [156, 104, 15, 4]].map(([x, y, rx, ry], i) => (
            <G key={i}>
              <Ellipse cx={x} cy={y} rx={rx} ry={ry} fill={i === 1 ? gold : C.bg} />
              <Ellipse cx={x} cy={y} rx={rx} ry={ry} stroke={i === 1 ? C.gold : C.coral}
                strokeOpacity={i === 1 ? 1 : 0.7 - i * 0.1} strokeWidth={1.4} fill="none" />
            </G>
          ))}
          <Circle cx={156} cy={58} r={30} fill={gold} opacity={0.5} mask={fade} />
          <Circle cx={156} cy={58} r={6} fill={C.gold} />
        </G>
      );
    // Yankı: uzaktan gelen bir ses, dalga dalga.
    case 'echo':
      return (
        <G>
          <Circle cx={96} cy={120} r={44} fill={gold} opacity={0.6} mask={fade} />
          {[44, 72, 100, 128].map((r, i) => (
            <Path key={r} d={`M ${96 + r * 0.6} ${120 - r * 0.8} A ${r} ${r} 0 0 1 ${96 + r * 0.6} ${120 + r * 0.8}`}
              stroke={i === 0 ? C.coral : C.lilac} strokeOpacity={i === 0 ? 1 : 0.85 - i * 0.2}
              strokeWidth={i === 0 ? 2 : 1.4} strokeDasharray={i === 2 ? '1 5' : undefined}
              strokeLinecap="round" fill="none" />
          ))}
          <Circle cx={96} cy={120} r={7} fill={C.gold} />
        </G>
      );
  }
}

// ── Canlı illüstrasyon ─────────────────────────────────────────────
// Her motif kendi yavaş ritmiyle hareket eder. "Hareketi azalt" açıksa durur.
// breath: 4 sn nefes al, 6 sn ver; isteğe bağlı "nefes al / ver" ipucu.

type Motion = {
  inMs: number;
  outMs: number;
  scale?: [number, number];
  scaleX?: [number, number];
  tx?: [number, number];
  ty?: [number, number];
  rotate?: [string, string];
  opacity?: [number, number];
};

const MOTION: Record<ArtName, Motion> = {
  breath: { inMs: 4000, outMs: 6000, scale: [0.88, 1.06], opacity: [0.75, 1] },
  echo: { inMs: 2600, outMs: 2600, scale: [0.94, 1.05], opacity: [0.7, 1] },
  lens: { inMs: 5000, outMs: 5000, tx: [-6, 6], ty: [3, -3], rotate: ['-3deg', '3deg'] },
  fork: { inMs: 4500, outMs: 4500, ty: [4, -4], opacity: [0.85, 1] },
  stones: { inMs: 5000, outMs: 5000, scale: [0.97, 1.02], ty: [2, -2] },
  mirror: { inMs: 4000, outMs: 4000, scaleX: [0.96, 1.03], opacity: [0.85, 1] },
  layers: { inMs: 5000, outMs: 5000, ty: [-4, 4] },
  window: { inMs: 6000, outMs: 6000, scale: [0.985, 1.015], opacity: [0.85, 1] },
};

const ease = Easing.inOut(Easing.sin);
const native = Platform.OS !== 'web';

export function Art({ name, height = 220, cue }: { name: ArtName; height?: number; cue?: boolean }) {
  const t = useRef(new Animated.Value(0)).current;
  const [phase, setPhase] = useState<'in' | 'out'>('in');
  const m = MOTION[name];

  useEffect(() => {
    let alive = true;
    let current: Animated.CompositeAnimation | null = null;
    const step = (to: 0 | 1) => {
      if (!alive) return;
      setPhase(to === 1 ? 'in' : 'out');
      current = Animated.timing(t, { toValue: to, duration: to === 1 ? m.inMs : m.outMs, easing: ease, useNativeDriver: native });
      current.start(({ finished }) => finished && step(to === 1 ? 0 : 1));
    };
    AccessibilityInfo.isReduceMotionEnabled()
      .catch(() => false)
      .then(reduce => {
        if (!reduce) step(1);
      });
    return () => {
      alive = false;
      current?.stop();
    };
  }, [t, m]);

  const range = <T extends number | string>(r?: [T, T]) => (r ? t.interpolate({ inputRange: [0, 1], outputRange: r as any }) : undefined);
  const transform = [
    m.tx && { translateX: range(m.tx) },
    m.ty && { translateY: range(m.ty) },
    m.scale && { scale: range(m.scale) },
    m.scaleX && { scaleX: range(m.scaleX) },
    m.rotate && { rotate: range(m.rotate) },
  ].filter(Boolean) as any[];

  return (
    <View>
      <Animated.View style={{ transform, opacity: range(m.opacity) ?? 1 }}>
        <StaticArt name={name} height={height} />
      </Animated.View>
      {cue && <Text style={styles.cue}>{phase === 'in' ? 'nefes al' : 'ver'}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  cue: { fontFamily: F.italic, fontSize: 20, color: C.gold, textAlign: 'center', marginTop: S.xs },
});
