import React, { useState } from 'react';
import {
  Gift,
  ArrowRight,
  Check,
  Clapperboard,
  MonitorPlay,
  Headphones,
  Scissors,
  Play,
  WandSparkles,
  SlidersHorizontal,
  Download,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Coins,
  History,
  Sparkles,
  MessageCircle,
  Folder,
  ArrowUpRight,
  Plus,
  Bell,
  Search,
  MoreVertical,
  HardDrive,
  Cloud,
  FolderOpen,
  X,
} from 'lucide-react';
import { Lang, Theme, SHOWCASE_VIDEOS } from '../data/mockData';

interface LandingPageProps {
  lang: Lang;
  setLang: (l: Lang) => void;
  theme: Theme;
  toggleTheme: () => void;
  onOpenAuth: (defaultMode?: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  lang,
  setLang,
  onOpenAuth,
}) => {
  const isEn = lang === 'en';
  const t = (id: string, en: string) => (isEn ? en : id);

  const [showcaseFilter, setShowcaseFilter] = useState<'all' | '9:16' | '16:9'>('all');
  const [playingVideos, setPlayingVideos] = useState<Record<string, boolean>>({});
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [showBonusModal, setShowBonusModal] = useState(false);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const filteredVideos = SHOWCASE_VIDEOS.filter(
    (v) => showcaseFilter === 'all' || v.ratio === showcaseFilter
  );

  const faqs = [
    {
      q: t('Apakah saya perlu keahlian editing video?', 'Do I need video editing skills?'),
      a: t(
        'Tidak. Anda cukup menulis topik atau naskah. Naskah, narasi, gambar, subtitle, dan penyatuan video dikerjakan otomatis. Bila ingin, mode tinjau membiarkan Anda menyunting tiap langkah sebelum lanjut.',
        'No. You simply write a topic or script. The script, narration, visuals, subtitles, and video rendering are done automatically.'
      ),
    },
    {
      q: t('Bagaimana cara membayar?', 'How do I pay?'),
      a: t(
        'Anda cukup membeli paket RMToken lewat QRIS otomatis atau transfer, tanpa langganan bulanan. Saldo token tidak memiliki masa kedaluwarsa dan bisa dipakai untuk semua alat (Faceless, Motion, AudioBook, AutoClipper).',
        'Simply top up an RMToken package via instant QRIS or transfer, with no monthly subscription. Token balances never expire.'
      ),
    },
    {
      q: t(
        'Bagaimana kalau pembuatan video gagal di tengah jalan?',
        'What if video creation fails halfway through?'
      ),
      a: t(
        'Saldo RMToken hanya dipotong untuk tahap yang benar-benar berhasil. Bila tahap penyatuan gagal, token otomatis kembali ke saldo Anda dan Anda bisa melanjutkan dari Riwayat.',
        'RMToken is only deducted for stages that actually succeed.'
      ),
    },
    {
      q: t(
        'Apakah video bisa diunggah langsung ke YouTube, TikTok, atau Instagram?',
        'Can videos be uploaded directly to YouTube, TikTok, or Instagram?'
      ),
      a: t(
        'Ya! Anda bisa mengunduh file video kapan saja atau menyambungkan akun YouTube, TikTok, Instagram Reels, dan Facebook Page di menu Media Sosial.',
        'Yes! You can download the video anytime or connect your YouTube, TikTok, Instagram Reels, and Facebook Page accounts.'
      ),
    },
  ];

  return (
    <div
      data-landing="true"
      className="min-h-screen bg-[#E9ECF8] text-[#181924] font-body overflow-x-hidden"
    >
      {/* Sovereign macOS Window Top Bar */}
      <div className="h-11 bg-white px-4 sm:px-6 flex items-center justify-between text-[12px] sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#FF5F57] inline-block" />
            <span className="h-3 w-3 rounded-full bg-[#FEBC2E] inline-block" />
            <span className="h-3 w-3 rounded-full bg-[#28C840] inline-block" />
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-[#9397AD]">
            <ChevronLeft className="h-4 w-4" />
            <ChevronRight className="h-4 w-4 opacity-50" />
          </div>
        </div>

        {/* Center Address Bar Pill */}
        <div className="flex items-center gap-2 rounded-full bg-[#F4F5FF] px-5 py-1 w-full max-w-md justify-center text-[11.5px] text-[#6C7086]">
          <span className="font-semibold text-[#181924]">https://reelmotion.studio/welcome</span>
        </div>

        {/* Language & Quick Sign In */}
        <div className="flex items-center gap-2">
          <div className="flex rounded-full bg-[#F4F5FF] p-0.5">
            <button
              onClick={() => setLang('id')}
              className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold uppercase cursor-pointer transition ${
                lang === 'id' ? 'bg-[#4D5BAF] text-white' : 'text-[#6C7086]'
              }`}
            >
              id
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold uppercase cursor-pointer transition ${
                lang === 'en' ? 'bg-[#4D5BAF] text-white' : 'text-[#6C7086]'
              }`}
            >
              en
            </button>
          </div>
        </div>
      </div>

      {/* Main Sovereign Workspace Shell */}
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-6 space-y-12">
        {/* Sovereign Top Navigation Header */}
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-[#4D5BAF] text-white shadow-md shadow-[#4D5BAF]/25 flex items-center justify-center">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="font-display text-xl font-bold tracking-tight text-[#181924]">
                ReelMotion
              </div>
              <div className="text-[12px] text-[#6C7086]">
                {t('Studio Video & Konten Otomatis', 'Automated Video & Content Studio')}
              </div>
            </div>
          </div>

          {/* Sovereign White Navigation Pills */}
          <nav className="hidden lg:flex items-center gap-2 rounded-full bg-[#F4F5FF] p-1.5">
            <button
              onClick={() => scrollToSection('fitur')}
              className="rounded-full bg-[#4D5BAF] text-white px-5 py-2 text-[13px] font-semibold cursor-pointer transition"
            >
              {t('Fitur', 'Features')}
            </button>
            <button
              onClick={() => scrollToSection('contoh')}
              className="rounded-full bg-white text-[#181924] hover:text-[#4D5BAF] px-5 py-2 text-[13px] font-semibold cursor-pointer transition"
            >
              {t('Contoh hasil', 'Showcase')}
            </button>
            <button
              onClick={() => scrollToSection('cara')}
              className="rounded-full bg-white text-[#181924] hover:text-[#4D5BAF] px-5 py-2 text-[13px] font-semibold cursor-pointer transition"
            >
              {t('Cara kerja', 'How it works')}
            </button>
            <button
              onClick={() => scrollToSection('harga')}
              className="rounded-full bg-white text-[#181924] hover:text-[#4D5BAF] px-5 py-2 text-[13px] font-semibold cursor-pointer transition"
            >
              {t('Harga', 'Pricing')}
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="rounded-full bg-white text-[#181924] hover:text-[#4D5BAF] px-5 py-2 text-[13px] font-semibold cursor-pointer transition"
            >
              {t('Tanya jawab', 'FAQ')}
            </button>
          </nav>

          {/* Sovereign Right Action Pills: "+ Create New" & "Filter / Mulai" */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowBonusModal(true)}
              className="hidden sm:inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-[13px] font-semibold text-[#181924] shadow-sm hover:text-[#4D5BAF] cursor-pointer transition"
            >
              <Gift className="h-4 w-4 text-[#FFA143]" />
              <span>{t('Gratis 6 RMToken', 'Free 6 RMToken')}</span>
            </button>

            <button
              onClick={() => onOpenAuth()}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-[13px] font-semibold text-[#181924] shadow-sm hover:text-[#4D5BAF] cursor-pointer transition"
            >
              <Plus className="h-4 w-4 text-[#4D5BAF]" />
              <span>{t('Masuk', 'Sign in')}</span>
            </button>

            <button
              data-landing-cta="true"
              onClick={() => onOpenAuth('video')}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-[#4D5BAF] px-6 text-[13px] font-bold text-white shadow-md shadow-[#4D5BAF]/25 hover:bg-[#3f4c9c] cursor-pointer transition"
            >
              <span>{t('Mulai sekarang', 'Get started')}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* HERO SECTION IN SOVEREIGN DASHBOARD STYLE */}
        <section className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6 items-start">
          {/* Left Hero Column: Sovereign Welcome Banner + 4 Folder Cards + Live Studio Table Preview */}
          <div className="space-y-6">
            {/* Hero Headline Card */}
            <div className="rounded-[28px] bg-[#F4F5FF] p-7 sm:p-9 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="max-w-2xl space-y-4">
                <button
                  onClick={() => setShowBonusModal(true)}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-[12px] font-bold text-[#4D5BAF] shadow-sm cursor-pointer"
                >
                  <span className="h-2 w-2 rounded-full bg-[#56B847]" />
                  {t('Gratis 6 RMToken untuk akun baru', 'Free 6 RMToken for new accounts')}
                </button>

                <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#181924] leading-[1.12]">
                  {t('Dari satu ide, jadi video siap tayang.', 'From a single idea, to a ready-to-post video.')}
                </h1>

                <p className="text-[15px] leading-relaxed text-[#6C7086]">
                  {t(
                    'Tulis topiknya — ReelMotion menulis naskah, merekam suara narator, melukis gambar, dan menyatukan videonya. Video pendek, video panjang, audiobook, sampai potongan klip dari video panjang Anda.',
                    'Write the topic — ReelMotion writes the script, records the narration, paints the visuals, and puts the video together.'
                  )}
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => onOpenAuth('video')}
                    className="inline-flex h-12 items-center gap-2 rounded-full bg-[#4D5BAF] px-7 text-[14px] font-bold text-white shadow-md shadow-[#4D5BAF]/25 hover:bg-[#3f4c9c] cursor-pointer transition"
                  >
                    <Plus className="h-4 w-4" />
                    <span>{t('Buat Video Sekarang', 'Create Video Now')}</span>
                  </button>

                  <button
                    onClick={() => scrollToSection('contoh')}
                    className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-7 text-[14px] font-semibold text-[#181924] hover:text-[#4D5BAF] cursor-pointer transition"
                  >
                    <Play className="h-4 w-4 fill-current text-[#4D5BAF]" />
                    <span>{t('Lihat contoh hasil', 'Watch showcase')}</span>
                  </button>
                </div>
              </div>

              {/* 3 Pill Highlights */}
              <div className="flex flex-col gap-2.5 shrink-0">
                {[
                  { label: t('Tanpa langganan bulanan', 'No monthly subscription'), badge: 'Valid' },
                  { label: t('Dipotong hanya tahap berhasil', 'Pay per completed stage'), badge: 'Valid' },
                  { label: t('Tanpa keahlian editing', 'Zero editing required'), badge: 'Valid' },
                ].map((b) => (
                  <div
                    key={b.label}
                    className="flex items-center justify-between gap-4 rounded-2xl bg-white px-4 py-3 shadow-sm"
                  >
                    <span className="text-[13px] font-semibold text-[#181924]">{b.label}</span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F0FCED] px-3 py-0.5 text-[11px] font-bold text-[#56B847]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#56B847]" />
                      {b.badge}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 4 Sovereign Folder Cards: Satu Tempat, Empat Alat */}
            <div id="fitur" className="scroll-mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                {
                  title: t('Faceless Vertikal', 'Vertical Faceless'),
                  meta: t('9:16 · TikTok, Reels & Shorts', '9:16 · TikTok, Reels & Shorts'),
                  desc: t('Naskah, suara narator & teks menyala per kata.', 'Script, narrator voice & word-by-word captions.'),
                  mode: 'video',
                },
                {
                  title: t('Faceless Horizontal', 'Horizontal Faceless'),
                  meta: t('16:9 · Dokumenter YouTube', '16:9 · YouTube Documentary'),
                  desc: t('Video panjang dibagi per bab dengan kartu judul.', 'Long videos structured into chapters.'),
                  mode: 'video',
                },
                {
                  title: 'AudioBook',
                  meta: t('Narasi · Episode Buku & Novel', 'Narration · Book Episodes'),
                  desc: t('Naskah cerita dibacakan narator dengan sorot kata.', 'Stories narrated with synced reading text.'),
                  mode: 'audiobook',
                },
                {
                  title: 'AutoClipper',
                  meta: t('Klip · Potong Video Panjang', 'Clips · Slice Long Videos'),
                  desc: t('Tempel tautan YouTube & ambil klip momen terbaik.', 'Paste a YouTube link & extract viral clips.'),
                  mode: 'clipper',
                },
              ].map((card) => (
                <div
                  key={card.title}
                  onClick={() => onOpenAuth(card.mode)}
                  className="group rounded-[26px] bg-[#F4F5FF] p-6 flex flex-col justify-between transition-all hover:bg-white hover:shadow-md cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="h-11 w-11 rounded-2xl flex items-center justify-center text-[#4D5BAF]">
                      <Folder className="h-7 w-7 fill-[#4D5BAF]" />
                    </div>
                    <span className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-[#181924] group-hover:bg-[#4D5BAF] group-hover:text-white transition">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>

                  <div className="mt-7">
                    <h3 className="font-display text-[17px] font-bold text-[#181924]">
                      {card.title}
                    </h3>
                    <div className="mt-1 text-[12px] font-semibold text-[#4D5BAF]">{card.meta}</div>
                    <p className="mt-2 text-[12.5px] text-[#6C7086] leading-relaxed">{card.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Hero Column: Sovereign Gauge Card + Royal Indigo Calendar Preview */}
          <div className="space-y-6">
            {/* Storage / Production Speed Gauge Card */}
            <div className="rounded-[28px] bg-[#F4F5FF] p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-[17px] font-bold text-[#181924]">
                  {t('Kapasitas Studio', 'Studio Capacity')}
                </h2>
                <span className="h-9 w-9 rounded-full bg-white flex items-center justify-center text-[#6C7086]">
                  <MoreVertical className="h-4 w-4" />
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
                    d="M 20 110 A 90 90 0 0 1 115 20"
                    fill="none"
                    stroke="#4D5BAF"
                    strokeWidth="14"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute bottom-2 text-center">
                  <div className="font-display text-3xl font-extrabold text-[#181924]">100%</div>
                  <div className="mt-0.5 text-[12px] font-bold text-[#181924]">
                    {t('Otomatis Penuh', 'Fully Automated')}
                  </div>
                  <div className="text-[11px] text-[#6C7086]">
                    {t('Naskah · Suara · Video', 'Script · Voice · Video')}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-white p-4 grid grid-cols-3 gap-2 text-center">
                {[
                  { pct: '9:16', sub: 'TikTok/Reels', color: '#FFA143', icon: <HardDrive className="h-4 w-4 text-[#4D5BAF]" /> },
                  { pct: '16:9', sub: 'YouTube HD', color: '#FFD12E', icon: <Cloud className="h-4 w-4 text-[#4D5BAF]" /> },
                  { pct: 'MP4', sub: 'Siap Unduh', color: '#11C6C2', icon: <FolderOpen className="h-4 w-4 text-[#4D5BAF]" /> },
                ].map((ring) => (
                  <div key={ring.pct} className="flex flex-col items-center">
                    <div
                      className="h-12 w-12 rounded-full flex items-center justify-center border-[3px]"
                      style={{ borderColor: ring.color }}
                    >
                      {ring.icon}
                    </div>
                    <div className="mt-2 text-[11px] font-bold text-[#181924]">{ring.pct}</div>
                    <div className="text-[10px] text-[#6C7086]">{ring.sub}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sovereign Royal Indigo Card (#4D5BAF) */}
            <div className="rounded-[28px] bg-[#4D5BAF] text-white p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-[17px] font-bold">
                  {t('Jadwal Tayang', 'Publishing Schedule')}
                </h2>
                <span className="rounded-full bg-white/15 px-3.5 py-1 text-[11.5px] font-semibold">
                  {t('Konsisten', 'Consistent')}
                </span>
              </div>

              <div className="grid grid-cols-7 text-center text-[11px] font-semibold text-white/70">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, idx) => (
                  <div key={idx}>{d}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1.5 text-center text-[12px] font-semibold">
                {[
                  { d: '19', s: 'normal' },
                  { d: '20', s: 'white' },
                  { d: '21', s: 'white' },
                  { d: '22', s: 'normal' },
                  { d: '23', s: 'white' },
                  { d: '24', s: 'normal' },
                  { d: '25', s: 'teal' },
                  { d: '01', s: 'normal' },
                  { d: '02', s: 'normal' },
                  { d: '03', s: 'normal' },
                  { d: '04', s: 'white' },
                  { d: '05', s: 'normal' },
                  { d: '06', s: 'orange' },
                  { d: '07', s: 'normal' },
                ].map((c, idx) => (
                  <div
                    key={idx}
                    className={`h-9 w-9 mx-auto rounded-full flex items-center justify-center ${
                      c.s === 'white'
                        ? 'bg-white text-[#181924] font-bold'
                        : c.s === 'orange'
                        ? 'bg-[#FFA143] text-[#181924] font-bold'
                        : c.s === 'teal'
                        ? 'bg-[#11C6C2] text-[#181924] font-bold'
                        : 'bg-white/15 text-white'
                    }`}
                  >
                    {c.d}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SHOWCASE SECTION (CONTOH HASIL) IN SOVEREIGN CARD CONTAINER */}
        <section id="contoh" className="scroll-mt-20 rounded-[28px] bg-[#F4F5FF] p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-bold text-[#181924]">
                {t('Contoh Hasil Video ReelMotion', 'Made with ReelMotion')}
              </h2>
              <p className="mt-1 text-[13.5px] text-[#6C7086]">
                {t(
                  'Putar langsung di sini. Semua contoh dibuat dengan alat yang sama yang Anda pakai setelah masuk.',
                  'Play directly here. Every sample was generated with the same tools available inside the studio.'
                )}
              </p>
            </div>

            {/* Segmented Sovereign Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all' as const, label: t('Semua', 'All') },
                { id: '9:16' as const, label: t('Vertikal (9:16)', 'Vertical (9:16)') },
                { id: '16:9' as const, label: t('Horizontal (16:9)', 'Horizontal (16:9)') },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setShowcaseFilter(tab.id)}
                  className={`h-10 rounded-full px-5 text-[12.5px] font-semibold transition cursor-pointer ${
                    showcaseFilter === tab.id
                      ? 'bg-[#4D5BAF] text-white shadow-sm'
                      : 'bg-white text-[#181924] hover:text-[#4D5BAF]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredVideos.map((vid) => (
              <div
                key={vid.id}
                className="rounded-[24px] bg-white p-3.5 flex flex-col justify-between shadow-sm"
              >
                <div
                  className="relative w-full overflow-hidden rounded-2xl bg-black"
                  style={{ aspectRatio: '16 / 9' }}
                >
                  {playingVideos[vid.id] ? (
                    <iframe
                      className="absolute inset-0 h-full w-full"
                      src={`https://www.youtube-nocookie.com/embed/${vid.youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                      title={vid.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setPlayingVideos((p) => ({ ...p, [vid.id]: true }))}
                      className="group absolute inset-0 h-full w-full cursor-pointer"
                    >
                      <img
                        src={`https://i.ytimg.com/vi/${vid.youtubeId}/hqdefault.jpg`}
                        alt={vid.title}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      <span className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#4D5BAF] shadow-lg transition-transform group-hover:scale-110">
                          <Play className="ml-0.5 h-5 w-5 fill-current" />
                        </span>
                      </span>
                    </button>
                  )}
                </div>

                <div className="pt-3 px-1 flex items-center justify-between gap-2">
                  <div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#F0FCED] px-2.5 py-0.5 text-[10.5px] font-bold text-[#56B847]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#56B847]" />
                      {vid.ratio}
                    </span>
                    <h3 className="mt-1.5 font-display text-[14.5px] font-bold text-[#181924]">
                      {vid.title}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CARA KERJA SECTION IN 3 SOVEREIGN FOLDER CARDS */}
        <section id="cara" className="scroll-mt-20 grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              step: '01',
              title: t('Tulis ide atau tempel tautan', 'Write an idea or paste a link'),
              desc: t(
                'Satu kalimat topik, naskah Anda sendiri, atau tautan video panjang untuk dipotong jadi klip.',
                'A single topic sentence, your own script, or a long YouTube link.'
              ),
            },
            {
              step: '02',
              title: t('Pilih gaya, suara, dan durasi', 'Choose style, voice, and duration'),
              desc: t(
                'Atur tema gambar, narator, dan panjang video. Mode tinjau membiarkan Anda menyunting tiap langkah.',
                'Pick visual style, narrator voice, and video length.'
              ),
            },
            {
              step: '03',
              title: t('Unduh dan unggah', 'Download and publish'),
              desc: t(
                'Video jadi tersimpan di Riwayat — unduh kapan saja, lalu unggah ke YouTube, TikTok, atau Instagram.',
                'Finished videos stay in History — download anytime or publish to social media.'
              ),
            },
          ].map((s) => (
            <div
              key={s.step}
              className="rounded-[26px] bg-[#F4F5FF] p-6 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="h-11 w-11 rounded-full bg-[#4D5BAF] text-white font-display text-[14px] font-extrabold flex items-center justify-center">
                  {s.step}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F0FCED] px-3 py-1 text-[11px] font-bold text-[#56B847]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#56B847]" />
                  {t('Langkah', 'Step')} {s.step}
                </span>
              </div>
              <div className="mt-6">
                <h3 className="font-display text-[18px] font-bold text-[#181924]">{s.title}</h3>
                <p className="mt-2 text-[13px] text-[#6C7086] leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </section>

        {/* PRICING & PACKAGES SECTION IN SOVEREIGN TABLE & CARDS */}
        <section id="harga" className="scroll-mt-20 rounded-[28px] bg-[#F4F5FF] p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-bold text-[#181924]">
                {t('Harga Jelas per Video, Tanpa Langganan', 'Clear Per-Video Pricing, No Subscription')}
              </h2>
              <p className="mt-1 text-[13.5px] text-[#6C7086]">
                {t(
                  '1 RMToken ≈ Rp1.000 · Dipotong hanya untuk tahap yang berhasil.',
                  '1 RMToken ≈ Rp1,000 · Deducted only for completed stages.'
                )}
              </p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#F0FCED] px-4 py-1.5 text-[12.5px] font-bold text-[#56B847]">
              <span className="h-2 w-2 rounded-full bg-[#56B847]" />
              {t('Promo X3 Token (+200% Bonus Aktif)', 'X3 Token Promo (+200% Bonus Active)')}
            </span>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              { id: 't20', name: '20 RMToken', bonus: '+40 Bonus', total: '60 RMToken', price: 'Rp20.000', eq: 18 },
              {
                id: 't50',
                name: '50 RMToken',
                bonus: '+100 Bonus',
                total: '150 RMToken',
                price: 'Rp50.000',
                eq: 48,
                featured: true,
              },
              { id: 't100', name: '100 RMToken', bonus: '+200 Bonus', total: '300 RMToken', price: 'Rp100.000', eq: 99 },
            ].map((pkg) => (
              <div
                key={pkg.id}
                className={`rounded-[26px] p-6 flex flex-col justify-between ${
                  pkg.featured
                    ? 'bg-[#4D5BAF] text-white shadow-xl shadow-[#4D5BAF]/25'
                    : 'bg-white text-[#181924]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-display text-lg font-bold">{pkg.name}</span>
                    <span
                      className={`rounded-full px-3 py-0.5 text-[11px] font-bold ${
                        pkg.featured
                          ? 'bg-[#11C6C2] text-[#181924]'
                          : 'bg-[#F0FCED] text-[#56B847]'
                      }`}
                    >
                      {pkg.bonus}
                    </span>
                  </div>
                  <div className="mt-4 font-display text-3xl font-extrabold">{pkg.price}</div>
                  <div
                    className={`mt-2 text-[13px] font-semibold ${
                      pkg.featured ? 'text-white/90' : 'text-[#4D5BAF]'
                    }`}
                  >
                    {t('Total diterima:', 'Total received:')} {pkg.total}
                  </div>
                  <p
                    className={`mt-1 text-[12px] ${
                      pkg.featured ? 'text-white/75' : 'text-[#6C7086]'
                    }`}
                  >
                    {t(
                      `Cukup untuk ±${pkg.eq} video vertikal pendek`,
                      `Enough for ~${pkg.eq} short vertical videos`
                    )}
                  </p>
                </div>

                <button
                  onClick={() => onOpenAuth('payment')}
                  className={`mt-6 h-11 w-full rounded-full text-[13px] font-bold transition cursor-pointer ${
                    pkg.featured
                      ? 'bg-white text-[#4D5BAF] hover:bg-[#F4F5FF]'
                      : 'bg-[#4D5BAF] text-white hover:bg-[#3f4c9c]'
                  }`}
                >
                  {t('Pilih Paket & Isi Saldo', 'Choose Package')}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ SECTION */}
        <section id="faq" className="scroll-mt-20 rounded-[28px] bg-[#F4F5FF] p-6 sm:p-8 space-y-4">
          <h2 className="font-display text-2xl font-bold text-[#181924]">
            {t('Tanya Jawab', 'Frequently Asked Questions')}
          </h2>
          <div className="space-y-3">
            {faqs.map((item, idx) => {
              const expanded = openFaq === idx;
              return (
                <div key={item.q} className="rounded-2xl bg-white overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(expanded ? null : idx)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-[14.5px] font-bold text-[#181924] cursor-pointer"
                  >
                    <span>{item.q}</span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-[#6C7086] transition-transform ${
                        expanded ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {expanded && (
                    <div className="px-5 pb-4 text-[13.5px] leading-relaxed text-[#6C7086]">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="rounded-[28px] bg-[#F4F5FF] px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12.5px] text-[#6C7086]">
          <div className="flex items-center gap-2.5">
            <span className="h-7 w-7 rounded-full bg-[#4D5BAF] text-white font-bold text-[12px] flex items-center justify-center">
              R
            </span>
            <span className="font-semibold text-[#181924]">
              © 2026 ReelMotion — FLUXY Digital Studio
            </span>
          </div>
          <div className="flex flex-wrap gap-5">
            <button onClick={() => onOpenAuth('video')} className="hover:text-[#4D5BAF] cursor-pointer">
              Faceless
            </button>
            <button onClick={() => onOpenAuth('motion')} className="hover:text-[#4D5BAF] cursor-pointer">
              Motion
            </button>
            <button onClick={() => onOpenAuth('audiobook')} className="hover:text-[#4D5BAF] cursor-pointer">
              AudioBook
            </button>
            <button onClick={() => onOpenAuth('clipper')} className="hover:text-[#4D5BAF] cursor-pointer">
              AutoClipper
            </button>
          </div>
        </footer>
      </div>

      {/* Bonus Account Modal */}
      {showBonusModal && (
        <div
          role="dialog"
          aria-label="Bonus akun baru"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#181924]/50 backdrop-blur-sm p-4"
        >
          <div className="relative w-full max-w-md rounded-[28px] bg-[#F4F5FF] p-7 shadow-2xl animate-fade-in">
            <button
              onClick={() => setShowBonusModal(false)}
              aria-label="Tutup"
              className="absolute right-5 top-5 h-9 w-9 rounded-full bg-white flex items-center justify-center text-[#6C7086] cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#4D5BAF] font-display text-xl font-extrabold text-white">
              6
            </div>

            <h2 className="mt-4 font-display text-xl font-bold text-[#181924]">
              {t('Gratis 6 RMToken untuk akun baru', 'Free 6 RMToken for new accounts')}
            </h2>
            <p className="mt-1.5 text-[13.5px] text-[#6C7086]">
              {t(
                'Cukup untuk mencoba ±2 video vertikal pendek — tanpa isi saldo dulu.',
                'Enough to create ~2 short vertical videos — no initial top-up required.'
              )}
            </p>

            <div className="mt-6 flex flex-col gap-2">
              <button
                onClick={() => {
                  setShowBonusModal(false);
                  onOpenAuth();
                }}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#4D5BAF] text-[13.5px] font-bold text-white cursor-pointer"
              >
                {t('Daftar & Ambil Bonus', 'Sign Up & Claim Bonus')}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
