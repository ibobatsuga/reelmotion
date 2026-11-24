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
  Settings,
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
  Layers,
  Folder,
  ArrowUpRight as ArrowNarrowUpRight,
  SlidersHorizontal,
  Download,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Bell,
  Shield,
  HardDrive,
  Cloud,
  FolderOpen,
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
  const [recentTab, setRecentTab] = useState<'import' | 'renew' | 'complete'>('import');
  const [searchQuery, setSearchQuery] = useState('');
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
      text: 'Halo! Saya Asisten Penulis Naskah ReelMotion. Anda bisa meminta ide topik video viral, kalimat pembuka 3 detik (hook), atau naskah iklan produk siap pakai.',
    },
  ]);

  const launchAutoVideo = (mode: AutoContentMode, fmt: '9:16' | '16:9' = '9:16') => {
    setInitialAutoMode(mode);
    setInitialFormat(fmt);
    setActiveTab('auto-video');
    setMobileSidebarOpen(false);
  };

  // Sovereign Icon-Pill Sidebar Items (User-focused, zero technical AI settings)
  const navItems: {
    id: StudioTab;
    label: string;
    icon: React.ReactNode;
  }[] = [
    { id: 'dashboard', label: t('Beranda', 'Dashboard'), icon: <LayoutDashboard className="h-[18px] w-[18px]" /> },
    { id: 'auto-video', label: t('Buat Video', 'Create Video'), icon: <Clapperboard className="h-[18px] w-[18px]" /> },
    { id: 'my-tokens', label: t('Saldo RMToken', 'Token Wallet'), icon: <Coins className="h-[18px] w-[18px]" /> },
    { id: 'payment', label: t('Isi Saldo', 'Top Up'), icon: <CreditCard className="h-[18px] w-[18px]" /> },
    { id: 'token-gratis', label: t('Token Gratis', 'Free Tokens'), icon: <Users className="h-[18px] w-[18px]" /> },
    { id: 'galeri', label: t('Galeri Video', 'Video Gallery'), icon: <Film className="h-[18px] w-[18px]" /> },
    { id: 'my-sosmed', label: t('Media Sosial', 'Social Media'), icon: <Share2 className="h-[18px] w-[18px]" /> },
    { id: 'etalase', label: t('Etalase Tonton', 'Watch & Earn'), icon: <Sparkles className="h-[18px] w-[18px]" /> },
    { id: 'auto-iklan', label: t('Template Iklan', 'Ad Templates'), icon: <Megaphone className="h-[18px] w-[18px]" /> },
    { id: 'karyawan-chat', label: t('Asisten Naskah', 'Script Assistant'), icon: <Bot className="h-[18px] w-[18px]" /> },
  ];

  const visibleNav = navItems;

  // Build rows for the Sovereign "Recent Files" table combining user's video jobs + Sovereign style columns
  const sovereignTableRows = [
    ...jobs.map((j, i) => ({
      id: `#${928450 + i * 117}`,
      type: j.topic,
      modeBadge: `${j.mode.toUpperCase()} ${j.format}`,
      author: i % 2 === 0 ? userName : 'Murad Naser',
      avatarBg: i % 3 === 0 ? 'bg-[#4D5BAF]' : i % 3 === 1 ? 'bg-[#FFA143]' : 'bg-[#11C6C2]',
      date: j.createdAt,
      valid: j.status !== 'failed',
      validLabel: j.status === 'done' ? 'Valid' : 'Running',
      job: j,
    })),
    {
      id: '#455698',
      type: t('Episode 3: Jejak Rempah Nusantara (16:9)', 'Episode 3: Nusantara Spice Trail (16:9)'),
      modeBadge: 'AUDIOBOOK 16:9',
      author: 'Estelle Darcy',
      avatarBg: 'bg-[#717CBF]',
      date: '16 June 2030',
      valid: true,
      validLabel: 'Valid',
      job: jobs[0],
    },
    {
      id: '#122109',
      type: t('Klip Podcast: Strategi Brand Lokal 2026', 'Podcast Clip: Local Brand Strategy 2026'),
      modeBadge: 'CLIPPER 9:16',
      author: 'Yael Amari',
      avatarBg: 'bg-[#E86E4B]',
      date: '12 June 2030',
      valid: false,
      validLabel: 'Invalid',
      job: jobs[1],
    },
    {
      id: '#789001',
      type: t('Motion Iklan: Kopi Susu Aren Senja', 'Motion Ad: Senja Palm Sugar Coffee'),
      modeBadge: 'MOTION 9:16',
      author: 'Howard Ong',
      avatarBg: 'bg-[#11C6C2]',
      date: '08 June 2030',
      valid: true,
      validLabel: 'Valid',
      job: jobs[1],
    },
  ].filter((r) => {
    if (recentTab === 'complete' && !r.valid) return false;
    if (recentTab === 'renew' && r.valid) return false;
    if (!searchQuery.trim()) return true;
    return (
      r.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

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
            `Berikut rancangan naskah untuk "${msg}". Klik menu "Buat Video" untuk langsung menjadikannya video siap tayang!`,
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
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-body flex flex-col">
      {/* Sovereign macOS Window Top Bar (Exact match to Figma Frame) */}
      <div className="h-11 bg-[var(--bg-surface)] border-b border-[var(--border-default)] px-4 sm:px-6 flex items-center justify-between text-[12px] select-none sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#FF5F57] inline-block" />
            <span className="h-3 w-3 rounded-full bg-[#FEBC2E] inline-block" />
            <span className="h-3 w-3 rounded-full bg-[#28C840] inline-block" />
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-[var(--text-muted)]">
            <ChevronLeft className="h-4 w-4" />
            <ChevronRight className="h-4 w-4 opacity-50" />
          </div>
        </div>

        {/* Center URL Address Pill: https://reelmotion.studio/orders */}
        <div className="flex items-center gap-2 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-default)] px-4 py-1 w-full max-w-md justify-center text-[11.5px] text-[var(--text-muted)]">
          <Shield className="h-3.5 w-3.5 text-[#4D5BAF]" />
          <span className="font-medium text-[var(--text-primary)]">
            https://reelmotion.studio/{activeTab}
          </span>
        </div>

        {/* Right Top Bar Controls */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex rounded-full bg-[var(--bg-secondary)] border border-[var(--border-default)] p-0.5">
            <button
              onClick={() => setLang('id')}
              className={`px-2 py-0.5 rounded-full text-[10.5px] font-bold uppercase cursor-pointer transition ${
                lang === 'id' ? 'bg-[#4D5BAF] text-white' : 'text-[var(--text-muted)]'
              }`}
            >
              id
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-2 py-0.5 rounded-full text-[10.5px] font-bold uppercase cursor-pointer transition ${
                lang === 'en' ? 'bg-[#4D5BAF] text-white' : 'text-[var(--text-muted)]'
              }`}
            >
              en
            </button>
          </div>

          <button
            onClick={toggleTheme}
            title={t('Ganti Tema', 'Toggle Theme')}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[#4D5BAF] cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
          </button>

          <button
            onClick={() => setMobileSidebarOpen((v) => !v)}
            className="lg:hidden flex h-7 w-7 items-center justify-center rounded-full bg-[var(--bg-secondary)]"
          >
            {mobileSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Main Sovereign Workspace Container */}
      <div className="flex-1 mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 py-6 flex gap-6 items-start">
        {/* Left Floating Vertical Icon-Pill Sidebar (Exact Sovereign Figma Layout) */}
        <aside
          className={`${
            mobileSidebarOpen
              ? 'fixed inset-y-12 left-4 z-40 flex'
              : 'hidden lg:flex'
          } flex-col items-center gap-4 shrink-0 sticky top-16`}
        >
          {/* Top Circular Logomark Button */}
          <button
            onClick={() => setActiveTab('dashboard')}
            title="ReelMotion Sovereign Studio"
            className="h-12 w-12 rounded-full bg-[#4D5BAF] text-white shadow-lg shadow-[#4D5BAF]/25 flex items-center justify-center hover:scale-105 transition cursor-pointer"
          >
            <Sparkles className="h-5 w-5" />
          </button>

          {/* White Vertical Rounded Pill Container holding Circular Icon Buttons */}
          <div className="w-[62px] rounded-[32px] bg-[var(--bg-secondary)] border border-[var(--border-default)] shadow-sm py-3.5 px-2 flex flex-col items-center gap-2.5">
            {visibleNav.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileSidebarOpen(false);
                  }}
                  title={item.label}
                  className={`group relative h-11 w-11 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    active
                      ? 'bg-[#4D5BAF] text-white shadow-md shadow-[#4D5BAF]/30 scale-105'
                      : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:bg-[#4D5BAF]/10 hover:text-[#4D5BAF]'
                  }`}
                >
                  {item.icon}
                  {/* Tooltip on Hover */}
                  <span className="pointer-events-none absolute left-14 whitespace-nowrap rounded-xl bg-[#1E202A] px-3 py-1.5 text-[11.5px] font-semibold text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 z-50">
                    {item.label}
                  </span>
                </button>
              );
            })}

            <div className="my-1 h-px w-7 bg-[var(--border-default)]" />

            {/* Sign Out Icon Button at Bottom of Pill */}
            <button
              onClick={onSignOut}
              title={t('Keluar Studio', 'Sign Out')}
              className="h-11 w-11 rounded-full bg-[var(--bg-surface)] text-[var(--text-muted)] hover:bg-[var(--danger-bg)] hover:text-[var(--danger)] flex items-center justify-center transition cursor-pointer"
            >
              <LogOut className="h-[18px] w-[18px]" />
            </button>
          </div>
        </aside>

        {/* Right Main Content Column */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* Top Greeting & Action Bar (Welcome, Estelle Darcy! + Create New + Filter + Bell + Profile) */}
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl sm:text-[28px] font-bold tracking-tight text-[var(--text-primary)]">
                {t(`Welcome, ${userName}!`, `Welcome, ${userName}!`)}
              </h1>
              <p className="mt-0.5 text-[13px] text-[var(--text-muted)]">
                {t(
                  'Sovereign AI Video & Content CRM Studio — Kelola produksi video, saldo token, dan jadwal tayang.',
                  'Sovereign AI Video & Content CRM Studio — Manage video production, token wallet, and publishing.'
                )}
              </p>
            </div>

            {/* Top Right Sovereign Action Pills */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Token Balance Pill */}
              <button
                onClick={() => setActiveTab('my-tokens')}
                className="inline-flex h-11 items-center gap-2 rounded-full bg-[var(--bg-surface)] border border-[var(--border-default)] px-4 text-[13px] font-semibold text-[var(--text-primary)] shadow-sm hover:border-[#4D5BAF] cursor-pointer transition"
              >
                <Coins className="h-4 w-4 text-[#FFA143]" />
                <span className="font-mono font-bold">{walletBalance} RMToken</span>
              </button>

              {/* "+ Create New" White Pill */}
              <button
                onClick={() => launchAutoVideo('video', '9:16')}
                className="inline-flex h-11 items-center gap-2 rounded-full bg-[var(--bg-surface)] border border-[var(--border-default)] px-5 text-[13px] font-semibold text-[var(--text-primary)] shadow-sm hover:border-[#4D5BAF] cursor-pointer transition"
              >
                <Plus className="h-4 w-4 text-[#4D5BAF]" />
                <span>{t('Create New', 'Create New')}</span>
              </button>

              {/* "Filter" Indigo Pill */}
              <button
                onClick={() => setActiveTab('auto-video')}
                className="inline-flex h-11 items-center gap-2 rounded-full bg-[#4D5BAF] px-5 text-[13px] font-semibold text-white shadow-md shadow-[#4D5BAF]/25 hover:bg-[#3f4c9c] cursor-pointer transition"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span>{t('Studio Filter', 'Filter')}</span>
              </button>

              {/* Circular Notification Button */}
              <button
                onClick={() => setActiveTab('token-gratis')}
                title={t('Promo & Pengumuman', 'Notifications')}
                className="relative h-11 w-11 rounded-full bg-[var(--bg-surface)] border border-[var(--border-default)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[#4D5BAF] shadow-sm cursor-pointer"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-[#FFA143]" />
              </button>

              {/* Circular User Avatar / Admin Toggle */}
              <button
                onClick={() => setIsAdmin(!isAdmin)}
                title={t('Klik untuk toggle Mode Admin', 'Click to toggle Admin Mode')}
                className="h-11 w-11 rounded-full bg-gradient-to-tr from-[#4D5BAF] to-[#717CBF] text-white font-bold text-[13px] flex items-center justify-center shadow-sm cursor-pointer"
              >
                {userName.slice(0, 2).toUpperCase()}
              </button>
            </div>
          </header>

          {/* TAB 1: SOVEREIGN MAIN DASHBOARD (Exact 2-Column Asymmetric Grid from Figma) */}
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6 animate-fade-in">
              {/* LEFT COLUMN: 3 Folder Cards + Recent Files Table */}
              <div className="space-y-6 min-w-0">
                {/* 3 Top Folder Cards (Policies 2030 / Faceless, Inspection Reports / Motion, Claim Documentation / AudioBook & Clipper) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {[
                    {
                      title: t('Faceless Projects 2030', 'Faceless Projects 2030'),
                      subtitle: '45 Files · 256 MB',
                      tag: '9:16 & 16:9',
                      mode: 'video' as AutoContentMode,
                      fmt: '9:16' as const,
                    },
                    {
                      title: t('Motion Graphic Ads', 'Motion Graphic Ads'),
                      subtitle: '30 Files · 514 MB',
                      tag: '10s–120s',
                      mode: 'motion' as AutoContentMode,
                      fmt: '9:16' as const,
                    },
                    {
                      title: t('AudioBook & Clipper', 'AudioBook & Clipper'),
                      subtitle: '28 Files · 32 MB',
                      tag: t('Narasi & Klip', 'Narration & Clips'),
                      mode: 'audiobook' as AutoContentMode,
                      fmt: '16:9' as const,
                    },
                  ].map((card) => (
                    <div
                      key={card.title}
                      onClick={() => launchAutoVideo(card.mode, card.fmt)}
                      className="group rounded-[26px] bg-[var(--bg-secondary)] border border-[var(--border-default)] p-6 flex flex-col justify-between transition-all hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div className="h-12 w-12 rounded-2xl bg-[#4D5BAF]/10 flex items-center justify-center text-[#4D5BAF]">
                          <Folder className="h-6 w-6 fill-[#4D5BAF]" />
                        </div>
                        <span className="h-10 w-10 rounded-full bg-[var(--bg-surface)] border border-[var(--border-default)] flex items-center justify-center text-[var(--text-secondary)] group-hover:bg-[#4D5BAF] group-hover:text-white transition">
                          <ArrowNarrowUpRight className="h-4 w-4" />
                        </span>
                      </div>

                      <div className="mt-7">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-display text-[17px] font-bold text-[var(--text-primary)]">
                            {card.title}
                          </h3>
                        </div>
                        <div className="mt-1.5 flex items-center justify-between text-[12.5px] text-[var(--text-muted)]">
                          <span>{card.subtitle}</span>
                          <span className="rounded-full bg-[var(--bg-surface)] px-2.5 py-0.5 text-[11px] font-semibold text-[#4D5BAF]">
                            {card.tag}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recent Files / Video Production CRM Table Card */}
                <div className="rounded-[28px] bg-[var(--bg-secondary)] border border-[var(--border-default)] p-6 sm:p-7 space-y-5">
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-[19px] font-bold text-[var(--text-primary)]">
                      {t('Recent Files & Video Jobs', 'Recent Files & Video Jobs')}
                    </h2>
                    <button
                      onClick={() => setActiveTab('auto-video')}
                      className="h-10 w-10 rounded-full bg-[var(--bg-surface)] border border-[var(--border-default)] flex items-center justify-center text-[var(--text-secondary)] hover:bg-[#4D5BAF] hover:text-white transition cursor-pointer"
                    >
                      <ArrowNarrowUpRight className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Sovereign Filter Bar: Import / Renew / Complete + Search... + Feb - Jun */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => setRecentTab('import')}
                        className={`inline-flex h-10 items-center gap-2 rounded-full px-5 text-[12.5px] font-semibold transition cursor-pointer ${
                          recentTab === 'import'
                            ? 'bg-[#4D5BAF] text-white shadow-sm'
                            : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[#4D5BAF]'
                        }`}
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>{t('Import / All', 'Import')}</span>
                      </button>
                      <button
                        onClick={() => setRecentTab('renew')}
                        className={`inline-flex h-10 items-center rounded-full px-5 text-[12.5px] font-semibold transition cursor-pointer ${
                          recentTab === 'renew'
                            ? 'bg-[#4D5BAF] text-white shadow-sm'
                            : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[#4D5BAF]'
                        }`}
                      >
                        {t('Renew', 'Renew')}
                      </button>
                      <button
                        onClick={() => setRecentTab('complete')}
                        className={`inline-flex h-10 items-center rounded-full px-5 text-[12.5px] font-semibold transition cursor-pointer ${
                          recentTab === 'complete'
                            ? 'bg-[#4D5BAF] text-white shadow-sm'
                            : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[#4D5BAF]'
                        }`}
                      >
                        {t('Complete', 'Complete')}
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <div className="relative">
                        <Search className="h-3.5 w-3.5 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search..."
                          className="h-10 rounded-full bg-[var(--bg-surface)] border border-[var(--border-default)] pl-9 pr-4 text-[12.5px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[#4D5BAF] focus:outline-none w-44 sm:w-52"
                        />
                      </div>

                      <button
                        onClick={() => setActiveTab('auto-video')}
                        className="inline-flex h-10 items-center gap-2 rounded-full bg-[var(--bg-surface)] border border-[var(--border-default)] px-4 text-[12.5px] font-semibold text-[var(--text-secondary)] cursor-pointer"
                      >
                        <span>Feb - Nov</span>
                        <ChevronDown className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Sovereign Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-[var(--border-default)] text-[12px] font-semibold text-[var(--text-muted)]">
                          <th className="py-3.5 px-2 w-8">
                            <input type="checkbox" className="rounded accent-[#4D5BAF]" />
                          </th>
                          <th className="py-3.5 px-3">
                            <div className="inline-flex items-center gap-1">
                              <span>Type</span>
                              <ChevronDown className="h-3 w-3" />
                            </div>
                          </th>
                          <th className="py-3.5 px-3">
                            <div className="inline-flex items-center gap-1">
                              <span>File ID</span>
                              <ChevronDown className="h-3 w-3" />
                            </div>
                          </th>
                          <th className="py-3.5 px-3">
                            <div className="inline-flex items-center gap-1">
                              <span>Upload By</span>
                              <ChevronDown className="h-3 w-3" />
                            </div>
                          </th>
                          <th className="py-3.5 px-3">
                            <div className="inline-flex items-center gap-1">
                              <span>Date</span>
                              <ChevronDown className="h-3 w-3" />
                            </div>
                          </th>
                          <th className="py-3.5 px-3">
                            <div className="inline-flex items-center gap-1">
                              <span>Status</span>
                              <ChevronDown className="h-3 w-3" />
                            </div>
                          </th>
                          <th className="py-3.5 px-2 text-right">
                            <Download className="h-4 w-4 inline-block text-[var(--text-secondary)]" />
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--border-default)] text-[13px]">
                        {sovereignTableRows.map((row) => (
                          <tr
                            key={row.id}
                            onClick={() => setActiveTab('auto-video')}
                            className="hover:bg-[var(--bg-surface)]/70 transition cursor-pointer"
                          >
                            <td className="py-3.5 px-2" onClick={(e) => e.stopPropagation()}>
                              <input type="checkbox" className="rounded accent-[#4D5BAF]" />
                            </td>
                            <td className="py-3.5 px-3 font-semibold text-[var(--text-primary)]">
                              <div className="line-clamp-1">{row.type}</div>
                              <div className="text-[10.5px] font-mono text-[#4D5BAF]">
                                {row.modeBadge}
                              </div>
                            </td>
                            <td className="py-3.5 px-3 font-mono text-[12px] text-[var(--text-muted)]">
                              {row.id}
                            </td>
                            <td className="py-3.5 px-3">
                              <div className="flex items-center gap-2.5">
                                <span
                                  className={`h-7 w-7 rounded-full ${row.avatarBg} text-white text-[11px] font-bold flex items-center justify-center shrink-0`}
                                >
                                  {row.author.slice(0, 1)}
                                </span>
                                <span className="font-medium text-[var(--text-primary)] whitespace-nowrap">
                                  {row.author}
                                </span>
                              </div>
                            </td>
                            <td className="py-3.5 px-3 text-[12.5px] text-[var(--text-muted)] whitespace-nowrap">
                              {row.date}
                            </td>
                            <td className="py-3.5 px-3">
                              {row.valid ? (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--success-bg)] px-3 py-1 text-[11.5px] font-bold text-[var(--success)]">
                                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)]" />
                                  {row.validLabel}
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--danger-bg)] px-3 py-1 text-[11.5px] font-bold text-[var(--danger)]">
                                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--danger)]" />
                                  {row.validLabel}
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-2 text-right text-[var(--text-muted)]">
                              <MoreVertical className="h-4 w-4 inline-block" />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Storage Usage Card + Sovereign Royal Indigo Calendar Card */}
              <div className="space-y-6">
                {/* 1. Storage Usage Card (Exact Sovereign Gauge + 3 Mini Circular Rings) */}
                <div className="rounded-[28px] bg-[var(--bg-secondary)] border border-[var(--border-default)] p-6 space-y-5">
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-[17px] font-bold text-[var(--text-primary)]">
                      {t('Storage & R2 Usage', 'Storage Usage')}
                    </h2>
                    <button
                      onClick={() => setActiveTab('my-tokens')}
                      className="h-9 w-9 rounded-full bg-[var(--bg-surface)] border border-[var(--border-default)] flex items-center justify-center text-[var(--text-secondary)] cursor-pointer"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Semi-Circular Arc Gauge (25% / 124 GB out of 500GB) */}
                  <div className="relative flex flex-col items-center justify-center pt-2 pb-1">
                    <svg viewBox="0 0 220 125" className="w-56 h-32 overflow-visible">
                      {/* Background Track Arc */}
                      <path
                        d="M 20 110 A 90 90 0 0 1 200 110"
                        fill="none"
                        stroke="var(--bg-surface)"
                        strokeWidth="14"
                        strokeLinecap="round"
                      />
                      {/* Active Indigo Arc (~52% visual sweep as in Figma thumbnail) */}
                      <path
                        d="M 20 110 A 90 90 0 0 1 115 20"
                        fill="none"
                        stroke="#4D5BAF"
                        strokeWidth="14"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute bottom-3 text-center">
                      <div className="font-display text-3xl font-extrabold text-[var(--text-primary)]">
                        25%
                      </div>
                      <div className="mt-0.5 text-[12px] font-bold text-[var(--text-secondary)]">
                        124 GB
                      </div>
                      <div className="text-[11px] text-[var(--text-muted)]">Out of 500GB R2</div>
                    </div>
                  </div>

                  {/* 3 Mini Circular Ring Indicators (#FFA143 Orange, #FFD12E Yellow, #11C6C2 Teal) */}
                  <div className="rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-default)] p-4 grid grid-cols-3 gap-2 text-center">
                    {[
                      {
                        pct: '12%-60GB',
                        sub: 'Faceless',
                        color: '#FFA143',
                        icon: <HardDrive className="h-4 w-4 text-[#4D5BAF]" />,
                      },
                      {
                        pct: '7%-35GB',
                        sub: 'Motion AI',
                        color: '#FFD12E',
                        icon: <Cloud className="h-4 w-4 text-[#4D5BAF]" />,
                      },
                      {
                        pct: '6%-30GB',
                        sub: 'AudioBook',
                        color: '#11C6C2',
                        icon: <FolderOpen className="h-4 w-4 text-[#4D5BAF]" />,
                      },
                    ].map((ring) => (
                      <div key={ring.pct} className="flex flex-col items-center">
                        <div
                          className="h-12 w-12 rounded-full flex items-center justify-center border-[3px]"
                          style={{ borderColor: ring.color }}
                        >
                          {ring.icon}
                        </div>
                        <div className="mt-2 text-[11px] font-bold text-[var(--text-primary)]">
                          {ring.pct}
                        </div>
                        <div className="text-[10px] text-[var(--text-muted)]">{ring.sub}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Sovereign Royal Indigo Calendar Widget (#4D5BAF) */}
                <div className="rounded-[28px] bg-[#4D5BAF] text-white p-6 shadow-xl shadow-[#4D5BAF]/25 space-y-5">
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-[17px] font-bold">Calender</h2>
                    <button className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1.5 text-[11.5px] font-semibold text-white hover:bg-white/25 cursor-pointer">
                      <span>Sort By</span>
                      <ChevronDown className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Days of Week Header */}
                  <div className="grid grid-cols-7 text-center text-[11px] font-semibold text-white/70">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, idx) => (
                      <div key={idx}>{d}</div>
                    ))}
                  </div>

                  {/* Calendar Dates Circular Pills matching Sovereign Thumbnail */}
                  <div className="grid grid-cols-7 gap-1.5 text-center text-[12px] font-semibold">
                    {[
                      { d: '12', state: 'muted' },
                      { d: '13', state: 'muted' },
                      { d: '14', state: 'muted' },
                      { d: '15', state: 'muted' },
                      { d: '16', state: 'muted' },
                      { d: '17', state: 'white' },
                      { d: '18', state: 'normal' },
                      { d: '19', state: 'normal' },
                      { d: '20', state: 'white' },
                      { d: '21', state: 'white' },
                      { d: '22', state: 'normal' },
                      { d: '23', state: 'white' },
                      { d: '24', state: 'normal' },
                      { d: '25', state: 'teal' },
                      { d: '01', state: 'normal' },
                      { d: '02', state: 'normal' },
                      { d: '03', state: 'normal' },
                      { d: '04', state: 'white' },
                      { d: '05', state: 'normal' },
                      { d: '06', state: 'orange' },
                      { d: '07', state: 'normal' },
                      { d: '26', state: 'normal' },
                      { d: '27', state: 'normal' },
                      { d: '28', state: 'white' },
                      { d: '29', state: 'normal' },
                      { d: '30', state: 'normal' },
                      { d: '31', state: 'white' },
                      { d: '01', state: 'white' },
                    ].map((cell, idx) => {
                      const cls =
                        cell.state === 'white'
                          ? 'bg-white text-[#1E202A] shadow-sm font-bold'
                          : cell.state === 'orange'
                          ? 'bg-[#FFA143] text-[#1E202A] shadow-sm font-bold'
                          : cell.state === 'teal'
                          ? 'bg-[#11C6C2] text-[#1E202A] shadow-sm font-bold'
                          : cell.state === 'muted'
                          ? 'bg-transparent text-white/50'
                          : 'bg-white/15 text-white hover:bg-white/25';
                      return (
                        <button
                          key={idx}
                          onClick={() => launchAutoVideo('video', '9:16')}
                          className={`h-9 w-9 mx-auto rounded-full flex items-center justify-center transition cursor-pointer ${cls}`}
                        >
                          {cell.d}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AUTO VIDEO STUDIO */}
          {activeTab === 'auto-video' && (
            <div className="rounded-[28px] bg-[var(--bg-secondary)] border border-[var(--border-default)] p-6 sm:p-8">
              <AutoVideoStudio
                lang={lang}
                initialMode={initialAutoMode}
                initialFormat={initialFormat}
                jobs={jobs}
                walletBalance={walletBalance}
                onCreateJob={onCreateJob}
                onOpenTopUp={() => setActiveTab('payment')}
              />
            </div>
          )}

          {/* TAB 3: TOKEN WALLET (SALDO RMTOKEN) */}
          {activeTab === 'my-tokens' && (
            <div
              data-token-wallet-page="true"
              className="rounded-[28px] bg-[var(--bg-secondary)] border border-[var(--border-default)] p-6 sm:p-8 space-y-6 animate-fade-in"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-default)] pb-5">
                <div>
                  <h2 className="font-display text-2xl font-bold tracking-tight">
                    {t('Saldo & Riwayat RMToken', 'RMToken Wallet & Ledger')}
                  </h2>
                  <p className="mt-1 text-[13.5px] text-[var(--text-muted)]">
                    {t(
                      'Setiap token yang masuk dan terpakai tercatat transparan per tahap pembuatan.',
                      'Every token added or spent is recorded transparently per pipeline stage.'
                    )}
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('payment')}
                  className="inline-flex h-10 items-center gap-2 rounded-full bg-[#4D5BAF] px-5 text-[13px] font-bold text-white shadow-md shadow-[#4D5BAF]/25 cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  {t('Isi Saldo RMToken', 'Top Up RMToken')}
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl bg-[#4D5BAF] text-white p-5 shadow-lg shadow-[#4D5BAF]/20">
                  <div className="text-[12px] font-medium text-white/80">
                    {t('Saldo Tersedia', 'Available Balance')}
                  </div>
                  <div className="mt-2 font-mono text-3xl font-extrabold">
                    {walletBalance} RMToken
                  </div>
                  <div className="mt-1 text-[12px] text-white/75">
                    ≈ Rp{(walletBalance * 1000).toLocaleString('id-ID')} ·{' '}
                    {t('Tidak pernah hangus', 'Never expires')}
                  </div>
                </div>

                <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-5">
                  <div className="text-[12px] font-semibold text-[var(--text-muted)]">
                    {t('Sedang Ditahan (Hold Tahap Aktif)', 'Currently Held (Active Stage)')}
                  </div>
                  <div className="mt-2 font-mono text-3xl font-extrabold">0 RMToken</div>
                  <div className="mt-1 text-[12px] text-[var(--text-muted)]">
                    {t('Otomatis kembali bila tahap gagal', 'Released automatically if stage fails')}
                  </div>
                </div>

                <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-5">
                  <div className="text-[12px] font-semibold text-[var(--text-muted)]">
                    {t('Pemakaian 30 Hari Terakhir', 'Last 30 Days Usage')}
                  </div>
                  <div className="mt-2 font-mono text-3xl font-extrabold">
                    {ledger.filter((x) => x.delta < 0).reduce((a, b) => a + Math.abs(b.delta), 0)}{' '}
                    RMToken
                  </div>
                  <div className="mt-1 text-[12px] text-[var(--text-muted)]">
                    {jobs.length} {t('video & episode selesai', 'videos & episodes completed')}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-display text-lg font-bold">
                    {t('Catatan Mutasi Token', 'Token Transaction Ledger')}
                  </h3>
                  <div className="flex gap-1.5">
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
                        className={`rounded-full px-4 py-1.5 text-[12px] font-semibold cursor-pointer ${
                          ledgerFilter === f.id
                            ? 'bg-[#4D5BAF] text-white'
                            : 'bg-[var(--bg-secondary)] text-[var(--text-muted)]'
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
                              className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
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

          {/* TAB 4: PAYMENT / TOP UP */}
          {activeTab === 'payment' && (
            <div className="rounded-[28px] bg-[var(--bg-secondary)] border border-[var(--border-default)] p-6 sm:p-8 space-y-6 animate-fade-in">
              <div className="border-b border-[var(--border-default)] pb-5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#4D5BAF]">
                  PAKASIR QRIS & TRANSFER OTOMATIS
                </div>
                <h2 className="mt-1 font-display text-2xl font-bold tracking-tight">
                  {t('Isi Saldo RMToken', 'Top Up RMToken Balance')}
                </h2>
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
                  className="max-w-xl mx-auto rounded-3xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-8 text-center space-y-4"
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
                    className="h-10 px-6 rounded-full bg-[#4D5BAF] text-white text-sm font-bold cursor-pointer"
                  >
                    {t('Mulai Buat Video', 'Start Creating Videos')}
                  </button>
                </div>
              ) : (
                <div className="grid gap-5 md:grid-cols-3">
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
                    {
                      id: 't100',
                      name: '100 RMToken',
                      tokens: 100,
                      bonus: 200,
                      price: 100000,
                      eq: 33,
                    },
                  ].map((pkg) => (
                    <div
                      key={pkg.id}
                      className={`rounded-3xl border p-6 flex flex-col justify-between ${
                        pkg.popular
                          ? 'border-[#4D5BAF] bg-[var(--bg-surface)] shadow-lg'
                          : 'border-[var(--border-default)] bg-[var(--bg-surface)]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-display text-lg font-bold">{pkg.name}</span>
                          <span className="rounded-full bg-[var(--success-bg)] px-3 py-0.5 text-[11px] font-bold text-[var(--success)]">
                            +{pkg.bonus} Bonus
                          </span>
                        </div>
                        <div className="mt-3 font-mono text-2xl font-extrabold">
                          Rp{pkg.price.toLocaleString('id-ID')}
                        </div>
                        <div className="mt-2 text-[12.5px] font-semibold text-[#4D5BAF]">
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
                        className="mt-6 inline-flex h-10 w-full items-center justify-center gap-2 rounded-full bg-[#4D5BAF] text-[13px] font-bold text-white hover:bg-[#3f4c9c] cursor-pointer transition"
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
            <div
              data-token-gratis="true"
              className="rounded-[28px] bg-[var(--bg-secondary)] border border-[var(--border-default)] p-6 sm:p-8 space-y-6 animate-fade-in"
            >
              <div>
                <h2 className="flex items-center gap-2 font-display text-2xl font-bold">
                  <Gift className="h-6 w-6 text-[#4D5BAF]" />
                  {t('Dapatkan RMToken Gratis', 'Get Free RMToken')}
                </h2>
                <p className="mt-1 text-[13.5px] text-[var(--text-muted)]">
                  {t(
                    'RMToken bisa didapat tanpa membeli: ambil bonus akun baru, tukar kode voucher, dan ajak teman lewat tautanmu.',
                    'Earn RMToken without buying: claim the new-account bonus, redeem a voucher code, or invite friends with your referral link.'
                  )}
                </p>
              </div>

              <form
                onSubmit={handleVoucherSubmit}
                className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-5 space-y-3"
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
                    className="flex-1 rounded-full border border-[var(--border-default)] bg-[var(--bg-secondary)] px-4 py-2 text-[13.5px] font-mono uppercase focus:border-[#4D5BAF] focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="rounded-full bg-[#4D5BAF] px-6 py-2 text-[13px] font-bold text-white cursor-pointer"
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

              <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-[15px] font-bold flex items-center gap-2">
                    <Users className="h-4 w-4 text-[#4D5BAF]" />
                    {t('Tautan Ajak Teman (?ajak=FLUXY88)', 'Friend Referral Link (?ajak=FLUXY88)')}
                  </h3>
                  <span className="rounded-full bg-[var(--success-bg)] px-3 py-0.5 text-[11px] font-bold text-[var(--success)]">
                    +6 RMToken / {t('Teman', 'Friend')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value="https://reelmotion-iota.vercel.app/?ajak=FLUXY88"
                    className="flex-1 rounded-full border border-[var(--border-default)] bg-[var(--bg-secondary)] px-4 py-2 text-[12.5px] font-mono text-[var(--text-secondary)]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText('https://reelmotion-iota.vercel.app/?ajak=FLUXY88');
                      setCopiedRef(true);
                      setTimeout(() => setCopiedRef(false), 2000);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#4D5BAF] text-white px-5 py-2 text-[12.5px] font-semibold cursor-pointer"
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
            <div className="rounded-[28px] bg-[var(--bg-secondary)] border border-[var(--border-default)] p-6 sm:p-8 space-y-6 animate-fade-in">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-default)] pb-5">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-widest text-[#4D5BAF]">
                    GALERI CHANNEL REELMOTION
                  </div>
                  <h2 className="mt-1 font-display text-2xl font-bold">
                    {t(
                      'Contoh Channel yang Dibuat Sepenuhnya dengan ReelMotion',
                      'Channels Created Entirely with ReelMotion'
                    )}
                  </h2>
                </div>
                <a
                  href="https://www.youtube.com/@wangsamaya"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--border-default)] bg-[var(--bg-surface)] px-4 py-2 text-[13px] font-semibold hover:border-[#4D5BAF]"
                >
                  <Youtube className="h-4 w-4 text-red-500" />
                  <span>@wangsamaya</span>
                </a>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {SHOWCASE_VIDEOS.map((vid) => (
                  <div
                    key={vid.id}
                    className="rounded-3xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-3.5"
                  >
                    <div
                      className="relative w-full overflow-hidden rounded-2xl bg-black"
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
                          <span className="absolute inset-0 bg-black/35 flex items-center justify-center">
                            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#4D5BAF] shadow-lg">
                              <Play className="ml-0.5 h-5 w-5 fill-current" />
                            </span>
                          </span>
                        </button>
                      )}
                    </div>
                    <div className="pt-3 px-1 flex items-center justify-between">
                      <div>
                        <div className="text-[11px] font-semibold text-[#4D5BAF]">
                          {isEn ? vid.tagEn : vid.tagId}
                        </div>
                        <h3 className="font-display text-[15px] font-bold">{vid.title}</h3>
                      </div>
                      <button
                        onClick={() =>
                          launchAutoVideo(vid.id.startsWith('m') ? 'motion' : 'video', vid.ratio)
                        }
                        className="rounded-full bg-[#4D5BAF] text-white px-4 py-1.5 text-[12px] font-semibold hover:bg-[#3f4c9c] cursor-pointer transition"
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
            <div className="rounded-[28px] bg-[var(--bg-secondary)] border border-[var(--border-default)] p-6 sm:p-8 space-y-6 animate-fade-in">
              <div className="border-b border-[var(--border-default)] pb-5">
                <div className="text-[11px] font-bold uppercase tracking-widest text-[#4D5BAF]">
                  ETALASE KOMUNITAS
                </div>
                <h2 className="mt-1 font-display text-2xl font-bold">
                  {t(
                    'Tonton Video Kreator → Kumpulkan Poin → Jadi RMToken',
                    'Watch Creator Videos → Earn Points → Convert to RMToken'
                  )}
                </h2>
              </div>

              <div className="rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-default)] p-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-[12px] font-semibold text-[var(--text-muted)]">
                    {t('Waktu Tonton Terverifikasi Hari Ini', 'Verified Watch Time Today')}
                  </div>
                  <div className="mt-1 font-mono text-2xl font-extrabold">
                    {watchSeconds} {t('detik', 'seconds')} · +2 RMToken{' '}
                    {t('siap diklaim', 'ready to claim')}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setWatchSeconds((s) => s + 30);
                    onTopUpSuccess(2, 'Klaim Imbalan Etalase Tonton', 0);
                  }}
                  className="rounded-full bg-[#4D5BAF] px-6 py-2.5 text-[13px] font-bold text-white cursor-pointer"
                >
                  {t(
                    'Simulasikan Tonton 30d & Klaim +2 RMToken',
                    'Simulate 30s Watch & Claim +2 RMToken'
                  )}
                </button>
              </div>
            </div>
          )}

          {/* TAB 8: MEDIA SOSIAL */}
          {activeTab === 'my-sosmed' && (
            <div className="rounded-[28px] bg-[var(--bg-secondary)] border border-[var(--border-default)] p-6 sm:p-8 space-y-6 animate-fade-in">
              <div className="border-b border-[var(--border-default)] pb-5">
                <h2 className="font-display text-2xl font-bold">
                  {t(
                    'Sambungan Media Sosial & Auto-Publish',
                    'Connected Social Accounts & Auto-Publish'
                  )}
                </h2>
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
                    handle: '@wangsamaya (Valid)',
                  },
                  {
                    name: 'TikTok Creator',
                    desc: t(
                      'Kirim ke kotak masuk TikTok atau posting langsung setelah tinjau privasi & pengungkapan.',
                      'Send to TikTok inbox or direct post after reviewing privacy & disclosure settings.'
                    ),
                    connected: true,
                    handle: '@reelmotion.id (Valid)',
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
                    className="rounded-3xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-5 flex flex-col justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="font-display text-[16px] font-bold">{soc.name}</h3>
                        <span
                          className={`rounded-full px-3 py-0.5 text-[11px] font-bold ${
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
                      onClick={() => alert(`${soc.name} OAuth configuration opened`)}
                      className="h-9 rounded-full bg-[#4D5BAF] px-4 text-[12.5px] font-semibold text-white hover:bg-[#3f4c9c] cursor-pointer"
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

          {/* TAB 9: AUTO IKLAN */}
          {activeTab === 'auto-iklan' && (
            <div className="rounded-[28px] bg-[var(--bg-secondary)] border border-[var(--border-default)] p-6 sm:p-8 space-y-6 animate-fade-in">
              <div className="border-b border-[var(--border-default)] pb-5">
                <div className="text-[11px] font-bold uppercase tracking-widest text-[#4D5BAF]">
                  AUTO IKLAN · DETERMINISTIC KEYFRAME ENGINE (/v1/iklan/render)
                </div>
                <h2 className="mt-1 font-display text-2xl font-bold">
                  {t('Studio Iklan Produk & Grounding Fakta', 'Product Ad Studio & Fact-Grounded Motion')}
                </h2>
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
                    className="rounded-3xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-5 space-y-3"
                  >
                    <h3 className="font-display text-[15px] font-bold text-[#4D5BAF]">
                      {arch.title}
                    </h3>
                    <p className="text-[12.5px] text-[var(--text-muted)]">{arch.desc}</p>
                    <button
                      onClick={() => launchAutoVideo('motion', '9:16')}
                      className="w-full rounded-full bg-[#4D5BAF] text-white py-2 text-[12px] font-bold cursor-pointer"
                    >
                      {t('Gunakan Template di Studio Motion', 'Use Template in Motion Studio')}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 10: KARYAWAN CHAT */}
          {activeTab === 'karyawan-chat' && (
            <div className="rounded-[28px] bg-[var(--bg-secondary)] border border-[var(--border-default)] p-6 sm:p-8 space-y-5 animate-fade-in">
              <div className="border-b border-[var(--border-default)] pb-4 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-widest text-[#4D5BAF]">
                    {t('ASISTEN PENULIS NASKAH', 'SCRIPTWRITING ASSISTANT')}
                  </div>
                  <h2 className="mt-1 font-display text-2xl font-bold">
                    {t('Diskusi Ide & Naskah Video', 'Brainstorm Video Ideas & Scripts')}
                  </h2>
                </div>
              </div>

              <div className="rounded-3xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-5 space-y-4">
                <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                  {chatHistory.map((m, i) => (
                    <div
                      key={i}
                      className={`rounded-2xl p-4 text-[13.5px] whitespace-pre-line ${
                        m.role === 'user'
                          ? 'ml-auto max-w-xl bg-[#4D5BAF] text-white font-medium'
                          : 'mr-auto max-w-2xl border border-[var(--border-default)] bg-[var(--bg-secondary)] text-[var(--text-primary)]'
                      }`}
                    >
                      {m.tool && (
                        <div className="mb-1.5 font-mono text-[11px] text-[#4D5BAF]">
                          [{m.tool}]
                        </div>
                      )}
                      {m.text}
                    </div>
                  ))}
                </div>

                <form
                  onSubmit={handleChatSend}
                  className="flex gap-2 pt-2 border-t border-[var(--border-default)]"
                >
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder={t(
                      'Tanyakan ide konten viral, naskah iklan, atau riset topik...',
                      'Ask for viral content ideas, ad scripts, or topic research...'
                    )}
                    className="flex-1 rounded-full border border-[var(--border-default)] bg-[var(--bg-secondary)] px-4 py-2.5 text-[13.5px] focus:border-[#4D5BAF] focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#4D5BAF] px-6 py-2.5 text-[13px] font-bold text-white cursor-pointer"
                  >
                    <Send className="h-4 w-4" />
                    {t('Kirim', 'Send')}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 11, 12, 13: GPU JOBS, AGENTIC, ADMIN PANEL */}
          {(activeTab === 'gpu-jobs' || activeTab === 'agentic' || activeTab === 'admin-panel') && (
            <div className="rounded-[28px] bg-[var(--bg-secondary)] border border-[var(--border-default)] p-6 sm:p-8 space-y-6 animate-fade-in">
              <div className="border-b border-[var(--border-default)] pb-5">
                <div className="text-[11px] font-bold uppercase tracking-widest text-[#4D5BAF]">
                  SOVEREIGN SYSTEM CONTROL
                </div>
                <h2 className="mt-1 font-display text-2xl font-bold">
                  {activeTab === 'gpu-jobs'
                    ? t('Bangku Uji TTS VoxCPM2 & Z-Image Turbo', 'VoxCPM2 TTS & Z-Image Turbo Testbench')
                    : activeTab === 'agentic'
                    ? t('Direktur Agentic Otonom', 'Autonomous Agentic Director')
                    : t('Panel Admin & Konfigurasi Mesin', 'Admin Panel & Engine Configuration')}
                </h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: 'Sidecar Status', val: 'HEAD (Valid)' },
                  { label: 'AI Gateway Pool', val: '30 Models Active' },
                  { label: 'Cloudflare R2 Storage', val: '124 GB / 500 GB (25%)' },
                  { label: 'GPU Fleet', val: 'Kaggle T4x2 + RunPod' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-3xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-5"
                  >
                    <div className="text-[12px] text-[var(--text-muted)]">{stat.label}</div>
                    <div className="mt-1.5 font-mono text-[14px] font-bold text-[var(--success)]">
                      {stat.val}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
