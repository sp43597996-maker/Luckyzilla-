import React from 'react';
import { BrandLogo } from './BrandLogo';
import { Language } from '../types';
import { translations } from '../i18n';
import { Globe, Smartphone, ShieldAlert, Sparkles, UserCheck } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  onOpenSimulateModal: () => void;
  onOpenAndroidPreview: () => void;
  activeUser: { id: string; maskedMobile: string; walletBalance: number } | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  lang,
  setLang,
  onOpenSimulateModal,
  onOpenAndroidPreview,
  activeUser,
}) => {
  const t = translations[lang];

  return (
    <header className="sticky top-0 z-50 bg-[#060911]/90 backdrop-blur-xl border-b border-amber-500/20 px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 lg:gap-8">
        {/* Zone 1: Brand Title (Single text element wordmark in display face) */}
        <button
          onClick={() => setCurrentTab('fleet')}
          className="flex items-center gap-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-lg p-1"
        >
          <BrandLogo size="md" showText={true} />
        </button>

        {/* Zone 2: 4–5 Clean Single-Line Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => setCurrentTab('fleet')}
            className={`whitespace-nowrap transition-colors py-1 hover:text-amber-300 ${
              currentTab === 'fleet'
                ? 'text-amber-400 font-semibold border-b-2 border-amber-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.nav.prizes}
          </button>

          <button
            onClick={() => setCurrentTab('draw')}
            className={`whitespace-nowrap transition-colors py-1 hover:text-amber-300 ${
              currentTab === 'draw'
                ? 'text-amber-400 font-semibold border-b-2 border-amber-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.nav.drawEngine}
          </button>

          <button
            onClick={() => setCurrentTab('winners')}
            className={`whitespace-nowrap transition-colors py-1 hover:text-amber-300 ${
              currentTab === 'winners'
                ? 'text-amber-400 font-semibold border-b-2 border-amber-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.nav.winners}
          </button>

          <button
            onClick={() => setCurrentTab('wallet')}
            className={`whitespace-nowrap transition-colors py-1 hover:text-amber-300 ${
              currentTab === 'wallet'
                ? 'text-amber-400 font-semibold border-b-2 border-amber-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.nav.wallet}
          </button>

          <button
            onClick={() => setCurrentTab('compliance')}
            className={`whitespace-nowrap transition-colors py-1 hover:text-amber-300 ${
              currentTab === 'compliance'
                ? 'text-amber-400 font-semibold border-b-2 border-amber-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.nav.compliance}
          </button>

          <button
            onClick={() => setCurrentTab('admin')}
            className={`whitespace-nowrap transition-colors py-1 hover:text-amber-300 ${
              currentTab === 'admin'
                ? 'text-amber-400 font-semibold border-b-2 border-amber-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.nav.admin}
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action + Utility Toggles */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Language Switcher */}
          <button
            onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-700 text-slate-300 hover:text-amber-300 hover:border-amber-500/50 transition-colors whitespace-nowrap"
            title="Toggle English / हिन्दी"
          >
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'en' ? 'हिन्दी' : 'English'}</span>
          </button>

          {/* Android Mobile View Modal Trigger */}
          <button
            onClick={onOpenAndroidPreview}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900/90 border border-slate-700 text-slate-300 hover:text-amber-300 hover:border-amber-500/50 transition-colors whitespace-nowrap"
            title="View Android App Simulation & Flutter Source"
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span>Android App</span>
          </button>

          {/* Primary Action Button */}
          <button
            onClick={onOpenSimulateModal}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-black bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 rounded-lg hover:from-amber-200 hover:to-amber-400 transition-all shadow-md shadow-amber-500/20 whitespace-nowrap active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-black" />
            <span>{t.enterSimulationBtn}</span>
          </button>
        </div>
      </div>

      {/* Sub-bar for mobile navigation */}
      <div className="md:hidden flex items-center justify-between overflow-x-auto pt-2.5 mt-2 border-t border-slate-800 text-xs gap-3">
        <button
          onClick={() => setCurrentTab('fleet')}
          className={`whitespace-nowrap px-2 py-1 rounded ${currentTab === 'fleet' ? 'text-amber-400 font-bold bg-amber-500/10' : 'text-slate-400'}`}
        >
          {t.nav.prizes}
        </button>
        <button
          onClick={() => setCurrentTab('draw')}
          className={`whitespace-nowrap px-2 py-1 rounded ${currentTab === 'draw' ? 'text-amber-400 font-bold bg-amber-500/10' : 'text-slate-400'}`}
        >
          {t.nav.drawEngine}
        </button>
        <button
          onClick={() => setCurrentTab('winners')}
          className={`whitespace-nowrap px-2 py-1 rounded ${currentTab === 'winners' ? 'text-amber-400 font-bold bg-amber-500/10' : 'text-slate-400'}`}
        >
          {t.nav.winners}
        </button>
        <button
          onClick={() => setCurrentTab('wallet')}
          className={`whitespace-nowrap px-2 py-1 rounded ${currentTab === 'wallet' ? 'text-amber-400 font-bold bg-amber-500/10' : 'text-slate-400'}`}
        >
          {t.nav.wallet}
        </button>
        <button
          onClick={() => setCurrentTab('compliance')}
          className={`whitespace-nowrap px-2 py-1 rounded ${currentTab === 'compliance' ? 'text-amber-400 font-bold bg-amber-500/10' : 'text-slate-400'}`}
        >
          {t.nav.compliance}
        </button>
        <button
          onClick={() => setCurrentTab('admin')}
          className={`whitespace-nowrap px-2 py-1 rounded ${currentTab === 'admin' ? 'text-amber-400 font-bold bg-amber-500/10' : 'text-slate-400'}`}
        >
          {t.nav.admin}
        </button>
      </div>
    </header>
  );
};
