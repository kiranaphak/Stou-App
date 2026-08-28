import React from 'react';
import { AlertCircle, ExternalLink } from 'lucide-react';
import { STOU_WEBSITE_URL } from '../data/config';

interface DisclaimerProps {
  compact?: boolean;
}

export const Disclaimer: React.FC<DisclaimerProps> = ({ compact = false }) => {
  return (
    <div
      id="stou-official-disclaimer"
      className={`rounded-2xl border border-[#D4AF37]/40 bg-[#FDFBF2] text-slate-700 ${
        compact ? 'p-3.5 text-xs' : 'p-4 sm:p-5 text-xs sm:text-sm'
      } space-y-2 shadow-2xs`}
    >
      <div className="flex items-start gap-2.5">
        <AlertCircle className="w-5 h-5 text-[#B38918] flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-[#00381D] leading-tight">
            ข้อชี้แจงคำแนะนำหลักสูตรเบื้องต้น
          </p>
          <p className="text-slate-700 leading-relaxed">
            ผลลัพธ์นี้เป็นคำแนะนำเบื้องต้นเพื่อช่วยสำรวจความสนใจ ไม่ใช่การรับรองคุณสมบัติหรือผลการคัดเลือกเข้าศึกษา โปรดตรวจสอบรายละเอียดหลักสูตรและคุณสมบัติผู้สมัครจากเว็บไซต์ทางการของ มสธ. ก่อนสมัคร
          </p>
        </div>
      </div>

      <div className="pt-1 flex items-center justify-end">
        <a
          href={STOU_WEBSITE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-bold text-[#004D28] hover:text-[#006837] hover:underline"
        >
          <span>ตรวจสอบระเบียบการที่ Stou.ac.th</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
