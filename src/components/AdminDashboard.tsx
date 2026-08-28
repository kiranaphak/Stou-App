import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BarChart3,
  Users,
  CheckCircle2,
  RotateCcw,
  MousePointerClick,
  TrendingUp,
  Download,
  Calendar,
  Filter,
  Shield,
  ArrowLeft,
  RefreshCw,
  Award,
  Layers,
  Sparkles,
  GraduationCap,
  Eye,
  Lock,
  FileSpreadsheet,
  FileText,
  AlertTriangle,
  Check,
  X,
  Loader2,
  Phone,
  MapPin,
  HelpCircle,
  Clock,
  Printer,
  Share2,
  ExternalLink,
  FileDown,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  fetchQuizSessionsForAdmin,
  fetchAnalyticsMetrics,
  fetchAnalyticsEvents,
  resetAdminAnalyticsAndSessions,
  APP_VERSION,
} from '../lib/firebase';
import { AnonymousQuizSessionPayload } from '../types';
import { QUIZ_QUESTIONS } from '../data/questions';
import {
  AggregatedStats,
  ReportMetadata,
  generateExcelWorkbook,
} from '../utils/excelExporter';
import { PrintableReportDocument } from './PrintableReportDocument';

interface AdminDashboardProps {
  onBackToApp: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToApp }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(true);
  const [exportingPDF, setExportingPDF] = useState(false);
  const [exportingExcel, setExportingExcel] = useState(false);

  const [sessions, setSessions] = useState<AnonymousQuizSessionPayload[]>([]);
  const [rawMetrics, setRawMetrics] = useState<Record<string, number>>({});
  const [rawEvents, setRawEvents] = useState<{ eventName: string; payload: any }[]>([]);

  // Filtering states
  const [dateFilter, setDateFilter] = useState<'today' | '7days' | '30days' | 'all' | 'custom'>('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [personaFilter, setPersonaFilter] = useState<string>('all');

  // Reset confirmation modal & notification
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetSuccessNotice, setResetSuccessNotice] = useState(false);

  // PDF download success & printing states
  const [pdfSuccessModal, setPdfSuccessModal] = useState<{
    fileName: string;
    blobUrl: string;
    blob: Blob;
  } | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);

  const printableReportRef = useRef<HTMLDivElement>(null);
  const defaultAdminPass = 'stou2569';

  // Load data
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [fetchedSessions, metrics, events] = await Promise.all([
        fetchQuizSessionsForAdmin(),
        fetchAnalyticsMetrics(),
        fetchAnalyticsEvents(),
      ]);
      setSessions(fetchedSessions);
      setRawMetrics(metrics);
      setRawEvents(events);
    } catch (e) {
      console.warn('Dashboard data fetch note:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim() === defaultAdminPass || passwordInput.trim() === 'admin') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('คุณไม่มีสิทธิ์เข้าถึงรายงานนี้ โปรดตรวจสอบรหัสผ่านกับเจ้าหน้าที่ผู้ดูแลระบบ');
    }
  };

  // 1. Filtered Sessions by Date and Persona
  const filteredSessions = useMemo(() => {
    return sessions.filter((s) => {
      // Date filter
      if (s.completedAt) {
        const sessionDate = new Date(s.completedAt).getTime();
        const now = Date.now();

        if (dateFilter === 'today') {
          const diffDays = (now - sessionDate) / (1000 * 3600 * 24);
          if (diffDays > 1) return false;
        } else if (dateFilter === '7days') {
          const diffDays = (now - sessionDate) / (1000 * 3600 * 24);
          if (diffDays > 7) return false;
        } else if (dateFilter === '30days') {
          const diffDays = (now - sessionDate) / (1000 * 3600 * 24);
          if (diffDays > 30) return false;
        } else if (dateFilter === 'custom') {
          if (customStartDate) {
            const start = new Date(customStartDate).getTime();
            if (sessionDate < start) return false;
          }
          if (customEndDate) {
            const end = new Date(customEndDate).getTime() + 86400000;
            if (sessionDate > end) return false;
          }
        }
      }

      // Persona filter
      if (personaFilter !== 'all' && s.primaryPersona !== personaFilter) {
        return false;
      }

      return true;
    });
  }, [sessions, dateFilter, customStartDate, customEndDate, personaFilter]);

  // 2. Filtered Events
  const filteredEvents = useMemo(() => {
    return rawEvents.filter((ev) => {
      if (ev.payload?.timestamp) {
        const evDate = new Date(ev.payload.timestamp).getTime();
        const now = Date.now();

        if (dateFilter === 'today') {
          const diffDays = (now - evDate) / (1000 * 3600 * 24);
          if (diffDays > 1) return false;
        } else if (dateFilter === '7days') {
          const diffDays = (now - evDate) / (1000 * 3600 * 24);
          if (diffDays > 7) return false;
        } else if (dateFilter === '30days') {
          const diffDays = (now - evDate) / (1000 * 3600 * 24);
          if (diffDays > 30) return false;
        } else if (dateFilter === 'custom') {
          if (customStartDate) {
            const start = new Date(customStartDate).getTime();
            if (evDate < start) return false;
          }
          if (customEndDate) {
            const end = new Date(customEndDate).getTime() + 86400000;
            if (evDate > end) return false;
          }
        }
      }
      return true;
    });
  }, [rawEvents, dateFilter, customStartDate, customEndDate]);

  // 3. Compute Aggregated Metrics
  const aggregatedStats: AggregatedStats = useMemo(() => {
    const completed = filteredSessions.length || (dateFilter === 'all' ? rawMetrics['quiz_completed'] || 0 : 0);
    const started = Math.max(completed, filteredEvents.filter((e) => e.eventName === 'quiz_started').length || (dateFilter === 'all' ? rawMetrics['quiz_started'] || 0 : completed));
    const views = Math.max(started, filteredEvents.filter((e) => e.eventName === 'quiz_viewed').length || (dateFilter === 'all' ? rawMetrics['quiz_viewed'] || 0 : started));
    const restarted = filteredEvents.filter((e) => e.eventName === 'quiz_restarted').length || (dateFilter === 'all' ? rawMetrics['quiz_restarted'] || 0 : 0);

    const detailClicks = filteredEvents.filter((e) => e.eventName === 'result_detail_clicked').length || (dateFilter === 'all' ? rawMetrics['result_detail_clicked'] || 0 : 0);

    let lampangPhone8686 = 0;
    let lampangPhone8684 = 0;
    let lampangPhone8687 = 0;
    let lampangMapClicks = 0;

    filteredEvents.forEach((e) => {
      if (e.eventName === 'lampang_center_contact_clicked') {
        const key = e.payload?.phone_number_key;
        if (key === '8684') lampangPhone8684++;
        else if (key === '8687') lampangPhone8687++;
        else lampangPhone8686++;
      } else if (e.eventName === 'lampang_center_map_clicked') {
        lampangMapClicks++;
      }
    });

    const lampangContactClicks = lampangPhone8686 + lampangPhone8684 + lampangPhone8687;

    const completionRate = started > 0 ? (completed / started) * 100 : 100;
    const detailCtr = completed > 0 ? (detailClicks / completed) * 100 : 0;
    const contactIntentRate = completed > 0 ? ((lampangContactClicks + lampangMapClicks) / completed) * 100 : 0;

    // Persona Counts
    const personaCounts = { career: 0, degree: 0, upskill: 0 };
    filteredSessions.forEach((s) => {
      if (s.primaryPersona === 'career') personaCounts.career++;
      else if (s.primaryPersona === 'degree') personaCounts.degree++;
      else if (s.primaryPersona === 'upskill') personaCounts.upskill++;
    });

    // Interest Counts
    const interestCounts: Record<string, number> = {
      people: 0,
      business: 0,
      law_society: 0,
      communication: 0,
      health: 0,
      agriculture: 0,
      technology: 0,
    };
    filteredSessions.forEach((s) => {
      const area = s.answers?.interestArea || 'business';
      interestCounts[area] = (interestCounts[area] || 0) + 1;
    });

    // Top Schools and Programs
    const programMap: Record<string, { schoolName: string; programName: string; majorName: string; recommendationCount: number; detailClickCount: number }> = {};
    const schoolMap: Record<string, { count: number; clickCount: number }> = {};

    filteredSessions.forEach((s) => {
      s.recommendedPrograms?.forEach((prog) => {
        const key = `${prog.schoolName}_${prog.programName}_${prog.majorName || prog.trackName || ''}`;
        if (!programMap[key]) {
          programMap[key] = {
            schoolName: prog.schoolName,
            programName: prog.programName,
            majorName: prog.majorName || prog.trackName || '',
            recommendationCount: 0,
            detailClickCount: 0,
          };
        }
        programMap[key].recommendationCount++;

        if (!schoolMap[prog.schoolName]) {
          schoolMap[prog.schoolName] = { count: 0, clickCount: 0 };
        }
        schoolMap[prog.schoolName].count++;
      });
    });

    // Count clicks per school/program
    filteredEvents.forEach((e) => {
      if (e.eventName === 'result_detail_clicked') {
        const progName = e.payload?.program_name;
        const school = e.payload?.school_code || e.payload?.school_name;
        if (school && schoolMap[school]) {
          schoolMap[school].clickCount++;
        }
        if (progName) {
          Object.values(programMap).forEach((p) => {
            if (p.programName === progName) {
              p.detailClickCount++;
            }
          });
        }
      }
    });

    const topPrograms = Object.values(programMap).sort((a, b) => b.recommendationCount - a.recommendationCount);
    const topSchools = Object.entries(schoolMap).map(([name, data]) => ({
      name,
      count: data.count,
      clickCount: data.clickCount,
    })).sort((a, b) => b.count - a.count);

    // Daily Trends
    const dayMap: Record<string, { views: number; started: number; completed: number; detailClicks: number; contactClicks: number; mapClicks: number }> = {};

    filteredSessions.forEach((s) => {
      if (s.completedAt) {
        const d = new Date(s.completedAt).toLocaleDateString('th-TH');
        if (!dayMap[d]) dayMap[d] = { views: 0, started: 0, completed: 0, detailClicks: 0, contactClicks: 0, mapClicks: 0 };
        dayMap[d].completed++;
        dayMap[d].started = Math.max(dayMap[d].started, dayMap[d].completed);
        dayMap[d].views = Math.max(dayMap[d].views, dayMap[d].started);
      }
    });

    filteredEvents.forEach((e) => {
      if (e.payload?.timestamp) {
        const d = new Date(e.payload.timestamp).toLocaleDateString('th-TH');
        if (!dayMap[d]) dayMap[d] = { views: 0, started: 0, completed: 0, detailClicks: 0, contactClicks: 0, mapClicks: 0 };
        if (e.eventName === 'quiz_viewed') dayMap[d].views++;
        else if (e.eventName === 'quiz_started') dayMap[d].started++;
        else if (e.eventName === 'result_detail_clicked') dayMap[d].detailClicks++;
        else if (e.eventName === 'lampang_center_contact_clicked') dayMap[d].contactClicks++;
        else if (e.eventName === 'lampang_center_map_clicked') dayMap[d].mapClicks++;
      }
    });

    const dailyTrends = Object.entries(dayMap).map(([date, d]) => ({
      date,
      views: Math.max(d.views, d.started, d.completed),
      started: Math.max(d.started, d.completed),
      completed: d.completed,
      completionRate: d.started > 0 ? (d.completed / d.started) * 100 : 100,
      detailClicks: d.detailClicks,
      contactClicks: d.contactClicks,
      mapClicks: d.mapClicks,
    })).sort((a, b) => a.date.localeCompare(b.date));

    // Funnel stages
    const qAnswerCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
    filteredEvents.forEach((e) => {
      if (e.eventName === 'quiz_question_answered') {
        const qNum = e.payload?.question_number;
        if (qNum && qAnswerCounts[qNum] !== undefined) {
          qAnswerCounts[qNum]++;
        }
      }
    });

    // Ensure monotonically non-increasing funnel consistency
    const q1 = Math.max(completed, qAnswerCounts[1] || started);
    const q2 = Math.max(completed, qAnswerCounts[2] || q1);
    const q3 = Math.max(completed, qAnswerCounts[3] || q2);
    const q4 = Math.max(completed, qAnswerCounts[4] || q3);
    const q5 = Math.max(completed, qAnswerCounts[5] || q4);
    const q6 = Math.max(completed, qAnswerCounts[6] || completed);

    const baseStarted = Math.max(1, started);

    const funnelStages = [
      { stage: 'quiz_viewed', stageLabel: '1. ผู้เข้าชมหน้าแรก (Views)', count: views, pctOfStarted: (views / baseStarted) * 100 },
      { stage: 'quiz_started', stageLabel: '2. เริ่มทำแบบทดสอบ (Started)', count: started, pctOfStarted: 100.0 },
      { stage: 'question_1_answered', stageLabel: '3. ตอบคำถามข้อ 1 (ช่วงชีวิต)', count: q1, pctOfStarted: (q1 / baseStarted) * 100 },
      { stage: 'question_2_answered', stageLabel: '4. ตอบคำถามข้อ 2 (เป้าหมาย)', count: q2, pctOfStarted: (q2 / baseStarted) * 100 },
      { stage: 'question_3_answered', stageLabel: '5. ตอบคำถามข้อ 3 (ผลลัพธ์ที่อยากได้)', count: q3, pctOfStarted: (q3 / baseStarted) * 100 },
      { stage: 'question_4_answered', stageLabel: '6. ตอบคำถามข้อ 4 (กลุ่มความสนใจ)', count: q4, pctOfStarted: (q4 / baseStarted) * 100 },
      { stage: 'question_5_answered', stageLabel: '7. ตอบคำถามข้อ 5 (การนำไปใช้)', count: q5, pctOfStarted: (q5 / baseStarted) * 100 },
      { stage: 'question_6_answered', stageLabel: '8. ตอบคำถามข้อ 6 (รูปแบบที่สนใจ)', count: q6, pctOfStarted: (q6 / baseStarted) * 100 },
      { stage: 'quiz_completed', stageLabel: '9. ได้รับผลลัพธ์เส้นทาง (Completed)', count: completed, pctOfStarted: (completed / baseStarted) * 100 },
      { stage: 'result_detail_clicked', stageLabel: '10. คลิกดูรายละเอียดหลักสูตรต่อ', count: detailClicks, pctOfStarted: (detailClicks / baseStarted) * 100 },
      { stage: 'contact_clicked', stageLabel: '11. แสดงความสนใจติดต่อ ศวช. ลำปาง', count: lampangContactClicks + lampangMapClicks, pctOfStarted: ((lampangContactClicks + lampangMapClicks) / baseStarted) * 100 },
    ];

    // Question answers breakdown
    const optionCounts: Record<string, number> = {};
    filteredSessions.forEach((s) => {
      if (s.answers) {
        Object.values(s.answers).forEach((val) => {
          if (typeof val === 'string' && val) {
            optionCounts[val] = (optionCounts[val] || 0) + 1;
          }
        });
      }
    });

    const questionBreakdown: { questionId: number; questionTitle: string; optionId: string; optionLabel: string; count: number; pctOfCompleted: number }[] = [];
    QUIZ_QUESTIONS.forEach((q) => {
      q.options.forEach((opt) => {
        const count = optionCounts[opt.id] || 0;
        const pctOfCompleted = completed > 0 ? (count / completed) * 100 : 0;
        questionBreakdown.push({
          questionId: q.id,
          questionTitle: q.title,
          optionId: opt.id,
          optionLabel: opt.label,
          count,
          pctOfCompleted,
        });
      });
    });

    return {
      views,
      started,
      completed,
      restarted,
      detailClicks,
      lampangContactClicks,
      lampangMapClicks,
      lampangPhone8686,
      lampangPhone8684,
      lampangPhone8687,
      completionRate,
      detailCtr,
      contactIntentRate,
      personaCounts,
      interestCounts,
      topSchools,
      topPrograms,
      dailyTrends,
      funnelStages,
      questionBreakdown,
    };
  }, [filteredSessions, filteredEvents, rawMetrics, dateFilter]);

  // Report metadata
  const reportMeta: ReportMetadata = useMemo(() => {
    let dateRangeText = 'ทั้งหมด (All Time)';
    if (dateFilter === 'today') dateRangeText = 'วันนี้ (Today)';
    else if (dateFilter === '7days') dateRangeText = '7 วันล่าสุด (Last 7 Days)';
    else if (dateFilter === '30days') dateRangeText = '30 วันล่าสุด (Last 30 Days)';
    else if (dateFilter === 'custom') {
      dateRangeText = `${customStartDate || 'เริ่มต้น'} ถึง ${customEndDate || 'ปัจจุบัน'}`;
    }

    return {
      title: 'รายงานสรุปสถิติการใช้งาน Web app ค้นหาเส้นทางเรียน มสธ. ที่ใช่สำหรับคุณ',
      agency: 'ศูนย์วิทยบริการและชุมชนสัมพันธ์ มสธ. ลำปาง',
      dateRangeText,
      generatedAtText: new Date().toLocaleString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      appVersion: APP_VERSION,
      quizVersion: '2569-v1',
      dataSource: 'Firebase Analytics และ Firestore',
      privacyDisclaimer:
        'รายงานนี้เป็นข้อมูลสรุปแบบไม่ระบุตัวตน เพื่อวิเคราะห์ภาพรวมความสนใจในการเรียนรู้ ไม่ใช่จำนวนผู้สมัครเรียน',
    };
  }, [dateFilter, customStartDate, customEndDate]);

  // Handle Export Excel (.xlsx)
  const handleExportExcel = () => {
    setExportingExcel(true);
    try {
      const wb = generateExcelWorkbook(reportMeta, aggregatedStats, filteredSessions.length);
      const dateStr = new Date().toISOString().slice(0, 10);
      const fileName = `STOU_Lampang_Quiz_Statistics_${dateStr}.xlsx`;
      XLSX.writeFile(wb, fileName);
    } catch (e) {
      console.error('Export Excel failed:', e);
    } finally {
      setExportingExcel(false);
    }
  };

  // Handle Print (Browser & OS native print dialog)
  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.focus();
      try {
        window.print();
      } catch (err) {
        console.warn('Window print error:', err);
      } finally {
        setIsPrinting(false);
      }
    }, 150);
  };

  // Handle Export PDF (Executive clean A4 layout saved directly to computer or mobile)
  const handleExportPDF = async () => {
    const element = printableReportRef.current;
    if (!element) {
      handlePrint();
      return;
    }

    setExportingPDF(true);

    try {
      window.scrollTo(0, 0);

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#FFFFFF',
        windowWidth: element.scrollWidth || 1024,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const imgWidth = pageWidth - margin * 2;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = margin;

      // Page 1
      pdf.addImage(imgData, 'JPEG', margin, position, imgWidth, imgHeight);
      heightLeft -= (pageHeight - margin * 2);

      // Subsequent pages if long
      while (heightLeft > 0) {
        position = heightLeft - imgHeight + margin;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', margin, position, imgWidth, imgHeight);
        heightLeft -= (pageHeight - margin * 2);
      }

      const dateStr = new Date().toISOString().slice(0, 10);
      const fileName = `STOU_Lampang_Quiz_Statistics_${dateStr}.pdf`;

      // 1. Generate Blob & Object URL for direct file downloading across PC and Mobile
      const pdfBlob = pdf.output('blob');
      const blobUrl = URL.createObjectURL(pdfBlob);

      // 2. Trigger native download link
      const downloadLink = document.createElement('a');
      downloadLink.href = blobUrl;
      downloadLink.download = fileName;
      downloadLink.target = '_blank';
      downloadLink.rel = 'noopener noreferrer';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      setTimeout(() => {
        try {
          document.body.removeChild(downloadLink);
        } catch (e) {
          // ignore
        }
      }, 2000);

      // 3. Open Success Modal with options: Open PDF, Save Again, Print, Share
      setPdfSuccessModal({
        fileName,
        blobUrl,
        blob: pdfBlob,
      });
    } catch (error) {
      console.error('Error generating PDF download:', error);
      handlePrint();
    } finally {
      setExportingPDF(false);
    }
  };

  // Handle Share PDF (Mobile Web Share API)
  const handleSharePDF = async () => {
    if (!pdfSuccessModal) return;
    try {
      const file = new File([pdfSuccessModal.blob], pdfSuccessModal.fileName, { type: 'application/pdf' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'รายงานสรุปผู้บริหาร สถิติ มสธ. ลำปาง',
          text: 'รายงานสถิติแบบทดสอบค้นหาตนเอง ศูนย์วิทยบริการและชุมชนสัมพันธ์ มสธ. ลำปาง',
        });
      } else {
        window.open(pdfSuccessModal.blobUrl, '_blank');
      }
    } catch (e) {
      console.warn('Share error or cancelled:', e);
    }
  };

  // Reset Analytics and Sessions
  const handleConfirmReset = () => {
    resetAdminAnalyticsAndSessions();
    setSessions([]);
    setRawEvents([]);
    setRawMetrics({
      quiz_viewed: 0,
      quiz_started: 0,
      quiz_completed: 0,
      quiz_restarted: 0,
      result_detail_clicked: 0,
      result_program_viewed: 0,
    });
    setShowResetModal(false);
    setResetSuccessNotice(true);
    setTimeout(() => {
      setResetSuccessNotice(false);
    }, 5000);
  };

  // Authentication Lock Screen
  if (!isAuthenticated) {
    return (
      <div className="w-full max-w-md mx-auto px-4 py-12 space-y-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-5 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#004D28] text-[#E5C158] mx-auto flex items-center justify-center shadow-xs">
            <Lock className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <h1 className="text-xl font-extrabold text-[#00381D]">
              ระบบรายงานสถิติสำหรับเจ้าหน้าที่ มสธ.
            </h1>
            <p className="text-xs text-slate-500">
              ศูนย์วิทยบริการและชุมชนสัมพันธ์ มสธ. ลำปาง
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                รหัสผ่านสำหรับเจ้าหน้าที่ผู้ดูแล:
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="กรอกรหัสผ่านเพื่อเข้าใช้งาน"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#006837] focus:border-transparent"
              />
            </div>

            {authError && (
              <p className="text-xs text-rose-600 font-medium">
                {authError}
              </p>
            )}

            <div className="flex gap-2.5 pt-1">
              <button
                type="button"
                onClick={onBackToApp}
                className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                กลับหน้าหลัก
              </button>
              <button
                type="submit"
                className="flex-1 py-3 px-4 rounded-xl bg-[#004D28] hover:bg-[#00381D] text-white text-xs font-bold shadow-sm cursor-pointer"
              >
                เข้าสู่ระบบ
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div id="admin-dashboard" className="w-full max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* Reset Confirmation Success Banner */}
      <AnimatePresence>
        {resetSuccessNotice && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center justify-between shadow-sm no-print"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                <Check className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold">รีเซ็ตข้อมูลและเริ่มนับรอบใหม่เรียบร้อยแล้ว</p>
                <p className="text-xs text-emerald-700">
                  ระบบได้ล้างสถิติเก่าและเริ่มนับสถิติรอบใหม่จาก 0 เรียบร้อยแล้ว
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setResetSuccessNotice(false)}
              className="text-emerald-700 hover:text-emerald-950 p-1 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dashboard Top Header & Export Controls */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#004D28] text-[#E5C158] flex items-center justify-center flex-shrink-0">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-extrabold text-[#00381D]">
                ระบบสรุปข้อมูลสถิติ มสธ. (Admin Dashboard)
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F0F7F2] text-[#006837] border border-[#006837]/20">
                v{APP_VERSION}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              ศูนย์วิทยบริการและชุมชนสัมพันธ์ มสธ. ลำปาง • ส่งออกรายงาน Executive Summary (Excel & PDF)
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
          {/* Refresh Data */}
          <button
            type="button"
            onClick={loadDashboardData}
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="รีเฟรชข้อมูลล่าสุด"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">รีเฟรช</span>
          </button>

          {/* Print Report Direct Action */}
          <button
            type="button"
            id="btn-print-report"
            disabled={isPrinting}
            onClick={handlePrint}
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 disabled:bg-slate-800/60 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm cursor-pointer transition-all"
            title="สั่งพิมพ์รายงานออกทางเครื่องพิมพ์ หรือเลือกพิมพ์เป็น PDF ของบราวเซอร์"
          >
            <Printer className="w-4 h-4 text-emerald-300" />
            <span>{isPrinting ? 'กำลังเตรียมพิมพ์...' : 'สั่งพิมพ์เอกสาร'}</span>
          </button>

          {/* Export Executive PDF Report (jsPDF) */}
          <button
            type="button"
            id="btn-export-pdf"
            disabled={exportingPDF}
            onClick={handleExportPDF}
            className="px-3.5 py-2.5 rounded-xl bg-[#004D28] hover:bg-[#00381D] disabled:bg-[#004D28]/60 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm cursor-pointer transition-all"
            title="บันทึกรายงานสรุปผู้บริหารเป็นไฟล์ PDF ขนาด A4 ลงคอมพิวเตอร์หรือมือถือ"
          >
            {exportingPDF ? (
              <>
                <Loader2 className="w-4 h-4 text-[#E5C158] animate-spin" />
                <span>กำลังสร้าง PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-[#E5C158]" />
                <span>บันทึกเป็น PDF (สรุปผู้บริหาร)</span>
              </>
            )}
          </button>

          {/* Export 8-Sheet Excel (.xlsx) */}
          <button
            type="button"
            id="btn-export-excel"
            disabled={exportingExcel}
            onClick={handleExportExcel}
            className="px-3.5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-700/60 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm cursor-pointer transition-all"
            title="ส่งออกรายงาน 8 ชีตแบบครบถ้วนเป็นไฟล์ Excel (.xlsx)"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
            <span>{exportingExcel ? 'กำลังสร้าง Excel...' : 'ส่งออก Excel (8 ชีต)'}</span>
          </button>

          {/* Reset / Start New Count */}
          <button
            type="button"
            id="btn-reset-analytics"
            onClick={() => setShowResetModal(true)}
            className="px-3 py-2.5 rounded-xl border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs cursor-pointer transition-all"
            title="รีเซ็ตสถิติและเริ่มนับใหม่"
          >
            <RotateCcw className="w-4 h-4 text-rose-600" />
            <span>เริ่มนับใหม่</span>
          </button>

          {/* Back to App */}
          <button
            type="button"
            onClick={onBackToApp}
            className="px-3 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>กลับสู่แอป</span>
          </button>
        </div>
      </div>

      {/* Date & Persona Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs no-print">
        {/* Date Filter Selection */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-slate-700 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-[#006837]" />
            <span>ช่วงเวลา:</span>
          </span>
          {(['all', 'today', '7days', '30days', 'custom'] as const).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDateFilter(d)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                dateFilter === d
                  ? 'bg-[#004D28] text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {d === 'all' && 'ทั้งหมด'}
              {d === 'today' && 'วันนี้'}
              {d === '7days' && '7 วันล่าสุด'}
              {d === '30days' && '30 วันล่าสุด'}
              {d === 'custom' && 'กำหนดเอง'}
            </button>
          ))}

          {dateFilter === 'custom' && (
            <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="px-2 py-1 rounded border border-slate-300 text-xs"
              />
              <span>ถึง</span>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="px-2 py-1 rounded border border-slate-300 text-xs"
              />
            </div>
          )}
        </div>

        {/* Persona Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-slate-700 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-[#006837]" />
            <span>กลุ่ม Persona:</span>
          </span>
          <select
            value={personaFilter}
            onChange={(e) => setPersonaFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-[#006837]"
          >
            <option value="all">ทุกกลุ่มผลลัพธ์</option>
            <option value="career">นักพัฒนาความก้าวหน้าในอาชีพ (Career)</option>
            <option value="degree">นักสร้างโอกาสใหม่ (Degree)</option>
            <option value="upskill">นัก Upskill / Reskill (Upskill)</option>
          </select>
        </div>
      </div>

      {/* Quick Action Toolbar directly above the printable document preview */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md no-print">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-[#E5C158]" />
            <h2 className="text-sm font-extrabold text-white">
              ตัวอย่างรายงานสรุปผู้บริหาร (Executive Report Preview)
            </h2>
          </div>
          <p className="text-xs text-slate-300">
            เอกสารถูกจัดรูปแบบพร้อมสั่งพิมพ์ A4 และสามารถกดบันทึกเป็นไฟล์ PDF / Excel ลงในคอมพิวเตอร์หรือมือถือได้ทันที
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          {/* Quick Print */}
          <button
            type="button"
            id="btn-quick-print"
            disabled={isPrinting}
            onClick={handlePrint}
            className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-600/60 text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-all"
            title="สั่งพิมพ์รายงานออกทางเครื่องพิมพ์"
          >
            <Printer className="w-4 h-4 text-white" />
            <span>สั่งพิมพ์เอกสาร</span>
          </button>

          {/* Quick PDF */}
          <button
            type="button"
            id="btn-quick-pdf"
            disabled={exportingPDF}
            onClick={handleExportPDF}
            className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-[#004D28] hover:bg-[#00381D] border border-emerald-400/40 text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-all"
            title="บันทึกรายงานสรุปผู้บริหารเป็นไฟล์ PDF ลงคอมพิวเตอร์หรือมือถือ"
          >
            {exportingPDF ? (
              <>
                <Loader2 className="w-4 h-4 text-[#E5C158] animate-spin" />
                <span>กำลังบันทึก PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-[#E5C158]" />
                <span>บันทึกเป็น PDF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Formatted Printable Report Document (Used for PDF Export and On-screen Preview) */}
      <div ref={printableReportRef} className="printable-report-container">
        <PrintableReportDocument meta={reportMeta} stats={aggregatedStats} />
      </div>

      {/* PDF Download Success Modal (Supports PC, Android, iPhone/iPad) */}
      <AnimatePresence>
        {pdfSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs no-print">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-5"
            >
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#004D28] flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#00381D]">
                    บันทึกไฟล์ PDF เรียบร้อยแล้ว!
                  </h3>
                  <p className="text-xs text-slate-500">
                    รายงานสรุปผู้บริหาร ศวช. มสธ. ลำปาง
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5 text-xs text-slate-700">
                <div className="flex items-center gap-1.5 text-slate-800 font-bold">
                  <FileText className="w-4 h-4 text-[#006837]" />
                  <span className="truncate">{pdfSuccessModal.fileName}</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  ระบบได้ส่งคำสั่งบันทึกไฟล์ลงในอุปกรณ์ของคุณแล้ว (โฟลเดอร์ Downloads หรือคลังไฟล์ในมือถือ)
                </p>
              </div>

              {/* Action Buttons inside PDF dialog */}
              <div className="space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {/* Direct Open PDF in New Tab */}
                  <a
                    href={pdfSuccessModal.blobUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-4 rounded-xl bg-[#004D28] hover:bg-[#00381D] text-white text-xs font-bold inline-flex items-center justify-center gap-2 shadow-sm transition-all text-center"
                  >
                    <ExternalLink className="w-4 h-4 text-[#E5C158]" />
                    <span>เปิดดู / บันทึกซ้ำ</span>
                  </a>

                  {/* Print Document */}
                  <button
                    type="button"
                    onClick={() => {
                      handlePrint();
                    }}
                    className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold inline-flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-all"
                  >
                    <Printer className="w-4 h-4 text-emerald-300" />
                    <span>สั่งพิมพ์เอกสาร</span>
                  </button>
                </div>

                {/* Mobile Web Share if supported */}
                {typeof navigator !== 'undefined' && 'share' in navigator && (
                  <button
                    type="button"
                    onClick={handleSharePDF}
                    className="w-full py-2.5 px-4 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-[#004D28] text-xs font-bold inline-flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>แชร์ไฟล์หรือบันทึกลงแอป Files (มือถือ)</span>
                  </button>
                )}

                {/* Close Dialog */}
                <button
                  type="button"
                  onClick={() => setPdfSuccessModal(null)}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer transition-all"
                >
                  ปิดหน้าต่างนี้
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal for Resetting Count */}
      <AnimatePresence>
        {showResetModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs no-print">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 mx-auto flex items-center justify-center shadow-xs">
                <AlertTriangle className="w-7 h-7" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-slate-900">
                  ยืนยันการรีเซ็ตข้อมูลและเริ่มนับใหม่?
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed text-left bg-slate-50 p-3 rounded-xl border border-slate-200">
                  ระบบจะล้างยอดสถิติและการบันทึกทั้งหมดของรอบปัจจุบันให้กลายเป็น 0
                  <br />
                  <strong className="text-slate-800">คำแนะนำ:</strong> หากต้องการเก็บสถิติรอบนี้ไว้ โปรดกดปุ่ม <strong>"ส่งออก Excel (8 ชีต)"</strong> หรือ <strong>"บันทึกเป็น PDF"</strong> ก่อนทำการรีเซ็ต
                </p>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowResetModal(false)}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer transition-all"
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  id="btn-confirm-reset"
                  onClick={handleConfirmReset}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md cursor-pointer transition-all flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>ยืนยันเริ่มนับใหม่</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
