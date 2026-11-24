import React, { useState } from 'react';
import {
  LayoutDashboard,
  Clapperboard,
  MonitorPlay,
  Headphones,
  Scissors,
  Sparkles,
  Coins,
  CreditCard,
  Gift,
  Film,
  Share2,
  Bot,
  LogOut,
  Sun,
  Moon,
  Plus,
  Play,
  CheckCircle2,
  ArrowDownLeft,
  ArrowUpRight,
  QrCode,
  Copy,
  Check,
  Users,
  Youtube,
  Send,
  Menu,
  X,
  Megaphone,
} from 'lucide-react';
import {
  Lang,
  Theme,
  StudioTab,
  AutoContentMode,
  VideoJob,
  TokenLedgerEntry,
  SHOWCASE_VIDEOS,
} from '../data/mockData';
import { AutoVideoStudio } from './AutoVideoStudio';

interface StudioDashboardProps {
  lang: Lang;
  setLang: (l: Lang) => void;
  theme: Theme;
  toggleTheme: () => void;
  userEmail: string;
  userName: string;
  isAdmin: boolean;
  setIsAdmin: (v: boolean) => void;
  walletBalance: number;
  jobs: VideoJob[];
  ledger: TokenLedgerEntry[];
  activeTab: StudioTab;
  setActiveTab: (tab: StudioTab) => void;
  initialAutoMode: AutoContentMode;
  setInitialAutoMode: (m: AutoContentMode) => void;
  onCreateJob: (job: VideoJob, cost: number) => void;
  onTopUpSuccess: (tokensAdded: number, pkgName: string, priceRp: number) => void;
  onRedeemVoucher: (code: string) => boolean;
  onSignOut: () => void;
}

export const StudioDashboard: React.FC<StudioDashboardProps> = ({
  lang,
  setLang,
  theme,
  toggleTheme,
  userEmail,
  userName,
  walletBalance,
  jobs,
  ledger,
  activeTab,
  setActiveTab,
  initialAutoMode,
  setInitialAutoMode,
  onCreateJob,
  onTopUpSuccess,
  onRedeemVoucher,
  onSignOut,
}) => {
  const isEn = lang === 'en';
  const t = (id: string, en: string) => (isEn ? en : id);

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [initialFormat, setInitialFormat] = useState<'9:16' | '16:9'>('9:16');
  const [ledgerFilter, setLedgerFilter] = useState<'semua' | 'masuk' | 'pakai'>('semua');
  const [voucherInput, setVoucherInput] = useState('');
  const [voucherMsg, setVoucherMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState<{
    id: string;
    name: string;
    tokens: number;
    bonus: number;
    price: number;
  } | null>(null);
  const [paymentDone, setPaymentDone] = useState(false);
  const [playingShowcaseId, setPlayingShowcaseId] = useState<string | null>(null);
  const [watchSeconds, setWatchSeconds] = useState(24);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<
    { role: 'user' | 'assistant'; text: string }[]
  >([
    {
      role: 'assistant',
      text: 'Halo! Saya Asisten Penulis Naskah ReelMotion. Anda bisa meminta ide topik video viral, kalimat pembuka 3 detik (hook), atau naskah iklan produk siap pakai.',
    },
  ]);

  const launchAutoVideo = (mode: AutoContentMode, fmt: '9:16' | '16:9' = '9:16') => {
    setInitialAutoMode(mode);
    setInitialFormat(fmt);
    setActiveTab('auto-video');
    setMobileSidebarOpen(false);
  };

  const hour = new Date().getHours();
  const greeting = isEn
    ? hour < 12
      ? 'Good morning'
      : hour < 18
      ? 'Good afternoon'
      : 'Good evening'
    : hour >= 4 && hour < 11
    ? 'Selamat pagi'
    : hour >= 11 && hour < 15
    ? 'Selamat siang'
    : hour >= 15 && hour < 18
    ? 'Selamat sore'
    : 'Selamat malam';

  // Prapancha Full Left Sidebar Menu Items
  const navItems: {
    id: StudioTab;
    label: string;
    icon: React.ReactNode;
    badge?: string;
  }[] = [
    { id: 'dashboard', label: t('Beranda', 'Dashboard'), icon: <LayoutDashboard className="h-4 w-4" /> },
    {
      id: 'auto-video',
      label: t('Auto Konten', 'Auto Content'),
      icon: <Clapperboard className="h-4 w-4" />,
      badge: 'Studio',
    },
    { id: 'my-tokens', label: t('Saldo Credit', 'Credit Wallet'), icon: <Coins className="h-4 w-4" /> },
    { id: 'payment', label: t('Isi Saldo', 'Top Up'), icon: <CreditCard className="h-4 w-4" />, badge: 'X3' },
    { id: 'token-gratis', label: t('Credit Gratis', 'Free Credits'), icon: <Gift className="h-4 w-4" /> },
    { id: 'galeri', label: t('Galeri Video', 'Video Gallery'), icon: <Film className="h-4 w-4" /> },
    { id: 'etalase', label: t('Etalase Tonton', 'Watch & Earn'), icon: <Play className="h-4 w-4" /> },
    { id: 'my-sosmed', label: t('Media Sosial', 'Social Media'), icon: <Share2 className="h-4 w-4" /> },
    { id: 'auto-iklan', label: t('Template Iklan', 'Ad Templates'), icon: <Megaphone className="h-4 w-4" /> },
    { id: 'karyawan-chat', label: t('Asisten Naskah', 'Script Assistant'), icon: <Bot className="h-4 w-4" /> },
  ];

  const handleVoucherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!voucherInput.trim()) return;
    const ok = onRedeemVoucher(voucherInput.trim().toUpperCase());
    if (ok) {
      setVoucherMsg({
        text: t(
          'Voucher berhasil ditukar! +10 Credit sudah masuk ke saldo Anda.',
          'Voucher redeemed! +10 Credit added to your wallet.'
        ),
        ok: true,
      });
      setVoucherInput('');
    } else {
      setVoucherMsg({
        text: t(
          'Kode voucher tidak ditemukan. Coba kode: FLUXY10 atau REEL2026',
          'Invalid voucher code. Try: FLUXY10 or REEL2026'
        ),
        ok: false,
      });
    }
  };

  const handleChatSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const msg = chatInput.trim();
    setChatHistory((prev) => [...prev, { role: 'user', text: msg }]);
    setChatInput('');
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, lang }),
      });
      const data = await res.json();
      setChatHistory((prev) => [
        ...prev,
        {
          role: 'assistant',
          text:
            data.reply ||
            `Berikut rancangan naskah untuk "${msg}". Klik menu "Auto Konten" untuk langsung menjadikannya video siap tayang!`,
        },
      ]);
    } catch {
      setChatHistory((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: `Berikut rancangan hook & struktur naskah untuk "${msg}":\n\n1. Pembuka (0–3 dtk): Kalimat tajam yang menahan perhatian penonton.\n2. Isi Utama (3–22 dtk): 3 poin utama yang jelas dan ringkas.\n3. Penutup (22–30 dtk): Ajakan singkat di akhir video.`,
        },
      ]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[var(--bg-primary)] text-[var(--text-primary)] font-body">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between border-b border-[var(--border-default)] bg-[var(--bg-card)] px-4 h-14 sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <img src="/logo-mark.png" alt="ReelMotion" className="h-8 w-8 object-contain" />
          <span className="font-display text-[15px] font-bold">ReelMotion</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('my-tokens')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--accent-amber)]/30 bg-[var(--accent-amber-bg)] px-2.5 py-1 text-[12px] font-mono font-bold text-[var(--text-primary)]"
          >
            <Coins className="h-3.5 w-3.5 text-[#FFA143]" />
            {walletBalance}
          </button>
          <button
            onClick={() => setMobileSidebarOpen((v) => !v)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border-default)]"
          >
            {mobileSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Left Sidebar (Prapancha Layout + Vision Eye Logo + Sovereign Palette) */}
      <aside
        className={`${
          mobileSidebarOpen ? 'fixed inset-0 z-40 block bg-[var(--bg-secondary)]' : 'hidden'
        } md:sticky md:top-0 md:flex md:h-screen md:w-64 md:shrink-0 flex-col justify-between border-r border-[var(--border-default)] bg-[var(--bg-secondary)] p-4 overflow-y-auto`}
      >
        <div className="space-y-5">
          {/* Brand Logo */}
          <div className="flex items-center justify-between px-2 pt-1">
            <div className="flex items-center gap-2.5">
              <img src="/logo-mark.png" alt="ReelMotion" className="h-9 w-9 object-contain" />
              <div>
                <div className="font-display text-[16px] font-extrabold leading-none">
                  ReelMotion
                </div>
                <div className="mt-0.5 text-[11px] font-medium text-[var(--text-muted)]">
                  Content Studio
                </div>
              </div>
            </div>
            {mobileSidebarOpen && (
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="md:hidden rounded-lg p-1 text-[var(--text-muted)]"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Shared Wallet Pill */}
          <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-3.5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                {t('Saldo Credit', 'Credit Balance')}
              </span>
              <span className="rounded-full bg-[var(--success-bg)] px-2 py-0.5 text-[10px] font-extrabold text-[var(--success)]">
                X3 PROMO
              </span>
            </div>
            <div className="mt-1.5 flex items-baseline justify-between">
              <div className="flex items-center gap-1.5 font-mono text-2xl font-extrabold">
                <Coins className="h-5 w-5 text-[#FFA143]" />
                <span>{walletBalance}</span>
              </div>
              <button
                onClick={() => {
                  setActiveTab('payment');
                  setMobileSidebarOpen(false);
                }}
                className="inline-flex items-center gap-1 rounded-lg bg-[var(--accent-amber)] px-2.5 py-1 text-[11.5px] font-bold text-[var(--accent-text)] hover:brightness-105 cursor-pointer"
              >
                <Plus className="h-3 w-3" />
                {t('Isi', 'Top up')}
              </button>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileSidebarOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-[13px] font-medium transition cursor-pointer ${
                    active
                      ? 'bg-[var(--accent-amber)] text-[var(--accent-text)] font-semibold shadow-sm'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={active ? 'text-white' : 'text-[var(--accent-amber)]'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        active
                          ? 'bg-white/20 text-white'
                          : 'bg-[var(--accent-amber-bg)] text-[var(--accent-amber)]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Profile & Controls */}
        <div className="mt-6 border-t border-[var(--border-default)] pt-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] overflow-hidden">
              <button
                onClick={() => setLang('id')}
                className={`px-2.5 py-1 text-[11px] font-bold uppercase cursor-pointer ${
                  lang === 'id'
                    ? 'bg-[var(--accent-amber)] text-[var(--accent-text)]'
                    : 'text-[var(--text-faint)]'
                }`}
              >
                id
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-2.5 py-1 text-[11px] font-bold uppercase cursor-pointer ${
                  lang === 'en'
                    ? 'bg-[var(--accent-amber)] text-[var(--accent-text)]'
                    : 'text-[var(--text-faint)]'
                }`}
              >
                en
              </button>
            </div>

            <button
              onClick={toggleTheme}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] cursor-pointer"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 text-[#FFA143]" />
              ) : (
                <Moon className="h-4 w-4 text-[var(--accent-amber)]" />
              )}
            </button>

            <button
              onClick={onSignOut}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] py-1.5 text-[12px] font-semibold text-[var(--text-muted)] hover:text-[var(--danger)] cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              {t('Keluar', 'Sign out')}
            </button>
          </div>

          <div className="px-1 text-[11.5px] text-[var(--text-muted)] truncate">
            {userName} · {userEmail}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="relative flex-1 md:h-screen md:overflow-y-auto p-5 sm:p-8 lg:p-10">
        {/* TAB 1: USER DASHBOARD (BERANDA - Prapancha Layout + Sovereign Palette) */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fade-in">
            {/* Greeting & Quick Wallet */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-default)] pb-6">
              <div>
                <div className="text-[12px] font-bold uppercase tracking-wider text-[var(--accent-amber)]">
                  REELMOTION STUDIO
                </div>
                <h1 className="mt-1 font-display text-2xl sm:text-3xl font-bold tracking-tight">
                  {greeting}, {userName}!
                </h1>
                <p className="mt-1 text-[13.5px] text-[var(--text-muted)]">
                  {t(
                    'Pilih alat di bawah untuk membuat video baru dari satu topik atau tautan.',
                    'Choose a tool below to create a new video from a single topic or link.'
                  )}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] px-4 py-2.5 shadow-sm">
                  <div className="text-[11px] text-[var(--text-muted)]">
                    {t('Video Selesai', 'Completed Videos')}
                  </div>
                  <div className="font-mono text-xl font-bold">{jobs.length}</div>
                </div>
                <div className="rounded-2xl bg-[var(--accent-amber)] text-white px-4 py-2.5 shadow-md">
                  <div className="text-[11px] text-white/80">
                    {t('Saldo Aktif', 'Active Balance')}
                  </div>
                  <div className="font-mono text-xl font-bold">
                    {walletBalance} Credit
                  </div>
                </div>
              </div>
            </div>

            {/* 5 Quick Launch Feature Cards (Prapancha UserDashboard Layout) */}
            <div>
              <h2 className="font-display text-lg font-bold mb-3">
                {t('Buat Video Baru', 'Create New Video')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    title: t('Faceless vertikal', 'Faceless vertical'),
                    tag: '9:16',
                    desc: t(
                      'Gambar ilustrasi + suara narator, tanpa tampil wajah. Untuk TikTok, Reels, dan YouTube Shorts.',
                      'Illustrated visuals + narrator voice, no face needed. For TikTok, Reels, and YouTube Shorts.'
                    ),
                    icon: <Clapperboard className="h-5 w-5 text-[var(--accent-amber)]" />,
                    onClick: () => launchAutoVideo('video', '9:16'),
                  },
                  {
                    title: t('Faceless horizontal', 'Faceless horizontal'),
                    tag: '16:9',
                    desc: t(
                      'Gambar ilustrasi + suara narator untuk YouTube: dokumenter, sejarah, dan edukasi per bab.',
                      'Illustrated visuals + narrator voice for YouTube: documentaries, history, and chaptered explainers.'
                    ),
                    icon: <MonitorPlay className="h-5 w-5 text-[var(--accent-amber)]" />,
                    onClick: () => launchAutoVideo('video', '16:9'),
                  },
                  {
                    title: t('Motion Graphic', 'Motion Graphics'),
                    tag: '10s–120s',
                    desc: t(
                      'Video animasi grafis bergerak: teks, ikon, grafik, dan tokoh untuk iklan & penjelasan.',
                      'Animated motion-graphics video: moving text, icons, charts, and characters for ads & explainers.'
                    ),
                    icon: <Sparkles className="h-5 w-5 text-[var(--accent-amber)]" />,
                    onClick: () => launchAutoVideo('motion', '9:16'),
                  },
                  {
                    title: 'AudioBook',
                    tag: t('Narasi', 'Narration'),
                    desc: t(
                      'Naskah buku atau novel dibacakan narator per episode dengan sorot teks per kata.',
                      'Book manuscripts or novels narrated per episode with word-by-word highlighted text.'
                    ),
                    icon: <Headphones className="h-5 w-5 text-[var(--accent-amber)]" />,
                    onClick: () => launchAutoVideo('audiobook', '16:9'),
                  },
                  {
                    title: 'AutoClipper',
                    tag: t('Klip', 'Clips'),
                    desc: t(
                      'Tempel tautan video YouTube panjang dan potong otomatis menjadi beberapa klip vertikal.',
                      'Paste a long YouTube link and automatically slice it into several vertical short clips.'
                    ),
                    icon: <Scissors className="h-5 w-5 text-[var(--accent-amber)]" />,
                    onClick: () => launchAutoVideo('clipper', '9:16'),
                  },
                ].map((card) => (
                  <button
                    key={card.title}
                    onClick={card.onClick}
                    className="group flex flex-col justify-between rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5 text-left transition hover:-translate-y-0.5 hover:border-[var(--accent-amber)] hover:shadow-lg cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-amber-bg)]">
                          {card.icon}
                        </div>
                        <span className="rounded-full border border-[var(--border-default)] bg-[var(--bg-secondary)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--text-muted)]">
                          {card.tag}
                        </span>
                      </div>
                      <h3 className="mt-4 font-display text-[16px] font-bold">{card.title}</h3>
                      <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--text-muted)]">
                        {card.desc}
                      </p>
                    </div>
                    <div className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] font-bold text-[var(--accent-amber)]">
                      <span>{t('Buka studio', 'Open studio')}</span>
                      <span>→</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Videos Summary */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-bold">
                  {t('Video Terakhir Anda', 'Your Recent Videos')}
                </h2>
                <button
                  onClick={() => setActiveTab('auto-video')}
                  className="text-[12.5px] font-semibold text-[var(--accent-amber)] hover:underline cursor-pointer"
                >
                  {t('Lihat semua di Auto Konten →', 'View all in Auto Content →')}
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {jobs.slice(0, 3).map((job) => (
                  <div
                    key={job.id}
                    onClick={() => setActiveTab('auto-video')}
                    className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-4 hover:border-[var(--border-hover)] shadow-sm cursor-pointer transition"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="inline-flex items-center gap-1 rounded-full bg-[var(--success-bg)] px-2.5 py-0.5 font-bold text-[var(--success)]">
                        <CheckCircle2 className="h-3 w-3" />
                        {t('Selesai', 'Finished')}
                      </span>
                      <span className="font-mono text-[var(--text-muted)]">
                        {job.mode} · {job.format}
                      </span>
                    </div>
                    <h3 className="mt-2.5 font-display text-[14.5px] font-bold line-clamp-1">
                      {job.topic}
                    </h3>
                    <p className="mt-1 text-[12px] text-[var(--text-muted)] line-clamp-2">
                      {job.scriptPreview}
                    </p>
                    <div className="mt-3 text-[11px] text-[var(--text-faint)]">{job.createdAt}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AUTO VIDEO STUDIO */}
        {activeTab === 'auto-video' && (
          <AutoVideoStudio
            lang={lang}
            initialMode={initialAutoMode}
            initialFormat={initialFormat}
            jobs={jobs}
            walletBalance={walletBalance}
            onCreateJob={onCreateJob}
            onOpenTopUp={() => setActiveTab('payment')}
          />
        )}

        {/* TAB 3: TOKEN WALLET */}
        {activeTab === 'my-tokens' && (
          <div data-token-wallet-page="true" className="space-y-6 animate-fade-in">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-default)] pb-5">
              <div>
                <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
                  {t('Saldo & Riwayat Credit', 'Credit Wallet & Ledger')}
                </h1>
                <p className="mt-1 text-[13.5px] text-[var(--text-muted)]">
                  {t(
                    'Setiap credit yang masuk dan terpakai tercatat transparan per tahap pembuatan.',
                    'Every credit added or spent is recorded transparently per pipeline stage.'
                  )}
                </p>
              </div>
              <button
                onClick={() => setActiveTab('payment')}
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-[var(--accent-amber)] px-5 text-[13px] font-bold text-[var(--accent-text)] cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                {t('Isi Saldo Credit', 'Top Up Credit')}
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-[var(--accent-amber)] text-white p-5 shadow-md">
                <div className="text-[12px] font-medium text-white/80">
                  {t('Saldo Tersedia', 'Available Balance')}
                </div>
                <div className="mt-2 font-mono text-3xl font-extrabold">
                  {walletBalance} Credit
                </div>
                <div className="mt-1 text-[12px] text-white/80">
                  ≈ Rp{(walletBalance * 1000).toLocaleString('id-ID')} · {t('Tidak pernah hangus', 'Never expires')}
                </div>
              </div>

              <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5 shadow-sm">
                <div className="text-[12px] font-semibold text-[var(--text-muted)]">
                  {t('Sedang Ditahan (Tahap Aktif)', 'Currently Held')}
                </div>
                <div className="mt-2 font-mono text-3xl font-extrabold">0 Credit</div>
                <div className="mt-1 text-[12px] text-[var(--text-muted)]">
                  {t('Otomatis kembali bila tahap gagal', 'Released automatically if stage fails')}
                </div>
              </div>

              <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5 shadow-sm">
                <div className="text-[12px] font-semibold text-[var(--text-muted)]">
                  {t('Pemakaian 30 Hari Terakhir', 'Last 30 Days Usage')}
                </div>
                <div className="mt-2 font-mono text-3xl font-extrabold">
                  {ledger.filter((x) => x.delta < 0).reduce((a, b) => a + Math.abs(b.delta), 0)} Credit
                </div>
                <div className="mt-1 text-[12px] text-[var(--text-muted)]">
                  {jobs.length} {t('video selesai', 'videos completed')}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5 space-y-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-display text-lg font-bold">
                  {t('Catatan Mutasi Credit', 'Credit Transaction Ledger')}
                </h2>
                <div className="flex gap-1 rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] p-1">
                  {(
                    [
                      { id: 'semua', label: t('Semua', 'All') },
                      { id: 'masuk', label: t('Credit Masuk', 'Added') },
                      { id: 'pakai', label: t('Pemakaian', 'Spent') },
                    ] as const
                  ).map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setLedgerFilter(f.id)}
                      className={`rounded-lg px-3 py-1 text-[12px] font-semibold cursor-pointer ${
                        ledgerFilter === f.id
                          ? 'bg-[var(--accent-amber)] text-[var(--accent-text)]'
                          : 'text-[var(--text-muted)]'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="divide-y divide-[var(--border-default)]">
                {ledger
                  .filter((row) =>
                    ledgerFilter === 'masuk'
                      ? row.delta > 0
                      : ledgerFilter === 'pakai'
                      ? row.delta < 0
                      : true
                  )
                  .map((row) => {
                    const positive = row.delta > 0;
                    return (
                      <div
                        key={row.id}
                        className="flex items-center justify-between gap-4 py-3.5 text-[13px]"
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                              positive
                                ? 'bg-[var(--success-bg)] text-[var(--success)]'
                                : 'bg-[var(--danger-bg)] text-[var(--danger)]'
                            }`}
                          >
                            {positive ? (
                              <ArrowDownLeft className="h-4 w-4" />
                            ) : (
                              <ArrowUpRight className="h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-[var(--text-primary)]">
                              {row.title}
                            </div>
                            <div className="text-[12px] text-[var(--text-muted)]">
                              {row.stage} · {row.createdAt}
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div
                            className={`font-mono font-bold ${
                              positive ? 'text-[var(--success)]' : 'text-[var(--danger)]'
                            }`}
                          >
                            {positive ? `+${row.delta}` : row.delta} Credit
                          </div>
                          <div className="font-mono text-[11px] text-[var(--text-faint)]">
                            {t('Saldo:', 'Balance:')} {row.balanceAfter}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PAYMENT / TOP UP */}
        {activeTab === 'payment' && (
          <div className="space-y-6 animate-fade-in max-w-4xl">
            <div className="border-b border-[var(--border-default)] pb-5">
              <div className="text-[12px] font-bold uppercase tracking-wider text-[var(--accent-amber)]">
                QRIS & TRANSFER OTOMATIS
              </div>
              <h1 className="mt-1 font-display text-2xl sm:text-3xl font-bold tracking-tight">
                {t('Isi Saldo Credit', 'Top Up Credit Balance')}
              </h1>
              <p className="mt-1 text-[13.5px] text-[var(--text-muted)]">
                {t(
                  'Promo X3 Credit aktif: dapatkan +200% bonus credit langsung masuk ke saldo begitu QRIS terbayar.',
                  'Promo X3 Credit active: get +200% bonus credits credited immediately upon QRIS payment.'
                )}
              </p>
            </div>

            {paymentDone && selectedPkg ? (
              <div
                data-pakasir-status="lunas"
                className="max-w-xl mx-auto rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-8 text-center space-y-4 shadow-sm"
              >
                <CheckCircle2 className="w-12 h-12 text-[var(--success)] mx-auto" />
                <h3 className="text-lg font-display font-bold text-[var(--text-primary)]">
                  {t('Pembayaran diterima!', 'Payment received!')}
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  {t(
                    `${selectedPkg.tokens + selectedPkg.bonus} Credit (${selectedPkg.tokens} + ${selectedPkg.bonus} Bonus Promo X3) sudah masuk ke saldo Anda.`,
                    `${selectedPkg.tokens + selectedPkg.bonus} Credit (${selectedPkg.tokens} + ${selectedPkg.bonus} X3 Promo Bonus) have been added to your balance.`
                  )}
                </p>
                <button
                  onClick={() => {
                    setPaymentDone(false);
                    setSelectedPkg(null);
                    setActiveTab('auto-video');
                  }}
                  className="h-10 px-6 rounded-xl bg-[var(--accent-amber)] text-[var(--accent-text)] text-sm font-bold cursor-pointer"
                >
                  {t('Mulai Buat Video', 'Start Creating Videos')}
                </button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  { id: 't20', name: '20 Credit', tokens: 20, bonus: 40, price: 20000, eq: 6 },
                  {
                    id: 't50',
                    name: '50 Credit',
                    tokens: 50,
                    bonus: 100,
                    price: 50000,
                    eq: 16,
                    popular: true,
                  },
                  { id: 't100', name: '100 Credit', tokens: 100, bonus: 200, price: 100000, eq: 33 },
                ].map((pkg) => (
                  <div
                    key={pkg.id}
                    className={`rounded-2xl border p-6 flex flex-col justify-between ${
                      pkg.popular
                        ? 'border-[var(--accent-amber)] bg-[var(--accent-amber)] text-white shadow-xl'
                        : 'border-[var(--border-default)] bg-[var(--bg-card)] shadow-sm'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-display text-lg font-bold">{pkg.name}</span>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                            pkg.popular
                              ? 'bg-[#11C6C2] text-[#181924]'
                              : 'bg-[var(--success-bg)] text-[var(--success)]'
                          }`}
                        >
                          +{pkg.bonus} Bonus
                        </span>
                      </div>
                      <div className="mt-3 font-mono text-2xl font-extrabold">
                        Rp{pkg.price.toLocaleString('id-ID')}
                      </div>
                      <div
                        className={`mt-2 text-[12.5px] font-semibold ${
                          pkg.popular ? 'text-white/90' : 'text-[var(--accent-amber)]'
                        }`}
                      >
                        {t('Total diterima:', 'Total received:')} {pkg.tokens + pkg.bonus} Credit
                      </div>
                      <p
                        className={`mt-1 text-[12px] ${
                          pkg.popular ? 'text-white/75' : 'text-[var(--text-muted)]'
                        }`}
                      >
                        {t(
                          `Cukup untuk ±${pkg.eq * 3} video vertikal pendek dengan Promo X3`,
                          `Enough for ~${pkg.eq * 3} short vertical videos with X3 Promo`
                        )}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedPkg(pkg);
                        onTopUpSuccess(pkg.tokens + pkg.bonus, pkg.name, pkg.price);
                        setPaymentDone(true);
                      }}
                      className={`mt-6 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl text-[13px] font-bold hover:brightness-105 cursor-pointer ${
                        pkg.popular
                          ? 'bg-white text-[var(--accent-amber)]'
                          : 'bg-[var(--accent-amber)] text-[var(--accent-text)]'
                      }`}
                    >
                      <QrCode className="h-4 w-4" />
                      {t('Bayar QRIS Instan', 'Instant QRIS Pay')}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: TOKEN GRATIS */}
        {activeTab === 'token-gratis' && (
          <div data-token-gratis="true" className="max-w-3xl space-y-6 animate-fade-in">
            <div>
              <h1 className="flex items-center gap-2 font-display text-2xl font-bold">
                <Gift className="h-6 w-6 text-[var(--accent-amber)]" />
                {t('Dapatkan Credit Gratis', 'Get Free Credit')}
              </h1>
              <p className="mt-1 text-[13.5px] text-[var(--text-muted)]">
                {t(
                  'Credit bisa didapat tanpa membeli: ambil bonus akun baru, tukar kode voucher, dan ajak teman lewat tautanmu.',
                  'Earn Credit without buying: claim the new-account bonus, redeem a voucher code, or invite friends with your referral link.'
                )}
              </p>
            </div>

            <form
              onSubmit={handleVoucherSubmit}
              className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5 space-y-3 shadow-sm"
            >
              <h3 className="font-display text-[15px] font-bold">
                {t('Tukar Kode Voucher Promo', 'Redeem Promo Voucher Code')}
              </h3>
              <p className="text-[12.5px] text-[var(--text-muted)]">
                {t(
                  'Masukkan kode voucher (contoh: FLUXY10 atau REEL2026) untuk klaim +10 Credit gratis.',
                  'Enter a voucher code (e.g. FLUXY10 or REEL2026) to claim +10 free Credits.'
                )}
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={voucherInput}
                  onChange={(e) => setVoucherInput(e.target.value)}
                  placeholder="FLUXY10"
                  className="flex-1 rounded-xl border border-[var(--border-default)] bg-[var(--bg-input)] px-3.5 py-2 text-[13.5px] font-mono uppercase focus:border-[var(--accent-amber)] focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-[var(--accent-amber)] px-5 py-2 text-[13px] font-bold text-[var(--accent-text)] cursor-pointer"
                >
                  {t('Tukar Voucher', 'Redeem')}
                </button>
              </div>
              {voucherMsg && (
                <p
                  className={`text-[12.5px] font-medium ${
                    voucherMsg.ok ? 'text-[var(--success)]' : 'text-[var(--danger)]'
                  }`}
                >
                  {voucherMsg.text}
                </p>
              )}
            </form>

            <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-[15px] font-bold flex items-center gap-2">
                  <Users className="h-4 w-4 text-[var(--accent-amber)]" />
                  {t('Tautan Ajak Teman (?ajak=FLUXY88)', 'Friend Referral Link (?ajak=FLUXY88)')}
                </h3>
                <span className="rounded-full bg-[var(--success-bg)] px-2.5 py-0.5 text-[11px] font-bold text-[var(--success)]">
                  +6 Credit / {t('Teman', 'Friend')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value="https://reelmotion-iota.vercel.app/?ajak=FLUXY88"
                  className="flex-1 rounded-xl border border-[var(--border-default)] bg-[var(--bg-input)] px-3.5 py-2 text-[12.5px] font-mono text-[var(--text-secondary)]"
                />
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText('https://reelmotion-iota.vercel.app/?ajak=FLUXY88');
                    setCopiedRef(true);
                    setTimeout(() => setCopiedRef(false), 2000);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--accent-amber)] text-[var(--accent-text)] px-4 py-2 text-[12.5px] font-semibold cursor-pointer"
                >
                  {copiedRef ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedRef ? t('Tersalin', 'Copied') : t('Salin', 'Copy')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: GALERI VIDEO */}
        {activeTab === 'galeri' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-default)] pb-5">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-widest text-[var(--accent-amber)]">
                  GALERI CHANNEL REELMOTION
                </div>
                <h1 className="mt-1 font-display text-2xl font-bold">
                  {t('Contoh Channel yang Dibuat dengan ReelMotion', 'Channels Created with ReelMotion')}
                </h1>
              </div>
              <a
                href="https://www.youtube.com/@wangsamaya"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] px-4 py-2 text-[13px] font-semibold hover:border-[var(--accent-amber)]"
              >
                <Youtube className="h-4 w-4 text-red-500" />
                <span>@wangsamaya</span>
              </a>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {SHOWCASE_VIDEOS.map((vid) => (
                <div
                  key={vid.id}
                  className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-3 shadow-sm"
                >
                  <div
                    className="relative w-full overflow-hidden rounded-xl bg-black"
                    style={{ aspectRatio: '16 / 9' }}
                  >
                    {playingShowcaseId === vid.id ? (
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
                        onClick={() => setPlayingShowcaseId(vid.id)}
                        className="group absolute inset-0 h-full w-full cursor-pointer"
                      >
                        <img
                          src={`https://i.ytimg.com/vi/${vid.youtubeId}/hqdefault.jpg`}
                          alt={vid.title}
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                        <span className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[var(--accent-amber)] shadow-lg">
                            <Play className="ml-0.5 h-5 w-5 fill-current" />
                          </span>
                        </span>
                      </button>
                    )}
                  </div>
                  <div className="pt-3 px-1 flex items-center justify-between">
                    <div>
                      <div className="text-[11px] font-semibold text-[var(--accent-amber)]">
                        {isEn ? vid.tagEn : vid.tagId}
                      </div>
                      <h3 className="font-display text-[15px] font-bold">{vid.title}</h3>
                    </div>
                    <button
                      onClick={() => launchAutoVideo(vid.id.startsWith('m') ? 'motion' : 'video', vid.ratio)}
                      className="rounded-lg bg-[var(--accent-amber)] text-[var(--accent-text)] px-3 py-1.5 text-[12px] font-semibold cursor-pointer transition"
                    >
                      {t('Buat serupa', 'Make similar')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: ETALASE */}
        {activeTab === 'etalase' && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-[var(--border-default)] pb-5">
              <div className="text-[11px] font-bold uppercase tracking-widest text-[var(--accent-amber)]">
                ETALASE KOMUNITAS
              </div>
              <h1 className="mt-1 font-display text-2xl font-bold">
                {t('Tonton Video Kreator → Kumpulkan Poin → Jadi Credit', 'Watch Creator Videos → Earn Points → Convert to Credit')}
              </h1>
            </div>

            <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5 flex flex-wrap items-center justify-between gap-4 shadow-sm">
              <div>
                <div className="text-[12px] font-semibold text-[var(--text-muted)]">
                  {t('Waktu Tonton Terverifikasi Hari Ini', 'Verified Watch Time Today')}
                </div>
                <div className="mt-1 font-mono text-2xl font-extrabold">
                  {watchSeconds} {t('detik', 'seconds')} · +2 Credit
                </div>
              </div>
              <button
                onClick={() => {
                  setWatchSeconds((s) => s + 30);
                  onTopUpSuccess(2, 'Klaim Imbalan Etalase Tonton', 0);
                }}
                className="rounded-xl bg-[var(--accent-amber)] px-5 py-2.5 text-[13px] font-bold text-[var(--accent-text)] cursor-pointer"
              >
                {t('Tonton 30d & Klaim +2 Credit', 'Watch 30s & Claim +2 Credit')}
              </button>
            </div>
          </div>
        )}

        {/* TAB 8: MEDIA SOSIAL */}
        {activeTab === 'my-sosmed' && (
          <div className="space-y-6 animate-fade-in max-w-4xl">
            <div className="border-b border-[var(--border-default)] pb-5">
              <h1 className="font-display text-2xl font-bold">
                {t('Sambungan Media Sosial & Auto-Publish', 'Connected Social Accounts & Auto-Publish')}
              </h1>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  name: 'YouTube Channel',
                  desc: t('Unggah otomatis video 16:9 & Shorts 9:16 lengkap dengan judul, deskripsi, dan tag.', 'Auto-upload 16:9 videos & 9:16 Shorts.'),
                  connected: true,
                  handle: '@wangsamaya (Terhubung)',
                },
                {
                  name: 'TikTok Creator',
                  desc: t('Kirim ke kotak masuk TikTok atau posting langsung.', 'Send to TikTok inbox or direct post.'),
                  connected: true,
                  handle: '@reelmotion.id (Terhubung)',
                },
                {
                  name: 'Instagram Reels',
                  desc: t('Video tegak 9:16 diunggah otomatis sebagai Reels.', 'Vertical 9:16 videos posted as Reels.'),
                  connected: false,
                  handle: t('Belum tersambung', 'Not connected'),
                },
                {
                  name: 'Facebook Page',
                  desc: t('Terbitkan video secara terjadwal ke Halaman Facebook Anda.', 'Publish scheduled videos to your Facebook Page.'),
                  connected: false,
                  handle: t('Belum tersambung', 'Not connected'),
                },
              ].map((soc) => (
                <div
                  key={soc.name}
                  className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5 flex flex-col justify-between gap-4 shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-[16px] font-bold">{soc.name}</h3>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                          soc.connected
                            ? 'bg-[var(--success-bg)] text-[var(--success)]'
                            : 'bg-[var(--danger-bg)] text-[var(--danger)]'
                        }`}
                      >
                        {soc.handle}
                      </span>
                    </div>
                    <p className="mt-2 text-[12.5px] text-[var(--text-muted)]">{soc.desc}</p>
                  </div>
                  <button
                    onClick={() => alert(`${soc.name} OAuth flow triggered`)}
                    className="h-9 rounded-xl bg-[var(--accent-amber)] px-4 text-[12.5px] font-semibold text-[var(--accent-text)] cursor-pointer"
                  >
                    {soc.connected
                      ? t('Atur Jadwal Unggah Otomatis', 'Configure Auto-Upload Schedule')
                      : t('+ Sambungkan Akun', '+ Connect Account')}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 9: TEMPLATE IKLAN */}
        {activeTab === 'auto-iklan' && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-[var(--border-default)] pb-5">
              <h1 className="font-display text-2xl font-bold">
                {t('Template Iklan Produk Siap Pakai', 'Ready-to-Use Product Ad Templates')}
              </h1>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                {
                  title: 'Sorotan Produk & Diskon',
                  desc: 'Tampilkan foto produk unggulan dengan lencana harga diskon dan ajakan membeli.',
                },
                {
                  title: 'Percakapan Pelanggan',
                  desc: 'Animasi tanya-jawab singkat pelanggan yang menunjukkan keunggulan utama produk Anda.',
                },
                {
                  title: 'Perbandingan Sebelum & Sesudah',
                  desc: 'Tampilkan masalah sehari-hari dan bagaimana produk Anda menjadi solusinya.',
                },
              ].map((arch) => (
                <div
                  key={arch.title}
                  className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5 space-y-3 shadow-sm"
                >
                  <h3 className="font-display text-[15px] font-bold text-[var(--accent-amber)]">
                    {arch.title}
                  </h3>
                  <p className="text-[12.5px] text-[var(--text-muted)]">{arch.desc}</p>
                  <button
                    onClick={() => launchAutoVideo('motion', '9:16')}
                    className="w-full rounded-xl bg-[var(--accent-amber)] text-[var(--accent-text)] py-2 text-[12px] font-bold cursor-pointer transition"
                  >
                    {t('Gunakan Template di Studio Motion', 'Use Template in Motion Studio')}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 10: ASISTEN NASKAH */}
        {activeTab === 'karyawan-chat' && (
          <div className="space-y-5 animate-fade-in max-w-4xl">
            <div className="border-b border-[var(--border-default)] pb-4">
              <h1 className="font-display text-2xl font-bold">
                {t('Asisten Penulis Naskah & Ide Konten', 'Scriptwriting & Content Idea Assistant')}
              </h1>
            </div>

            <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-4 sm:p-5 space-y-4 shadow-sm">
              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {chatHistory.map((m, i) => (
                  <div
                    key={i}
                    className={`rounded-2xl p-4 text-[13.5px] whitespace-pre-line ${
                      m.role === 'user'
                        ? 'ml-auto max-w-xl bg-[var(--accent-amber)] text-[var(--accent-text)] font-medium'
                        : 'mr-auto max-w-2xl border border-[var(--border-default)] bg-[var(--bg-secondary)] text-[var(--text-primary)]'
                    }`}
                  >
                    {m.text}
                  </div>
                ))}
              </div>

              <form onSubmit={handleChatSend} className="flex gap-2 pt-2 border-t border-[var(--border-default)]">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={t(
                    'Tanyakan ide konten viral, naskah iklan, atau riset topik...',
                    'Ask for viral content ideas, ad scripts, or topic research...'
                  )}
                  className="flex-1 rounded-xl border border-[var(--border-default)] bg-[var(--bg-input)] px-3.5 py-2.5 text-[13.5px] focus:border-[var(--accent-amber)] focus:outline-none"
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--accent-amber)] px-5 py-2.5 text-[13px] font-bold text-[var(--accent-text)] cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                  {t('Kirim', 'Send')}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
