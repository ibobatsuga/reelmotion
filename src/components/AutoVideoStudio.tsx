import React, { useState } from 'react';
import {
  Clapperboard,
  MonitorPlay,
  Headphones,
  Scissors,
  Sparkles,
  WandSparkles,
  Play,
  Download,
  Youtube,
  Volume2,
  Image as ImageIcon,
  Loader2,
  CheckCircle2,
  Coins,
} from 'lucide-react';
import {
  Lang,
  AutoContentMode,
  VideoJob,
  IMAGE_STYLES,
  VOICE_LIBRARY,
  MOTION_GENRES,
} from '../data/mockData';
import { renderProductionVideo, GeneratedPlan } from '../lib/videoRenderer';

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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
    return 5;
  };

  const currentCost = calculateCost();

  const handleStartGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const defaultTopic =
      mode === 'clipper'
        ? `Klip Video (${clipCriteria.toUpperCase()}): ${youtubeUrl}`
        : topic.trim() ||
          (mode === 'motion'
            ? 'Kopi Susu Aren Toko Senja — Promo Diskon 20%'
            : mode === 'audiobook'
            ? 'Episode 2: Rahasia Benteng Batavia di Malam Tahun Baru'
            : 'Misteri pembangunan Candi Borobudur tanpa semen');

    if (walletBalance < currentCost) {
      onOpenTopUp();
      return;
    }

    const newJobId = `job-${Date.now()}`;
    const runningJob: VideoJob = {
      id: newJobId,
      topic: defaultTopic,
      mode,
      format,
      tier,
      style: mode === 'motion' ? `Motion (${motionGenre} · ${motionDuration}s)` : style,
      voice,
      status: 'running',
      progress: 12,
      stageLabel: t(
        'Menulis naskah dan menyusun adegan...',
        'Writing script and laying out scenes...'
      ),
      createdAt: t('Baru saja', 'Just now'),
      tokensUsed: currentCost,
      scenesCount: tier === 'short' ? 4 : tier === 'medium' ? 6 : 8,
    };

    setActiveGeneratingJob(runningJob);

    try {
      // 1. Call serverless backend (/api/generate) -> Sakelar API behind the scenes
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: defaultTopic,
          mode,
          format,
          tier,
          style,
          customScript: customScript.trim(),
          lang,
          motionGenre,
        }),
      });

      if (!res.ok) {
        throw new Error(t('Gagal menyiapkan naskah video.', 'Failed to prepare video script.'));
      }

      const plan: GeneratedPlan = await res.json();
      const fullNarration = plan.scenes.map((s) => s.narration).join(' ');

      // 2. Render Real Video (Audio TTS + Visuals + Karaoke Subtitles -> .webm Blob)
      const { videoUrl } = await renderProductionVideo({
        plan,
        mode,
        format,
        style,
        lang,
        onProgress: (pct, stageText) => {
          setActiveGeneratingJob((prev) =>
            prev
              ? {
                  ...prev,
                  progress: pct,
                  stageLabel: stageText,
                }
              : null
          );
        },
      });

      const completedJob: VideoJob = {
        ...runningJob,
        topic: plan.title || defaultTopic,
        status: 'done',
        progress: 100,
        stageLabel: t('Video siap!', 'Video ready!'),
        videoUrl,
        caption: plan.caption,
        hashtags: plan.hashtags,
        scenesCount: plan.scenes.length,
        scriptPreview: fullNarration,
      };

      setActiveGeneratingJob(null);
      onCreateJob(completedJob, currentCost);
      setPlayingJobId(completedJob.id);
      setTopic('');
    } catch (err: unknown) {
      setActiveGeneratingJob(null);
      setErrorMessage(
        err instanceof Error
          ? err.message
          : t('Terjadi kendala saat membuat video. Silakan coba lagi.', 'Could not create video. Please try again.')
      );
    }
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
        'Video bergambar ilustrasi dengan suara narator & teks menyala per kata.',
        'Illustrated video with narrator voice & word-by-word highlighted subtitles.'
      ),
      icon: <Clapperboard className="h-4 w-4" />,
    },
    {
      id: 'motion',
      name: 'Motion',
      badge: '10s–120s',
      desc: t(
        'Animasi grafis bergerak: teks, ikon, grafik, dan tokoh untuk iklan & edukasi.',
        'Animated motion graphics: kinetic text, icons, charts, and characters.'
      ),
      icon: <Sparkles className="h-4 w-4" />,
    },
    {
      id: 'audiobook',
      name: 'AudioBook',
      badge: t('Per Episode', 'Per Episode'),
      desc: t(
        'Buku atau cerita panjang dibacakan narator dengan sorot kata di layar.',
        'Long stories narrated with synchronized on-screen reading text.'
      ),
      icon: <Headphones className="h-4 w-4" />,
    },
    {
      id: 'clipper',
      name: 'AutoClipper',
      badge: 'YouTube → 9:16',
      desc: t(
        'Potong video YouTube panjang menjadi beberapa klip vertikal siap tayang.',
        'Slice long YouTube videos into ready-to-post vertical short clips.'
      ),
      icon: <Scissors className="h-4 w-4" />,
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-default)] pb-5">
        <div>
          <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#4D5BAF]">
            <WandSparkles className="h-3.5 w-3.5" />
            {t('STUDIO KONTEN OTOMATIS', 'AUTOMATED CONTENT STUDIO')}
          </div>
          <h1 className="mt-1 font-display text-2xl sm:text-3xl font-bold tracking-tight">
            {t('Buat Video Siap Tayang', 'Create Ready-to-Post Videos')}
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 rounded-full border border-[var(--border-default)] bg-[var(--bg-surface)] px-4 py-2 text-[12.5px]">
            <span className="h-2 w-2 rounded-full bg-[var(--success)]" />
            <span className="font-semibold text-[var(--text-primary)]">
              {t('Studio Siap Memproduksi', 'Studio Ready')}
            </span>
          </div>
        </div>
      </div>

      {/* 4 Mode Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {modes.map((m) => {
          const active = mode === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setMode(m.id)}
              className={`flex flex-col justify-between rounded-3xl border p-4 text-left transition cursor-pointer ${
                active
                  ? 'border-[#4D5BAF] bg-[#4D5BAF] text-white shadow-md shadow-[#4D5BAF]/25'
                  : 'border-[var(--border-default)] bg-[var(--bg-surface)] hover:border-[#4D5BAF]/50'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2 font-display text-[15px] font-bold">
                  <span className={active ? 'text-[#FFA143]' : 'text-[#4D5BAF]'}>{m.icon}</span>
                  <span>{m.name}</span>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10.5px] font-semibold ${
                    active
                      ? 'bg-white/20 text-white'
                      : 'bg-[var(--bg-secondary)] text-[var(--text-muted)]'
                  }`}
                >
                  {m.badge}
                </span>
              </div>
              <p
                className={`mt-2 text-[12.5px] leading-snug ${
                  active ? 'text-white/85' : 'text-[var(--text-muted)]'
                }`}
              >
                {m.desc}
              </p>
            </button>
          );
        })}
      </div>

      {/* Main Studio Generator & Live Pipeline Preview */}
      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
        {/* Form Builder */}
        <form
          onSubmit={handleStartGenerate}
          className="rounded-3xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-5 sm:p-6 space-y-5"
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
                  className={`flex items-center justify-center gap-2 rounded-full border py-2.5 text-[13px] font-semibold cursor-pointer transition ${
                    format === '9:16'
                      ? 'border-[#4D5BAF] bg-[#4D5BAF] text-white'
                      : 'border-[var(--border-default)] bg-[var(--bg-secondary)] text-[var(--text-muted)]'
                  }`}
                >
                  <Clapperboard className="h-4 w-4" />
                  <span>9:16 {t('Vertikal', 'Vertical')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormat('16:9')}
                  disabled={mode === 'clipper'}
                  className={`flex items-center justify-center gap-2 rounded-full border py-2.5 text-[13px] font-semibold cursor-pointer transition disabled:opacity-40 ${
                    format === '16:9'
                      ? 'border-[#4D5BAF] bg-[#4D5BAF] text-white'
                      : 'border-[var(--border-default)] bg-[var(--bg-secondary)] text-[var(--text-muted)]'
                  }`}
                >
                  <MonitorPlay className="h-4 w-4" />
                  <span>16:9 {t('Horizontal', 'Horizontal')}</span>
                </button>
              </div>
            </div>

            {mode === 'motion' ? (
              <div>
                <label className="block text-[12px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">
                  {t('Durasi Video Motion', 'Motion Duration')}
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {(['10', '30', '60', '90', '120'] as const).map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setMotionDuration(d)}
                      className={`rounded-full border py-2.5 text-[12.5px] font-bold cursor-pointer transition ${
                        motionDuration === d
                          ? 'border-[#4D5BAF] bg-[#4D5BAF] text-white'
                          : 'border-[var(--border-default)] bg-[var(--bg-secondary)] text-[var(--text-muted)]'
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
                      className={`rounded-full border py-2.5 text-[12.5px] font-semibold cursor-pointer transition ${
                        tier === tr.id
                          ? 'border-[#4D5BAF] bg-[#4D5BAF] text-white'
                          : 'border-[var(--border-default)] bg-[var(--bg-secondary)] text-[var(--text-muted)]'
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
                  className="w-full rounded-2xl border border-[var(--border-default)] bg-[var(--bg-secondary)] px-4 py-2.5 text-[13.5px] text-[var(--text-primary)] focus:border-[#4D5BAF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[12.5px] font-semibold text-[var(--text-primary)] mb-1.5">
                  {t('Pilih Jenis Momen Terbaik', 'Select Best Moment Style')}
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
                      className={`rounded-2xl border px-3 py-2 text-left text-[12px] font-semibold cursor-pointer transition ${
                        clipCriteria === c.id
                          ? 'border-[#4D5BAF] bg-[#4D5BAF] text-white'
                          : 'border-[var(--border-default)] bg-[var(--bg-secondary)] text-[var(--text-muted)]'
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
                        className={`rounded-2xl border p-2.5 text-left transition cursor-pointer ${
                          motionGenre === g.id
                            ? 'border-[#4D5BAF] bg-[#4D5BAF] text-white'
                            : 'border-[var(--border-default)] bg-[var(--bg-secondary)]'
                        }`}
                      >
                        <div className="text-[12.5px] font-bold">
                          {isEn ? g.enLabel : g.idLabel}
                        </div>
                        <div
                          className={`mt-0.5 text-[11px] line-clamp-1 ${
                            motionGenre === g.id ? 'text-white/80' : 'text-[var(--text-muted)]'
                          }`}
                        >
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
                  className="w-full rounded-2xl border border-[var(--border-default)] bg-[var(--bg-secondary)] px-4 py-2.5 text-[13.5px] text-[var(--text-primary)] focus:border-[#4D5BAF] focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[12.5px] font-semibold text-[var(--text-primary)]">
                    {mode === 'audiobook'
                      ? t('Naskah Cerita / Novel untuk Dibacakan', 'Story / Book Manuscript to Narrate')
                      : t('Naskah Sendiri (Opsional - kosongkan bila ingin ditulis otomatis)', 'Custom Script (Optional - leave blank for automatic script)')}
                  </label>
                </div>
                <textarea
                  rows={3}
                  value={customScript}
                  onChange={(e) => setCustomScript(e.target.value)}
                  placeholder={t(
                    'Tempel naskah atau poin-poin bahan di sini bila Anda sudah punya naskah sendiri...',
                    'Paste your manuscript or reference notes here if you want to provide your own text...'
                  )}
                  className="w-full rounded-2xl border border-[var(--border-default)] bg-[var(--bg-secondary)] px-4 py-2.5 text-[13px] text-[var(--text-primary)] focus:border-[#4D5BAF] focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Style & Voice Selectors */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="flex items-center gap-1.5 text-[12.5px] font-semibold text-[var(--text-primary)] mb-1.5">
                <ImageIcon className="h-3.5 w-3.5 text-[#4D5BAF]" />
                {mode === 'audiobook'
                  ? t('Tema Tampilan AudioBook', 'AudioBook Layout Theme')
                  : t('Gaya Gambar & Visual', 'Visual & Illustration Style')}
              </label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full rounded-2xl border border-[var(--border-default)] bg-[var(--bg-secondary)] px-3.5 py-2.5 text-[13px] text-[var(--text-primary)] focus:border-[#4D5BAF] focus:outline-none"
              >
                {mode === 'audiobook' ? (
                  <>
                    <option value="Tema Bara — Sorot Kata">Tema Bara — Sorot Kata</option>
                    <option value="Tema Aurora — Gelombang Suara">Tema Aurora — Gelombang Suara</option>
                    <option value="Tema Tengah Malam — Buku Klasik">Tema Tengah Malam — Buku Klasik</option>
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
                <Volume2 className="h-3.5 w-3.5 text-[#4D5BAF]" />
                {t('Pilihan Suara Narator', 'Narrator Voice')}
              </label>
              <select
                value={voice}
                onChange={(e) => setVoice(e.target.value)}
                className="w-full rounded-2xl border border-[var(--border-default)] bg-[var(--bg-secondary)] px-3.5 py-2.5 text-[13px] text-[var(--text-primary)] focus:border-[#4D5BAF] focus:outline-none"
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
            <label className="flex items-center gap-2.5 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-secondary)] px-3.5 py-2.5 text-[12.5px] cursor-pointer">
              <input
                type="checkbox"
                checked={webResearch}
                onChange={(e) => setWebResearch(e.target.checked)}
                className="accent-[#4D5BAF]"
              />
              <span>{t('Riset Fakta Terbaru', 'Latest Fact Research')}</span>
            </label>

            <label className="flex items-center gap-2.5 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-secondary)] px-3.5 py-2.5 text-[12.5px] cursor-pointer">
              <input
                type="checkbox"
                checked={reviewEachStep}
                onChange={(e) => setReviewEachStep(e.target.checked)}
                className="accent-[#4D5BAF]"
              />
              <span>{t('Tinjau Tiap Langkah', 'Step-by-step Review')}</span>
            </label>

            <label className="flex items-center gap-2.5 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-secondary)] px-3.5 py-2.5 text-[12.5px] cursor-pointer">
              <input
                type="checkbox"
                checked={autoYoutube}
                onChange={(e) => setAutoYoutube(e.target.checked)}
                className="accent-[#4D5BAF]"
              />
              <span>{t('Unggah Otomatis YouTube', 'Auto-upload YouTube')}</span>
            </label>
          </div>

          {errorMessage && (
            <div className="rounded-2xl bg-[var(--danger-bg)] px-4 py-3 text-[13px] font-medium text-[var(--danger)]">
              {errorMessage}
            </div>
          )}

          {/* Submit & Upfront Token Quote Footer */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[var(--border-default)] pt-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#4D5BAF]/10 text-[#4D5BAF]">
                <Coins className="h-5 w-5" />
              </div>
              <div>
                <div className="text-[12px] text-[var(--text-muted)]">
                  {t('Harga Video (Dipotong per Tahap Berhasil):', 'Video Price (Charged per Completed Stage):')}
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
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#4D5BAF] px-7 text-[13.5px] font-bold text-white shadow-lg shadow-[#4D5BAF]/25 hover:bg-[#3f4c9c] disabled:opacity-50 cursor-pointer transition"
            >
              {activeGeneratingJob ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{t('Sedang Membuat Video...', 'Creating Video...')}</span>
                </>
              ) : (
                <>
                  <WandSparkles className="h-4 w-4" />
                  <span>
                    {t('Buat Video Sekarang', 'Create Video Now')} ({currentCost} RMToken)
                  </span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Live Progress Card */}
        <div className="rounded-3xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-5 sm:p-6 flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#4D5BAF]">
                {t('PROGRES PEMBUATAN VIDEO', 'VIDEO PRODUCTION PROGRESS')}
              </span>
              <span className="rounded-full bg-[var(--success-bg)] px-3 py-0.5 text-[11px] font-bold text-[var(--success)]">
                {t('Otomatis', 'Automatic')}
              </span>
            </div>

            {activeGeneratingJob ? (
              <div className="mt-5 rounded-2xl border border-[#4D5BAF]/30 bg-[#4D5BAF]/5 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-bold text-[#4D5BAF]">
                    {t('SEDANG MEMBUAT VIDEO ANDA', 'BUILDING YOUR VIDEO')}
                  </span>
                  <span className="font-mono text-[12px] font-bold">
                    {activeGeneratingJob.progress}%
                  </span>
                </div>
                <div className="text-[14px] font-semibold text-[var(--text-primary)]">
                  {activeGeneratingJob.topic}
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-[var(--bg-tertiary)]">
                  <div
                    className="h-full rounded-full bg-[#4D5BAF] transition-all duration-500"
                    style={{ width: `${activeGeneratingJob.progress}%` }}
                  />
                </div>
                <p className="text-[12.5px] text-[var(--text-secondary)] flex items-center gap-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-[#4D5BAF]" />
                  {activeGeneratingJob.stageLabel}
                </p>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                <h3 className="font-display text-[16px] font-bold">
                  {t('Lima Langkah Otomatis dari Satu Topik', 'Five Automatic Steps from One Topic')}
                </h3>
                <p className="text-[12.5px] leading-relaxed text-[var(--text-muted)]">
                  {t(
                    'Anda cukup menuliskan topik di samping. Seluruh penulisan naskah, perekaman suara narator, pembuatan gambar, dan penyatuan video dikerjakan otomatis.',
                    'Simply enter your topic on the left. Scriptwriting, voice recording, visual creation, and final video assembly happen automatically.'
                  )}
                </p>

                <ul className="space-y-2 pt-2 text-[12.5px]">
                  {[
                    {
                      title: t('1. Penulisan Naskah & Pembuka', '1. Scriptwriting & Hook'),
                      detail: t('Otomatis', 'Automatic'),
                    },
                    {
                      title: t('2. Penyusunan Adegan demi Adegan', '2. Scene-by-Scene Layout'),
                      detail: t('Sesuai durasi', 'Matched to length'),
                    },
                    {
                      title: t('3. Perekaman Suara Narator', '3. Narrator Voice Recording'),
                      detail: t('Jernih & rata', 'Clear & balanced'),
                    },
                    {
                      title: t('4. Penyelarasan Teks Menyala per Kata', '4. Word-by-Word Highlighted Text'),
                      detail: t('Mengikuti suara', 'Synced to voice'),
                    },
                    {
                      title: t('5. Penyatuan Video Siap Unduh', '5. Final Video Ready to Download'),
                      detail: 'MP4 / WebM HD',
                    },
                  ].map((st) => (
                    <li
                      key={st.title}
                      className="flex items-center justify-between gap-2 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-secondary)] px-3.5 py-2.5"
                    >
                      <span className="font-semibold text-[var(--text-primary)]">{st.title}</span>
                      <span className="text-[11px] font-semibold text-[#4D5BAF] shrink-0">
                        {st.detail}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-secondary)] p-3.5 text-[12px] text-[var(--text-muted)]">
            <span className="font-semibold text-[var(--text-primary)]">
              {t('Jaminan Saldo:', 'Balance Guarantee:')}
            </span>{' '}
            {t(
              'Saldo RMToken hanya dipotong saat video selesai dibuat dan siap Anda unduh di Riwayat.',
              'RMToken is only deducted when your video finishes and is ready to download in History.'
            )}
          </div>
        </div>
      </div>

      {/* Riwayat Video (History) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">
            {t('Riwayat Video Anda', 'Your Video History')} ({jobs.length})
          </h2>
          <span className="text-[12px] text-[var(--text-muted)]">
            {t('Putar langsung atau unduh video yang sudah selesai', 'Play directly or download finished videos')}
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="rounded-3xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-4 sm:p-5 flex flex-col justify-between gap-4"
            >
              <div className="flex flex-col sm:flex-row items-start gap-4">
                {/* Video Player / Thumbnail */}
                <div
                  className="relative w-full sm:w-44 shrink-0 overflow-hidden rounded-2xl bg-black border border-[var(--border-default)]"
                  style={{ aspectRatio: job.format === '9:16' && job.videoUrl ? '9 / 16' : '16 / 9', maxHeight: '260px' }}
                >
                  {job.videoUrl ? (
                    <video
                      src={job.videoUrl}
                      controls
                      autoPlay={playingJobId === job.id}
                      className="h-full w-full object-contain bg-black"
                    />
                  ) : playingJobId === job.id && job.youtubeId ? (
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
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#4D5BAF] shadow">
                          <Play className="ml-0.5 h-4 w-4 fill-current" />
                        </span>
                      </span>
                    </button>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 rounded-full bg-[var(--success-bg)] px-2.5 py-0.5 text-[11px] font-bold text-[var(--success)]">
                      <CheckCircle2 className="h-3 w-3" />
                      {t('Selesai', 'Finished')}
                    </span>
                    <span className="rounded-full bg-[var(--bg-secondary)] px-2.5 py-0.5 text-[10.5px] font-semibold uppercase text-[var(--text-muted)]">
                      {job.mode} · {job.format}
                    </span>
                    <span className="font-mono text-[11px] font-bold text-[#4D5BAF]">
                      −{job.tokensUsed} RMToken
                    </span>
                  </div>

                  <h3 className="mt-2 font-display text-[15.5px] font-bold leading-snug text-[var(--text-primary)]">
                    {job.topic}
                  </h3>
                  <p className="mt-1 text-[12px] text-[var(--text-muted)] line-clamp-3">
                    {job.scriptPreview}
                  </p>
                  {job.hashtags && job.hashtags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {job.hashtags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-[var(--bg-secondary)] px-2 py-0.5 text-[10.5px] font-medium text-[#4D5BAF]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border-default)] pt-3 text-[12px]">
                <div className="text-[var(--text-faint)]">
                  {job.createdAt} · {job.style}
                </div>
                <div className="flex items-center gap-2">
                  {job.videoUrl ? (
                    <a
                      href={job.videoUrl}
                      download={`${job.topic.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 40)}.webm`}
                      className="inline-flex h-8 items-center gap-1.5 rounded-full bg-[#4D5BAF] px-4 font-bold text-white hover:bg-[#3f4c9c]"
                    >
                      <Download className="h-3.5 w-3.5" />
                      {t('Unduh Video', 'Download Video')}
                    </a>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => setPlayingJobId(playingJobId === job.id ? null : job.id)}
                        className="inline-flex h-8 items-center gap-1.5 rounded-full border border-[var(--border-default)] bg-[var(--bg-secondary)] px-3.5 font-semibold text-[var(--text-primary)] cursor-pointer"
                      >
                        <Play className="h-3.5 w-3.5 text-[#4D5BAF]" />
                        {playingJobId === job.id ? t('Tutup', 'Close') : t('Putar', 'Play')}
                      </button>
                      {job.youtubeId && (
                        <a
                          href={`https://youtu.be/${job.youtubeId}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex h-8 items-center gap-1.5 rounded-full bg-[#4D5BAF] px-3.5 font-bold text-white"
                        >
                          <Youtube className="h-3.5 w-3.5" />
                          YouTube
                        </a>
                      )}
                    </>
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
