// İhtimal Aynası: kesinlik kelimeleri ve hazır ihtimaller (TR / EN).
import type { Lang } from '../i18n';

export const CERTAINTY_WORDS: Record<Lang, string[]> = {
  tr: [
    'her zaman', 'hep', 'asla', 'hiçbir zaman', 'hiç', 'herkes', 'hiç kimse', 'kimse',
    'kesinlikle', 'kesin', 'mutlaka', 'başka yolu yok', 'tamamen', 'bilerek', 'zaten', 'hiçbir şey',
  ],
  en: [
    'always', 'never', 'everyone', 'everybody', 'no one', 'nobody', 'nothing', 'everything',
    'definitely', 'certainly', 'completely', 'totally', 'on purpose', 'must', 'no other way', 'ever',
  ],
};

const localeOf = (lang: Lang) => (lang === 'tr' ? 'tr-TR' : 'en-GB');

// Metni kesinlik kelimeleri ve sade parçalar olarak böler (en uzun eşleşme önce).
// Dil verilmezse iki dilin kelimeleri birlikte aranır.
export function splitCertainty(text: string, lang?: Lang): { t: string; hit: boolean }[] {
  const pool = lang ? CERTAINTY_WORDS[lang] : [...CERTAINTY_WORDS.tr, ...CERTAINTY_WORDS.en];
  const words = [...pool].sort((a, b) => b.length - a.length);
  const low = text.toLocaleLowerCase(localeOf(lang ?? 'tr'));
  const out: { t: string; hit: boolean }[] = [];
  let i = 0;
  let buf = '';
  const boundary = (ch: string | undefined) => !ch || !/[a-zçğıöşüâîû']/i.test(ch);
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

export const ALTERNATIVES: Record<Lang, string[]> = {
  tr: [
    'Onun da bilmediğim bir derdi olabilir.',
    'Koşullar onu da zorluyor olabilir.',
    'Geçmiş deneyimlerim yorumumu etkiliyor olabilir.',
    'Henüz emin değilim; daha fazla gözleme ihtiyacım var.',
  ],
  en: [
    'They may be dealing with something I don’t know about.',
    'Circumstances may be pressing on them too.',
    'My past experiences may be shaping how I read this.',
    'I’m not sure yet; I need to observe more.',
  ],
};

export const BRIDGES: Record<Lang, string[]> = {
  tr: [
    'Bunu nasıl yorumladığımı seçebilirim.',
    'Henüz bilmiyorum ve bu da tamam.',
    'Kendime ve ona biraz daha alan açabilirim.',
  ],
  en: [
    'I can choose how I interpret this.',
    'I don’t know yet, and that’s okay.',
    'I can make a little more room for myself and for them.',
  ],
};
