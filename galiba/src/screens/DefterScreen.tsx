import React, { useMemo } from 'react';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BeliefDelta } from '../components/Belief';
import { Rich } from '../components/Rich';
import { Eyebrow } from '../components/ui';
import { RITUAL } from '../content/ritual';
import { passageById } from '../content/nida';
import { Entry, today, useStore } from '../store/useStore';
import { weekSummary } from '../content/week';
import { AynaDumbbells, CertaintyBars, PathProgress, WeekRitual } from '../components/Charts';
import { ReportCard } from '../components/ReportCard';
import { C, F, S, type, upper } from '../theme/tokens';
import { localeOf, useT } from '../i18n';

// Defter: kişisel kayıtlar yalnızca bu cihazda saklanır.
export function DefterScreen() {
  const insets = useSafeAreaInsets();
  const { entries, doneDays, remove } = useStore();
  const { t, lang } = useT();
  const week = useMemo(() => weekSummary(entries, new Date(), lang), [entries, lang]);
  const todayIndex = week.days.indexOf(today());

  const confirmRemove = (e: Entry) => {
    if (Platform.OS === 'web') return remove(e.id);
    Alert.alert(t('common.deleteAsk'), undefined, [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('common.delete'), style: 'destructive', onPress: () => remove(e.id) },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={[styles.wrap, { paddingTop: insets.top + S.lg }]} showsVerticalScrollIndicator={false}>
      <Eyebrow>{t('defter.eyebrow')}</Eyebrow>
      <Rich style={[type.display, { marginTop: S.sm }]}>{t('defter.title')}</Rich>
      <View style={{ height: S.xl }} />

      <Eyebrow>{t('defter.week', { range: weekRange(week.days) })}</Eyebrow>

      <View style={styles.hero}>
        <Text style={styles.statN}>
          {week.avgDelta === null ? '—' : week.avgDelta > 0 ? `−${week.avgDelta}` : week.avgDelta === 0 ? '0' : `+${-week.avgDelta}`}
        </Text>
        <Text style={type.small}>
          {week.avgDelta === null
            ? t('defter.noAyna')
            : t(week.avgDelta >= 0 ? 'defter.softened' : 'defter.hardened', { n: week.aynas.length, d: Math.abs(week.avgDelta) })}
        </Text>
      </View>

      <Section title={t('defter.ritual')}>
        <WeekRitual byDay={week.ritualByDay} todayIndex={todayIndex} />
      </Section>

      {week.aynas.length > 0 && (
        <Section title={t('defter.ayna')}>
          <AynaDumbbells aynas={week.aynas.slice(0, 5)} />
        </Section>
      )}

      {week.words.length > 0 && (
        <Section title={t('defter.words')}>
          <CertaintyBars words={week.words} />
        </Section>
      )}

      <Section title={t('defter.path')}>
        <PathProgress done={doneDays} />
      </Section>

      <ReportCard week={week} />

      <View style={{ marginTop: S.xxl }}>
        <Eyebrow>{t('defter.entries')}</Eyebrow>
      </View>

      {entries.length === 0 && (
        <Text style={[type.body, { marginTop: S.xl }]}>
          {t('defter.empty')}
        </Text>
      )}

      {entries.map(e => (
        <Pressable key={e.id} onLongPress={() => confirmRemove(e)} style={styles.entry}>
          <Text style={styles.meta}>
            {upper(`${fmt(e.date)}  ·  ${
              e.kind === 'ayna' ? t('defter.kindAyna') : e.kind === 'nida' ? t('defter.kindNida') : RITUAL[lang].find(r => r.key === e.step)?.title.replace(/\*/g, '') ?? ''
            }`)}
          </Text>
          {e.kind === 'ayna' ? (
            <>
              <Text style={[type.body, { color: C.ink, marginTop: S.xs }]}>“{e.thought}”</Text>
              <View style={{ marginTop: S.sm }}>
                <BeliefDelta before={e.before} after={e.after} compact />
              </View>
              {!!e.bridge && <Rich style={[type.small, { marginTop: S.sm }]}>{`*${e.bridge}*`}</Rich>}
            </>
          ) : e.kind === 'nida' ? (
            <NidaItem passageId={e.passageId} reflection={e.reflection} />
          ) : (
            <Text style={[type.body, { marginTop: S.xs }]}>{e.text || '—'}</Text>
          )}
        </Pressable>
      ))}
    </ScrollView>
  );
}

const weekRange = (days: string[]) => {
  const [a, b] = [days[0], days[6]].map(d => new Date(`${d}T12:00:00`));
  const month = (d: Date) => d.toLocaleDateString(localeOf(), { month: 'long' });
  return a.getMonth() === b.getMonth()
    ? `${a.getDate()}–${b.getDate()} ${month(b)}`
    : `${a.getDate()} ${month(a)} – ${b.getDate()} ${month(b)}`;
};

const fmt = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString(localeOf(), { day: 'numeric', month: 'long' });

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{upper(title)}</Text>
      {children}
    </View>
  );
}

function NidaItem({ passageId, reflection }: { passageId: string; reflection: string }) {
  const { lang } = useT();
  const p = passageById(passageId, lang);
  if (!p) return null;
  return (
    <>
      <Text style={styles.nidaText}>“{p.text}”</Text>
      <Text style={type.small}>{p.book.author}</Text>
      {!!reflection && <Text style={[type.body, { marginTop: S.sm }]}>{reflection}</Text>}
    </>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: S.lg, paddingBottom: S.xxl, maxWidth: 520, width: '100%', alignSelf: 'center' },
  hero: { marginTop: S.md, paddingBottom: S.lg, borderBottomWidth: 1, borderColor: C.line },
  section: { paddingVertical: S.lg, borderBottomWidth: 1, borderColor: C.line },
  sectionTitle: { fontFamily: F.regular, fontSize: 12, letterSpacing: 2, color: C.inkMuted, marginBottom: S.md },
  statN: { fontFamily: F.serif, fontSize: 48, color: C.gold },
  entry: { paddingVertical: S.lg, borderBottomWidth: 1, borderColor: C.line },
  nidaText: { fontFamily: F.italic, fontSize: 20, lineHeight: 28, color: C.ink, marginTop: S.xs },
  meta: { fontFamily: F.regular, fontSize: 12, letterSpacing: 1.5, color: C.inkMuted },
});
