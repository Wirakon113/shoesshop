import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  white?: boolean;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  white = false,
  showText = true,
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const textSizes = {
    sm: 'text-base tracking-tighter',
    md: 'text-xl tracking-tighter',
    lg: 'text-2xl sm:text-3xl tracking-tighter',
    xl: 'text-3xl sm:text-4xl tracking-tighter',
  };

  const primaryColor = white ? '#ffffff' : '#000000';
  const bgColor = white ? '#000000' : '#ffffff';

  return (
    <Link
      to="/"
      id="brand-logo-link"
      className={`inline-flex items-center gap-3 font-bold uppercase transition-opacity hover:opacity-85 group select-none ${className}`}
    >
      {/* Circular Sneaker Icon from User Design */}
      <div
        className={`${iconSizes[size]} shrink-0 flex items-center justify-center transition-transform group-hover:scale-105 duration-300`}
        style={{ color: primaryColor }}
      >
        <svg
          viewBox="0 0 500 500"
          className="w-full h-full"
          style={{ ['--bg-color' as any]: bgColor }}
        >
          {/* Circle Outline */}
          <circle
            cx="250"
            cy="240"
            r="165"
            fill="none"
            stroke="currentColor"
            strokeWidth="18"
          />

          {/* Horizontal Ground Line */}
          <line
            x1="70"
            y1="330"
            x2="430"
            y2="330"
            stroke="currentColor"
            strokeWidth="16"
            strokeLinecap="round"
          />

          {/* Sneaker Silhouette */}
          <g fill="currentColor">
            {/* Main Shoe Body */}
            <path d="M110,270 C105,245 115,220 128,195 C138,180 156,180 166,200 C175,220 190,230 212,205 C226,170 240,165 255,170 C270,180 290,215 315,235 C345,255 385,260 415,275 C425,280 425,295 415,300 C395,305 370,305 340,300 C270,290 190,285 130,290 C115,290 112,280 110,270 Z" />

            {/* Inner Collar Curve */}
            <path
              d="M135,208 C145,195 155,200 160,215 C165,235 185,245 220,205 C235,185 245,180 255,185 C250,200 240,225 215,245 C190,265 160,265 140,250 Z"
              fill={bgColor}
            />

            {/* Eyelets Details */}
            <path d="M250,195 L265,205 L255,215 L240,205 Z" fill={bgColor} />
            <path d="M268,210 L283,220 L273,230 L258,220 Z" fill={bgColor} />
            <path d="M286,225 L301,235 L291,245 L276,235 Z" fill={bgColor} />
            <path d="M304,240 L319,250 L309,260 L294,250 Z" fill={bgColor} />

            {/* Dynamic Geometric Accent Stripe */}
            <path
              d="M165,240 C200,240 230,230 270,255 L245,290 L220,290 C180,275 160,255 165,240 Z"
              fill={bgColor}
            />

            {/* Midsole Wave */}
            <path
              d="M95,285 C100,270 120,280 145,285 C220,295 320,300 395,290 C420,285 425,295 410,310 C380,330 330,330 250,325 C170,320 120,335 100,320 C90,310 90,295 95,285 Z"
              fill={bgColor}
              stroke="currentColor"
              strokeWidth="6"
            />

            {/* Outsole Base Grounding */}
            <path
              d="M100,320 C120,335 170,320 250,325 C330,330 380,330 410,310 C418,318 410,330 380,335 C320,342 220,340 140,335 C110,332 95,326 100,320 Z"
              fill="currentColor"
            />
          </g>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span
            className={`font-black ${textSizes[size]} ${
              white ? 'text-white' : 'text-black'
            } leading-none font-display`}
          >
            SHOES SHOP
          </span>
        </div>
      )}
    </Link>
  );
};
