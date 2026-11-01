import React, { useState } from 'react';
import { WalletTransaction, Language } from '../types';
import { translations } from '../i18n';
import {
  Coins,
  ArrowUpRight,
  ShieldAlert,
  Lock,
  Clock,
  CheckCircle2,
  AlertTriangle,
  History,
  FileCheck,
  Ban,
  Receipt,
  X,
} from 'lucide-react';

interface CoinWalletViewProps {
  balance: number;
  transactions: WalletTransaction[];
  userId: string;
  lang: Language;
  onRefreshWallet: () => void;
}

export const CoinWalletView: React.FC<CoinWalletViewProps> = ({
  balance,
  transactions,
  userId,
  lang,
  onRefreshWallet,
}) => {
  const t = translations[lang];
  const [showRedemptionBlockedModal, setShowRedemptionBlockedModal] = useState(false);
  const [redeemAmount, setRedeemAmount] = useState('100');
  const [payoutMethod, setPayoutMethod] = useState('UPI / IMPS Bank Transfer');
  const [statutoryError, setStatutoryError] = useState<string | null>(null);

  const handleAttemptRedemption = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/wallet/redeem-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          amountCoins: parseInt(redeemAmount, 10),
          paymentMethod: payoutMethod,
        }),
      });
      const data = await res.json();
      // Expect 403 statutory block as per regulatory prompt specifications
      setStatutoryError(data.statutoryNotice || data.error);
      onRefreshWallet();
    } catch (e: any) {
      setStatutoryError('Network or system error.');
    }
  };

  return (
    <section id="wallet" className="py-12 px-4 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="mb-8">
        <div className="text-xs uppercase tracking-widest text-amber-400 font-semibold mb-1">
          {lang === 'en' ? 'REWARDS & CONSOLATION POOL' : 'इनाम एवं सांत्वना पूल'}
        </div>
        <h2 className="text-2xl lg:text-3xl font-luxury font-black text-slate-100">
          {t.walletSection.title}
        </h2>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          {t.walletSection.subtitle}
        </p>
      </div>

      {/* Balance Card & Statutory Guardrails */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Balance Card */}
        <div className="lg:col-span-1 bg-gradient-to-br from-slate-900 via-slate-900 to-[#151c2d] border border-amber-500/40 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                {t.walletSection.balanceLabel}
              </span>
              <Coins className="w-6 h-6 text-amber-400" />
            </div>

            <div className="text-4xl font-black font-mono-num text-slate-100 mb-1">
              {balance.toLocaleString('en-IN')}{' '}
              <span className="text-lg font-sans font-medium text-amber-300">
                {t.walletSection.coins}
              </span>
            </div>

            <div className="text-xs text-slate-400 font-mono-num mb-6">
              Conversion Rate: 100 Coins = ₹100 INR (Simulated Test Valuation)
            </div>
          </div>

          <div className="space-y-2.5">
            <button
              onClick={() => {
                setShowRedemptionBlockedModal(true);
                setStatutoryError(null);
              }}
              className="w-full py-2.5 px-4 text-xs font-bold text-black bg-gradient-to-r from-amber-300 to-amber-500 hover:from-amber-200 hover:to-amber-400 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              <ArrowUpRight className="w-4 h-4 text-black" />
              <span>{t.walletSection.redeemBtn}</span>
            </button>

            <button
              onClick={() => {
                setShowRedemptionBlockedModal(true);
                setStatutoryError(null);
              }}
              className="w-full py-2 px-4 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors border border-slate-700 flex items-center justify-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>{t.walletSection.futureDiscountBtn}</span>
            </button>
          </div>
        </div>

        {/* Legal & Regulatory Protection Box */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Reserve Bank of India & PMLA Stored Value Compliance</span>
            </div>

            <h3 className="text-base font-bold text-slate-200 mb-3">
              Mandatory Payout Safeguards & Escrow Enforcement
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              {t.walletSection.pmlaNotice}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Consolation Award Rule:</span>
                <span className="text-slate-200 font-medium">100 Coins auto-awarded to every non-winning registered participant upon draw conclusion.</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Ledger Immutability:</span>
                <span className="text-slate-200 font-medium">Zero client-side balance modification. All balance states cryptographically chained to backend verification log.</span>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500 font-mono-num">
            <span>Participant Ledger ID: {userId}</span>
            <span className="text-amber-400">Strict Simulation Mode</span>
          </div>
        </div>
      </div>

      {/* Immutable Transaction Ledger */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
            <History className="w-4 h-4 text-amber-400" />
            <span>{t.walletSection.immutableLedgerTitle}</span>
          </div>
          <span className="text-xs text-slate-500 font-mono-num">
            {transactions.length} record(s) on immutable chain
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400">
                <th className="py-3 px-4">{t.walletSection.txnId}</th>
                <th className="py-3 px-4">{t.walletSection.date}</th>
                <th className="py-3 px-4">{t.walletSection.type}</th>
                <th className="py-3 px-4">{t.walletSection.amount}</th>
                <th className="py-3 px-4">{t.walletSection.balance}</th>
                <th className="py-3 px-4">{t.walletSection.status}</th>
                <th className="py-3 px-4">{t.walletSection.auditHash}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono-num">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-slate-500 font-sans">
                    No transactions recorded for this participant yet.
                  </td>
                </tr>
              ) : (
                transactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-300">
                      {tx.id}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      {new Date(tx.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 font-sans text-slate-200">
                      <div>{lang === 'hi' ? tx.descriptionHi : tx.description}</div>
                      <div className="text-[11px] text-slate-500">{tx.type}</div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-amber-300">
                      +{tx.amountCoins} Coins
                    </td>
                    <td className="py-3.5 px-4 text-slate-200 font-semibold">
                      {tx.balanceAfter}
                    </td>
                    <td className="py-3.5 px-4 font-sans">
                      {tx.status === 'SETTLED' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Settled</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-amber-400 font-semibold">
                          <Ban className="w-3.5 h-3.5" />
                          <span>Safely Blocked</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-[10px] text-slate-500 font-mono-num">
                      {tx.auditHash.slice(0, 16)}...
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Redemption Blocked Statutory Modal */}
      {showRedemptionBlockedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-amber-500/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowRedemptionBlockedModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase mb-2">
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Statutory Stored-Value Security Check</span>
            </div>

            <h3 className="text-lg font-bold text-slate-100 mb-2">
              Simulate Reward Coin Redemption (₹)
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              As required by Section 7 of the platform charter, all cash redemption requests must be submitted to the backend validation engine and remain locked until formal entity regulatory approval is in place.
            </p>

            <form onSubmit={handleAttemptRedemption} className="space-y-4 text-xs mb-4">
              <div>
                <label className="text-slate-300 block mb-1">Coin Quantity to Redeem (100 coins = ₹100)</label>
                <input
                  type="number"
                  min="100"
                  step="100"
                  value={redeemAmount}
                  onChange={e => setRedeemAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 font-mono-num"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Proposed Payout Channel</label>
                <select
                  value={payoutMethod}
                  onChange={e => setPayoutMethod(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100"
                >
                  <option>UPI / IMPS Bank Transfer (Pending Escrow)</option>
                  <option>Future Draw Entry Discount Token</option>
                  <option>E-Commerce Partner Stored Voucher</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-black font-bold rounded-xl transition-colors"
              >
                Submit Backend Validation Request
              </button>
            </form>

            {statutoryError && (
              <div className="p-3.5 bg-rose-950/50 border border-rose-500/50 rounded-xl text-xs text-rose-200 leading-relaxed space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-rose-300">
                  <Ban className="w-4 h-4 text-rose-400" />
                  <span>Statutory Safeguard Active</span>
                </div>
                <div>{statutoryError}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
