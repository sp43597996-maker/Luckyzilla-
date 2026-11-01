import React, { useState } from 'react';
import { DrawRecord, Language, SystemStatus } from '../types';
import { translations } from '../i18n';
import {
  ShieldAlert,
  Lock,
  Cpu,
  CheckCircle,
  FileCheck,
  RefreshCw,
  Award,
  KeyRound,
  Download,
  AlertTriangle,
  FileCode,
} from 'lucide-react';

interface DrawEngineProps {
  systemStatus: SystemStatus | null;
  drawRecord: DrawRecord | null;
  lang: Language;
  onSnapshotCreated: (snapshot: any) => void;
  onDrawExecuted: (record: DrawRecord) => void;
}

export const DrawEngineView: React.FC<DrawEngineProps> = ({
  systemStatus,
  drawRecord,
  lang,
  onSnapshotCreated,
  onDrawExecuted,
}) => {
  const t = translations[lang];

  const [activeStep, setActiveStep] = useState<number>(1);
  const [isFreezing, setIsFreezing] = useState(false);
  const [frozenSnapshot, setFrozenSnapshot] = useState<{
    snapshotId: string;
    timestamp: string;
    totalEligible: number;
    snapshotSha256: string;
  } | null>(null);

  const [primaryAdmin, setPrimaryAdmin] = useState('Chief Draw Auditor: S. MEHTA');
  const [secondaryKey, setSecondaryKey] = useState('LEGAL-GOV-2026-VERIFIED');
  const [forceBypassCapacity, setForceBypassCapacity] = useState(true); // enabled in simulation mode
  const [isExecuting, setIsExecuting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showVerificationCert, setShowVerificationCert] = useState(false);

  // Step 1: Freeze Participant Snapshot
  const handleFreezeSnapshot = async () => {
    setIsFreezing(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/draw/snapshot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ officerName: primaryAdmin }),
      });
      const data = await res.json();
      if (data.success) {
        setFrozenSnapshot(data.snapshot);
        onSnapshotCreated(data.snapshot);
        setActiveStep(2);
      } else {
        setErrorMsg(data.error || 'Failed to freeze snapshot.');
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Network error freezing snapshot.');
    } finally {
      setIsFreezing(false);
    }
  };

  // Step 2: Execute Cryptographic Draw
  const handleExecuteDraw = async () => {
    setIsExecuting(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/draw/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          snapshotId: frozenSnapshot?.snapshotId,
          secondaryApprovalCode: secondaryKey,
          primaryAdmin,
          forceBypassCapacity,
        }),
      });

      const data = await res.json();
      if (data.success) {
        onDrawExecuted(data.draw);
        setActiveStep(3);
      } else {
        setErrorMsg(data.error || 'Failed to execute draw.');
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Network error executing draw.');
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <section id="draw-engine" className="py-12 px-4 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="mb-8">
        <div className="text-xs uppercase tracking-widest text-amber-400 font-semibold mb-1">
          {lang === 'en' ? 'VERIFIABLE FAIRNESS ARCHITECTURE' : 'सत्यापन योग्य निष्पक्षता वास्तुकला'}
        </div>
        <h2 className="text-2xl lg:text-3xl font-luxury font-black text-slate-100">
          {t.drawSection.title}
        </h2>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          {t.drawSection.subtitle}
        </p>
      </div>

      {/* Error Banner */}
      {errorMsg && (
        <div className="mb-6 p-4 bg-rose-950/40 border border-rose-500/50 rounded-xl text-rose-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 3-Step Execution Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Step 1: Participant Snapshot */}
        <div
          className={`p-6 rounded-2xl border transition-all ${
            activeStep === 1
              ? 'bg-slate-900 border-amber-500/60 shadow-lg shadow-amber-500/10'
              : 'bg-slate-900/60 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono-num font-bold px-2 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/30">
              STEP 01
            </span>
            {frozenSnapshot && <CheckCircle className="w-5 h-5 text-emerald-400" />}
          </div>

          <h3 className="text-base font-bold text-slate-100 mb-2">
            {t.drawSection.snapshotTitle}
          </h3>
          <p className="text-xs text-slate-400 mb-4 leading-relaxed">
            {t.drawSection.snapshotDesc}
          </p>

          {frozenSnapshot ? (
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono-num text-slate-300 space-y-1 mb-4">
              <div className="text-amber-400 font-semibold truncate">
                ID: {frozenSnapshot.snapshotId}
              </div>
              <div className="text-slate-400">
                Eligible Entries: {frozenSnapshot.totalEligible.toLocaleString()}
              </div>
              <div className="text-slate-500 truncate">
                Hash: {frozenSnapshot.snapshotSha256.slice(0, 24)}...
              </div>
            </div>
          ) : (
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400 mb-4">
              Current Registry: <span className="font-bold text-slate-200">{(systemStatus?.totalRegistrations || 9998420).toLocaleString()} entries</span>
            </div>
          )}

          <button
            onClick={handleFreezeSnapshot}
            disabled={isFreezing}
            className="w-full py-2.5 px-4 text-xs font-bold text-black bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isFreezing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Hashing Participant Tree...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>{frozenSnapshot ? 'Re-Freeze Snapshot' : t.drawSection.freezeBtn}</span>
              </>
            )}
          </button>
        </div>

        {/* Step 2: Dual-Officer Authorization */}
        <div
          className={`p-6 rounded-2xl border transition-all ${
            activeStep === 2
              ? 'bg-slate-900 border-amber-500/60 shadow-lg shadow-amber-500/10'
              : 'bg-slate-900/60 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono-num font-bold px-2 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/30">
              STEP 02
            </span>
            <KeyRound className="w-5 h-5 text-amber-400" />
          </div>

          <h3 className="text-base font-bold text-slate-100 mb-2">
            {t.drawSection.authTitle}
          </h3>
          <p className="text-xs text-slate-400 mb-4 leading-relaxed">
            {t.drawSection.authDesc}
          </p>

          <div className="space-y-3 mb-4 text-xs">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">
                {t.drawSection.primaryAdminLabel}
              </label>
              <input
                type="text"
                value={primaryAdmin}
                onChange={e => setPrimaryAdmin(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">
                {t.drawSection.secondaryKeyLabel}
              </label>
              <input
                type="text"
                value={secondaryKey}
                onChange={e => setSecondaryKey(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 text-xs font-mono-num focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400">
              <input
                type="checkbox"
                id="bypass"
                checked={forceBypassCapacity}
                onChange={e => setForceBypassCapacity(e.target.checked)}
                className="rounded border-slate-700 text-amber-500"
              />
              <label htmlFor="bypass">Simulation Mode Override (Allow pre-10M test draw)</label>
            </div>
          </div>

          <button
            onClick={handleExecuteDraw}
            disabled={isExecuting}
            className="w-full py-2.5 px-4 text-xs font-bold text-black bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:from-amber-200 hover:to-amber-400 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isExecuting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-black" />
                <span>Running Fisher-Yates PRNG...</span>
              </>
            ) : (
              <>
                <Cpu className="w-4 h-4 text-black" />
                <span>{t.drawSection.executeBtn}</span>
              </>
            )}
          </button>
        </div>

        {/* Step 3: Verified Results & Certificate */}
        <div
          className={`p-6 rounded-2xl border transition-all ${
            activeStep === 3 || drawRecord
              ? 'bg-slate-900 border-emerald-500/60 shadow-lg shadow-emerald-500/10'
              : 'bg-slate-900/60 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono-num font-bold px-2 py-0.5 rounded bg-emerald-400/10 text-emerald-300 border border-emerald-400/30">
              STEP 03
            </span>
            <Award className="w-5 h-5 text-emerald-400" />
          </div>

          <h3 className="text-base font-bold text-slate-100 mb-2">
            {t.drawSection.verificationTitle}
          </h3>
          <p className="text-xs text-slate-400 mb-4 leading-relaxed">
            100 distinct participants selected without replacement. Results are permanently immutably sealed.
          </p>

          {drawRecord ? (
            <div className="space-y-3 mb-4">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono-num space-y-1">
                <div className="text-emerald-400 font-bold truncate">
                  Draw ID: {drawRecord.drawId}
                </div>
                <div className="text-slate-400 truncate">
                  Seed: {drawRecord.drawSeed.slice(0, 24)}...
                </div>
                <div className="text-slate-400">
                  Winners Certified: 100 Ranks Assigned
                </div>
              </div>

              <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-[11px] text-emerald-300">
                {t.drawSection.nonWinnerRewardNotice}
              </div>

              <button
                onClick={() => setShowVerificationCert(true)}
                className="w-full py-2 px-3 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-colors flex items-center justify-center gap-1.5 border border-slate-700"
              >
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span>{t.drawSection.downloadCert}</span>
              </button>
            </div>
          ) : (
            <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs text-slate-500 text-center">
              Awaiting execution of Steps 1 and 2 to generate cryptographic certificate.
            </div>
          )}
        </div>
      </div>

      {/* Verification Certificate Modal */}
      {showVerificationCert && drawRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#0b0f19] border border-amber-500/50 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Certificate Header */}
            <div className="text-center pb-4 mb-4 border-b border-amber-500/30">
              <div className="text-[11px] uppercase tracking-widest text-amber-400 font-semibold mb-1">
                OFFICIAL ALGORITHMIC AUDIT SEAL
              </div>
              <h3 className="text-lg lg:text-xl font-luxury font-bold text-slate-100">
                LUCKYZILLA INDEPENDENT DRAW VERIFICATION CERTIFICATE
              </h3>
              <p className="text-xs text-slate-400 font-mono-num mt-1">
                Draw Reference: {drawRecord.drawId} · Certified at: {new Date(drawRecord.executedAt).toUTCString()}
              </p>
            </div>

            {/* Audit Parameter Grid */}
            <div className="space-y-3 text-xs font-mono-num mb-6">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Algorithm Version & Model:</span>
                <span className="text-amber-300 font-semibold">{drawRecord.algorithmVersion}</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 break-all">
                <span className="text-slate-400 block text-[11px]">Participant Snapshot SHA-256 Hash:</span>
                <span className="text-slate-300">{drawRecord.snapshotSha256}</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 break-all">
                <span className="text-slate-400 block text-[11px]">Entropy Seed Hash:</span>
                <span className="text-slate-300">{drawRecord.drawSeed}</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 break-all">
                <span className="text-slate-400 block text-[11px]">Execution Result SHA-256 Hash:</span>
                <span className="text-emerald-400 font-bold">{drawRecord.drawSha256}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Total Eligible Pool:</span>
                  <span className="text-slate-100 font-bold">{drawRecord.totalEligibleCount.toLocaleString()}</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Ranks Assigned:</span>
                  <span className="text-slate-100 font-bold">100 (No Replacement)</span>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Authorized Signatories:</span>
                <div className="text-slate-300 mt-1 space-y-0.5">
                  {drawRecord.officersApproved.map((off, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-xs">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{off}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Immutability Notice */}
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-[11px] text-amber-200/90 leading-relaxed mb-6">
              <span className="font-bold text-amber-300">Immutability Declaration: </span>
              This result is cryptographically signed and archived. System administrators are structurally prohibited from modifying, re-ordering, or altering completed draw outcomes.
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowVerificationCert(false)}
                className="px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
              >
                Close Audit View
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
