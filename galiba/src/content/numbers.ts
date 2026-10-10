// Günün sayıları: gün · ay · yılın rakam toplamı, bir de günün indirgenmiş sayısı.
// Sayılar bir semboldür; dikkati toplar, kehanet değildir.

const digitSum = (n: number) => String(n).split('').reduce((a, c) => a + Number(c), 0);

function reduce(n: number): number {
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) n = digitSum(n);
  return n;
}

// "ayın 11'i", "ayın 20'si" — sayının okunuşundaki son kelimeye göre ek.
const UNIT = ['', "'i", "'si", "'ü", "'ü", "'i", "'sı", "'si", "'i", "'u"];
const TEN = ['', "'u", "'si", "'u"];
const possessive = (n: number) => `${n}${n % 10 ? UNIT[n % 10] : TEN[n / 10]}`;

export const MEANINGS: Record<number, { word: string; line: string }> = {
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

export function dayNumbers(date = new Date()) {
  const d = date.getDate();
  const m = date.getMonth() + 1;
  const y = digitSum(date.getFullYear());
  const all = digitSum(d) + digitSum(m) + digitSum(date.getFullYear());
  const n = reduce(all);
  return {
    d, m, y, n,
    symbol: `${d}·${m}·${y}`,
    caption: `ayın ${possessive(d)} · yılın ${m}. ayı · rakamları ${y} eden bir yıl`,
    meaning: MEANINGS[n],
  };
}
