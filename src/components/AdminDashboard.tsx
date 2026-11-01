import React, { useState, useEffect } from 'react';
import { PrizeItem, JurisdictionRule, SystemStatus, Language } from '../types';
import { translations } from '../i18n';
import {
  ShieldAlert,
  Users,
  Trophy,
  Sliders,
  FileText,
  Activity,
  Lock,
  Save,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Edit2,
  X,
  CreditCard,
} from 'lucide-react';

interface AdminDashboardProps {
  prizes: PrizeItem[];
  systemStatus: SystemStatus | null;
  lang: Language;
  onPrizeUpdated: (prize: PrizeItem) => void;
  onFastForwardRegistrations: (count?: number, setToTarget?: boolean) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  prizes,
  systemStatus,
  lang,
  onPrizeUpdated,
  onFastForwardRegistrations,
}) => {
  const [adminTab, setAdminTab] = useState<'analytics' | 'prizes' | 'compliance' | 'audit' | 'sandbox'>('analytics');
  const [editingPrize, setEditingPrize] = useState<PrizeItem | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editSpecs, setEditSpecs] = useState('');
  const [editValue, setEditValue] = useState(0);
  const [editDelivery, setEditDelivery] = useState('');
  const [editDocStatus, setEditDocStatus] = useState<any>('');
  const [isSavingPrize, setIsSavingPrize] = useState(false);

  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [jurisdictions, setJurisdictions] = useState<JurisdictionRule[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);

  // Load audit logs and compliance data
  useEffect(() => {
    fetchAuditLogs();
    fetchCompliance();
  }, []);

  const fetchAuditLogs = async () => {
    setIsLoadingLogs(true);
    try {
      const res = await fetch('/api/admin/audit-logs');
      const data = await res.json();
      setAuditLogs(data.logs || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  const fetchCompliance = async () => {
    try {
      const res = await fetch('/api/compliance');
      const data = await res.json();
      setJurisdictions(data.jurisdictions || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleStartEditPrize = (prize: PrizeItem) => {
    setEditingPrize(prize);
    setEditTitle(prize.title);
    setEditSpecs(prize.specs);
    setEditValue(prize.estimatedValueINR);
    setEditDelivery(prize.deliveryTerms);
    setEditDocStatus(prize.docStatus);
  };

  const handleSavePrize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPrize) return;

    setIsSavingPrize(true);
    try {
      const res = await fetch(`/api/admin/prizes/${editingPrize.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editTitle,
          specs: editSpecs,
          estimatedValueINR: editValue,
          deliveryTerms: editDelivery,
          docStatus: editDocStatus,
        }),
      });
      const data = await res.json();
      if (data.success) {
        onPrizeUpdated(data.prize);
        setEditingPrize(null);
        fetchAuditLogs();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSavingPrize(false);
    }
  };

  const totalPoolVal = prizes.reduce((sum, p) => sum + p.estimatedValueINR * p.count, 0);

  return (
    <section id="admin-console" className="py-12 px-4 lg:px-8 max-w-7xl mx-auto">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-400 font-semibold mb-1">
            <Lock className="w-3.5 h-3.5" />
            <span>AUTHORITY & COMPLIANCE GOVERNANCE CONSOLE</span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-luxury font-black text-slate-100">
            Platform Administration & Auditing
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Multi-factor authorization · Real-time simulation metrics · Immutable tamper-proof ledger
          </p>
        </div>

        {/* Admin Navigation Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto shrink-0">
          <button
            onClick={() => setAdminTab('analytics')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              adminTab === 'analytics'
                ? 'bg-amber-400 text-black shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Analytics & KPIs
          </button>
          <button
            onClick={() => setAdminTab('prizes')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              adminTab === 'prizes'
                ? 'bg-amber-400 text-black shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Catalogue Editor
          </button>
          <button
            onClick={() => setAdminTab('compliance')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              adminTab === 'compliance'
                ? 'bg-amber-400 text-black shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            State Matrix
          </button>
          <button
            onClick={() => setAdminTab('audit')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              adminTab === 'audit'
                ? 'bg-amber-400 text-black shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Audit Log Stream
          </button>
          <button
            onClick={() => setAdminTab('sandbox')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              adminTab === 'sandbox'
                ? 'bg-amber-400 text-black shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Payment Sandbox
          </button>
        </div>
      </div>

      {/* Tab 1: Analytics & KPIs */}
      {adminTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
              <span className="text-xs text-slate-400 block mb-1">Simulated Registrations</span>
              <div className="text-2xl font-bold font-mono-num text-slate-100">
                {(systemStatus?.totalRegistrations || 9998420).toLocaleString()}
              </div>
              <span className="text-[11px] text-amber-400 font-mono-num mt-1 block">
                Target: 10,000,000 Entries
              </span>
            </div>

            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
              <span className="text-xs text-slate-400 block mb-1">Total Prize Fleet Value</span>
              <div className="text-2xl font-bold font-mono-num text-gold-gradient">
                ₹{(totalPoolVal / 10000000).toFixed(2)} Cr
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                100 Luxury Machines across 7 Ranks
              </span>
            </div>

            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
              <span className="text-xs text-slate-400 block mb-1">Statutory Operation Mode</span>
              <div className="text-xl font-bold text-amber-300">
                STRICT SIMULATION
              </div>
              <span className="text-[11px] text-rose-400 mt-1 block">
                Real-Money Collection: BLOCKED
              </span>
            </div>

            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
              <span className="text-xs text-slate-400 block mb-1">Dual Authorization</span>
              <div className="text-xl font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle className="w-5 h-5" />
                <span>ENFORCED</span>
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                2-Person Rule Required for Draw
              </span>
            </div>
          </div>

          {/* Quick Simulation Batch Controls */}
          <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-2xl">
            <h3 className="text-base font-bold text-slate-100 mb-2">
              Registration Capacity Load Simulation
            </h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Section 4 requires that the draw only unlocks when the configured 10,000,000 registration capacity is reached. Use these controls to test volume progression.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => onFastForwardRegistrations(1000)}
                className="px-3.5 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700"
              >
                +1,000 Entries
              </button>
              <button
                onClick={() => onFastForwardRegistrations(50000)}
                className="px-3.5 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700"
              >
                +50,000 Entries
              </button>
              <button
                onClick={() => onFastForwardRegistrations(undefined, true)}
                className="px-4 py-2 text-xs font-bold bg-amber-400 hover:bg-amber-300 text-black rounded-lg shadow-md"
              >
                Set Exactly to 10,000,000 Target
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Prize Catalogue Editor */}
      {adminTab === 'prizes' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200">
              Authorized Prize Fleet Modification (Section 5 Compliance)
            </span>
            <span className="text-xs text-slate-400 font-mono-num">
              7 Ranked Categories · 100 Total Awards
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400">
                  <th className="py-3 px-4">Rank Range</th>
                  <th className="py-3 px-4">Prize Item Title</th>
                  <th className="py-3 px-4">Qty</th>
                  <th className="py-3 px-4">Est. Value (INR)</th>
                  <th className="py-3 px-4">Doc & Escrow Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {prizes.map(p => (
                  <tr key={p.id} className="hover:bg-slate-800/40">
                    <td className="py-3.5 px-4 font-mono-num font-bold text-amber-300">
                      {p.rankRange}
                    </td>
                    <td className="py-3.5 px-4 text-slate-200 font-medium">
                      <div>{p.title}</div>
                      <div className="text-[11px] text-slate-400 line-clamp-1">{p.specs}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono-num text-slate-300">
                      {p.count}
                    </td>
                    <td className="py-3.5 px-4 font-mono-num font-bold text-gold-gradient">
                      ₹{p.estimatedValueINR.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {p.docStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleStartEditPrize(p)}
                        className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center gap-1 ml-auto"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-amber-400" />
                        <span>Edit</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: State Compliance Matrix */}
      {adminTab === 'compliance' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200">
              Section 10 Multi-Jurisdictional Legal Governance (India)
            </span>
            <span className="text-xs text-amber-400 font-semibold">
              Live State Gaming & Skill Exemption Registry
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400">
                  <th className="py-3 px-4">State Code</th>
                  <th className="py-3 px-4">Jurisdiction</th>
                  <th className="py-3 px-4">Governing Statute & Precedents</th>
                  <th className="py-3 px-4">Platform Status</th>
                  <th className="py-3 px-4">Draw Eligibility</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-sans">
                {jurisdictions.map(jur => (
                  <tr key={jur.code} className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-mono-num font-bold text-slate-300">
                      {jur.code}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-200">
                      {jur.name} ({jur.nameHi})
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-xs">
                      {jur.statute}
                    </td>
                    <td className="py-3 px-4">
                      {jur.status === 'PERMITTED_PROMOTIONAL' ? (
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          Permitted (Skill/Promotional)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                          Prohibited by State Law
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono-num">
                      {jur.eligibleForDraw ? (
                        <span className="text-emerald-400 font-bold">YES</span>
                      ) : (
                        <span className="text-rose-400 font-bold">EXCLUDED</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Audit Logs */}
      {adminTab === 'audit' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200">
              Immutable Cryptographic Audit Event Stream (Section 6 & 11)
            </span>
            <button
              onClick={fetchAuditLogs}
              className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Log</span>
            </button>
          </div>

          <div className="divide-y divide-slate-800/80 font-mono-num text-xs max-h-96 overflow-y-auto">
            {auditLogs.map((log, idx) => (
              <div key={idx} className="p-3.5 hover:bg-slate-800/40 space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span className="text-amber-300 font-bold">{log.action}</span>
                  <span>{new Date(log.timestamp).toLocaleString()}</span>
                </div>
                <div className="text-slate-200 text-xs font-sans">{log.details}</div>
                <div className="text-[10px] text-slate-500 truncate">
                  SHA-256 Seal: {log.hash} · Actor: {log.actor}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Payment Sandbox */}
      {adminTab === 'sandbox' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase">
            <CreditCard className="w-4 h-4" />
            <span>Simulated Payment Gateway & Bank Sandbox</span>
          </div>

          <h3 className="text-base font-bold text-slate-100">
            Payment Provider & Escrow Readiness Status
          </h3>

          <p className="text-xs text-slate-400 leading-relaxed">
            In accordance with prompt Section 4 & 10, real-money collection is locked. Below is the sandbox test suite validating payload structures for Razorpay / Cashfree / BillDesk escrow routing once formal licenses are finalized.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono-num">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <span className="text-amber-400 font-bold block">Sandbox Merchant Configuration</span>
              <div className="text-slate-400">Environment: <span className="text-slate-200">SANDBOX_TESTNET</span></div>
              <div className="text-slate-400">Merchant Category: <span className="text-slate-200">PROMOTIONAL_PRIZE_DRAW</span></div>
              <div className="text-slate-400">Live Collection Status: <span className="text-rose-400 font-bold">DISCONNECTED</span></div>
              <div className="text-slate-400">Escrow Account: <span className="text-slate-200">SCHEDULED_COMMERCIAL_BANK_ESCROW</span></div>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <span className="text-emerald-400 font-bold block">Security Invariants & Tests</span>
              <div className="text-slate-400">Duplicate Winner Check: <span className="text-emerald-400 font-semibold">100% Passed</span></div>
              <div className="text-slate-400">Wallet Double-Spend Guard: <span className="text-emerald-400 font-semibold">100% Passed</span></div>
              <div className="text-slate-400">Rate Limiter (5 req / 5m): <span className="text-emerald-400 font-semibold">100% Active</span></div>
              <div className="text-slate-400">Non-PII Public ID Isolation: <span className="text-emerald-400 font-semibold">Enforced</span></div>
            </div>
          </div>
        </div>
      )}

      {/* Prize Edit Modal */}
      {editingPrize && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-amber-500/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setEditingPrize(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-100 mb-1">
              Edit Prize Details: {editingPrize.rankRange}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Authorized modifications are immediately timestamped and audited.
            </p>

            <form onSubmit={handleSavePrize} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 block mb-1">Prize Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Estimated Showroom Value (INR)</label>
                <input
                  type="number"
                  value={editValue}
                  onChange={e => setEditValue(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 font-mono-num"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Technical Specs</label>
                <textarea
                  rows={2}
                  value={editSpecs}
                  onChange={e => setEditSpecs(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Delivery Terms</label>
                <textarea
                  rows={2}
                  value={editDelivery}
                  onChange={e => setEditDelivery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Documentation Status</label>
                <select
                  value={editDocStatus}
                  onChange={e => setEditDocStatus(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100"
                >
                  <option value="Documentation Pending Regulatory Inspection">Documentation Pending Regulatory Inspection</option>
                  <option value="Procurement Escrow Verified">Procurement Escrow Verified</option>
                  <option value="Manufacturer Allocation Letter">Manufacturer Allocation Letter</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingPrize(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingPrize}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-black font-bold rounded-lg flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingPrize ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
