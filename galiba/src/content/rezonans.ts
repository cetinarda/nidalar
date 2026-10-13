// Rezonans: bir fikri kalp, beden ve zihin ayrı ayrı onaylıyor mu?
// Dokunuş bir şey ölçmez; durdurur. Cevapları kullanıcı kendi iç sinyallerinden verir.
import type { Lang } from '../i18n';

export type Channel = 'kalp' | 'beden' | 'zihin';
export type Option = { value: -2 | -1 | 0 | 1 | 2; label: string; place?: boolean };
export type ChannelDef = { key: Channel; name: string; title: string; guide: string; options: Option[] };

const TR: ChannelDef[] = [
  {
    key: 'kalp',
    name: 'Kalp',
    title: 'Şimdi *kalbini* dinle.',
    guide: 'Fikri göğsünün ortasına koy. Orada ne oluyor?',
    options: [
      { value: 2, label: 'Genişliyor; tutkuyla “evet” diyor.' },
      { value: 1, label: 'Rahatlıyor, yumuşuyor.' },
      { value: 0, label: 'Sessiz; bir şey hissetmiyorum.' },
      { value: -1, label: 'Sıkışıyor, daralıyor.' },
      { value: -2, label: 'Acil durum lambası yanıyor.' },
    ],
  },
  {
    key: 'beden',
    name: 'Beden',
    title: 'Şimdi *bedenine* dön.',
    guide: 'Fikirle birlikte omuzlarına, karnına, çenene bak. Ritmin nasıl?',
    options: [
      { value: 2, label: 'Gevşiyorum; nefesim derinleşiyor.' },
      { value: 1, label: 'Ritmim sakin, bedenim yerinde.' },
      { value: 0, label: 'Belirgin bir değişiklik yok.' },
      { value: -1, label: 'Bir yerde kasılma var.', place: true },
      { value: -2, label: 'Tetiklendiğim bir yer var; ritmim hızlandı.', place: true },
    ],
  },
  {
    key: 'zihin',
    name: 'Zihin',
    title: 'Şimdi *zihnini* izle.',
    guide: 'Fikri düşündüğünde zihnin ne yapıyor?',
    options: [
      { value: 2, label: 'Susuyor; derin bir sessizlik var.' },
      { value: 1, label: 'Sessizleşiyor, sakinleşiyor.' },
      { value: 0, label: 'Birkaç soru soruyor, sonra duruyor.' },
      { value: -1, label: 'Sürekli bir şeyler söylemeye çalışıyor.' },
      { value: -2, label: 'Gürültülü; aynı düşünce dönüp duruyor.' },
    ],
  },
];

const EN: ChannelDef[] = [
  {
    key: 'kalp',
    name: 'Heart',
    title: 'Now listen to *your heart.*',
    guide: 'Place the idea in the middle of your chest. What happens there?',
    options: [
      { value: 2, label: 'It opens; it says “yes” with passion.' },
      { value: 1, label: 'It relaxes and softens.' },
      { value: 0, label: 'Quiet; I don’t feel anything.' },
      { value: -1, label: 'It tightens and narrows.' },
      { value: -2, label: 'An emergency light switches on.' },
    ],
  },
  {
    key: 'beden',
    name: 'Body',
    title: 'Now return to *your body.*',
    guide: 'With the idea, notice your shoulders, belly, jaw. How is your rhythm?',
    options: [
      { value: 2, label: 'I loosen; my breath deepens.' },
      { value: 1, label: 'My rhythm is calm, my body settled.' },
      { value: 0, label: 'No clear change.' },
      { value: -1, label: 'Something is tensing.', place: true },
      { value: -2, label: 'Something is triggered; my rhythm speeds up.', place: true },
    ],
  },
  {
    key: 'zihin',
    name: 'Mind',
    title: 'Now watch *your mind.*',
    guide: 'When you think of the idea, what does your mind do?',
    options: [
      { value: 2, label: 'It falls silent; a deep quiet.' },
      { value: 1, label: 'It grows quieter and calmer.' },
      { value: 0, label: 'It asks a few questions, then stops.' },
      { value: -1, label: 'It keeps trying to say something.' },
      { value: -2, label: 'Noisy; the same thought keeps looping.' },
    ],
  },
];

export const CHANNELS: Record<Lang, ChannelDef[]> = { tr: TR, en: EN };

export const PLACES: Record<Lang, string[]> = {
  tr: ['Boğaz', 'Göğüs', 'Mide', 'Omuzlar', 'Çene', 'Sırt'],
  en: ['Throat', 'Chest', 'Stomach', 'Shoulders', 'Jaw', 'Back'],
};

export type Scores = Record<Channel, number>;
export type Verdict = 'uyum' | 'dur' | 'kalpBeden' | 'zihinKalp' | 'zihinGurultu' | 'belirsiz';

// Okuma: üç kanalın yönü ve uyumu. Kesin hüküm değil, bir ihtimal.
export function readVerdict(s: Scores): Verdict {
  const { kalp, beden, zihin } = s;
  if (kalp >= 1 && beden >= 1 && zihin >= 1) return 'uyum';
  if (kalp <= -1 && beden <= -1 && zihin <= -1) return 'dur';
  if (kalp >= 1 && beden >= 1 && zihin <= -1) return 'zihinGurultu';
  if (kalp >= 1 && beden <= -1) return 'kalpBeden';
  if (kalp <= -1 && zihin >= 0) return 'zihinKalp';
  return 'belirsiz';
}

// 0–1: birleşme noktasının parlaklığı.
export const resonance = (s: Scores) => (s.kalp + s.beden + s.zihin + 6) / 12;

export const VERDICTS: Record<Lang, Record<Verdict, { title: string; body: string; question: string }>> = {
  tr: {
    uyum: {
      title: 'Üçü de *evet* diyor.',
      body: 'Kalbin, bedenin ve zihnin aynı yöne bakıyor. Galiba bu fikir seninle rezonansta.',
      question: 'Bu fikre doğru atabileceğin en küçük adım ne?',
    },
    dur: {
      title: 'Üçü de *dur* diyor.',
      body: 'Şimdilik bu fikir sana iyi gelmiyor gibi. Bu bir yasak değil; bir bilgi.',
      question: 'Bu fikirde seni asıl rahatsız eden ne olabilir?',
    },
    kalpBeden: {
      title: 'Kalbin istiyor, *bedenin tetikte.*',
      body: 'Belki istediğin şey, alışık olmadığın bir şey. Beden yeniye bazen korkuyla bakar. Onu acele ettirme.',
      question: 'Bedenin güvende hissetmek için neye ihtiyaç duyuyor?',
    },
    zihinKalp: {
      title: 'Zihnin ikna olmuş, *kalbin değil.*',
      body: 'Gerekçeler iyi olabilir; ama kalbin sıkışıyor. Mantık doğru olsa da bir şey eksik kalıyor olabilir.',
      question: 'Bu fikri seçersen neyi kaybetmekten korkuyorsun?',
    },
    zihinGurultu: {
      title: 'Kalp ve beden evet, *zihin gürültülü.*',
      body: 'Zihnin belki eski bir korkuyu anlatıyor. Söylediklerini dinle ama hepsine inanmak zorunda değilsin.',
      question: 'Zihnin sürekli ne söylüyor; bu ses kime ait olabilir?',
    },
    belirsiz: {
      title: 'Henüz *netlik yok.*',
      body: 'Kanallar farklı şeyler söylüyor. Bu da bir cevap: fikri bir gün bekletip yeniden tartabilirsin.',
      question: 'Bu fikrin hangi hâli seni daha rahat hissettirirdi?',
    },
  },
  en: {
    uyum: {
      title: 'All three say *yes.*',
      body: 'Your heart, your body and your mind face the same way. Galiba this idea is in resonance with you.',
      question: 'What is the smallest step you could take toward it?',
    },
    dur: {
      title: 'All three say *wait.*',
      body: 'For now this idea doesn’t seem to sit well with you. It isn’t a prohibition; it’s information.',
      question: 'What about this idea really unsettles you?',
    },
    kalpBeden: {
      title: 'Your heart wants it, *your body is on alert.*',
      body: 'Maybe what you want is simply unfamiliar. The body sometimes meets the new with fear. Don’t rush it.',
      question: 'What does your body need in order to feel safe?',
    },
    zihinKalp: {
      title: 'Your mind is convinced, *your heart is not.*',
      body: 'The reasons may be good, yet your heart tightens. Even when the logic holds, something may be missing.',
      question: 'If you choose this, what are you afraid of losing?',
    },
    zihinGurultu: {
      title: 'Heart and body say yes, *the mind is noisy.*',
      body: 'Your mind may be retelling an old fear. Listen to it, but you don’t have to believe all of it.',
      question: 'What does your mind keep saying, and whose voice might that be?',
    },
    belirsiz: {
      title: 'No *clarity* yet.',
      body: 'The channels are saying different things. That is an answer too: let the idea rest a day and weigh it again.',
      question: 'Which version of this idea would feel easier?',
    },
  },
};
