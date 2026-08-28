import React from 'react';
import { motion } from 'motion/react';
import {
  Compass,
  User,
  GraduationCap,
  BookOpen,
  Trophy,
  ArrowRight,
  Clock,
  HelpCircle,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface HeroCoverCardProps {
  onStartQuiz: () => void;
}

export const HeroCoverCard: React.FC<HeroCoverCardProps> = ({ onStartQuiz }) => {
  return (
    <div className="w-full rounded-[32px] sm:rounded-[36px] bg-white border border-[#006837]/20 shadow-md relative overflow-hidden text-center select-none">
      {/* Background Decorative Waves and Gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top-Left Green Curve Wave */}
        <svg
          className="absolute -top-6 -left-6 w-56 sm:w-72 h-auto text-[#004D28]/10"
          viewBox="0 0 300 200"
          fill="none"
        >
          <path
            d="M0,0 C120,20 220,100 240,200 L0,200 Z"
            fill="currentColor"
          />
          <path
            d="M0,0 C100,10 180,70 200,180 L0,180 Z"
            fill="#0E783D"
            fillOpacity="0.08"
          />
        </svg>

        {/* Bottom-Left & Bottom-Right Waves */}
        <svg
          className="absolute -bottom-8 -left-8 w-64 sm:w-80 h-auto text-[#004D28]/10"
          viewBox="0 0 300 150"
          fill="none"
        >
          <path
            d="M0,150 C80,120 180,110 300,150 L0,150 Z"
            fill="currentColor"
          />
        </svg>
        <svg
          className="absolute -bottom-8 -right-8 w-64 sm:w-80 h-auto text-[#D4AF37]/10"
          viewBox="0 0 300 150"
          fill="none"
        >
          <path
            d="M300,150 C220,120 120,110 0,150 L300,150 Z"
            fill="currentColor"
          />
        </svg>

        {/* Dot Matrix Grids (Top Left & Bottom Left/Right) */}
        <div className="absolute top-8 left-6 grid grid-cols-4 gap-2 opacity-25">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={`dot-tl-${i}`} className="w-1.5 h-1.5 rounded-full bg-[#004D28]" />
          ))}
        </div>
        <div className="absolute bottom-16 left-6 grid grid-cols-4 gap-2 opacity-20">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={`dot-bl-${i}`} className="w-1.5 h-1.5 rounded-full bg-[#004D28]" />
          ))}
        </div>
        <div className="absolute bottom-16 right-6 grid grid-cols-4 gap-2 opacity-20">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={`dot-br-${i}`} className="w-1.5 h-1.5 rounded-full bg-[#004D28]" />
          ))}
        </div>
      </div>

      <div className="relative z-10 p-5 sm:p-7 md:p-8 space-y-5 sm:space-y-6">
        {/* Top Bar: Trust Chips */}
        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2">
          {/* Chip 1 */}
          <div className="inline-flex items-center gap-1.5 bg-white/95 px-3 py-1.5 rounded-full shadow-2xs border border-slate-200 text-left">
            <div className="w-6 h-6 rounded-full bg-[#004D28] text-white flex items-center justify-center flex-shrink-0">
              <Clock className="w-3 h-3" />
            </div>
            <div className="leading-tight">
              <span className="block text-[11px] font-extrabold text-slate-800">2–3 นาที</span>
              <span className="block text-[9px] text-slate-500">ใช้เวลา</span>
            </div>
          </div>

          {/* Chip 2 */}
          <div className="inline-flex items-center gap-1.5 bg-white/95 px-3 py-1.5 rounded-full shadow-2xs border border-[#D4AF37]/30 text-left">
            <div className="w-6 h-6 rounded-full bg-[#C99824] text-white flex items-center justify-center flex-shrink-0">
              <HelpCircle className="w-3 h-3" />
            </div>
            <div className="leading-tight">
              <span className="block text-[11px] font-extrabold text-slate-800">ไม่มีคำตอบผิด</span>
              <span className="block text-[9px] text-slate-500">ตอบตามความเป็นคุณ</span>
            </div>
          </div>

          {/* Chip 3 */}
          <div className="inline-flex items-center gap-1.5 bg-white/95 px-3 py-1.5 rounded-full shadow-2xs border border-slate-200 text-left">
            <div className="w-6 h-6 rounded-full bg-[#006837] text-white flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-3 h-3" />
            </div>
            <div className="leading-tight">
              <span className="block text-[11px] font-extrabold text-slate-800">ไม่ระบุตัวตน</span>
              <span className="block text-[9px] text-slate-500">ข้อมูลปลอดภัย</span>
            </div>
          </div>
        </div>

        {/* Center Title Group with Sparkles */}
        <div className="relative pt-2 sm:pt-4 pb-1 sm:pb-2 space-y-2 max-w-xl mx-auto px-4">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-[#C99824] animate-pulse" />
            <h1 className="text-[26px] sm:text-[32px] md:text-[36px] font-black text-[#004D28] tracking-tight leading-[1.2]">
              ค้นหาหลักสูตร
            </h1>
            <Sparkles className="w-5 h-5 text-[#C99824] animate-pulse" />
          </div>

          <div className="text-[28px] sm:text-[34px] md:text-[38px] font-black leading-[1.2] tracking-tight">
            <span className="text-[#C99824]">มสธ.</span>{' '}
            <span className="text-[#004D28]">ที่ใช่สำหรับคุณ</span>
          </div>

          <p className="text-[15px] sm:text-[16px] text-slate-700 font-medium max-w-lg mx-auto pt-1 leading-relaxed">
            ตอบคำถามง่าย ๆ เพื่อค้นหาเส้นทางการเรียนรู้ที่เหมาะกับเป้าหมายในชีวิตของคุณ
          </p>
        </div>

        {/* Learning Journey Roadmap (5 Steps with Center Highlight Node) */}
        <div className="pt-2 pb-2">
          <div className="relative max-w-2xl mx-auto">
            {/* Flowing Wave Green Highway Line */}
            <svg
              className="absolute top-7 left-0 w-full h-12 pointer-events-none hidden sm:block"
              viewBox="0 0 600 48"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                d="M 50,24 Q 160,8 300,24 T 550,24"
                stroke="url(#roadGradCover)"
                strokeWidth="10"
                strokeLinecap="round"
              />
              <path
                d="M 50,24 Q 160,8 300,24 T 550,24"
                stroke="#FFFFFF"
                strokeWidth="3"
                strokeDasharray="6 6"
                strokeLinecap="round"
                opacity="0.8"
              />
              <defs>
                <linearGradient id="roadGradCover" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0E783D" stopOpacity="0.3" />
                  <stop offset="50%" stopColor="#004D28" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#C99824" stopOpacity="0.5" />
                </linearGradient>
              </defs>
            </svg>

            {/* 5 Nodes Layout */}
            <div className="grid grid-cols-5 gap-1 sm:gap-2 items-center relative z-10">
              {/* Node 1: จุดเริ่มต้น / ค้นหาตัวตน */}
              <div className="flex flex-col items-center text-center space-y-1.5">
                <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white border-2 sm:border-3 border-[#004D28] shadow-sm flex items-center justify-center text-[#004D28] transition-transform hover:scale-105">
                  <Compass className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="space-y-0.5">
                  <span className="block text-[11px] sm:text-xs font-bold text-[#004D28] leading-tight">
                    จุดเริ่มต้น
                  </span>
                  <span className="hidden sm:block text-[10px] text-slate-500 leading-tight">
                    ค้นหาตัวตน
                  </span>
                </div>
              </div>

              {/* Node 2: สำรวจเป้าหมาย / และความสนใจ */}
              <div className="flex flex-col items-center text-center space-y-1.5">
                <div className="hidden sm:block text-[#006837]/60 font-bold text-xs">›››</div>
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white border-2 border-[#006837] shadow-xs flex items-center justify-center text-[#006837]">
                  <User className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="space-y-0.5">
                  <span className="block text-[10px] sm:text-xs font-bold text-[#004D28] leading-tight">
                    สำรวจเป้าหมาย
                  </span>
                  <span className="hidden sm:block text-[9px] sm:text-[10px] text-slate-500 leading-tight">
                    และความสนใจ
                  </span>
                </div>
              </div>

              {/* Node 3 (Featured Center Node): พบหลักสูตร / ที่เหมาะกับคุณ */}
              <div className="flex flex-col items-center text-center space-y-1.5 -mt-2">
                <div className="relative">
                  {/* Glowing Ring */}
                  <div className="absolute -inset-1.5 rounded-full bg-[#C99824]/30 animate-pulse blur-xs" />
                  <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-[#0B7A42] to-[#00381D] border-3 sm:border-4 border-[#C99824] shadow-md flex items-center justify-center text-white relative z-10">
                    <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8 text-[#FFF2B2]" />
                  </div>
                </div>
                <div className="space-y-0.5 pt-0.5">
                  <span className="block text-[11px] sm:text-xs font-extrabold text-[#00381D] leading-tight">
                    พบหลักสูตร
                  </span>
                  <span className="block text-[10px] text-[#006837] font-semibold leading-tight">
                    ที่เหมาะกับคุณ
                  </span>
                </div>
              </div>

              {/* Node 4: พัฒนาความรู้ / สู่อนาคต */}
              <div className="flex flex-col items-center text-center space-y-1.5">
                <div className="hidden sm:block text-[#006837]/60 font-bold text-xs">›››</div>
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white border-2 border-[#006837] shadow-xs flex items-center justify-center text-[#006837]">
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="space-y-0.5">
                  <span className="block text-[10px] sm:text-xs font-bold text-[#004D28] leading-tight">
                    พัฒนาความรู้
                  </span>
                  <span className="hidden sm:block text-[9px] sm:text-[10px] text-slate-500 leading-tight">
                    สู่อนาคต
                  </span>
                </div>
              </div>

              {/* Node 5: บรรลุเป้าหมาย / สร้างอนาคตที่คุณเลือกได้ */}
              <div className="flex flex-col items-center text-center space-y-1.5">
                <div className="relative">
                  <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white border-2 sm:border-3 border-[#C99824] shadow-sm flex items-center justify-center text-[#C99824] transition-transform hover:scale-105">
                    <Trophy className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                </div>
                <div className="space-y-0.5">
                  <span className="block text-[11px] sm:text-xs font-bold text-[#8B6B15] leading-tight">
                    บรรลุเป้าหมาย
                  </span>
                  <span className="hidden sm:block text-[10px] text-slate-500 leading-tight">
                    สร้างอนาคต
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Primary CTA Capsule Button: [เริ่มค้นหาเส้นทางของคุณ] */}
        <div className="pt-2 flex justify-center">
          <motion.button
            id="btn-start-quiz-hero"
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onStartQuiz}
            className="w-full sm:w-auto min-w-[280px] sm:min-w-[360px] py-3.5 sm:py-4 px-6 sm:px-8 rounded-full bg-gradient-to-r from-[#00381D] via-[#004D28] to-[#00381D] hover:from-[#002B16] hover:to-[#00381D] text-white shadow-lg shadow-[#004D28]/30 border-2 border-[#D4AF37]/60 flex items-center justify-center gap-4 cursor-pointer transition-all"
          >
            {/* Left Circle Arrow Badge */}
            <div className="w-10 h-10 rounded-full bg-[#002814] border border-[#D4AF37]/50 flex items-center justify-center flex-shrink-0 text-[#E5C158]">
              <ArrowRight className="w-5 h-5" />
            </div>

            {/* Button Texts */}
            <div className="text-center sm:text-left">
              <span className="block text-base sm:text-lg font-bold text-white leading-tight">
                เริ่มต้นค้นหาเส้นทางของคุณ
              </span>
            </div>
          </motion.button>
        </div>
      </div>
    </div>
  );
};
