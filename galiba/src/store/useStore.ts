import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Lang } from '../i18n';

export type RitualEntry = { kind: 'ritual'; id: string; date: string; step: string; text: string };
export type AynaEntry = {
  kind: 'ayna';
  id: string;
  date: string;
  thought: string;
  before: number;
  after: number;
  alternatives: string[];
  bridge: string;
  firstReadRight: boolean;
};
export type NidaEntry = {
  kind: 'nida';
  id: string;
  date: string;
  passageId: string;
  intention: string;
  reflection: string;
};
export type RezonansEntry = {
  kind: 'rezonans';
  id: string;
  date: string;
  idea: string;
  kalp: number;
  beden: number;
  zihin: number;
  places: string[];
  verdict: string;
};
export type Entry = RitualEntry | AynaEntry | NidaEntry | RezonansEntry;

export type WeeklyReport = {
  baslik: string;
  oruntuler: string[];
  esneme: string;
  ihtimal: string;
  soru: string;
  destek: string;
  createdAt: string;
};

export type GameStats = { best: number; plays: number; lastSpan: number; lastDate: string };

type State = {
  entries: Entry[];
  doneDays: number[];
  seenEsik: boolean;
  reports: Record<string, WeeklyReport>;
  game: GameStats;
  lang?: Lang;
};

const KEY = '@galiba_state_v1';

// İlk açılışta cihaz dili; kullanıcı seçince store'a yazılır.
const detected: Lang = (() => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().locale.toLowerCase().startsWith('tr') ? 'tr' : 'en';
  } catch {
    return 'tr';
  }
})();
const EMPTY: State = {
  entries: [], doneDays: [], seenEsik: false, reports: {},
  game: { best: 0, plays: 0, lastSpan: 3, lastDate: '' },
};

// Yerel tarih (YYYY-AA-GG); UTC kullanılırsa gece yarısından sonra gün kayar.
export const today = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const uid = () => Math.random().toString(36).slice(2, 10);

export function useGalibaState() {
  const [state, setState] = useState<State>(EMPTY);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then(raw => raw && setState({ ...EMPTY, ...JSON.parse(raw) }))
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  const update = useCallback((fn: (s: State) => State) => {
    setState(prev => {
      const next = fn(prev);
      AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const saveRitual = useCallback((step: string, text: string) => {
    update(s => ({
      ...s,
      entries: [
        { kind: 'ritual', id: uid(), date: today(), step, text: text.trim() },
        ...s.entries.filter(e => !(e.kind === 'ritual' && e.step === step && e.date === today())),
      ],
    }));
  }, [update]);

  const saveAyna = useCallback((e: Omit<AynaEntry, 'kind' | 'id' | 'date'>) => {
    update(s => ({ ...s, entries: [{ ...e, kind: 'ayna', id: uid(), date: today() }, ...s.entries] }));
  }, [update]);

  const saveNida = useCallback((e: Omit<NidaEntry, 'kind' | 'id' | 'date'>) => {
    update(s => ({ ...s, entries: [{ ...e, kind: 'nida', id: uid(), date: today() }, ...s.entries] }));
  }, [update]);

  const saveRezonans = useCallback((e: Omit<RezonansEntry, 'kind' | 'id' | 'date'>) => {
    update(s => ({ ...s, entries: [{ ...e, kind: 'rezonans', id: uid(), date: today() }, ...s.entries] }));
  }, [update]);

  const saveReport = useCallback((weekKey: string, r: WeeklyReport) => {
    update(s => ({ ...s, reports: { ...s.reports, [weekKey]: r } }));
  }, [update]);

  const saveGame = useCallback((longest: number, endSpan: number) => {
    update(s => ({
      ...s,
      game: {
        best: Math.max(s.game.best, longest),
        plays: s.game.plays + 1,
        lastSpan: endSpan,
        lastDate: today(),
      },
    }));
  }, [update]);

  const setLang = useCallback((lang: Lang) => update(s => ({ ...s, lang })), [update]);

  const toggleDay = useCallback((n: number) => {
    update(s => ({
      ...s,
      doneDays: s.doneDays.includes(n) ? s.doneDays.filter(d => d !== n) : [...s.doneDays, n],
    }));
  }, [update]);

  const markEsikSeen = useCallback(() => update(s => ({ ...s, seenEsik: true })), [update]);

  const remove = useCallback((id: string) => {
    update(s => ({ ...s, entries: s.entries.filter(e => e.id !== id) }));
  }, [update]);

  return useMemo(
    () => ({ ...state, lang: (state.lang ?? detected) as Lang, setLang, ready, saveRitual, saveAyna, saveNida, saveRezonans, saveReport, saveGame, toggleDay, markEsikSeen, remove }),
    [state, ready, saveRitual, saveAyna, saveNida, saveRezonans, saveReport, saveGame, toggleDay, markEsikSeen, remove, setLang],
  );
}

export type Store = ReturnType<typeof useGalibaState>;
export const StoreContext = createContext<Store | null>(null);
export function useStore() {
  const s = useContext(StoreContext);
  if (!s) throw new Error('StoreContext eksik');
  return s;
}
