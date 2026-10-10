import React, { useRef, useState } from 'react';
import { Animated, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Share, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Art } from '../components/Art';
import { Rich } from '../components/Rich';
import { Button, Eyebrow } from '../components/ui';
import { BOOKS, drawPassage, Passage } from '../content/nida';
import { useStore } from '../store/useStore';
import { C, F, S, type } from '../theme/tokens';

// Nida: Nidalar'ın söz çekme ritüeli, Galiba'nın sorusuyla.
// Söz rastgele gelir; anlamını kullanıcı verir.
type Phase = 'ask' | 'arrived' | 'library';

export function NidaSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const insets = useSafeAreaInsets();
  const { saveNida } = useStore();
  const [phase, setPhase] = useState<Phase>('ask');
  const [intention, setIntention] = useState('');
  const [reflection, setReflection] = useState('');
  const [passage, setPassage] = useState<Passage | null>(null);
  const [openBook, setOpenBook] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const fade = useRef(new Animated.Value(0)).current;

  const reveal = (p: Passage) => {
    setPassage(p);
    setReflection('');
    setSaved(false);
    setPhase('arrived');
    fade.setValue(0);
    Animated.timing(fade, { toValue: 1, duration: 700, useNativeDriver: true }).start();
  };

  const draw = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    reveal(drawPassage(passage?.id));
  };

  const close = () => {
    setPhase('ask');
    setIntention('');
    setPassage(null);
    onClose();
  };

  const save = () => {
    if (!passage) return;
    saveNida({ passageId: passage.id, intention: intention.trim(), reflection: reflection.trim() });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    setSaved(true);
  };

  const share = () => {
    if (!passage) return;
    Share.share({ message: `“${passage.text}”\n\n${passage.book.author}, ${passage.book.title}\n\ngaliba` }).catch(() => {});
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={close} presentationStyle="pageSheet">
      <KeyboardAvoidingView style={styles.sheet} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={[styles.wrap, { paddingBottom: insets.bottom + S.xl }]}
          keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.top}>
            <Eyebrow>{phase === 'library' ? 'Kaynaklar' : 'Nida'}</Eyebrow>
            <Button quiet label={phase === 'library' ? 'Geri' : 'Kapat'}
              onPress={phase === 'library' ? () => setPhase(passage ? 'arrived' : 'ask') : close} />
          </View>

          {phase === 'ask' && (
            <>
              <Art name="echo" height={190} />
              <Rich style={[type.display, { marginTop: S.md }]}>{'Bir *nida* gelsin.'}</Rich>
              <Text style={[type.body, { marginTop: S.sm }]}>
                Dokuz gelenekten bir söz rastgele gelir. Ona anlamı sen verirsin.
              </Text>
              <TextInput
                value={intention}
                onChangeText={setIntention}
                placeholder="Bugün neyi hatırlamaya ihtiyacın var? (isteğe bağlı)"
                placeholderTextColor={C.inkMuted}
                multiline
                style={styles.input}
              />
              <Button label="Gelsin" onPress={draw} style={{ marginTop: S.xl }} />
              <Pressable onPress={() => setPhase('library')} style={{ marginTop: S.lg, alignSelf: 'center' }}>
                <Text style={type.small}>9 gelenek · 72 söz  →</Text>
              </Pressable>
            </>
          )}

          {phase === 'arrived' && passage && (
            <Animated.View style={{ opacity: fade }}>
              <Text style={[styles.theme, { marginTop: S.lg }]}>{passage.theme}</Text>
              <Text style={styles.passage}>{passage.text}</Text>
              <Text style={[type.small, { marginTop: S.md }]}>
                {passage.book.author} · {passage.book.title}
              </Text>
              <Text style={type.small}>{passage.book.tradition}</Text>

              <View style={styles.rule} />

              {!!intention.trim() && (
                <Text style={[type.small, { marginBottom: S.sm }]}>Niyetin: {intention.trim()}</Text>
              )}
              <Rich style={[type.body, { color: C.ink }]}>{'Bu söz sana *hangi ihtimali* hatırlatıyor?'}</Rich>
              <TextInput
                value={reflection}
                onChangeText={setReflection}
                placeholder="Belki acele etmem gerekmiyordur…"
                placeholderTextColor={C.inkMuted}
                multiline
                style={styles.input}
              />
              {saved ? (
                <Rich style={[type.body, { marginTop: S.xl, textAlign: 'center' }]}>{'Deftere eklendi. *Galiba.*'}</Rich>
              ) : (
                <Button label="Deftere ekle" onPress={save} style={{ marginTop: S.xl }} />
              )}
              <View style={styles.actions}>
                <Button quiet label="Paylaş" onPress={share} />
                <Button quiet label="Başka bir ses" onPress={draw} />
              </View>
              <Text style={[type.small, { marginTop: S.md, textAlign: 'center' }]}>
                Söz rastgele seçildi. Anlamı, ona verdiğin anlamdır.
              </Text>
            </Animated.View>
          )}

          {phase === 'library' && (
            <View style={{ marginTop: S.md }}>
              {BOOKS.map(b => {
                const open = openBook === b.id;
                return (
                  <View key={b.id} style={styles.book}>
                    <Pressable onPress={() => setOpenBook(open ? null : b.id)} style={{ paddingVertical: 14 }}>
                      <Text style={styles.bookTitle}>{b.title}</Text>
                      <Text style={type.small}>{b.author} · {b.tradition}</Text>
                    </Pressable>
                    {open && b.passages.map(p => (
                      <Pressable key={p.id} onPress={() => reveal({ ...p, book: b })} style={styles.libPassage}>
                        <Text style={styles.theme}>{p.theme}</Text>
                        <Text style={[type.body, { marginTop: 2 }]} numberOfLines={2}>{p.text}</Text>
                      </Pressable>
                    ))}
                  </View>
                );
              })}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  sheet: { flex: 1, backgroundColor: C.bg },
  wrap: { paddingHorizontal: S.lg, paddingTop: S.lg, maxWidth: 520, width: '100%', alignSelf: 'center' },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  input: {
    marginTop: S.lg, minHeight: 72, fontFamily: F.light, fontSize: 17, lineHeight: 26, color: C.ink,
    borderBottomWidth: 1, borderColor: C.lilacSoft, paddingVertical: S.sm, textAlignVertical: 'top', outlineWidth: 0,
  },
  theme: { fontFamily: F.regular, fontSize: 12, letterSpacing: 3, color: C.gold, textTransform: 'uppercase' },
  passage: { fontFamily: F.italic, fontSize: 28, lineHeight: 38, color: C.ink, marginTop: S.md },
  rule: { width: 56, height: 1, backgroundColor: C.line, marginVertical: S.xl },
  actions: { flexDirection: 'row', justifyContent: 'center', gap: S.xl, marginTop: S.md },
  book: { borderBottomWidth: 1, borderColor: C.line },
  bookTitle: { fontFamily: F.light, fontSize: 18, color: C.ink },
  libPassage: { paddingVertical: S.sm, paddingLeft: S.md, borderLeftWidth: 1, borderColor: C.lilacSoft, marginBottom: S.sm },
});
