import type { ArtName } from '../components/Art';
import type { Lang } from '../i18n';

// "Eşik": Galiba'nın açılış serisi. Kapak her gün o günün sayılarını taşır.
// Görsel dil referans seriden ilham alır; metin Galiba'nın kendi sesidir.
// `*...*` altın italik vurgudur.

export type Card = {
  art: ArtName;
  artTop: boolean;
  cover?: boolean;
  eyebrow?: string;
  title?: string;
  paragraphs: string[];
  list?: { n: string; text: string }[];
  coda?: string;
  next?: string;
};

const ESIK_TR: Card[] = [
  {
    art: 'window',
    artTop: false,
    cover: true,
    eyebrow: 'Bugünün eşiği',
    paragraphs: ['Bugün de *bir ihtimal daha* var.'],
  },
  {
    art: 'mirror',
    artTop: false,
    title: 'Bir düşünce, *bir gerçek değildir.*',
    paragraphs: ['Zihin hızlı karar verir. Çoğu zaman da yorumunu gerçeğin kendisi sanır.'],
    list: [
      { n: '→', text: '“Bu kesinlikle böyle.”  Ben şu an böyle görüyorum.' },
      { n: '→', text: '“Bunu bilerek yaptı.”  Başka bir açıklaması olabilir mi?' },
      { n: '→', text: '“Asla değişmez.”  Henüz değiştiğini görmedim.' },
    ],
    next: 'Peki nereden başlamalı?',
  },
  {
    art: 'lens',
    artTop: true,
    title: 'Kesinlik kelimeleri *ipucudur.*',
    paragraphs: [
      '“Her zaman”, “asla”, “herkes”, “hiç”. Yanlış değiller; ama yorumun nerede başladığını gösterirler.',
      'Galiba onları yazarken fark eder ve tek bir şey sorar: *Ne kadarı gözlem, ne kadarı yorum?*',
    ],
  },
  {
    art: 'breath',
    artTop: true,
    title: 'Her gün *dört küçük adım.*',
    paragraphs: ['Yedi dakika. Önce içeride, sonra dışarıda.'],
    list: [
      { n: '01', text: 'Dur ve bedenini dinle.' },
      { n: '02', text: 'Seni meşgul eden düşünceyi yakala.' },
      { n: '03', text: 'Yanına bir ihtimal ekle.' },
      { n: '04', text: 'Küçük, somut bir adım seç.' },
    ],
    coda: 'Biri iç *“evet”*, biri dış *“evet”*.',
  },
  {
    art: 'layers',
    artTop: false,
    title: 'Esnediğini *görürsün.*',
    paragraphs: [
      'Bir düşünceye ne kadar inandığını önce ve sonra işaretlersin. %90’dan %60’a inen bir sayı, ezberlenmiş bir olumlamadan daha çok şey söyler.',
      'Seri yok, puan yok. Sadece *kesinliğinin nasıl yumuşadığı.*',
    ],
  },
  {
    art: 'fork',
    artTop: true,
    title: 'Her ihtimale açık ol. *Ama hepsine aynı ölçüde inanma.*',
    paragraphs: [
      'İlk okuman bazen doğrudur. Anlamak, mazur görmek değildir; esnek düşünmek, sınırını korumayı da içerir.',
      'Günün sayıları ve ritüeller birer semboldür. Dikkatini toplarlar; kehanet değildirler.',
    ],
    coda: 'Hazırsan, *eşikten geç.*',
  },
];

const ESIK_EN: Card[] = [
  {
    art: 'window',
    artTop: false,
    cover: true,
    eyebrow: 'Today’s threshold',
    paragraphs: ['Today there is *one more possibility*, too.', '*galiba* (Turkish): I guess · maybe · probably'],
  },
  {
    art: 'mirror',
    artTop: false,
    title: 'A thought *is not a fact.*',
    paragraphs: ['The mind decides fast. And it often mistakes its interpretation for reality itself.'],
    list: [
      { n: '→', text: '“It’s definitely like this.”  This is how I see it right now.' },
      { n: '→', text: '“They did it on purpose.”  Could there be another explanation?' },
      { n: '→', text: '“It will never change.”  I haven’t seen it change yet.' },
    ],
    next: 'So where do we begin?',
  },
  {
    art: 'lens',
    artTop: true,
    title: 'Certainty words *are clues.*',
    paragraphs: [
      '“Always”, “never”, “everyone”, “nothing”. They aren’t wrong; but they show where interpretation begins.',
      'Galiba notices them as you write and asks only one thing: *How much is observation, how much interpretation?*',
    ],
  },
  {
    art: 'breath',
    artTop: true,
    title: 'Every day, *four small steps.*',
    paragraphs: ['Seven minutes. First inside, then outside.'],
    list: [
      { n: '01', text: 'Pause and listen to your body.' },
      { n: '02', text: 'Catch the thought that occupies you.' },
      { n: '03', text: 'Add a possibility beside it.' },
      { n: '04', text: 'Choose one small, concrete step.' },
    ],
    coda: 'An inner *“yes”*, an outer *“yes”*.',
  },
  {
    art: 'layers',
    artTop: false,
    title: 'You *see yourself soften.*',
    paragraphs: [
      'You mark how much you believe a thought, before and after. A number moving from 90% to 60% says more than a memorised affirmation.',
      'No streaks, no points. Just *how your certainty softens.*',
    ],
  },
  {
    art: 'fork',
    artTop: true,
    title: 'Be open to every possibility. *But don’t believe them all equally.*',
    paragraphs: [
      'Sometimes your first read is right. Understanding is not excusing; flexible thinking includes keeping your boundary.',
      'The day’s numbers and the rituals are symbols. They gather your attention; they are not prophecy.',
    ],
    coda: 'When you’re ready, *cross the threshold.*',
  },
];

export const ESIK: Record<Lang, Card[]> = { tr: ESIK_TR, en: ESIK_EN };
