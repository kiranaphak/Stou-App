import React from 'react';
import { RotateCcw } from 'lucide-react';

interface HeaderProps {
  currentView: 'welcome' | 'quiz' | 'results' | 'advisory';
  onRestart: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onRestart }) => {
  return (
    <header className="sticky top-0 z-30 bg-sky-950 text-white border-b border-amber-500/20 shadow-md">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          {/* STOU Emblem / Crest */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-sm flex-shrink-0 flex items-center justify-center">
            <div className="w-full h-full bg-sky-950 rounded-[10px] flex items-center justify-center text-amber-400 font-black text-xs tracking-tighter">
              มสธ
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] sm:text-xs font-semibold text-amber-300 tracking-wide uppercase">
                มหาวิทยาลัยสุโขทัยธรรมาธิราช (STOU)
              </span>
            </div>
            <h1 className="text-sm sm:text-base font-bold text-white leading-tight tracking-tight">
              ค้นหาหลักสูตร มสธ. ที่เหมาะกับคุณใน 5 นาที
            </h1>
          </div>
        </div>

        {/* Header Action */}
        {currentView !== 'welcome' && (
          <button
            type="button"
            onClick={onRestart}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-sky-900/80 text-amber-300 border border-amber-400/30 hover:bg-sky-800 transition-colors shadow-2xs"
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
