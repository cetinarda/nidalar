// Rezonans okumasının sorusuna kullanıcının cevabı → Galiba'nın ikinci yanıtı.
// Önce sunucudaki yapay zekâ denenir; olmazsa bu kurallı yanıt cihazda üretilir.
import type { Lang } from '../i18n';

type Need = { key: string; tr: string[]; en: string[]; label: Record<Lang, string>; say: Record<Lang, string>; step: Record<Lang, string> };

const NEEDS: Need[] = [
  {
    key: 'para',
    tr: ['para', 'maddi', 'gelir', 'maaş', 'borç', 'finans', 'birikim', 'kira', 'ekonomi'],
    en: ['money', 'financ', 'income', 'salary', 'debt', 'savings', 'rent', 'cash'],
    label: { tr: 'para', en: 'money' },
    say: {
      tr: 'Para çoğu zaman bedenin güvenlik dilidir. Beden “ya olmazsa?” diye sorar; somut bir sayı bu soruyu küçültür.',
      en: 'Money is often the body’s language for safety. The body asks “what if it fails?”; a concrete number shrinks that question.',
    },
    step: {
      tr: 'Bu hafta, fikir hiç beklediğin gibi gitmese bile kaç ay idare edebileceğini hesapla.',
      en: 'This week, work out how many months you could manage even if the idea doesn’t go as hoped.',
    },
  },
  {
    key: 'motivasyon',
    tr: ['motivasyon', 'heves', 'istek', 'enerji', 'şevk', 'ilham', 'inanç', 'cesaret'],
    en: ['motivat', 'drive', 'energy', 'inspir', 'courage', 'desire', 'belief'],
    label: { tr: 'motivasyon', en: 'motivation' },
    say: {
      tr: 'Motivasyon çoğu zaman adımdan önce değil, adımdan sonra gelir. Beklemek yerine küçük bir hareket onu çağırabilir.',
      en: 'Motivation often comes after the step, not before it. Instead of waiting, a small movement can call it in.',
    },
    step: {
      tr: 'Fikre doğru on dakikalık bir adım at; sonra bedenine yeniden dön ve ne değiştiğine bak.',
      en: 'Take a ten-minute step toward the idea; then return to your body and notice what changed.',
    },
  },
  {
    key: 'zaman',
    tr: ['zaman', 'vakit', 'acele', 'süre', 'erken', 'geç'],
    en: ['time', 'rush', 'hurry', 'deadline', 'slow'],
    label: { tr: 'zaman', en: 'time' },
    say: {
      tr: 'Beden acele edildiğini hissettiğinde kasılır. Kendine tanıdığın süre, “evet”in nefes alacağı alandır.',
      en: 'The body tightens when it feels rushed. The time you allow yourself is the space where a “yes” can breathe.',
    },
    step: {
      tr: 'Bu karar için kendine gerçekçi bir tarih ver ve onu bir yere yaz.',
      en: 'Give yourself a realistic date for this decision and write it down.',
    },
  },
  {
    key: 'destek',
    tr: ['destek', 'yardım', 'biri', 'birisi', 'aile', 'eş', 'arkadaş', 'yalnız', 'insan', 'yanımda'],
    en: ['support', 'help', 'someone', 'family', 'partner', 'friend', 'alone', 'people'],
    label: { tr: 'destek', en: 'support' },
    say: {
      tr: 'Yalnız taşınan bir karar bedene ağır gelir. Yanında birinin olması, riskin kendisini değil ama yükünü değiştirir.',
      en: 'A decision carried alone feels heavy to the body. Having someone beside you doesn’t change the risk, but it changes the weight.',
    },
    step: {
      tr: 'Bu fikri güvendiğin bir kişiye anlat ve yalnızca dinlemesini iste.',
      en: 'Tell this idea to one person you trust and ask them only to listen.',
    },
  },
  {
    key: 'bilgi',
    tr: ['bilgi', 'plan', 'net', 'öğren', 'bilmek', 'araştır', 'deneyim', 'tecrübe'],
    en: ['inform', 'plan', 'clear', 'learn', 'know', 'research', 'experience'],
    label: { tr: 'netlik', en: 'clarity' },
    say: {
      tr: 'Belirsizlik bedende bir alarm gibi çalışır. Bilinmeyeni küçültmek, cesareti büyütmekten daha kolaydır.',
      en: 'Uncertainty works like an alarm in the body. Shrinking the unknown is easier than growing courage.',
    },
    step: {
      tr: 'Bu fikirle ilgili cevabını bilmediğin en önemli üç soruyu yaz.',
      en: 'Write the three most important questions about this idea you don’t yet know the answer to.',
    },
  },
  {
    key: 'guvence',
    tr: ['güven', 'garanti', 'emin', 'kesin', 'risk', 'korku', 'güvence'],
    en: ['safe', 'secur', 'guarantee', 'certain', 'sure', 'risk', 'fear'],
    label: { tr: 'güvence', en: 'reassurance' },
    say: {
      tr: 'Hiçbir fikir tam güvence vermez, galiba. Ama bir geri dönüş yolu bilmek, bedenin “evet” demesini kolaylaştırır.',
      en: 'No idea comes with a full guarantee, galiba. But knowing a way back makes it easier for the body to say “yes”.',
    },
    step: {
      tr: 'İşler yolunda gitmezse nasıl geri döneceğini tek cümleyle yaz.',
      en: 'Write in one sentence how you would step back if things don’t work out.',
    },
  },
  {
    key: 'dinlenme',
    tr: ['dinlen', 'uyku', 'yorgun', 'mola', 'tatil', 'nefes', 'sakin', 'huzur'],
    en: ['rest', 'sleep', 'tired', 'break', 'breath', 'calm', 'peace'],
    label: { tr: 'dinlenme', en: 'rest' },
    say: {
      tr: 'Yorgun bir beden her yeni fikre önce “hayır” der. Bu cevap fikre değil, yorgunluğa ait olabilir.',
      en: 'A tired body says “no” to every new idea first. That answer may belong to the tiredness, not the idea.',
    },
    step: {
      tr: 'Bu kararı iyi uyuduğun bir sabaha bırak ve o sabah yeniden tart.',
      en: 'Leave this decision for a morning after good sleep, and weigh it again then.',
    },
  },
];

const join = (items: string[], lang: Lang) =>
  items.length < 2 ? items.join('') : `${items.slice(0, -1).join(', ')} ${lang === 'tr' ? 've' : 'and'} ${items[items.length - 1]}`;

export function localReply(answer: string, lang: Lang): { reply: string; step: string } {
  const low = answer.toLocaleLowerCase(lang === 'tr' ? 'tr-TR' : 'en-GB');
  const words = low.split(/[^a-zçğıöşüâîû’']+/i).filter(Boolean);
  const hits = NEEDS.filter(n => n[lang].some(k => words.some(w => w.startsWith(k))));
  if (!hits.length) {
    return lang === 'tr'
      ? {
          reply: `“${answer.trim()}” diye yazdın. Bunu bedenine söylediğinde neyin gevşediğine bak; cevap orada olabilir. İhtiyacını adlandırmak, onu karşılamanın ilk adımıdır.`,
          step: 'Bu ihtiyacı karşılayabilecek en küçük şeyi bugün yap, sonra fikri yeniden tart.',
        }
      : {
          reply: `You wrote “${answer.trim()}”. Notice what loosens when you say this to your body; the answer may be there. Naming a need is the first step toward meeting it.`,
          step: 'Do the smallest thing that could meet this need today, then weigh the idea again.',
        };
  }
  const top = hits.slice(0, 2);
  const names = join(top.map(n => n.label[lang]), lang);
  const intro = lang === 'tr'
    ? `Bedenin ${names} istiyor. Bu bir zayıflık değil; güvende hissetmenin somut hâli.`
    : `Your body is asking for ${names}. That isn’t weakness; it’s what safety looks like in concrete terms.`;
  const outro = lang === 'tr'
    ? 'Bunlar biraz olsun karşılandığında fikri yeniden tart; bedenin farklı bir cevap verebilir.'
    : 'Once these are met even a little, weigh the idea again; your body may answer differently.';
  return { reply: [intro, ...top.map(n => n.say[lang]), outro].join(' '), step: top[0].step[lang] };
}
