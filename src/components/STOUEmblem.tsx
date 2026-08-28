import React from 'react';

interface STOUEmblemProps {
  className?: string;
}

/**
 * Official STOU Seal Emblem (ตราสัญลักษณ์ มหาวิทยาลัยสุโขทัยธรรมาธิราช)
 * พระแสงศรสามองค์ ประดิษฐานบนบุษบก ภายใต้พระมหาพิชัยมงกุฎและเปลวรัศมี พร้อมแถบชื่อมหาวิทยาลัย
 */
export const STOUEmblem: React.FC<STOUEmblemProps> = ({ className = 'w-16 h-auto' }) => {
  return (
    <svg
      viewBox="0 0 500 660"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="ตราสัญลักษณ์ มหาวิทยาลัยสุโขทัยธรรมาธิราช"
    >
      <defs>
        <linearGradient id="emblemGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E5C158" />
          <stop offset="50%" stopColor="#C59B27" />
          <stop offset="100%" stopColor="#9C7714" />
        </linearGradient>
        <linearGradient id="emblemGreen" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0B7A42" />
          <stop offset="100%" stopColor="#004D28" />
        </linearGradient>
        <filter id="goldGlow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#9C7714" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Outer Lotus / Flame Bud Green Outline */}
      <path
        d="M250 65 C240 110, 200 210, 160 300 C110 410, 115 500, 250 560 C385 500, 390 410, 340 300 C300 210, 260 110, 250 65 Z"
        stroke="url(#emblemGreen)"
        strokeWidth="10"
        strokeLinejoin="round"
        fill="#FFFFFF"
      />

      {/* Outer Flame Spikes */}
      <path
        d="M250 35 L250 70 M250 35 C246 50, 240 60, 235 72 M250 35 C254 50, 260 60, 265 72"
        stroke="url(#emblemGreen)"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        d="M175 260 C165 245, 150 255, 145 270 C140 285, 155 295, 165 300
           M140 350 C125 340, 115 360, 120 375 C125 390, 145 395, 155 390
           M325 260 C335 245, 350 255, 355 270 C360 285, 345 295, 335 300
           M360 350 C375 340, 385 360, 380 375 C375 390, 355 395, 345 390"
        stroke="url(#emblemGreen)"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />

      {/* Inner Decorative Green Border */}
      <path
        d="M250 95 C242 135, 210 220, 175 300 C135 395, 140 475, 250 525 C360 475, 365 395, 325 300 C290 220, 258 135, 250 95 Z"
        stroke="url(#emblemGreen)"
        strokeWidth="3.5"
        strokeDasharray="8 4"
        fill="none"
      />

      {/* Central Golden Crown Spire & Canopy */}
      <g filter="url(#goldGlow)">
        {/* Crown Top Spire */}
        <polygon points="250,180 244,230 256,230" fill="url(#emblemGold)" />
        <ellipse cx="250" cy="235" rx="14" ry="6" fill="url(#emblemGold)" />
        <polygon points="250,240 236,290 264,290" fill="url(#emblemGold)" />
        
        {/* Tiered Crown Ornaments */}
        <path
          d="M230 290 L270 290 L278 315 L222 315 Z"
          fill="url(#emblemGold)"
          stroke="#9C7714"
          strokeWidth="1.5"
        />
        <circle cx="250" cy="270" r="4" fill="#FFFFFF" />
        <polygon points="250,250 243,260 257,260" fill="#FFFFFF" />

        {/* Central Lotus & Throne Frame */}
        <path
          d="M210 320 L290 320 L295 345 C280 365, 220 365, 205 345 Z"
          fill="url(#emblemGold)"
        />

        {/* Royal Throne Square Frame (บุษบก) */}
        <rect
          x="195"
          y="348"
          width="110"
          height="105"
          rx="4"
          fill="none"
          stroke="url(#emblemGold)"
          strokeWidth="9"
        />
        
        {/* 3 Horizontal Royal Tier Bars */}
        <line x1="200" y1="380" x2="300" y2="380" stroke="url(#emblemGold)" strokeWidth="6" />
        <line x1="200" y1="415" x2="300" y2="415" stroke="url(#emblemGold)" strokeWidth="6" />

        {/* 3 Royal Arrows (พระแสงศร 3 องค์) */}
        {/* Left Arrowheads */}
        <polygon points="195,380 165,370 172,380 165,390" fill="url(#emblemGold)" />
        <polygon points="195,415 165,405 172,415 165,425" fill="url(#emblemGold)" />
        <polygon points="195,445 165,435 172,445 165,455" fill="url(#emblemGold)" />

        {/* Right Arrow Feathers */}
        <polygon points="305,372 335,365 325,380 335,395 305,388" fill="url(#emblemGold)" />
        <polygon points="305,407 335,400 325,415 335,430 305,423" fill="url(#emblemGold)" />
        <polygon points="305,437 335,430 325,445 335,460 305,453" fill="url(#emblemGold)" />

        {/* Throne Base Pedestal */}
        <polygon points="180,455 320,455 330,475 170,475" fill="url(#emblemGold)" />
        <polygon points="190,475 310,475 300,488 200,488" fill="url(#emblemGold)" />
      </g>

      {/* Ribbon Banner at Bottom with University Name */}
      <g>
        {/* Ribbon Shape */}
        <path
          d="M105 520 C180 500, 320 500, 395 520 L410 560 C330 540, 170 540, 90 560 Z"
          fill="#FFFFFF"
          stroke="url(#emblemGreen)"
          strokeWidth="7"
          strokeLinejoin="round"
        />
        {/* Ribbon Tails */}
        <path
          d="M90 560 L60 510 L105 520 L80 540 Z
             M410 560 L440 510 L395 520 L420 540 Z"
          fill="#FFFFFF"
          stroke="url(#emblemGreen)"
          strokeWidth="5"
          strokeLinejoin="round"
        />
        {/* Ribbon Fold Lines */}
        <path
          d="M250 550 L250 575 L235 565 M250 575 L265 565"
          stroke="url(#emblemGreen)"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </g>

      {/* University Text in Ribbon */}
      <text
        x="250"
        y="530"
        textAnchor="middle"
        fontSize="17"
        fontWeight="800"
        fill="#004D28"
        fontFamily="'Prompt', 'Sarabun', sans-serif"
      >
        มหาวิทยาลัย
      </text>
      <text
        x="250"
        y="549"
        textAnchor="middle"
        fontSize="17"
        fontWeight="900"
        fill="#004D28"
        fontFamily="'Prompt', 'Sarabun', sans-serif"
      >
        สุโขทัยธรรมาธิราช
      </text>
    </svg>
  );
};
