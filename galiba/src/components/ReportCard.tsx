import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Rich } from './Rich';
import { Button, Eyebrow } from './ui';
import { reportPayload, WeekSummary } from '../content/week';
import { useStore, WeeklyReport } from '../store/useStore';
import { C, F, S, type, upper } from '../theme/tokens';

// Web'de aynı alan adındaki Netlify fonksiyonu; mobil derlemede tam adres verilmeli.
const REPORT_URL = process.env.EXPO_PUBLIC_REPORT_URL || '/api/haftalik';
const MIN_ENTRIES = 3;

export function ReportCard({ week }: { week: WeekSummary }) {
  const { reports, saveReport } = useStore();
  const report = reports[week.weekKey];
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const enough = week.inWeek.length >= MIN_ENTRIES;

  const generate = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(REPORT_URL, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(reportPayload(week)),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Rapor şu an oluşturulamadı.');
      saveReport(week.weekKey, { ...(data as Omit<WeeklyReport, 'createdAt'>), createdAt: new Date().toISOString() });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    } catch (e) {
      setError(e instanceof Error && e.message ? e.message : 'Bağlantı kurulamadı.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.card}>
      <Eyebrow>Haftalık rapor</Eyebrow>

      {report ? (
        <>
          <Rich style={[type.title, { marginTop: S.sm }]}>{report.baslik}</Rich>
          {report.oruntuler.length > 0 && (
            <View style={{ marginTop: S.md, gap: S.sm }}>
              {report.oruntuler.map((o, i) => (
                <View key={i} style={styles.row}>
                  <Text style={styles.n}>{String(i + 1).padStart(2, '0')}</Text>
                  <Text style={[type.body, { flex: 1 }]}>{o}</Text>
                </View>
              ))}
            </View>
          )}
          {!!report.esneme && <Text style={[type.body, { marginTop: S.md }]}>{report.esneme}</Text>}
          {!!report.ihtimal && (
            <>
              <Text style={[styles.label, { marginTop: S.lg }]}>{upper('Gelecek hafta için bir ihtimal')}</Text>
              <Text style={[type.body, { color: C.ink }]}>{report.ihtimal}</Text>
            </>
          )}
          {!!report.soru && <Rich style={[type.body, { marginTop: S.md }]}>{`*${report.soru}*`}</Rich>}
          {!!report.destek && <Text style={[type.body, styles.support]}>{report.destek}</Text>}
          <Button quiet label={loading ? 'Yazılıyor…' : 'Yeniden yaz'} onPress={generate} disabled={loading}
            style={{ marginTop: S.md, alignSelf: 'flex-start' }} />
        </>
      ) : (
        <>
          <Text style={[type.body, { marginTop: S.sm }]}>
            {enough
              ? 'Bu haftanın kayıtlarından Galiba sana kısa bir rapor yazsın: tekrar eden kalıplar, esneyen yerler, bir ihtimal.'
              : `Rapor için bu hafta en az ${MIN_ENTRIES} kayıt gerekiyor. Şu an ${week.inWeek.length} kayıt var.`}
          </Text>
          {loading ? (
            <ActivityIndicator color={C.gold} style={{ marginTop: S.lg }} />
          ) : (
            <Button label="Raporu yaz" onPress={generate} disabled={!enough} style={{ marginTop: S.lg }} />
          )}
        </>
      )}

      {!!error && <Text style={[type.small, { marginTop: S.sm, color: C.coral }]}>{error}</Text>}
      <Text style={[type.small, { marginTop: S.md }]}>
        Rapor için yalnızca bu haftanın kayıtları yapay zekâ servisine (Groq) gönderilir ve saklanmaz.
        Rapor bir teşhis değil, bir ihtimaldir.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginTop: S.xl, paddingVertical: S.lg, borderTopWidth: 1, borderBottomWidth: 1, borderColor: C.line },
  row: { flexDirection: 'row', gap: S.md },
  n: { fontFamily: F.regular, fontSize: 15, lineHeight: 27, color: C.gold },
  label: { fontFamily: F.regular, fontSize: 12, letterSpacing: 2, color: C.inkMuted, marginBottom: 4 },
  support: { marginTop: S.md, color: C.ink, borderLeftWidth: 2, borderColor: C.coral, paddingLeft: S.md },
});
