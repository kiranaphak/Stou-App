import React from 'react';
import { RotateCcw, Sparkles } from 'lucide-react';
import { STOU48Logo } from './STOU48Logo';

interface HeaderProps {
  currentView: 'welcome' | 'quiz' | 'results' | 'advisory';
  onRestart: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onRestart }) => {
  return (
    <header className="sticky top-0 z-30 bg-[#004D28] text-white border-b-2 border-[#D4AF37]/40 shadow-md">
      <div className="max-w-4xl mx-auto px-4 py-2.5 sm:py-3 flex items-center justify-between">
        {/* Logo & University Title */}
        <div className="flex items-center gap-3">
          {/* 48 Years Mini Emblem / Logo */}
          <div className="bg-white p-1 rounded-xl shadow-xs border border-[#D4AF37]/50 flex items-center justify-center flex-shrink-0 w-11 h-11">
            <STOU48Logo className="w-9 h-auto" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] sm:text-xs font-bold text-[#E5C158] tracking-wide uppercase">
                มหาวิทยาลัยสุโขทัยธรรมาธิราช (STOU)
              </span>
              <span className="hidden md:inline-flex items-center gap-1 text-[10px] bg-[#00381D] text-[#E5C158] px-2 py-0.5 rounded-full border border-[#D4AF37]/30">
                <Sparkles className="w-2.5 h-2.5" />
                มหาวิทยาลัยแห่งโอกาส
              </span>
            </div>
            <h1 className="text-xs sm:text-sm md:text-base font-bold text-white leading-tight tracking-tight">
              ค้นหาหลักสูตร มสธ. ที่เหมาะกับคุณใน 5 นาที
            </h1>
          </div>
        </div>

        {/* Header Action */}
        {currentView !== 'welcome' && (
          <button
            id="btn-header-restart"
            type="button"
            onClick={onRestart}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#00381D] text-[#E5C158] border border-[#D4AF37]/40 hover:bg-[#002613] hover:text-white transition-colors shadow-2xs cursor-pointer"
            title="เริ่มใหม่ตั้งแต่ต้น"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">เริ่มใหม่</span>
          </button>
        )}
      </div>
    </header>
  );
};

