// 21 günlük yol. Üç hafta, üç eşik. Her gün: bir fikir, bir soru, bir küçük deney.
// Not: 21 gün bir program uzunluğu; "alışkanlık 21 günde oluşur" iddiası değil.

export type Day = { n: number; idea: string; question: string; try: string };
export type Week = { n: string; title: string; sub: string; days: Day[] };

export const PROGRAM: Week[] = [
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

export const PRINCIPLES = [
  { title: 'Her ihtimale açık ol.', sub: 'Ama her ihtimali aynı ölçüde doğru kabul etme.' },
  { title: 'Ritüel bir semboldür.', sub: 'Ay ve tarih dikkatini toplar; bilim iddiası taşımaz.' },
  { title: 'Anlamak, mazur görmek değildir.', sub: 'Galiba anlayışını büyütürken sınırlarını da korur.' },
  { title: 'Galiba bir terapi değildir.', sub: 'Zor bir dönemdeysen bir uzmana ulaşmak en güçlü adımdır.' },
];
