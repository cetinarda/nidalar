# Galiba

Kesinlikten ihtimale. Günde 7 dakikalık bir düşünce esnekliği ritüeli.

- `docs/strateji.md`: fikir, konumlandırma, rakip araştırması, ayırt edici yönler
- `docs/referans.md`: referans seriden ne alındı, ne alınmadı (birebir çeviri ekte)

## Yapı

- **Eşik**: 6 kartlık açılış serisi; kapakta günün sayıları (`src/content/esik.ts`, `src/content/numbers.ts`)
- **Bugün**: günün sayıları, günün fikri, dört adımlı ritüel ve Nida
- **Nida**: Nidalar'dan gelen söz çekme ritüeli (9 gelenek, 72 söz); söz geldikten sonra "Bu söz sana hangi ihtimali hatırlatıyor?" diye sorar (`src/content/nida.ts`)
- **Ayna**: İhtimal Aynası; kesinlik dedektörü, önce/sonra inanç oranı, köprü cümle
- **Yol**: 21 günlük program
- **Defter**: yalnızca cihazda saklanan kayıtlar

## Çalıştırma

```
cd galiba
npm install
npm run web      # ya da npm run ios / android
npm run typecheck
```

## Canlıya alma (Netlify)

Ayarlar `netlify.toml` dosyasında. Netlify'da siteyi bu repoya bağlarken **Base directory** alanına `galiba` yazılması yeterli.
