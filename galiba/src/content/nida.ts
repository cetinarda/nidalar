// Nida: Nidalar'daki 9 gelenekten 72 söz (kaynak: src/data/wisdom_tr.json / wisdom_en.json).
// İki dilde kimlikler aynı; kişiye özel eşleştirme Türkçe temalar üzerinden kimlikle yapılır.
import booksTr from './nidalar.json';
import booksEn from './nidalar_en.json';
import type { Lang } from '../i18n';

export type Book = {
  id: string; title: string; author: string; tradition: string; emoji: string; color: string;
  passages: { id: string; theme: string; ref: string; text: string }[];
};
export type Passage = Book['passages'][number] & { book: Book };

export const BOOKS: Record<Lang, Book[]> = { tr: booksTr as Book[], en: booksEn as Book[] };
const flat = (books: Book[]): Passage[] => books.flatMap(book => book.passages.map(p => ({ ...p, book })));
export const PASSAGES: Record<Lang, Passage[]> = { tr: flat(BOOKS.tr), en: flat(BOOKS.en) };
const THEME_TR = new Map(PASSAGES.tr.map(p => [p.id, p.theme]));

export const passageById = (id: string, lang: Lang = 'tr') => PASSAGES[lang].find(p => p.id === id);

// ── Kişiye özel nida ───────────────────────────────────────────────
// Kullanıcının kendi kelimeleri (niyet, bugünkü düşünce, bu haftanın aynaları)
// bir duruma eşlenir; o durumla ilgili temalardaki sözler öne çıkar.
// Her şey cihazda olur; hiçbir metin dışarı gönderilmez.

type Mood = { key: string; label: string; en: string; triggers: string[]; enTriggers: string[]; themes: string[] };

const MOODS: Mood[] = [
  { key: 'kaygi', label: 'kaygı', en: 'anxiety', enTriggers: ['afraid', 'fear', 'scared', 'anxious', 'anxiety', 'worr', 'panic', 'nervous', 'stress', 'uneasy'], triggers: ['kork', 'kayg', 'endişe', 'panik', 'gergin', 'stres', 'tedirgin', 'huzursuz', 'tehlike'],
    themes: ['Korku', 'Huzur', 'İç Huzur', 'Şimdi', 'Şimdiki An', 'Bu da Geçer', 'Bağlanmamak', 'İnanç'] },
  { key: 'ofke', label: 'öfke', en: 'anger', enTriggers: ['ang', 'furious', 'hate', 'unfair', 'fed up', 'fight', 'argu', 'annoy'], triggers: ['öfke', 'kız', 'sinir', 'nefret', 'haksız', 'bıktım', 'kavga', 'tartış'],
    themes: ['Öfke', 'Sabır', 'Şefkat', 'İçsel Düşman', 'Taş ve Su', 'Su', 'Denge'] },
  { key: 'bag', label: 'ilişki', en: 'relationships', enTriggers: ['lonel', 'alone', 'loved', 'care about', 'friend', 'relationship', 'understand', 'left me', 'partner', 'family', 'mother', 'father', 'didn’t reply', "didn't reply", 'nobody', 'no one'], triggers: ['yalnız', 'sevil', 'önemse', 'arkadaş', 'ilişki', 'anlam', 'terk', 'sevgili', 'aile', 'annem', 'babam', 'eşim', 'cevap verm', 'kimse'],
    themes: ['Aşk', 'Sevgi', 'Gönül', 'Birlik', 'Şefkat', 'Paylaşım', 'Saygı'] },
  { key: 'deger', label: 'öz değer', en: 'self-worth', enTriggers: ['not good enough', 'enough', 'failure', 'fail', 'worthless', 'useless', 'ashamed', 'shame', 'guilt', 'mistake', 'stupid'], triggers: ['yetersiz', 'başarısız', 'değersiz', 'iyi değil', 'beceriksiz', 'utan', 'suçlu', 'hata', 'aptal', 'yeterince'],
    themes: ['Kendini Bilmek', 'Hata', 'Alçakgönüllülük', 'Yara', 'İçsel Zafer', 'Öğrenme', 'Şefkat'] },
  { key: 'acele', label: 'acele', en: 'hurry', enTriggers: ['on time', 'time', 'rush', 'hurry', 'deadline', 'finish', 'late', 'project', 'exam', 'procrastinat', "can't do", 'can’t do'], triggers: ['yetiş', 'zaman', 'acele', 'bitir', 'geç kal', 'proje', 'sınav', 'erteliyor', 'erteledi', 'yapamıyor'],
    themes: ['Sabır', 'Damla Damla', 'Eylemsizlik', 'Bugünkü Gün', 'Sadelik', 'Şimdi', 'Sabah', 'Toprak'] },
  { key: 'kayip', label: 'değişim', en: 'change', enTriggers: ['chang', 'loss', 'lost', 'losing', 'left', 'over', 'death', 'died', 'grief', 'miss', 'past', 'used to'], triggers: ['değiş', 'kayıp', 'kaybet', 'ayrıl', 'bitti', 'ölüm', 'yas', 'özle', 'geçmiş', 'veda', 'eskiden'],
    themes: ['Değişim', 'Geçicilik', 'Bu da Geçer', 'Düşen Yaprak', 'Ölümlülük', 'Geçmiş', 'Bağlanmamak', 'Dönüş', 'Devir Teslim', 'Hafıza'] },
  { key: 'yol', label: 'karar', en: 'decision', enTriggers: ['decid', 'decision', 'choice', 'choose', 'path', 'uncertain', 'unsure', 'future', 'what should i'], triggers: ['karar', 'seçim', 'seçem', 'yol', 'belirsiz', 'kararsız', 'gelecek', 'ne yapacağım', 'emin değil'],
    themes: ['Yol', 'Yolculuk', 'Hakikat', 'Düş', 'Sevdiğini Yapmak', 'İnanç', 'Kök', 'Kadim Bilgi'] },
  { key: 'kesinlik', label: 'kesinlik', en: 'certainty', enTriggers: ['definitely', 'never', 'always', 'everyone', 'everybody', 'right', 'wrong', 'sure', 'must', 'on purpose'], triggers: ['kesin', 'asla', 'hep', 'herkes', 'hiç', 'haklı', 'yanlış', 'emin', 'mutlaka', 'bilerek'],
    themes: ['Düşünce', 'Zihin', 'Algı', 'Ay ve Parmak', 'Boş Fincan', 'Farkındalık', 'Hakikat', 'Öğrenme'] },
  { key: 'yorgun', label: 'yorgunluk', en: 'tiredness', enTriggers: ['tired', 'exhausted', 'burn', 'sleep', 'rest', 'peace', 'calm', 'noise', 'drained'], triggers: ['yorgun', 'bitkin', 'tüken', 'uyku', 'uyuy', 'dinlen', 'huzur', 'sakin', 'gürültü'],
    themes: ['Huzur', 'İç Huzur', 'Sessizlik', 'Susma', 'Boşluk', 'Doğa', 'İçe Dönüş', 'Sessiz Çan'] },
  { key: 'kontrol', label: 'kontrol', en: 'control', enTriggers: ['control', 'force', 'perfect', 'plan', 'should', 'have to', 'let go'], triggers: ['kontrol', 'zorla', 'mükemmel', 'plan', 'olmalı', 'olmalıydı', 'izin verm'],
    themes: ['Kontrol', 'Eylemsizlik', 'Su', 'Taş ve Su', 'Bağlanmamak', 'Denge'] },
];

let lowLocale = 'tr-TR';
const low = (s: string) => s.toLocaleLowerCase(lowLocale);
const words = (s: string) => low(s).split(/[^a-zçğıöşüâîû’']+/i).filter(w => w.length >= 3);

export type Signal = { text: string; source: 'niyet' | 'düşünce' | 'ayna'; weight: number };
export type Why = { mood: string; word: string; source: Signal['source'] };

function matchMoods(signals: Signal[], lang: Lang) {
  const scores = new Map<string, { score: number; why: Why }>();
  for (const sig of signals) {
    const text = low(sig.text);
    const toks = words(sig.text);
    for (const mood of MOODS) {
      for (const t of lang === 'tr' ? mood.triggers : mood.enTriggers) {
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
          why: keepPrev ? prev.why : { mood: lang === 'tr' ? mood.label : mood.en, word: hitWord, source: sig.source },
        });
      }
    }
  }
  return scores;
}

export function personalDraw(signals: Signal[], recent: string[], lang: Lang = 'tr'): { passage: Passage; why?: Why } {
  lowLocale = lang === 'tr' ? 'tr-TR' : 'en-GB';
  const all = PASSAGES[lang];
  const fresh = all.filter(p => !recent.includes(p.id));
  const pool = fresh.length ? fresh : all;
  const moods = matchMoods(signals.filter(s => s.text.trim()), lang);

  // Kullanıcının kendi kelimeleri sözün temasında ya da metninde geçiyorsa küçük bir ek puan.
  const userWords = new Set(signals.flatMap(s => words(s.text)).filter(w => w.length >= 4).map(w => w.slice(0, 5)));

  const scored = pool.map(p => {
    let score = 0;
    let why: Why | undefined;
    let top = 0;
    for (const mood of MOODS) {
      const m = moods.get(mood.key);
      if (m && mood.themes.includes(THEME_TR.get(p.id) ?? '')) {
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
