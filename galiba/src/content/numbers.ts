// Günün sayıları: gün · ay · yılın rakam toplamı, bir de günün indirgenmiş sayısı.
// Sayılar bir semboldür; dikkati toplar, kehanet değildir.

import type { Lang } from '../i18n';

const digitSum = (n: number) => String(n).split('').reduce((a, c) => a + Number(c), 0);

function reduce(n: number): number {
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) n = digitSum(n);
  return n;
}

// "ayın 11'i", "ayın 20'si" — sayının okunuşundaki son kelimeye göre ek.
const UNIT = ['', "'i", "'si", "'ü", "'ü", "'i", "'sı", "'si", "'i", "'u"];
const TEN = ['', "'u", "'si", "'u"];
const possessive = (n: number) => `${n}${n % 10 ? UNIT[n % 10] : TEN[n / 10]}`;

const MEANINGS_TR: Record<number, { word: string; line: string }> = {
  1: { word: 'Başlangıç', line: 'Tanıdık bir şeye ilk kez bakar gibi bakmak için iyi bir gün, galiba.' },
  2: { word: 'Denge', line: 'İki tarafı da dinlemek için iyi bir gün.' },
  3: { word: 'İfade', line: 'Söylemeden önce bir ihtimal daha ekle.' },
  4: { word: 'Zemin', line: 'Bildiğinle varsaydığını ayırmaya uygun bir gün.' },
  5: { word: 'Değişim', line: 'Fikrini değiştirmene izin ver.' },
  6: { word: 'Özen', line: 'Anlamakla sınır koymak arasında denge kur.' },
  7: { word: 'İç gözlem', line: 'Karar vermeden önce sessizce izle.' },
  8: { word: 'Güç', line: 'Haklı çıkmak yerine anlamayı seç.' },
  9: { word: 'Kapanış', line: 'Taşıdığın bir yargıyı bırakmaya uygun bir gün.' },
  11: { word: 'Sezgi', line: 'Sezgini dinle, ama onu da bir ihtimal say.' },
  22: { word: 'Kurucu', line: 'Küçük bir adım, büyük bir yapının ilk taşıdır.' },
  33: { word: 'Şefkat', line: 'Kendine, başkasına gösterdiğin anlayışı göster.' },
};

const MEANINGS_EN: Record<number, { word: string; line: string }> = {
  1: { word: 'Beginning', line: 'A good day to look at something familiar as if for the first time, galiba.' },
  2: { word: 'Balance', line: 'A good day to listen to both sides.' },
  3: { word: 'Expression', line: 'Before you say it, add one more possibility.' },
  4: { word: 'Ground', line: 'A good day to separate what you know from what you assume.' },
  5: { word: 'Change', line: 'Let yourself change your mind.' },
  6: { word: 'Care', line: 'Balance understanding with setting boundaries.' },
  7: { word: 'Reflection', line: 'Watch quietly before you decide.' },
  8: { word: 'Strength', line: 'Choose understanding over being right.' },
  9: { word: 'Closure', line: 'A good day to let go of a judgment you carry.' },
  11: { word: 'Intuition', line: 'Listen to your intuition, and count it as a possibility too.' },
  22: { word: 'Builder', line: 'A small step is the first stone of a large structure.' },
  33: { word: 'Compassion', line: 'Give yourself the understanding you give others.' },
};

const ordinal = (n: number) => {
  const r = n % 100;
  if (r >= 11 && r <= 13) return `${n}th`;
  return `${n}${['th', 'st', 'nd', 'rd'][n % 10] ?? 'th'}`;
};

export const MEANINGS: Record<Lang, Record<number, { word: string; line: string }>> = { tr: MEANINGS_TR, en: MEANINGS_EN };

export function dayNumbers(date = new Date(), lang: Lang = 'tr') {
  const d = date.getDate();
  const m = date.getMonth() + 1;
  const y = digitSum(date.getFullYear());
  const all = digitSum(d) + digitSum(m) + digitSum(date.getFullYear());
  const n = reduce(all);
  return {
    d, m, y, n,
    symbol: `${d}·${m}·${y}`,
    caption: lang === 'tr'
      ? `ayın ${possessive(d)} · yılın ${m}. ayı · rakamları ${y} eden bir yıl`
      : `the ${ordinal(d)} day · the ${ordinal(m)} month · a year whose digits add to ${y}`,
    meaning: MEANINGS[lang][n],
  };
}
