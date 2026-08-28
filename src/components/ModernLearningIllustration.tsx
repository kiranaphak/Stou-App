import React from 'react';

interface ModernLearningIllustrationProps {
  className?: string;
}

export const ModernLearningIllustration: React.FC<ModernLearningIllustrationProps> = ({
  className = 'w-full h-auto',
}) => {
  return (
    <svg
      viewBox="0 0 600 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="ภาพประกอบร่วมสมัย: เส้นทาง จุดเชื่อมต่อ โอกาส และการเรียนรู้"
    >
      <defs>
        <linearGradient id="pathGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#004D28" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#006837" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#E5C158" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="pathGradient2" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#E5C158" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#004D28" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#006837" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id="nodeGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF2B2" />
          <stop offset="100%" stopColor="#D4AF37" />
        </linearGradient>
        <linearGradient id="nodeGreen" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2E8B57" />
          <stop offset="100%" stopColor="#004D28" />
        </linearGradient>
        <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Subtle Background Geometry */}
      <rect width="600" height="240" rx="24" fill="#F4FAF6" />
      <circle cx="530" cy="50" r="100" fill="#E5C158" fillOpacity="0.08" />
      <circle cx="70" cy="180" r="80" fill="#004D28" fillOpacity="0.05" />

      {/* Dynamic Flowing Learning Pathways */}
      <path
        d="M30 150 C 120 180, 180 80, 300 110 C 420 140, 480 70, 570 90"
        stroke="url(#pathGradient1)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="6 6"
      />
      <path
        d="M30 120 C 140 60, 220 170, 330 140 C 440 110, 500 160, 570 130"
        stroke="url(#pathGradient2)"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M100 200 C 220 220, 260 90, 400 70 C 470 60, 510 110, 560 170"
        stroke="#006837"
        strokeWidth="1.5"
        strokeOpacity="0.3"
        strokeDasharray="4 4"
      />

      {/* Connecting Opportunity Nodes */}
      {/* Node 1: Start Point */}
      <g transform="translate(100, 150)">
        <circle cx="0" cy="0" r="16" fill="#FFFFFF" stroke="#004D28" strokeWidth="2.5" />
        <circle cx="0" cy="0" r="8" fill="url(#nodeGreen)" />
        <text x="0" y="28" textAnchor="middle" fontSize="10" fontWeight="700" fill="#004D28" fontFamily="'Prompt', sans-serif">
          จุดเริ่มต้น
        </text>
      </g>

      {/* Node 2: Upskill / Lifelong learning */}
      <g transform="translate(230, 85)" filter="url(#softGlow)">
        <circle cx="0" cy="0" r="18" fill="#FFFFFF" stroke="#D4AF37" strokeWidth="3" />
        <circle cx="0" cy="0" r="9" fill="url(#nodeGold)" />
        <text x="0" y="-24" textAnchor="middle" fontSize="10" fontWeight="700" fill="#8B6B15" fontFamily="'Prompt', sans-serif">
          สัมฤทธิบัตร
        </text>
      </g>

      {/* Node 3: Bachelor's Degree Hub */}
      <g transform="translate(360, 135)" filter="url(#softGlow)">
        <circle cx="0" cy="0" r="22" fill="#FFFFFF" stroke="#004D28" strokeWidth="3.5" />
        <circle cx="0" cy="0" r="12" fill="url(#nodeGreen)" />
        <text x="0" y="34" textAnchor="middle" fontSize="11" fontWeight="800" fill="#00381D" fontFamily="'Prompt', sans-serif">
          ปริญญาตรี มสธ.
        </text>
      </g>

      {/* Node 4: Master's / Doctoral / Career Growth */}
      <g transform="translate(490, 80)">
        <circle cx="0" cy="0" r="19" fill="#FFFFFF" stroke="#D4AF37" strokeWidth="3" />
        <circle cx="0" cy="0" r="10" fill="url(#nodeGold)" />
        <text x="0" y="-25" textAnchor="middle" fontSize="10" fontWeight="700" fill="#8B6B15" fontFamily="'Prompt', sans-serif">
          บัณฑิตศึกษา
        </text>
      </g>

      {/* Connecting Beams & Sparkles */}
      <circle cx="170" cy="115" r="3" fill="#006837" />
      <circle cx="430" cy="100" r="4" fill="#E5C158" />
      <circle cx="290" cy="180" r="2.5" fill="#004D28" />

      {/* Opportunity Tag in Center */}
      <g transform="translate(300, 32)">
        <rect x="-85" y="-12" width="170" height="24" rx="12" fill="#004D28" />
        <text x="0" y="4" textAnchor="middle" fontSize="10" fontWeight="700" fill="#E5C158" fontFamily="'Prompt', sans-serif">
          ✦ โอกาสการเรียนรู้ตลอดชีวิต
        </text>
      </g>
    </svg>
  );
};
