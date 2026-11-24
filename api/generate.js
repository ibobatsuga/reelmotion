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
    const {
      topic = 'Misteri pembangunan Candi Borobudur',
      mode = 'video',
      format = '9:16',
      tier = 'short',
      style = 'Sinematik Nusantara',
      customScript = '',
      lang = 'id',
      motionGenre = 'edukasi',
    } = req.body || {};

    const baseUrl = (process.env.SAKELAR_BASE_URL || 'https://api.sakelar.web.id/v1').replace(/\/+$/, '');
    const apiKey = process.env.SAKELAR_API_KEY || '';
    const model = process.env.SAKELAR_MODEL || 'openai/gpt-6-luna';

    const scenesTarget = tier === 'short' ? 4 : tier === 'medium' ? 6 : 8;
    const isEn = lang === 'en';

    const systemPrompt = isEn
      ? `You are an expert video director and scriptwriter. Always reply ONLY with valid JSON (no markdown code blocks, no extra text).
Create a complete video production plan with exact JSON structure:
{
  "title": "Engaging Video Title",
  "summary": "1-2 sentence overview",
  "caption": "Ready-to-post caption for TikTok, Reels & YouTube",
  "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4"],
  "scenes": [
    {
      "headline": "SHORT IMPACTFUL ON-SCREEN HEADLINE (3-6 words)",
      "narration": "Spoken narration sentence for this scene (14-24 words, smooth and natural to read aloud).",
      "visualPrompt": "Detailed English visual description for illustration/photography (lighting, composition, subject, no text in image)",
      "statNumber": "Optional big number/metric e.g. '1,200+' or '85%'",
      "statLabel": "Optional label for the metric",
      "accentColor": "#4D5BAF"
    }
  ]
}
Produce exactly ${scenesTarget} scenes.`
      : `Anda adalah sutradara video dan penulis naskah profesional. Balas HANYA dengan JSON murni yang valid (tanpa blok markdown \`\`\`json, tanpa teks pengantar).
Susun rencana produksi video lengkap dengan struktur JSON persis seperti ini:
{
  "title": "Judul Video yang Menarik",
  "summary": "Ringkasan 1-2 kalimat",
  "caption": "Caption siap pakai untuk TikTok, Reels & YouTube",
  "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4"],
  "scenes": [
    {
      "headline": "JUDUL LAYAR SINGKAT & TAJAM (3-6 kata)",
      "narration": "Kalimat narasi yang diucapkan narator untuk adegan ini (14-24 kata, mengalir alami dan enak didengar).",
      "visualPrompt": "Detailed English visual description for illustration/photography matching style '${style}' (cinematic lighting, clear subject, no text)",
      "statNumber": "Angka atau poin sorotan opsional misal '1.200+' atau '99%' atau 'Bab 1'",
      "statLabel": "Label singkat untuk angka sorotan tersebut",
      "accentColor": "#4D5BAF"
    }
  ]
}
Buat tepat ${scenesTarget} adegan.`;

    const userPrompt = customScript
      ? `Topik: ${topic}\nMode: ${mode} (${format}, genre: ${motionGenre})\nGaya Visual: ${style}\nGunakan naskah dari pengguna berikut dan pecah menjadi ${scenesTarget} adegan:\n${customScript}`
      : `Topik: ${topic}\nMode: ${mode} (${format}, genre: ${motionGenre})\nGaya Visual: ${style}\nSusun ${scenesTarget} adegan berurutan (pembuka yang menahan perhatian, isi utama yang padat, dan penutup dengan ajakan).`;

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
          { role: 'user', content: userPrompt },
        ],
        max_tokens: 2500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      throw new Error(`Upstream error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    const rawContent = data?.choices?.[0]?.message?.content || '';

    let parsed = null;
    try {
      const cleaned = rawContent
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```\s*$/i, '')
        .trim();
      const firstBrace = cleaned.indexOf('{');
      const lastBrace = cleaned.lastIndexOf('}');
      parsed = JSON.parse(cleaned.slice(firstBrace, lastBrace + 1));
    } catch {
      parsed = null;
    }

    if (!parsed || !Array.isArray(parsed.scenes) || parsed.scenes.length === 0) {
      parsed = {
        title: topic,
        summary: `Video ${mode} otomatis tentang ${topic}.`,
        caption: `${topic} — Tonton sampai habis!`,
        hashtags: ['#reelmotion', '#edukasi', '#faktamenarik', '#kreator'],
        scenes: [
          {
            headline: topic.slice(0, 36).toUpperCase(),
            narration: customScript || `Tahukah Anda kisah menarik di balik ${topic}? Mari kita bahas fakta utamanya secara singkat.`,
            visualPrompt: `Cinematic wide shot illustrating ${topic}, ${style}, dramatic lighting, ultra detailed`,
            statNumber: '01',
            statLabel: 'Pembuka',
            accentColor: '#4D5BAF',
          },
          {
            headline: 'FAKTA UTAMA YANG JARANG DIKETAHUI',
            narration: `Banyak detail penting dari ${topic} yang membentuk sejarah dan perkembangannya hingga hari ini.`,
            visualPrompt: `Close up detailed scene of ${topic}, ${style}, rich atmosphere, high contrast`,
            statNumber: '02',
            statLabel: 'Inti Cerita',
            accentColor: '#FFA143',
          },
          {
            headline: 'KESIMPULAN & PESAN PENTING',
            narration: `Itulah rangkuman singkat mengenai ${topic}. Bagikan video ini bila bermanfaat untuk Anda.`,
            visualPrompt: `Epic finale scene of ${topic}, ${style}, golden hour lighting`,
            statNumber: '03',
            statLabel: 'Penutup',
            accentColor: '#11C6C2',
          },
        ],
      };
    }

    return res.status(200).json(parsed);
  } catch (err) {
    return res.status(500).json({
      error: err?.message || 'Gagal menyusun naskah video',
    });
  }
}
