import React from 'react';
import Svg, {
  Circle, Defs, Ellipse, G, Line, Mask, Path, Pattern, RadialGradient, Rect, Stop,
} from 'react-native-svg';
import { C } from '../theme/tokens';

// Yarım ton (halftone) nokta dokusu: referans kartların imzası.
// Her illüstrasyon kendi id önekini kullanır; web'de çakışma olmasın.

export type ArtName = 'portal' | 'moon' | 'seed' | 'battery' | 'book' | 'path' | 'door' | 'keyhole' | 'mirror';

function Dots({ id, color, step = 6, r = 1.4 }: { id: string; color: string; step?: number; r?: number }) {
  return (
    <Pattern id={id} patternUnits="userSpaceOnUse" width={step} height={step}>
      <Circle cx={step / 2} cy={step / 2} r={r} fill={color} />
    </Pattern>
  );
}

function Fade({ id, cx = '50%', cy = '50%' }: { id: string; cx?: string; cy?: string }) {
  return (
    <>
      <RadialGradient id={`${id}g`} cx={cx} cy={cy} r="50%">
        <Stop offset="0" stopColor="#fff" stopOpacity="1" />
        <Stop offset="0.6" stopColor="#fff" stopOpacity="0.55" />
        <Stop offset="1" stopColor="#fff" stopOpacity="0" />
      </RadialGradient>
    </>
  );
}

// Parlayan çizgi: geniş soluk iz + ince net çizgi.
function GlowPath({ d, color, w = 2.5 }: { d: string; color: string; w?: number }) {
  return (
    <G>
      <Path d={d} stroke={color} strokeOpacity={0.18} strokeWidth={w * 4} fill="none" strokeLinecap="round" />
      <Path d={d} stroke={color} strokeWidth={w} fill="none" strokeLinecap="round" />
    </G>
  );
}

function GlowCircle({ cx, cy, r, color, w = 3 }: { cx: number; cy: number; r: number; color: string; w?: number }) {
  return (
    <G>
      <Circle cx={cx} cy={cy} r={r} stroke={color} strokeOpacity={0.18} strokeWidth={w * 4} fill="none" />
      <Circle cx={cx} cy={cy} r={r} stroke={color} strokeWidth={w} fill="none" />
    </G>
  );
}

function Stars({ seed = 1 }: { seed?: number }) {
  const pts = [
    [24, 30], [270, 40], [60, 150], [250, 170], [150, 20], [210, 110], [35, 210], [285, 220],
  ];
  return (
    <G>
      {pts.map(([x, y], i) => (
        <Circle key={i} cx={(x * (seed + i)) % 300} cy={y} r={i % 3 === 0 ? 1.4 : 0.9}
          fill={i % 4 === 0 ? C.coral : i % 3 === 0 ? C.gold : C.ink} opacity={0.55} />
      ))}
    </G>
  );
}

// Basit insan silueti; merkez (x, y) ayak hizası.
function Figure({ x, y, s = 1, fill = C.bg, stroke = C.coral, armsUp = false }: {
  x: number; y: number; s?: number; fill?: string; stroke?: string; armsUp?: boolean;
}) {
  const body = armsUp
    ? `M ${-6} ${-48} L ${-24} ${-80} M 6 -48 L 24 -80 M -8 -50 L 8 -50 L 8 -20 L 5 0 M -8 -50 L -8 -20 L -5 0`
    : `M -7 -44 Q 0 -48 7 -44 L 8 -20 L 4 -20 L 3 0 M -7 -44 L -8 -20 L -4 -20 L -3 0`;
  return (
    <G transform={`translate(${x} ${y}) scale(${s})`}>
      <Circle cx={0} cy={armsUp ? -60 : -52} r={6} fill={fill} stroke={stroke} strokeWidth={1.4 / s} />
      <Path d={body} fill={fill} stroke={stroke} strokeWidth={(armsUp ? 9 : 1.4) / s} strokeLinecap="round"
        strokeLinejoin="round" strokeOpacity={armsUp ? 0.9 : 1} />
    </G>
  );
}

export function Art({ name, height = 240 }: { name: ArtName; height?: number }) {
  const p = name; // id öneki
  return (
    <Svg width="100%" height={height} viewBox="0 0 300 240">
      <Defs>
        <Dots id={`${p}-gd`} color={C.gold} />
        <Dots id={`${p}-ld`} color={C.lilac} step={5} r={1.2} />
        <Dots id={`${p}-cd`} color={C.coral} step={5} r={1.5} />
        <Fade id={`${p}-f`} />
        <Mask id={`${p}-m`}>
          <Rect x="0" y="0" width="300" height="240" fill={`url(#${p}-fg)`} />
        </Mask>
      </Defs>
      <Stars seed={name.length} />
      {render(name, p)}
    </Svg>
  );
}

function render(name: ArtName, p: string) {
  const gold = `url(#${p}-gd)`;
  const lilac = `url(#${p}-ld)`;
  const coral = `url(#${p}-cd)`;
  switch (name) {
    case 'portal':
      return (
        <G>
          <Circle cx={150} cy={78} r={74} fill={gold} opacity={0.5} mask={`url(#${p}-m)`} />
          <Circle cx={150} cy={78} r={40} fill={C.bg} />
          <GlowCircle cx={150} cy={78} r={40} color={C.coral} />
          <Rect x={0} y={190} width={300} height={50} fill={lilac} opacity={0.6} />
          <GlowPath d="M 0 192 L 90 188 L 130 190 M 170 190 L 220 186 L 300 189" color={C.coral} w={1.2} />
          <Path d="M 118 200 L 118 150 A 32 32 0 0 1 182 150 L 182 200" stroke={C.lilac} strokeWidth={1.5} fill="none" />
          <Path d="M 126 196 L 126 154 A 24 24 0 0 1 174 154 L 174 196 Z" fill={gold} />
          <GlowPath d="M 126 196 L 126 154 A 24 24 0 0 1 174 154 L 174 196" color={C.coral} w={2} />
          <Path d="M 126 196 L 80 236 L 220 236 L 174 196 Z" fill={gold} opacity={0.35} />
          <Figure x={150} y={222} s={0.55} />
        </G>
      );
    case 'moon':
      return (
        <G>
          <Circle cx={150} cy={120} r={100} stroke={C.lilac} strokeOpacity={0.5} strokeWidth={1} fill="none" />
          <Circle cx={150} cy={120} r={80} stroke={C.lilac} strokeWidth={1.4} strokeDasharray="1 5" fill="none" />
          <Path d="M 150 62 A 58 58 0 0 0 150 178 A 46 58 0 0 1 150 62 Z" fill={lilac} />
          <GlowCircle cx={150} cy={120} r={58} color={C.coral} />
          <Circle cx={150} cy={120} r={26} fill={gold} mask={`url(#${p}-m)`} />
          <Circle cx={150} cy={120} r={7} fill={C.gold} />
        </G>
      );
    case 'seed': {
      const ring = Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
        return [150 + Math.cos(a) * 92, 120 + Math.sin(a) * 92];
      });
      const petals = Array.from({ length: 6 }, (_, i) => {
        const a = (i / 6) * Math.PI * 2;
        return [150 + Math.cos(a) * 22, 120 + Math.sin(a) * 22];
      });
      return (
        <G>
          <Circle cx={150} cy={120} r={92} stroke={C.lilac} strokeWidth={1} strokeDasharray="1 6" fill="none" />
          {ring.map(([x, y], i) => (
            <G key={i}>
              <Circle cx={x} cy={y} r={9} fill={lilac} />
              <Circle cx={x} cy={y} r={9} stroke={C.coral} strokeWidth={1.4} fill="none" />
            </G>
          ))}
          <Circle cx={150} cy={120} r={22} stroke={C.gold} strokeWidth={1.4} fill="none" />
          {petals.map(([x, y], i) => (
            <Circle key={i} cx={x} cy={y} r={22} stroke={C.gold} strokeWidth={1.4} fill="none" />
          ))}
          <Circle cx={150} cy={120} r={5} fill={C.gold} />
        </G>
      );
    }
    case 'battery':
      return (
        <G>
          <Path d="M 120 0 L 180 0 L 250 214 L 50 214 Z" fill={gold} opacity={0.45} />
          <Ellipse cx={150} cy={214} rx={92} ry={12} stroke={C.lilac} strokeOpacity={0.6} strokeWidth={1.2} fill="none" />
          <Ellipse cx={150} cy={214} rx={58} ry={7} stroke={C.lilac} strokeWidth={1.6} fill="none" />
          <Figure x={150} y={212} s={1.5} fill={coral} stroke={C.coral} armsUp />
          <Circle cx={150} cy={150} r={6} fill={C.gold} />
        </G>
      );
    case 'book':
      return (
        <G>
          <Circle cx={150} cy={64} r={48} fill={gold} opacity={0.55} mask={`url(#${p}-m)`} />
          <Path d="M 150 30 Q 154 60 182 64 Q 154 68 150 98 Q 146 68 118 64 Q 146 60 150 30 Z" fill={C.gold} />
          <Path d="M 150 100 Q 160 130 152 160" stroke={C.gold} strokeWidth={2} strokeDasharray="2 6" strokeLinecap="round" fill="none" />
          <Path d="M 40 160 Q 95 152 150 162 L 150 222 Q 95 212 40 220 Z" fill={lilac} />
          <Path d="M 260 160 Q 205 152 150 162 L 150 222 Q 205 212 260 220 Z" fill={lilac} />
          <GlowPath d="M 40 160 Q 95 152 150 162 Q 205 152 260 160 L 260 220 Q 205 212 150 222 Q 95 212 40 220 Z" color={C.coral} w={1.6} />
          <Line x1={60} y1={180} x2={130} y2={182} stroke={C.gold} strokeWidth={1} opacity={0.6} />
          <Line x1={60} y1={192} x2={125} y2={194} stroke={C.gold} strokeWidth={1} opacity={0.6} />
          <Line x1={60} y1={204} x2={120} y2={205} stroke={C.gold} strokeWidth={1} opacity={0.6} />
          <GlowPath d="M 190 200 L 250 150" color={C.coral} w={4} />
        </G>
      );
    case 'path':
      return (
        <G>
          <Circle cx={240} cy={52} r={54} fill={gold} opacity={0.55} mask={`url(#${p}-m)`} />
          <Circle cx={240} cy={52} r={26} fill={C.bg} />
          <GlowCircle cx={240} cy={52} r={26} color={C.gold} />
          <Path d="M 0 150 Q 70 120 140 140 Q 210 160 300 110 L 300 240 L 0 240 Z" fill={lilac} opacity={0.75} />
          <GlowPath d="M 40 214 Q 100 190 130 176 Q 150 160 130 120 Q 120 96 160 92 Q 200 90 214 76 L 230 60" color={C.coral} />
          {[[40, 214], [130, 176], [128, 106], [210, 80]].map(([x, y], i) => (
            <G key={i}>
              <Circle cx={x} cy={y} r={9} stroke={C.ink} strokeOpacity={0.3} fill="none" />
              <Circle cx={x} cy={y} r={5.5} fill={C.gold} />
            </G>
          ))}
        </G>
      );
    case 'door':
      return (
        <G>
          <Rect x={0} y={206} width={300} height={34} fill={lilac} opacity={0.6} />
          <Line x1={0} y1={206} x2={300} y2={206} stroke={C.lilac} strokeWidth={1.4} />
          <Path d="M 180 206 L 110 240 L 300 240 L 250 206 Z" fill={gold} opacity={0.35} />
          <Rect x={176} y={74} width={78} height={132} stroke={C.coral} strokeWidth={1.6} fill="none" />
          <Rect x={186} y={84} width={58} height={122} fill={gold} />
          <Rect x={186} y={84} width={58} height={122} stroke={C.gold} strokeWidth={2} fill="none" />
          <G transform="translate(104 206)">
            <Circle cx={0} cy={-84} r={11} fill={coral} stroke={C.coral} strokeWidth={1} />
            <Path d="M -10 -70 L 10 -70 L 22 -40 M -10 -70 L -22 -42 M -8 -70 L -8 -32 L -26 0 M 8 -70 L 8 -32 L 22 0"
              stroke={C.coral} strokeWidth={9} strokeOpacity={0.85} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </G>
          <Ellipse cx={138} cy={206} rx={16} ry={3} fill={C.gold} />
        </G>
      );
    case 'keyhole':
      return (
        <G>
          <Circle cx={150} cy={90} r={88} stroke={C.lilac} strokeOpacity={0.6} strokeWidth={1} fill="none" />
          <Circle cx={150} cy={90} r={74} stroke={C.lilac} strokeWidth={1.4} strokeDasharray="1 5" fill="none" />
          <Path d="M 128 110 L 98 232 L 202 232 L 172 110 Z" fill={gold} opacity={0.5} />
          <Circle cx={150} cy={90} r={58} fill={gold} opacity={0.45} />
          <GlowCircle cx={150} cy={90} r={58} color={C.coral} />
          <Circle cx={150} cy={78} r={16} fill={C.gold} />
          <Figure x={150} y={226} s={0.6} />
        </G>
      );
    case 'mirror':
      return (
        <G>
          <Circle cx={150} cy={110} r={92} fill={gold} opacity={0.3} mask={`url(#${p}-m)`} />
          <Ellipse cx={120} cy={110} rx={52} ry={72} fill={lilac} opacity={0.7} />
          <Ellipse cx={180} cy={110} rx={52} ry={72} stroke={C.lilac} strokeWidth={1.2} strokeDasharray="1 5" fill="none" />
          <GlowPath d="M 120 38 A 52 72 0 1 0 120.1 38" color={C.coral} w={2} />
          <Circle cx={150} cy={110} r={6} fill={C.gold} />
        </G>
      );
  }
}
