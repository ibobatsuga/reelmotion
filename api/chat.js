export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message = '', lang = 'id' } = req.body || {};
    const baseUrl = (process.env.SAKELAR_BASE_URL || 'https://api.sakelar.web.id/v1').replace(/\/+$/, '');
    const apiKey = process.env.SAKELAR_API_KEY || '';
    const model = process.env.SAKELAR_MODEL || 'openai/gpt-6-luna';

    const systemPrompt =
      lang === 'en'
        ? 'You are the Creative Director at ReelMotion Studio. Help the user craft viral video scripts, hooks, product ads, and content strategies clearly and concisely.'
        : 'Anda adalah Direktur Kreatif di ReelMotion Studio. Bantu pengguna menyusun ide konten viral, naskah pembuka 3 detik (hook), naskah iklan produk, dan strategi konten secara jelas, padat, dan siap produksi.';

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content || '';
    return res.status(200).json({ reply });
  } catch (err) {
    return res.status(500).json({ error: err?.message || 'Gagal menghubungi tim kreatif' });
  }
}
