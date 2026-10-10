import type { ArtName } from '../components/Art';
import type { Lang } from '../i18n';

// Günlük ritüel: farkındalık → düşünce → ihtimal → davranış.
// Her adım tek bir soru. Az metin, tek alan.

export type RitualStep = {
  key: 'beden' | 'dusunce' | 'ihtimal' | 'adim';
  n: string;
  title: string;
  minutes: number;
  art: ArtName;
  guide: string;
  prompt: string;
  placeholder: string;
  yes: string;
};

const RITUAL_TR: RitualStep[] = [
  {
    key: 'beden',
    n: '01',
    title: 'Dur ve *dinle.*',
    minutes: 1,
    art: 'breath',
    guide: 'Nefesini değiştirmeye çalışma. Üç nefes boyunca yalnızca izle. İstersen ılık bir ışığın göğsünde biriktiğini hayal et.',
    prompt: 'Bedenin şu an ne söylüyor?',
    placeholder: 'Omuzlarım sıkı, göğsüm biraz açıldı…',
    yes: 'İç “evet”',
  },
  {
    key: 'dusunce',
    n: '02',
    title: 'Düşünceni *yakala.*',
    minutes: 2,
    art: 'lens',
    guide: 'Bugün zihninde en çok dönen cümle hangisi? Onu düzeltmeden, olduğu gibi yaz.',
    prompt: 'Seni meşgul eden düşünce:',
    placeholder: 'Bu işi asla zamanında bitiremeyeceğim.',
    yes: 'Fark ettim',
  },
  {
    key: 'ihtimal',
    n: '03',
    title: 'Bir *ihtimal* ekle.',
    minutes: 2,
    art: 'fork',
    guide: 'Doğru olduğuna inanman gerekmiyor. Yalnızca masaya koy. Galiba en işe yarayanlar en sade olanlardır.',
    prompt: 'Bunun başka bir açıklaması ne olabilir?',
    placeholder: 'Belki sadece yorgunum ve bugün yavaşım.',
    yes: 'Alan açtım',
  },
  {
    key: 'adim',
    n: '04',
    title: 'Küçük bir *adım* seç.',
    minutes: 2,
    art: 'stones',
    guide: 'Yeni bakış açınla uyumlu, on dakikadan kısa süren somut bir şey.',
    prompt: 'Bugün hangi tek şeyi yapacaksın?',
    placeholder: 'İlk yarım saatini telefonsuz başlatacağım.',
    yes: 'Dış “evet”',
  },
];

const RITUAL_EN: RitualStep[] = [
  {
    key: 'beden', n: '01', title: 'Pause and *listen.*', minutes: 1, art: 'breath',
    guide: 'Don’t try to change your breath. Just watch it for three breaths. If you like, imagine a warm light gathering in your chest.',
    prompt: 'What is your body saying right now?',
    placeholder: 'My shoulders are tight, my chest opened a little…',
    yes: 'Inner “yes”',
  },
  {
    key: 'dusunce', n: '02', title: 'Catch *the thought.*', minutes: 2, art: 'lens',
    guide: 'Which sentence keeps circling in your mind today? Write it as it is, without fixing it.',
    prompt: 'The thought that occupies you:',
    placeholder: 'I will never finish this on time.',
    yes: 'Noticed',
  },
  {
    key: 'ihtimal', n: '03', title: 'Add a *possibility.*', minutes: 2, art: 'fork',
    guide: 'You don’t have to believe it. Just put it on the table. The simplest ones often work best, galiba.',
    prompt: 'What else could explain this?',
    placeholder: 'Maybe I’m just tired and slow today.',
    yes: 'Made room',
  },
  {
    key: 'adim', n: '04', title: 'Choose a small *step.*', minutes: 2, art: 'stones',
    guide: 'Something concrete, in tune with your new view, that takes less than ten minutes.',
    prompt: 'Which one thing will you do today?',
    placeholder: 'I’ll start the first half hour without my phone.',
    yes: 'Outer “yes”',
  },
];

export const RITUAL: Record<Lang, RitualStep[]> = { tr: RITUAL_TR, en: RITUAL_EN };
