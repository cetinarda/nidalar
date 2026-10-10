import { ArtName } from '../components/Art';

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

export const RITUAL: RitualStep[] = [
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
