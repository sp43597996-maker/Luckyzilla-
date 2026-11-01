import React from 'react';
import { Language, SystemStatus } from '../types';
import { translations } from '../i18n';
import { ShieldCheck, Sparkles, AlertTriangle, ArrowRight, Gauge, Trophy, Lock } from 'lucide-react';

interface HeroSectionProps {
  systemStatus: SystemStatus | null;
  lang: Language;
  onOpenSimulateModal: () => void;
  onExplorePrizes: () => void;
  onFastForwardRegistrations: (count?: number, setToTarget?: boolean) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  systemStatus,
  lang,
  onOpenSimulateModal,
  onExplorePrizes,
  onFastForwardRegistrations,
}) => {
  const t = translations[lang];

  const current = systemStatus?.totalRegistrations || 9998420;
  const target = systemStatus?.targetCapacity || 10000000;
  const progressPercent = Math.min(100, (current / target) * 100);
  const isTargetMet = current >= target;

  return (
    <section className="relative overflow-hidden pt-8 pb-14 border-b border-slate-800/80 bg-gradient-to-b from-[#060911] via-[#090e1b] to-[#060911]">
      {/* Background Ambient Lighting Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-5xl h-80 bg-gradient-to-b from-amber-500/10 via-amber-600/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
        {/* Anti-slop clean kicker with typographic separator */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-semibold tracking-wider uppercase text-amber-400/90 mb-4 text-center">
          <span>{t.heroKicker}</span>
          <span aria-hidden="true">·</span>
          <span>PROVABLY FAIR FISHER-YATES ALGORITHM</span>
          <span aria-hidden="true">·</span>
          <span>SEC 194B TDS ESCROW READY</span>
        </div>

        {/* Hero Headline */}
        <div className="text-center max-w-4xl mx-auto mb-6">
          <h1
            className="font-luxury font-black text-slate-100 tracking-tight leading-[1.1] mb-4 text-balance"
            style={{ fontSize: 'clamp(2.1rem, 4.2vw, 3.8rem)' }}
          >
            {lang === 'en' ? (
              <>
                Win One of <span className="text-gold-gradient">100 Grand Luxury</span> Machines.
              </>
            ) : (
              <>
                100 भव्य <span className="text-gold-gradient">लक्जरी वाहनों</span> में से एक जीतें।
              </>
            )}
          </h1>

          <p className="text-slate-300 text-base lg:text-lg max-w-2xl mx-auto leading-relaxed text-balance">
            {t.heroSubheadline}
          </p>
        </div>

        {/* Primary CTA Decision Block */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
          <button
            onClick={onOpenSimulateModal}
            className="flex items-center gap-2 px-6 py-3.5 text-sm font-bold text-black bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 rounded-xl hover:from-amber-200 hover:to-amber-400 transition-all shadow-lg shadow-amber-500/25 active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-black" />
            <span>{t.enterSimulationBtn}</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </button>

          <button
            onClick={onExplorePrizes}
            className="flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-slate-200 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/40 rounded-xl transition-all"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>{t.exploreCatalogueBtn}</span>
          </button>
        </div>

        {/* Live Registration Progress & 10M Capacity Bar */}
        <div className="max-w-4xl mx-auto bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-5 lg:p-6 shadow-xl mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div>
              <div className="text-xs uppercase tracking-wider text-slate-400 font-medium">
                {t.liveRegistrationCap}
              </div>
              <div className="text-2xl font-bold font-mono-num text-slate-100 flex items-baseline gap-2">
                <span>{current.toLocaleString('en-IN')}</span>
                <span className="text-sm font-normal text-slate-400 font-sans">
                  / {target.toLocaleString('en-IN')} ({progressPercent.toFixed(2)}%)
                </span>
              </div>
            </div>

            {/* Target Status Indicator */}
            <div className="flex items-center gap-2">
              {isTargetMet ? (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Target Achieved · Draw Ready</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                  <Gauge className="w-4 h-4" />
                  <span>Target in Progress · Capacity Rule Active</span>
                </div>
              )}
            </div>
          </div>

          {/* Progress Bar Container */}
          <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800 relative mb-3">
            <div
              className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-yellow-300 transition-all duration-500 rounded-full shadow-[0_0_12px_rgba(251,191,36,0.6)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 gap-2">
            <span>
              ₹1,000 Entry Fee · Target: 10,000,000 Registrations before official draw execution.
            </span>

            {/* Interactive Simulation Controls */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] text-slate-500 font-mono-num">Simulate Batch:</span>
              <button
                onClick={() => onFastForwardRegistrations(500)}
                className="px-2 py-1 text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition-colors"
                title="Add 500 simulated entries"
              >
                +500
              </button>
              <button
                onClick={() => onFastForwardRegistrations(undefined, true)}
                className="px-2.5 py-1 text-[11px] font-semibold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded border border-amber-500/40 transition-colors"
                title="Immediately jump to 10M to test draw execution"
              >
                Jump to 10M
              </button>
            </div>
          </div>
        </div>

        {/* Statutory Safeguards Banner */}
        <div className="max-w-4xl mx-auto flex items-start gap-3 p-4 bg-amber-950/25 border border-amber-500/30 rounded-xl text-xs text-amber-200/90 leading-relaxed">
          <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-amber-300">Statutory Compliance Safeguard: </span>
            {t.statutoryNotice}
          </div>
        </div>
      </div>
    </section>
  );
};
