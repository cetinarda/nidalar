// İhtimal Aynası: kesinlik kelimeleri ve hazır ihtimaller.

export const CERTAINTY_WORDS = [
  'her zaman', 'hep', 'asla', 'hiçbir zaman', 'hiç', 'herkes', 'hiç kimse', 'kimse',
  'kesinlikle', 'kesin', 'mutlaka', 'başka yolu yok', 'tamamen', 'bilerek', 'zaten', 'hiçbir şey',
];

const lower = (s: string) => s.toLocaleLowerCase('tr-TR');

// Metni kesinlik kelimeleri ve sade parçalar olarak böler (en uzun eşleşme önce).
export function splitCertainty(text: string): { t: string; hit: boolean }[] {
  const words = [...CERTAINTY_WORDS].sort((a, b) => b.length - a.length);
  const low = lower(text);
  const out: { t: string; hit: boolean }[] = [];
  let i = 0;
  let buf = '';
  const boundary = (ch: string | undefined) => !ch || !/[a-zçğıöşüâîû]/i.test(ch);
  while (i < text.length) {
    const w = words.find(w => low.startsWith(w, i) && boundary(low[i - 1]) && boundary(low[i + w.length]));
    if (w) {
      if (buf) out.push({ t: buf, hit: false });
      out.push({ t: text.slice(i, i + w.length), hit: true });
      buf = '';
      i += w.length;
    } else {
      buf += text[i];
      i += 1;
    }
  }
  if (buf) out.push({ t: buf, hit: false });
  return out;
}

export const ALTERNATIVES = [
  'Onun da bilmediğim bir derdi olabilir.',
  'Koşullar onu da zorluyor olabilir.',
  'Geçmiş deneyimlerim yorumumu etkiliyor olabilir.',
  'Henüz emin değilim; daha fazla gözleme ihtiyacım var.',
];

export const BRIDGES = [
  'Bunu nasıl yorumladığımı seçebilirim.',
  'Henüz bilmiyorum ve bu da tamam.',
  'Kendime ve ona biraz daha alan açabilirim.',
];
