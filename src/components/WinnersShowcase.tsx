import React, { useState } from 'react';
import { DrawWinner, Language } from '../types';
import { translations } from '../i18n';
import {
  Trophy,
  Search,
  Filter,
  CheckCircle,
  Clock,
  ShieldCheck,
  FileText,
  Truck,
  MessageSquare,
  AlertCircle,
  X,
} from 'lucide-react';

interface WinnersShowcaseProps {
  winners: DrawWinner[];
  lang: Language;
}

export const WinnersShowcase: React.FC<WinnersShowcaseProps> = ({ winners, lang }) => {
  const t = translations[lang];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWinner, setSelectedWinner] = useState<DrawWinner | null>(null);
  const [supportModalWinner, setSupportModalWinner] = useState<DrawWinner | null>(null);
  const [supportSubject, setSupportSubject] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [supportSuccess, setSupportSuccess] = useState<string | null>(null);

  const filteredWinners = winners.filter(w => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      w.rank.toString().includes(q) ||
      w.ticketId.toLowerCase().includes(q) ||
      w.maskedUserId.toLowerCase().includes(q) ||
      w.prizeTitle.toLowerCase().includes(q)
    );
  });

  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportSubject || !supportMessage) return;

    try {
      const res = await fetch('/api/support/ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: supportModalWinner?.userId,
          category: 'PRIZE_CLAIM_VERIFICATION',
          subject: supportSubject,
          message: supportMessage,
          ticketId: supportModalWinner?.ticketId,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSupportSuccess(data.ticketNumber);
        setTimeout(() => {
          setSupportSuccess(null);
          setSupportModalWinner(null);
          setSupportSubject('');
          setSupportMessage('');
        }, 2500);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const formatINR = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} Lakh`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  return (
    <section id="winners" className="py-12 px-4 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="text-xs uppercase tracking-widest text-amber-400 font-semibold mb-1">
            {lang === 'en' ? 'AUDITED RESULTS' : 'लेखापरीक्षित परिणाम'}
          </div>
          <h2 className="text-2xl lg:text-3xl font-luxury font-black text-slate-100">
            {t.winnerSection.title}
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            {t.winnerSection.subtitle}
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t.winnerSection.searchPlaceholder}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
          />
        </div>
      </div>

      {/* Privacy Guarantee Pill */}
      <div className="mb-6 p-3 bg-slate-900/60 border border-slate-800 rounded-xl text-xs text-slate-400 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>{t.winnerSection.privacyNotice}</span>
      </div>

      {/* Table Container */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-semibold">
                <th className="py-3 px-4">{t.winnerSection.rankCol}</th>
                <th className="py-3 px-4">{t.winnerSection.prizeCol}</th>
                <th className="py-3 px-4">{t.winnerSection.ticketCol}</th>
                <th className="py-3 px-4">{t.winnerSection.userCol}</th>
                <th className="py-3 px-4">{t.winnerSection.stateCol}</th>
                <th className="py-3 px-4">{t.winnerSection.statusCol}</th>
                <th className="py-3 px-4 text-right">{t.winnerSection.actionCol}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono-num">
              {filteredWinners.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No results matching search query.
                  </td>
                </tr>
              ) : (
                filteredWinners.map(winner => (
                  <tr
                    key={winner.rank}
                    className="hover:bg-slate-800/40 transition-colors group"
                  >
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center justify-center w-7 h-7 rounded-lg font-bold text-xs ${
                          winner.rank <= 10
                            ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                            : winner.rank <= 20
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        #{winner.rank}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-sans font-medium text-slate-200">
                      <div className="font-semibold group-hover:text-amber-300 transition-colors">
                        {winner.prizeTitle}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono-num">
                        {formatINR(winner.prizeValueINR)} Est. Showroom
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-mono-num text-[11px]">
                      {winner.ticketId}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono-num text-[11px]">
                      {winner.maskedUserId}
                    </td>
                    <td className="py-3.5 px-4 font-sans text-slate-400">
                      {winner.state}
                    </td>
                    <td className="py-3.5 px-4 font-sans">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        <Clock className="w-3 h-3 text-amber-400" />
                        <span>{winner.acceptanceStatus.replace(/_/g, ' ')}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-sans">
                      <button
                        onClick={() => setSelectedWinner(winner)}
                        className="px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors border border-slate-700 hover:border-amber-500/40"
                      >
                        {t.winnerSection.claimPrizeBtn}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Claim Acceptance & Delivery Tracking Modal */}
      {selectedWinner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-amber-500/40 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedWinner(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>OFFICIAL PRIZE CLAIM PROTOCOL</span>
            </div>

            <h3 className="text-xl font-luxury font-bold text-slate-100 mb-1">
              Rank #{selectedWinner.rank} · {selectedWinner.prizeTitle}
            </h3>

            <p className="text-xs text-slate-400 font-mono-num mb-6">
              Ticket: {selectedWinner.ticketId} · Masked Recipient: {selectedWinner.maskedUserId}
            </p>

            {/* 4-Step Claim Timeline */}
            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-slate-200">
                    Step 1: Identity & Age (18+) Verification
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Aadhaar / Passport document KYC checked against registered mobile OTP credentials.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
                <FileText className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-slate-200">
                    Step 2: Section 194B Tax Clearance (30% TDS)
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    PAN card validation. Statutory 30% TDS escrow deposit certificate issued before asset registry transfer.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
                <Truck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-slate-200">
                    Step 3: Regional Dealership Allocation & RTO Registration
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Chassis and engine number allocated at the authorized state dealership ({selectedWinner.state} Regional Transport Office).
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
                <Clock className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-slate-200">
                    Step 4: Insured Handover Ceremony
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Vehicle transit insurance activated. Ceremonial key handover with original manufacturer warranty documentation.
                  </div>
                </div>
              </div>
            </div>

            {/* Support Desk Trigger */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs">
              <button
                onClick={() => {
                  setSupportModalWinner(selectedWinner);
                  setSelectedWinner(null);
                }}
                className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-semibold"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Contact Verification Desk</span>
              </button>

              <button
                onClick={() => setSelectedWinner(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customer Support Desk Modal */}
      {supportModalWinner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setSupportModalWinner(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-bold text-slate-100 mb-1">
              Luckyzilla Verification & Support Desk
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Regarding Ticket #{supportModalWinner.ticketId} (Rank #{supportModalWinner.rank})
            </p>

            {supportSuccess ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center text-xs text-emerald-300 space-y-1">
                <CheckCircle className="w-6 h-6 text-emerald-400 mx-auto" />
                <div className="font-bold">Ticket Registered: #{supportSuccess}</div>
                <div>Our verification desk will contact you within 24 business hours.</div>
              </div>
            ) : (
              <form onSubmit={handleSupportSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="text-slate-300 block mb-1">Inquiry Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., KYC Document Upload Assistance"
                    value={supportSubject}
                    onChange={e => setSupportSubject(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">Message Details</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Provide your query or upload reference..."
                    value={supportMessage}
                    onChange={e => setSupportMessage(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSupportModalWinner(null)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-black font-bold rounded-lg"
                  >
                    Submit Support Ticket
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
