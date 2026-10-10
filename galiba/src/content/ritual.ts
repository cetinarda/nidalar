import { ArtName } from '../components/Art';

// Günlük ritüel: Eşik serisindeki dört adımın her gün tekrarlanabilir hâli.
// Her adım tek bir soru. Az metin, tek alan.

export type RitualStep = {
  key: 'sarj' | 'dilek' | 'senaryo' | 'adim';
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
    key: 'sarj',
    n: '01',
    title: 'Pilini *şarj et.*',
    minutes: 1,
    art: 'battery',
    guide: 'Nefesini değiştirmeye çalışma. Işığın başının üstünden inip göğsünde biriktiğini hayal et. Bedeninde ne fark ediyorsun?',
    prompt: 'Bedenin şu an ne söylüyor?',
    placeholder: 'Omuzlarım sıkı, göğsüm biraz açıldı…',
    yes: 'Enerjetik “EVET”',
  },
  {
    key: 'dilek',
    n: '02',
    title: 'Tek bir *dilek tut.*',
    minutes: 2,
    art: 'book',
    guide: 'Bir tane. Çok değil. Sonra onu zaten yaşayan sana sor: Oraya nasıl vardın?',
    prompt: 'Gerçekten ne istiyorsun, ama gerçekten?',
    placeholder: 'Kendime daha adil davranan biri olmak…',
    yes: 'Netlik',
  },
  {
    key: 'senaryo',
    n: '03',
    title: 'Senaryona *bir satır* ekle.',
    minutes: 2,
    art: 'path',
    guide: 'Şimdiki zamanda, kendi sesinle yaz. Abartma; inanabileceğin bir cümle seç. Galiba en güçlü cümleler en sade olanlardır.',
    prompt: 'O hayattan bir gün, tek cümle:',
    placeholder: 'Sabahları telefona değil, pencereye bakıyorum…',
    yes: 'Yön',
  },
  {
    key: 'adim',
    n: '04',
    title: 'Hizalı *bir adım* at.',
    minutes: 2,
    art: 'door',
    guide: 'Bugün, bu yolu yaşayan kişinin yapacağı küçük, somut bir şey. On dakikadan kısa sürsün.',
    prompt: 'Bugün hangi tek şeyi yapacaksın?',
    placeholder: 'Ertelediğim o mesajı göndereceğim.',
    yes: 'Fiziksel “EVET”',
  },
];
