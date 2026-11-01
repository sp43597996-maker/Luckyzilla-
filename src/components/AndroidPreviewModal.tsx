import React, { useState } from 'react';
import { BrandLogo } from './BrandLogo';
import { VehicleArtwork } from './VehicleArtwork';
import { Language, PrizeItem } from '../types';
import {
  Smartphone,
  Sparkles,
  Trophy,
  Coins,
  Shield,
  Layers,
  ArrowRight,
  Code,
  Copy,
  Check,
  X,
  BatteryCharging,
  Wifi,
  Signal,
} from 'lucide-react';

interface AndroidPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  prizes: PrizeItem[];
  lang: Language;
  onSimulateEntry: () => void;
}

export const AndroidPreviewModal: React.FC<AndroidPreviewModalProps> = ({
  isOpen,
  onClose,
  prizes,
  lang,
  onSimulateEntry,
}) => {
  const [viewMode, setViewMode] = useState<'device' | 'flutter_code'>('device');
  const [mobileScreen, setMobileScreen] = useState<'splash' | 'onboarding' | 'home' | 'tickets' | 'wallet'>('home');
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  const flutterSource = `// Luckyzilla - Flutter Android Production Applet
// pubspec.yaml dependencies:
// flutter: ">=3.19.0"
// http: ^1.2.0
// crypto: ^3.0.3
// google_fonts: ^6.1.0
// shared_preferences: ^2.2.2

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

void main() {
  runApp(const LuckyzillaApp());
}

class LuckyzillaApp extends StatelessWidget {
  const LuckyzillaApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Luckyzilla',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF060911),
        textTheme: GoogleFonts.plusJakartaSansTextTheme(
          ThemeData.dark().textTheme,
        ),
      ),
      home: const MainNavigationScreen(),
    );
  }
}

class MainNavigationScreen extends StatefulWidget {
  const MainNavigationScreen({super.key});

  @override
  State<MainNavigationScreen> createState() => _MainNavigationScreenState();
}

class _MainNavigationScreenState extends State<MainNavigationScreen> {
  int _currentIndex = 0;

  final List<Widget> _screens = const [
    FleetShowcaseTab(),
    DrawEngineTab(),
    CoinWalletTab(),
    ProfileTab(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: const Color(0xFF090D18),
        title: Text(
          'LUCKYZILLA',
          style: GoogleFonts.cinzel(
            fontWeight: FontWeight.w900,
            letterSpacing: 2.0,
            color: const Color(0xFFE5C07B),
          ),
        ),
        actions: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            margin: const EdgeInsets.only(right: 16),
            decoration: BoxDecoration(
              color: Colors.amber.withOpacity(0.15),
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: Colors.amber.withOpacity(0.3)),
            ),
            child: const Text(
              'SIMULATION',
              style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.amber),
            ),
          )
        ],
      ),
      body: _screens[_currentIndex],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) => setState(() => _currentIndex = index),
        backgroundColor: const Color(0xFF060911),
        selectedItemColor: const Color(0xFFE5C07B),
        unselectedItemColor: Colors.white38,
        type: BottomNavigationBarType.fixed,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.directions_car), label: 'Prizes'),
          BottomNavigationBarItem(icon: Icon(Icons.bolt), label: 'Draw'),
          BottomNavigationBarItem(icon: Icon(Icons.account_balance_wallet), label: 'Wallet'),
          BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Account'),
        ],
      ),
    );
  }
}

class FleetShowcaseTab extends StatelessWidget {
  const FleetShowcaseTab({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // Capacity Progress Card
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: const Color(0xFF0E1424),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: Colors.amber.withOpacity(0.3)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('REGISTRATION PROGRESS', style: TextStyle(fontSize: 11, color: Colors.white54, letterSpacing: 1.2)),
              const SizedBox(height: 6),
              const Text('9,998,420 / 10,000,000', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.white)),
              const SizedBox(height: 8),
              LinearProgressIndicator(
                value: 0.9998,
                backgroundColor: Colors.white12,
                color: const Color(0xFFE5C07B),
                minHeight: 8,
              ),
              const SizedBox(height: 12),
              ElevatedButton.icon(
                onPressed: () {},
                icon: const Icon(Icons.stars, color: Colors.black),
                label: const Text('SIMULATE ENTRY (₹1,000)', style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold)),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFE5C07B),
                  minimumSize: const Size.fromHeight(44),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class DrawEngineTab extends StatelessWidget {
  const DrawEngineTab({super.key});
  @override
  Widget build(BuildContext context) => const Center(child: Text('Verifiable Fisher-Yates PRNG Engine'));
}

class CoinWalletTab extends StatelessWidget {
  const CoinWalletTab({super.key});
  @override
  Widget build(BuildContext context) => const Center(child: Text('100 Reward Coins = ₹100 Nominal Value'));
}

class ProfileTab extends StatelessWidget {
  const ProfileTab({super.key});
  @override
  Widget build(BuildContext context) => const Center(child: Text('Masked Participant Profile & KYC'));
}
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(flutterSource);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 lg:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-4xl w-full h-[92vh] shadow-2xl relative flex flex-col overflow-hidden">
        {/* Modal Top Bar */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <Smartphone className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <span>Luckyzilla Android Application</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono-num">
                  Flutter v3.19+ Ready
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Mobile-first luxury design system · Offline-resilient architecture
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Switcher */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
              <button
                onClick={() => setViewMode('device')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  viewMode === 'device'
                    ? 'bg-amber-400 text-black font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Interactive Preview
              </button>
              <button
                onClick={() => setViewMode('flutter_code')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  viewMode === 'flutter_code'
                    ? 'bg-amber-400 text-black font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Flutter Source Code
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 flex items-center justify-center bg-[#070b14]">
          {viewMode === 'device' ? (
            /* Interactive Simulated Android Smartphone Container */
            <div className="w-[360px] h-[680px] bg-[#05070d] border-4 border-slate-700 rounded-[44px] shadow-2xl relative flex flex-col overflow-hidden ring-8 ring-slate-900/80">
              {/* Android Dynamic Island / Camera Hole & Speaker */}
              <div className="h-7 bg-[#05070d] flex items-center justify-between px-6 pt-1 text-[11px] font-mono-num text-slate-400 select-none z-20">
                <span>09:41</span>
                {/* Camera punch hole */}
                <div className="w-3.5 h-3.5 rounded-full bg-slate-950 border border-slate-800" />
                <div className="flex items-center gap-1.5 text-[10px]">
                  <Signal className="w-3 h-3 text-slate-300" />
                  <Wifi className="w-3 h-3 text-slate-300" />
                  <BatteryCharging className="w-3 h-3 text-emerald-400" />
                </div>
              </div>

              {/* App Internal Header */}
              <div className="px-4 py-2 bg-[#090d18] border-b border-amber-500/20 flex items-center justify-between z-10 shrink-0">
                <BrandLogo size="sm" showText={true} />
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 font-mono-num">
                  SIMULATION
                </span>
              </div>

              {/* Mobile View Screen Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {mobileScreen === 'home' && (
                  <>
                    {/* 10M Progress Banner */}
                    <div className="p-3.5 bg-gradient-to-br from-slate-900 to-[#101728] border border-amber-500/40 rounded-2xl">
                      <div className="text-[10px] uppercase tracking-wider text-amber-400 font-bold mb-1">
                        10,000,000 Capacity Target
                      </div>
                      <div className="text-lg font-black font-mono-num text-slate-100">
                        9,998,420 <span className="text-xs font-normal text-slate-400">/ 10M</span>
                      </div>
                      <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800 my-2">
                        <div className="h-full bg-amber-400 w-[99.98%]" />
                      </div>
                      <button
                        onClick={onSimulateEntry}
                        className="w-full py-2 bg-gradient-to-r from-amber-300 to-amber-500 text-black text-xs font-bold rounded-xl mt-1 flex items-center justify-center gap-1.5 shadow"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Simulate Entry (₹1,000)</span>
                      </button>
                    </div>

                    {/* Featured Top Grand Prize Card */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3">
                      <div className="text-[10px] font-mono-num text-amber-400 font-bold mb-1">
                        RANKS 1–10 · 10 UNITS
                      </div>
                      <h4 className="text-xs font-bold text-slate-100 mb-2">
                        Lamborghini Revuelto V12 Hybrid
                      </h4>
                      <VehicleArtwork
                        category="Supercar"
                        title="Lamborghini Revuelto"
                        className="h-28 mb-2"
                      />
                      <div className="flex items-center justify-between text-[11px] pt-1">
                        <span className="text-slate-400">Est. Showroom</span>
                        <span className="text-amber-400 font-bold font-mono-num">₹8.89 Cr</span>
                      </div>
                    </div>

                    {/* Rolls-Royce Ghost Card */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3">
                      <div className="text-[10px] font-mono-num text-amber-400 font-bold mb-1">
                        RANKS 11–20 · 10 UNITS
                      </div>
                      <h4 className="text-xs font-bold text-slate-100 mb-2">
                        Rolls-Royce Ghost Series II
                      </h4>
                      <VehicleArtwork
                        category="Luxury Car"
                        title="Rolls-Royce Ghost"
                        className="h-28 mb-2"
                      />
                      <div className="flex items-center justify-between text-[11px] pt-1">
                        <span className="text-slate-400">Est. Showroom</span>
                        <span className="text-amber-400 font-bold font-mono-num">₹7.95 Cr</span>
                      </div>
                    </div>
                  </>
                )}

                {mobileScreen === 'tickets' && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-100">My Simulated Tickets</h4>
                    <div className="p-3 bg-slate-900 border border-amber-500/30 rounded-xl space-y-1 text-[11px] font-mono-num">
                      <div className="text-amber-400 font-bold">TKT-2026-8812-C4B1</div>
                      <div className="text-slate-400">Anonymous ID: LZ-84920419</div>
                      <div className="text-emerald-400">Status: Eligible for 100 Grand Draws</div>
                    </div>
                  </div>
                )}

                {mobileScreen === 'wallet' && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-100">Reward Coins</h4>
                    <div className="p-4 bg-slate-900 border border-amber-500/40 rounded-xl text-center">
                      <div className="text-2xl font-bold font-mono-num text-amber-300">200 Coins</div>
                      <div className="text-[11px] text-slate-400 mt-1">₹200 Simulated Value</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Android Bottom Navigation Bar */}
              <div className="h-14 bg-[#090d18] border-t border-slate-800 flex items-center justify-around px-2 text-[10px] text-slate-400 shrink-0">
                <button
                  onClick={() => setMobileScreen('home')}
                  className={`flex flex-col items-center gap-0.5 ${mobileScreen === 'home' ? 'text-amber-400 font-bold' : ''}`}
                >
                  <Trophy className="w-4 h-4" />
                  <span>Prizes</span>
                </button>
                <button
                  onClick={() => setMobileScreen('tickets')}
                  className={`flex flex-col items-center gap-0.5 ${mobileScreen === 'tickets' ? 'text-amber-400 font-bold' : ''}`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Tickets</span>
                </button>
                <button
                  onClick={() => setMobileScreen('wallet')}
                  className={`flex flex-col items-center gap-0.5 ${mobileScreen === 'wallet' ? 'text-amber-400 font-bold' : ''}`}
                >
                  <Coins className="w-4 h-4" />
                  <span>Wallet</span>
                </button>
              </div>

              {/* Android Home Indicator Bar */}
              <div className="h-4 bg-[#090d18] flex items-center justify-center">
                <div className="w-24 h-1 bg-slate-600 rounded-full" />
              </div>
            </div>
          ) : (
            /* Flutter Code and Instructions */
            <div className="w-full h-full flex flex-col text-xs font-mono">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <span className="text-amber-400 font-bold">
                  lib/main.dart (Flutter SDK 3.19+ / Dart 3.3+)
                </span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied!' : 'Copy Flutter Source'}</span>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto bg-slate-950 p-4 rounded-xl border border-slate-800 text-slate-300 text-[11px] leading-relaxed">
                <pre>{flutterSource}</pre>
              </div>

              <div className="mt-3 p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <span className="font-bold text-slate-200">Android Build & Deployment Commands:</span>
                <div>1. <code className="text-amber-300">flutter create luckyzilla_app</code></div>
                <div>2. <code className="text-amber-300">cd luckyzilla_app && flutter pub add http crypto google_fonts</code></div>
                <div>3. <code className="text-amber-300">flutter run -d android</code> (Debug on connected Android device / emulator)</div>
                <div>4. <code className="text-amber-300">flutter build apk --release</code> (Build signed production APK)</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
