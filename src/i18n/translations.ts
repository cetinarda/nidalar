export type Lang = 'tr' | 'en';

export type TranslationKey = keyof typeof TR;

export const TR = {
  // Common
  'common.back': '← Geri',
  'common.close': '✕',
  'common.cancel': 'İptal',
  'common.save': 'Kaydet',
  'common.saved': 'Kaydedildi',
  'common.share': 'Paylaş',
  'common.familyTag': 'SAKİN · NİDALAR',

  // Tabs
  'tab.home': 'Nida',
  'tab.library': 'Kitaplık',
  'tab.archive': 'Koleksiyon',
  'tab.profile': 'Profil',

  // Greetings
  'greeting.night': 'Gece',
  'greeting.morning': 'Günaydın',
  'greeting.day': 'İyi günler',
  'greeting.evening': 'İyi akşamlar',
  'greeting.guest': 'Yolcu',

  // Home
  'home.eyebrow': 'Sessizliğe bir an ayır',
  'home.intention.label': 'Bugün neyi hatırlamaya ihtiyacın var?',
  'home.intention.placeholder': 'Niyetini yazmadan da bırakabilirsin...',
  'home.cta': 'Bir Nida Gelsin',
  'home.cta.again': 'Yeni Bir Nida',
  'home.hint': 'Dokun ve bırak, gelsin',
  'home.arriving': 'Bir nida yaklaşıyor...',
  'home.arrived.eyebrow': 'Nidan ulaştı',
  'home.footer': 'Bu mesaj, tam bu an için mi belirdi?',

  // Passage detail
  'passage.from': '{book} kitabından',
  'passage.theme': 'Tema',
  'passage.intention.label': 'Niyetin',
  'passage.save': 'Kaydet',
  'passage.saved': 'Koleksiyonda',
  'passage.share': 'Paylaş',
  'passage.shareText': '"{text}"\n\n— {author}, {book}\n\nNidalar ile alındı',

  // Library
  'library.title': 'Kitaplık',
  'library.subtitle': '{n} kaynaktan gelen sözler',
  'library.passages': '{n} pasaj',
  'library.search.placeholder': 'Kitap, yazar veya gelenek ara...',
  'library.empty': 'Sonuç bulunamadı.',

  // Book detail
  'book.passages': 'Pasajlar',

  // Archive
  'archive.title': 'Koleksiyon',
  'archive.subtitle': 'Sakladığın sözler',
  'archive.empty.title': 'Henüz bir şey saklamadın',
  'archive.empty.sub': 'Bir nida geldiğinde kalbine dokunan sözleri burada toplayabilirsin.',
  'archive.history': 'Geçmiş Nidalar',
  'archive.removeAction': 'Kaldır',

  // Profile
  'profile.title': 'Profil',
  'profile.language': 'Dil',
  'profile.language.tr': 'Türkçe',
  'profile.language.en': 'English',
  'profile.stats.title': 'Yolculuğun',
  'profile.stats.totalDraws': 'Gelen Nida',
  'profile.stats.saved': 'Koleksiyon',
  'profile.about.title': 'Bilgelik Üzerine',
  'profile.about.body': 'Nidalar, kadim metinlerden gelen sözleri, tam ihtiyaç duyduğun anda karşına çıkarmayı amaçlayan sessiz bir ritüeldir. Tahmin etmez, yargılamaz; sadece bir an için durmana eşlik eder.',
  'profile.clearData': 'Tüm verileri sıfırla',
  'profile.clearData.confirmTitle': 'Emin misin?',
  'profile.clearData.confirmBody': 'Koleksiyonun ve geçmişin kalıcı olarak silinecek.',
  'profile.clearData.confirm': 'Sıfırla',
  'profile.version': 'Sürüm 1.0.0',
} as const;

export const EN: Record<keyof typeof TR, string> = {
  // Common
  'common.back': '← Back',
  'common.close': '✕',
  'common.cancel': 'Cancel',
  'common.save': 'Save',
  'common.saved': 'Saved',
  'common.share': 'Share',
  'common.familyTag': 'SAKİN · NIDALAR',

  // Tabs
  'tab.home': 'Nida',
  'tab.library': 'Library',
  'tab.archive': 'Collection',
  'tab.profile': 'Profile',

  // Greetings
  'greeting.night': 'Night',
  'greeting.morning': 'Good morning',
  'greeting.day': 'Good day',
  'greeting.evening': 'Good evening',
  'greeting.guest': 'Traveler',

  // Home
  'home.eyebrow': 'Take a moment of silence',
  'home.intention.label': 'What do you need to remember today?',
  'home.intention.placeholder': 'You can leave this empty too...',
  'home.cta': 'Let a Nida Arrive',
  'home.cta.again': 'A New Nida',
  'home.hint': 'Touch, and let it come',
  'home.arriving': 'A nida is arriving...',
  'home.arrived.eyebrow': 'Your nida has arrived',
  'home.footer': 'Did this message appear for this exact moment?',

  // Passage detail
  'passage.from': 'from {book}',
  'passage.theme': 'Theme',
  'passage.intention.label': 'Your intention',
  'passage.save': 'Save',
  'passage.saved': 'In collection',
  'passage.share': 'Share',
  'passage.shareText': '"{text}"\n\n— {author}, {book}\n\nReceived via Nidalar',

  // Library
  'library.title': 'Library',
  'library.subtitle': 'Words from {n} sources',
  'library.passages': '{n} passages',
  'library.search.placeholder': 'Search book, author or tradition...',
  'library.empty': 'No results found.',

  // Book detail
  'book.passages': 'Passages',

  // Archive
  'archive.title': 'Collection',
  'archive.subtitle': 'Words you have kept',
  'archive.empty.title': 'You haven’t saved anything yet',
  'archive.empty.sub': 'When a nida arrives and touches you, you can gather it here.',
  'archive.history': 'Past Nidas',
  'archive.removeAction': 'Remove',

  // Profile
  'profile.title': 'Profile',
  'profile.language': 'Language',
  'profile.language.tr': 'Türkçe',
  'profile.language.en': 'English',
  'profile.stats.title': 'Your Journey',
  'profile.stats.totalDraws': 'Nidas Received',
  'profile.stats.saved': 'Collected',
  'profile.about.title': 'About Bilgelik',
  'profile.about.body': 'Nidalar is a quiet ritual that brings words from ancient texts to you at the moment you need them. It does not predict or judge; it simply keeps you company for a moment of pause.',
  'profile.clearData': 'Reset all data',
  'profile.clearData.confirmTitle': 'Are you sure?',
  'profile.clearData.confirmBody': 'Your collection and history will be permanently deleted.',
  'profile.clearData.confirm': 'Reset',
  'profile.version': 'Version 1.0.0',
};

export const DICTIONARY: Record<Lang, Record<keyof typeof TR, string>> = {
  tr: TR,
  en: EN,
};
