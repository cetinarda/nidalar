import { ArtName } from '../components/Art';

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

export const ESIK: Card[] = [
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
