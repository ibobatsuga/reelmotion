import React, { useState, useEffect } from 'react';
import {
  Sun,
  Moon,
  Menu,
  X,
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
  ShieldCheck,
  Coins,
  History,
  Sparkles,
  MessageCircle,
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
  theme,
  toggleTheme,
  onOpenAuth,
}) => {
  const isEn = lang === 'en';
  const t = (id: string, en: string) => (isEn ? en : id);

  const [showcaseFilter, setShowcaseFilter] = useState<'all' | '9:16' | '16:9'>('all');
  const [playingVideos, setPlayingVideos] = useState<Record<string, boolean>>({});
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [showBonusModal, setShowBonusModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [heroProgress, setHeroProgress] = useState(18);
  const [heroStage, setHeroStage] = useState(2);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroProgress((p) => {
        if (p >= 96) {
          setHeroStage((s) => (s >= 4 ? 2 : s + 1));
          return 12;
        }
        return p + 7;
      });
    }, 600);
    return () => clearInterval(timer);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const horizontalVideos = SHOWCASE_VIDEOS.filter(
    (v) => v.ratio === '16:9' && (showcaseFilter === 'all' || showcaseFilter === '16:9')
  );
  const verticalVideos = SHOWCASE_VIDEOS.filter(
    (v) => v.ratio === '9:16' && (showcaseFilter === 'all' || showcaseFilter === '9:16')
  );

  const faqs = [
    {
      q: t('Apakah saya perlu keahlian editing video?', 'Do I need video editing skills?'),
      a: t(
        'Tidak. Anda cukup menulis topik atau naskah. Naskah, narasi, gambar, subtitle, dan penyatuan video dikerjakan otomatis. Bila ingin, mode tinjau membiarkan Anda menyunting tiap langkah sebelum lanjut.',
        'No. You simply write a topic or script. The script, narration, visuals, subtitles, and video rendering are done automatically. If you want, review mode lets you edit every step before continuing.'
      ),
    },
    {
      q: t('Bagaimana cara membayar?', 'How do I pay?'),
      a: t(
        'Anda cukup membeli paket RMToken lewat QRIS otomatis atau transfer, tanpa langganan bulanan. Saldo token tidak memiliki masa kedaluwarsa dan bisa dipakai untuk semua alat (Faceless, Motion, AudioBook, AutoClipper).',
        'Simply top up an RMToken package via instant QRIS or transfer, with no monthly subscription. Token balances never expire and work across all tools (Faceless, Motion, AudioBook, AutoClipper).'
      ),
    },
    {
      q: t(
        'Bagaimana kalau pembuatan video gagal di tengah jalan?',
        'What if video creation fails halfway through?'
      ),
      a: t(
        'Saldo RMToken hanya dipotong untuk tahap yang benar-benar berhasil. Bila tahap penyatuan gagal di mesin, token untuk tahap tersebut otomatis dilepas kembali ke saldo Anda dan Anda bisa melanjutkan dari Riwayat.',
        'RMToken is only deducted for stages that actually succeed. If rendering fails on the engine, the held tokens for that stage are automatically released back to your balance and you can resume from History.'
      ),
    },
    {
      q: t(
        'Apakah video bisa diunggah langsung ke YouTube, TikTok, atau Instagram?',
        'Can videos be uploaded directly to YouTube, TikTok, or Instagram?'
      ),
      a: t(
        'Ya! Anda bisa mengunduh file MP4 kapan saja atau menyambungkan akun YouTube, TikTok, Instagram Reels, dan Facebook Page di menu Media Sosial agar video terbit otomatis sesuai jadwal.',
        'Yes! You can download the MP4 anytime or connect your YouTube, TikTok, Instagram Reels, and Facebook Page accounts in the Social Media menu for automated publishing.'
      ),
    },
  ];

  return (
    <div
      data-landing="true"
      className="relative min-h-screen font-body overflow-x-hidden bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-500"
    >
      {/* Ambient Radial & Grid Background */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[900px] overflow-hidden z-0">
        <div
          className="absolute -top-40 left-1/2 h-[620px] w-[1100px] -translate-x-1/2 rounded-full opacity-70 blur-[80px]"
          style={{
            background: 'radial-gradient(closest-side, rgba(242, 135, 31, 0.28), transparent)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              'linear-gradient(var(--border-default) 1px, transparent 1px), linear-gradient(90deg, var(--border-default) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
            maskImage: 'radial-gradient(at center top, rgb(0, 0, 0) 20%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(at center top, rgb(0, 0, 0) 20%, transparent 70%)',
          }}
        />
      </div>

      {/* Sticky Top Header */}
      <header className="sticky top-0 z-30 border-b border-[var(--border-default)] backdrop-blur-md bg-[var(--bg-primary)]/80">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <a href="#" className="flex items-center gap-2.5 shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent-amber)] text-[15px] font-extrabold text-[var(--accent-text)]">
              R
            </div>
            <span className="font-display text-[15px] font-bold tracking-wide">ReelMotion</span>
          </a>

          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => scrollToSection('fitur')}
              className="rounded-lg px-3 py-2 text-[13px] font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] cursor-pointer transition"
            >
              {t('Fitur', 'Features')}
            </button>
            <button
              onClick={() => scrollToSection('contoh')}
              className="rounded-lg px-3 py-2 text-[13px] font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] cursor-pointer transition"
            >
              {t('Contoh hasil', 'Showcase')}
            </button>
            <button
              onClick={() => scrollToSection('cara')}
              className="rounded-lg px-3 py-2 text-[13px] font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] cursor-pointer transition"
            >
              {t('Cara kerja', 'How it works')}
            </button>
            <button
              onClick={() => scrollToSection('harga')}
              className="rounded-lg px-3 py-2 text-[13px] font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] cursor-pointer transition"
            >
              {t('Harga', 'Pricing')}
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="rounded-lg px-3 py-2 text-[13px] font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] cursor-pointer transition"
            >
              {t('Tanya jawab', 'FAQ')}
            </button>
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex rounded-lg border border-[var(--border-default)] overflow-hidden">
              <button
                onClick={() => setLang('id')}
                className={`px-2.5 py-1.5 text-[11px] font-bold uppercase cursor-pointer transition ${
                  lang === 'id'
                    ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]'
                    : 'text-[var(--text-faint)] hover:text-[var(--text-primary)]'
                }`}
              >
                id
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-2.5 py-1.5 text-[11px] font-bold uppercase cursor-pointer transition ${
                  lang === 'en'
                    ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]'
                    : 'text-[var(--text-faint)] hover:text-[var(--text-primary)]'
                }`}
              >
                en
              </button>
            </div>

            <button
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? t('Mode terang', 'Light mode') : t('Mode gelap', 'Dark mode')}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] cursor-pointer"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 text-[var(--accent-amber)]" />
              ) : (
                <Moon className="h-4 w-4 text-[var(--accent-amber)]" />
              )}
            </button>

            <button
              onClick={() => onOpenAuth()}
              className="hidden sm:inline-flex h-9 items-center rounded-lg px-4 text-[13px] font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] cursor-pointer transition"
            >
              {t('Masuk', 'Sign in')}
            </button>

            <button
              data-landing-cta="true"
              onClick={() => onOpenAuth()}
              className="inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-lg bg-[var(--accent-amber)] px-4 text-[13px] font-bold text-[var(--accent-text)] hover:brightness-105 cursor-pointer transition"
            >
              <span className="sm:hidden">{t('Masuk', 'Sign in')}</span>
              <span className="hidden sm:inline">{t('Mulai sekarang', 'Get started')}</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label="Menu"
              className="lg:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border-default)] cursor-pointer"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[var(--border-default)] bg-[var(--bg-card)] px-4 py-3 space-y-2">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => scrollToSection('fitur')}
                className="rounded-lg px-3 py-1.5 text-[13px] font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]"
              >
                {t('Fitur', 'Features')}
              </button>
              <button
                onClick={() => scrollToSection('contoh')}
                className="rounded-lg px-3 py-1.5 text-[13px] font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]"
              >
                {t('Contoh hasil', 'Showcase')}
              </button>
              <button
                onClick={() => scrollToSection('cara')}
                className="rounded-lg px-3 py-1.5 text-[13px] font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]"
              >
                {t('Cara kerja', 'How it works')}
              </button>
              <button
                onClick={() => scrollToSection('harga')}
                className="rounded-lg px-3 py-1.5 text-[13px] font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]"
              >
                {t('Harga', 'Pricing')}
              </button>
              <button
                onClick={() => scrollToSection('faq')}
                className="rounded-lg px-3 py-1.5 text-[13px] font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]"
              >
                {t('Tanya jawab', 'FAQ')}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative z-10 mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 pt-14 pb-16 md:pt-20 md:pb-24 lg:grid-cols-[1.05fr_1fr]">
        <div className="text-center lg:text-left animate-fade-in">
          <div>
            <button
              data-landing-bonus="true"
              onClick={() => setShowBonusModal(true)}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--accent-amber)]/40 bg-[var(--accent-amber-bg)] px-3.5 py-1.5 text-[12px] font-semibold text-[var(--text-primary)] shadow-sm cursor-pointer hover:border-[var(--accent-amber)] transition"
            >
              <Gift className="h-3.5 w-3.5 text-[var(--accent-amber)]" />
              {t('Gratis 6 RMToken untuk akun baru', 'Free 6 RMToken for new accounts')}
            </button>
          </div>

          <h1 className="mt-5 font-display text-[2.35rem] leading-[1.06] sm:text-5xl lg:text-[3.6rem] font-extrabold tracking-tight">
            <span className="block">{t('Dari satu ide,', 'From a single idea,')}</span>
            <span className="block bg-gradient-to-r from-[#f2871f] via-[#f6a04a] to-[#e2591f] bg-clip-text text-transparent">
              {t('jadi video siap tayang.', 'to a ready-to-post video.')}
            </span>
          </h1>

          <p className="mx-auto lg:mx-0 mt-5 max-w-xl text-[15.5px] md:text-lg leading-relaxed text-[var(--text-muted)]">
            {t(
              'Tulis topiknya - ReelMotion menulis naskah, merekam narasi, melukis gambar, dan menyatukan videonya. Video pendek, video panjang, audiobook, sampai potongan klip dari video panjang Anda.',
              'Write the topic - ReelMotion writes the script, records the narration, paints the visuals, and puts the video together. Short videos, long videos, audiobooks, and clips from your long videos.'
            )}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
            <button
              onClick={() => onOpenAuth()}
              className="inline-flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[var(--accent-amber)] px-7 text-[14px] font-bold text-[var(--accent-text)] shadow-lg shadow-[rgba(242,135,31,.25)] hover:brightness-105 cursor-pointer transition"
            >
              {t('Mulai sekarang', 'Get started')}
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => scrollToSection('contoh')}
              className="inline-flex h-12 w-full sm:w-auto items-center justify-center rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] px-7 text-[14px] font-semibold text-[var(--text-primary)] hover:border-[var(--border-hover)] cursor-pointer transition"
            >
              {t('Lihat contoh hasil', 'See showcase')}
            </button>
          </div>

          <ul className="mt-7 flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-2 text-[13px] text-[var(--text-muted)]">
            <li className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-[var(--success)]" />
              {t('Tanpa langganan bulanan', 'No monthly subscription')}
            </li>
            <li className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-[var(--success)]" />
              {t('Dipotong hanya untuk tahap yang berhasil', 'Charged only for completed stages')}
            </li>
            <li className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-[var(--success)]" />
              {t('Tanpa perlu keahlian editing', 'No editing skills needed')}
            </li>
          </ul>
        </div>

        {/* Interactive Hero Studio Mockup */}
        <div className="animate-fade-in">
          <div className="relative mx-auto w-full max-w-[560px]">
            <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-tr from-[rgba(242,135,31,.25)] via-transparent to-[rgba(79,140,255,.18)] blur-2xl" />
            <div className="relative rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] shadow-2xl overflow-hidden">
              <div className="flex items-center gap-1.5 px-4 h-10 border-b border-[var(--border-default)] bg-[var(--bg-secondary)]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                <span className="ml-3 text-[11px] font-semibold text-[var(--text-faint)]">
                  ReelMotion Studio
                </span>
              </div>

              <div className="grid grid-cols-[1fr_auto] gap-4 p-4 sm:p-5">
                <div className="min-w-0 space-y-3">
                  <div className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-input)] px-3 py-2">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-faint)]">
                      {t('Topik', 'Topic')}
                    </div>
                    <div className="text-[13px] font-semibold text-[var(--text-primary)] truncate">
                      {t(
                        'Misteri pembangunan Candi Borobudur',
                        'The mystery of Borobudur Temple construction'
                      )}
                    </div>
                  </div>

                  <ul className="space-y-1.5">
                    {[
                      t('Naskah ditulis', 'Script written'),
                      t('Susunan adegan', 'Scene layout'),
                      t('Narasi direkam', 'Recording narration'),
                      t('Gambar dilukis', 'Painting images'),
                      t('Menyatukan video', 'Rendering video'),
                    ].map((label, idx) => {
                      const done = idx < heroStage;
                      const active = idx === heroStage;
                      return (
                        <li key={label} className="flex items-center gap-2.5 text-[12.5px]">
                          {done ? (
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors border-[var(--success)] bg-[var(--success)] text-white">
                              <Check className="h-3 w-3" />
                            </span>
                          ) : active ? (
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors border-[var(--accent-amber)] text-[var(--accent-amber)]">
                              <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
                            </span>
                          ) : (
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors border-[var(--border-default)] text-transparent" />
                          )}
                          <span
                            className={
                              done || active
                                ? 'text-[var(--text-primary)] font-medium'
                                : 'text-[var(--text-faint)]'
                            }
                          >
                            {label}
                          </span>
                          {active && (
                            <span className="ml-auto h-1 w-16 overflow-hidden rounded-full bg-[var(--bg-tertiary)]">
                              <span
                                className="block h-full rounded-full bg-[var(--accent-amber)] transition-all duration-300"
                                style={{ width: `${heroProgress}%` }}
                              />
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* 9:16 Preview Frame */}
                <div
                  className="relative w-[112px] sm:w-[132px] aspect-[9/16] overflow-hidden rounded-xl border border-[var(--border-default)]"
                  style={{
                    background:
                      'linear-gradient(160deg, rgb(59, 42, 26) 0%, rgb(162, 86, 28) 45%, rgb(242, 166, 90) 75%, rgb(43, 29, 18) 100%)',
                  }}
                >
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/75 to-transparent" />
                  <div className="absolute left-1/2 top-[30%] h-12 w-16 -translate-x-1/2 rounded-t-[50%] bg-black/35" />
                  <div
                    className="absolute left-1/2 top-[38%] h-10 w-24 -translate-x-1/2 bg-black/30"
                    style={{ clipPath: 'polygon(10% 0px, 90% 0px, 100% 100%, 0px 100%)' }}
                  />
                  <div className="absolute inset-x-2 bottom-5 flex flex-wrap justify-center gap-x-1 text-center text-[10px] font-extrabold leading-tight text-white">
                    <span>{t('Ribuan', 'Thousands')}</span>
                    <span>{t('batu', 'of stones')}</span>
                    <span className="text-[var(--accent-amber)]">{t('disusun', 'stacked')}</span>
                    <span>{t('tanpa', 'without')}</span>
                    <span>{t('semen', 'cement')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section: Satu Tempat, Empat Alat */}
      <section
        id="fitur"
        className="relative z-10 scroll-mt-20 border-t border-[var(--border-default)] bg-[var(--bg-secondary)]/60"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-20 md:py-24">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <div className="text-[12px] font-bold tracking-[0.18em] text-[var(--accent-amber)]">
              {t('SATU TEMPAT, EMPAT ALAT', 'ONE STUDIO, FOUR TOOLS')}
            </div>
            <h2 className="mt-3 font-display text-[1.75rem] md:text-4xl font-bold tracking-tight">
              {t(
                'Semua yang dibutuhkan kreator untuk konsisten tayang',
                'Everything creators need to publish consistently'
              )}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Faceless Vertikal */}
            <div
              onClick={() => onOpenAuth('video')}
              className="group flex h-full flex-col rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-6 transition hover:-translate-y-0.5 hover:border-[var(--border-hover)] hover:shadow-xl cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent-amber-bg)]">
                  <Clapperboard className="h-5 w-5 text-[var(--accent-amber)]" />
                </div>
                <span className="rounded-full border border-[var(--border-default)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--text-muted)]">
                  9:16
                </span>
              </div>
              <h3 className="mt-5 font-display text-[17px] font-bold">
                {t('Faceless Vertikal', 'Vertical Faceless')}
              </h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--text-muted)]">
                {t(
                  'Video pendek untuk TikTok, Reels, dan YouTube Shorts - lengkap dengan teks yang menyala per kata.',
                  'Short videos for TikTok, Reels, and YouTube Shorts - complete with word-by-word highlighted captions.'
                )}
              </p>
              <ul className="mt-4 space-y-1.5 text-[13px] text-[var(--text-secondary)]">
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--accent-amber)]" />
                  {t('Naskah & narasi otomatis', 'Automated script & narration')}
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--accent-amber)]" />
                  {t('Lebih dari 20 gaya gambar', 'Over 20 AI visual styles')}
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--accent-amber)]" />
                  {t('Teks menyala mengikuti suara', 'Karaoke captions synced to voice')}
                </li>
              </ul>
            </div>

            {/* Card 2: Faceless Horizontal */}
            <div
              onClick={() => onOpenAuth('video')}
              className="group flex h-full flex-col rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-6 transition hover:-translate-y-0.5 hover:border-[var(--border-hover)] hover:shadow-xl cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent-amber-bg)]">
                  <MonitorPlay className="h-5 w-5 text-[var(--accent-amber)]" />
                </div>
                <span className="rounded-full border border-[var(--border-default)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--text-muted)]">
                  16:9
                </span>
              </div>
              <h3 className="mt-5 font-display text-[17px] font-bold">
                {t('Faceless Horizontal', 'Horizontal Faceless')}
              </h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--text-muted)]">
                {t(
                  'Video panjang untuk YouTube - dokumenter dan edukasi, dibagi per bab dengan kartu judul yang rapi.',
                  'Long-form YouTube videos - documentaries and explainers, structured into chapters with clean title cards.'
                )}
              </p>
              <ul className="mt-4 space-y-1.5 text-[13px] text-[var(--text-secondary)]">
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--accent-amber)]" />
                  {t('Kartu bab otomatis', 'Automated chapter cards')}
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--accent-amber)]" />
                  {t('Gambar konsisten satu gaya', 'Consistent visual style')}
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--accent-amber)]" />
                  {t('Tinjau tiap langkah bila mau', 'Optional step-by-step review')}
                </li>
              </ul>
            </div>

            {/* Card 3: AudioBook */}
            <div
              onClick={() => onOpenAuth('audiobook')}
              className="group flex h-full flex-col rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-6 transition hover:-translate-y-0.5 hover:border-[var(--border-hover)] hover:shadow-xl cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent-amber-bg)]">
                  <Headphones className="h-5 w-5 text-[var(--accent-amber)]" />
                </div>
                <span className="rounded-full border border-[var(--border-default)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--text-muted)]">
                  {t('Narasi', 'Narration')}
                </span>
              </div>
              <h3 className="mt-5 font-display text-[17px] font-bold">AudioBook</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--text-muted)]">
                {t(
                  'Ubah naskah atau buku menjadi episode audiobook bertampilan video - siap diunduh dan diunggah ke YouTube.',
                  'Turn manuscripts or books into video-formatted audiobook episodes - ready to download and publish to YouTube.'
                )}
              </p>
              <ul className="mt-4 space-y-1.5 text-[13px] text-[var(--text-secondary)]">
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--accent-amber)]" />
                  {t('Suara narator pilihan', 'Custom narrator voice cloning')}
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--accent-amber)]" />
                  {t('Teks berjalan mengikuti suara', 'Scrolling text synced to voice')}
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--accent-amber)]" />
                  {t('Tampilan sesuai merek Anda', 'Customizable canvas layout')}
                </li>
              </ul>
            </div>

            {/* Card 4: AutoClipper */}
            <div
              onClick={() => onOpenAuth('clipper')}
              className="group flex h-full flex-col rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-6 transition hover:-translate-y-0.5 hover:border-[var(--border-hover)] hover:shadow-xl cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent-amber-bg)]">
                  <Scissors className="h-5 w-5 text-[var(--accent-amber)]" />
                </div>
                <span className="rounded-full border border-[var(--border-default)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--text-muted)]">
                  {t('Klip', 'Clips')}
                </span>
              </div>
              <h3 className="mt-5 font-display text-[17px] font-bold">AutoClipper</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--text-muted)]">
                {t(
                  'Tempel tautan video panjang - podcast, siaran, wawancara - dan dapatkan klip vertikal momen terbaiknya.',
                  'Paste a long YouTube link - podcasts, streams, interviews - and get vertical clips of its best moments.'
                )}
              </p>
              <ul className="mt-4 space-y-1.5 text-[13px] text-[var(--text-secondary)]">
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--accent-amber)]" />
                  {t('Momen terbaik dipilih otomatis', 'Best moments picked by AI')}
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--accent-amber)]" />
                  {t('Bingkai mengikuti wajah pembicara', 'Active speaker face tracking')}
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--accent-amber)]" />
                  {t('Keterangan & tagar siap pakai', 'Ready-to-post captions & hashtags')}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Showcase Section: Contoh Hasil */}
      <section
        id="contoh"
        data-landing-showcase="true"
        className="relative z-10 scroll-mt-20 mx-auto max-w-6xl px-4 sm:px-6 py-20 md:py-24"
      >
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
          <div className="max-w-xl">
            <div className="text-[12px] font-bold tracking-[0.18em] text-[var(--accent-amber)]">
              {t('CONTOH HASIL', 'SHOWCASE')}
            </div>
            <h2 className="mt-3 font-display text-[1.75rem] md:text-4xl font-bold tracking-tight">
              {t('Dibuat dengan ReelMotion', 'Made with ReelMotion')}
            </h2>
            <p className="mt-3 text-[15px] text-[var(--text-muted)]">
              {t(
                'Putar langsung di sini. Semua contoh dibuat dengan alat yang sama yang Anda pakai setelah masuk.',
                'Play directly right here. Every sample was generated using the exact same tools you get after signing in.'
              )}
            </p>
          </div>

          <div className="-mx-4 px-4 overflow-x-auto md:mx-0 md:px-0">
            <div className="flex w-max gap-1 rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] p-1">
              <button
                onClick={() => setShowcaseFilter('all')}
                className={`whitespace-nowrap rounded-lg px-3.5 py-2 text-[12.5px] font-semibold cursor-pointer transition ${
                  showcaseFilter === 'all'
                    ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                {t('Semua', 'All')}
              </button>
              <button
                onClick={() => setShowcaseFilter('9:16')}
                className={`whitespace-nowrap rounded-lg px-3.5 py-2 text-[12.5px] font-semibold cursor-pointer transition ${
                  showcaseFilter === '9:16'
                    ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                {t('Video vertikal (9:16)', 'Vertical video (9:16)')}
              </button>
              <button
                onClick={() => setShowcaseFilter('16:9')}
                className={`whitespace-nowrap rounded-lg px-3.5 py-2 text-[12.5px] font-semibold cursor-pointer transition ${
                  showcaseFilter === '16:9'
                    ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                {t('Video horizontal (16:9)', 'Horizontal video (16:9)')}
              </button>
            </div>
          </div>
        </div>

        {/* 16:9 Grid */}
        {horizontalVideos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5 mb-6">
            {horizontalVideos.map((vid) => (
              <article
                key={vid.id}
                className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-2.5"
              >
                <div
                  className="relative w-full overflow-hidden rounded-xl bg-black"
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
                      aria-label={`Putar: ${vid.title}`}
                    >
                      <img
                        src={`https://i.ytimg.com/vi/${vid.youtubeId}/hqdefault.jpg`}
                        alt={vid.title}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                      <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                      <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-black shadow-xl transition-transform group-hover:scale-110">
                        <Play className="ml-0.5 h-6 w-6 fill-current" />
                      </span>
                    </button>
                  )}
                </div>
                <div className="px-1.5 pt-3 pb-1.5">
                  <div className="text-[11px] font-semibold text-[var(--accent-amber)]">
                    {isEn ? vid.tagEn : vid.tagId}
                  </div>
                  <h3 className="mt-1 text-[14.5px] font-semibold leading-snug">{vid.title}</h3>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* 9:16 Grid */}
        {verticalVideos.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {verticalVideos.map((vid) => (
              <article
                key={vid.id}
                className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-2"
              >
                <div
                  className="relative w-full overflow-hidden rounded-xl bg-black"
                  style={{ aspectRatio: '9 / 16' }}
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
                      aria-label={`Putar: ${vid.title}`}
                    >
                      <img
                        src={`https://i.ytimg.com/vi/${vid.youtubeId}/hqdefault.jpg`}
                        alt={vid.title}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                      <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                      <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-black shadow-xl transition-transform group-hover:scale-110">
                        <Play className="ml-0.5 h-6 w-6 fill-current" />
                      </span>
                    </button>
                  )}
                </div>
                <div className="px-1 pt-2.5 pb-1">
                  <div className="text-[10.5px] font-semibold text-[var(--accent-amber)]">
                    {isEn ? vid.tagEn : vid.tagId}
                  </div>
                  <h3 className="mt-0.5 text-[13px] font-semibold leading-snug line-clamp-2">
                    {vid.title}
                  </h3>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Cara Kerja Section */}
      <section
        id="cara"
        className="relative z-10 scroll-mt-20 border-y border-[var(--border-default)] bg-[var(--bg-secondary)]/60"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-20 md:py-24">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <div className="text-[12px] font-bold tracking-[0.18em] text-[var(--accent-amber)]">
              {t('CARA KERJA', 'HOW IT WORKS')}
            </div>
            <h2 className="mt-3 font-display text-[1.75rem] md:text-4xl font-bold tracking-tight">
              {t('Tiga langkah, tanpa aplikasi editing', 'Three steps, zero editing software')}
            </h2>
          </div>

          <ol className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <li className="relative h-full list-none rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--text-primary)] text-[13px] font-bold text-[var(--bg-primary)]">
                  1
                </span>
                <WandSparkles className="h-5 w-5 text-[var(--accent-amber)]" />
              </div>
              <h3 className="mt-5 font-display text-[17px] font-bold">
                {t('Tulis ide atau tempel tautan', 'Write an idea or paste a link')}
              </h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--text-muted)]">
                {t(
                  'Satu kalimat topik, naskah Anda sendiri, atau tautan video panjang untuk dipotong jadi klip.',
                  'A single topic sentence, your own script, or a long YouTube link to slice into vertical clips.'
                )}
              </p>
            </li>

            <li className="relative h-full list-none rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--text-primary)] text-[13px] font-bold text-[var(--bg-primary)]">
                  2
                </span>
                <SlidersHorizontal className="h-5 w-5 text-[var(--accent-amber)]" />
              </div>
              <h3 className="mt-5 font-display text-[17px] font-bold">
                {t('Pilih gaya, suara, dan durasi', 'Choose style, voice, and duration')}
              </h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--text-muted)]">
                {t(
                  'Atur tema gambar, narator, dan panjang video. Mode tinjau membiarkan Anda menyunting tiap langkah.',
                  'Pick the visual style, narrator voice, and video length. Review mode lets you edit every stage.'
                )}
              </p>
            </li>

            <li className="relative h-full list-none rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--text-primary)] text-[13px] font-bold text-[var(--bg-primary)]">
                  3
                </span>
                <Download className="h-5 w-5 text-[var(--accent-amber)]" />
              </div>
              <h3 className="mt-5 font-display text-[17px] font-bold">
                {t('Unduh dan unggah', 'Download and publish')}
              </h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--text-muted)]">
                {t(
                  'Video jadi tersimpan di Riwayat - unduh kapan saja, lalu unggah ke YouTube, TikTok, atau Instagram.',
                  'Finished videos stay in History - download anytime or auto-post to YouTube, TikTok, or Instagram.'
                )}
              </p>
            </li>
          </ol>
        </div>
      </section>

      {/* Token Economy Section */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 py-20 md:py-24">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="text-[12px] font-bold tracking-[0.18em] text-[var(--accent-amber)]">
              RMTOKEN
            </div>
            <h2 className="mt-3 font-display text-[1.75rem] md:text-4xl font-bold tracking-tight">
              {t('Bayar sesuai yang benar-benar jadi', 'Pay only for what actually finishes')}
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-[var(--text-muted)]">
              {t(
                'Satu saldo untuk semua alat. Harga tiap video terlihat sebelum Anda menekan tombol, dan dipotong per tahap yang berhasil - tahap yang gagal tidak ditagih.',
                'One balance across all tools. The token cost of each video is shown upfront before you press start, and deducted per completed stage - failed stages are never charged.'
              )}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5">
              <Coins className="h-5 w-5 text-[var(--accent-amber)]" />
              <h3 className="mt-3 font-display text-[15px] font-bold">
                {t('Harga tampil di depan', 'Upfront pricing')}
              </h3>
              <p className="mt-1.5 text-[13px] text-[var(--text-muted)]">
                {t(
                  'Lihat berapa RMToken yang dibutuhkan sebelum mulai.',
                  'See exactly how many RMTokens are required before starting.'
                )}
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5">
              <ShieldCheck className="h-5 w-5 text-[var(--accent-amber)]" />
              <h3 className="mt-3 font-display text-[15px] font-bold">
                {t('Dipotong per tahap', 'Stage-by-stage hold')}
              </h3>
              <p className="mt-1.5 text-[13px] text-[var(--text-muted)]">
                {t(
                  'Naskah, narasi, gambar, penyatuan - masing-masing hanya saat berhasil.',
                  'Script, narration, images, assembly - each charged only on completion.'
                )}
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5">
              <History className="h-5 w-5 text-[var(--accent-amber)]" />
              <h3 className="mt-3 font-display text-[15px] font-bold">
                {t('Riwayat transparan', 'Transparent ledger')}
              </h3>
              <p className="mt-1.5 text-[13px] text-[var(--text-muted)]">
                {t(
                  'Setiap token yang masuk dan terpakai tercatat dan bisa Anda periksa.',
                  'Every token added or spent is recorded in your auditable wallet history.'
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="harga"
        className="relative z-10 scroll-mt-20 border-t border-[var(--border-default)] bg-[var(--bg-secondary)]/60"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-20 md:py-24">
          <div className="mx-auto max-w-2xl text-center mb-10">
            <div className="text-[12px] font-bold tracking-[0.18em] text-[var(--accent-amber)]">
              {t('HARGA', 'PRICING')}
            </div>
            <h2 className="mt-3 font-display text-[1.75rem] md:text-4xl font-bold tracking-tight">
              {t('Harga jelas per video, tanpa langganan', 'Clear per-video pricing, no subscription')}
            </h2>
            <p className="mt-3 text-[15px] text-[var(--text-muted)]">
              {t(
                'Harga di bawah adalah harga penuh satu video bila semua tahap berhasil. Tahap yang gagal tidak ditagih.',
                'Prices below represent the full cost of one video when all stages succeed. Failed stages are never billed.'
              )}
            </p>
            <p className="mt-2 inline-block rounded-full border border-[var(--border-default)] bg-[var(--bg-card)] px-3.5 py-1 text-[12.5px] font-mono font-semibold text-[var(--accent-amber)]">
              1 RMToken ≈ Rp1.000
            </p>
          </div>

          {/* Promo & New Account Banners */}
          <div className="grid gap-4 md:grid-cols-2 mb-8">
            <div className="flex flex-col justify-between gap-4 rounded-2xl border border-[var(--accent-amber)]/40 bg-[var(--accent-amber-bg)] p-5 sm:flex-row sm:items-center">
              <div className="flex items-start gap-3">
                <Gift className="h-5 w-5 shrink-0 text-[var(--accent-amber)] mt-0.5" />
                <p className="text-[13.5px] font-medium text-[var(--text-primary)]">
                  {t(
                    'Akun baru dapat 6 RMToken gratis setelah verifikasi WhatsApp - cukup untuk 2 video vertikal pendek.',
                    'New accounts get 6 free RMTokens after WhatsApp verification - enough for 2 short vertical videos.'
                  )}
                </p>
              </div>
              <button
                onClick={() => onOpenAuth()}
                className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-[var(--accent-amber)] px-4 text-[12.5px] font-bold text-[var(--accent-text)] cursor-pointer"
              >
                {t('Mulai sekarang', 'Get started')}
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="flex flex-col justify-between gap-4 rounded-2xl border border-emerald-500/30 bg-[var(--success-bg)] p-5 sm:flex-row sm:items-center">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 shrink-0 text-[var(--success)] mt-0.5" />
                <div>
                  <div className="text-[12px] font-bold uppercase tracking-wider text-[var(--success)]">
                    {t('Promo sedang berlaku — Promo X3 Token', 'Active Promo — 3X Token Bonus')}
                  </div>
                  <p className="mt-0.5 text-[13px] text-[var(--text-primary)]">
                    {t(
                      'Bonus +200% setiap beli paket 20 RMToken, 50 RMToken, atau 100 RMToken',
                      '+200% bonus tokens on every 20, 50, or 100 RMToken package purchase'
                    )}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onOpenAuth('payment')}
                className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-[var(--text-primary)] px-4 text-[12.5px] font-bold text-[var(--bg-primary)] cursor-pointer"
              >
                {t('Ambil promo', 'Claim promo')}
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* 4 Tool Pricing Breakdown Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-12">
            <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5">
              <div className="flex items-center gap-2 text-[var(--accent-amber)]">
                <Clapperboard className="h-4 w-4" />
                <h3 className="font-display text-[15px] font-bold text-[var(--text-primary)]">
                  {t('Video vertikal · 9:16', 'Vertical video · 9:16')}
                </h3>
              </div>
              <ul className="mt-4 space-y-2.5 text-[13px]">
                <li className="flex items-center justify-between border-b border-[var(--border-default)] pb-2">
                  <span className="text-[var(--text-muted)]">{t('Pendek ≤ 2 mnt · 20 gbr', 'Short ≤ 2m · 20 img')}</span>
                  <span className="font-mono font-bold">3 Token ≈ Rp3.000</span>
                </li>
                <li className="flex items-center justify-between border-b border-[var(--border-default)] pb-2">
                  <span className="text-[var(--text-muted)]">{t('Sedang ≤ 5 mnt · 20 gbr', 'Medium ≤ 5m · 20 img')}</span>
                  <span className="font-mono font-bold">5 Token ≈ Rp5.000</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-[var(--text-muted)]">{t('Panjang ≤ 8 mnt · 35 gbr', 'Long ≤ 8m · 35 img')}</span>
                  <span className="font-mono font-bold">8 Token ≈ Rp8.000</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5">
              <div className="flex items-center gap-2 text-[var(--accent-amber)]">
                <MonitorPlay className="h-4 w-4" />
                <h3 className="font-display text-[15px] font-bold text-[var(--text-primary)]">
                  {t('Video horizontal · 16:9', 'Horizontal video · 16:9')}
                </h3>
              </div>
              <ul className="mt-4 space-y-2.5 text-[13px]">
                <li className="flex items-center justify-between border-b border-[var(--border-default)] pb-2">
                  <span className="text-[var(--text-muted)]">{t('Pendek ≤ 5 mnt · 30 gbr', 'Short ≤ 5m · 30 img')}</span>
                  <span className="font-mono font-bold">3 Token ≈ Rp3.000</span>
                </li>
                <li className="flex items-center justify-between border-b border-[var(--border-default)] pb-2">
                  <span className="text-[var(--text-muted)]">{t('Sedang ≤ 13 mnt · 60 gbr', 'Med ≤ 13m · 60 img')}</span>
                  <span className="font-mono font-bold">5 Token ≈ Rp5.000</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-[var(--text-muted)]">{t('Panjang ≤ 21 mnt · 90 gbr', 'Long ≤ 21m · 90 img')}</span>
                  <span className="font-mono font-bold">8 Token ≈ Rp8.000</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5">
              <div className="flex items-center gap-2 text-[var(--accent-amber)]">
                <Headphones className="h-4 w-4" />
                <h3 className="font-display text-[15px] font-bold text-[var(--text-primary)]">
                  {t('AudioBook & Motion', 'AudioBook & Motion')}
                </h3>
              </div>
              <ul className="mt-4 space-y-2.5 text-[13px]">
                <li className="flex items-center justify-between border-b border-[var(--border-default)] pb-2">
                  <span className="text-[var(--text-muted)]">{t('Pendek ± 7 mnt / Motion 10s', 'Short ± 7m / Motion 10s')}</span>
                  <span className="font-mono font-bold">2 Token ≈ Rp2.000</span>
                </li>
                <li className="flex items-center justify-between border-b border-[var(--border-default)] pb-2">
                  <span className="text-[var(--text-muted)]">{t('Sedang ± 14 mnt / Motion 30s', 'Med ± 14m / Motion 30s')}</span>
                  <span className="font-mono font-bold">3 Token ≈ Rp3.000</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-[var(--text-muted)]">{t('Panjang ± 26 mnt / Motion 60s', 'Long ± 26m / Motion 60s')}</span>
                  <span className="font-mono font-bold">5 Token ≈ Rp5.000</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5">
              <div className="flex items-center gap-2 text-[var(--accent-amber)]">
                <Scissors className="h-4 w-4" />
                <h3 className="font-display text-[15px] font-bold text-[var(--text-primary)]">
                  AutoClipper
                </h3>
              </div>
              <ul className="mt-4 space-y-2.5 text-[13px]">
                <li className="flex items-center justify-between border-b border-[var(--border-default)] pb-2">
                  <span className="text-[var(--text-muted)]">
                    {t('Mendengarkan video · per 30 mnt', 'Analyze video · per 30 min')}
                  </span>
                  <span className="font-mono font-bold">3 RMToken</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-[var(--text-muted)]">
                    {t('Tiap klip vertikal yang jadi', 'Each rendered vertical clip')}
                  </span>
                  <span className="font-mono font-bold">2 RMToken</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Paket Isi Saldo */}
          <div className="mb-4">
            <h3 className="font-display text-xl font-bold">
              {t('Paket isi saldo', 'Top-up packages')}
            </h3>
            <p className="mt-1 text-[13.5px] text-[var(--text-muted)]">
              {t(
                'Isi saldo sekali, pakai untuk semua alat. Saldo tidak hangus.',
                'Top up once, use across every tool. Balances never expire.'
              )}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              { id: 't20', name: '20 RMToken', bonus: '+40 Bonus Promo X3', price: 'Rp20.000', eq: 6 },
              {
                id: 't50',
                name: '50 RMToken',
                bonus: '+100 Bonus Promo X3',
                price: 'Rp50.000',
                eq: 16,
                popular: true,
              },
              { id: 't100', name: '100 RMToken', bonus: '+200 Bonus Promo X3', price: 'Rp100.000', eq: 33 },
            ].map((pkg) => (
              <div
                key={pkg.id}
                className={`flex flex-col justify-between rounded-2xl border p-6 ${
                  pkg.popular
                    ? 'border-[var(--accent-amber)] bg-[var(--bg-card)] shadow-lg'
                    : 'border-[var(--border-default)] bg-[var(--bg-card)]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-display text-lg font-bold">{pkg.name}</span>
                    <span className="rounded-full bg-[var(--accent-amber-bg)] px-2.5 py-0.5 text-[11px] font-bold text-[var(--accent-amber)]">
                      {pkg.bonus}
                    </span>
                  </div>
                  <div className="mt-3 font-mono text-2xl font-extrabold">{pkg.price}</div>
                  <p className="mt-2 text-[13px] text-[var(--text-muted)]">
                    {t(
                      `${pkg.name} cukup untuk ±${pkg.eq} video vertikal pendek`,
                      `${pkg.name} is enough for ~${pkg.eq} short vertical videos`
                    )}
                  </p>
                </div>
                <button
                  onClick={() => onOpenAuth('payment')}
                  className="mt-6 h-10 w-full rounded-xl bg-[var(--accent-amber)] text-[13px] font-bold text-[var(--accent-text)] hover:brightness-105 cursor-pointer transition"
                >
                  {t('Isi saldo', 'Top up')}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="relative z-10 scroll-mt-20 mx-auto max-w-4xl px-4 sm:px-6 py-20 md:py-24">
        <div className="text-center mb-12">
          <div className="text-[12px] font-bold tracking-[0.18em] text-[var(--accent-amber)]">
            {t('TANYA JAWAB', 'FAQ')}
          </div>
          <h2 className="mt-3 font-display text-[1.75rem] md:text-4xl font-bold tracking-tight">
            {t('Pertanyaan yang sering diajukan', 'Frequently asked questions')}
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((item, idx) => {
            const expanded = openFaq === idx;
            return (
              <div
                key={item.q}
                className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(expanded ? null : idx)}
                  aria-expanded={expanded}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-[14.5px] font-semibold cursor-pointer"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-[var(--text-muted)] transition-transform ${
                      expanded ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {expanded && (
                  <div className="px-5 pb-4 text-[13.5px] leading-relaxed text-[var(--text-muted)]">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative z-10 border-t border-[var(--border-default)] bg-[var(--bg-secondary)]/60">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16 text-center">
          <h2 className="font-display text-2xl md:text-4xl font-bold tracking-tight">
            {t('Siap membuat video pertama Anda?', 'Ready to create your first video?')}
          </h2>
          <p className="mt-3 text-[15px] text-[var(--text-muted)]">
            {t(
              'Masuk dengan akun Google, isi saldo, dan mulai dari satu ide. Gratis 6 RMToken untuk akun baru.',
              'Sign in with Google, top up your balance, and start from a single idea. Free 6 RMToken for new accounts.'
            )}
          </p>
          <button
            onClick={() => onOpenAuth()}
            className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--accent-amber)] px-8 text-[14px] font-bold text-[var(--accent-text)] shadow-lg shadow-[rgba(242,135,31,.25)] hover:brightness-105 cursor-pointer transition"
          >
            {t('Mulai sekarang', 'Get started')}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[var(--border-default)] bg-[var(--bg-primary)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--accent-amber)] text-[13px] font-extrabold text-[var(--accent-text)]">
                R
              </div>
              <span className="text-[13.5px] text-[var(--text-muted)]">
                © 2026 ReelMotion. {t('Studio konten AI.', 'AI Content Studio.')}
              </span>
            </div>

            <div className="flex flex-wrap gap-5 text-[13px] text-[var(--text-muted)]">
              <button onClick={() => scrollToSection('fitur')} className="hover:text-[var(--text-primary)] cursor-pointer">
                {t('Fitur', 'Features')}
              </button>
              <button onClick={() => scrollToSection('contoh')} className="hover:text-[var(--text-primary)] cursor-pointer">
                {t('Contoh hasil', 'Showcase')}
              </button>
              <button onClick={() => scrollToSection('cara')} className="hover:text-[var(--text-primary)] cursor-pointer">
                {t('Cara kerja', 'How it works')}
              </button>
              <button onClick={() => scrollToSection('harga')} className="hover:text-[var(--text-primary)] cursor-pointer">
                {t('Harga', 'Pricing')}
              </button>
              <button onClick={() => onOpenAuth('video')} className="hover:text-[var(--text-primary)] cursor-pointer">
                Faceless
              </button>
              <button onClick={() => onOpenAuth('motion')} className="hover:text-[var(--text-primary)] cursor-pointer">
                Motion
              </button>
              <button onClick={() => onOpenAuth('clipper')} className="hover:text-[var(--text-primary)] cursor-pointer">
                Autoclipper
              </button>
              <button onClick={() => onOpenAuth('audiobook')} className="hover:text-[var(--text-primary)] cursor-pointer">
                Audiobook
              </button>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-[var(--border-default)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[12px] text-[var(--text-faint)]">
            <div>{t('Dioperasikan oleh FLUXY Digital Studio', 'Operated by FLUXY Digital Studio')}</div>
            <div className="flex flex-wrap gap-4">
              <span>{t('Tentang Kami', 'About Us')}</span>
              <span>{t('Syarat & Ketentuan', 'Terms of Service')}</span>
              <span>{t('Kebijakan Privasi', 'Privacy Policy')}</span>
              <span>{t('Pengembalian Dana', 'Refund Policy')}</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Support Button */}
      <a
        href="https://wa.me/6285119988596?text=Halo%2C%20saya%20ingin%20tanya%20tentang%20ReelMotion"
        target="_blank"
        rel="noreferrer"
        aria-label="Bantuan lewat WhatsApp"
        className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full border border-[var(--border-default)] bg-[var(--bg-card)] px-4 py-2.5 text-[13px] font-semibold text-[var(--text-primary)] shadow-xl hover:border-[var(--accent-amber)] transition"
      >
        <MessageCircle className="h-4 w-4 text-emerald-500" />
        <span>{t('Butuh bantuan?', 'Need help?')}</span>
      </a>

      {/* Bonus Account Dialog */}
      {showBonusModal && (
        <div
          role="dialog"
          aria-label="Bonus akun baru"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
        >
          <div className="relative w-full max-w-md rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-6 shadow-2xl animate-fade-in">
            <button
              onClick={() => setShowBonusModal(false)}
              aria-label="Tutup"
              className="absolute right-4 top-4 rounded-lg p-1.5 text-[var(--text-muted)] hover:bg-[var(--bg-secondary)] cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-amber-bg)] font-display text-xl font-extrabold text-[var(--accent-amber)]">
              6
            </div>

            <h2 className="mt-4 font-display text-xl font-bold">
              {t('Gratis 6 RMToken untuk akun baru', 'Free 6 RMToken for new accounts')}
            </h2>
            <p className="mt-1.5 text-[13.5px] text-[var(--text-muted)]">
              {t(
                'Cukup untuk mencoba ±2 video vertikal pendek - tanpa isi saldo dulu.',
                'Enough to create ~2 short vertical videos - no initial top-up required.'
              )}
            </p>

            <ol className="mt-5 space-y-2.5 text-[13px] text-[var(--text-secondary)]">
              <li className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--bg-secondary)] font-bold text-[11px]">
                  1
                </span>
                {t('Masuk dengan Google - gratis, tanpa kartu.', 'Sign in with Google - free, no card.')}
              </li>
              <li className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--bg-secondary)] font-bold text-[11px]">
                  2
                </span>
                {t('Verifikasi WhatsApp sekali di Beranda.', 'Verify WhatsApp once on the Dashboard.')}
              </li>
              <li className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--bg-secondary)] font-bold text-[11px]">
                  3
                </span>
                {t('Bonus masuk ke saldo - buat video pertamamu.', 'Bonus enters your wallet - make your first video.')}
              </li>
            </ol>

            <div className="mt-6 flex flex-col gap-2">
              <button
                onClick={() => {
                  setShowBonusModal(false);
                  onOpenAuth();
                }}
                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent-amber)] text-[13px] font-bold text-[var(--accent-text)] cursor-pointer"
              >
                {t('Daftar & ambil bonus', 'Sign up & claim bonus')}
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => setShowBonusModal(false)}
                className="h-9 w-full rounded-xl text-[12.5px] font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                {t('Nanti saja', 'Maybe later')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
