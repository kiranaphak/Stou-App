import React from 'react';
import { motion } from 'motion/react';
import {
  Compass,
  GraduationCap,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { HeroCoverCard } from './HeroCoverCard';
import { Disclaimer } from './Disclaimer';

interface WelcomeProps {
  onStartQuiz: () => void;
}

export const Welcome: React.FC<WelcomeProps> = ({ onStartQuiz }) => {
  return (
    <div id="welcome-page" className="w-full max-w-3xl mx-auto px-4 py-4 sm:py-6 space-y-6">
      {/* Hero Section Designed Accurately to User Reference */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <HeroCoverCard onStartQuiz={onStartQuiz} />
      </motion.div>

      {/* Section: สิ่งที่คุณจะได้รับ */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#006837]/15 shadow-sm space-y-4">
        <div className="space-y-1">
          <h2 className="text-[19px] sm:text-[21px] font-extrabold text-[#00381D] tracking-tight leading-[1.3]">
            สิ่งที่คุณจะได้รับ
          </h2>
          <p className="text-[14px] sm:text-[15px] text-[#475569] leading-[1.65]">
            ระบบจะประมวลผลคำตอบของคุณเพื่อสร้างผลลัพธ์เฉพาะบุคคล:
          </p>
        </div>

        <div className="space-y-3">
          {/* Benefit 1 */}
          <div className="p-4 rounded-2xl bg-[#F0F7F2] border border-[#006837]/20 flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#004D28] text-[#E5C158] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-2xs">
              <Compass className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <p className="text-[15px] sm:text-[16px] font-bold text-[#00381D] flex items-center gap-1.5 leading-snug">
                <CheckCircle2 className="w-4 h-4 text-[#006837]" />
                <span>ค้นพบเส้นทางเรียน</span>
              </p>
              <p className="text-[14px] sm:text-[15px] text-[#334155] leading-[1.65]">
                ชี้เป้ารูปแบบการศึกษาที่สอดคล้องกับคุณ ทั้งปริญญาตรี บัณฑิตศึกษา หรือโครงการสัมฤทธิบัตร
              </p>
            </div>
          </div>

          {/* Benefit 2 */}
          <div className="p-4 rounded-2xl bg-[#F0F7F2] border border-[#006837]/20 flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#004D28] text-[#E5C158] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-2xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <p className="text-[15px] sm:text-[16px] font-bold text-[#00381D] flex items-center gap-1.5 leading-snug">
                <CheckCircle2 className="w-4 h-4 text-[#006837]" />
                <span>เห็นหลักสูตรที่อาจเหมาะกับคุณ</span>
              </p>
              <p className="text-[14px] sm:text-[15px] text-[#334155] leading-[1.65]">
                จับคู่ความชอบและเป้าหมายกับสาขาวิชาต่าง ๆ ของ มหาวิทยาลัยสุโขทัยธรรมาธิราช
              </p>
            </div>
          </div>

          {/* Benefit 3 */}
          <div className="p-4 rounded-2xl bg-[#F0F7F2] border border-[#006837]/20 flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#004D28] text-[#E5C158] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-2xs">
              <Layers className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <p className="text-[15px] sm:text-[16px] font-bold text-[#00381D] flex items-center gap-1.5 leading-snug">
                <CheckCircle2 className="w-4 h-4 text-[#006837]" />
                <span>ดูตัวเลือกแขนงหรือวิชาเอกที่ตรงกับความสนใจ</span>
              </p>
              <p className="text-[14px] sm:text-[15px] text-[#334155] leading-[1.65]">
                เจาะลึกวิชาเอก กลุ่มวิชา และตัวอย่างแนวทางงานที่สามารถต่อยอดได้ในอนาคต
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer Section */}
      <Disclaimer />
    </div>
  );
};
