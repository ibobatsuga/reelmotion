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
  Cpu,
  ShieldAlert,
  Settings,
  LogOut,
  Sun,
  Moon,
  Plus,
  Play,
  CheckCircle2,
  Clock,
  ArrowDownLeft,
  ArrowUpRight,
  QrCode,
  Copy,
  Check,
  Users,
  Youtube,
  Instagram,
  Send,
  Terminal,
  Activity,
  Menu,
  X,
  Megaphone,
  Layers,
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
  isAdmin,
  setIsAdmin,
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
    { role: 'user' | 'assistant'; text: string; tool?: string }[]
  >([
    {
      role: 'assistant',
      text: 'Halo! Saya Direktur Kreatif AI ReelMotion (Persona: Content Strategist & Copywriter). Anda bisa meminta riset tren TikTok/YouTube, naskah hook 3 detik, atau membuat dokumen penawaran.',
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

  const navItems: {
    id: StudioTab;
    label: string;
    icon: React.ReactNode;
    adminOnly?: boolean;
    badge?: string;
  }[] = [
    { id: 'dashboard', label: t('Beranda', 'Dashboard'), icon: <LayoutDashboard className="h-4 w-4" /> },
    {
      id: 'auto-video',
      label: t('Auto Konten', 'Auto Content'),
      icon: <Clapperboard className="h-4 w-4" />,
      badge: 'AI',
    },
    { id: 'my-tokens', label: t('Saldo RMToken', 'Token Wallet'), icon: <Coins className="h-4 w-4" /> },
    { id: 'payment', label: t('Isi Saldo', 'Top Up'), icon: <CreditCard className="h-4 w-4" />, badge: 'X3' },
    { id: 'token-gratis', label: t('Token Gratis', 'Free Tokens'), icon: <Gift className="h-4 w-4" /> },
    { id: 'galeri', label: t('Galeri Video', 'Video Gallery'), icon: <Film className="h-4 w-4" /> },
    { id: 'etalase', label: t('Etalase Tonton', 'Watch & Earn'), icon: <Play className="h-4 w-4" /> },
    { id: 'my-sosmed', label: t('Media Sosial', 'Social Media'), icon: <Share2 className="h-4 w-4" /> },
    {
      id: 'auto-iklan',
      label: 'Auto Iklan',
      icon: <Megaphone className="h-4 w-4" />,
      adminOnly: true,
    },
    {
      id: 'karyawan-chat',
      label: t('Karyawan Chat', 'AI Staff Chat'),
      icon: <Bot className="h-4 w-4" />,
      adminOnly: true,
    },
    {
      id: 'gpu-jobs',
      label: 'GPU Jobs (VoxCPM2)',
      icon: <Cpu className="h-4 w-4" />,
      adminOnly: true,
    },
    {
      id: 'agentic',
      label: 'Agentic Studio',
      icon: <Layers className="h-4 w-4" />,
      adminOnly: true,
    },
    {
      id: 'admin-panel',
      label: 'Admin Panel',
      icon: <Settings className="h-4 w-4" />,
      adminOnly: true,
    },
  ];

  const visibleNav = navItems.filter((item) => !item.adminOnly || isAdmin);

  const handleVoucherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!voucherInput.trim()) return;
    const ok = onRedeemVoucher(voucherInput.trim().toUpperCase());
    if (ok) {
      setVoucherMsg({
        text: t(
          'Voucher berhasil ditukar! +10 RMToken sudah masuk ke saldo Anda.',
          'Voucher redeemed! +10 RMToken added to your wallet.'
        ),
        ok: true,
      });
      setVoucherInput('');
    } else {
      setVoucherMsg({
        text: t(
          'Kode voucher tidak ditemukan atau sudah dipakai. Coba kode: FLUXY10 atau REEL2026',
          'Invalid voucher code. Try: FLUXY10 or REEL2026'
        ),
        ok: false,
      });
    }
  };

  const handleChatSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const msg = chatInput.trim();
    setChatHistory((prev) => [...prev, { role: 'user', text: msg }]);
    setChatInput('');
    setTimeout(() => {
      setChatHistory((prev) => [
        ...prev,
        {
          role: 'assistant',
          tool: 'web_search · claude/sonnet/4.6',
          text: `Berikut rancangan hook & struktur naskah untuk "${msg}":\n\n1. Hook (0–3 dtk): Pernyataan kontras yang mematahkan asumsi penonton.\n2. Isi Utama (3–22 dtk): 3 fakta konkret berbasis data riset kredibilitas tinggi.\n3. Ajakan Penutup (22–30 dtk): Kalimat CTA singkat ke kolom komentar atau link di bio.\n\nKlik menu "Auto Konten" untuk langsung mengubah naskah ini menjadi video 9:16!`,
        },
      ]);
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[var(--bg-primary)] text-[var(--text-primary)] font-body">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between border-b border-[var(--border-default)] bg-[var(--bg-card)] px-4 h-14 sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--accent-amber)] text-[14px] font-extrabold text-[var(--accent-text)]">
            R
          </div>
          <span className="font-display text-[15px] font-bold">ReelMotion</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('my-tokens')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--accent-amber)]/40 bg-[var(--accent-amber-bg)] px-2.5 py-1 text-[12px] font-mono font-bold text-[var(--text-primary)]"
          >
            <Coins className="h-3.5 w-3.5 text-[var(--accent-amber)]" />
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

      {/* Left Sidebar */}
      <aside
        className={`${
          mobileSidebarOpen ? 'fixed inset-0 z-40 block bg-[var(--bg-card)]' : 'hidden'
        } md:sticky md:top-0 md:flex md:h-screen md:w-64 md:shrink-0 flex-col justify-between border-r border-[var(--border-default)] bg-[var(--bg-card)] p-4 overflow-y-auto`}
      >
        <div className="space-y-5">
          {/* Brand Logo */}
          <div className="flex items-center justify-between px-2 pt-1">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent-amber)] text-[15px] font-extrabold text-[var(--accent-text)]">
                R
              </div>
              <div>
                <div className="font-display text-[15px] font-bold leading-none">ReelMotion</div>
                <div className="mt-0.5 text-[10.5px] font-mono text-[var(--text-faint)]">
                  FLUXY AI Studio
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
          <div className="rounded-2xl border border-[var(--accent-amber)]/40 bg-[var(--accent-amber-bg)] p-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                {t('Saldo RMToken', 'RMToken Balance')}
              </span>
              <span className="rounded-full bg-[var(--accent-amber)] px-2 py-0.5 text-[10px] font-extrabold text-[var(--accent-text)]">
                X3 PROMO
              </span>
            </div>
            <div className="mt-1.5 flex items-baseline justify-between">
              <div className="flex items-center gap-1.5 font-mono text-2xl font-extrabold">
                <Coins className="h-5 w-5 text-[var(--accent-amber)]" />
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
            {visibleNav.map((item) => {
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
                      ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] font-semibold'
                      : 'text-[var(--text-muted)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={active ? 'text-[var(--accent-amber)]' : ''}>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                        active
                          ? 'bg-[var(--accent-amber)] text-[var(--accent-text)]'
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
          {/* Admin Mode Switcher so user can inspect all 13 reconstructed modules */}
          <label className="flex items-center justify-between rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] px-3 py-2 text-[12px] cursor-pointer">
            <span className="font-medium text-[var(--text-secondary)]">
              {t('Mode Admin (Semua Menu)', 'Admin Mode (All Tools)')}
            </span>
            <input
              type="checkbox"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
              className="accent-[var(--accent-amber)]"
            />
          </label>

          <div className="flex items-center justify-between gap-2">
            <div className="flex rounded-lg border border-[var(--border-default)] overflow-hidden">
              <button
                onClick={() => setLang('id')}
                className={`px-2.5 py-1 text-[11px] font-bold uppercase cursor-pointer ${
                  lang === 'id'
                    ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]'
                    : 'text-[var(--text-faint)]'
                }`}
              >
                id
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-2.5 py-1 text-[11px] font-bold uppercase cursor-pointer ${
                  lang === 'en'
                    ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]'
                    : 'text-[var(--text-faint)]'
                }`}
              >
                en
              </button>
            </div>

            <button
              onClick={toggleTheme}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border-default)] bg-[var(--bg-secondary)] cursor-pointer"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 text-[var(--accent-amber)]" />
              ) : (
                <Moon className="h-4 w-4 text-[var(--accent-amber)]" />
              )}
            </button>

            <button
              onClick={onSignOut}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[var(--border-default)] bg-[var(--bg-secondary)] py-1.5 text-[12px] font-semibold text-[var(--text-muted)] hover:text-[var(--danger)] cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              {t('Keluar', 'Sign out')}
            </button>
          </div>

          <div className="px-1 text-[11.5px] text-[var(--text-faint)] truncate">
            {userName} · {userEmail}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="relative flex-1 md:h-screen md:overflow-y-auto p-5 sm:p-8 lg:p-10">
        {/* TAB 1: USER DASHBOARD (BERANDA) */}
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
                <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] px-4 py-2.5">
                  <div className="text-[11px] text-[var(--text-muted)]">
                    {t('Video Selesai', 'Completed Videos')}
                  </div>
                  <div className="font-mono text-xl font-bold">{jobs.length}</div>
                </div>
                <div className="rounded-2xl border border-[var(--accent-amber)]/40 bg-[var(--accent-amber-bg)] px-4 py-2.5">
                  <div className="text-[11px] text-[var(--text-muted)]">
                    {t('Saldo Aktif', 'Active Balance')}
                  </div>
                  <div className="font-mono text-xl font-bold text-[var(--accent-amber)]">
                    {walletBalance} RMToken
                  </div>
                </div>
              </div>
            </div>

            {/* 5 Quick Launch Feature Cards (Matches UserDashboard-BCvgrgDQ.js) */}
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
                      'Gambar AI + suara narator, tanpa tampil wajah. Untuk TikTok, Reels, dan YouTube Shorts.',
                      'AI pictures + narrator voice, no face needed. For TikTok, Reels, and YouTube Shorts.'
                    ),
                    icon: <Clapperboard className="h-5 w-5 text-[var(--accent-amber)]" />,
                    onClick: () => launchAutoVideo('video', '9:16'),
                  },
                  {
                    title: t('Faceless horizontal', 'Faceless horizontal'),
                    tag: '16:9',
                    desc: t(
                      'Gambar AI + suara narator untuk YouTube: dokumenter, sejarah, dan edukasi per bab.',
                      'AI pictures + narrator voice for YouTube: documentaries, history, and chaptered explainers.'
                    ),
                    icon: <MonitorPlay className="h-5 w-5 text-[var(--accent-amber)]" />,
                    onClick: () => launchAutoVideo('video', '16:9'),
                  },
                  {
                    title: t('Motion Graphic AI', 'AI Motion Graphics'),
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
                      'Naskah buku atau novel dibacakan narator AI per episode dengan sorot teks per kata.',
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
                        <span className="rounded-full border border-[var(--border-default)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--text-muted)]">
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

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {jobs.slice(0, 3).map((job) => (
                  <div
                    key={job.id}
                    onClick={() => setActiveTab('auto-video')}
                    className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-4 hover:border-[var(--border-hover)] cursor-pointer transition"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="inline-flex items-center gap-1 rounded-full bg-[var(--success-bg)] px-2 py-0.5 font-semibold text-[var(--success)]">
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

        {/* TAB 3: TOKEN WALLET (SALDO RMTOKEN) */}
        {activeTab === 'my-tokens' && (
          <div data-token-wallet-page="true" className="space-y-6 animate-fade-in">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-default)] pb-5">
              <div>
                <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
                  {t('Saldo & Riwayat RMToken', 'RMToken Wallet & Ledger')}
                </h1>
                <p className="mt-1 text-[13.5px] text-[var(--text-muted)]">
                  {t(
                    'Setiap token yang masuk dan terpakai tercatat transparan per tahap pembuatan.',
                    'Every token added or spent is recorded transparently per pipeline stage.'
                  )}
                </p>
              </div>
              <button
                onClick={() => setActiveTab('payment')}
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-[var(--accent-amber)] px-5 text-[13px] font-bold text-[var(--accent-text)] cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                {t('Isi Saldo RMToken', 'Top Up RMToken')}
              </button>
            </div>

            {/* Summary Metrics */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-[var(--accent-amber)]/40 bg-[var(--accent-amber-bg)] p-5">
                <div className="text-[12px] font-semibold text-[var(--text-muted)]">
                  {t('Saldo Tersedia', 'Available Balance')}
                </div>
                <div className="mt-2 font-mono text-3xl font-extrabold text-[var(--accent-amber)]">
                  {walletBalance} RMToken
                </div>
                <div className="mt-1 text-[12px] text-[var(--text-muted)]">
                  ≈ Rp{(walletBalance * 1000).toLocaleString('id-ID')} · {t('Tidak pernah hangus', 'Never expires')}
                </div>
              </div>

              <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5">
                <div className="text-[12px] font-semibold text-[var(--text-muted)]">
                  {t('Sedang Ditahan (Hold Tahap Aktif)', 'Currently Held (Active Stage)')}
                </div>
                <div className="mt-2 font-mono text-3xl font-extrabold">0 RMToken</div>
                <div className="mt-1 text-[12px] text-[var(--text-muted)]">
                  {t('Otomatis kembali bila tahap gagal', 'Released automatically if stage fails')}
                </div>
              </div>

              <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5">
                <div className="text-[12px] font-semibold text-[var(--text-muted)]">
                  {t('Pemakaian 30 Hari Terakhir', 'Last 30 Days Usage')}
                </div>
                <div className="mt-2 font-mono text-3xl font-extrabold">
                  {ledger.filter((x) => x.delta < 0).reduce((a, b) => a + Math.abs(b.delta), 0)} RMToken
                </div>
                <div className="mt-1 text-[12px] text-[var(--text-muted)]">
                  {jobs.length} {t('video & episode selesai', 'videos & episodes completed')}
                </div>
              </div>
            </div>

            {/* Filter & Ledger Table */}
            <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-display text-lg font-bold">
                  {t('Catatan Mutasi Token', 'Token Transaction Ledger')}
                </h2>
                <div className="flex gap-1 rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] p-1">
                  {(
                    [
                      { id: 'semua', label: t('Semua', 'All') },
                      { id: 'masuk', label: t('Token Masuk', 'Added') },
                      { id: 'pakai', label: t('Pemakaian', 'Spent') },
                    ] as const
                  ).map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setLedgerFilter(f.id)}
                      className={`rounded-lg px-3 py-1 text-[12px] font-semibold cursor-pointer ${
                        ledgerFilter === f.id
                          ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]'
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
                            {positive ? `+${row.delta}` : row.delta} RMToken
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

        {/* TAB 4: PAYMENT / TOP UP (ISI SALDO) */}
        {activeTab === 'payment' && (
          <div className="space-y-6 animate-fade-in max-w-4xl">
            <div className="border-b border-[var(--border-default)] pb-5">
              <div className="text-[12px] font-bold uppercase tracking-wider text-[var(--accent-amber)]">
                PAKASIR QRIS & TRANSFER OTOMATIS
              </div>
              <h1 className="mt-1 font-display text-2xl sm:text-3xl font-bold tracking-tight">
                {t('Isi Saldo RMToken', 'Top Up RMToken Balance')}
              </h1>
              <p className="mt-1 text-[13.5px] text-[var(--text-muted)]">
                {t(
                  'Promo X3 Token aktif: dapatkan +200% bonus token langsung masuk ke saldo begitu QRIS terbayar.',
                  'Promo X3 Token active: get +200% bonus tokens credited immediately upon QRIS payment.'
                )}
              </p>
            </div>

            {paymentDone && selectedPkg ? (
              <div
                data-pakasir-status="lunas"
                className="max-w-xl mx-auto rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-8 text-center space-y-4"
              >
                <CheckCircle2 className="w-12 h-12 text-[var(--success)] mx-auto" />
                <h3 className="text-lg font-display font-bold text-[var(--text-primary)]">
                  {t('Pembayaran diterima!', 'Payment received!')}
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  {t(
                    `${selectedPkg.tokens + selectedPkg.bonus} RMToken (${selectedPkg.tokens} + ${selectedPkg.bonus} Bonus Promo X3) sudah masuk ke saldo Anda.`,
                    `${selectedPkg.tokens + selectedPkg.bonus} RMToken (${selectedPkg.tokens} + ${selectedPkg.bonus} X3 Promo Bonus) have been added to your balance.`
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
                  { id: 't20', name: '20 RMToken', tokens: 20, bonus: 40, price: 20000, eq: 6 },
                  {
                    id: 't50',
                    name: '50 RMToken',
                    tokens: 50,
                    bonus: 100,
                    price: 50000,
                    eq: 16,
                    popular: true,
                  },
                  { id: 't100', name: '100 RMToken', tokens: 100, bonus: 200, price: 100000, eq: 33 },
                ].map((pkg) => (
                  <div
                    key={pkg.id}
                    className={`rounded-2xl border p-6 flex flex-col justify-between ${
                      pkg.popular
                        ? 'border-[var(--accent-amber)] bg-[var(--bg-card)] shadow-xl'
                        : 'border-[var(--border-default)] bg-[var(--bg-card)]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-display text-lg font-bold">{pkg.name}</span>
                        <span className="rounded-full bg-[var(--success-bg)] px-2.5 py-0.5 text-[11px] font-bold text-[var(--success)]">
                          +{pkg.bonus} Bonus
                        </span>
                      </div>
                      <div className="mt-3 font-mono text-2xl font-extrabold">
                        Rp{pkg.price.toLocaleString('id-ID')}
                      </div>
                      <div className="mt-2 text-[12.5px] font-semibold text-[var(--accent-amber)]">
                        {t('Total diterima:', 'Total received:')} {pkg.tokens + pkg.bonus} RMToken
                      </div>
                      <p className="mt-1 text-[12px] text-[var(--text-muted)]">
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
                      className="mt-6 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent-amber)] text-[13px] font-bold text-[var(--accent-text)] hover:brightness-105 cursor-pointer"
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

        {/* TAB 5: TOKEN GRATIS (REFERRALS & VOUCHERS) */}
        {activeTab === 'token-gratis' && (
          <div data-token-gratis="true" className="max-w-3xl space-y-6 animate-fade-in">
            <div>
              <h1 className="flex items-center gap-2 font-display text-2xl font-bold">
                <Gift className="h-6 w-6 text-[var(--accent-amber)]" />
                {t('Dapatkan RMToken Gratis', 'Get Free RMToken')}
              </h1>
              <p className="mt-1 text-[13.5px] text-[var(--text-muted)]">
                {t(
                  'RMToken bisa didapat tanpa membeli: ambil bonus akun baru, tukar kode voucher, dan ajak teman lewat tautanmu.',
                  'Earn RMToken without buying: claim the new-account bonus, redeem a voucher code, or invite friends with your referral link.'
                )}
              </p>
            </div>

            {/* Voucher Redemption Box */}
            <form
              onSubmit={handleVoucherSubmit}
              className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5 space-y-3"
            >
              <h3 className="font-display text-[15px] font-bold">
                {t('Tukar Kode Voucher Promo', 'Redeem Promo Voucher Code')}
              </h3>
              <p className="text-[12.5px] text-[var(--text-muted)]">
                {t(
                  'Masukkan kode voucher (contoh uji coba: FLUXY10 atau REEL2026) untuk klaim +10 RMToken gratis.',
                  'Enter a voucher code (demo codes: FLUXY10 or REEL2026) to claim +10 free RMTokens.'
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

            {/* Referral Box */}
            <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-[15px] font-bold flex items-center gap-2">
                  <Users className="h-4 w-4 text-[var(--accent-amber)]" />
                  {t('Tautan Ajak Teman (?ajak=FLUXY88)', 'Friend Referral Link (?ajak=FLUXY88)')}
                </h3>
                <span className="rounded-full bg-[var(--accent-amber-bg)] px-2.5 py-0.5 text-[11px] font-bold text-[var(--accent-amber)]">
                  +6 RMToken / {t('Teman', 'Friend')}
                </span>
              </div>
              <p className="text-[12.5px] text-[var(--text-muted)]">
                {t(
                  'Bagikan tautan di bawah. Setiap teman baru yang mendaftar dan verifikasi WhatsApp memberi Anda +6 RMToken otomatis.',
                  'Share the link below. Every new friend who signs up and verifies WhatsApp earns you +6 RMToken automatically.'
                )}
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value="https://reelmotion.vercel.app/?ajak=FLUXY88"
                  className="flex-1 rounded-xl border border-[var(--border-default)] bg-[var(--bg-input)] px-3.5 py-2 text-[12.5px] font-mono text-[var(--text-secondary)]"
                />
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText('https://reelmotion.vercel.app/?ajak=FLUXY88');
                    setCopiedRef(true);
                    setTimeout(() => setCopiedRef(false), 2000);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] px-4 py-2 text-[12.5px] font-semibold cursor-pointer"
                >
                  {copiedRef ? <Check className="h-3.5 w-3.5 text-[var(--success)]" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedRef ? t('Tersalin', 'Copied') : t('Salin', 'Copy')}
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="rounded-xl bg-[var(--bg-secondary)] p-3">
                  <div className="text-[11px] text-[var(--text-muted)]">
                    {t('Daftar lewat tautanmu', 'Signed up via link')}
                  </div>
                  <div className="mt-1 font-mono text-xl font-bold">4</div>
                </div>
                <div className="rounded-xl bg-[var(--bg-secondary)] p-3">
                  <div className="text-[11px] text-[var(--text-muted)]">
                    {t('Hadiah cair', 'Rewards paid')}
                  </div>
                  <div className="mt-1 font-mono text-xl font-bold text-[var(--success)]">3</div>
                </div>
                <div className="rounded-xl bg-[var(--bg-secondary)] p-3">
                  <div className="text-[11px] text-[var(--text-muted)]">
                    {t('Total diperoleh', 'Total earned')}
                  </div>
                  <div className="mt-1 font-mono text-xl font-bold text-[var(--accent-amber)]">
                    +18 RMToken
                  </div>
                </div>
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
                  {t('Contoh Channel yang Dibuat Sepenuhnya dengan ReelMotion', 'Channels Created Entirely with ReelMotion')}
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
                  className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-3"
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
                          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black shadow-lg">
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
                      className="rounded-lg bg-[var(--bg-secondary)] px-3 py-1.5 text-[12px] font-semibold hover:bg-[var(--accent-amber)] hover:text-[var(--accent-text)] cursor-pointer transition"
                    >
                      {t('Buat serupa', 'Make similar')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: ETALASE (WATCH TO EARN & CAMPAIGNS) */}
        {activeTab === 'etalase' && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-[var(--border-default)] pb-5">
              <div className="text-[11px] font-bold uppercase tracking-widest text-[var(--accent-amber)]">
                ETALASE KOMUNITAS
              </div>
              <h1 className="mt-1 font-display text-2xl font-bold">
                {t('Tonton Video Kreator → Kumpulkan Poin → Jadi RMToken', 'Watch Creator Videos → Earn Points → Convert to RMToken')}
              </h1>
              <p className="mt-1 text-[13.5px] text-[var(--text-muted)]">
                {t(
                  'PenghitungTonton mencatat detik yang benar-benar diputar (maks 30 dtk per detak laporan) dan mencairkan imbalan ke saldo Anda.',
                  'Our watch-time tracker verifies actual playback seconds and credits RMToken rewards directly to your wallet.'
                )}
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--accent-amber)]/40 bg-[var(--accent-amber-bg)] p-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-[12px] font-semibold text-[var(--text-muted)]">
                  {t('Waktu Tonton Terverifikasi Hari Ini', 'Verified Watch Time Today')}
                </div>
                <div className="mt-1 font-mono text-2xl font-extrabold">
                  {watchSeconds} {t('detik', 'seconds')} · +2 RMToken {t('siap diklaim', 'ready to claim')}
                </div>
              </div>
              <button
                onClick={() => {
                  setWatchSeconds((s) => s + 30);
                  onTopUpSuccess(2, 'Klaim Imbalan Etalase Tonton', 0);
                }}
                className="rounded-xl bg-[var(--accent-amber)] px-5 py-2.5 text-[13px] font-bold text-[var(--accent-text)] cursor-pointer"
              >
                {t('Simulasikan Tonton 30d & Klaim +2 RMToken', 'Simulate 30s Watch & Claim +2 RMToken')}
              </button>
            </div>
          </div>
        )}

        {/* TAB 8: MEDIA SOSIAL SAYA */}
        {activeTab === 'my-sosmed' && (
          <div className="space-y-6 animate-fade-in max-w-4xl">
            <div className="border-b border-[var(--border-default)] pb-5">
              <h1 className="font-display text-2xl font-bold">
                {t('Sambungan Media Sosial & Auto-Publish', 'Connected Social Accounts & Auto-Publish')}
              </h1>
              <p className="mt-1 text-[13.5px] text-[var(--text-muted)]">
                {t(
                  'Hubungkan akun YouTube, TikTok, Instagram Professional, dan Facebook Page untuk menerbitkan video langsung dari Riwayat.',
                  'Connect YouTube, TikTok, Instagram Professional, and Facebook Page to publish finished videos straight from History.'
                )}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  name: 'YouTube Channel',
                  desc: t(
                    'Unggah otomatis video 16:9 & Shorts 9:16 lengkap dengan judul, deskripsi, tag, dan thumbnail AI.',
                    'Auto-upload 16:9 videos & 9:16 Shorts complete with AI title, description, tags, and thumbnail.'
                  ),
                  connected: true,
                  handle: '@wangsamaya (Terhubung)',
                },
                {
                  name: 'TikTok Creator',
                  desc: t(
                    'Kirim ke kotak masuk TikTok atau posting langsung setelah tinjau privasi & pengungkapan.',
                    'Send to TikTok inbox or direct post after reviewing privacy & disclosure settings.'
                  ),
                  connected: true,
                  handle: '@reelmotion.id (Terhubung)',
                },
                {
                  name: 'Instagram Reels',
                  desc: t(
                    'Video tegak 9:16 diunggah otomatis sebagai Reels ke akun Instagram Bisnis/Kreator.',
                    'Vertical 9:16 videos are posted automatically as Reels to your Business/Creator account.'
                  ),
                  connected: false,
                  handle: t('Belum tersambung', 'Not connected'),
                },
                {
                  name: 'Facebook Page',
                  desc: t(
                    'Terbitkan video secara terjadwal ke Halaman Facebook yang Anda kelola.',
                    'Publish scheduled videos to a Facebook Page you manage.'
                  ),
                  connected: false,
                  handle: t('Belum tersambung', 'Not connected'),
                },
              ].map((soc) => (
                <div
                  key={soc.name}
                  className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5 flex flex-col justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-[16px] font-bold">{soc.name}</h3>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                          soc.connected
                            ? 'bg-[var(--success-bg)] text-[var(--success)]'
                            : 'bg-[var(--bg-secondary)] text-[var(--text-muted)]'
                        }`}
                      >
                        {soc.handle}
                      </span>
                    </div>
                    <p className="mt-2 text-[12.5px] text-[var(--text-muted)]">{soc.desc}</p>
                  </div>
                  <button
                    onClick={() => alert(`${soc.name} OAuth flow triggered`)}
                    className="h-9 rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] px-4 text-[12.5px] font-semibold hover:border-[var(--accent-amber)] cursor-pointer"
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

        {/* TAB 9: AUTO IKLAN (ADMIN / MOTION AD ENGINE) */}
        {activeTab === 'auto-iklan' && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-[var(--border-default)] pb-5">
              <div className="text-[11px] font-bold uppercase tracking-widest text-[var(--accent-amber)]">
                AUTO IKLAN · DETERMINISTIC KEYFRAME ENGINE (/v1/iklan/render)
              </div>
              <h1 className="mt-1 font-display text-2xl font-bold">
                {t('Studio Iklan Produk & Grounding Fakta', 'Product Ad Studio & Fact-Grounded Motion')}
              </h1>
              <p className="mt-1 text-[13.5px] text-[var(--text-muted)]">
                {t(
                  'Mesin planBeats() membagi peran naratif (Hook → Masalah → Solusi Produk → Bukti → CTA) tanpa pernah mengarang harga atau diskon di luar brief Anda.',
                  'The planBeats() engine allocates narrative beats (Hook → Pain Point → Product Hero → Proof → CTA) while strictly grounding every price and claim.'
                )}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {[
                {
                  title: 'Archetype: Product Hero Orbit',
                  desc: 'K.produk + K.orbit + K.harga — Foto produk asli di tengah cincin cahaya berputar dengan lencana harga diskon.',
                },
                {
                  title: 'Archetype: Phone Mockup & Chat',
                  desc: 'K.hp + Percakapan — Pertanyaan pelanggan, indikator mengetik 3 titik, balasan instan, dan tombol beli.',
                },
                {
                  title: 'Archetype: Futuristic HUD Reveal',
                  desc: 'K.urai + K.bingkai + K.bolaTitik — Teks utama didekode di dalam siku HUD dengan bola titik 3D di latar.',
                },
              ].map((arch) => (
                <div
                  key={arch.title}
                  className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5 space-y-3"
                >
                  <h3 className="font-display text-[15px] font-bold text-[var(--accent-amber)]">
                    {arch.title}
                  </h3>
                  <p className="text-[12.5px] text-[var(--text-muted)]">{arch.desc}</p>
                  <button
                    onClick={() => launchAutoVideo('motion', '9:16')}
                    className="w-full rounded-xl bg-[var(--bg-secondary)] py-2 text-[12px] font-bold hover:bg-[var(--accent-amber)] hover:text-[var(--accent-text)] cursor-pointer transition"
                  >
                    {t('Gunakan Template di Studio Motion', 'Use Template in Motion Studio')}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 10: KARYAWAN CHAT (AI STAFF CHAT) */}
        {activeTab === 'karyawan-chat' && (
          <div className="space-y-5 animate-fade-in max-w-4xl">
            <div className="border-b border-[var(--border-default)] pb-4 flex items-center justify-between">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-widest text-[var(--accent-amber)]">
                  KARYAWAN CHAT · PERSONA SKILL ROUTER
                </div>
                <h1 className="mt-1 font-display text-2xl font-bold">
                  {t('Staf AI & Direktur Naskah', 'AI Staff & Script Director')}
                </h1>
              </div>
              <span className="rounded-full border border-[var(--border-default)] bg-[var(--bg-card)] px-3 py-1 font-mono text-[11.5px] text-[var(--accent-amber)]">
                claude/sonnet/4.6 · ```tool protocol
              </span>
            </div>

            <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-4 sm:p-5 space-y-4">
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
                    {m.tool && (
                      <div className="mb-1.5 font-mono text-[11px] text-[var(--accent-amber)]">
                        [{m.tool}]
                      </div>
                    )}
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

        {/* TAB 11: GPU JOBS (VOXCPM2 & Z-IMAGE TURBO BENCHMARK) */}
        {activeTab === 'gpu-jobs' && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-[var(--border-default)] pb-5">
              <div className="text-[11px] font-bold uppercase tracking-widest text-[var(--accent-amber)]">
                GPU WORKER FLEET · KAGGLE T4x2 & RUNPOD
              </div>
              <h1 className="mt-1 font-display text-2xl font-bold">
                {t('Bangku Uji TTS VoxCPM2 & Z-Image Turbo', 'VoxCPM2 TTS & Z-Image Turbo Testbench')}
              </h1>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-display text-[15px] font-bold">
                    openbmb/VoxCPM2 + ZipEnhancer 16kHz
                  </span>
                  <span className="rounded-full bg-[var(--success-bg)] px-2.5 py-0.5 font-mono text-[11px] text-[var(--success)]">
                    READY · 24kHz
                  </span>
                </div>
                <p className="text-[12.5px] text-[var(--text-muted)]">
                  Commit HF `32279effe8c19989596f05d353d1447f51d9e915`. Klip acuan dijernihkan lebih dulu dengan ModelScope `speech_zipenhancer_ans_multiloss_16k_base`, ditranskripsi otomatis oleh `stable-whisper`, dan diratakan temponya ke median laju bicara dengan `ffmpeg atempo`.
                </p>
              </div>

              <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-display text-[15px] font-bold">
                    Z-Image Turbo (Diffusers CFG 0.0 · 9 Steps)
                  </span>
                  <span className="rounded-full bg-[var(--success-bg)] px-2.5 py-0.5 font-mono text-[11px] text-[var(--success)]">
                    T4x2 ACTIVE
                  </span>
                </div>
                <p className="text-[12.5px] text-[var(--text-muted)]">
                  Turing `sm_75` FlashAttention disabled (`enable_flash_sdp(False)`), `expandable_segments:True`, dengan tangga resolusi otomatis dan pengunggah multipart S3/Cloudflare R2 (`boto3`).
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 12: AGENTIC STUDIO & TAB 13: ADMIN PANEL */}
        {(activeTab === 'agentic' || activeTab === 'admin-panel') && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-[var(--border-default)] pb-5">
              <div className="text-[11px] font-bold uppercase tracking-widest text-[var(--accent-amber)]">
                {activeTab === 'agentic' ? 'AUTONOMOUS AGENTIC DIRECTOR' : 'SYSTEM ADMINISTRATION'}
              </div>
              <h1 className="mt-1 font-display text-2xl font-bold">
                {activeTab === 'agentic'
                  ? t('Direktur Agentic: Riset Tren → Produksi → Jadwal Tayang', 'Agentic Director: Trend Research → Production → Auto-Schedule')
                  : t('Panel Admin & Konfigurasi Mesin', 'Admin Panel & Engine Configuration')}
              </h1>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: 'Sidecar Status', val: 'HEAD (Heartbeat < 90s)' },
                { label: 'AI Gateway Pool', val: '30 Models (Claude/GPT/Gemini)' },
                { label: 'Cloudflare R2 Presign', val: 'Active (10m TTL)' },
                { label: 'Pakasir QRIS Webhook', val: 'Connected (Promo X3)' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-4"
                >
                  <div className="text-[11.5px] text-[var(--text-muted)]">{stat.label}</div>
                  <div className="mt-1 font-mono text-[14px] font-bold text-[var(--success)]">
                    {stat.val}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
