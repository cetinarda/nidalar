// Rezonans: okumanın sorusuna verilen cevaba Galiba'nın ikinci yanıtı (Groq).
// Anahtar yalnızca sunucuda: GROQ_API_KEY. İsteğe bağlı: GROQ_MODEL, GROQ_API_URL.

const MAX_BODY = 6_000;

const SYSTEM = `Sen Galiba'sın: kullanıcının bir fikri kalbi, bedeni ve zihniyle tartmasına eşlik eden sakin bir düşünce arkadaşı.
Sana verilecek: fikir, kalp/beden/zihin yanıtları (-2 ile +2), bedende gerginlik olan yerler, okuma başlığı,
sorulan soru ve kullanıcının cevabı.

Kurallar:
- "dil" alanı "en" ise İngilizce, değilse Türkçe yaz. Kullanıcıya "sen" (İngilizcede "you") diye hitap et.
- 3-4 kısa cümle. Kullanıcının cevabındaki ihtiyacı adlandır ve onu bedenin güvenlik ihtiyacıyla ilişkilendir.
- "galiba", "olabilir" gibi ihtimal dili kullan; kesin konuşma, karar verme, finansal ya da tıbbi tavsiye verme.
- Ardından tek bir küçük, somut, bu hafta yapılabilecek adım öner.
- Zarar verme düşüncesi sezersen nazikçe güvendiği biriyle ya da bir uzmanla konuşmasını öner.

Yalnızca şu JSON'u döndür: { "yanit": "...", "adim": "..." }`;

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8' } });

export default async (req: Request) => {
  if (req.method !== 'POST') return json(405, { error: 'POST' });
  const key = process.env.GROQ_API_KEY;
  if (!key) return json(503, { error: 'no-key' });

  const body = await req.text();
  if (body.length > MAX_BODY) return json(413, { error: 'too-long' });
  try {
    JSON.parse(body);
  } catch {
    return json(400, { error: 'bad-request' });
  }

  const res = await fetch(process.env.GROQ_API_URL || 'https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
      temperature: 0.6,
      max_tokens: 350,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM },
        { role: 'user', content: body },
      ],
    }),
  });
  if (!res.ok) {
    console.error('groq', res.status, (await res.text()).slice(0, 300));
    return json(502, { error: 'upstream' });
  }
  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  try {
    const out = JSON.parse(data.choices?.[0]?.message?.content ?? '');
    const yanit = typeof out.yanit === 'string' ? out.yanit.trim() : '';
    const adim = typeof out.adim === 'string' ? out.adim.trim() : '';
    return yanit ? json(200, { yanit, adim }) : json(502, { error: 'empty' });
  } catch {
    return json(502, { error: 'parse' });
  }
};

export const config = { path: '/api/rezonans' };
