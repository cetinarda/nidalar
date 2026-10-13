# Galiba

Kesinlikten ihtimale. Günde 7 dakikalık bir düşünce esnekliği ritüeli.

- `docs/strateji.md`: fikir, konumlandırma, rakip araştırması, ayırt edici yönler
- `docs/referans.md`: referans seriden ne alındı, ne alınmadı (birebir çeviri ekte)

## Dil

Türkçe ve İngilizce. İlk açılışta cihaz dili seçilir; Eşik serisinin üst çubuğundan ve Yol ekranının altından değiştirilebilir. Arayüz metinleri `src/i18n.ts`, içerikler her içerik dosyasında `tr` / `en` olarak durur. Nida sözleri Nidalar'ın `wisdom_tr.json` ve `wisdom_en.json` dosyalarından gelir.

## Yapı

- **Eşik**: 6 kartlık açılış serisi; kapakta günün sayıları (`src/content/esik.ts`, `src/content/numbers.ts`)
- **Bugün**: günün sayıları, günün fikri, dört adımlı ritüel ve Nida
- **Nida**: Nidalar'dan gelen söz çekme ritüeli (9 gelenek, 72 söz); söz geldikten sonra "Bu söz sana hangi ihtimali hatırlatıyor?" diye sorar. Söz, kullanıcının niyetine, bugünkü düşüncesine ve bu haftaki aynalarına göre cihazda seçilir (`src/content/nida.ts`)
- **Işık Yolu** (oyun): yıldızlar nefes ritminde sırayla yanar, kullanıcı aynı yolu çizer. Süre, puan ve kaybetme yok; yol hatasız turda uzar, zorlanınca kısalır; beşten sonra bazı turlar tersinden. 7 tur, ~3 dakika (`src/content/oyun.ts`)
- **Rezonans**: bir fikir yazılır, gizemli küreye 7 sn basılı tutulur (odaklanma ritüeli; ölçüm değildir), kalp, beden ve zihin ayrı ayrı sorulur, üç ışık tek noktada birleşir ve uyuma göre bir okuma çıkar (`src/content/rezonans.ts`)
- **Ayna**: İhtimal Aynası; kesinlik dedektörü, önce/sonra inanç oranı, köprü cümle
- **Yol**: 21 günlük program
- **Defter**: bu haftanın infografikleri (ritüel, ayna önce/sonra, kesinlik kelimeleri, yol), haftalık rapor ve yalnızca cihazda saklanan kayıtlar

## Çalıştırma

```
cd galiba
npm install
npm run web      # ya da npm run ios / android
npm run typecheck
```

## Canlıya alma (Netlify)

Ayarlar `netlify.toml` dosyasında. Netlify'da siteyi bu repoya bağlarken **Base directory** alanına `galiba` yazılması yeterli.

## Haftalık rapor (Groq)

Rapor `netlify/functions/haftalik.ts` üzerinden üretilir; API anahtarı uygulamaya gömülmez.

1. Netlify → **Project configuration → Environment variables → Add a variable**
   - `GROQ_API_KEY` = Groq konsolundan alınan anahtar (gizli tut)
   - İsteğe bağlı: `GROQ_MODEL` (varsayılan `llama-3.3-70b-versatile`)
2. Yeniden yayınla. Web sürümü `/api/haftalik` adresini kullanır.
3. Mobil derlemede `EXPO_PUBLIC_REPORT_URL=https://<site>.netlify.app/api/haftalik` verilmeli.

Yalnızca kullanıcı "Raporu yaz" dediğinde, o haftanın kısaltılmış kayıtları gönderilir.

Rezonans'ta okumanın sorusuna verilen cevaba ikinci yanıt `netlify/functions/rezonans.ts` (`/api/rezonans`) ile aynı anahtardan gelir. Anahtar yoksa ya da bağlantı kurulamazsa yanıt cihazda kurallı olarak yazılır (`src/content/rezonansYanit.ts`).
