import React from 'react';

interface STOU48LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
}

export const STOU48Logo: React.FC<STOU48LogoProps> = ({ className = 'w-48 h-auto', variant = 'light' }) => {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 600 380"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xs"
      >
        <defs>
          {/* Gold Gradient */}
          <linearGradient id="stouGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4AF37" />
            <stop offset="50%" stopColor="#C59B27" />
            <stop offset="100%" stopColor="#B38918" />
          </linearGradient>

          {/* Green Gradient */}
          <linearGradient id="stouGreenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0B7A42" />
            <stop offset="100%" stopColor="#005A2B" />
          </linearGradient>
        </defs>

        {/* 4 - Top Gold Triangle */}
        <polygon
          points="70,270 210,135 210,270"
          fill="url(#stouGoldGrad)"
        />

        {/* 4 - Bottom Green Arc/Sector */}
        <path
          d="M 70 270 A 140 140 0 0 1 210 205 L 210 270 Z"
          fill="url(#stouGreenGrad)"
        />

        {/* 4 - Main Tall Green Pillar with slant cut at top */}
        <path
          d="M 223,315 L 223,122 L 295,58 L 295,315 Z"
          fill="url(#stouGreenGrad)"
        />

        {/* 4 - Small connector horizontal stem on right */}
        <rect
          x="308"
          y="205"
          width="19"
          height="67"
          fill="url(#stouGreenGrad)"
        />

        {/* Thai Text: มสธ. below the 4 */}
        <text
          x="68"
          y="354"
          fontFamily="'Prompt', 'Noto Sans Thai', sans-serif"
          fontWeight="900"
          fontSize="48"
          fill="url(#stouGoldGrad)"
          letterSpacing="1"
        >
          มสธ.
        </text>

        {/* 8 - Stylized Double-loop Infinity Number 8 in Gold */}
        <g fill="url(#stouGoldGrad)">
          {/* Outer 8 Shape using smooth bezier paths */}
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M 425 60 C 375 60 335 100 335 150 C 335 186 358 215 390 228 C 352 243 325 278 325 320 C 325 375 375 420 435 420 C 495 420 545 375 545 320 C 545 278 518 243 480 228 C 512 215 535 186 535 150 C 535 100 495 60 445 60 Z M 435 98 C 465 98 488 121 488 150 C 488 179 465 202 435 202 C 405 202 382 179 382 150 C 382 121 405 98 435 98 Z M 435 250 C 472 250 500 279 500 318 C 500 357 472 384 435 384 C 398 384 370 357 370 318 C 370 279 398 250 435 250 Z"
            transform="matrix(0.85 0 0 0.85 55 -2)"
          />
        </g>

        {/* Thai Text: ปี at the top-right of 8 */}
        <text
          x="490"
          y="92"
          fontFamily="'Prompt', 'Noto Sans Thai', sans-serif"
          fontWeight="900"
          fontSize="36"
          fill="url(#stouGoldGrad)"
        >
          ปี
        </text>
      </svg>
    </div>
  );
};
