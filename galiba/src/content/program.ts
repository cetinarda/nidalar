// 21 günlük yol. Üç hafta, üç eşik. Her gün: bir fikir, bir soru, bir küçük deney.
// Not: 21 gün bir program uzunluğu; "alışkanlık 21 günde oluşur" iddiası değil.

import type { Lang } from '../i18n';

export type Day = { n: number; idea: string; question: string; try: string };
export type Week = { n: string; title: string; sub: string; days: Day[] };

const PROGRAM_TR: Week[] = [
  {
    n: '01',
    title: 'Otomatik *pilotu fark et.*',
    sub: 'Zihnin ne kadar hızlı karar verdiğini gör.',
    days: [
      { n: 1, idea: 'Bir düşünce, bir gerçek değildir.', question: 'Bugün hangi düşünceye hiç sorgulamadan inandım?', try: 'Bir yargını “Şu an böyle düşünüyorum ki…” diye başlatarak tekrar söyle.' },
      { n: 2, idea: 'Olay ile yorum ayrıdır.', question: 'Olan neydi, benim eklediğim ne?', try: 'Seni zorlayan bir anı iki sütuna yaz: kamera ne kaydederdi, ben ne düşündüm.' },
      { n: 3, idea: 'Kesinlik kelimeleri ipucudur.', question: '“Her zaman”, “asla”, “herkes” bugün kaç kez geçti?', try: 'Birini “bazen”, “çoğu zaman” ya da “henüz” ile değiştir.' },
      { n: 4, idea: 'Duygu bilgi verir, hüküm vermez.', question: 'Hissettiğim şey neyi haber veriyor olabilir?', try: 'Bir duyguyu adlandır, sonra bedende nerede olduğunu bul.' },
      { n: 5, idea: 'Hız, doğruluk değildir.', question: 'Hangi kararı bir saat bekletsem değişirdi?', try: 'Bugün tek bir tepkini on nefes ertele.' },
      { n: 6, idea: 'Geçmiş, bugünün gözlüğüdür.', question: 'Bu yargı bana daha eski bir hikâyeyi hatırlatıyor mu?', try: '“Bu ilk kez mi oluyor, yoksa tanıdık mı?” diye sor.' },
      { n: 7, idea: 'Fark etmek zaten değişimdir.', question: 'Bu hafta en sık yakaladığım kalıp neydi?', try: 'Defterine dön; bir cümleyi yeniden oku, yanına “galiba” ekle.' },
    ],
  },
  {
    n: '02',
    title: 'Başka *pencereler aç.*',
    sub: 'Aynı olaya farklı yerlerden bak.',
    days: [
      { n: 8, idea: 'Her davranışın birden çok açıklaması vardır.', question: 'Bunun en az iki başka açıklaması ne olabilir?', try: 'Bir yargın için Ayna’yı aç ve üç ihtimal yaz.' },
      { n: 9, idea: 'Karşındakinin günü de devam ediyor.', question: 'Onun bugün neyle uğraştığını gerçekten biliyor muyum?', try: 'Birine yargılamadan tek bir soru sor.' },
      { n: 10, idea: 'Zaman perspektifi değiştirir.', question: 'Bu, bir yıl sonra ne kadar önemli olacak?', try: 'Olayı on yıl sonraki senin gözünden anlat.' },
      { n: 11, idea: 'Anlamak, katılmak değildir.', question: 'Katılmadığım bir görüşün en güçlü hâli ne?', try: 'Karşı görüşü, sahibinin onaylayacağı kadar iyi yaz.' },
      { n: 12, idea: 'Belirsizlik bir boşluk değil, bir alandır.', question: 'Bilmemeye ne kadar dayanabiliyorum?', try: 'Bir soruyu bugün cevapsız bırak ve bedenini izle.' },
      { n: 13, idea: 'İkimizin de göremediği bir şey olabilir.', question: 'Bu tartışmada üçüncü seçenek ne?', try: '“İkimiz de haklıysak, ne doğru olurdu?” diye düşün.' },
      { n: 14, idea: 'Merak, kesinliğin panzehiridir.', question: 'Bu hafta neyi merak etmeye başladım?', try: 'Haftanın en çok değişen inanç oranına bak.' },
    ],
  },
  {
    n: '03',
    title: 'Esnek ama *sağlam kal.*',
    sub: 'Neyi bildiğini, neyi bilmediğini ayırt et.',
    days: [
      { n: 15, idea: 'Her ihtimal eşit derecede doğru değildir.', question: 'Bu düşünceyi destekleyen kanıt ne kadar güçlü?', try: 'Bir inancına 0–100 arasında bir kanıt puanı ver.' },
      { n: 16, idea: 'Fikir değiştirmek bir güçtür.', question: 'En son ne zaman fikrimi değiştirdim?', try: 'Birine “Bu konuda yanılmışım” de.' },
      { n: 17, idea: 'İlk okuman bazen doğrudur.', question: 'Hangi sezgime güvenmem gerekiyor?', try: 'Haklı olduğun bir konuda sakin bir sınır cümlesi kur.' },
      { n: 18, idea: 'Anlamak, mazur görmek değildir.', question: 'Anlayışla sınır nerede buluşuyor?', try: '“Seni anlıyorum ve bu bana iyi gelmiyor” cümlesini prova et.' },
      { n: 19, idea: 'Köprü cümleler zorlamadan taşır.', question: 'İnanabileceğim bir sonraki cümle ne?', try: '“Yeterince iyiyim” yerine “Kendime daha adil davranmayı öğrenebilirim” de.' },
      { n: 20, idea: 'Değerler pusuladır.', question: 'Daha geniş bakınca, değerlerime uygun adım ne?', try: 'Bu hafta ertelediğin hizalı adımı at.' },
      { n: 21, idea: 'Eşik bir kapı değil, bir yürüyüş biçimi.', question: 'Bu üç haftada neyi daha az kesin, neyi daha net görüyorum?', try: 'Yaşam senaryonu yeniden oku ve bir satır ekle.' },
    ],
  },
];

const PRINCIPLES_TR = [
  { title: 'Her ihtimale açık ol.', sub: 'Ama her ihtimali aynı ölçüde doğru kabul etme.' },
  { title: 'Ritüel bir semboldür.', sub: 'Ay ve tarih dikkatini toplar; bilim iddiası taşımaz.' },
  { title: 'Anlamak, mazur görmek değildir.', sub: 'Galiba anlayışını büyütürken sınırlarını da korur.' },
  { title: 'Galiba bir terapi değildir.', sub: 'Zor bir dönemdeysen bir uzmana ulaşmak en güçlü adımdır.' },
];

const PROGRAM_EN: Week[] = [
  {
    n: '01',
    title: 'Notice the *autopilot.*',
    sub: 'See how fast your mind decides.',
    days: [
      { n: 1, idea: 'A thought is not a fact.', question: 'Which thought did I believe today without questioning it?', try: 'Say one judgment again, starting with “Right now I think that…”.' },
      { n: 2, idea: 'The event and the interpretation are separate.', question: 'What happened, and what did I add?', try: 'Write a hard moment in two columns: what a camera would record, what I thought.' },
      { n: 3, idea: 'Certainty words are clues.', question: 'How many times did “always”, “never”, “everyone” come up today?', try: 'Replace one with “sometimes”, “often” or “not yet”.' },
      { n: 4, idea: 'A feeling informs; it doesn’t rule.', question: 'What might this feeling be telling me?', try: 'Name one feeling, then find where it sits in your body.' },
      { n: 5, idea: 'Speed is not accuracy.', question: 'Which decision would change if I waited an hour?', try: 'Delay one reaction today by ten breaths.' },
      { n: 6, idea: 'The past is today’s lens.', question: 'Does this judgment remind me of an older story?', try: 'Ask: “Is this the first time, or is it familiar?”' },
      { n: 7, idea: 'Noticing is already change.', question: 'Which pattern did I catch most this week?', try: 'Go back to your journal; reread one sentence and add “galiba” to it.' },
    ],
  },
  {
    n: '02',
    title: 'Open *other windows.*',
    sub: 'Look at the same event from different places.',
    days: [
      { n: 8, idea: 'Every behaviour has more than one explanation.', question: 'What are at least two other explanations?', try: 'Open the Mirror for one judgment and write three possibilities.' },
      { n: 9, idea: 'The other person’s day goes on too.', question: 'Do I really know what they are dealing with today?', try: 'Ask someone one question without judging.' },
      { n: 10, idea: 'Time changes perspective.', question: 'How much will this matter a year from now?', try: 'Tell the event through the eyes of you, ten years from now.' },
      { n: 11, idea: 'Understanding is not agreeing.', question: 'What is the strongest form of a view I disagree with?', try: 'Write the opposing view so well its holder would approve.' },
      { n: 12, idea: 'Uncertainty is not a gap; it is a space.', question: 'How long can I stay with not knowing?', try: 'Leave one question unanswered today and watch your body.' },
      { n: 13, idea: 'There may be something neither of us sees.', question: 'What is the third option in this disagreement?', try: 'Ask: “If we were both right, what would be true?”' },
      { n: 14, idea: 'Curiosity is the antidote to certainty.', question: 'What did I start being curious about this week?', try: 'Look at the belief that shifted most this week.' },
    ],
  },
  {
    n: '03',
    title: 'Stay flexible, *stay grounded.*',
    sub: 'Tell what you know from what you don’t.',
    days: [
      { n: 15, idea: 'Not every possibility is equally true.', question: 'How strong is the evidence for this thought?', try: 'Give one belief an evidence score from 0 to 100.' },
      { n: 16, idea: 'Changing your mind is a strength.', question: 'When did I last change my mind?', try: 'Tell someone: “I was wrong about this.”' },
      { n: 17, idea: 'Your first read is sometimes right.', question: 'Which intuition should I trust?', try: 'On something you’re right about, form one calm boundary sentence.' },
      { n: 18, idea: 'Understanding is not excusing.', question: 'Where do understanding and boundaries meet?', try: 'Rehearse: “I understand you, and this doesn’t feel good to me.”' },
      { n: 19, idea: 'Bridge sentences carry without forcing.', question: 'What is the next sentence I could believe?', try: 'Instead of “I’m good enough”, say “I can learn to be fairer to myself.”' },
      { n: 20, idea: 'Values are a compass.', question: 'Looking wider, what step fits my values?', try: 'Take the aligned step you postponed this week.' },
      { n: 21, idea: 'A threshold is not a door; it is a way of walking.', question: 'In these three weeks, what do I see less certainly, and what more clearly?', try: 'Reread your path and add one line.' },
    ],
  },
];

const PRINCIPLES_EN = [
  { title: 'Be open to every possibility.', sub: 'But don’t believe them all equally.' },
  { title: 'A ritual is a symbol.', sub: 'The moon and the date gather attention; they make no scientific claim.' },
  { title: 'Understanding is not excusing.', sub: 'Galiba grows your understanding and protects your boundaries.' },
  { title: 'Galiba is not therapy.', sub: 'If you are going through a hard time, reaching out to a professional is the strongest step.' },
];

export const PROGRAM: Record<Lang, Week[]> = { tr: PROGRAM_TR, en: PROGRAM_EN };
export const PRINCIPLES: Record<Lang, { title: string; sub: string }[]> = { tr: PRINCIPLES_TR, en: PRINCIPLES_EN };
