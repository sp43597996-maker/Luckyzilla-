/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { PrizeCatalogue } from './components/PrizeCatalogue';
import { DrawEngineView } from './components/DrawEngineView';
import { WinnersShowcase } from './components/WinnersShowcase';
import { CoinWalletView } from './components/CoinWalletView';
import { AdminDashboard } from './components/AdminDashboard';
import { DocumentationView } from './components/DocumentationView';
import { RegistrationModal } from './components/RegistrationModal';
import { AndroidPreviewModal } from './components/AndroidPreviewModal';
import { BrandLogo } from './components/BrandLogo';
import { PrizeItem, DrawRecord, DrawWinner, WalletTransaction, SystemStatus, Language, UserAccount } from './types';
import { translations } from './i18n';
import { Lock, ShieldCheck, Scale, Globe, ArrowUpRight } from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [currentTab, setCurrentTab] = useState<string>('fleet');
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [prizes, setPrizes] = useState<PrizeItem[]>([]);
  const [drawRecord, setDrawRecord] = useState<DrawRecord | null>(null);
  const [winners, setWinners] = useState<DrawWinner[]>([]);
  const [walletBalance, setWalletBalance] = useState<number>(200);
  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>([]);
  const [activeUser, setActiveUser] = useState<UserAccount | null>(null);

  const [isRegModalOpen, setIsRegModalOpen] = useState<boolean>(false);
  const [isAndroidPreviewOpen, setIsAndroidPreviewOpen] = useState<boolean>(false);

  // Load initial data from backend API
  useEffect(() => {
    fetchStatus();
    fetchPrizes();
    fetchDrawResults();
    // Pre-load default simulated pilot profile
    fetchUserProfile('LZ-84920419');
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/status');
      const data = await res.json();
      setSystemStatus(data);
    } catch (e) {
      console.error('Error fetching status:', e);
    }
  };

  const fetchPrizes = async () => {
    try {
      const res = await fetch('/api/prizes');
      const data = await res.json();
      if (data.prizes) {
        setPrizes(data.prizes);
      }
    } catch (e) {
      console.error('Error fetching prizes:', e);
    }
  };

  const fetchDrawResults = async () => {
    try {
      const res = await fetch('/api/draw/results');
      const data = await res.json();
      if (data.latestDraw) {
        setDrawRecord(data.latestDraw);
        setWinners(data.latestDraw.winners || []);
      }
    } catch (e) {
      console.error('Error fetching draw results:', e);
    }
  };

  const fetchUserProfile = async (userId: string) => {
    try {
      const res = await fetch(`/api/user/profile/${userId}`);
      const data = await res.json();
      if (data.profile) {
        setActiveUser(data.profile);
        setWalletBalance(data.wallet.balance);
        setWalletTransactions(data.wallet.transactions || []);
      }
    } catch (e) {
      console.error('Error fetching user profile:', e);
    }
  };

  // Fast-Forward registrations simulation
  const handleFastForwardRegistrations = async (count?: number, setToTarget?: boolean) => {
    try {
      const res = await fetch('/api/register/batch-simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count, setToTarget }),
      });
      const data = await res.json();
      if (data.success) {
        fetchStatus();
      }
    } catch (e) {
      console.error('Error in batch simulation:', e);
    }
  };

  const handleUserRegistered = (user: UserAccount, ticket: any) => {
    setActiveUser(user);
    setWalletBalance(user.walletBalance);
    fetchStatus();
    if (user.id) {
      fetchUserProfile(user.id);
    }
  };

  const handleDrawExecuted = (record: DrawRecord) => {
    setDrawRecord(record);
    setWinners(record.winners);
    if (activeUser?.id) {
      fetchUserProfile(activeUser.id);
    }
    fetchStatus();
  };

  const handlePrizeUpdated = (updatedPrize: PrizeItem) => {
    setPrizes(prev => prev.map(p => (p.id === updatedPrize.id ? updatedPrize : p)));
  };

  return (
    <div className="min-h-screen bg-[#05070d] text-slate-100 flex flex-col font-sans">
      {/* Top Bar Navigation (Strict 3-Zone Contract) */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        lang={lang}
        setLang={setLang}
        onOpenSimulateModal={() => setIsRegModalOpen(true)}
        onOpenAndroidPreview={() => setIsAndroidPreviewOpen(true)}
        activeUser={activeUser}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Hero Section (Always visible on top of fleet view) */}
        {currentTab === 'fleet' && (
          <HeroSection
            systemStatus={systemStatus}
            lang={lang}
            onOpenSimulateModal={() => setIsRegModalOpen(true)}
            onExplorePrizes={() => {
              const el = document.getElementById('fleet');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            onFastForwardRegistrations={handleFastForwardRegistrations}
          />
        )}

        {/* Tab 1: Prize Fleet Catalogue */}
        {currentTab === 'fleet' && (
          <PrizeCatalogue prizes={prizes} lang={lang} />
        )}

        {/* Tab 2: Verifiable Cryptographic Draw Engine */}
        {currentTab === 'draw' && (
          <DrawEngineView
            systemStatus={systemStatus}
            drawRecord={drawRecord}
            lang={lang}
            onSnapshotCreated={() => fetchStatus()}
            onDrawExecuted={handleDrawExecuted}
          />
        )}

        {/* Tab 3: Official Certified Winners Showcase */}
        {currentTab === 'winners' && (
          <WinnersShowcase winners={winners} lang={lang} />
        )}

        {/* Tab 4: Rewards & Coin Wallet */}
        {currentTab === 'wallet' && (
          <CoinWalletView
            balance={walletBalance}
            transactions={walletTransactions}
            userId={activeUser?.id || 'LZ-84920419'}
            lang={lang}
            onRefreshWallet={() => {
              if (activeUser?.id) fetchUserProfile(activeUser.id);
            }}
          />
        )}

        {/* Tab 5: Legal, Statutory & Compliance Matrix */}
        {currentTab === 'compliance' && (
          <DocumentationView lang={lang} />
        )}

        {/* Tab 6: Admin Governance Console */}
        {currentTab === 'admin' && (
          <AdminDashboard
            prizes={prizes}
            systemStatus={systemStatus}
            lang={lang}
            onPrizeUpdated={handlePrizeUpdated}
            onFastForwardRegistrations={handleFastForwardRegistrations}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-800 bg-[#04060b] py-12 px-4 lg:px-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <BrandLogo size="md" showText={true} />
            <p className="text-slate-500 max-w-md text-center md:text-left leading-relaxed">
              Luckyzilla is a proposed premium prize-draw platform prototype. Engineered in strict compliance with Section 194B of the Income Tax Act 1961, state gaming frameworks, and provably fair algorithmic governance.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-2">
            <div className="flex items-center gap-4 text-xs font-semibold text-slate-300">
              <button onClick={() => setCurrentTab('fleet')} className="hover:text-amber-400">Prize Fleet</button>
              <button onClick={() => setCurrentTab('draw')} className="hover:text-amber-400">Draw Engine</button>
              <button onClick={() => setCurrentTab('wallet')} className="hover:text-amber-400">Coin Wallet</button>
              <button onClick={() => setCurrentTab('compliance')} className="hover:text-amber-400">Compliance Matrix</button>
              <button onClick={() => setCurrentTab('admin')} className="hover:text-amber-400">Admin Console</button>
            </div>
            <div className="text-[11px] text-slate-600 font-mono-num">
              © 2026 Luckyzilla Technologies Inc. All rights reserved. Strict Simulation Mode Active.
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <RegistrationModal
        isOpen={isRegModalOpen}
        onClose={() => setIsRegModalOpen(false)}
        lang={lang}
        onUserRegistered={handleUserRegistered}
      />

      <AndroidPreviewModal
        isOpen={isAndroidPreviewOpen}
        onClose={() => setIsAndroidPreviewOpen(false)}
        prizes={prizes}
        lang={lang}
        onSimulateEntry={() => {
          setIsAndroidPreviewOpen(false);
          setIsRegModalOpen(true);
        }}
      />
    </div>
  );
}
