import React from 'react';

interface VehicleArtworkProps {
  category: 'Supercar' | 'Luxury Car' | 'Premium SUV' | 'Superbike' | 'Electric SUV' | 'Classic Motorcycle';
  title: string;
  className?: string;
  accentColor?: string;
}

export const VehicleArtwork: React.FC<VehicleArtworkProps> = ({
  category,
  title,
  className = '',
  accentColor = '#d4af37',
}) => {
  return (
    <div
      className={`relative w-full aspect-[16/10] bg-gradient-to-b from-[#0e1424] via-[#090d18] to-[#04060a] rounded-xl overflow-hidden border border-slate-800/80 group-hover:border-amber-500/40 transition-all duration-300 flex items-center justify-center ${className}`}
    >
      {/* Background Radial Glow */}
      <div
        className="absolute inset-0 opacity-25 group-hover:opacity-40 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 65%, ${accentColor} 0%, transparent 65%)`,
        }}
      />

      {/* Grid Floor Perspective */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_40%,rgba(212,175,55,0.06)_100%)] pointer-events-none" />

      {/* SVG Vector Render */}
      <div className="relative w-4/5 h-4/5 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
        {category === 'Supercar' && (
          // Lamborghini Supercar Silhouette
          <svg viewBox="0 0 360 160" className="w-full h-full drop-shadow-[0_12px_24px_rgba(212,175,55,0.35)]" fill="none">
            {/* Ground shadow */}
            <ellipse cx="180" cy="142" rx="150" ry="12" fill="#000000" opacity="0.8" />
            {/* Wheels */}
            <circle cx="82" cy="126" r="22" fill="#111" stroke="#e5c07b" strokeWidth="2.5" />
            <circle cx="82" cy="126" r="10" fill="#222" stroke="#d4af37" strokeWidth="1.5" />
            <circle cx="280" cy="126" r="22" fill="#111" stroke="#e5c07b" strokeWidth="2.5" />
            <circle cx="280" cy="126" r="10" fill="#222" stroke="#d4af37" strokeWidth="1.5" />
            {/* Lamborghini body curves */}
            <path
              d="M 28 132 L 62 126 C 66 112 78 104 94 104 C 108 104 120 114 124 126 L 244 126 C 248 112 260 104 276 104 C 290 104 302 114 306 126 L 338 126 L 348 118 L 340 102 L 310 94 L 270 78 L 220 54 L 140 54 L 95 78 L 48 108 L 26 124 Z"
              fill="url(#supercarGradient)"
              stroke="#e5c07b"
              strokeWidth="1.8"
            />
            {/* Windshield & Cabin */}
            <path
              d="M 144 58 L 214 58 L 262 78 L 105 78 Z"
              fill="#060913"
              stroke="#e5c07b"
              strokeWidth="1"
              strokeOpacity="0.7"
            />
            {/* Aerodynamic Air Intake & Creases */}
            <path d="M 230 84 L 268 84 L 254 104 L 218 104 Z" fill="#05070e" stroke="#d4af37" strokeWidth="1" />
            <line x1="42" y1="112" x2="110" y2="92" stroke="#fde047" strokeWidth="1.2" strokeOpacity="0.8" />
            {/* Headlamp Y-Signature */}
            <path d="M 46 114 L 62 114 L 54 120 Z" fill="#fff" filter="drop-shadow(0 0 6px #fde047)" />
            <defs>
              <linearGradient id="supercarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="30%" stopColor="#b45309" />
                <stop offset="55%" stopColor="#d4af37" />
                <stop offset="80%" stopColor="#78350f" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
            </defs>
          </svg>
        )}

        {category === 'Luxury Car' && (
          // Rolls-Royce Stately Sedan Silhouette
          <svg viewBox="0 0 360 160" className="w-full h-full drop-shadow-[0_12px_24px_rgba(212,175,55,0.35)]" fill="none">
            <ellipse cx="180" cy="142" rx="160" ry="12" fill="#000" opacity="0.85" />
            <circle cx="78" cy="124" r="23" fill="#0b0f19" stroke="#d4af37" strokeWidth="3" />
            <circle cx="78" cy="124" r="9" fill="#1e293b" stroke="#fff" strokeWidth="1.5" />
            <circle cx="282" cy="124" r="23" fill="#0b0f19" stroke="#d4af37" strokeWidth="3" />
            <circle cx="282" cy="124" r="9" fill="#1e293b" stroke="#fff" strokeWidth="1.5" />
            {/* Stately Body & Pantheon Grille */}
            <path
              d="M 24 126 L 56 124 C 60 110 72 101 88 101 C 104 101 116 110 120 124 L 244 124 C 248 110 260 101 276 101 C 292 101 304 110 308 124 L 344 124 L 344 102 L 328 88 L 290 84 L 246 54 L 142 54 L 102 78 L 48 88 L 24 92 Z"
              fill="url(#rrGradient)"
              stroke="#d4af37"
              strokeWidth="2"
            />
            {/* Stately Windows */}
            <path d="M 146 58 L 242 58 L 282 82 L 108 82 Z" fill="#030712" stroke="#d4af37" strokeWidth="1" />
            {/* Spirit of Ecstasy Emblem Tip */}
            <circle cx="24" cy="88" r="3" fill="#fff" filter="drop-shadow(0 0 4px #fff)" />
            {/* Hand-painted Coachline */}
            <line x1="28" y1="92" x2="340" y2="92" stroke="#fde047" strokeWidth="1" strokeOpacity="0.8" />
            <defs>
              <linearGradient id="rrGradient" x1="0%" y1="0%" x2="100%" y2="50%">
                <stop offset="0%" stopColor="#0b132b" />
                <stop offset="50%" stopColor="#1c2541" />
                <stop offset="100%" stopColor="#0b132b" />
              </linearGradient>
            </defs>
          </svg>
        )}

        {(category === 'Premium SUV' || category === 'Electric SUV') && (
          // Fortuner / Thar / Nexon Rugged SUV Silhouette
          <svg viewBox="0 0 360 160" className="w-full h-full drop-shadow-[0_12px_24px_rgba(56,189,248,0.3)]" fill="none">
            <ellipse cx="180" cy="144" rx="155" ry="12" fill="#000" opacity="0.8" />
            {/* Massive off-road wheels */}
            <circle cx="82" cy="120" r="25" fill="#111" stroke="#38bdf8" strokeWidth="3" />
            <circle cx="82" cy="120" r="12" fill="#222" stroke="#d4af37" strokeWidth="1.5" />
            <circle cx="278" cy="120" r="25" fill="#111" stroke="#38bdf8" strokeWidth="3" />
            <circle cx="278" cy="120" r="12" fill="#222" stroke="#d4af37" strokeWidth="1.5" />
            {/* High stance SUV body */}
            <path
              d="M 28 120 L 56 118 C 60 102 74 92 92 92 C 110 92 124 102 128 118 L 238 118 C 242 102 256 92 274 92 C 292 92 306 102 310 118 L 340 118 L 344 88 L 324 50 L 260 42 L 138 42 L 86 64 L 42 78 L 28 92 Z"
              fill="url(#suvGradient)"
              stroke="#38bdf8"
              strokeWidth="2"
            />
            {/* Tall SUV Glasshouse */}
            <path d="M 142 48 L 256 48 L 316 54 L 320 74 L 92 74 Z" fill="#040814" stroke="#38bdf8" strokeWidth="1" />
            {/* Roof Rails */}
            <line x1="140" y1="38" x2="264" y2="38" stroke="#d4af37" strokeWidth="2.5" strokeLinecap="round" />
            {/* Quad LED lights */}
            <path d="M 32 82 L 48 82 L 40 88 Z" fill="#38bdf8" filter="drop-shadow(0 0 6px #38bdf8)" />
            <defs>
              <linearGradient id="suvGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0f172a" />
                <stop offset="40%" stopColor="#1e293b" />
                <stop offset="70%" stopColor="#334155" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
            </defs>
          </svg>
        )}

        {(category === 'Superbike' || category === 'Classic Motorcycle') && (
          // Kawasaki Ninja / Royal Enfield Bullet Silhouette
          <svg viewBox="0 0 360 160" className="w-full h-full drop-shadow-[0_12px_24px_rgba(16,185,129,0.3)]" fill="none">
            <ellipse cx="180" cy="142" rx="140" ry="10" fill="#000" opacity="0.8" />
            {/* Wheels with spokes */}
            <circle cx="76" cy="116" r="26" fill="#050810" stroke="#10b981" strokeWidth="2.5" />
            <circle cx="76" cy="116" r="10" fill="#1e293b" stroke="#d4af37" strokeWidth="1.5" />
            <circle cx="284" cy="116" r="26" fill="#050810" stroke="#10b981" strokeWidth="2.5" />
            <circle cx="284" cy="116" r="10" fill="#1e293b" stroke="#d4af37" strokeWidth="1.5" />
            {/* Chassis & Teardrop Tank / Fairing */}
            <path
              d="M 80 114 L 140 98 L 175 62 L 210 62 L 235 84 L 280 114"
              stroke="#d4af37"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Engine block */}
            <rect x="145" y="90" width="40" height="32" rx="4" fill="#1e293b" stroke="#fff" strokeWidth="1" />
            {/* Fuel Tank */}
            <path
              d="M 160 62 C 160 52 180 48 200 48 C 218 48 226 56 226 64 C 226 72 206 76 175 74 Z"
              fill="#10b981"
              stroke="#fde047"
              strokeWidth="2"
            />
            {/* Handlebars & Exhaust */}
            <line x1="220" y1="52" x2="235" y2="40" stroke="#d4af37" strokeWidth="3" strokeLinecap="round" />
            <path d="M 160 120 L 260 120 L 290 105" stroke="#f1f5f9" strokeWidth="3.5" strokeLinecap="round" />
            {/* Spotlight Lamp */}
            <circle cx="240" cy="54" r="6" fill="#fff" filter="drop-shadow(0 0 8px #fde047)" />
          </svg>
        )}
      </div>

      {/* Luxury Spec Watermark Overlay */}
      <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] text-slate-400 font-mono-num bg-slate-950/70 backdrop-blur-md px-2.5 py-1 rounded border border-slate-800/80">
        <span className="text-amber-400 font-semibold">{category}</span>
        <span className="truncate max-w-[200px] text-slate-300">{title.split(' ')[1] || title}</span>
        <span className="text-slate-400">100% Verified Spec</span>
      </div>
    </div>
  );
};
