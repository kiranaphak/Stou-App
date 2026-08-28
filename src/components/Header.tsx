import React from 'react';
import { RotateCcw } from 'lucide-react';

interface HeaderProps {
  currentView: 'welcome' | 'quiz' | 'results' | 'advisory';
  onRestart: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onRestart }) => {
  return (
    <header className="sticky top-0 z-30 bg-[#004D28] text-white border-b-2 border-[#D4AF37]/40 shadow-md">
      <div className="max-w-4xl mx-auto px-4 py-2.5 sm:py-3 flex items-center justify-between">
        {/* Logo, University Name & Subtitle */}
        <div className="flex items-center gap-3">
          {/* STOU Official Emblem */}
          <div className="bg-white p-1 rounded-xl shadow-xs border border-[#D4AF37]/50 flex items-center justify-center flex-shrink-0">
            <img
              src="/assets/stou-emblem.svg"
              alt="ตราสัญลักษณ์ มหาวิทยาลัยสุโขทัยธรรมาธิราช"
              className="logo"
            />
          </div>

          <div>
            <span className="text-sm sm:text-base md:text-lg font-bold text-white tracking-tight block leading-tight">
              มหาวิทยาลัยสุโขทัยธรรมาธิราช
            </span>
            <span className="text-[11px] sm:text-xs md:text-[13px] font-semibold text-[#E5C158] block leading-tight font-sans">
              Sukhothai Thammathirat Open University
            </span>
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

