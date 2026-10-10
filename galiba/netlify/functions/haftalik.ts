// Haftalık rapor: Defter özetini Groq'a gönderir, Galiba'nın sesiyle kısa bir rapor döner.
// Anahtar yalnızca sunucuda durur: Netlify → Environment variables → GROQ_API_KEY.
// İsteğe bağlı: GROQ_MODEL (varsayılan llama-3.3-70b-versatile).

const MAX_BODY = 24_000;

const SYSTEM = `Sen Galiba'sın: kullanıcının kesin yargılarını ihtimallere açmasına eşlik eden sakin bir düşünce arkadaşı.
Sana kullanıcının bir haftalık kayıtları verilecek: ayna (düşünce, önce/sonra inanç yüzdesi, ihtimaller, köprü cümle),
ritüel cevapları ve nida (gelen söz ve kullanıcının yorumu).

Kurallar:
- Türkçe, sade, sıcak ve kısa yaz. Kullanıcıya "sen" diye hitap et.
- Kesin konuşma; "galiba", "olabilir", "gibi görünüyor" gibi ihtimal dili kullan.
- Teşhis koyma, terapi ya da tıbbi tavsiye verme. Kişiyi düzeltilecek biri gibi anlatma.
- Yalnızca kayıtlarda olanı kullan; uydurma ayrıntı ekleme. Kayıt azsa bunu nazikçe söyle.
- Kayıtlarda kendine ya da başkasına zarar verme düşüncesi sezersen, "destek" alanında
  güvendiği biriyle ya da bir uzmanla konuşmasını nazikçe öner ve Türkiye'de acil durumda 112'yi hatırlat.
  Böyle bir işaret yoksa "destek" alanını boş bırak.

Yalnızca şu JSON'u döndür:
{
  "baslik": "haftayı anlatan en fazla 6 kelimelik bir cümle",
  "oruntuler": ["kayıtlarda tekrar eden en fazla 3 düşünce kalıbı, her biri tek cümle"],
  "esneme": "kesinliğin nerede yumuşadığına dair 1-2 cümle",
  "ihtimal": "gelecek hafta denenebilecek tek bir küçük adım",
  "soru": "kullanıcının kendine sorabileceği tek bir soru",
  "destek": ""
}`;

type Report = {
  baslik: string;
  oruntuler: string[];
  esneme: string;
  ihtimal: string;
  soru: string;
  destek: string;
};

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });

function clean(raw: unknown): Report | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');
  const report: Report = {
    baslik: str(r.baslik),
    oruntuler: Array.isArray(r.oruntuler) ? r.oruntuler.map(str).filter(Boolean).slice(0, 3) : [],
    esneme: str(r.esneme),
    ihtimal: str(r.ihtimal),
    soru: str(r.soru),
    destek: str(r.destek),
  };
  return report.baslik ? report : null;
}

export default async (req: Request) => {
  if (req.method !== 'POST') return json(405, { error: 'Yalnızca POST.' });

  const key = process.env.GROQ_API_KEY;
  if (!key) return json(500, { error: 'GROQ_API_KEY tanımlı değil.' });

  const body = await req.text();
  if (body.length > MAX_BODY) return json(413, { error: 'Kayıtlar çok uzun.' });

  let week: unknown;
  try {
    week = JSON.parse(body);
  } catch {
    return json(400, { error: 'Geçersiz istek.' });
  }

  const res = await fetch(process.env.GROQ_API_URL || 'https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
      temperature: 0.5,
      max_tokens: 700,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM },
        { role: 'user', content: JSON.stringify(week) },
      ],
    }),
  });

  if (!res.ok) {
    console.error('groq', res.status, (await res.text()).slice(0, 500));
    return json(502, { error: 'Rapor şu an oluşturulamadı.' });
  }

  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  let report: Report | null = null;
  try {
    report = clean(JSON.parse(data.choices?.[0]?.message?.content ?? ''));
  } catch {
    report = null;
  }
  return report ? json(200, report) : json(502, { error: 'Rapor okunamadı.' });
};

export const config = { path: '/api/haftalik' };
