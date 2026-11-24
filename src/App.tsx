import React, { useState, useEffect } from 'react';
import { X, ArrowRight, ShieldCheck, Sparkles, Gift } from 'lucide-react';
import {
  Lang,
  Theme,
  StudioTab,
  AutoContentMode,
  VideoJob,
  TokenLedgerEntry,
  INITIAL_JOBS,
  INITIAL_LEDGER,
} from './data/mockData';
import { LandingPage } from './components/LandingPage';
import { StudioDashboard } from './components/StudioDashboard';

export function App() {
  const [lang, setLang] = useState<Lang>(() => {
    try {
      return localStorage.getItem('reelmotion.lang') === 'en' ? 'en' : 'id';
    } catch {
      return 'id';
    }
  });

  const [theme, setTheme] = useState<Theme>(() => {
    try {
      return localStorage.getItem('reelmotion.theme') === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });

  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>('kreator@fluxy.id');
  const [userName, setUserName] = useState<string>('Kreator Fluxy');
  const [isAdmin, setIsAdmin] = useState<boolean>(true);
  const [walletBalance, setWalletBalance] = useState<number>(147);
  const [jobs, setJobs] = useState<VideoJob[]>(INITIAL_JOBS);
  const [ledger, setLedger] = useState<TokenLedgerEntry[]>(INITIAL_LEDGER);
  const [activeTab, setActiveTab] = useState<StudioTab>('dashboard');
  const [initialAutoMode, setInitialAutoMode] = useState<AutoContentMode>('video');

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'charcoal');
    } else {
      root.classList.remove('dark');
      root.removeAttribute('data-theme');
    }
    try {
      localStorage.setItem('reelmotion.theme', theme);
    } catch {}
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem('reelmotion.lang', lang);
    } catch {}
  }, [lang]);

  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  const handleOpenAuth = (requestedTarget?: string) => {
    if (requestedTarget === 'payment') {
      setActiveTab('payment');
    } else if (
      requestedTarget === 'video' ||
      requestedTarget === 'motion' ||
      requestedTarget === 'audiobook' ||
      requestedTarget === 'clipper'
    ) {
      setInitialAutoMode(requestedTarget);
      setActiveTab('auto-video');
    } else {
      setActiveTab('dashboard');
    }
    setShowAuthModal(true);
  };

  const handleCompleteSignIn = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSignedIn(true);
    setShowAuthModal(false);
  };

  const handleCreateJob = (newJob: VideoJob, cost: number) => {
    const nextBalance = Math.max(0, walletBalance - cost);
    setWalletBalance(nextBalance);
    setJobs((prev) => [newJob, ...prev]);
    setLedger((prev) => [
      {
        id: `tx-${Date.now()}`,
        title: newJob.topic,
        feature:
          newJob.mode === 'motion'
            ? 'motion'
            : newJob.mode === 'audiobook'
            ? 'audiobook'
            : newJob.mode === 'clipper'
            ? 'clipper'
            : 'autovideo',
        delta: -cost,
        balanceAfter: nextBalance,
        createdAt: 'Baru saja',
        stage: `Naskah + Narasi + Render (${newJob.mode.toUpperCase()} ${newJob.format})`,
      },
      ...prev,
    ]);
  };

  const handleTopUpSuccess = (tokensAdded: number, pkgName: string, priceRp: number) => {
    const nextBalance = walletBalance + tokensAdded;
    setWalletBalance(nextBalance);
    setLedger((prev) => [
      {
        id: `tx-${Date.now()}`,
        title: pkgName,
        feature: priceRp > 0 ? 'topup' : 'bonus',
        delta: tokensAdded,
        balanceAfter: nextBalance,
        createdAt: 'Baru saja',
        stage:
          priceRp > 0
            ? `QRIS Pakasir Otomatis Lunas (Rp${priceRp.toLocaleString('id-ID')})`
            : 'Bonus Klaim Etalase / Voucher',
      },
      ...prev,
    ]);
  };

  const handleRedeemVoucher = (code: string): boolean => {
    if (code === 'FLUXY10' || code === 'REEL2026' || code === 'BONUS6') {
      handleTopUpSuccess(10, `Voucher Promo (${code})`, 0);
      return true;
    }
    return false;
  };

  const isEn = lang === 'en';
  const t = (id: string, en: string) => (isEn ? en : id);

  return (
    <>
      {isSignedIn ? (
        <StudioDashboard
          lang={lang}
          setLang={setLang}
          theme={theme}
          toggleTheme={toggleTheme}
          userEmail={userEmail}
          userName={userName}
          isAdmin={isAdmin}
          setIsAdmin={setIsAdmin}
          walletBalance={walletBalance}
          jobs={jobs}
          ledger={ledger}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          initialAutoMode={initialAutoMode}
          setInitialAutoMode={setInitialAutoMode}
          onCreateJob={handleCreateJob}
          onTopUpSuccess={handleTopUpSuccess}
          onRedeemVoucher={handleRedeemVoucher}
          onSignOut={() => setIsSignedIn(false)}
        />
      ) : (
        <LandingPage
          lang={lang}
          setLang={setLang}
          theme={theme}
          toggleTheme={toggleTheme}
          onOpenAuth={handleOpenAuth}
        />
      )}

      {/* Google / Email Quick Sign-In Modal */}
      {showAuthModal && (
        <div
          role="dialog"
          aria-label="Masuk ke ReelMotion"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
        >
          <div className="relative w-full max-w-md rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-6 sm:p-7 shadow-2xl animate-fade-in">
            <button
              onClick={() => setShowAuthModal(false)}
              aria-label="Tutup"
              className="absolute right-4 top-4 rounded-lg p-1.5 text-[var(--text-muted)] hover:bg-[var(--bg-secondary)] cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--accent-amber)] text-[16px] font-extrabold text-[var(--accent-text)]">
                R
              </div>
              <div>
                <div className="font-display text-lg font-bold leading-none">ReelMotion</div>
                <div className="mt-0.5 text-[11.5px] text-[var(--text-muted)]">
                  {t('Studio Konten AI Otomatis', 'Automated AI Content Studio')}
                </div>
              </div>
            </div>

            <h2 className="mt-5 font-display text-xl font-bold">
              {t('Masuk atau daftar akun baru', 'Sign in or create a new account')}
            </h2>
            <p className="mt-1 text-[13px] text-[var(--text-muted)]">
              {t(
                'Akun baru otomatis mendapatkan bonus 6 RMToken gratis untuk langsung mencoba studio.',
                'New accounts automatically receive 6 free RMTokens to try the studio right away.'
              )}
            </p>

            {/* One-Click Google OAuth Button */}
            <button
              type="button"
              onClick={() => handleCompleteSignIn()}
              className="mt-5 flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] px-4 text-[13.5px] font-bold text-[var(--text-primary)] hover:border-[var(--accent-amber)] cursor-pointer transition"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.8C6.2 7.2 8.9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.6l3.7 2.9c2.2-2 3.7-5 3.7-8.7z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.3 14.8c-.2-.8-.4-1.6-.4-2.5s.2-1.7.4-2.5L1.6 7C.6 9 0 11.2 0 13.5s.6 4.5 1.6 6.5l3.7-2.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.1-6.7-5l-3.7 2.8C3.5 20.9 7.4 24 12 24z"
                />
              </svg>
              <span>{t('Lanjutkan dengan Akun Google', 'Continue with Google Account')}</span>
            </button>

            <div className="my-4 flex items-center gap-3 text-[11px] uppercase tracking-wider text-[var(--text-faint)]">
              <span className="h-px flex-1 bg-[var(--border-default)]" />
              <span>{t('atau masuk instan studio', 'or instant studio access')}</span>
              <span className="h-px flex-1 bg-[var(--border-default)]" />
            </div>

            <form onSubmit={handleCompleteSignIn} className="space-y-3">
              <div>
                <label className="block text-[12px] font-semibold text-[var(--text-secondary)] mb-1">
                  {t('Nama Kreator', 'Creator Name')}
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-input)] px-3.5 py-2 text-[13px] focus:border-[var(--accent-amber)] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[var(--text-secondary)] mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-input)] px-3.5 py-2 text-[13px] focus:border-[var(--accent-amber)] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent-amber)] text-[13.5px] font-bold text-[var(--accent-text)] hover:brightness-105 cursor-pointer transition"
              >
                <span>{t('Masuk ke ReelMotion Studio', 'Enter ReelMotion Studio')}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-[var(--accent-amber-bg)] px-3 py-2 text-[12px] font-medium text-[var(--accent-amber)]">
              <Gift className="h-4 w-4 shrink-0" />
              <span>
                {t(
                  'Saldo demo 147 RMToken siap dipakai di dalam Studio',
                  '147 RMToken demo balance pre-loaded inside Studio'
                )}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
