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
  Folder,
  ArrowUpRight,
  SlidersHorizontal,
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
    if (mode === 'video') return tier === 'short' ? 3 : tier === 'medium' ? 5 : 8;
    if (mode === 'motion') {
      const map: Record<string, number> = { '10': 2, '30': 3, '60': 4, '90': 6, '120': 8 };
      return map[motionDuration] || 3;
    }
    if (mode === 'audiobook') return tier === 'short' ? 2 : tier === 'medium' ? 3 : 5;
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
      progress: 14,
      stageLabel: t('Menulis naskah dan menyusun adegan...', 'Writing script and laying out scenes...'),
      createdAt: t('Baru saja', 'Just now'),
      tokensUsed: currentCost,
      scenesCount: tier === 'short' ? 4 : tier === 'medium' ? 6 : 8,
    };

    setActiveGeneratingJob(runningJob);

    try {
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

  // Sovereign Folder Cards for the 4 Tools
  const modes: {
    id: AutoContentMode;
    name: string;
    meta: string;
  }[] = [
    {
      id: 'video',
      name: t('Faceless Video', 'Faceless Video'),
      meta: t('9:16 & 16:9 · Narasi & Gambar', '9:16 & 16:9 · Voice & Visuals'),
    },
    {
      id: 'motion',
      name: t('Motion Graphic', 'Motion Graphic'),
      meta: t('10s–120s · Animasi & Iklan', '10s–120s · Animated Ads'),
    },
    {
      id: 'audiobook',
      name: t('AudioBook Episode', 'AudioBook Episode'),
      meta: t('Novel & Cerita · Sorot Kata', 'Stories · Synced Reading Text'),
    },
    {
      id: 'clipper',
      name: t('AutoClipper', 'AutoClipper'),
      meta: t('YouTube Panjang → Klip 9:16', 'Long YouTube → 9:16 Clips'),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top 4 Sovereign Folder Cards for Selecting the Tool */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {modes.map((m) => {
          const active = mode === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setMode(m.id)}
              className={`group rounded-[26px] p-6 text-left flex flex-col justify-between transition-all cursor-pointer ${
                active
                  ? 'bg-[#4D5BAF] text-white shadow-lg shadow-[#4D5BAF]/20'
                  : 'bg-[#F4F5FF] text-[#181924] hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div
                  className={`h-11 w-11 rounded-2xl flex items-center justify-center ${
                    active ? 'bg-white/20 text-white' : 'bg-transparent text-[#4D5BAF]'
                  }`}
                >
                  <Folder
                    className={`h-7 w-7 ${
                      active ? 'fill-white text-white' : 'fill-[#4D5BAF] text-[#4D5BAF]'
                    }`}
                  />
                </div>
                <span
                  className={`h-10 w-10 rounded-full flex items-center justify-center transition ${
                    active
                      ? 'bg-white text-[#4D5BAF]'
                      : 'bg-white text-[#181924] group-hover:bg-[#4D5BAF] group-hover:text-white'
                  }`}
                >
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>

              <div className="mt-7">
                <div className="font-display text-[17px] font-bold">{m.name}</div>
                <div
                  className={`mt-1 text-[12px] ${
                    active ? 'text-white/80' : 'text-[#6C7086]'
                  }`}
                >
                  {m.meta}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Two-Column Sovereign Layout: Left Form Card + Right Pipeline Gauge & Stage Card */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6">
        {/* LEFT: Sovereign Studio Form Card (#F4F5FF) */}
        <form
          onSubmit={handleStartGenerate}
          className="rounded-[28px] bg-[#F4F5FF] p-6 sm:p-7 space-y-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-[19px] font-bold text-[#181924]">
                {mode === 'video'
                  ? t('Buat Video Faceless Baru', 'Create New Faceless Video')
                  : mode === 'motion'
                  ? t('Buat Video Animasi Motion', 'Create Animated Motion Video')
                  : mode === 'audiobook'
                  ? t('Buat Episode AudioBook', 'Create AudioBook Episode')
                  : t('Potong Video YouTube (AutoClipper)', 'Clip Long YouTube Video')}
              </h2>
              <p className="text-[12.5px] text-[#6C7086]">
                {t(
                  'Isi topik di bawah — naskah, suara narator, gambar, dan subtitle disatukan otomatis.',
                  'Fill in the topic below — script, narrator voice, visuals, and subtitles are assembled automatically.'
                )}
              </p>
            </div>

            {/* Aspect Ratio Segmented White/Indigo Pills */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFormat('9:16')}
                className={`inline-flex h-10 items-center gap-2 rounded-full px-5 text-[12.5px] font-semibold transition cursor-pointer ${
                  format === '9:16'
                    ? 'bg-[#4D5BAF] text-white shadow-sm'
                    : 'bg-white text-[#181924] hover:text-[#4D5BAF]'
                }`}
              >
                <Clapperboard className="h-3.5 w-3.5" />
                <span>9:16 {t('Vertikal', 'Vertical')}</span>
              </button>
              <button
                type="button"
                onClick={() => setFormat('16:9')}
                disabled={mode === 'clipper'}
                className={`inline-flex h-10 items-center gap-2 rounded-full px-5 text-[12.5px] font-semibold transition cursor-pointer disabled:opacity-40 ${
                  format === '16:9'
                    ? 'bg-[#4D5BAF] text-white shadow-sm'
                    : 'bg-white text-[#181924] hover:text-[#4D5BAF]'
                }`}
              >
                <MonitorPlay className="h-3.5 w-3.5" />
                <span>16:9 {t('Horizontal', 'Horizontal')}</span>
              </button>
            </div>
          </div>

          {/* Duration / Tier Sovereign Pills */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <span className="text-[12.5px] font-bold text-[#181924]">
              {mode === 'motion'
                ? t('Pilih Durasi Animasi:', 'Select Motion Length:')
                : t('Pilih Panjang Video:', 'Select Video Length:')}
            </span>

            {mode === 'motion' ? (
              <div className="flex flex-wrap gap-2">
                {(['10', '30', '60', '90', '120'] as const).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setMotionDuration(d)}
                    className={`h-9 rounded-full px-4 text-[12.5px] font-bold transition cursor-pointer ${
                      motionDuration === d
                        ? 'bg-[#4D5BAF] text-white'
                        : 'bg-white text-[#181924] hover:text-[#4D5BAF]'
                    }`}
                  >
                    {d} {t('detik', 'sec')}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    { id: 'short', idLabel: 'Pendek (3 Credit)', enLabel: 'Short (3 Credit)' },
                    { id: 'medium', idLabel: 'Sedang (5 Credit)', enLabel: 'Medium (5 Credit)' },
                    { id: 'long', idLabel: 'Panjang (8 Credit)', enLabel: 'Long (8 Credit)' },
                  ] as const
                ).map((tr) => (
                  <button
                    key={tr.id}
                    type="button"
                    onClick={() => setTier(tr.id)}
                    className={`h-9 rounded-full px-4 text-[12.5px] font-semibold transition cursor-pointer ${
                      tier === tr.id
                        ? 'bg-[#4D5BAF] text-white'
                        : 'bg-white text-[#181924] hover:text-[#4D5BAF]'
                    }`}
                  >
                    {isEn ? tr.enLabel : tr.idLabel}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Topic / URL Inputs on Pure White Sovereign Surfaces */}
          {mode === 'clipper' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-[12.5px] font-bold text-[#181924] mb-2">
                  {t('Tautan Video YouTube Panjang', 'Long YouTube Video URL')}
                </label>
                <input
                  type="url"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full h-12 rounded-2xl bg-white px-4 text-[13.5px] text-[#181924] placeholder:text-[#9397AD] focus:outline-none focus:ring-2 focus:ring-[#4D5BAF]"
                />
              </div>

              <div>
                <label className="block text-[12.5px] font-bold text-[#181924] mb-2">
                  {t('Kriteria Momen Terbaik', 'Best Moment Style')}
                </label>
                <div className="flex flex-wrap gap-2">
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
                      className={`h-10 rounded-full px-4 text-[12.5px] font-semibold transition cursor-pointer ${
                        clipCriteria === c.id
                          ? 'bg-[#4D5BAF] text-white'
                          : 'bg-white text-[#181924] hover:text-[#4D5BAF]'
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
                  <label className="block text-[12.5px] font-bold text-[#181924] mb-2">
                    {t('Jenis Video Motion', 'Motion Video Category')}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {MOTION_GENRES.map((g) => (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => setMotionGenre(g.id)}
                        className={`h-9 rounded-full px-4 text-[12.5px] font-semibold transition cursor-pointer ${
                          motionGenre === g.id
                            ? 'bg-[#4D5BAF] text-white'
                            : 'bg-white text-[#181924] hover:text-[#4D5BAF]'
                        }`}
                      >
                        {isEn ? g.enLabel : g.idLabel}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[12.5px] font-bold text-[#181924] mb-2">
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
                          'Contoh: Kopi Susu Aren Toko Senja - diskon 20% minggu ini',
                          'Example: Senja Iced Palm Sugar Coffee - 20% off this week'
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
                  className="w-full h-12 rounded-2xl bg-white px-4 text-[13.5px] text-[#181924] placeholder:text-[#9397AD] focus:outline-none focus:ring-2 focus:ring-[#4D5BAF]"
                />
              </div>

              <div>
                <label className="block text-[12.5px] font-bold text-[#181924] mb-2">
                  {mode === 'audiobook'
                    ? t('Naskah Cerita / Novel untuk Dibacakan', 'Story / Book Manuscript to Narrate')
                    : t(
                        'Naskah Sendiri (Opsional — kosongkan bila ingin ditulis otomatis)',
                        'Custom Script (Optional — leave blank for automatic scriptwriting)'
                      )}
                </label>
                <textarea
                  rows={3}
                  value={customScript}
                  onChange={(e) => setCustomScript(e.target.value)}
                  placeholder={t(
                    'Tempel naskah atau poin-poin bahan di sini bila Anda sudah punya naskah sendiri...',
                    'Paste your manuscript or reference notes here if you want to provide your own text...'
                  )}
                  className="w-full rounded-2xl bg-white p-4 text-[13px] text-[#181924] placeholder:text-[#9397AD] focus:outline-none focus:ring-2 focus:ring-[#4D5BAF]"
                />
              </div>
            </div>
          )}

          {/* Style & Voice Dropdowns in White Sovereign Pills */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="flex items-center gap-1.5 text-[12.5px] font-bold text-[#181924] mb-2">
                <ImageIcon className="h-3.5 w-3.5 text-[#4D5BAF]" />
                {mode === 'audiobook'
                  ? t('Tema Tampilan AudioBook', 'AudioBook Layout Theme')
                  : t('Gaya Gambar & Visual', 'Visual & Illustration Style')}
              </label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full h-11 rounded-full bg-white px-4 text-[13px] font-medium text-[#181924] focus:outline-none focus:ring-2 focus:ring-[#4D5BAF]"
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
              <label className="flex items-center gap-1.5 text-[12.5px] font-bold text-[#181924] mb-2">
                <Volume2 className="h-3.5 w-3.5 text-[#4D5BAF]" />
                {t('Pilihan Suara Narator', 'Narrator Voice')}
              </label>
              <select
                value={voice}
                onChange={(e) => setVoice(e.target.value)}
                className="w-full h-11 rounded-full bg-white px-4 text-[13px] font-medium text-[#181924] focus:outline-none focus:ring-2 focus:ring-[#4D5BAF]"
              >
                {VOICE_LIBRARY.map((v) => (
                  <option key={v.id} value={v.name}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Toggles in White Sovereign Pills */}
          <div className="grid gap-2.5 sm:grid-cols-3">
            <label className="flex items-center gap-2.5 rounded-full bg-white px-4 py-2.5 text-[12.5px] font-medium text-[#181924] cursor-pointer">
              <input
                type="checkbox"
                checked={webResearch}
                onChange={(e) => setWebResearch(e.target.checked)}
                className="accent-[#4D5BAF]"
              />
              <span>{t('Riset Fakta Terbaru', 'Latest Fact Research')}</span>
            </label>

            <label className="flex items-center gap-2.5 rounded-full bg-white px-4 py-2.5 text-[12.5px] font-medium text-[#181924] cursor-pointer">
              <input
                type="checkbox"
                checked={reviewEachStep}
                onChange={(e) => setReviewEachStep(e.target.checked)}
                className="accent-[#4D5BAF]"
              />
              <span>{t('Tinjau Tiap Langkah', 'Step-by-step Review')}</span>
            </label>

            <label className="flex items-center gap-2.5 rounded-full bg-white px-4 py-2.5 text-[12.5px] font-medium text-[#181924] cursor-pointer">
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
            <div className="rounded-2xl bg-[#FBECE6] px-4 py-3 text-[13px] font-semibold text-[#E86E4B]">
              {errorMessage}
            </div>
          )}

          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <div className="inline-flex items-center gap-2.5 rounded-full bg-white px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-[#56B847]" />
              <span className="text-[12.5px] font-semibold text-[#181924]">
                {t('Biaya:', 'Cost:')} {currentCost} Credit (≈ Rp
                {(currentCost * 1000).toLocaleString('id-ID')})
              </span>
            </div>

            <button
              type="submit"
              disabled={!!activeGeneratingJob}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#4D5BAF] px-7 text-[13.5px] font-bold text-white shadow-md shadow-[#4D5BAF]/25 hover:bg-[#3f4c9c] disabled:opacity-50 cursor-pointer transition"
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
                    {t('Buat Video Sekarang', 'Create Video Now')} ({currentCost} Credit)
                  </span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* RIGHT: Sovereign Gauge & Royal Indigo Workflow Card */}
        <div className="space-y-6">
          {/* Top Card: Production Gauge (Matches Storage Usage Card in Sovereign Figma) */}
          <div className="rounded-[28px] bg-[#F4F5FF] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-[17px] font-bold text-[#181924]">
                {t('Status Produksi', 'Production Status')}
              </h3>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F0FCED] px-3 py-1 text-[11.5px] font-bold text-[#56B847]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#56B847]" />
                {activeGeneratingJob ? t('Berjalan', 'Running') : 'Valid'}
              </span>
            </div>

            <div className="relative flex flex-col items-center justify-center pt-2 pb-1">
              <svg viewBox="0 0 220 125" className="w-52 h-28 overflow-visible">
                <path
                  d="M 20 110 A 90 90 0 0 1 200 110"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="14"
                  strokeLinecap="round"
                />
                <path
                  d="M 20 110 A 90 90 0 0 1 200 110"
                  fill="none"
                  stroke="#4D5BAF"
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeDasharray="283"
                  strokeDashoffset={
                    283 - (283 * (activeGeneratingJob ? activeGeneratingJob.progress : 100)) / 100
                  }
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute bottom-2 text-center">
                <div className="font-display text-3xl font-extrabold text-[#181924]">
                  {activeGeneratingJob ? `${activeGeneratingJob.progress}%` : '100%'}
                </div>
                <div className="text-[11.5px] font-semibold text-[#6C7086] max-w-[180px] truncate">
                  {activeGeneratingJob
                    ? activeGeneratingJob.stageLabel
                    : t('Siap Membuat Video', 'Ready to Produce')}
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-3.5 grid grid-cols-3 gap-2 text-center">
              {[
                { label: t('Naskah', 'Script'), pct: '100%', color: '#FFA143' },
                { label: t('Narasi', 'Voice'), pct: '100%', color: '#FFD12E' },
                { label: t('Video', 'Render'), pct: 'HD', color: '#11C6C2' },
              ].map((st) => (
                <div key={st.label} className="flex flex-col items-center">
                  <div
                    className="h-10 w-10 rounded-full flex items-center justify-center border-[3px] text-[11px] font-extrabold text-[#181924]"
                    style={{ borderColor: st.color }}
                  >
                    {st.pct}
                  </div>
                  <div className="mt-1.5 text-[11px] font-bold text-[#181924]">{st.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Card: Sovereign Royal Indigo Card (#4D5BAF) */}
          <div className="rounded-[28px] bg-[#4D5BAF] text-white p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-[17px] font-bold">
                {t('Tahap Otomatis', 'Automatic Stages')}
              </h3>
              <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold">
                5/5
              </span>
            </div>

            <ul className="space-y-2.5 text-[12.5px]">
              {[
                t('1. Penulisan Naskah & Pembuka', '1. Script & Hook Writing'),
                t('2. Penyusunan Adegan', '2. Scene Layout'),
                t('3. Perekaman Suara Narator', '3. Narrator Voice Recording'),
                t('4. Teks Menyala per Kata', '4. Word-by-Word Subtitles'),
                t('5. Penyatuan Video HD', '5. HD Video Assembly'),
              ].map((step, idx) => (
                <li
                  key={step}
                  className="flex items-center justify-between rounded-full bg-white/15 px-4 py-2"
                >
                  <span className="font-medium">{step}</span>
                  <span
                    className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      idx === 4
                        ? 'bg-[#11C6C2] text-[#181924]'
                        : idx === 3
                        ? 'bg-[#FFA143] text-[#181924]'
                        : 'bg-white text-[#181924]'
                    }`}
                  >
                    ✓
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Riwayat Video (Sovereign Card Grid) */}
      <div className="rounded-[28px] bg-[#F4F5FF] p-6 sm:p-7 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-[19px] font-bold text-[#181924]">
            {t('Riwayat Video Anda', 'Your Video History')} ({jobs.length})
          </h2>
          <span className="text-[12.5px] text-[#6C7086]">
            {t('Putar langsung atau unduh video', 'Play directly or download')}
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="rounded-[24px] bg-white p-5 flex flex-col justify-between gap-4 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div
                  className="relative w-full sm:w-44 shrink-0 overflow-hidden rounded-2xl bg-black"
                  style={{
                    aspectRatio: job.format === '9:16' && job.videoUrl ? '9 / 16' : '16 / 9',
                    maxHeight: '250px',
                  }}
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
                      <span className="absolute inset-0 bg-black/35 flex items-center justify-center">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#4D5BAF] shadow">
                          <Play className="ml-0.5 h-4 w-4 fill-current" />
                        </span>
                      </span>
                    </button>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F0FCED] px-3 py-0.5 text-[11px] font-bold text-[#56B847]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#56B847]" />
                      Valid
                    </span>
                    <span className="rounded-full bg-[#F4F5FF] px-2.5 py-0.5 text-[10.5px] font-bold uppercase text-[#4D5BAF]">
                      {job.mode} · {job.format}
                    </span>
                    <span className="font-mono text-[11px] font-bold text-[#6C7086]">
                      −{job.tokensUsed} Credit
                    </span>
                  </div>

                  <h3 className="mt-2 font-display text-[15.5px] font-bold leading-snug text-[#181924]">
                    {job.topic}
                  </h3>
                  <p className="mt-1 text-[12px] text-[#6C7086] line-clamp-3">
                    {job.scriptPreview}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#E2E5F3] pt-3 text-[12px]">
                <div className="text-[#9397AD]">
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
                        className="inline-flex h-8 items-center gap-1.5 rounded-full bg-[#F4F5FF] px-3.5 font-semibold text-[#181924] hover:bg-[#4D5BAF] hover:text-white transition cursor-pointer"
                      >
                        <Play className="h-3.5 w-3.5" />
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
