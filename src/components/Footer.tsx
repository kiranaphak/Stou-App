import React from 'react';
import { BarChart2 } from 'lucide-react';

interface FooterProps {
  currentView?: string;
  onOpenAdmin?: () => void;
  onBackToApp?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  currentView = 'welcome',
  onOpenAdmin,
  onBackToApp,
}) => {
  return (
    <footer id="app-footer" className="bg-[#002B16] text-slate-300 text-xs py-6 px-4 border-t-2 border-[#D4AF37]/40 text-center space-y-3 mt-auto">
      <div className="max-w-2xl mx-auto space-y-2">
        <p className="font-bold text-sm text-[#E5C158] leading-snug">
          มหาวิทยาลัยสุโขทัยธรรมาธิราช (มสธ.)
        </p>
        <p className="text-[11px] text-emerald-200 font-medium">
          ศูนย์วิทยบริการและชุมชนสัมพันธ์ มสธ. ลำปาง
        </p>
        <p className="text-[11px] text-slate-300 leading-relaxed">
          ข้อมูลหลักสูตรอ้างอิงจากมหาวิทยาลัยสุโขทัยธรรมาธิราช ปีการศึกษา 2569
        </p>
        <p className="text-[10px] sm:text-[11px] text-slate-400 leading-relaxed max-w-lg mx-auto">
          ผลลัพธ์นี้เป็นคำแนะนำเบื้องต้น โปรดตรวจสอบรายละเอียดหลักสูตรและคุณสมบัติการสมัครจากแหล่งข้อมูลทางการก่อนตัดสินใจสมัคร
        </p>
        <div className="pt-1 border-t border-emerald-950/60">
          <p className="text-[10px] sm:text-[11px] text-slate-300 font-medium">
            ออกแบบและพัฒนาระบบโดย กิรณาภัค สระทองพูน
          </p>
        </div>
      </div>

      {/* Staff Dashboard Footer Link */}
      {(onOpenAdmin || onBackToApp) && (
        <div className="pt-1">
          {currentView !== 'admin' && onOpenAdmin ? (
            <button
              id="btn-footer-admin"
              type="button"
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 text-[11px] text-emerald-300 hover:text-emerald-100 underline opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>รายงานสถิติสำหรับเจ้าหน้าที่ มสธ. (Admin Dashboard)</span>
            </button>
          ) : onBackToApp ? (
            <button
              id="btn-footer-back-app"
              type="button"
              onClick={onBackToApp}
              className="inline-flex items-center gap-1.5 text-[11px] text-emerald-300 hover:text-emerald-100 underline opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
            >
              <span>กลับสู่หน้าหลักของแบบทดสอบ</span>
            </button>
          ) : null}
        </div>
      )}
    </footer>
  );
};
