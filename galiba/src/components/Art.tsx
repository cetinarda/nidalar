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

// ── Sahneli motifler: t ∈ [0, 1) döngü içindeki an; t yoksa durağan son kare.

type Pt = [number, number];
const SPLIT: Pt = [150, 150];
const BRANCHES: { d: string; ctrl?: Pt; mid: Pt; tip: Pt }[] = [
  { d: 'M 150 150 Q 150 110 90 80 L 70 58', ctrl: [150, 110], mid: [90, 80], tip: [70, 58] },
  { d: 'M 150 150 L 150 40', mid: [150, 95], tip: [150, 40] },
  { d: 'M 150 150 Q 150 116 210 92 L 232 74', ctrl: [150, 116], mid: [210, 92], tip: [232, 74] },
];
const smooth = (x: number) => x * x * (3 - 2 * x);
const lerp = (a: Pt, b: Pt, u: number): Pt => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u];

function along(br: (typeof BRANCHES)[number], u: number): Pt {
  if (!br.ctrl) return lerp(SPLIT, br.tip, u);
  // Eğrinin ilk %80'i, son %20'si düz uç.
  if (u < 0.8) {
    const v = u / 0.8;
    return lerp(lerp(SPLIT, br.ctrl, v), lerp(br.ctrl, br.mid, v), v);
  }
  return lerp(br.mid, br.tip, (u - 0.8) / 0.2);
}

function forkFrame(t?: number): { balls: Pt[]; opacity: number; glow: number } {
  const tips = BRANCHES.map(b => b.tip);
  if (t === undefined) return { balls: tips, opacity: 1, glow: 1 };
  if (t < 0.3) {
    const u = smooth(t / 0.3);
    return { balls: [[150, 214 - (214 - SPLIT[1]) * u]], opacity: Math.min(1, t / 0.06), glow: 0 };
  }
  if (t < 0.7) {
    const u = smooth((t - 0.3) / 0.4);
    return { balls: BRANCHES.map(b => along(b, u)), opacity: 1, glow: u * 0.4 };
  }
  if (t < 0.9) return { balls: tips, opacity: 1, glow: 0.4 + 0.6 * smooth((t - 0.7) / 0.2) };
  const out = 1 - (t - 0.9) / 0.1;
  return { balls: tips, opacity: out, glow: out };
}

// Öndeyken dur ve parılda · üstten arkaya git · arkada parılda · alttan öne dön.
function mirrorFrame(t?: number) {
  const front: Pt = [114, 110];
  const back: Pt = [186, 110];
  if (t === undefined) return { x: 150, y: 110, r: 6, z: 1, front: 0.5, back: 0.5 };
  const glow = (x: number) => Math.sin(Math.PI * Math.min(1, Math.max(0, x)));
  let u: number;
  let lift: number;
  let f = 0;
  let b = 0;
  if (t < 0.2) { u = 0; lift = 0; f = glow(t / 0.2); }
  else if (t < 0.5) { u = smooth((t - 0.2) / 0.3); lift = -1; }
  else if (t < 0.7) { u = 1; lift = 0; b = glow((t - 0.5) / 0.2); }
  else { u = 1 - smooth((t - 0.7) / 0.3); lift = 1; }
  const [x] = lerp(front, back, u);
  const y = 110 + lift * 18 * Math.sin(Math.PI * u);
  const z = 1 - u;
  return { x, y, r: 4.5 + 1.8 * z, z, front: f, back: b };
}

const ECHO_RADII = [44, 72, 100, 128];
const arc = (r: number) => `M ${96 + r * 0.6} ${120 - r * 0.8} A ${r} ${r} 0 0 1 ${96 + r * 0.6} ${120 + r * 0.8}`;

// 0–0.2 kaynak parlar · 0.2–0.8 halkalar içten dışa sırayla yanar · sonra sessizlik.
function echoFrame(t?: number): { source: number; arcs: number[] } {
  if (t === undefined) return { source: 1, arcs: [0.6, 0.35, 0.2, 0.1] };
  const source = t < 0.2 ? smooth(t / 0.2) : t < 0.85 ? 1 - 0.6 * smooth((t - 0.2) / 0.65) : 0.4 * (1 - (t - 0.85) / 0.15);
  const arcs = ECHO_RADII.map((_, i) => {
    const center = 0.28 + i * 0.14;
    const x = Math.abs(t - center) / 0.11;
    return x >= 1 ? 0 : smooth(1 - x);
  });
  return { source, arcs };
}

const STONES: [number, number, number, number][] = [
  [150, 214, 46, 12], [128, 176, 36, 9], [164, 146, 28, 7], [140, 122, 21, 5], [156, 104, 15, 4],
];

function stonesFrame(t?: number): { active: number; fade: number } {
  if (t === undefined) return { active: 1, fade: 1 };
  const slots = STONES.length + 1; // son yuva: kısa bir durak
  const x = t * slots;
  const active = Math.floor(x);
  return { active, fade: Math.min(1, (x - active) * 3) };
}

// requestAnimationFrame ile döngü; reduce motion açıksa durur.
function useLoop(ms: number, enabled: boolean) {
  const [t, setT] = useState<number | undefined>(undefined);
  useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    let alive = true;
    const start = Date.now();
    AccessibilityInfo.isReduceMotionEnabled().catch(() => false).then(reduce => {
      if (reduce || !alive) return;
      const tick = () => {
        setT(((Date.now() - start) % ms) / ms);
        raf = requestAnimationFrame(tick);
      };
      tick();
    });
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
    };
  }, [ms, enabled]);
  return t;
}

function StaticArt({ name, height, t }: { name: ArtName; height: number; t?: number }) {
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
      {render(name, p, t)}
    </Svg>
  );
}

function render(name: ArtName, p: string, t?: number) {
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
    // Ayna: altın top öndeki düşünceyle arkadaki yansıması arasında gidip gelir;
    // hangisindeyse o parıldar. Arkaya giderken küçülür, soluklaşır.
    case 'mirror': {
      const m = mirrorFrame(t);
      const ball = (
        <G opacity={0.55 + 0.45 * m.z}>
          <Circle cx={m.x} cy={m.y} r={m.r * 2} fill={C.gold} opacity={0.18} />
          <Circle cx={m.x} cy={m.y} r={m.r} fill={C.gold} />
        </G>
      );
      return (
        <G>
          <Circle cx={150} cy={110} r={92} fill={gold} opacity={0.3} mask={fade} />
          <Ellipse cx={186} cy={110} rx={46} ry={66} stroke={C.lilac} strokeWidth={1.2} strokeDasharray="1 5" fill="none" />
          <Ellipse cx={186} cy={110} rx={46} ry={66} fill={gold} opacity={0.4 * m.back} />
          <Ellipse cx={186} cy={110} rx={46} ry={66} stroke={C.gold} strokeOpacity={0.25 * m.back} strokeWidth={10} fill="none" />
          <Ellipse cx={186} cy={110} rx={46} ry={66} stroke={C.gold} strokeOpacity={m.back} strokeWidth={2} strokeDasharray="2 4" fill="none" />
          {m.z < 0.5 && ball}
          <Ellipse cx={114} cy={110} rx={46} ry={66} fill={lilac} opacity={0.7} />
          <Ellipse cx={114} cy={110} rx={46} ry={66} fill={gold} opacity={0.5 * m.front} />
          <Ellipse cx={114} cy={110} rx={46} ry={66} stroke={C.coral} strokeOpacity={0.18 + 0.2 * m.front} strokeWidth={8} fill="none" />
          <Ellipse cx={114} cy={110} rx={46} ry={66} stroke={C.coral} strokeWidth={2} fill="none" />
          <Ellipse cx={114} cy={110} rx={46} ry={66} stroke={C.gold} strokeOpacity={0.25 * m.front} strokeWidth={10} fill="none" />
          <Ellipse cx={114} cy={110} rx={46} ry={66} stroke={C.gold} strokeOpacity={m.front} strokeWidth={2} fill="none" />
          {m.z >= 0.5 && ball}
        </G>
      );
    }
    // Çatal yol: tek bir ışık gövdeden yükselir, ayrım noktasında üç ihtimale bölünür.
    case 'fork': {
      const f = forkFrame(t);
      return (
        <G>
          <Rect x={0} y={196} width={300} height={44} fill={lilac} opacity={0.6} />
          <GlowPath d={`M 150 214 L ${SPLIT[0]} ${SPLIT[1]}`} color={C.coral} w={2} />
          {BRANCHES.map(br => (
            <GlowPath key={br.d} d={br.d} color={C.coral} w={2} />
          ))}
          <Circle cx={150} cy={36} r={34} fill={gold} opacity={0.6 * f.glow} mask={fade} />
          {BRANCHES.map(br => (
            <G key={br.d}>
              <Circle cx={br.tip[0]} cy={br.tip[1]} r={10} stroke={C.ink} strokeOpacity={0.25} fill="none" />
              <Circle cx={br.tip[0]} cy={br.tip[1]} r={14} fill={C.gold} opacity={0.18 * f.glow} />
            </G>
          ))}
          <Circle cx={SPLIT[0]} cy={SPLIT[1]} r={4} fill={C.ink} />
          {f.balls.map(([x, y], i) => (
            <G key={i} opacity={f.opacity}>
              <Circle cx={x} cy={y} r={11} fill={C.gold} opacity={0.18} />
              <Circle cx={x} cy={y} r={6} fill={C.gold} />
            </G>
          ))}
        </G>
      );
    }
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
    // Basamak taşları: altın ışık taştan taşa, yakından uzağa sırayla ilerler.
    case 'stones': {
      const st = stonesFrame(t);
      return (
        <G>
          <Rect x={0} y={150} width={300} height={90} fill={lilac} opacity={0.35} />
          {STONES.map(([x, y, rx, ry], i) => {
            const lit = i === st.active ? st.fade : i < st.active ? 0.22 : 0;
            return (
              <G key={i}>
                <Ellipse cx={x} cy={y} rx={rx} ry={ry} fill={C.bg} />
                <Ellipse cx={x} cy={y} rx={rx} ry={ry} fill={gold} opacity={lit} />
                <Ellipse cx={x} cy={y} rx={rx} ry={ry} stroke={C.coral} strokeOpacity={0.7 - i * 0.1} strokeWidth={1.4} fill="none" />
                <Ellipse cx={x} cy={y} rx={rx} ry={ry} stroke={C.gold} strokeOpacity={i === st.active ? st.fade : 0} strokeWidth={1.6} fill="none" />
              </G>
            );
          })}
          <Circle cx={156} cy={58} r={30} fill={gold} opacity={0.5} mask={fade} />
          <Circle cx={156} cy={58} r={6} fill={C.gold} />
        </G>
      );
    }
    // Yankı: kaynakta bir çağrı toplanır, ışık halkalar boyunca sırayla dışa yayılır.
    case 'echo': {
      const e = echoFrame(t);
      return (
        <G>
          <Defs>
            {/* Solma maskesi kaynağın kendi merkezinde: hale yuvarlak kalsın. */}
            <Mask id={`${p}-src`}>
              <Circle cx={96} cy={120} r={46} fill={`url(#${p}-fg)`} />
            </Mask>
          </Defs>
          <Circle cx={96} cy={120} r={46} fill={gold} opacity={0.3 + 0.6 * e.source} mask={`url(#${p}-src)`} />
          {ECHO_RADII.map((r, i) => {
            const d = arc(r);
            return (
              <G key={r}>
                <Path d={d} stroke={i === 0 ? C.coral : C.lilac} strokeOpacity={i === 0 ? 0.9 : 0.75 - i * 0.18}
                  strokeWidth={i === 0 ? 2 : 1.4} strokeDasharray={i === 2 ? '1 5' : undefined} strokeLinecap="round" fill="none" />
                <Path d={d} stroke={C.gold} strokeOpacity={0.22 * e.arcs[i]} strokeWidth={10} strokeLinecap="round" fill="none" />
                <Path d={d} stroke={C.gold} strokeOpacity={e.arcs[i]} strokeWidth={2.2} strokeLinecap="round" fill="none" />
              </G>
            );
          })}
          <Circle cx={96} cy={120} r={12} fill={C.gold} opacity={0.2 * e.source} />
          <Circle cx={96} cy={120} r={7} fill={C.gold} />
        </G>
      );
    }
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

const SCENE: Partial<Record<ArtName, number>> = { fork: 5500, stones: 4800, echo: 4500, mirror: 7000 };

const MOTION: Partial<Record<ArtName, Motion>> = {
  breath: { inMs: 4000, outMs: 6000, scale: [0.88, 1.06], opacity: [0.75, 1] },
  lens: { inMs: 5000, outMs: 5000, tx: [-6, 6], ty: [3, -3], rotate: ['-3deg', '3deg'] },
  layers: { inMs: 5000, outMs: 5000, ty: [-4, 4] },
  window: { inMs: 6000, outMs: 6000, scale: [0.985, 1.015], opacity: [0.85, 1] },
};

const ease = Easing.inOut(Easing.sin);
const native = Platform.OS !== 'web';

export function Art({ name, height = 220, cue }: { name: ArtName; height?: number; cue?: boolean }) {
  const t = useRef(new Animated.Value(0)).current;
  const [phase, setPhase] = useState<'in' | 'out'>('in');
  const m = MOTION[name];
  const sceneT = useLoop(SCENE[name] ?? 1000, SCENE[name] !== undefined);

  useEffect(() => {
    if (!m) return;
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

  if (!m) {
    return <StaticArt name={name} height={height} t={sceneT} />;
  }

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
