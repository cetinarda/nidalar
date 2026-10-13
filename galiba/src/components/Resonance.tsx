import React, { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';
import Svg, { Circle, Defs, G, Path, Pattern, RadialGradient, Stop, Mask, Rect } from 'react-native-svg';
import { useLoop } from './Art';
import { C } from '../theme/tokens';

// Rezonans görselleri: gizemli küre (dokunuş) ve üç yolun birleştiği nokta (okuma).
// Renkler: kalp = mercan, beden = lila, zihin = altın.
export const CHANNEL_COLOR = { kalp: C.coral, beden: C.lilac, zihin: C.gold } as const;

const TAU = Math.PI * 2;

function Defaults({ p }: { p: string }) {
  return (
    <Defs>
      <Pattern id={`${p}-gd`} patternUnits="userSpaceOnUse" width={6} height={6}>
        <Circle cx={3} cy={3} r={1.4} fill={C.gold} />
      </Pattern>
      <RadialGradient id={`${p}-fg`} cx="50%" cy="50%" r="50%">
        <Stop offset="0" stopColor="#fff" stopOpacity="1" />
        <Stop offset="0.6" stopColor="#fff" stopOpacity="0.5" />
        <Stop offset="1" stopColor="#fff" stopOpacity="0" />
      </RadialGradient>
    </Defs>
  );
}

// Küre: ağır çekimde dönen üç ışık, yavaşça nefes alan bir çekirdek.
// progress (0–1) basılı tutuldukça dolan halka; arttıkça ışıklar çekirdeğe yaklaşır.
export function Orb({ progress, size = 260 }: { progress: number; size?: number }) {
  const t = useLoop(16000, true) ?? 0; // tam tur 16 sn: ağır çekim
  const breath = 0.5 + 0.5 * Math.sin(t * TAU * 2);
  const cx = 150;
  const cy = 150;
  const orbit = 92 - 40 * progress;
  const lights: [keyof typeof CHANNEL_COLOR, number][] = [['kalp', 0], ['beden', 1 / 3], ['zihin', 2 / 3]];
  const arc = (p: number) => {
    if (p <= 0) return '';
    const a = Math.min(p, 0.9999) * TAU;
    const r = 118;
    const x = cx + r * Math.sin(a);
    const y = cy - r * Math.cos(a);
    return `M ${cx} ${cy - r} A ${r} ${r} 0 ${a > Math.PI ? 1 : 0} 1 ${x} ${y}`;
  };
  return (
    <Svg width={size} height={size} viewBox="0 0 300 300">
      <Defaults p="orb" />
      <Defs>
        <Mask id="orb-m">
          <Circle cx={cx} cy={cy} r={110} fill="url(#orb-fg)" />
        </Mask>
      </Defs>
      <Circle cx={cx} cy={cy} r={110} fill="url(#orb-gd)" opacity={0.25 + 0.35 * progress + 0.1 * breath} mask="url(#orb-m)" />
      <Circle cx={cx} cy={cy} r={118} stroke={C.lilac} strokeOpacity={0.35} strokeWidth={1} strokeDasharray="1 6" fill="none" />
      <Circle cx={cx} cy={cy} r={orbit} stroke={C.ink} strokeOpacity={0.08} strokeWidth={1} fill="none" />
      {progress > 0 && (
        <G>
          <Path d={arc(progress)} stroke={C.gold} strokeOpacity={0.2} strokeWidth={10} strokeLinecap="round" fill="none" />
          <Path d={arc(progress)} stroke={C.gold} strokeWidth={2} strokeLinecap="round" fill="none" />
        </G>
      )}
      {lights.map(([k, off]) => {
        const a = (t + off) * TAU;
        const x = cx + orbit * Math.cos(a);
        const y = cy + orbit * Math.sin(a) * 0.55;
        return (
          <G key={k}>
            <Circle cx={x} cy={y} r={12} fill={CHANNEL_COLOR[k]} opacity={0.18 + 0.2 * progress} />
            <Circle cx={x} cy={y} r={5} fill={CHANNEL_COLOR[k]} />
          </G>
        );
      })}
      <Circle cx={cx} cy={cy} r={34 + 6 * breath} stroke={C.coral} strokeOpacity={0.18} strokeWidth={10} fill="none" />
      <Circle cx={cx} cy={cy} r={34 + 6 * breath} stroke={C.coral} strokeWidth={1.6} fill="none" />
      <Circle cx={cx} cy={cy} r={7 + 5 * progress} fill={C.gold} />
    </Svg>
  );
}

// Birleşme: üç ışık üç köşeden kendi yolunda ilerler, tek noktada buluşur.
// Noktanın parlaklığı rezonansa (0–1), rengi uyuma göre.
const VERTS = {
  kalp: { from: [58, 64], ctrl: [70, 150] },
  zihin: { from: [242, 64], ctrl: [230, 150] },
  beden: { from: [150, 262], ctrl: [96, 210] },
} as const;
const CENTER: [number, number] = [150, 160];
const smooth = (x: number) => x * x * (3 - 2 * x);
const quad = (a: readonly number[], c: readonly number[], b: readonly number[], u: number) => [
  (1 - u) * (1 - u) * a[0] + 2 * (1 - u) * u * c[0] + u * u * b[0],
  (1 - u) * (1 - u) * a[1] + 2 * (1 - u) * u * c[1] + u * u * b[1],
];

export function Convergence({ scores, level, onDone, size = 280 }: {
  scores: Record<'kalp' | 'beden' | 'zihin', number>;
  level: number;
  onDone?: () => void;
  size?: number;
}) {
  const [t, setT] = useState(0);
  useEffect(() => {
    let raf = 0;
    let alive = true;
    const start = Date.now();
    const DURATION = 5200;
    AccessibilityInfo.isReduceMotionEnabled().catch(() => false).then(reduce => {
      if (!alive) return;
      if (reduce) {
        setT(1);
        onDone?.();
        return;
      }
      const tick = () => {
        const x = Math.min(1, (Date.now() - start) / DURATION);
        setT(x);
        if (x < 1) raf = requestAnimationFrame(tick);
        else onDone?.();
      };
      tick();
    });
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Her kanal sırayla yola çıkar; cevabı ne kadar olumluysa ışığı o kadar parlak.
  const order: (keyof typeof VERTS)[] = ['kalp', 'beden', 'zihin'];
  const meet = smooth(Math.max(0, (t - 0.7) / 0.3));
  const allUp = scores.kalp > 0 && scores.beden > 0 && scores.zihin > 0;
  const allDown = scores.kalp < 0 && scores.beden < 0 && scores.zihin < 0;
  const centerColor = allUp ? C.gold : allDown ? C.coral : C.lilac;

  return (
    <Svg width={size} height={size} viewBox="0 0 300 300">
      <Defaults p="cv" />
      <Defs>
        <Mask id="cv-m">
          <Circle cx={CENTER[0]} cy={CENTER[1]} r={80} fill="url(#cv-fg)" />
        </Mask>
      </Defs>
      <Circle cx={CENTER[0]} cy={CENTER[1]} r={80} fill="url(#cv-gd)" opacity={0.15 + 0.6 * level * meet} mask="url(#cv-m)" />
      {order.map((k, i) => {
        const v = VERTS[k];
        const local = smooth(Math.min(1, Math.max(0, (t - i * 0.12) / 0.6)));
        const brightness = 0.45 + 0.55 * ((scores[k] + 2) / 4);
        const d = `M ${v.from[0]} ${v.from[1]} Q ${v.ctrl[0]} ${v.ctrl[1]} ${CENTER[0]} ${CENTER[1]}`;
        const [x, y] = quad(v.from, v.ctrl, CENTER, local);
        return (
          <G key={k}>
            <Path d={d} stroke={CHANNEL_COLOR[k]} strokeOpacity={0.18} strokeWidth={1.2} strokeDasharray="1 5" fill="none" />
            <Circle cx={v.from[0]} cy={v.from[1]} r={10} stroke={CHANNEL_COLOR[k]} strokeOpacity={0.35} fill="none" />
            {/* geçilen yol parlar */}
            <Path d={d} stroke={CHANNEL_COLOR[k]} strokeOpacity={brightness} strokeWidth={2}
              strokeDasharray={`${local * 240} 400`} strokeLinecap="round" fill="none" />
            {meet < 1 && (
              <G opacity={1 - meet}>
                <Circle cx={x} cy={y} r={12} fill={CHANNEL_COLOR[k]} opacity={0.2 * brightness} />
                <Circle cx={x} cy={y} r={5.5} fill={CHANNEL_COLOR[k]} opacity={brightness} />
              </G>
            )}
          </G>
        );
      })}
      <Circle cx={CENTER[0]} cy={CENTER[1]} r={6 + 22 * meet * level} fill={centerColor} opacity={0.18 * meet} />
      <Circle cx={CENTER[0]} cy={CENTER[1]} r={4 + 6 * meet} fill={centerColor} opacity={0.4 + 0.6 * meet * Math.max(0.35, level)} />
    </Svg>
  );
}
