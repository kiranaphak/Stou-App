import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  Headphones,
  Phone,
  MessageCircle,
  Globe,
  CheckCircle2,
  Shield,
  Send,
  Building,
  Info,
  Clock,
  Sparkles,
  AlertTriangle,
  Loader2,
  Mail,
  HelpCircle,
  FileCheck2,
} from 'lucide-react';
import { PROGRAM_LIST, STOU_ADMISSION_URL, STOU_CALL_CENTER, STOU_LINE_OA } from '../data/programs';
import { ConsultationFormData, LeadSubmissionResponse, ScoredProgram } from '../types';

interface PrivacyNoticeProps {
  topPrograms: ScoredProgram[];
  preselectedProgramId?: string;
  onBackToResults: () => void;
}

export const PrivacyNotice: React.FC<PrivacyNoticeProps> = ({
  topPrograms,
  preselectedProgramId,
  onBackToResults,
}) => {
  // Extract URL parameters for event tracking and QR source without tracking PII
  const [eventParams, setEventParams] = useState({
    eventName: 'มสธ. นิทรรศการแนะแนวการศึกษา 2026',
    sourceQr: 'booth-web',
  });

  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const urlEvent = searchParams.get('event') || searchParams.get('eventName');
      const urlSrc = searchParams.get('src') || searchParams.get('qr') || searchParams.get('source');

      setEventParams({
        eventName: urlEvent ? decodeURIComponent(urlEvent) : 'มสธ. นิทรรศการแนะแนวการศึกษา 2026',
        sourceQr: urlSrc ? decodeURIComponent(urlSrc) : 'booth-web',
      });
    } catch {
      // Safe fallback
    }
  }, []);

  const [formData, setFormData] = useState<ConsultationFormData>({
    fullName: '',
    contactType: 'phone',
    contactValue: '',
    selectedPrograms: preselectedProgramId
      ? [preselectedProgramId]
      : topPrograms.map((p) => p.program.id),
    studyBackground: 'ม.6 / กศน. / ปวช.',
    convenientTime: 'ทุกช่วงเวลาที่สะดวกในเวลาราชการ',
    inquiryNote: '',
    consentInfo: false, // PDPA Compliance: Default to false (No pre-ticked consent)
    consentNews: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<LeadSubmissionResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [showFullPrivacyPolicy, setShowFullPrivacyPolicy] = useState(false);

  const toggleProgram = (progId: string) => {
    setFormData((prev) => {
      const exists = prev.selectedPrograms.includes(progId);
      if (exists) {
        return {
          ...prev,
          selectedPrograms: prev.selectedPrograms.filter((id) => id !== progId),
        };
      } else {
        return {
          ...prev,
          selectedPrograms: [...prev.selectedPrograms, progId],
        };
      }
    });
  };

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!formData.fullName.trim()) {
      errors.fullName = 'กรุณาระบุชื่อ-นามสกุล';
    }

    if (!formData.contactValue.trim()) {
      errors.contactValue = 'กรุณาระบุข้อมูลติดต่อกลับ';
    } else {
      if (formData.contactType === 'phone') {
        const cleanPhone = formData.contactValue.replace(/\D/g, '');
        if (cleanPhone.length < 9 || cleanPhone.length > 10) {
          errors.contactValue = 'กรุณากรอกเบอร์โทรศัพท์ 9-10 หลักให้ถูกต้อง';
        }
      } else if (formData.contactType === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.contactValue.trim())) {
          errors.contactValue = 'กรุณากรอกอีเมลในรูปแบบที่ถูกต้อง';
        }
      }
    }

    if (!formData.consentInfo) {
      errors.consentInfo = 'กรุณาให้ความยินยอมให้เจ้าหน้าที่ มสธ. ติดต่อกลับ';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Build recommendations string from top programs
      const recommendationsSummary = topPrograms
        .map((p) => `${p.rank}. ${p.program.name} (${p.matchPercentage}%)`)
        .join(' | ');

      // Build interest topic string
      const selectedProgramNames = formData.selectedPrograms
        .map((id) => PROGRAM_LIST.find((p) => p.id === id)?.name || id)
        .join(', ');

      const interestTopicsStr = `สาขาที่สนใจ: [${selectedProgramNames || 'ไม่ได้ระบุ'}], วุฒิเดิม: ${formData.studyBackground}`;
      const contactRequestStr = `คำถาม: ${formData.inquiryNote?.trim() || 'ขอคำแนะนำทั่วไป'}, เวลาสะดวก: ${formData.convenientTime}`;

      const payload = {
        full_name: formData.fullName.trim(),
        contact_type: formData.contactType,
        contact_value: formData.contactValue.trim(),
        quiz_recommendations: recommendationsSummary || 'ไม่มีผลคะแนน',
        interest_topics: interestTopicsStr,
        contact_request: contactRequestStr,
        consent_info: formData.consentInfo,
        consent_news: formData.consentNews,
        event_name: eventParams.eventName,
        source_qr: eventParams.sourceQr,
        privacy_version: 'v1.0-2026',
      };

      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data: LeadSubmissionResponse = await response.json();

      if (response.ok && data.success) {
        // Success: Clear browser form state completely to protect user PII
        setSubmissionResult(data);
        setFormData({
          fullName: '',
          contactType: 'phone',
          contactValue: '',
          selectedPrograms: [],
          studyBackground: 'ม.6 / กศน. / ปวช.',
          convenientTime: 'ทุกช่วงเวลาที่สะดวกในเวลาราชการ',
          inquiryNote: '',
          consentInfo: false,
          consentNews: false,
        });
        setFormErrors({});
      } else {
        // Handle server/Apps Script error
        setErrorMessage(
          data.error ||
            'บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง หรือติดต่อเจ้าหน้าที่ประจำบูธ มสธ.'
        );
      }
    } catch {
      // Network failure
      setErrorMessage(
        'เกิดข้อผิดพลาดในการเชื่อมต่อเครือข่าย กรุณาติดต่อเจ้าหน้าที่ประจำบูธ มสธ. หรือโทร Call Center'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="advisory-request-page" className="w-full max-w-2xl mx-auto px-4 py-5 sm:py-8 space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          id="btn-back-from-advisory"
          type="button"
          onClick={onBackToResults}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-white border border-slate-200 shadow-2xs hover:bg-[#F4F9F5] transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>ย้อนกลับไปหน้าผลลัพธ์</span>
        </button>

        <span className="text-xs font-bold text-[#00381D] bg-[#FDFBF2] px-3.5 py-1.5 rounded-full border border-[#D4AF37]/50 shadow-2xs">
          บริการแนะแนวการศึกษา มสธ.
        </span>
      </div>

      {/* Hero Header */}
      <div className="bg-[#004D28] text-white rounded-3xl p-6 sm:p-7 shadow-md border-2 border-[#D4AF37]/40 relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#D4AF37] text-[#00381D] flex items-center justify-center flex-shrink-0 shadow-xs">
            <Headphones className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              ขอให้เจ้าหน้าที่ มสธ. ติดต่อกลับ
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              กรอกข้อมูลเพื่อให้เจ้าหน้าที่ศูนย์บริการแนะแนวและรับสมัคร มสธ. ติดต่อกลับเพื่อให้คำปรึกษาหลักสูตรและขั้นตอนการสมัครเรียน
            </p>
          </div>
        </div>
      </div>

      {/* Direct Contact Channels Box */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 space-y-4 shadow-sm">
        <h2 className="text-sm sm:text-base font-bold text-[#00381D] flex items-center gap-2">
          <Building className="w-4 h-4 text-[#006837]" />
          <span>ช่องทางติดต่อเจ้าหน้าที่ มสธ. ได้ทันที</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          {/* Call Center */}
          <a
            id="link-stou-callcenter"
            href={`tel:${STOU_CALL_CENTER.replace(/\s+/g, '')}`}
            className="p-3.5 rounded-2xl bg-[#F8FAF9] hover:bg-[#F0F7F2] border border-slate-200 hover:border-[#006837]/30 transition-colors flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-xl bg-[#004D28] text-[#E5C158] flex items-center justify-center flex-shrink-0">
              <Phone className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-slate-900 text-xs sm:text-sm">STOU Call Center</p>
              <p className="text-xs text-[#004D28] font-bold mt-0.5">{STOU_CALL_CENTER}</p>
              <p className="text-[11px] text-slate-500 truncate">วันจันทร์ - อาทิตย์ (เวลาราชการ)</p>
            </div>
          </a>

          {/* LINE OA */}
          <a
            id="link-stou-line"
            href="https://line.me/R/ti/p/@stoucallcenter"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-2xl bg-[#F8FAF9] hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 transition-colors flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-slate-900 text-xs sm:text-sm">LINE Official Account</p>
              <p className="text-xs text-emerald-700 font-bold mt-0.5">{STOU_LINE_OA}</p>
              <p className="text-[11px] text-slate-500 truncate">สอบถามข้อมูลผ่านแชต LINE</p>
            </div>
          </a>

          {/* Admission Center */}
          <a
            id="link-stou-apply-direct"
            href={STOU_ADMISSION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-2xl bg-[#F8FAF9] hover:bg-[#FDFBF2] border border-slate-200 hover:border-[#D4AF37]/50 transition-colors flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-xl bg-[#D4AF37] text-[#00381D] flex items-center justify-center flex-shrink-0">
              <Globe className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-slate-900 text-xs sm:text-sm">ระบบรับสมัครนักศึกษา</p>
              <p className="text-xs text-[#B38918] font-bold mt-0.5">apply.stou.ac.th</p>
              <p className="text-[11px] text-slate-500 truncate">สมัครออนไลน์ได้ตลอด 24 ชม.</p>
            </div>
          </a>

          {/* Booth Staff Note */}
          <div className="p-3.5 rounded-2xl bg-[#F0F7F2] border border-[#006837]/20 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#004D28] text-[#E5C158] flex items-center justify-center flex-shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-[#00381D] text-xs sm:text-sm">ผู้เข้าชมบูธนิทรรศการ</p>
              <p className="text-[11px] text-[#004D28] leading-snug">
                สามารถยื่นหน้าจอนี้ให้เจ้าหน้าที่ประจำบูธ มสธ. ช่วยแนะนำได้ทันที
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Consultation Form Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 space-y-5 shadow-sm">
        <div className="space-y-1 pb-2 border-b border-slate-100">
          <h2 className="text-base font-bold text-[#00381D] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span>แบบฟอร์มขอให้เจ้าหน้าที่ มสธ. ติดต่อกลับ</span>
          </h2>
          <p className="text-xs text-slate-500">
            กรอกข้อมูลที่จำเป็น (*) เพื่อให้เจ้าหน้าที่จัดสรรผู้เชี่ยวชาญในสาขาที่ท่านสนใจติดต่อกลับ
          </p>
        </div>

        {/* Submission Failure Alert (Explicit Requirement) */}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            id="submission-error-alert"
            className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 space-y-2 shadow-2xs"
          >
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm text-rose-900">บันทึกข้อมูลไม่สำเร็จ</p>
                <p className="text-xs text-rose-800 leading-relaxed mt-0.5">{errorMessage}</p>
              </div>
            </div>
            <div className="pt-2 flex flex-wrap gap-2">
              <a
                href={`tel:${STOU_CALL_CENTER.replace(/\s+/g, '')}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>โทร Call Center {STOU_CALL_CENTER}</span>
              </a>
              <a
                href="https://line.me/R/ti/p/@stoucallcenter"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>แชต LINE @stoucallcenter</span>
              </a>
            </div>
          </motion.div>
        )}

        {/* Success State Card */}
        {submissionResult?.success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            id="submission-success-card"
            className="p-6 sm:p-7 rounded-3xl bg-[#F0F7F2] border border-[#006837]/30 text-center space-y-4 shadow-sm"
          >
            <div className="w-14 h-14 rounded-full bg-[#006837] text-white flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-[#00381D]">
                ส่งข้อมูลให้เจ้าหน้าที่ มสธ. สำเร็จแล้ว
              </h3>
              <p className="text-xs sm:text-sm text-[#004D28] leading-relaxed max-w-md mx-auto">
                เจ้าหน้าที่แนะแนวการศึกษา มสธ. จะติดต่อกลับตามช่องทางที่ท่านระบุ เพื่อให้ข้อมูลหลักสูตรและคำปรึกษาโดยเร็วที่สุด
              </p>
            </div>

            {/* Unique Lead ID Reference Badge */}
            {submissionResult.lead_id && (
              <div className="inline-block bg-white border border-[#006837]/30 rounded-xl px-4 py-2 text-xs text-slate-700 shadow-2xs">
                <span className="text-slate-500 font-medium">รหัสอ้างอิงการติดต่อ (Lead ID): </span>
                <span className="font-mono font-bold text-[#004D28]">{submissionResult.lead_id}</span>
              </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
              <button
                id="btn-return-results-after-submit"
                type="button"
                onClick={onBackToResults}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#004D28] text-[#E5C158] text-xs sm:text-sm font-bold shadow-xs hover:bg-[#00381D] transition-colors cursor-pointer"
              >
                กลับสู่หน้าผลการแนะนำหลักสูตร
              </button>

              <button
                id="btn-new-lead-form"
                type="button"
                onClick={() => setSubmissionResult(null)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white border border-[#006837]/30 text-[#004D28] text-xs sm:text-sm font-bold hover:bg-[#F0F7F2] transition-colors cursor-pointer"
              >
                ส่งข้อมูลเพิ่มเติม
              </button>
            </div>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 1. Full Name (Required) */}
            <div className="space-y-1.5">
              <label htmlFor="input-fullname" className="block text-xs sm:text-sm font-bold text-slate-800">
                ชื่อ - นามสกุล <span className="text-rose-600">*</span>
              </label>
              <input
                id="input-fullname"
                type="text"
                required
                placeholder="เช่น นายสมชาย ใจดี หรือ คุณสมหญิง"
                value={formData.fullName}
                onChange={(e) => {
                  setFormData({ ...formData, fullName: e.target.value });
                  if (formErrors.fullName) setFormErrors({ ...formErrors, fullName: '' });
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 bg-slate-50 focus:bg-white focus:outline-none transition-colors ${
                  formErrors.fullName
                    ? 'border-rose-400 focus:ring-2 focus:ring-rose-500'
                    : 'border-slate-300 focus:border-[#006837] focus:ring-2 focus:ring-[#006837]/20'
                }`}
              />
              {formErrors.fullName && (
                <p className="text-xs text-rose-600 font-medium">{formErrors.fullName}</p>
              )}
            </div>

            {/* 2. Contact Type Selector */}
            <div className="space-y-2">
              <label className="block text-xs sm:text-sm font-bold text-slate-800">
                ประเภทช่องทางการติดต่อที่สะดวก <span className="text-rose-600">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { type: 'phone' as const, label: 'เบอร์โทรศัพท์', icon: Phone },
                  { type: 'line' as const, label: 'LINE ID', icon: MessageCircle },
                  { type: 'email' as const, label: 'อีเมล (Email)', icon: Mail },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = formData.contactType === item.type;
                  return (
                    <button
                      key={item.type}
                      type="button"
                      onClick={() => setFormData({ ...formData, contactType: item.type })}
                      className={`p-2.5 rounded-xl border flex flex-col sm:flex-row items-center justify-center gap-1.5 text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#004D28] text-white border-[#004D28] shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-[#E5C158]' : 'text-slate-500'}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Contact Value (Required) */}
            <div className="space-y-1.5">
              <label htmlFor="input-contact-value" className="block text-xs sm:text-sm font-bold text-slate-800">
                ข้อมูลติดต่อ ({formData.contactType === 'phone' ? 'เบอร์โทรศัพท์' : formData.contactType === 'line' ? 'LINE ID' : 'อีเมล'}) <span className="text-rose-600">*</span>
              </label>
              <input
                id="input-contact-value"
                type={formData.contactType === 'email' ? 'email' : 'text'}
                required
                placeholder={
                  formData.contactType === 'phone'
                    ? 'เช่น 081-234-5678'
                    : formData.contactType === 'line'
                    ? 'เช่น @line_id หรือ somchai_stou'
                    : 'เช่น student@example.com'
                }
                value={formData.contactValue}
                onChange={(e) => {
                  setFormData({ ...formData, contactValue: e.target.value });
                  if (formErrors.contactValue) setFormErrors({ ...formErrors, contactValue: '' });
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 bg-slate-50 focus:bg-white focus:outline-none transition-colors ${
                  formErrors.contactValue
                    ? 'border-rose-400 focus:ring-2 focus:ring-rose-500'
                    : 'border-slate-300 focus:border-[#006837] focus:ring-2 focus:ring-[#006837]/20'
                }`}
              />
              {formErrors.contactValue && (
                <p className="text-xs text-rose-600 font-medium">{formErrors.contactValue}</p>
              )}
            </div>

            {/* 4. Interested Programs Checkboxes */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs sm:text-sm font-bold text-slate-800">
                  กลุ่มสาขาวิชาที่สนใจขอรับคำปรึกษา:
                </label>
                <span className="text-[11px] text-slate-500">เลือกได้หลายสาขา</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto p-1 bg-slate-50 rounded-2xl border border-slate-200">
                {PROGRAM_LIST.map((prog) => {
                  const isChecked = formData.selectedPrograms.includes(prog.id);
                  return (
                    <button
                      key={prog.id}
                      type="button"
                      onClick={() => toggleProgram(prog.id)}
                      className={`p-2.5 rounded-xl border text-left flex items-center justify-between text-xs transition-colors cursor-pointer ${
                        isChecked
                          ? 'bg-[#004D28] text-white border-[#004D28] font-bold shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span className="truncate pr-1">{prog.name}</span>
                      {isChecked && <CheckCircle2 className="w-4 h-4 text-[#E5C158] flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. Study Background */}
            <div className="space-y-1.5">
              <label htmlFor="input-study-bg" className="block text-xs sm:text-sm font-bold text-slate-800">
                วุฒิการศึกษาเดิมที่มี:
              </label>
              <select
                id="input-study-bg"
                value={formData.studyBackground}
                onChange={(e) => setFormData({ ...formData, studyBackground: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006837]/20"
              >
                <option value="ม.6 / กศน. / ปวช.">ม.6 / กศน. / ปวช. (หลักสูตร 4 ปี)</option>
                <option value="ปวส. / อนุปริญญา">ปวส. / อนุปริญญา (หลักสูตรเทียบโอน 2-3 ปี)</option>
                <option value="ปริญญาตรี (เรียนปริญญาที่ 2)">ปริญญาตรี (ต้องการเรียนปริญญาตรีใบที่ 2)</option>
                <option value="อื่นๆ / กำลังศึกษาอยู่">อื่นๆ / กำลังศึกษาอยู่</option>
              </select>
            </div>

            {/* 6. Convenient Time & Note */}
            <div className="space-y-1.5">
              <label htmlFor="input-note" className="block text-xs sm:text-sm font-bold text-slate-800">
                ข้อคำถามที่ต้องการปรึกษา หรือระบุช่วงเวลาที่สะดวก:
              </label>
              <textarea
                id="input-note"
                rows={2}
                placeholder="เช่น ต้องการทราบค่าใช้จ่ายตลอดหลักสูตร หรือสะดวกให้ติดต่อกลับช่วงบ่าย 13:00 - 16:00 น."
                value={formData.inquiryNote}
                onChange={(e) => setFormData({ ...formData, inquiryNote: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006837]/20 resize-none"
              />
            </div>

            {/* 7. Mandatory & Optional Consents (PDPA Compliance) */}
            <div className="space-y-3 pt-2 bg-[#F8FAF9] p-4 rounded-2xl border border-slate-200">
              <div className="flex items-start gap-3">
                <input
                  id="checkbox-consent-info"
                  type="checkbox"
                  required
                  checked={formData.consentInfo}
                  onChange={(e) => {
                    setFormData({ ...formData, consentInfo: e.target.checked });
                    if (formErrors.consentInfo) setFormErrors({ ...formErrors, consentInfo: '' });
                  }}
                  className="w-4 h-4 mt-0.5 rounded border-slate-300 text-[#006837] focus:ring-[#006837] flex-shrink-0 cursor-pointer"
                />
                <label htmlFor="checkbox-consent-info" className="text-xs text-slate-800 leading-relaxed cursor-pointer">
                  <span className="font-bold text-slate-900">ยินยอมให้เจ้าหน้าที่ มสธ. ติดต่อกลับ <span className="text-rose-600">*</span></span>
                  <p className="text-slate-600 text-[11px] mt-0.5">
                    ข้าพเจ้ายินยอมให้มหาวิทยาลัยสุโขทัยธรรมาธิราชเก็บรวบรวมและใช้ข้อมูลติดต่อข้างต้น เพื่อวัตถุประสงค์ในการติดต่อกลับ ให้คำปรึกษาหลักสูตร และข้อมูลการรับสมัครตามที่ข้าพเจ้าร้องขอ
                  </p>
                </label>
              </div>
              {formErrors.consentInfo && (
                <p className="text-xs text-rose-600 font-medium pl-7">{formErrors.consentInfo}</p>
              )}

              <div className="flex items-start gap-3 pt-2 border-t border-slate-200">
                <input
                  id="checkbox-consent-news"
                  type="checkbox"
                  checked={formData.consentNews}
                  onChange={(e) => setFormData({ ...formData, consentNews: e.target.checked })}
                  className="w-4 h-4 mt-0.5 rounded border-slate-300 text-[#006837] focus:ring-[#006837] flex-shrink-0 cursor-pointer"
                />
                <label htmlFor="checkbox-consent-news" className="text-xs text-slate-700 leading-relaxed cursor-pointer">
                  <span className="font-semibold text-slate-800">ยินยอมรับข่าวสารการรับสมัครและกิจกรรมทางการศึกษา มสธ. (ไม่บังคับ)</span>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    ยินยอมรับข้อมูลข่าวสารกำหนดการรับสมัครทุนการศึกษาและกิจกรรมวิชาการทางอีเมลหรือช่องทางที่ให้ไว้
                  </p>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="btn-submit-lead-form"
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 px-5 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md transition-all ${
                isSubmitting
                  ? 'bg-slate-400 text-white cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#004D28] via-[#006837] to-[#0B7A42] text-[#E5C158] border-2 border-[#D4AF37]/50 hover:brightness-110 active:scale-[0.99] cursor-pointer'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>กำลังบันทึกข้อมูลให้เจ้าหน้าที่...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>ส่งข้อมูลให้เจ้าหน้าที่ มสธ. ติดต่อกลับ</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>

      {/* Comprehensive PDPA Privacy Notice Card */}
      <div id="pdpa-notice-card" className="bg-[#F8FAF9] rounded-2xl p-4 sm:p-5 border border-slate-200 space-y-3 text-xs text-slate-600 leading-relaxed shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-[#00381D] text-xs sm:text-sm">
            <Shield className="w-4 h-4 text-[#006837]" />
            <span>การคุ้มครองข้อมูลส่วนบุคคล (PDPA Privacy Notice)</span>
          </div>

          <button
            id="btn-toggle-pdpa-details"
            type="button"
            onClick={() => setShowFullPrivacyPolicy(!showFullPrivacyPolicy)}
            className="text-xs font-bold text-[#004D28] hover:text-[#006837] underline cursor-pointer"
          >
            {showFullPrivacyPolicy ? 'ย่อรายละเอียด' : 'อ่านประกาศฉบับเต็ม'}
          </button>
        </div>

        <p className="text-slate-700">
          มหาวิทยาลัยสุโขทัยธรรมาธิราช (มสธ.) ให้ความสำคัญสูงสุดต่อการคุ้มครองข้อมูลส่วนบุคคลตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA) ข้อมูลที่ท่านกรอกจะถูกนำไปใช้เพื่อการแนะแนวการศึกษาและการติดต่อกลับตามที่ท่านร้องขอเท่านั้น
        </p>

        {showFullPrivacyPolicy && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="pt-3 border-t border-slate-200 space-y-2.5 text-[11px] sm:text-xs text-slate-700 bg-white p-3.5 rounded-2xl border border-slate-200"
          >
            <div>
              <p className="font-bold text-[#00381D]">1. ผู้ควบคุมข้อมูลส่วนบุคคล (Data Controller)</p>
              <p className="text-slate-600">มหาวิทยาลัยสุโขทัยธรรมาธิราช 9/9 หมู่ 9 ถนนแจ้งวัฒนะ ตำบลบางพูด อำเภอปากเกร็ด จังหวัดนนทบุรี 11120</p>
            </div>

            <div>
              <p className="font-bold text-[#00381D]">2. วัตถุประสงค์ในการเก็บรวบรวมและใช้ข้อมูล (Purpose)</p>
              <p className="text-slate-600">ใช้เพื่อการติดต่อกลับ ชี้แจงรายละเอียดหลักสูตร ขั้นตอนการสมัครเรียน และการให้คำปรึกษาทางการศึกษาตามความประสงค์ของท่าน</p>
            </div>

            <div>
              <p className="font-bold text-[#00381D]">3. ระยะเวลาการเก็บรักษา (Retention Period)</p>
              <p className="text-slate-600">จัดเก็บข้อมูลเป็นระยะเวลาไม่เกิน 1 ปีการศึกษา หรือจนกว่ากระบวนการแนะแนวและรับสมัครจะเสร็จสิ้น จากนั้นข้อมูลจะถูกลบหรือทำลายอย่างปลอดภัย</p>
            </div>

            <div>
              <p className="font-bold text-[#00381D]">4. สิทธิของเจ้าของข้อมูลส่วนบุคคล (Your Rights)</p>
              <p className="text-slate-600">ท่านมีสิทธิในการขอเข้าถึง ขอสำเนา ขอแก้ไข ขอระงับการใช้ ขอให้ลบทำลาย หรือขอถอนความยินยอมได้ตลอดเวลา โดยติดต่อผ่าน Call Center หรือศูนย์บริการ มสธ.</p>
            </div>

            <div>
              <p className="font-bold text-[#00381D]">5. มาตรการรักษาความมั่นคงปลอดภัย (Security Safeguards)</p>
              <p className="text-slate-600">ข้อมูลถูกส่งผ่านการเข้ารหัส HTTPS มาตรฐานสากล ไม่มีการบันทึก PII ใน Log ของระบบสาธารณะ และมีระบบป้องกันการสแกนหรือยิงข้อมูลอัตโนมัติ</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
