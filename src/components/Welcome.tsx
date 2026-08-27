import React from 'react';
import { motion } from 'motion/react';
import {
  Clock,
  CheckCircle,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  BookOpen,
  GraduationCap,
  Users,
  Compass,
} from 'lucide-react';
import { COURSE_CATALOG_URL } from '../data/programs';

interface WelcomeProps {
  onStart: () => void;
}

export const Welcome: React.FC<WelcomeProps> = ({ onStart }) => {
  return (
    <div id="welcome-screen" className="w-full max-w-xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* Hero Welcome Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-b from-sky-950 via-sky-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-500/20 text-center space-y-4 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 transform translate-x-6 -translate-y-6 w-32 h-32 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-400/20 text-amber-300 border border-amber-400/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>แบบสำรวจความสนใจระดับปริญญาตรี มสธ.</span>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
          ค้นหาหลักสูตร มสธ. <br />
          <span className="text-amber-400">ที่เหมาะกับคุณใน 5 นาที</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-md mx-auto">
          ตอบคำถามสั้นๆ เพียง 6 ข้อ เพื่อสำรวจความถนัดและรับคำแนะนำ 3 กลุ่มสาขาวิชาที่ตรงกับเป้าหมายชีวิตและการทำงานของคุณมากที่สุด
        </p>

        {/* 3 Key Highlights */}
        <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
          <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
            <Clock className="w-5 h-5 text-amber-300 mx-auto mb-1" />
            <p className="font-semibold text-white">ใช้เวลา</p>
            <p className="text-slate-300 text-[11px]">ไม่เกิน 5 นาที</p>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
            <Compass className="w-5 h-5 text-amber-300 mx-auto mb-1" />
            <p className="font-semibold text-white">6 คำถาม</p>
            <p className="text-slate-300 text-[11px]">ตอบง่าย ชัดเจน</p>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/10">
            <ShieldCheck className="w-5 h-5 text-amber-300 mx-auto mb-1" />
            <p className="font-semibold text-white">ไม่ต้องลงทะเบียน</p>
            <p className="text-slate-300 text-[11px]">รู้ผลทันที</p>
          </div>
        </div>

        {/* Start Button */}
        <div className="pt-3">
          <motion.button
            id="btn-start-quiz"
            type="button"
            onClick={onStart}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 px-6 rounded-2xl font-bold text-base sm:text-lg bg-gradient-to-r from-amber-400 via-amber-400 to-amber-500 text-sky-950 shadow-lg hover:brightness-105 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>เริ่มทำแบบทดสอบเลย</span>
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </motion.button>
        </div>
      </motion.div>

      {/* Why STOU Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 space-y-4 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-sky-900" />
          <span>ทำไมต้องเรียนปริญญาตรีที่ มสธ.?</span>
        </h2>

        <div className="space-y-2.5 text-xs sm:text-sm text-slate-700">
          <div className="flex items-start gap-2.5">
            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <p><strong>เรียนได้ทุกที่ ทุกเวลา:</strong> ระบบการเรียนรู้ทางไกล ยืดหยุ่น เหมาะสำหรับคนทำงานและทุกช่วงวัย</p>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <p><strong>ประหยัดค่าใช้จ่าย:</strong> ค่าธรรมเนียมการศึกษาแบบเหมาจ่ายคุ้มค่า พร้อมชุดสื่อการเรียนครบครัน</p>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <p><strong>วุฒิการศึกษามาตรฐานสากล:</strong> ก.พ. และหน่วยงานภาครัฐ-เอกชนรับรองคุณวุฒิ ใช้สอบและปรับเงินเดือนได้จริง</p>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">12 สาขาวิชาครอบคลุมทุกศาสตร์</span>
          <a
            id="link-welcome-catalog"
            href={COURSE_CATALOG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-sky-900 hover:text-sky-950 inline-flex items-center gap-1"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>ดูคู่มือหลักสูตรทั้งหมด</span>
          </a>
        </div>
      </div>

      {/* Note for exhibition visitors */}
      <div className="text-center text-xs text-slate-500 space-y-1">
        <p className="flex items-center justify-center gap-1">
          <Users className="w-3.5 h-3.5 text-sky-900" />
          <span>สำหรับผู้เข้าชมนิทรรศการและผู้สนใจศึกษาต่อ มหาวิทยาลัยสุโขทัยธรรมาธิราช</span>
        </p>
      </div>
    </div>
  );
};
