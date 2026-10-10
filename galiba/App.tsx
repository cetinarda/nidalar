import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Jost_300Light, Jost_400Regular, Jost_500Medium } from '@expo-google-fonts/jost';
import { CormorantGaramond_500Medium_Italic, CormorantGaramond_600SemiBold } from '@expo-google-fonts/cormorant-garamond';
import { StoreContext, useGalibaState, useStore } from './src/store/useStore';
import { EsikScreen } from './src/screens/EsikScreen';
import { BugunScreen } from './src/screens/BugunScreen';
import { AynaScreen } from './src/screens/AynaScreen';
import { YolScreen } from './src/screens/YolScreen';
import { DefterScreen } from './src/screens/DefterScreen';
import { C, F } from './src/theme/tokens';

type Tab = 'bugun' | 'ayna' | 'yol' | 'defter';
const TABS: { key: Tab; label: string }[] = [
  { key: 'bugun', label: 'Bugün' },
  { key: 'ayna', label: 'Ayna' },
  { key: 'yol', label: 'Yol' },
  { key: 'defter', label: 'Defter' },
];

export default function App() {
  const [fontsLoaded] = useFonts({
    Jost_300Light, Jost_400Regular, Jost_500Medium,
    CormorantGaramond_500Medium_Italic, CormorantGaramond_600SemiBold,
  });
  const store = useGalibaState();

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <View style={styles.webRoot}>
        <View style={styles.frame}>
          {fontsLoaded && store.ready ? (
            <StoreContext.Provider value={store}>
              <Shell />
            </StoreContext.Provider>
          ) : null}
        </View>
      </View>
    </SafeAreaProvider>
  );
}

function Shell() {
  const insets = useSafeAreaInsets();
  const { seenEsik, markEsikSeen } = useStore();
  const [tab, setTab] = useState<Tab>('bugun');
  const [esik, setEsik] = useState(!seenEsik);

  if (esik) {
    return <EsikScreen onDone={() => { markEsikSeen(); setEsik(false); }} />;
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {tab === 'bugun' && <BugunScreen onOpenEsik={() => setEsik(true)} />}
        {tab === 'ayna' && <AynaScreen />}
        {tab === 'yol' && <YolScreen />}
        {tab === 'defter' && <DefterScreen />}
      </View>
      <View style={[styles.tabs, { paddingBottom: insets.bottom + 10 }]}>
        {TABS.map(t => {
          const on = t.key === tab;
          return (
            <Pressable
              key={t.key}
              style={styles.tab}
              onPress={() => setTab(t.key)}
              accessibilityRole="tab"
              accessibilityState={{ selected: on }}
            >
              <View style={[styles.mark, on && styles.markOn]} />
              <Text style={[styles.tabText, on && styles.tabTextOn]}>{t.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  webRoot: {
    flex: 1,
    backgroundColor: Platform.OS === 'web' ? C.bgDeep : C.bg,
    alignItems: Platform.OS === 'web' ? 'center' : undefined,
  },
  frame: { flex: 1, width: '100%', maxWidth: Platform.OS === 'web' ? 480 : undefined, backgroundColor: C.bg },
  tabs: { flexDirection: 'row', borderTopWidth: 1, borderColor: C.line, paddingTop: 10, backgroundColor: C.bg },
  tab: { flex: 1, alignItems: 'center', gap: 6 },
  mark: { width: 4, height: 4, borderRadius: 2, backgroundColor: 'transparent' },
  markOn: { backgroundColor: C.gold },
  tabText: { fontFamily: F.light, fontSize: 13, letterSpacing: 1, color: C.inkMuted },
  tabTextOn: { color: C.ink },
});
