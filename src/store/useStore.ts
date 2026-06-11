import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SavedPassage {
  passageId: string;
  intention?: string;
  savedAt: string;
}

export interface HistoryEntry {
  passageId: string;
  intention?: string;
  date: string;
}

const STORAGE_KEYS = {
  SAVED: '@nidalar_saved',
  HISTORY: '@nidalar_history',
};

export function useNidaStore() {
  const [saved, setSaved] = useState<SavedPassage[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      const [savedRaw, historyRaw] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.SAVED),
        AsyncStorage.getItem(STORAGE_KEYS.HISTORY),
      ]);
      if (savedRaw) setSaved(JSON.parse(savedRaw));
      if (historyRaw) setHistory(JSON.parse(historyRaw));
    } catch (e) {
      console.error('Load error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const isSaved = useCallback(
    (passageId: string) => saved.some(s => s.passageId === passageId),
    [saved],
  );

  const toggleSaved = useCallback(async (passageId: string, intention?: string) => {
    setSaved(prev => {
      let next: SavedPassage[];
      if (prev.some(s => s.passageId === passageId)) {
        next = prev.filter(s => s.passageId !== passageId);
      } else {
        next = [{ passageId, intention, savedAt: new Date().toISOString() }, ...prev];
      }
      AsyncStorage.setItem(STORAGE_KEYS.SAVED, JSON.stringify(next));
      return next;
    });
  }, []);

  const removeSaved = useCallback(async (passageId: string) => {
    setSaved(prev => {
      const next = prev.filter(s => s.passageId !== passageId);
      AsyncStorage.setItem(STORAGE_KEYS.SAVED, JSON.stringify(next));
      return next;
    });
  }, []);

  const recordDraw = useCallback(async (passageId: string, intention?: string) => {
    const entry: HistoryEntry = {
      passageId,
      intention: intention?.trim() || undefined,
      date: new Date().toISOString(),
    };
    setHistory(prev => {
      const next = [entry, ...prev].slice(0, 100);
      AsyncStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(next));
      return next;
    });
  }, []);

  const clearAllData = useCallback(async () => {
    await AsyncStorage.multiRemove([STORAGE_KEYS.SAVED, STORAGE_KEYS.HISTORY]);
    setSaved([]);
    setHistory([]);
  }, []);

  return {
    saved,
    history,
    isLoading,
    isSaved,
    toggleSaved,
    removeSaved,
    recordDraw,
    clearAllData,
  };
}
