// Nida: Nidalar'daki 9 gelenekten 72 söz (kaynak: src/data/wisdom_tr.json).
// Galiba'da söz rastgele gelir; anlamını kullanıcı verir.
import books from './nidalar.json';

export type Book = {
  id: string; title: string; author: string; tradition: string; emoji: string; color: string;
  passages: { id: string; theme: string; ref: string; text: string }[];
};
export type Passage = Book['passages'][number] & { book: Book };

export const BOOKS = books as Book[];
export const PASSAGES: Passage[] = BOOKS.flatMap(book => book.passages.map(p => ({ ...p, book })));

export const passageById = (id: string) => PASSAGES.find(p => p.id === id);


// ── Kişiye özel nida ───────────────────────────────────────────────
// Kullanıcının kendi kelimeleri (niyet, bugünkü düşünce, bu haftanın aynaları)
// bir duruma eşlenir; o durumla ilgili temalardaki sözler öne çıkar.
// Her şey cihazda olur; hiçbir metin dışarı gönderilmez.

type Mood = { key: string; label: string; triggers: string[]; themes: string[] };

const MOODS: Mood[] = [
  { key: 'kaygi', label: 'kaygı', triggers: ['kork', 'kayg', 'endişe', 'panik', 'gergin', 'stres', 'tedirgin', 'huzursuz', 'tehlike'],
    themes: ['Korku', 'Huzur', 'İç Huzur', 'Şimdi', 'Şimdiki An', 'Bu da Geçer', 'Bağlanmamak', 'İnanç'] },
  { key: 'ofke', label: 'öfke', triggers: ['öfke', 'kız', 'sinir', 'nefret', 'haksız', 'bıktım', 'kavga', 'tartış'],
    themes: ['Öfke', 'Sabır', 'Şefkat', 'İçsel Düşman', 'Taş ve Su', 'Su', 'Denge'] },
  { key: 'bag', label: 'ilişki', triggers: ['yalnız', 'sevil', 'önemse', 'arkadaş', 'ilişki', 'anlam', 'terk', 'sevgili', 'aile', 'annem', 'babam', 'eşim', 'cevap verm', 'kimse'],
    themes: ['Aşk', 'Sevgi', 'Gönül', 'Birlik', 'Şefkat', 'Paylaşım', 'Saygı'] },
  { key: 'deger', label: 'öz değer', triggers: ['yetersiz', 'başarısız', 'değersiz', 'iyi değil', 'beceriksiz', 'utan', 'suçlu', 'hata', 'aptal', 'yeterince'],
    themes: ['Kendini Bilmek', 'Hata', 'Alçakgönüllülük', 'Yara', 'İçsel Zafer', 'Öğrenme', 'Şefkat'] },
  { key: 'acele', label: 'acele', triggers: ['yetiş', 'zaman', 'acele', 'bitir', 'geç kal', 'proje', 'sınav', 'erteliyor', 'erteledi', 'yapamıyor'],
    themes: ['Sabır', 'Damla Damla', 'Eylemsizlik', 'Bugünkü Gün', 'Sadelik', 'Şimdi', 'Sabah', 'Toprak'] },
  { key: 'kayip', label: 'değişim', triggers: ['değiş', 'kayıp', 'kaybet', 'ayrıl', 'bitti', 'ölüm', 'yas', 'özle', 'geçmiş', 'veda', 'eskiden'],
    themes: ['Değişim', 'Geçicilik', 'Bu da Geçer', 'Düşen Yaprak', 'Ölümlülük', 'Geçmiş', 'Bağlanmamak', 'Dönüş', 'Devir Teslim', 'Hafıza'] },
  { key: 'yol', label: 'karar', triggers: ['karar', 'seçim', 'seçem', 'yol', 'belirsiz', 'kararsız', 'gelecek', 'ne yapacağım', 'emin değil'],
    themes: ['Yol', 'Yolculuk', 'Hakikat', 'Düş', 'Sevdiğini Yapmak', 'İnanç', 'Kök', 'Kadim Bilgi'] },
  { key: 'kesinlik', label: 'kesinlik', triggers: ['kesin', 'asla', 'hep', 'herkes', 'hiç', 'haklı', 'yanlış', 'emin', 'mutlaka', 'bilerek'],
    themes: ['Düşünce', 'Zihin', 'Algı', 'Ay ve Parmak', 'Boş Fincan', 'Farkındalık', 'Hakikat', 'Öğrenme'] },
  { key: 'yorgun', label: 'yorgunluk', triggers: ['yorgun', 'bitkin', 'tüken', 'uyku', 'uyuy', 'dinlen', 'huzur', 'sakin', 'gürültü'],
    themes: ['Huzur', 'İç Huzur', 'Sessizlik', 'Susma', 'Boşluk', 'Doğa', 'İçe Dönüş', 'Sessiz Çan'] },
  { key: 'kontrol', label: 'kontrol', triggers: ['kontrol', 'zorla', 'mükemmel', 'plan', 'olmalı', 'olmalıydı', 'izin verm'],
    themes: ['Kontrol', 'Eylemsizlik', 'Su', 'Taş ve Su', 'Bağlanmamak', 'Denge'] },
];

const low = (s: string) => s.toLocaleLowerCase('tr-TR');
const words = (s: string) => low(s).split(/[^a-zçğıöşüâîû]+/i).filter(w => w.length >= 3);

export type Signal = { text: string; source: 'niyet' | 'düşünce' | 'ayna'; weight: number };
export type Why = { mood: string; word: string; source: Signal['source'] };

function matchMoods(signals: Signal[]) {
  const scores = new Map<string, { score: number; why: Why }>();
  for (const sig of signals) {
    const text = low(sig.text);
    const toks = words(sig.text);
    for (const mood of MOODS) {
      for (const t of mood.triggers) {
        // Çok kelimeli tetikleyici metinde aranır, tek kelimelik olan kelime başında.
        const hitWord = t.includes(' ')
          ? (text.includes(t) ? t : '')
          : toks.find(w => w.startsWith(t)) ?? '';
        if (!hitWord) continue;
        const prev = scores.get(mood.key);
        // Açıklamada en ağırlıklı kaynağın (önce niyet) kelimesi gösterilir.
        const keepPrev = prev && prev.why.source === 'niyet';
        scores.set(mood.key, {
          score: (prev?.score ?? 0) + sig.weight,
          why: keepPrev ? prev.why : { mood: mood.label, word: hitWord, source: sig.source },
        });
      }
    }
  }
  return scores;
}

export function personalDraw(signals: Signal[], recent: string[]): { passage: Passage; why?: Why } {
  const fresh = PASSAGES.filter(p => !recent.includes(p.id));
  const pool = fresh.length ? fresh : PASSAGES;
  const moods = matchMoods(signals.filter(s => s.text.trim()));

  // Kullanıcının kendi kelimeleri sözün temasında ya da metninde geçiyorsa küçük bir ek puan.
  const userWords = new Set(signals.flatMap(s => words(s.text)).filter(w => w.length >= 4).map(w => w.slice(0, 5)));

  const scored = pool.map(p => {
    let score = 0;
    let why: Why | undefined;
    let top = 0;
    for (const mood of MOODS) {
      const m = moods.get(mood.key);
      if (m && mood.themes.includes(p.theme)) {
        score += m.score * 3;
        if (m.score > top) {
          top = m.score;
          why = m.why;
        }
      }
    }
    const direct = words(`${p.theme} ${p.text}`).filter(w => w.length >= 4 && userWords.has(w.slice(0, 5)));
    score += Math.min(direct.length, 2);
    return { p, score, why };
  });

  const best = scored.filter(s => s.score > 0).sort((a, b) => b.score - a.score).slice(0, 5);
  if (!best.length) return { passage: pool[Math.floor(Math.random() * pool.length)] };

  // En uygunlar arasından ağırlıklı rastgele: hep aynı söz gelmesin.
  const total = best.reduce((n, s) => n + s.score, 0);
  let r = Math.random() * total;
  const pick = best.find(s => (r -= s.score) <= 0) ?? best[0];
  return { passage: pick.p, why: pick.why };
}
