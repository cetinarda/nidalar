// Haftalık durum: Defter'deki kayıtlardan hesaplanır, cihazdan çıkmaz.
// Rapor istendiğinde yalnızca bu haftanın özeti sunucuya gönderilir.
import { Entry, today } from '../store/useStore';
import { RITUAL } from './ritual';
import { splitCertainty } from './ayna';
import { passageById } from './nida';
import type { Lang } from '../i18n';

export const DAY_LABELS: Record<Lang, string[]> = {
  tr: ['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pz'],
  en: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
};

// Pazartesi başlayan haftanın günleri (yerel YYYY-AA-GG).
export function weekDays(now = new Date()): string[] {
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - ((now.getDay() + 6) % 7));
  return Array.from({ length: 7 }, (_, i) =>
    today(new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i)));
}

export function weekSummary(entries: Entry[], now = new Date(), lang: Lang = 'tr') {
  const days = weekDays(now);
  const inWeek = entries.filter(e => days.includes(e.date));
  const aynas = inWeek.flatMap(e => (e.kind === 'ayna' ? [e] : []));
  const rituals = inWeek.flatMap(e => (e.kind === 'ritual' ? [e] : []));
  const nidas = inWeek.flatMap(e => (e.kind === 'nida' ? [e] : []));
  const rezonanslar = inWeek.flatMap(e => (e.kind === 'rezonans' ? [e] : []));

  const ritualByDay = days.map(day => new Set(rituals.filter(r => r.date === day).map(r => r.step)).size);

  const avgDelta = aynas.length
    ? Math.round(aynas.reduce((n, a) => n + (a.before - a.after), 0) / aynas.length)
    : null;

  const counts = new Map<string, number>();
  const thoughts = [
    ...aynas.map(a => a.thought),
    ...rituals.filter(r => r.step === 'dusunce').map(r => r.text),
  ];
  for (const t of thoughts) {
    for (const part of splitCertainty(t)) {
      if (!part.hit) continue;
      const w = part.t.toLocaleLowerCase(lang === 'tr' ? 'tr-TR' : 'en-GB');
      counts.set(w, (counts.get(w) ?? 0) + 1);
    }
  }
  const words = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);

  return { lang, days, weekKey: days[0], inWeek, aynas, rituals, nidas, ritualByDay, avgDelta, words, rezonanslar };
}

export type WeekSummary = ReturnType<typeof weekSummary>;

const cut = (s: string, n = 400) => (s.length > n ? `${s.slice(0, n)}…` : s);

// Sunucuya giden özet: yalnızca bu hafta, kısaltılmış, kimlik bilgisi yok.
export function reportPayload(w: WeekSummary) {
  return {
    dil: w.lang,
    hafta: `${w.days[0]} – ${w.days[6]}`,
    ritueldeki_gun_sayisi: w.ritualByDay.filter(Boolean).length,
    ortalama_esneme_puani: w.avgDelta,
    kesinlik_kelimeleri: w.words.map(([k, n]) => `${k} (${n})`),
    aynalar: w.aynas.slice(0, 15).map(a => ({
      dusunce: cut(a.thought),
      once: a.before,
      sonra: a.after,
      ihtimaller: a.alternatives.map(x => cut(x, 200)),
      kopru: a.bridge,
      ilk_okuma_dogru: a.firstReadRight,
    })),
    rituel: w.rituals.slice(0, 28).filter(r => r.text).map(r => ({
      adim: RITUAL[w.lang].find(s => s.key === r.step)?.title.replace(/\*/g, '') ?? r.step,
      cevap: cut(r.text, 300),
    })),
    rezonanslar: w.rezonanslar.slice(0, 7).map(r => ({
      fikir: cut(r.idea, 200),
      kalp: r.kalp,
      beden: r.beden,
      zihin: r.zihin,
      beden_yerleri: r.places,
    })),
    nidalar: w.nidas.slice(0, 7).map(n => ({
      soz: cut(passageById(n.passageId, w.lang)?.text ?? '', 300),
      yorum: cut(n.reflection, 300),
    })),
  };
}
