import React, { useState } from 'react';
import { PrizeItem, Language } from '../types';
import { translations } from '../i18n';
import { VehicleArtwork } from './VehicleArtwork';
import { ShieldCheck, Info, FileText, Truck, Percent, ChevronRight, X } from 'lucide-react';

interface PrizeCatalogueProps {
  prizes: PrizeItem[];
  lang: Language;
}

export const PrizeCatalogue: React.FC<PrizeCatalogueProps> = ({ prizes, lang }) => {
  const t = translations[lang];
  const [selectedPrize, setSelectedPrize] = useState<PrizeItem | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: lang === 'en' ? 'All 100 Prizes' : 'सभी 100 पुरस्कार' },
    { id: 'Supercar', label: lang === 'en' ? 'Supercars (1-10)' : 'सुपरकार्स (1-10)' },
    { id: 'Luxury Car', label: lang === 'en' ? 'Ultra Luxury (11-20)' : 'अल्ट्रा लक्जरी (11-20)' },
    { id: 'Premium SUV', label: lang === 'en' ? 'Premium SUVs (21-60)' : 'प्रीमियम एसयूवी (21-60)' },
    { id: 'Superbike', label: lang === 'en' ? 'Superbikes (61-70)' : 'सुपरबाइक्स (61-70)' },
    { id: 'Electric SUV', label: lang === 'en' ? 'EVs (71-80)' : 'ईवी (71-80)' },
    { id: 'Classic Motorcycle', label: lang === 'en' ? 'Classics (81-100)' : 'क्लासिक्स (81-100)' },
  ];

  const filteredPrizes =
    filterCategory === 'all'
      ? prizes
      : prizes.filter(p => p.category === filterCategory);

  const formatINR = (val: number) => {
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    }
    if (val >= 100000) {
      return `₹${(val / 100000).toFixed(2)} Lakh`;
    }
    return `₹${val.toLocaleString('en-IN')}`;
  };

  return (
    <section id="fleet" className="py-12 px-4 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="text-xs uppercase tracking-widest text-amber-400 font-semibold mb-1">
            {lang === 'en' ? 'OFFICIAL PRIZE SCHEDULE' : 'आधिकारिक पुरस्कार अनुसूची'}
          </div>
          <h2 className="text-2xl lg:text-3xl font-luxury font-black text-slate-100">
            {t.prizesSection.title}
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            {t.prizesSection.subtitle}
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-slate-900 border border-slate-800 rounded-xl shrink-0">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                filterCategory === cat.id
                  ? 'bg-amber-400 text-black font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Prize Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPrizes.map(prize => (
          <div
            key={prize.id}
            onClick={() => setSelectedPrize(prize)}
            className="group cursor-pointer bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-4 transition-all duration-300 flex flex-col justify-between shadow-lg hover:shadow-amber-500/10"
          >
            <div>
              {/* Artwork Container */}
              <div className="mb-4">
                <VehicleArtwork
                  category={prize.category}
                  title={prize.title}
                  accentColor={prize.accentColor}
                />
              </div>

              {/* Ranks & Category Kickers (Zero-Pill Typographic Separator) */}
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1.5">
                <span className="font-mono-num bg-amber-400/10 px-2 py-0.5 rounded text-amber-300 border border-amber-400/30">
                  {prize.rankRange}
                </span>
                <span aria-hidden="true">·</span>
                <span className="text-slate-400">{prize.count} {t.prizesSection.units}</span>
                <span aria-hidden="true">·</span>
                <span className="text-slate-400">{prize.category}</span>
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-slate-100 group-hover:text-amber-300 transition-colors line-clamp-1">
                {lang === 'hi' ? prize.titleHi : prize.title}
              </h3>

              {/* Specs preview */}
              <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                {lang === 'hi' ? prize.specsHi : prize.specs}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-500 block text-[11px] uppercase">
                  {t.prizesSection.estimatedValue}
                </span>
                <span className="text-base font-bold text-gold-gradient font-mono-num">
                  {formatINR(prize.estimatedValueINR)}
                </span>
              </div>

              <div className="flex items-center gap-1 text-amber-400 group-hover:translate-x-1 transition-transform font-medium">
                <span>{lang === 'en' ? 'Details' : 'विवरण'}</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Published Disclosure */}
      <div className="mt-8 p-4 bg-slate-900/50 border border-slate-800 rounded-xl text-xs text-slate-400 leading-relaxed flex items-start gap-3">
        <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-300">
            {lang === 'en' ? 'Prize Integrity & Ownership Disclosure: ' : 'इनाम अखंडता एवं स्वामित्व प्रकटीकरण: '}
          </span>
          {t.prizesSection.ownershipDisclosure}
        </div>
      </div>

      {/* Prize Details Modal */}
      {selectedPrize && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-amber-500/40 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setSelectedPrize(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Vehicle Artwork */}
            <div className="mb-5">
              <VehicleArtwork
                category={selectedPrize.category}
                title={selectedPrize.title}
                accentColor={selectedPrize.accentColor}
              />
            </div>

            {/* Modal Title & Ranks */}
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1">
              <span className="font-mono-num px-2 py-0.5 rounded bg-amber-400/20 border border-amber-400/30">
                {selectedPrize.rankRange}
              </span>
              <span>·</span>
              <span>{selectedPrize.count} {t.prizesSection.units} Allocated</span>
            </div>

            <h3 className="text-xl lg:text-2xl font-luxury font-bold text-slate-100 mb-2">
              {lang === 'hi' ? selectedPrize.titleHi : selectedPrize.title}
            </h3>

            <div className="flex items-center gap-3 mb-6">
              <div className="text-sm text-slate-400">
                {t.prizesSection.estimatedValue}:
              </div>
              <div className="text-xl font-black text-gold-gradient font-mono-num">
                {formatINR(selectedPrize.estimatedValueINR)} each
              </div>
            </div>

            {/* Detail Blocks */}
            <div className="space-y-4 text-xs">
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2 text-amber-400 font-semibold mb-1">
                  <FileText className="w-4 h-4" />
                  <span>{t.prizesSection.viewSpecs}</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  {lang === 'hi' ? selectedPrize.specsHi : selectedPrize.specs}
                </p>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2 text-blue-400 font-semibold mb-1">
                  <Truck className="w-4 h-4" />
                  <span>{t.prizesSection.deliveryTerms}</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  {selectedPrize.deliveryTerms}
                </p>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-1">
                  <Percent className="w-4 h-4" />
                  <span>{t.prizesSection.taxCompliance}</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  {selectedPrize.tdsApplicable}
                </p>
              </div>

              <div className="p-3.5 bg-amber-500/10 rounded-xl border border-amber-500/30 flex items-center justify-between">
                <div>
                  <div className="text-amber-300 font-semibold">
                    {t.prizesSection.statusLabel}
                  </div>
                  <div className="text-slate-400 mt-0.5">
                    {selectedPrize.docStatus}
                  </div>
                </div>
                <ShieldCheck className="w-6 h-6 text-amber-400 shrink-0" />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedPrize(null)}
                className="px-5 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
              >
                {lang === 'en' ? 'Close' : 'बंद करें'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
