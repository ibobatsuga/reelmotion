import React, { useState } from 'react';
import {
  Clapperboard,
  MonitorPlay,
  Headphones,
  Scissors,
  Sparkles,
  WandSparkles,
  Check,
  Play,
  Download,
  Youtube,
  Share2,
  SlidersHorizontal,
  Volume2,
  Image as ImageIcon,
  FileText,
  Clock,
  Loader2,
  CheckCircle2,
  Coins,
  Plus,
  RefreshCw,
} from 'lucide-react';
import {
  Lang,
  AutoContentMode,
  VideoJob,
  IMAGE_STYLES,
  VOICE_LIBRARY,
  MOTION_GENRES,
} from '../data/mockData';

interface AutoVideoStudioProps {
  lang: Lang;
  initialMode: AutoContentMode;
  initialFormat: '9:16' | '16:9';
  jobs: VideoJob[];
  walletBalance: number;
  onCreateJob: (job: VideoJob, cost: number) => void;
  onOpenTopUp: () => void;
}

export const AutoVideoStudio: React.FC<AutoVideoStudioProps> = ({
  lang,
  initialMode,
  initialFormat,
  jobs,
  walletBalance,
  onCreateJob,
  onOpenTopUp,
}) => {
  const isEn = lang === 'en';
  const t = (id: string, en: string) => (isEn ? en : id);

  const [mode, setMode] = useState<AutoContentMode>(initialMode);
  const [format, setFormat] = useState<'9:16' | '16:9'>(initialFormat);
  const [tier, setTier] = useState<'short' | 'medium' | 'long'>('short');
  const [motionDuration, setMotionDuration] = useState<'10' | '30' | '60' | '90' | '120'>('30');
  const [motionGenre, setMotionGenre] = useState<string>('edukasi');
  const [topic, setTopic] = useState<string>('');
  const [customScript, setCustomScript] = useState<string>('');
  const [youtubeUrl, setYoutubeUrl] = useState<string>('https://www.youtube.com/watch?v=u9uhUhPsxgI');
  const [clipCriteria, setClipCriteria] = useState<string>('hook');
  const [style, setStyle] = useState<string>(IMAGE_STYLES[0]);
  const [voice, setVoice] = useState<string>(VOICE_LIBRARY[0].name);
  const [reviewEachStep, setReviewEachStep] = useState<boolean>(false);
  const [webResearch, setWebResearch] = useState<boolean>(true);
  const [autoYoutube, setAutoYoutube] = useState<boolean>(false);
  const [playingJobId, setPlayingJobId] = useState<string | null>(null);
  const [activeGeneratingJob, setActiveGeneratingJob] = useState<VideoJob | null>(null);

  const calculateCost = (): number => {
    if (mode === 'video') {
      return tier === 'short' ? 3 : tier === 'medium' ? 5 : 8;
    }
    if (mode === 'motion') {
      const map: Record<string, number> = { '10': 2, '30': 3, '60': 4, '90': 6, '120': 8 };
      return map[motionDuration] || 3;
    }
    if (mode === 'audiobook') {
      return tier === 'short' ? 2 : tier === 'medium' ? 3 : 5;
    }
    return 5; // AutoClipper: 3 block + 2 clip
  };

  const currentCost = calculateCost();

  const handleStartGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const defaultTopic =
      mode === 'clipper'
        ? `Klip YouTube (${clipCriteria.toUpperCase()}): ${youtubeUrl}`
        : topic.trim() ||
          (mode === 'motion'
            ? 'Kopi Susu Aren Toko Senja — Promo Diskon 20%'
            : mode === 'audiobook'
            ? 'Episode 2: Rahasia Benteng Batavia di Malam Tahun Baru'
            : 'Sejarah Kerajaan Majapahit dan Sumpah Palapa Gajah Mada');

    if (walletBalance < currentCost) {
      onOpenTopUp();
      return;
    }

    const newJobId = `job-${Date.now()}`;
    const ytSample =
      mode === 'motion'
        ? format === '9:16'
          ? 'wLf1NwaNijM'
          : 'C3aS6HSPZsw'
        : format === '9:16'
        ? 't0h2rd4Rl6k'
        : 'BpKG9cGpx0I';

    const runningJob: VideoJob = {
      id: newJobId,
      topic: defaultTopic,
      mode,
      format,
      tier,
      style: mode === 'motion' ? `Motion (${motionGenre} · ${motionDuration}s)` : style,
      voice,
      status: 'running',
      progress: 15,
      stageLabel: t('Menulis naskah dan menyusun adegan...', 'Writing script and laying out scenes...'),
      createdAt: 'Baru saja',
      tokensUsed: currentCost,
      youtubeId: ytSample,
      scenesCount: mode === 'audiobook' ? 1 : tier === 'short' ? 14 : tier === 'medium' ? 28 : 45,
      scriptPreview:
        customScript.trim() ||
        `[Naskah Otomatis ReelMotion AI] — ${defaultTopic}. Riset web selesai: 6 sumber kredibilitas tinggi dirangkum menjadi narasi penuh dengan sinkronisasi subtitle kata-demi-kata...`,
    };

    setActiveGeneratingJob(runningJob);

    setTimeout(() => {
      setActiveGeneratingJob((prev) =>
        prev
          ? {
              ...prev,
              progress: 55,
              stageLabel: t(
                'Merekam narasi VoxCPM2 & melukis gambar Z-Image Turbo...',
                'Recording VoxCPM2 narration & rendering Z-Image Turbo...'
              ),
            }
          : null
      );
    }, 1100);

    setTimeout(() => {
      setActiveGeneratingJob((prev) =>
        prev
          ? {
              ...prev,
              progress: 85,
              stageLabel: t(
                'Menyatukan video & menyelaraskan teks per kata (Stable-Whisper)...',
                'Assembling video & aligning word-by-word subtitles...'
              ),
            }
          : null
      );
    }, 2200);

    setTimeout(() => {
      const completed: VideoJob = {
        ...runningJob,
        status: 'done',
        progress: 100,
        stageLabel: t('Video siap!', 'Video ready!'),
      };
      setActiveGeneratingJob(null);
      onCreateJob(completed, currentCost);
      setTopic('');
    }, 3300);
  };

  const modes: {
    id: AutoContentMode;
    name: string;
    badge: string;
    desc: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'video',
      name: 'Faceless',
      badge: '9:16 & 16:9',
      desc: t(
        'Video bergambar AI dengan suara narator & subtitle karaoke.',
        'AI illustrated video with narrator voice & karaoke subtitles.'
      ),
      icon: <Clapperboard className="h-4 w-4" />,
    },
    {
      id: 'motion',
      name: 'Motion',
      badge: '10s–120s',
      desc: t(
        'Animasi grafis bergerak: teks, ikon, grafik, dan tokoh.',
        'Animated motion graphics: kinetic typography, icons, charts, characters.'
      ),
      icon: <Sparkles className="h-4 w-4" />,
    },
    {
      id: 'audiobook',
      name: 'AudioBook',
      badge: t('Per Episode', 'Per Episode'),
      desc: t(
        'Buku atau cerita panjang dibacakan narator dengan sorot kata.',
        'Long stories narrated with synchronized on-screen reading text.'
      ),
      icon: <Headphones className="h-4 w-4" />,
    },
    {
      id: 'clipper',
      name: 'AutoClipper',
      badge: 'YouTube → 9:16',
      desc: t(
        'Potong video YouTube panjang menjadi beberapa klip vertikal.',
        'Slice long YouTube videos into viral vertical short clips.'
      ),
      icon: <Scissors className="h-4 w-4" />,
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-default)] pb-5">
        <div>
          <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[var(--accent-amber)]">
            <WandSparkles className="h-3.5 w-3.5" />
            {t('STUDIO AUTO KONTEN AI', 'AI AUTO CONTENT STUDIO')}
          </div>
          <h1 className="mt-1 font-display text-2xl sm:text-3xl font-bold tracking-tight">
            {t('Buat Video & Konten Otomatis', 'Create Automated Videos & Content')}
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] px-3.5 py-2 text-[13px]">
            <span className="h-2 w-2 rounded-full bg-[var(--success)]" />
            <span className="text-[var(--text-muted)]">{t('Mesin Server:', 'Server Sidecar:')}</span>
            <span className="font-semibold text-[var(--text-primary)]">
              {t('Aktif (Kaggle T4x2 + RunPod)', 'Active (Kaggle T4x2 + RunPod)')}
            </span>
          </div>
        </div>
      </div>

      {/* 4 Mode Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {modes.map((m) => {
          const active = mode === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setMode(m.id)}
              className={`flex flex-col justify-between rounded-2xl border p-4 text-left transition cursor-pointer ${
                active
                  ? 'border-[var(--accent-amber)] bg-[var(--accent-amber-bg)] shadow-md'
                  : 'border-[var(--border-default)] bg-[var(--bg-card)] hover:border-[var(--border-hover)]'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2 font-display text-[15px] font-bold">
                  <span className="text-[var(--accent-amber)]">{m.icon}</span>
                  <span>{m.name}</span>
                </div>
                <span className="rounded-full border border-[var(--border-default)] bg-[var(--bg-secondary)] px-2 py-0.5 text-[10.5px] font-semibold text-[var(--text-muted)]">
                  {m.badge}
                </span>
              </div>
              <p className="mt-2 text-[12.5px] leading-snug text-[var(--text-muted)]">{m.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Main Studio Generator & Live Pipeline Preview */}
      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
        {/* Form Builder */}
        <form
          onSubmit={handleStartGenerate}
          className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5 sm:p-6 space-y-5"
        >
          {/* Format & Duration Row */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-[12px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">
                {t('Rasio Layar', 'Aspect Ratio')}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormat('9:16')}
                  className={`flex items-center justify-center gap-2 rounded-xl border py-2.5 text-[13px] font-semibold cursor-pointer transition ${
                    format === '9:16'
                      ? 'border-[var(--accent-amber)] bg-[var(--accent-amber-bg)] text-[var(--text-primary)]'
                      : 'border-[var(--border-default)] bg-[var(--bg-input)] text-[var(--text-muted)]'
                  }`}
                >
                  <Clapperboard className="h-4 w-4 text-[var(--accent-amber)]" />
                  <span>9:16 {t('Vertikal', 'Vertical')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormat('16:9')}
                  disabled={mode === 'clipper'}
                  className={`flex items-center justify-center gap-2 rounded-xl border py-2.5 text-[13px] font-semibold cursor-pointer transition disabled:opacity-40 ${
                    format === '16:9'
                      ? 'border-[var(--accent-amber)] bg-[var(--accent-amber-bg)] text-[var(--text-primary)]'
                      : 'border-[var(--border-default)] bg-[var(--bg-input)] text-[var(--text-muted)]'
                  }`}
                >
                  <MonitorPlay className="h-4 w-4 text-[var(--accent-amber)]" />
                  <span>16:9 {t('Horizontal', 'Horizontal')}</span>
                </button>
              </div>
            </div>

            {mode === 'motion' ? (
              <div>
                <label className="block text-[12px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">
                  {t('Durasi Animasi Motion', 'Motion Duration')}
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {(['10', '30', '60', '90', '120'] as const).map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setMotionDuration(d)}
                      className={`rounded-xl border py-2.5 text-[12.5px] font-bold cursor-pointer transition ${
                        motionDuration === d
                          ? 'border-[var(--accent-amber)] bg-[var(--accent-amber-bg)] text-[var(--text-primary)]'
                          : 'border-[var(--border-default)] bg-[var(--bg-input)] text-[var(--text-muted)]'
                      }`}
                    >
                      {d}s
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-[12px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">
                  {t('Tingkat Durasi & Panjang', 'Duration Tier')}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { id: 'short', idLabel: 'Pendek', enLabel: 'Short' },
                      { id: 'medium', idLabel: 'Sedang', enLabel: 'Medium' },
                      { id: 'long', idLabel: 'Panjang', enLabel: 'Long' },
                    ] as const
                  ).map((tr) => (
                    <button
                      key={tr.id}
                      type="button"
                      onClick={() => setTier(tr.id)}
                      className={`rounded-xl border py-2.5 text-[12.5px] font-semibold cursor-pointer transition ${
                        tier === tr.id
                          ? 'border-[var(--accent-amber)] bg-[var(--accent-amber-bg)] text-[var(--text-primary)]'
                          : 'border-[var(--border-default)] bg-[var(--bg-input)] text-[var(--text-muted)]'
                      }`}
                    >
                      {isEn ? tr.enLabel : tr.idLabel}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Mode-Specific Inputs */}
          {mode === 'clipper' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-[12.5px] font-semibold text-[var(--text-primary)] mb-1.5">
                  {t('Tautan Video YouTube Panjang', 'Long YouTube Video URL')}
                </label>
                <input
                  type="url"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-input)] px-3.5 py-2.5 text-[13.5px] text-[var(--text-primary)] focus:border-[var(--accent-amber)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[12.5px] font-semibold text-[var(--text-primary)] mb-1.5">
                  {t('Kriteria Momen Terbaik (AI Selector)', 'Best Moment Criteria (AI Selector)')}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'hook', label: t('Paling menahan (Hook)', 'Most gripping') },
                    { id: 'informatif', label: t('Informatif', 'Informative') },
                    { id: 'lucu', label: t('Lucu & Spontan', 'Funny') },
                    { id: 'kontroversial', label: t('Kontroversial', 'Contrarian') },
                    { id: 'emosional', label: t('Emosional', 'Emotional') },
                    { id: 'praktis', label: t('Bisa dipakai (Tips)', 'Actionable') },
                  ].map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setClipCriteria(c.id)}
                      className={`rounded-xl border px-3 py-2 text-left text-[12px] font-semibold cursor-pointer transition ${
                        clipCriteria === c.id
                          ? 'border-[var(--accent-amber)] bg-[var(--accent-amber-bg)] text-[var(--text-primary)]'
                          : 'border-[var(--border-default)] bg-[var(--bg-input)] text-[var(--text-muted)]'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {mode === 'motion' && (
                <div>
                  <label className="block text-[12.5px] font-semibold text-[var(--text-primary)] mb-1.5">
                    {t('Jenis Video Motion Graphic', 'Motion Graphic Genre')}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {MOTION_GENRES.map((g) => (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => setMotionGenre(g.id)}
                        className={`rounded-xl border p-2.5 text-left transition cursor-pointer ${
                          motionGenre === g.id
                            ? 'border-[var(--accent-amber)] bg-[var(--accent-amber-bg)]'
                            : 'border-[var(--border-default)] bg-[var(--bg-input)]'
                        }`}
                      >
                        <div className="text-[12.5px] font-bold">
                          {isEn ? g.enLabel : g.idLabel}
                        </div>
                        <div className="mt-0.5 text-[11px] text-[var(--text-muted)] line-clamp-1">
                          {isEn ? g.descEn : g.descId}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[12.5px] font-semibold text-[var(--text-primary)] mb-1.5">
                  {mode === 'audiobook'
                    ? t('Judul Buku & Bab / Episode', 'Book Title & Chapter / Episode')
                    : t('Topik atau Ide Video', 'Video Topic or Idea')}
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder={
                    mode === 'motion'
                      ? t(
                          'Contoh: Kopi Susu Aren Toko Senja - diskon 20% minggu ini, pesan lewat WhatsApp',
                          'Example: Senja Iced Palm Sugar Coffee - 20% off this week, order via WhatsApp'
                        )
                      : mode === 'audiobook'
                      ? t(
                          'Contoh: Episode 2 — Kabut di Pelabuhan Sunda Kelapa',
                          'Example: Episode 2 — Fog Over Sunda Kelapa Harbor'
                        )
                      : t(
                          'Contoh: Misteri pembangunan Candi Borobudur tanpa semen',
                          'Example: The mystery of Borobudur Temple built without cement'
                        )
                  }
                  className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-input)] px-3.5 py-2.5 text-[13.5px] text-[var(--text-primary)] focus:border-[var(--accent-amber)] focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[12.5px] font-semibold text-[var(--text-primary)]">
                    {mode === 'audiobook'
                      ? t('Naskah Cerita / Novel untuk Dibacakan', 'Story / Book Manuscript to Narrate')
                      : t('Naskah Sendiri (Opsional - kosongkan agar ditulis AI)', 'Custom Script (Optional - leave blank for AI writer)')}
                  </label>
                  <span className="text-[11px] text-[var(--text-faint)]">
                    {t('Otomatis dirapikan untuk TTS', 'Auto-normalized for TTS')}
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={customScript}
                  onChange={(e) => setCustomScript(e.target.value)}
                  placeholder={t(
                    'Tempel naskah atau poin-poin bahan di sini bila Anda sudah punya naskah sendiri...',
                    'Paste your manuscript or reference notes here if you want to provide your own text...'
                  )}
                  className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-input)] px-3.5 py-2.5 text-[13px] text-[var(--text-primary)] focus:border-[var(--accent-amber)] focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Style & Voice Selectors */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="flex items-center gap-1.5 text-[12.5px] font-semibold text-[var(--text-primary)] mb-1.5">
                <ImageIcon className="h-3.5 w-3.5 text-[var(--accent-amber)]" />
                {mode === 'audiobook'
                  ? t('Skin Tata Letak AudioBook', 'AudioBook Layout Skin')
                  : t('Gaya Visual AI (Z-Image Turbo)', 'AI Visual Style (Z-Image Turbo)')}
              </label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-input)] px-3 py-2.5 text-[13px] text-[var(--text-primary)] focus:border-[var(--accent-amber)] focus:outline-none"
              >
                {mode === 'audiobook' ? (
                  <>
                    <option value="Skin Bara — Karaoke Word Highlight">Skin Bara — Karaoke Word Highlight</option>
                    <option value="Skin Aurora — Cinematic Waveform">Skin Aurora — Cinematic Waveform</option>
                    <option value="Skin Tengah Malam — Minimalist Book">Skin Tengah Malam — Minimalist Book</option>
                  </>
                ) : (
                  IMAGE_STYLES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-[12.5px] font-semibold text-[var(--text-primary)] mb-1.5">
                <Volume2 className="h-3.5 w-3.5 text-[var(--accent-amber)]" />
                {t('Pustaka Suara Narator (VoxCPM2)', 'Narrator Voice Library (VoxCPM2)')}
              </label>
              <select
                value={voice}
                onChange={(e) => setVoice(e.target.value)}
                className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-input)] px-3 py-2.5 text-[13px] text-[var(--text-primary)] focus:border-[var(--accent-amber)] focus:outline-none"
              >
                {VOICE_LIBRARY.map((v) => (
                  <option key={v.id} value={v.name}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Pipeline Toggles */}
          <div className="grid gap-2.5 sm:grid-cols-3 pt-1">
            <label className="flex items-center gap-2.5 rounded-xl border border-[var(--border-default)] bg-[var(--bg-input)] px-3 py-2.5 text-[12.5px] cursor-pointer">
              <input
                type="checkbox"
                checked={webResearch}
                onChange={(e) => setWebResearch(e.target.checked)}
                className="accent-[var(--accent-amber)]"
              />
              <span>{t('Riset Web Kredibilitas Tinggi', 'Deep Web Research')}</span>
            </label>

            <label className="flex items-center gap-2.5 rounded-xl border border-[var(--border-default)] bg-[var(--bg-input)] px-3 py-2.5 text-[12.5px] cursor-pointer">
              <input
                type="checkbox"
                checked={reviewEachStep}
                onChange={(e) => setReviewEachStep(e.target.checked)}
                className="accent-[var(--accent-amber)]"
              />
              <span>{t('Tinjau Tiap Langkah', 'Step-by-step Review')}</span>
            </label>

            <label className="flex items-center gap-2.5 rounded-xl border border-[var(--border-default)] bg-[var(--bg-input)] px-3 py-2.5 text-[12.5px] cursor-pointer">
              <input
                type="checkbox"
                checked={autoYoutube}
                onChange={(e) => setAutoYoutube(e.target.checked)}
                className="accent-[var(--accent-amber)]"
              />
              <span>{t('Unggah Otomatis YouTube', 'Auto-upload YouTube')}</span>
            </label>
          </div>

          {/* Submit & Upfront Token Quote Footer */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[var(--border-default)] pt-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-amber-bg)] text-[var(--accent-amber)]">
                <Coins className="h-5 w-5" />
              </div>
              <div>
                <div className="text-[12px] text-[var(--text-muted)]">
                  {t('Kutipan Harga (Tahan/Potong per Tahap):', 'Stage-by-Stage Token Quote:')}
                </div>
                <div className="font-mono text-[14px] font-bold text-[var(--text-primary)]">
                  {currentCost} RMToken{' '}
                  <span className="text-[12px] font-normal text-[var(--text-muted)]">
                    (≈ Rp{(currentCost * 1000).toLocaleString('id-ID')})
                  </span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={!!activeGeneratingJob}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[var(--accent-amber)] px-6 text-[13.5px] font-bold text-[var(--accent-text)] shadow-lg shadow-[rgba(242,135,31,.2)] hover:brightness-105 disabled:opacity-50 cursor-pointer transition"
            >
              {activeGeneratingJob ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{t('Sedang Memproses di Server...', 'Processing on Server...')}</span>
                </>
              ) : (
                <>
                  <WandSparkles className="h-4 w-4" />
                  <span>
                    {t('Buat Video Sekarang', 'Generate Video Now')} ({currentCost} RMToken)
                  </span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Live Progress & Architecture Card */}
        <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5 sm:p-6 flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--accent-amber)]">
                {t('MONITOR PIPELINE SIDECAR', 'SIDECAR PIPELINE MONITOR')}
              </span>
              <span className="rounded-full bg-[var(--success-bg)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--success)]">
                claude/sonnet/4.6 · VoxCPM2
              </span>
            </div>

            {activeGeneratingJob ? (
              <div className="mt-5 rounded-xl border border-[var(--accent-amber)]/50 bg-[var(--accent-amber-bg)] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-bold text-[var(--accent-amber)]">
                    {t('SEDANG DIKERJAKAN SERVER', 'SERVER JOB IN PROGRESS')}
                  </span>
                  <span className="font-mono text-[12px] font-bold">
                    {activeGeneratingJob.progress}%
                  </span>
                </div>
                <div className="text-[14px] font-semibold text-[var(--text-primary)]">
                  {activeGeneratingJob.topic}
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--bg-tertiary)]">
                  <div
                    className="h-full rounded-full bg-[var(--accent-amber)] transition-all duration-500"
                    style={{ width: `${activeGeneratingJob.progress}%` }}
                  />
                </div>
                <p className="text-[12.5px] text-[var(--text-secondary)] flex items-center gap-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-[var(--accent-amber)]" />
                  {activeGeneratingJob.stageLabel}
                </p>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                <h3 className="font-display text-[16px] font-bold">
                  {t('Tahap Pembuatan & Jaminan Saldo', 'Pipeline Stages & Token Hold Protection')}
                </h3>
                <p className="text-[12.5px] leading-relaxed text-[var(--text-muted)]">
                  {t(
                    'Selama sidecar server aktif, seluruh proses berjalan di belakang layar. Anda bebas menutup tab browser dan memeriksa hasilnya di Riwayat.',
                    'While the server sidecar is active, all stages run in the background. You can safely close the browser tab and inspect results in History.'
                  )}
                </p>

                <ul className="space-y-2 pt-2 text-[12.5px]">
                  {[
                    {
                      title: t('1. Riset Web & Penulisan Naskah', '1. Web Research & Scriptwriting'),
                      detail: 'Gateway /v1/research + LLM Script Normalizer',
                    },
                    {
                      title: t('2. Susunan Adegan & Prompt Visual', '2. Scene Layout & Visual Prompts'),
                      detail: t('Batas gambar otomatis sesuai durasi', 'Automatic scene count cap per tier'),
                    },
                    {
                      title: t('3. Sintesis Suara & Peniruan Timbre', '3. Voice Synthesis & Timbre Cloning'),
                      detail: 'VoxCPM2 + ZipEnhancer 16kHz + FFmpeg atempo',
                    },
                    {
                      title: t('4. Penyelarasan Teks Per Kata', '4. Word-Level Karaoke Alignment'),
                      detail: 'Stable-Whisper medium/small forced alignment',
                    },
                    {
                      title: t('5. Render & Unggah Multipart R2', '5. Render & R2 Multipart Upload'),
                      detail: 'Z-Image Turbo (T4x2) + FFmpeg + Presigned R2',
                    },
                  ].map((st) => (
                    <li
                      key={st.title}
                      className="flex items-start justify-between gap-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)]/60 px-3 py-2"
                    >
                      <span className="font-semibold text-[var(--text-primary)]">{st.title}</span>
                      <span className="text-[11px] font-mono text-[var(--text-muted)] shrink-0">
                        {st.detail}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-input)] p-3.5 text-[12px] text-[var(--text-muted)]">
            <span className="font-semibold text-[var(--text-primary)]">
              {t('Info Penyimpanan:', 'Storage Info:')}
            </span>{' '}
            {t(
              'Video yang selesai disimpan di Cloudflare R2 selama 7 hari (bisa diperpanjang dari Riwayat atau diunggah langsung ke YouTube/TikTok).',
              'Completed videos are retained in Cloudflare R2 for 7 days (extendable from History or directly publishable to YouTube/TikTok).'
            )}
          </div>
        </div>
      </div>

      {/* Riwayat Video (History) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">
            {t('Riwayat Pembuatan Video', 'Video Generation History')} ({jobs.length})
          </h2>
          <span className="text-[12px] text-[var(--text-muted)]">
            {t('Klik kartu video untuk memutar pratinjau', 'Click any video card to play preview')}
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-4 sm:p-5 flex flex-col justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                {/* Thumbnail / Player */}
                <div
                  className="relative w-28 sm:w-36 shrink-0 overflow-hidden rounded-xl bg-black border border-[var(--border-default)]"
                  style={{ aspectRatio: '16 / 9' }}
                >
                  {playingJobId === job.id && job.youtubeId ? (
                    <iframe
                      className="absolute inset-0 h-full w-full"
                      src={`https://www.youtube-nocookie.com/embed/${job.youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                      title={job.topic}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setPlayingJobId(job.id)}
                      className="group absolute inset-0 h-full w-full cursor-pointer"
                    >
                      {job.youtubeId && (
                        <img
                          src={`https://i.ytimg.com/vi/${job.youtubeId}/hqdefault.jpg`}
                          alt={job.topic}
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      )}
                      <span className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-black shadow">
                          <Play className="ml-0.5 h-4 w-4 fill-current" />
                        </span>
                      </span>
                    </button>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 rounded-full bg-[var(--success-bg)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--success)]">
                      <CheckCircle2 className="h-3 w-3" />
                      {t('Selesai', 'Finished')}
                    </span>
                    <span className="rounded-full border border-[var(--border-default)] px-2 py-0.5 text-[10.5px] font-semibold uppercase text-[var(--text-muted)]">
                      {job.mode} · {job.format}
                    </span>
                    <span className="font-mono text-[11px] font-semibold text-[var(--accent-amber)]">
                      −{job.tokensUsed} RMToken
                    </span>
                  </div>

                  <h3 className="mt-1.5 font-display text-[15px] font-bold leading-snug text-[var(--text-primary)]">
                    {job.topic}
                  </h3>
                  <p className="mt-1 text-[12px] text-[var(--text-muted)] line-clamp-2">
                    {job.scriptPreview}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border-default)] pt-3 text-[12px]">
                <div className="text-[var(--text-faint)]">
                  {job.createdAt} · {job.style}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPlayingJobId(playingJobId === job.id ? null : job.id)}
                    className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[var(--border-default)] bg-[var(--bg-secondary)] px-3 font-semibold text-[var(--text-primary)] hover:border-[var(--border-hover)] cursor-pointer"
                  >
                    <Play className="h-3.5 w-3.5 text-[var(--accent-amber)]" />
                    {playingJobId === job.id ? t('Tutup', 'Close') : t('Putar', 'Play')}
                  </button>
                  {job.youtubeId && (
                    <a
                      href={`https://youtu.be/${job.youtubeId}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-[var(--accent-amber)] px-3 font-bold text-[var(--accent-text)] hover:brightness-105"
                    >
                      <Youtube className="h-3.5 w-3.5" />
                      YouTube
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
