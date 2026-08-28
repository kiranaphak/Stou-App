import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  GraduationCap,
  TrendingUp,
  Compass,
  CheckCircle2,
  ExternalLink,
  RotateCcw,
  Headphones,
  BookOpen,
  Building,
  Briefcase,
  ChevronRight,
  Share2,
  Check,
  Award,
  Layers,
  ArrowUpRight,
  HelpCircle,
  PhoneCall,
  Loader2,
  FileText,
  X,
} from 'lucide-react';
import { ScoringResult, RecommendedProgramResult } from '../types';
import {
  BACHELOR_URL,
  GRADUATE_URL,
  GRADUATE_CURRICULUM_URL,
  SUMRIT_URL,
  STOU_ADMISSION_URL,
  STOU_CALL_CENTER,
  STOU_CALL_CENTER_HOURS,
} from '../data/config';
import { IconHelper } from './IconHelper';
import { trackEvent } from '../lib/firebase';
import { LampangContactCard } from './LampangContactCard';

interface ResultsProps {
  result: ScoringResult;
  onRestart: () => void;
  onOpenAdvisory: () => void;
}

export const Results: React.FC<ResultsProps> = ({
  result,
  onRestart,
  onOpenAdvisory,
}) => {
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedCareerProg, setSelectedCareerProg] = useState<RecommendedProgramResult | null>(null);
  const { primaryPathway, allPathwayScores, topRecommendedPrograms, interestLabel } = result;

  // Processing / matching animation delay (0.75s) as required by Section H
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);

      // Track program view events once results are displayed
      topRecommendedPrograms.forEach((prog) => {
        trackEvent('result_program_viewed', {
          rank: prog.rank,
          school_code: prog.schoolCode,
          program_id: prog.programId,
          persona: primaryPathway.id,
        });
      });
    }, 750);

    return () => clearTimeout(timer);
  }, [topRecommendedPrograms, primaryPathway.id]);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `ผลการค้นหาหลักสูตร มสธ. ของฉัน: ${primaryPathway.name}`,
          text: `ฉันค้นพบเส้นทางการเรียนรู้ มสธ. ที่เหมาะกับฉัน: ${primaryPathway.name} พร้อม 3 หลักสูตรแนะนำ!`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      }
    } catch {
      // Fallback ignore
    }
  };

  const handleDetailClick = (prog: RecommendedProgramResult) => {
    trackEvent('result_detail_clicked', {
      rank: prog.rank,
      school_code: prog.schoolCode,
      program_id: prog.programId,
      persona: primaryPathway.id,
    });

    const isGrad =
      primaryPathway.id === 'career' ||
      prog.degreeName?.includes('โท') ||
      prog.degreeName?.includes('เอก') ||
      prog.programName?.includes('มหาบัณฑิต') ||
      prog.programName?.includes('ดุษฎีบัณฑิต') ||
      prog.programName?.includes('บัณฑิตศึกษา') ||
      prog.programId?.includes('grad') ||
      prog.programId?.includes('master') ||
      prog.detailUrl?.includes('curriculums2') ||
      prog.detailUrl?.includes('ogs.stou.ac.th');

    const targetUrl = isGrad
      ? GRADUATE_CURRICULUM_URL
      : (prog.detailUrl || BACHELOR_URL);

    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  const scrollToSection = (elementId: string) => {
    const el = document.getElementById(elementId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div id="results-loading" className="w-full max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-[#F0F7F2] text-[#006837] mx-auto flex items-center justify-center border border-[#006837]/20 shadow-sm animate-pulse">
          <Loader2 className="w-8 h-8 animate-spin text-[#004D28]" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-lg sm:text-xl font-extrabold text-[#00381D]">
            กำลังจับคู่เส้นทางเรียนที่เหมาะกับคุณ…
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            วิเคราะห์คำตอบและจับคู่กับหลักสูตร มสธ. ปีการศึกษา 2569
          </p>
        </div>
      </div>
    );
  }

  const isUpskill = primaryPathway.id === 'upskill';
  const isDegree = primaryPathway.id === 'degree';
  const isCareer = primaryPathway.id === 'career';

  return (
    <div id="results-page" className="w-full max-w-2xl mx-auto px-4 py-5 sm:py-8 space-y-6">
      {/* Top Banner Action Bar */}
      <div className="flex items-center justify-between">
        <button
          id="btn-results-restart-top"
          type="button"
          onClick={onRestart}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-[#00381D] bg-white border border-slate-200 shadow-2xs hover:bg-[#F0F7F2] transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>ทำแบบทดสอบอีกครั้ง</span>
        </button>

        <button
          id="btn-share-result"
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-[#004D28] bg-[#F0F7F2] border border-[#006837]/30 hover:bg-[#E2EFE6] transition-colors cursor-pointer"
        >
          {copiedLink ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>คัดลอกลิงก์แล้ว</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5" />
              <span>แชร์ผลลัพธ์</span>
            </>
          )}
        </button>
      </div>

      {/* Quick Jump Navigation Pill Buttons */}
      <div className="flex flex-wrap gap-2 pt-0.5">
        <button
          type="button"
          onClick={() => scrollToSection('card-primary-pathway')}
          className="px-3 py-1.5 rounded-full bg-[#F0F7F2] hover:bg-[#E2EFE6] border border-[#006837]/25 text-[#004D28] text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5"
        >
          <Compass className="w-3.5 h-3.5 text-[#B38918]" />
          <span>ดูเส้นทางการเรียนที่เหมาะกับคุณ</span>
        </button>
        <button
          type="button"
          onClick={() => scrollToSection('section-recommended-programs')}
          className="px-3 py-1.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer inline-flex items-center gap-1.5"
        >
          <BookOpen className="w-3.5 h-3.5 text-[#004D28]" />
          <span>ดู 3 หลักสูตรแนะนำ</span>
        </button>
      </div>

      {/* 1. Main Recommended Pathway Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        id="card-primary-pathway"
        className="rounded-3xl bg-gradient-to-b from-[#F4F9F6] via-white to-white text-slate-800 p-6 sm:p-7 shadow-sm border-2 border-[#006837]/25 space-y-5 relative overflow-hidden"
      >
        {/* Watermark Icon */}
        <div className="absolute right-0 top-0 translate-x-6 -translate-y-6 opacity-5 pointer-events-none">
          <IconHelper name={primaryPathway.iconName} className="w-56 h-56 text-[#004D28]" />
        </div>

        <div className="relative z-10 space-y-4">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold bg-[#E6F3EC] text-[#004D28] border border-[#006837]/20 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#B38918]" />
            <span>{primaryPathway.badgeText}</span>
          </div>

          {/* Pathway Name & Icon Header */}
          <div className="flex items-start gap-3.5 sm:gap-4">
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-[#004D28] text-[#E5C158] flex items-center justify-center flex-shrink-0 shadow-sm border border-[#D4AF37]/40">
              <IconHelper name={primaryPathway.iconName} className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <div className="space-y-1">
              <span className="text-[11px] sm:text-xs font-bold text-[#006837] uppercase tracking-wider block">
                เส้นทางการเรียนที่เหมาะกับคุณที่สุด:
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#00381D] leading-tight">
                {primaryPathway.name}
              </h1>
              <p className="text-xs sm:text-sm text-[#9E6D00] font-bold">
                {primaryPathway.tagline}
              </p>
            </div>
          </div>

          {/* Personality & Goal Description */}
          <div className="bg-white rounded-2xl p-4 sm:p-4.5 border border-slate-200/90 shadow-2xs space-y-1.5 text-xs sm:text-sm leading-relaxed">
            <p className="font-bold text-[#004D28]">
              {primaryPathway.targetAudience}
            </p>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              {primaryPathway.description}
            </p>
          </div>

          {/* Recommended Paths List */}
          <div className="space-y-2.5 pt-1">
            <h2 className="text-xs sm:text-sm font-bold text-[#00381D] flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-[#006837]" />
              <span>รูปแบบการศึกษา มสธ. ที่แนะนำสำหรับคุณ:</span>
            </h2>
            <div className="grid grid-cols-1 gap-2">
              {primaryPathway.recommendedPaths.map((path, idx) => (
                <div
                  key={idx}
                  className="bg-[#F8FAF9] rounded-xl p-3 sm:p-3.5 flex items-center gap-2.5 border border-slate-200/80 text-xs sm:text-sm text-slate-800 shadow-2xs hover:border-[#006837]/30 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#006837] flex-shrink-0" />
                  <span className="font-bold text-slate-800">{path}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Primary Persona Action Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                if (isCareer) {
                  window.open(GRADUATE_CURRICULUM_URL, '_blank', 'noopener,noreferrer');
                } else if (isUpskill) {
                  window.open(SUMRIT_URL, '_blank', 'noopener,noreferrer');
                } else {
                  window.open(BACHELOR_URL, '_blank', 'noopener,noreferrer');
                }
              }}
              className="w-full py-4 px-6 rounded-2xl bg-[#004D28] hover:bg-[#00381D] text-white font-extrabold text-[16px] sm:text-[17px] border-2 border-[#D4AF37]/50 shadow-md flex items-center justify-center gap-2.5 transition-all cursor-pointer"
            >
              <span>{primaryPathway.ctaText}</span>
              <ArrowUpRight className="w-5 h-5 text-[#E5C158]" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* 2. Top 3 Recommended Programs from 2569 Curriculum */}
      <div id="section-recommended-programs" className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="space-y-0.5">
            <h2 className="text-base sm:text-lg font-extrabold text-[#00381D] flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#006837]" />
              <span>3 อันดับหลักสูตรและเส้นทางแนะนำ</span>
            </h2>
            <p className="text-xs text-slate-500">
              วิเคราะห์จากความสนใจด้าน: <strong className="text-[#004D28] font-bold">{interestLabel}</strong>
            </p>
          </div>
        </div>

        {/* 3 Program Cards */}
        <div className="space-y-4">
          {topRecommendedPrograms.map((prog) => (
            <motion.div
              key={prog.programId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: (prog.rank - 1) * 0.1 }}
              className={`rounded-2xl border p-4 sm:p-5 space-y-3.5 transition-all shadow-2xs ${
                prog.rank === 1
                  ? 'bg-gradient-to-b from-[#F9FCFA] to-white border-[#006837]/35 ring-1 ring-[#006837]/15'
                  : 'bg-[#F8FAF9] border-slate-200'
              }`}
            >
              {/* Header: Rank + School + Program */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  {/* Rank Badge */}
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-sm flex-shrink-0 mt-0.5 shadow-xs ${
                      prog.rank === 1
                        ? 'bg-[#004D28] text-[#E5C158] border border-[#D4AF37]/50'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    #{prog.rank}
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[11px] font-bold text-[#006837] block">
                      {prog.schoolName}
                    </span>
                    <h3 className="text-sm sm:text-base font-extrabold text-[#00381D] leading-tight">
                      {prog.programName}
                    </h3>
                    <span className="inline-block text-[10px] font-bold px-2 py-0.5 bg-white border border-slate-200 rounded-md text-slate-600">
                      วุฒิ {prog.degreeName}
                    </span>
                  </div>
                </div>
              </div>

              {/* Matched Majors / Tracks: Up to 3 items */}
              {prog.matchedMajors.length > 0 && (
                <div className="bg-white p-3 sm:p-3.5 rounded-xl border border-slate-200 space-y-2">
                  <div className="text-[11px] font-bold text-[#004D28] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>เส้นทางที่คุณอาจสนใจ (วิชาเอก / แขนงวิชา):</span>
                  </div>
                  <div className="space-y-1.5">
                    {prog.matchedMajors.map((major) => (
                      <div
                        key={major.id}
                        className="p-2 rounded-lg bg-[#F8FAF9] border border-slate-100 text-xs space-y-0.5"
                      >
                        <div className="font-bold text-[#00381D] flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#006837]" />
                          <span>{major.name}</span>
                          {major.trackName && (
                            <span className="text-[10px] text-slate-500 font-normal">
                              ({major.trackName})
                            </span>
                          )}
                        </div>
                        {major.description && (
                          <p className="text-[11px] text-slate-600 pl-3">
                            {major.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Career Paths Chips Section */}
              {prog.careerPaths && prog.careerPaths.length > 0 && (
                <div className="bg-white p-3 sm:p-3.5 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-[11px] font-bold text-[#004D28] flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-[#B38918]" />
                      <span>ตัวอย่างงานที่อาจต่อยอดได้:</span>
                    </div>
                    {((prog.allCareerPaths && prog.allCareerPaths.length > prog.careerPaths.length) || (prog.careerNotes && prog.careerNotes.length > 0)) && (
                      <button
                        type="button"
                        onClick={() => setSelectedCareerProg(prog)}
                        className="text-[11px] font-bold text-[#006837] hover:text-[#00381D] hover:underline inline-flex items-center gap-0.5 cursor-pointer"
                      >
                        <span>ดูแนวทางเพิ่มเติม</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* 3-5 Chips */}
                  <div className="flex flex-wrap gap-1.5">
                    {prog.careerPaths.map((career, cIdx) => (
                      <span
                        key={cIdx}
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#F0F7F2] text-[#004D28] border border-[#006837]/20 shadow-2xs"
                      >
                        {career}
                      </span>
                    ))}
                  </div>

                  {/* Small Disclaimer */}
                  <p className="text-[10px] text-slate-500 leading-snug pt-0.5">
                    * ตัวอย่างนี้เป็นแนวทางการต่อยอดความรู้และทักษะ ผลลัพธ์จริงขึ้นอยู่กับคุณสมบัติ ประสบการณ์ กฎหมาย และเกณฑ์ของแต่ละตำแหน่งงาน
                  </p>
                </div>
              )}

              {/* Fit Rationale: <= 2 sentences */}
              {prog.fitReasons.length > 0 && (
                <div className="bg-[#F0F7F2] p-3 rounded-xl border border-[#006837]/15 space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#004D28] block">
                    เหตุผลที่แนะนำสำหรับคุณ:
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {prog.fitReasons.join(' ')}
                  </p>
                </div>
              )}

              {/* Direct Detail Link Button */}
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => handleDetailClick(prog)}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-[#F0F7F2] text-[#004D28] border border-[#006837]/30 font-bold text-xs shadow-2xs hover:border-[#006837] inline-flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>ดูรายละเอียดหลักสูตร</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#004D28]" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 3. Official Disclaimer */}
      <div className="bg-[#FDFBF2] rounded-2xl p-4 border border-[#D4AF37]/35 text-xs text-slate-700 flex items-start gap-2.5">
        <HelpCircle className="w-4 h-4 text-[#B38918] flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-[#8B6B15] font-bold">ข้อควรทราบ:</strong> ผลลัพธ์นี้เป็นคำแนะนำเบื้องต้นจากคำตอบของคุณ โปรดตรวจสอบรายละเอียด หลักเกณฑ์ และคุณสมบัติการสมัครจากแหล่งข้อมูลทางการก่อนตัดสินใจสมัคร
        </p>
      </div>

      {/* 4. Quick Portal Access Links */}
      <div id="section-action-portals" className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-sm sm:text-base font-bold text-[#00381D] flex items-center gap-2">
          <ExternalLink className="w-4 h-4 text-[#006837]" />
          <span>ระบบรับสมัครและข้อมูลทางการ มสธ.</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Bachelor Portal */}
          <a
            id="btn-view-bachelor"
            href={BACHELOR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all group ${
              isDegree
                ? 'bg-[#F0F7F2] border-[#006837] ring-1 ring-[#006837]/30'
                : 'bg-[#F8FAF9] border-slate-200 hover:border-[#006837]/40'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#004D28] text-white flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-xs sm:text-sm font-bold text-[#00381D]">
                  หลักสูตรปริญญาตรี มสธ.
                </p>
                <p className="text-[11px] text-slate-500">สำหรับผู้จบ ม.6 / ปวช. / ปวส.</p>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#004D28] transition-colors" />
          </a>

          {/* Graduate Portal */}
          <a
            id="btn-view-graduate"
            href={GRADUATE_CURRICULUM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all group ${
              isCareer
                ? 'bg-[#F0F7F2] border-[#006837] ring-1 ring-[#006837]/30'
                : 'bg-[#F8FAF9] border-slate-200 hover:border-[#006837]/40'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#004D28] text-[#E5C158] flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-xs sm:text-sm font-bold text-[#00381D]">
                  หลักสูตรบัณฑิตศึกษา มสธ.
                </p>
                <p className="text-[11px] text-slate-500">ปริญญาโท-เอก สำหรับผู้จบ ป.ตรี</p>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#004D28] transition-colors" />
          </a>

          {/* Sumrit Portal */}
          <a
            id="btn-view-sumrit"
            href={SUMRIT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all group ${
              isUpskill
                ? 'bg-[#FDFBF2] border-[#D4AF37] ring-1 ring-[#D4AF37]/50'
                : 'bg-[#F8FAF9] border-slate-200 hover:border-[#D4AF37]/40'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#D4AF37] text-[#00381D] flex items-center justify-center flex-shrink-0 font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-xs sm:text-sm font-bold text-[#00381D]">
                  โครงการสัมฤทธิบัตร มสธ.
                </p>
                <p className="text-[11px] text-[#B38918] font-medium">เรียนรายชุดวิชา / สะสมหน่วยกิต</p>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#004D28] transition-colors" />
          </a>

          {/* Admission Portal */}
          <a
            id="btn-apply-online-portal"
            href={STOU_ADMISSION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-2xl bg-[#F8FAF9] border border-slate-200 hover:border-emerald-300 flex items-center justify-between transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center flex-shrink-0">
                <Building className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-xs sm:text-sm font-bold text-slate-900">
                  ระบบรับสมัครออนไลน์ มสธ.
                </p>
                <p className="text-[11px] text-slate-500">cs.stou.ac.th/enroll/ (ตลอด 24 ชม.)</p>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#004D28] transition-colors" />
          </a>
        </div>

        {/* Call Center Info */}
        <div className="p-3.5 bg-[#F8FAF9] rounded-2xl border border-slate-200 space-y-1 text-xs">
          <div className="flex items-center gap-2 text-slate-700 font-bold">
            <PhoneCall className="w-4 h-4 text-[#006837]" />
            <span>มสธ. Call Center: <strong className="text-[#004D28]">{STOU_CALL_CENTER}</strong></span>
          </div>
          <p className="text-[11px] text-slate-500 pl-6">
            เวลาทำการ: {STOU_CALL_CENTER_HOURS}
          </p>
        </div>
      </div>

      {/* Regional Contact Card - ศวช. มสธ. ลำปาง */}
      <LampangContactCard />

      {/* Restart Quiz at Bottom */}
      <div className="text-center pt-2">
        <button
          id="btn-results-restart-bottom"
          type="button"
          onClick={onRestart}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-500 hover:text-[#004D28] py-2 px-4 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>ต้องการตอบแบบทดสอบใหม่อีกครั้ง</span>
        </button>
      </div>

      {/* Career Paths Detail Modal */}
      <AnimatePresence>
        {selectedCareerProg && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[11px] font-bold text-[#006837] block">
                    {selectedCareerProg.schoolName}
                  </span>
                  <h3 className="text-base sm:text-lg font-extrabold text-[#00381D]">
                    {selectedCareerProg.programName}
                  </h3>
                  {selectedCareerProg.majorName && (
                    <p className="text-xs text-[#B38918] font-semibold">
                      วิชาเอก/แขนงวิชา: {selectedCareerProg.majorName}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedCareerProg(null)}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="text-xs font-bold text-[#00381D] flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-[#006837]" />
                  <span>แนวทางงานและอาชีพที่อาจต่อยอดได้:</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {(selectedCareerProg.allCareerPaths || selectedCareerProg.careerPaths).map((career, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#F0F7F2] text-[#004D28] border border-[#006837]/20"
                    >
                      {career}
                    </span>
                  ))}
                </div>

                {selectedCareerProg.careerNotes && selectedCareerProg.careerNotes.length > 0 && (
                  <div className="p-3 bg-[#FDFBF2] rounded-xl border border-[#D4AF37]/30 text-xs text-[#8B6B15] space-y-1">
                    <strong className="font-bold block">เงื่อนไขและข้อกำหนดวิชาชีพ:</strong>
                    {selectedCareerProg.careerNotes.map((note, nIdx) => (
                      <p key={nIdx} className="text-[11px] leading-relaxed">
                        {note}
                      </p>
                    ))}
                  </div>
                )}

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 leading-relaxed">
                  <strong>คำชี้แจง:</strong> ตัวอย่างนี้เป็นแนวทางการต่อยอดความรู้และทักษะ ผลลัพธ์จริงขึ้นอยู่กับคุณสมบัติ ประสบการณ์ กฎหมาย และเกณฑ์ของแต่ละตำแหน่งงาน
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedCareerProg(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  ปิด
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const prog = selectedCareerProg;
                    setSelectedCareerProg(null);
                    handleDetailClick(prog);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#004D28] text-white font-bold text-xs hover:bg-[#00381D] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>ดูรายละเอียดหลักสูตร</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
