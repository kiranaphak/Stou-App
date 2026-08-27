import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Award,
  ExternalLink,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Headphones,
  Info,
  BookOpen,
  Briefcase,
  Share2,
  Check,
} from 'lucide-react';
import { COURSE_CATALOG_URL, STOU_ADMISSION_URL } from '../data/programs';
import { ScoredProgram } from '../types';
import { IconHelper } from './IconHelper';

interface ResultsProps {
  topPrograms: ScoredProgram[];
  allRankedPrograms: ScoredProgram[];
  onRestart: () => void;
  onRequestConsultation: (preselectedProgramId?: string) => void;
}

export const Results: React.FC<ResultsProps> = ({
  topPrograms,
  allRankedPrograms,
  onRestart,
  onRequestConsultation,
}) => {
  const [showAllPrograms, setShowAllPrograms] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyShareLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-sky-950 shadow-xs border border-amber-300">
          <Award className="w-3.5 h-3.5 fill-current" />
          อันดับ 1 ตรงกับคุณมากที่สุด
        </span>
      );
    }
    if (rank === 2) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-slate-200 text-slate-800 border border-slate-300">
          อันดับ 2 แนะนำเป็นทางเลือก
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-200">
        อันดับ 3 แนะนำเป็นทางเลือก
      </span>
    );
  };

  return (
    <div id="results-page" className="w-full max-w-2xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3 bg-gradient-to-b from-sky-950 to-sky-900 text-white p-6 sm:p-7 rounded-3xl shadow-md border border-amber-500/20 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-28 h-28 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-400/20 text-amber-300 border border-amber-400/30">
          <Sparkles className="w-3.5 h-3.5" />
          สรุปผลการสำรวจความสนใจใน 5 นาที
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          3 กลุ่มสาขาวิชา มสธ. ที่เหมาะกับคุณ
        </h1>

        <p className="text-sm text-slate-200 max-w-md mx-auto leading-relaxed">
          ประมวลผลจากเป้าหมาย ความถนัด และรูปแบบภารกิจที่คุณเลือก เพื่อช่วยค้นหาเส้นทางการเรียนรู้ที่ใช่สำหรับคุณ
        </p>
      </motion.div>

      {/* Official Disclaimer Notice (Mandatory Requirement) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        id="official-disclaimer"
        className="bg-amber-50 border border-amber-300/80 rounded-2xl p-4 flex items-start gap-3 shadow-2xs"
      >
        <Info className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-amber-900 leading-relaxed">
          <p className="font-semibold text-amber-950">ข้อความชี้แจงสำคัญ:</p>
          <p>
            “ผลลัพธ์นี้เป็นคำแนะนำเบื้องต้นเพื่อช่วยสำรวจความสนใจ ไม่ใช่การรับรองคุณสมบัติหรือผลการคัดเลือกเข้าศึกษา”
          </p>
        </div>
      </motion.div>

      {/* Top 3 Program Cards */}
      <div id="top-3-programs-list" className="space-y-5">
        {topPrograms.map((item, index) => {
          const { program, reasons, rank } = item;
          const isTopMatch = rank === 1;

          return (
            <motion.div
              key={program.id}
              id={`result-card-rank-${rank}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + index * 0.1 }}
              className={`rounded-3xl border-2 transition-all p-5 sm:p-6 space-y-4 shadow-sm relative ${
                isTopMatch
                  ? 'bg-white border-amber-400 shadow-md ring-2 ring-amber-400/20'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs flex-shrink-0 ${
                      isTopMatch
                        ? 'bg-sky-950 text-amber-400'
                        : 'bg-slate-100 text-sky-900'
                    }`}
                  >
                    <IconHelper name={program.iconName} className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                      {program.name}
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                      {program.englishName}
                    </p>
                  </div>
                </div>

                <div className="flex-shrink-0 self-start sm:self-auto">
                  {getRankBadge(rank)}
                </div>
              </div>

              {/* Short 1-2 line description */}
              <div className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <p>{program.description}</p>
              </div>

              {/* Matched reasons derived from answers */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-sky-950 uppercase tracking-wide">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>เหตุผลที่สอดคล้องกับคำตอบของคุณ:</span>
                </div>
                <ul className="space-y-1.5 pl-1">
                  {reasons.map((reason, rIdx) => (
                    <li
                      key={rIdx}
                      className="text-xs sm:text-sm text-slate-700 flex items-start gap-2 leading-relaxed"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Major examples & career examples */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs">
                <div className="bg-sky-50/70 p-3 rounded-xl border border-sky-100/80">
                  <div className="flex items-center gap-1 text-sky-900 font-semibold mb-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>ตัวอย่างหลักสูตร/วิชาเอก:</span>
                  </div>
                  <p className="text-slate-600 leading-snug">
                    {program.highlightMajors.join(' • ')}
                  </p>
                </div>

                <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-100">
                  <div className="flex items-center gap-1 text-amber-900 font-semibold mb-1">
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>โอกาสทางอาชีพ:</span>
                  </div>
                  <p className="text-slate-600 leading-snug">
                    {program.careerPaths.join(' • ')}
                  </p>
                </div>
              </div>

              {/* Program Specific Actions */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <a
                  id={`btn-view-catalog-${program.id}`}
                  href={program.catalogUrl || COURSE_CATALOG_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-sky-950 text-white hover:bg-sky-900 active:scale-[0.99] transition-colors shadow-2xs"
                >
                  <span>ดูข้อมูลหลักสูตรนี้</span>
                  <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
                </a>

                <button
                  id={`btn-consult-program-${program.id}`}
                  type="button"
                  onClick={() => onRequestConsultation(program.id)}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-sky-900 bg-amber-100 hover:bg-amber-200 border border-amber-300/60 transition-colors shadow-2xs"
                >
                  <Headphones className="w-3.5 h-3.5 text-sky-950" />
                  <span>ขอคำแนะนำสาขานี้</span>
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Main Action Hub */}
      <div id="results-action-hub" className="space-y-3 pt-2">
        {/* Course Catalog Link Button (Mandatory) */}
        <a
          id="btn-course-catalog-main"
          href={COURSE_CATALOG_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3.5 px-5 rounded-2xl font-bold text-sm sm:text-base bg-sky-950 text-white hover:bg-sky-900 flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99]"
        >
          <BookOpen className="w-4 h-4 text-amber-400" />
          <span>ดูข้อมูลหลักสูตร มสธ. ทั้งหมด (COURSE_CATALOG_URL)</span>
          <ExternalLink className="w-4 h-4 text-amber-400 ml-1" />
        </a>

        {/* Request Advisor Consultation Button (Mandatory & Optional) */}
        <button
          id="btn-request-consultation-main"
          type="button"
          onClick={() => onRequestConsultation()}
          className="w-full py-3.5 px-5 rounded-2xl font-bold text-sm sm:text-base bg-gradient-to-r from-amber-500 to-amber-400 text-sky-950 hover:brightness-105 flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99]"
        >
          <Headphones className="w-4 h-4" />
          <span>ขอให้เจ้าหน้าที่ช่วยแนะนำ (ไม่บังคับกรอกข้อมูล)</span>
        </button>

        {/* Retake & Share row */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button
            id="btn-restart-from-results"
            type="button"
            onClick={onRestart}
            className="py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-white border border-slate-200 shadow-2xs hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>ทำแบบทดสอบใหม่</span>
          </button>

          <button
            id="btn-share-results"
            type="button"
            onClick={handleCopyShareLink}
            className="py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-white border border-slate-200 shadow-2xs hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-colors"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">คัดลอกลิงก์แล้ว!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>แชร์ให้เพื่อนทำ</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Expandable Section: View all 12 schools */}
      <div id="all-12-programs-accordion" className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
        <button
          id="btn-toggle-all-programs"
          type="button"
          onClick={() => setShowAllPrograms(!showAllPrograms)}
          className="w-full flex items-center justify-between text-left font-semibold text-slate-800 text-sm hover:text-sky-900 transition-colors"
        >
          <span className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-sky-800" />
            <span>ดูอันดับและรายชื่อ 12 กลุ่มสาขาวิชาทั้งหมดของ มสธ.</span>
          </span>
          {showAllPrograms ? (
            <ChevronUp className="w-4 h-4 text-slate-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-500" />
          )}
        </button>

        <AnimatePresence>
          {showAllPrograms && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden pt-4 space-y-2.5 border-t border-slate-100 mt-3"
            >
              {allRankedPrograms.map((item) => (
                <div
                  key={item.program.id}
                  className={`p-3 rounded-xl flex items-center justify-between gap-3 text-xs sm:text-sm ${
                    item.rank <= 3
                      ? 'bg-amber-50/80 border border-amber-200 text-slate-900 font-medium'
                      : 'bg-slate-50 border border-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0 ${
                        item.rank === 1
                          ? 'bg-amber-400 text-sky-950'
                          : item.rank <= 3
                          ? 'bg-sky-900 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {item.rank}
                    </span>
                    <span className="truncate">{item.program.name}</span>
                  </div>

                  <a
                    href={item.program.catalogUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 text-sky-800 hover:text-sky-950 font-semibold inline-flex items-center gap-1 text-xs"
                  >
                    <span>ข้อมูลสาขา</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Direct STOU Admission quick banner */}
      <div className="bg-sky-900 text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div>
          <h3 className="font-bold text-sm sm:text-base text-amber-300">
            สมัครเรียน มสธ. ภาคการศึกษาใหม่ได้แล้ววันนี้
          </h3>
          <p className="text-xs text-slate-200 mt-0.5">
            เรียนรู้ได้ทุกที่ ทุกเวลา ด้วยระบบการศึกษาทางไกลมาตรฐานสากล
          </p>
        </div>
        <a
          id="btn-stou-admission-banner"
          href={STOU_ADMISSION_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 px-4 py-2 rounded-xl bg-amber-400 text-sky-950 font-bold text-xs sm:text-sm hover:bg-amber-300 transition-colors inline-flex items-center gap-1 shadow-xs"
        >
          <span>สมัครเรียนออนไลน์</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
