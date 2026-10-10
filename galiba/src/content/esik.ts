import { ArtName } from '../components/Art';

// "Eşik" — uygulamanın açılış serisi ve temel alt metni.
// Kaynak: 8 kartlık İngilizce seri (bkz. docs/kaynak-ceviri.md).
// Uyarlama ilkesi: ritüeli koru, kesinlik iddiasını "galiba"ya çevir.
// `*...*` altın italik vurgudur.

export type Card = {
  art: ArtName;
  artTop: boolean;
  eyebrow?: string;
  title?: string;
  paragraphs: string[];
  list?: { n: string; text: string }[];
  coda?: string;
  next?: string;
};

export const ESIK: Card[] = [
  {
    art: 'portal',
    artTop: false,
    eyebrow: 'Eşik açık',
    title: '10·10·10',
    paragraphs: [
      'ayın 10’u · yılın 10. ayı · rakamları 10 eden bir yıl',
      'Bu eşikte *gerçekten ne yapılır* ve bu gün neden *bu kadar güçlü hissettirir?*',
    ],
  },
  {
    art: 'moon',
    artTop: false,
    title: 'Bugün *Terazi’deki yeni ay*, 10.10 eşiğiyle buluşuyor.',
    paragraphs: ['Bu yüzden güçlü bir niyet anı:'],
    list: [
      { n: '01', text: 'Yeni ay boşluğu simgeler. Henüz şekillenmemiş olanı; her yaratımdan önceki o sessiz kuyuyu.' },
      { n: '02', text: '10, bir döngünün kapanışı ve yenisinin açılışıdır. Yeni bir yol başlıyor, yönünü sen seçiyorsun.' },
    ],
    coda: 'Gün, kullansan da kullanmasan da akıyor. Bugün onun *neyi inşa edeceğine* sen karar verebilirsin.',
    next: 'Peki ya takvim?',
  },
  {
    art: 'seed',
    artTop: false,
    title: '“Ama takvim *doğru bile değil.*”',
    paragraphs: [
      'Haklı olabilirsin. Takvim gökyüzünün değil, insanların çizdiği bir harita. Öyleyse bir tarih nasıl anlam taşır?',
      'Galiba iki sebepten.',
    ],
    list: [
      { n: '01', text: 'Paylaşılan anlam. Milyonlarca insan bugüne aynı anlamı yüklediğinde ortak bir alan oluşur. Bazı gelenekler buna egregor der. En azından bir şeyi kesin yapar: dikkatimizi toplar.' },
      { n: '02', text: 'Semboller zihne yön verir. Bir sayı tek başına dünyayı değiştirmeyebilir; ama dikkatini bir niyete çevirmen için güçlü bir işarettir. Tarih sembolik, çünkü ona anlamı biz veriyoruz.' },
    ],
    next: 'Öyleyse bugün ne yapmalı?',
  },
  {
    art: 'battery',
    artTop: true,
    eyebrow: 'Adım 01',
    title: 'Pilini *şarj et.*',
    paragraphs: [
      'Çoğumuz bardağımızı doldurmadan istemeye, üretmeye, dağıtmaya atlarız.',
      'Bugünü bir yakıt gibi düşün. Ama bu yakıt *yeni ihtimallerini* besliyor.',
      'Önce almaya zaman ayır. Işığın bedenine indiğini, seni ılık, altın bir dolgunlukla bir pil gibi doldurduğunu hayal et.',
    ],
    coda: '*Bu senin enerjetik “EVET”in.*',
  },
  {
    art: 'book',
    artTop: false,
    eyebrow: 'Adım 02',
    title: 'Tek bir *dilek tut.*',
    paragraphs: [
      'Yürümek istediğin yolu netleştir. Sonra o yolu zaten yaşayan *sen* hakkında yaz.',
      'Gerçekten ne istiyorsun, ama gerçekten?\nOraya varmak için ne yaptı?\nŞu an sana ne söylerdi?',
    ],
    coda: '*Adımları galiba zaten biliyorsun.*',
  },
  {
    art: 'path',
    artTop: true,
    eyebrow: 'Adım 03',
    title: 'Yaşam *senaryonu* yaz.',
    paragraphs: [
      'Seçtiğin hayatın haritasını çıkar; eşik kapandığında da yönünü kaybetme.',
      'Bu bir bilim iddiası değil, zihnin yön bulma biçimi: Yazdığını görürsün, gördüğünü fark edersin, fark ettiğini *seçersin.*',
    ],
  },
  {
    art: 'door',
    artTop: false,
    eyebrow: 'Adım 04',
    title: 'Hizalı *bir adım* at.',
    paragraphs: [
      'Çağırdığın hayatı yaşayan kişinin bugün yapacağı *TEK* bir şeyi yap.',
      'Bu, kendine ve inandığın her neyse ona *ciddi olduğunu* gösterir.',
    ],
    coda: '*Bu senin fiziksel “EVET”in.*',
  },
  {
    art: 'keyhole',
    artTop: true,
    paragraphs: [
      'Niyet yön verir. Gün her hâlükârda akıyor; en güçlü hâli, içindeki özle *nereye gideceğine karar verdiğinde.*',
    ],
    title: 'Eşikten *geç.*',
    coda: 'Ve kendi yaşam senaryonu yazmaya başla.',
  },
];
