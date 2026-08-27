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
  Award,
  BookMarked,
  Layers,
} from 'lucide-react';
import { COURSE_CATALOG_URL } from '../data/programs';
import { STOU48Logo } from './STOU48Logo';

interface WelcomeProps {
  onStart: () => void;
}

export const Welcome: React.FC<WelcomeProps> = ({ onStart }) => {
  return (
    <div id="welcome-screen" className="w-full max-w-2xl mx-auto px-4 py-5 sm:py-8 space-y-6">
      {/* Hero Welcome Card - University Prestige CI (Green, White, Gold) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border-2 border-[#D4AF37]/30 text-center space-y-5 relative overflow-hidden"
      >
        {/* Subtle Decorative Background Aura */}
        <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 w-44 h-44 bg-[#006837]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 transform -translate-x-8 translate-y-8 w-44 h-44 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

        {/* 48 Years STOU Logo Display */}
        <div className="flex flex-col items-center justify-center pt-1">
          <div className="bg-gradient-to-b from-white to-[#F8FAF8] p-3 sm:p-4 rounded-2xl shadow-sm border border-[#D4AF37]/30">
            <STOU48Logo className="w-48 sm:w-56 h-auto" />
          </div>

          {/* Slogan Pill */}
          <div className="mt-3.5 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-[#004D28] text-[#E5C158] border border-[#D4AF37]/40 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#E5C158]" />
            <span>มสธ. มหาวิทยาลัยแห่งโอกาส (University of Opportunity)</span>
          </div>
        </div>

        {/* Hero Title & Objective */}
        <div className="space-y-2 max-w-lg mx-auto">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#00381D] leading-tight tracking-tight">
            ค้นหาหลักสูตร มสธ. <br />
            <span className="text-[#006837] bg-gradient-to-r from-[#006837] via-[#0B7A42] to-[#C59B27] bg-clip-text text-transparent">
              ที่เหมาะสมกับคุณใน 5 นาที
            </span>
          </h1>

          <div className="bg-[#F4F9F5] p-3.5 rounded-2xl border border-[#006837]/15 text-xs sm:text-sm text-[#00381D] leading-relaxed">
            <p className="font-semibold text-[#004D28]">
              วัตถุประสงค์: ทำแบบทดสอบ 5 นาที เพื่อค้นหาหลักสูตร มสธ. ที่เหมาะสมกับตนเอง
            </p>
            <p className="text-slate-600 text-xs mt-1">
              ตอบคำถามสั้นๆ เพียง 6 ข้อ เพื่อสำรวจความถนัด และรับคำแนะนำ 3 กลุ่มสาขาวิชาที่ตรงกับเป้าหมายชีวิตและการทำงานของคุณมากที่สุด
            </p>
          </div>
        </div>

        {/* 3 Quick Features Bento/Card Grid */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-1 text-center">
          <div className="bg-white p-3 rounded-2xl border border-[#006837]/15 shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-[#F0F7F2] text-[#006837] mx-auto flex items-center justify-center mb-1.5 font-bold">
              <Clock className="w-4 h-4 text-[#006837]" />
            </div>
            <p className="font-bold text-xs sm:text-sm text-[#00381D]">ใช้เวลา</p>
            <p className="text-slate-500 text-[11px]">เพียง 5 นาที</p>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-[#006837]/15 shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-[#FDFBF2] text-[#B38918] mx-auto flex items-center justify-center mb-1.5 font-bold">
              <Compass className="w-4 h-4 text-[#B38918]" />
            </div>
            <p className="font-bold text-xs sm:text-sm text-[#00381D]">6 คำถาม</p>
            <p className="text-slate-500 text-[11px]">เข้าใจง่าย ชัดเจน</p>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-[#006837]/15 shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-[#F0F7F2] text-[#006837] mx-auto flex items-center justify-center mb-1.5 font-bold">
              <ShieldCheck className="w-4 h-4 text-[#006837]" />
            </div>
            <p className="font-bold text-xs sm:text-sm text-[#00381D]">รู้ผลทันที</p>
            <p className="text-slate-500 text-[11px]">ไม่ต้องลงทะเบียน</p>
          </div>
        </div>

        {/* Primary CTA Start Button */}
        <div className="pt-2">
          <motion.button
            id="btn-start-quiz"
            type="button"
            onClick={onStart}
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.985 }}
            className="w-full py-4 px-6 rounded-2xl font-bold text-base sm:text-lg bg-gradient-to-r from-[#004D28] via-[#006837] to-[#0B7A42] text-[#E5C158] border-2 border-[#D4AF37]/50 shadow-lg hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <span>เริ่มทำแบบทดสอบ 5 นาทีเลย</span>
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </motion.button>
        </div>
      </motion.div>

      {/* University Excellence Cards (Why STOU) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-sm sm:text-base font-bold text-[#00381D] flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-[#006837]" />
            <span>ทำไมต้องเรียนปริญญาตรีที่ มสธ.?</span>
          </h2>
          <span className="text-xs font-semibold text-[#B38918] bg-[#FDFBF2] px-2.5 py-0.5 rounded-full border border-[#D4AF37]/30">
            48 ปีแห่งเกียรติภูมิ
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm text-slate-700">
          <div className="bg-[#F8FAF9] p-3.5 rounded-2xl border border-slate-100 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-[#004D28]">
              <CheckCircle className="w-4 h-4 text-[#006837] flex-shrink-0" />
              <span>เรียนได้ทุกที่ ทุกเวลา</span>
            </div>
            <p className="text-slate-600 text-xs leading-relaxed">
              ระบบการศึกษาทางไกลมาตรฐาน ยืดหยุ่น จัดเวลาเรียนเองได้ ไม่กระทบงานประจำ
            </p>
          </div>

          <div className="bg-[#F8FAF9] p-3.5 rounded-2xl border border-slate-100 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-[#004D28]">
              <CheckCircle className="w-4 h-4 text-[#006837] flex-shrink-0" />
              <span>ประหยัดค่าใช้จ่าย</span>
            </div>
            <p className="text-slate-600 text-xs leading-relaxed">
              ค่าธรรมเนียมแบบเหมาจ่ายคุ้มค่า พร้อมชุดสื่อตำราเรียนส่งตรงถึงบ้าน
            </p>
          </div>

          <div className="bg-[#F8FAF9] p-3.5 rounded-2xl border border-slate-100 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-[#004D28]">
              <CheckCircle className="w-4 h-4 text-[#006837] flex-shrink-0" />
              <span>ก.พ. และสากลรับรอง</span>
            </div>
            <p className="text-slate-600 text-xs leading-relaxed">
              วุฒิปริญญามาตรฐาน ใช้สอบแข่งขัน เลื่อนตำแหน่ง และต่อยอดปริญญาโท-เอกได้
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <span className="text-slate-500 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-[#006837]" />
            <span>12 กลุ่มสาขาวิชา ครอบคลุมทุกสายอาชีพแห่งอนาคต</span>
          </span>
          <a
            id="link-welcome-catalog"
            href={COURSE_CATALOG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-[#004D28] hover:text-[#006837] inline-flex items-center gap-1 hover:underline"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>เปิดดูคู่มือหลักสูตรทั้งหมด</span>
          </a>
        </div>
      </div>

      {/* Exhibition & Booth helper badge */}
      <div className="text-center text-xs text-slate-500 py-1">
        <p className="flex items-center justify-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-[#006837]" />
          <span>สำหรับผู้เข้าชมนิทรรศการ บูธแนะนำการศึกษา และผู้สนใจศึกษาต่อ มสธ.</span>
        </p>
      </div>
    </div>
  );
};

