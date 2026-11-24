export type Lang = 'id' | 'en';
export type Theme = 'dark' | 'light';

export type StudioTab =
  | 'dashboard'
  | 'auto-video'
  | 'payment'
  | 'my-tokens'
  | 'token-gratis'
  | 'galeri'
  | 'etalase'
  | 'my-sosmed'
  | 'auto-iklan'
  | 'karyawan-chat';

export type AutoContentMode = 'video' | 'motion' | 'audiobook' | 'clipper';

export interface VideoJob {
  id: string;
  topic: string;
  mode: AutoContentMode;
  format: '9:16' | '16:9';
  tier: 'short' | 'medium' | 'long';
  style: string;
  voice: string;
  status: 'done' | 'running' | 'needs_client' | 'failed';
  progress: number;
  stageLabel: string;
  createdAt: string;
  tokensUsed: number;
  youtubeId?: string;
  videoUrl?: string;
  caption?: string;
  hashtags?: string[];
  scriptPreview?: string;
  scenesCount?: number;
}

export interface TokenLedgerEntry {
  id: string;
  title: string;
  feature: 'autovideo' | 'motion' | 'audiobook' | 'clipper' | 'topup' | 'bonus';
  delta: number;
  balanceAfter: number;
  createdAt: string;
  stage?: string;
}

export const SHOWCASE_VIDEOS = [
  {
    id: 'm169',
    title: 'Motion Video — Penjelasan & Iklan Brand',
    category: 'autovideo169',
    ratio: '16:9' as const,
    youtubeId: 'C3aS6HSPZsw',
    tagId: 'Video horizontal (16:9)',
    tagEn: 'Horizontal video (16:9)',
  },
  {
    id: 'f169',
    title: 'Faceless Video — Dokumenter & Sejarah',
    category: 'autovideo169',
    ratio: '16:9' as const,
    youtubeId: 'BpKG9cGpx0I',
    tagId: 'Video horizontal (16:9)',
    tagEn: 'Horizontal video (16:9)',
  },
  {
    id: 'm916',
    title: 'Motion Video — Produk & Statistik',
    category: 'autovideo',
    ratio: '9:16' as const,
    youtubeId: 'wLf1NwaNijM',
    tagId: 'Video vertikal (9:16)',
    tagEn: 'Vertical video (9:16)',
  },
  {
    id: 'f916',
    title: 'Faceless Video — Misteri & Edukasi',
    category: 'autovideo',
    ratio: '9:16' as const,
    youtubeId: 't0h2rd4Rl6k',
    tagId: 'Video vertikal (9:16)',
    tagEn: 'Vertical video (9:16)',
  },
];

export const INITIAL_JOBS: VideoJob[] = [
  {
    id: 'job-borobudur-916',
    topic: 'Misteri pembangunan Candi Borobudur tanpa semen',
    mode: 'video',
    format: '9:16',
    tier: 'short',
    style: 'Sinematik Nusantara',
    voice: 'Arjuna — Suara Dokumenter',
    status: 'done',
    progress: 100,
    stageLabel: 'Video siap!',
    createdAt: '24 Nov 2026, 21:40',
    tokensUsed: 3,
    youtubeId: 't0h2rd4Rl6k',
    scenesCount: 14,
    scriptPreview:
      'Lebih dari seribu dua ratus tahun lalu, dua juta balok batu vulkanik disusun di jantung Pulau Jawa tanpa setetes pun perekat semen. Bagaimana arsitek kuno mengunci struktur raksasa ini agar tahan gempa berabad-abad?',
  },
  {
    id: 'job-kopi-motion',
    topic: 'Kopi Susu Aren Toko Senja — Diskon 20% Minggu Ini',
    mode: 'motion',
    format: '9:16',
    tier: 'short',
    style: 'Animasi Iklan Produk',
    voice: 'Kirana — Suara Komersial',
    status: 'done',
    progress: 100,
    stageLabel: 'Video selesai!',
    createdAt: '24 Nov 2026, 20:15',
    tokensUsed: 3,
    youtubeId: 'wLf1NwaNijM',
    scenesCount: 8,
    scriptPreview:
      'Masih ngantuk di jam kerja? Rasakan perpaduan espresso Arabika Gayo dan gula aren organik asli di Kopi Susu Aren Toko Senja. Khusus minggu ini diskon 20 persen!',
  },
  {
    id: 'job-pulau-jawa-169',
    topic: 'Pulau Jawa: Tanah Leluhur Manusia 1,2 Juta Tahun Lalu',
    mode: 'video',
    format: '16:9',
    tier: 'medium',
    style: 'Lukisan Sejarah Klasik',
    voice: 'Bima — Bercerita Mendalam',
    status: 'done',
    progress: 100,
    stageLabel: 'Video siap!',
    createdAt: '24 Nov 2026, 18:02',
    tokensUsed: 5,
    youtubeId: 'BpKG9cGpx0I',
    scenesCount: 42,
    scriptPreview:
      'Bab 1: Jejak Sangiran. Di lembah Bengawan Solo, lapisan tanah purba menyimpan rahasia migrasi manusia purba yang mengubah peta sejarah dunia...',
  },
  {
    id: 'job-audiobook-ep1',
    topic: 'Episode 1: Senja di Pelabuhan Sunda Kelapa (Novel Sejarah)',
    mode: 'audiobook',
    format: '16:9',
    tier: 'medium',
    style: 'Tema Bara — Sorot Kata',
    voice: 'Saraswati — Narator Buku',
    status: 'done',
    progress: 100,
    stageLabel: 'Episode selesai!',
    createdAt: '23 Nov 2026, 22:18',
    tokensUsed: 3,
    youtubeId: 'C3aS6HSPZsw',
    scenesCount: 1,
    scriptPreview:
      'Angin muson barat menggoyang tiang-tiang layar kapal phinisi yang bersandar rapat di muara Ciliwung. Di balik kabut pagi tahun 1527...',
  },
];

export const INITIAL_LEDGER: TokenLedgerEntry[] = [
  {
    id: 'tx-105',
    title: 'Misteri pembangunan Candi Borobudur tanpa semen',
    feature: 'autovideo',
    delta: -3,
    balanceAfter: 147,
    createdAt: '24 Nov 2026, 21:40',
    stage: 'Naskah + Narasi + Gambar + Penyatuan Video 9:16',
  },
  {
    id: 'tx-104',
    title: 'Kopi Susu Aren Toko Senja — Diskon 20%',
    feature: 'motion',
    delta: -3,
    balanceAfter: 150,
    createdAt: '24 Nov 2026, 20:15',
    stage: 'Animasi Motion 30 dtk + Musik Latar',
  },
  {
    id: 'tx-103',
    title: 'Paket 50 RMToken + Promo X3 Token (+100 Bonus)',
    feature: 'topup',
    delta: 150,
    balanceAfter: 153,
    createdAt: '24 Nov 2026, 17:30',
    stage: 'QRIS Otomatis Lunas (Rp50.000)',
  },
  {
    id: 'tx-102',
    title: 'Episode 1: Senja di Pelabuhan Sunda Kelapa',
    feature: 'audiobook',
    delta: -3,
    balanceAfter: 3,
    createdAt: '23 Nov 2026, 22:18',
    stage: 'Narasi Suara + Sorot Kata + Penyatuan Episode',
  },
  {
    id: 'tx-101',
    title: 'Bonus Akun Baru (Verifikasi WhatsApp Selesai)',
    feature: 'bonus',
    delta: 6,
    balanceAfter: 6,
    createdAt: '23 Nov 2026, 21:00',
    stage: 'Bonus Pendaftaran Gratis',
  },
];

export const IMAGE_STYLES = [
  'Sinematik Nusantara',
  'Lukisan Sejarah Klasik',
  'Ilustrasi Anime Hangat',
  'Kota Futuristik Neon',
  'Animasi 3D Modern',
  'Film Dokumenter Arsip',
  'Lukisan Cat Minyak Epik',
  'Ilustrasi Editorial Bersih',
  'Komik & Tinta Klasik',
  'Fotografi Alam Realistis',
];

export const VOICE_LIBRARY = [
  { id: 'v1', name: 'Arjuna — Suara Dokumenter (ID)', lang: 'id' },
  { id: 'v2', name: 'Kirana — Suara Komersial & Cerah (ID)', lang: 'id' },
  { id: 'v3', name: 'Bima — Suara Bercerita Mendalam (ID)', lang: 'id' },
  { id: 'v4', name: 'Saraswati — Suara Narator Buku (ID)', lang: 'id' },
  { id: 'v5', name: 'Marcus — Documentary Narrator (EN)', lang: 'en' },
];

export const MOTION_GENRES = [
  { id: 'edukasi', idLabel: 'Edukasi', enLabel: 'Explainer', descId: 'Penjelasan dengan angka, grafik, daftar', descEn: 'Explained with numbers, charts, lists' },
  { id: 'iklan', idLabel: 'Iklan produk', enLabel: 'Product ad', descId: 'Promosi produk, toko, atau jasa', descEn: 'Promote a product, shop or service' },
  { id: 'cerita', idLabel: 'Cerita & sejarah', enLabel: 'Story & history', descId: 'Kisah berurutan dengan tokoh bergerak', descEn: 'A story told with moving characters' },
  { id: 'tekateki', idLabel: 'Teka-teki & kuis', enLabel: 'Riddle & quiz', descId: 'Pertanyaan, waktu berpikir, lalu jawaban', descEn: 'A question, thinking time, then the answer' },
  { id: 'tips', idLabel: 'Tips & daftar', enLabel: 'Tips & lists', descId: 'Langkah atau tips praktis bernomor', descEn: 'Practical numbered tips or steps' },
  { id: 'fakta', idLabel: 'Fakta & berita', enLabel: 'Facts & news', descId: 'Fakta mengejutkan, data, kabar terkini', descEn: 'Surprising facts, data, news' },
  { id: 'motivasi', idLabel: 'Motivasi & kutipan', enLabel: 'Motivation & quotes', descId: 'Kata-kata penyemangat yang menyentuh', descEn: 'Uplifting, emotional words' },
  { id: 'anak', idLabel: 'Anak-anak', enLabel: 'For kids', descId: 'Cerita & belajar seru untuk anak', descEn: 'Fun stories & learning for kids' },
];
