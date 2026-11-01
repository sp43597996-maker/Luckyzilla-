import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Luxury Automotive Hexagon Shield Icon */}
      <div className={`relative ${iconSizes[size]} shrink-0 flex items-center justify-center`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-[0_0_12px_rgba(212,175,55,0.4)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="goldHexBorder" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="35%" stopColor="#d4af37" />
              <stop offset="70%" stopColor="#996515" />
              <stop offset="100%" stopColor="#fef08a" />
            </linearGradient>
            <linearGradient id="innerShieldBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#111827" />
              <stop offset="100%" stopColor="#030712" />
            </linearGradient>
            <linearGradient id="zEmblemGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="30%" stopColor="#fde047" />
              <stop offset="70%" stopColor="#d4af37" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
          </defs>

          {/* Outer Shield Hexagon */}
          <polygon
            points="50,4 92,26 92,74 50,96 8,74 8,26"
            fill="url(#innerShieldBg)"
            stroke="url(#goldHexBorder)"
            strokeWidth="3.5"
          />

          {/* Inner Accent Hairline */}
          <polygon
            points="50,11 85,29 85,71 50,89 15,71 15,29"
            fill="none"
            stroke="url(#goldHexBorder)"
            strokeWidth="1"
            strokeOpacity="0.4"
          />

          {/* Aerodynamic Speed Slits */}
          <line x1="28" y1="28" x2="38" y2="28" stroke="url(#goldHexBorder)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="62" y1="72" x2="72" y2="72" stroke="url(#goldHexBorder)" strokeWidth="1.5" strokeLinecap="round" />

          {/* Bold Automotive 'Z' Core Emblem */}
          <path
            d="M 32 36 L 68 36 L 42 64 L 68 64 L 68 68 L 32 68 L 58 40 L 32 40 Z"
            fill="url(#zEmblemGold)"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className={`font-luxury font-black tracking-wider text-slate-100 ${textSizes[size]}`}>
            LUCKY<span className="text-gold-gradient">ZILLA</span>
          </span>
        </div>
      )}
    </div>
  );
};
