// Işık Yolu: sakin bir uzamsal bellek oyunu (Corsi blok görevinden esinli).
// Süre yok, puan yok, kaybetmek yok. Yol, kişinin kendi sınırına göre uzar ya da kısalır.

export const GRID = 4;
export const ROUNDS = 7;
export const MIN_SPAN = 3;
export const MAX_SPAN = 9;

export type Star = { id: number; x: number; y: number }; // 0–1 aralığında konum

// Basit, tekrarlanabilir rastgelelik: her tur aynı tohumdan aynı gökyüzü.
function rng(seed: number) {
  let s = seed % 2147483647 || 1;
  return () => (s = (s * 48271) % 2147483647) / 2147483647;
}

// Izgara hücrelerinin ortasına hafif kaydırılmış yıldızlar: düzenli ama takımyıldız gibi.
export function makeSky(seed: number): Star[] {
  const r = rng(seed);
  const cell = 1 / GRID;
  return Array.from({ length: GRID * GRID }, (_, i) => {
    const cx = (i % GRID) + 0.5;
    const cy = Math.floor(i / GRID) + 0.5;
    return {
      id: i,
      x: (cx + (r() - 0.5) * 0.45) * cell,
      y: (cy + (r() - 0.5) * 0.45) * cell,
    };
  });
}

// Tekrarsız yol; ardışık yıldızlar çok uzak olmasın ki çizgi sakin aksın.
export function makePath(sky: Star[], span: number, seed: number): number[] {
  const r = rng(seed * 7 + 3);
  const path = [Math.floor(r() * sky.length)];
  while (path.length < span) {
    const last = sky[path[path.length - 1]];
    const options = sky
      .filter(s => !path.includes(s.id))
      .map(s => ({ s, d: Math.hypot(s.x - last.x, s.y - last.y) }))
      .sort((a, b) => a.d - b.d)
      .slice(0, 6);
    path.push(options[Math.floor(r() * options.length)].s.id);
  }
  return path;
}

// Hatasız tur → bir yıldız uzar. İki ve üstü yanlış → bir kısalır. Arada → aynı kalır.
export function nextSpan(span: number, mistakes: number) {
  if (mistakes === 0) return Math.min(MAX_SPAN, span + 1);
  if (mistakes >= 2) return Math.max(MIN_SPAN, span - 1);
  return span;
}

// Yol beşe ulaşınca çift turlar tersinden: aynı yola öbür uçtan bakmak.
export const isReverse = (round: number, span: number) => span >= 5 && round % 2 === 1;

export const CLOSINGS: Record<'tr' | 'en', string[]> = {
  tr: [
    'Dikkat bir kas gibi; dinlenince güçlenir.',
    'Bugünlük bu kadar yeter, galiba.',
    'Yol uzadıkça değil, sakin kaldıkça güçlenirsin.',
  ],
  en: [
    'Attention is like a muscle; it grows stronger with rest.',
    'That is enough for today, galiba.',
    'You grow stronger not as the path gets longer, but as you stay calm.',
  ],
};
