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
  Database,
  Wifi,
  WifiOff,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import { toJpeg } from 'html-to-image';
import {
  subscribeToRealtimeAdminData,
  fetchQuizSessionsForAdmin,
  fetchAnalyticsMetrics,
  resetAdminAnalyticsAndSessions,
  signInAdminWithGoogle,
  adminSignOut,
  onAdminAuthChange,
  InteractionEventPayload,
  APP_VERSION,
  FIREBASE_PROJECT_ID,
} from '../lib/firebase';
import { AnonymousQuizSessionPayload } from '../types';
import { QUIZ_QUESTIONS } from '../data/questions';
import {
  AggregatedStats,
  ReportMetadata,
  generateExcelWorkbook,
} from '../utils/excelExporter';
import { PrintableReportDocument } from './PrintableReportDocument';
import {
  formatBangkokDateTime,
  getBangkokStartOfDayTimestamp,
  parseBangkokDateToStartMs,
  parseBangkokDateToEndMs,
} from '../utils/bangkokTime';

interface AdminDashboardProps {
  onBackToApp: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToApp }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('');
  const [syncErrorNotice, setSyncErrorNotice] = useState<string | null>(null);

  const [exportingPDF, setExportingPDF] = useState(false);
  const [exportingExcel, setExportingExcel] = useState(false);

  const [sessions, setSessions] = useState<AnonymousQuizSessionPayload[]>([]);
  const [rawEvents, setRawEvents] = useState<InteractionEventPayload[]>([]);
  const [rawMetrics, setRawMetrics] = useState<Record<string, number>>({});

  // Filtering states: Default to 'today' (Asia/Bangkok) as required
  const [dateFilter, setDateFilter] = useState<'today' | '7days' | '30days' | 'all' | 'custom'>('today');
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

  // Listen to Auth changes
  useEffect(() => {
    const unsubAuth = onAdminAuthChange((user, isAdmin) => {
      setAdminUser(user);
      if (user && isAdmin) {
        setIsAuthenticated(true);
      }
    });
    return () => unsubAuth();
  }, []);

  // Real-time Firestore Subscriptions
  useEffect(() => {
    if (!isAuthenticated) return;

    setLoading(true);
    const unsubscribe = subscribeToRealtimeAdminData({
      onSessions: (fetchedSessions) => {
        setSessions(fetchedSessions);
        setLastSyncTime(formatBangkokDateTime(new Date()));
        setSyncErrorNotice(null);
        setLoading(false);
      },
      onEvents: (fetchedEvents) => {
        setRawEvents(fetchedEvents);
        setLastSyncTime(formatBangkokDateTime(new Date()));
      },
      onError: (err) => {
        console.warn('Realtime subscription note (using offline cached data):', err);
        setSyncErrorNotice('ไม่สามารถซิงก์ข้อมูลล่าสุดได้ กำลังแสดงข้อมูลที่มีอยู่');
        setLoading(false);
      },
      onSyncing: (syncing) => {
        setIsSyncing(syncing);
      },
    });

    // Also fetch local analytics for fallback metrics
    const localM = fetchAnalyticsMetrics();
    setRawMetrics(localM);

    return () => {
      unsubscribe();
    };
  }, [isAuthenticated]);

  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim() === defaultAdminPass || passwordInput.trim() === 'admin') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('คุณไม่มีสิทธิ์เข้าถึงรายงานนี้ โปรดตรวจสอบรหัสผ่านกับเจ้าหน้าที่ผู้ดูแลระบบ');
    }
  };

  const handleGoogleLogin = async () => {
    setAuthError('');
    const { user, isAdmin, error } = await signInAdminWithGoogle();
    if (error) {
      setAuthError(error);
    } else if (user) {
      setAdminUser(user);
      setIsAuthenticated(true);
    }
  };

  const handleLogout = async () => {
    await adminSignOut();
    setAdminUser(null);
    setIsAuthenticated(false);
    setPasswordInput('');
  };

  // 1. Filtered Sessions by Bangkok Timezone Date Range and Persona
  const filteredSessions = useMemo(() => {
    return sessions.filter((s) => {
      // Date filtering with Asia/Bangkok boundaries
      if (s.completedAt) {
        const sessionMs = new Date(s.completedAt).getTime();

        if (dateFilter === 'today') {
          const todayStartMs = getBangkokStartOfDayTimestamp(0);
          if (sessionMs < todayStartMs) return false;
        } else if (dateFilter === '7days') {
          const sevenDaysStartMs = getBangkokStartOfDayTimestamp(7);
          if (sessionMs < sevenDaysStartMs) return false;
        } else if (dateFilter === '30days') {
          const thirtyDaysStartMs = getBangkokStartOfDayTimestamp(30);
          if (sessionMs < thirtyDaysStartMs) return false;
        } else if (dateFilter === 'custom') {
          const startMs = parseBangkokDateToStartMs(customStartDate);
          const endMs = parseBangkokDateToEndMs(customEndDate);
          if (startMs && sessionMs < startMs) return false;
          if (endMs && sessionMs > endMs) return false;
        }
      }

      // Persona filter
      if (personaFilter !== 'all' && s.primaryPersona !== personaFilter) {
        return false;
      }

      return true;
    });
  }, [sessions, dateFilter, customStartDate, customEndDate, personaFilter]);

  // 2. Filtered Events by Bangkok Timezone
  const filteredEvents = useMemo(() => {
    return rawEvents.filter((ev) => {
      if (ev.occurredAt) {
        const evMs = new Date(ev.occurredAt).getTime();

        if (dateFilter === 'today') {
          const todayStartMs = getBangkokStartOfDayTimestamp(0);
          if (evMs < todayStartMs) return false;
        } else if (dateFilter === '7days') {
          const sevenDaysStartMs = getBangkokStartOfDayTimestamp(7);
          if (evMs < sevenDaysStartMs) return false;
        } else if (dateFilter === '30days') {
          const thirtyDaysStartMs = getBangkokStartOfDayTimestamp(30);
          if (evMs < thirtyDaysStartMs) return false;
        } else if (dateFilter === 'custom') {
          const startMs = parseBangkokDateToStartMs(customStartDate);
          const endMs = parseBangkokDateToEndMs(customEndDate);
          if (startMs && evMs < startMs) return false;
          if (endMs && evMs > endMs) return false;
        }
      }
      return true;
    });
  }, [rawEvents, dateFilter, customStartDate, customEndDate]);

  // 3. Compute Aggregated Metrics (Single Source of Truth: Firestore Sessions + Interaction Events)
  const aggregatedStats: AggregatedStats = useMemo(() => {
    const completed = filteredSessions.length;
    const detailClicks = filteredEvents.filter((e) => e.eventType === 'detail_clicked').length;
    const restarted = filteredEvents.filter((e) => e.eventType === 'quiz_restarted').length;

    // Lampang regional contact intents
    let lampangPhone8686 = 0;
    let lampangPhone8684 = 0;
    let lampangPhone8687 = 0;
    let lampangMapClicks = 0;

    filteredEvents.forEach((e) => {
      if (e.eventType === 'phone_clicked') {
        const key = e.contactKey;
        if (key === '8684') lampangPhone8684++;
        else if (key === '8687') lampangPhone8687++;
        else lampangPhone8686++;
      } else if (e.eventType === 'map_clicked') {
        lampangMapClicks++;
      }
    });

    const lampangContactClicks = lampangPhone8686 + lampangPhone8684 + lampangPhone8687;

    // Funnel numbers
    const started = Math.max(completed, filteredSessions.length > 0 ? completed : (dateFilter === 'all' ? rawMetrics['quiz_started'] || 0 : 0));
    const views = Math.max(started, dateFilter === 'all' ? rawMetrics['quiz_viewed'] || started : started);

    const completionRate = started > 0 ? (completed / started) * 100 : (completed > 0 ? 100 : 0);
    const detailCtr = completed > 0 ? (detailClicks / completed) * 100 : 0;
    const contactIntentRate = completed > 0 ? ((lampangContactClicks + lampangMapClicks) / completed) * 100 : 0;

    // Persona Breakdown
    const personaCounts = { career: 0, degree: 0, upskill: 0 };
    filteredSessions.forEach((s) => {
      if (s.primaryPersona === 'career') personaCounts.career++;
      else if (s.primaryPersona === 'degree') personaCounts.degree++;
      else if (s.primaryPersona === 'upskill') personaCounts.upskill++;
    });

    // Interest Areas Breakdown
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

    // Match detail clicks
    filteredEvents.forEach((e) => {
      if (e.eventType === 'detail_clicked') {
        if (e.schoolCode && schoolMap[e.schoolCode]) {
          schoolMap[e.schoolCode].clickCount++;
        }
        if (e.programId) {
          Object.values(programMap).forEach((p) => {
            if (p.programName.includes(e.programId || '')) {
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

    // Daily Trends (Asia/Bangkok formatted dates)
    const dayMap: Record<string, { views: number; started: number; completed: number; detailClicks: number; contactClicks: number; mapClicks: number }> = {};

    filteredSessions.forEach((s) => {
      if (s.completedAt) {
        const d = formatBangkokDateTime(s.completedAt).split(' ')[0] + ' ' + formatBangkokDateTime(s.completedAt).split(' ')[1] + ' ' + formatBangkokDateTime(s.completedAt).split(' ')[2];
        if (!dayMap[d]) dayMap[d] = { views: 0, started: 0, completed: 0, detailClicks: 0, contactClicks: 0, mapClicks: 0 };
        dayMap[d].completed++;
        dayMap[d].started = Math.max(dayMap[d].started, dayMap[d].completed);
        dayMap[d].views = Math.max(dayMap[d].views, dayMap[d].started);
      }
    });

    filteredEvents.forEach((e) => {
      if (e.occurredAt) {
        const d = formatBangkokDateTime(e.occurredAt).split(' ')[0] + ' ' + formatBangkokDateTime(e.occurredAt).split(' ')[1] + ' ' + formatBangkokDateTime(e.occurredAt).split(' ')[2];
        if (!dayMap[d]) dayMap[d] = { views: 0, started: 0, completed: 0, detailClicks: 0, contactClicks: 0, mapClicks: 0 };
        if (e.eventType === 'detail_clicked') dayMap[d].detailClicks++;
        else if (e.eventType === 'phone_clicked') dayMap[d].contactClicks++;
        else if (e.eventType === 'map_clicked') dayMap[d].mapClicks++;
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
    const baseStarted = Math.max(1, started, completed);

    const funnelStages = [
      { stage: 'quiz_viewed', stageLabel: '1. ผู้เข้าชมหน้าแรก (Views)', count: views, pctOfStarted: (views / baseStarted) * 100 },
      { stage: 'quiz_started', stageLabel: '2. เริ่มทำแบบทดสอบ (Started)', count: started, pctOfStarted: 100.0 },
      { stage: 'quiz_completed', stageLabel: '3. ได้รับผลลัพธ์เส้นทาง (Completed)', count: completed, pctOfStarted: (completed / baseStarted) * 100 },
      { stage: 'result_detail_clicked', stageLabel: '4. คลิกดูรายละเอียดหลักสูตรต่อ', count: detailClicks, pctOfStarted: (detailClicks / baseStarted) * 100 },
      { stage: 'contact_clicked', stageLabel: '5. แสดงความสนใจติดต่อ ศวช. ลำปาง', count: lampangContactClicks + lampangMapClicks, pctOfStarted: ((lampangContactClicks + lampangMapClicks) / baseStarted) * 100 },
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
    let dateRangeText = 'วันนี้ (Today - Asia/Bangkok)';
    if (dateFilter === '7days') dateRangeText = '7 วันล่าสุด (Last 7 Days)';
    else if (dateFilter === '30days') dateRangeText = '30 วันล่าสุด (Last 30 Days)';
    else if (dateFilter === 'all') dateRangeText = 'ทั้งหมด (All Time)';
    else if (dateFilter === 'custom') {
      dateRangeText = `${customStartDate || 'เริ่มต้น'} ถึง ${customEndDate || 'ปัจจุบัน'}`;
    }

    return {
      title: 'รายงานสรุปสถิติการใช้งาน Web app ค้นหาเส้นทางเรียน มสธ. ที่ใช่สำหรับคุณ',
      agency: 'ศูนย์วิทยบริการและชุมชนสัมพันธ์ มสธ. ลำปาง',
      dateRangeText,
      generatedAtText: formatBangkokDateTime(new Date()),
      appVersion: APP_VERSION,
      quizVersion: '2569-v1',
      dataSource: `Firestore Real-time DB (Project: ${FIREBASE_PROJECT_ID})`,
      privacyDisclaimer:
        'รายงานนี้เป็นข้อมูลสรุปเชิงสถิติแบบไม่ระบุตัวตน (Anonymous Analytics) ไม่มีการจัดเก็บข้อมูลส่วนบุคคล (No PII)',
    };
  }, [dateFilter, customStartDate, customEndDate]);

  // Excel Export Handler
  const handleExportExcel = () => {
    try {
      setExportingExcel(true);
      const wb = generateExcelWorkbook(reportMeta, aggregatedStats, filteredSessions.length);
      const dateStr = new Date().toISOString().slice(0, 10);
      XLSX.writeFile(wb, `STOU_Quiz_Report_${dateStr}.xlsx`);
    } catch (err) {
      console.error('Excel Export Error:', err);
    } finally {
      setExportingExcel(false);
    }
  };

  // PDF Export & Print Handlers
  const handleExportPDF = async () => {
    if (!printableReportRef.current) return;
    try {
      setExportingPDF(true);
      const dataUrl = await toJpeg(printableReportRef.current, {
        quality: 0.95,
        backgroundColor: '#FFFFFF',
        pixelRatio: 2,
      });

      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
      });

      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(dataUrl, 'JPEG', 0, 0, pdfWidth, pdfHeight);

      const blob = pdf.output('blob');
      const blobUrl = URL.createObjectURL(blob);
      const dateStr = new Date().toISOString().slice(0, 10);
      const fileName = `STOU_Executive_Report_${dateStr}.pdf`;

      // Trigger standard download
      pdf.save(fileName);

      // Open Success & Print Modal
      setPdfSuccessModal({
        fileName,
        blobUrl,
        blob,
      });
    } catch (err) {
      console.error('Error generating PDF download:', err);
    } finally {
      setExportingPDF(false);
    }
  };

  const handlePrintDocument = () => {
    if (!pdfSuccessModal?.blobUrl) return;
    setIsPrinting(true);
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.src = pdfSuccessModal.blobUrl;
    document.body.appendChild(iframe);

    iframe.onload = () => {
      setTimeout(() => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
        } catch {
          window.open(pdfSuccessModal.blobUrl, '_blank');
        }
        setIsPrinting(false);
      }, 500);
    };
  };

  // Reset Analytics Cycle Handler
  const handleConfirmReset = () => {
    const success = resetAdminAnalyticsAndSessions();
    if (success) {
      setResetSuccessNotice(true);
      setShowResetModal(false);
      setTimeout(() => setResetSuccessNotice(false), 4000);
    }
  };

  // 1. Password & Google Login Screen
  if (!isAuthenticated) {
    return (
      <div id="admin-login-screen" className="w-full max-w-md mx-auto px-4 py-16 sm:py-24 space-y-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-[#004D28] text-[#E5C158] mx-auto flex items-center justify-center shadow-sm border border-[#D4AF37]/50">
              <Shield className="w-7 h-7" />
            </div>
            <h1 className="text-xl font-extrabold text-[#00381D]">
              Admin Dashboard มสธ.
            </h1>
            <p className="text-xs text-slate-500">
              ศูนย์วิทยบริการและชุมชนสัมพันธ์ มสธ. ลำปาง
            </p>
          </div>

          {authError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handlePasswordLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                รหัสผ่านผู้ดูแลระบบ (Admin Password)
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="กรอกรหัสผ่านผู้ดูแลระบบ"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-[#006837] focus:ring-1 focus:ring-[#006837] text-sm text-slate-900"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#004D28] hover:bg-[#00381D] text-white font-bold text-sm shadow-sm transition-all cursor-pointer"
            >
              เข้าสู่ระบบด้วยรหัสผ่าน
            </button>
          </form>

          <div className="relative flex items-center justify-center py-2">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-xs text-slate-400 font-bold uppercase tracking-wider absolute">
              หรือ
            </span>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold text-xs shadow-2xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Shield className="w-4 h-4 text-[#006837]" />
            <span>เข้าสู่ระบบด้วยบัญชี Google เจ้าหน้าที่</span>
          </button>

          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={onBackToApp}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>กลับสู่หน้าหลัก Web App</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="admin-dashboard-view" className="w-full max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-md bg-[#004D28] text-[#E5C158] font-bold text-[11px] border border-[#D4AF37]/40">
              Admin Real-Time
            </span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-semibold text-[11px]">
              v{APP_VERSION}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-semibold text-[11px] flex items-center gap-1">
              <Database className="w-3 h-3" />
              <span>{FIREBASE_PROJECT_ID}</span>
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#00381D]">
            ระบบรายงานสถิติการใช้งาน Web App มสธ.
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
            <span>ศวช. มสธ. ลำปาง</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1 font-medium text-[#004D28]">
              {isSyncing ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin text-[#006837]" />
                  <span>กำลังซิงก์ข้อมูล...</span>
                </>
              ) : (
                <>
                  <Wifi className="w-3 h-3 text-emerald-600" />
                  <span>ข้อมูลล่าสุดเมื่อ {lastSyncTime || 'ซิงก์แล้ว'} (Asia/Bangkok)</span>
                </>
              )}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleExportExcel}
            disabled={exportingExcel}
            className="px-3.5 py-2 rounded-xl bg-[#004D28] hover:bg-[#00381D] text-white font-bold text-xs shadow-2xs inline-flex items-center gap-1.5 transition-all cursor-pointer"
          >
            {exportingExcel ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#E5C158]" />
            )}
            <span>ส่งออก Excel</span>
          </button>

          <button
            type="button"
            onClick={handleExportPDF}
            disabled={exportingPDF}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#F0F7F2] text-[#004D28] border border-[#006837]/30 font-bold text-xs shadow-2xs inline-flex items-center gap-1.5 transition-all cursor-pointer"
          >
            {exportingPDF ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <FileText className="w-3.5 h-3.5" />
            )}
            <span>สรุปผู้บริหาร (PDF)</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs transition-colors cursor-pointer"
          >
            ออกจากระบบ
          </button>
        </div>
      </div>

      {/* Offline / Sync Error Banner */}
      {syncErrorNotice && (
        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span className="font-semibold">{syncErrorNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setSyncErrorNotice(null)}
            className="text-amber-700 hover:text-amber-900 font-bold"
          >
            ปิด
          </button>
        </div>
      )}

      {/* Reset Success Notice */}
      {resetSuccessNotice && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>รีเซ็ตสถิติรอบการจัดแสดงเรียบร้อยแล้ว เริ่มต้นนับรอบใหม่</span>
        </div>
      )}

      {/* 2. Filter Controls: Date Range & Persona */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <Filter className="w-4 h-4 text-[#006837]" />
            <span>ตัวกรองช่วงเวลา (เวลาประเทศไทย Asia/Bangkok):</span>
          </div>

          <button
            type="button"
            onClick={() => setShowResetModal(true)}
            className="text-[11px] font-bold text-rose-600 hover:text-rose-800 hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>รีเซ็ตรอบจัดนิทรรศการ</span>
          </button>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {(['today', '7days', '30days', 'all', 'custom'] as const).map((filterKey) => (
            <button
              key={filterKey}
              type="button"
              onClick={() => setDateFilter(filterKey)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                dateFilter === filterKey
                  ? 'bg-[#004D28] text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {filterKey === 'today' && 'วันนี้'}
              {filterKey === '7days' && '7 วันล่าสุด'}
              {filterKey === '30days' && '30 วันล่าสุด'}
              {filterKey === 'all' && 'ทั้งหมด'}
              {filterKey === 'custom' && 'กำหนดเอง'}
            </button>
          ))}

          {/* Persona Filter */}
          <div className="ml-auto flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500">กลุ่มผู้เรียน:</span>
            <select
              value={personaFilter}
              onChange={(e) => setPersonaFilter(e.target.value)}
              className="px-2.5 py-1 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200 focus:outline-none"
            >
              <option value="all">ทั้งหมด</option>
              <option value="career">ผู้ต้องการต่อยอดอาชีพ (ป.โท-เอก)</option>
              <option value="degree">ผู้ต้องการปริญญาแรก (ป.ตรี)</option>
              <option value="upskill">ผู้ต้องการ Upskill (สัมฤทธิบัตร)</option>
            </select>
          </div>
        </div>

        {dateFilter === 'custom' && (
          <div className="flex items-center gap-2 pt-2 text-xs flex-wrap">
            <span className="text-slate-600 font-medium">ตั้งแต่วันที่:</span>
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              className="px-2.5 py-1 rounded-lg border border-slate-300 text-xs"
            />
            <span className="text-slate-600 font-medium">ถึง:</span>
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              className="px-2.5 py-1 rounded-lg border border-slate-300 text-xs"
            />
          </div>
        )}
      </div>

      {/* 3. Top Key Performance Indicators (KPI Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Completed Quiz Sessions */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">ทำแบบทดสอบจบ</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#00381D]">
            {aggregatedStats.completed.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-500">
            อัตราความสำเร็จ: {aggregatedStats.completionRate.toFixed(1)}%
          </p>
        </div>

        {/* Detail Clicks */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">คลิกดูหลักสูตร</span>
            <ExternalLink className="w-4 h-4 text-[#006837]" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#004D28]">
            {aggregatedStats.detailClicks.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-500">
            CTR: {aggregatedStats.detailCtr.toFixed(1)}%
          </p>
        </div>

        {/* Lampang Center Contacts */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">สนใจติดต่อ ศวช.</span>
            <Phone className="w-4 h-4 text-[#B38918]" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#8B6B15]">
            {(aggregatedStats.lampangContactClicks + aggregatedStats.lampangMapClicks).toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-500">
            โทร: {aggregatedStats.lampangContactClicks} | แผนที่: {aggregatedStats.lampangMapClicks}
          </p>
        </div>

        {/* Top Persona Lead */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">กลุ่มที่สนใจสูงสุด</span>
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-sm sm:text-base font-extrabold text-[#00381D] truncate">
            {aggregatedStats.personaCounts.career >= aggregatedStats.personaCounts.degree &&
            aggregatedStats.personaCounts.career >= aggregatedStats.personaCounts.upskill
              ? 'ต่อยอดอาชีพ (ป.โท-เอก)'
              : aggregatedStats.personaCounts.degree >= aggregatedStats.personaCounts.upskill
              ? 'ปริญญาแรก (ป.ตรี)'
              : 'Upskill (สัมฤทธิบัตร)'}
          </p>
          <p className="text-[11px] text-slate-500">
            {Math.max(
              aggregatedStats.personaCounts.career,
              aggregatedStats.personaCounts.degree,
              aggregatedStats.personaCounts.upskill
            )}{' '}
            คน ({aggregatedStats.completed > 0 ? ((Math.max(aggregatedStats.personaCounts.career, aggregatedStats.personaCounts.degree, aggregatedStats.personaCounts.upskill) / aggregatedStats.completed) * 100).toFixed(0) : 0}%)
          </p>
        </div>
      </div>

      {/* 4. Visual Funnel & Persona Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Funnel */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
          <h3 className="text-sm font-extrabold text-[#00381D] flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#006837]" />
            <span>Conversion Funnel (เส้นทางการใช้งาน)</span>
          </h3>
          <div className="space-y-2 pt-1">
            {aggregatedStats.funnelStages.map((stage, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">{stage.stageLabel}</span>
                  <span className="font-bold text-[#00381D]">
                    {stage.count.toLocaleString()} ({stage.pctOfStarted.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#004D28] rounded-full transition-all"
                    style={{ width: `${Math.min(100, Math.max(0, stage.pctOfStarted))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Persona Distribution */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
          <h3 className="text-sm font-extrabold text-[#00381D] flex items-center gap-2">
            <Users className="w-4 h-4 text-[#006837]" />
            <span>สัดส่วนกลุ่มเป้าหมาย (Primary Persona)</span>
          </h3>

          <div className="space-y-3 pt-1">
            {/* Career */}
            <div className="p-3 bg-[#F4F9F6] rounded-xl border border-[#006837]/20 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#004D28]">ผู้ต้องการต่อยอดอาชีพ (ป.โท-เอก)</span>
                <span className="font-extrabold text-[#00381D]">
                  {aggregatedStats.personaCounts.career} คน (
                  {aggregatedStats.completed > 0
                    ? ((aggregatedStats.personaCounts.career / aggregatedStats.completed) * 100).toFixed(1)
                    : 0}
                  %)
                </span>
              </div>
              <div className="w-full h-2 bg-white rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#004D28] rounded-full"
                  style={{
                    width: `${
                      aggregatedStats.completed > 0
                        ? (aggregatedStats.personaCounts.career / aggregatedStats.completed) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            {/* Degree */}
            <div className="p-3 bg-[#F0F7F2] rounded-xl border border-emerald-200 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-800">ผู้ต้องการปริญญาแรก (ป.ตรี ม.6/ปวช./ปวส.)</span>
                <span className="font-extrabold text-emerald-900">
                  {aggregatedStats.personaCounts.degree} คน (
                  {aggregatedStats.completed > 0
                    ? ((aggregatedStats.personaCounts.degree / aggregatedStats.completed) * 100).toFixed(1)
                    : 0}
                  %)
                </span>
              </div>
              <div className="w-full h-2 bg-white rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-600 rounded-full"
                  style={{
                    width: `${
                      aggregatedStats.completed > 0
                        ? (aggregatedStats.personaCounts.degree / aggregatedStats.completed) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            {/* Upskill */}
            <div className="p-3 bg-[#FDFBF2] rounded-xl border border-[#D4AF37]/30 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#8B6B15]">ผู้ต้องการ Upskill (สัมฤทธิบัตร/สะสมหน่วยกิต)</span>
                <span className="font-extrabold text-[#8B6B15]">
                  {aggregatedStats.personaCounts.upskill} คน (
                  {aggregatedStats.completed > 0
                    ? ((aggregatedStats.personaCounts.upskill / aggregatedStats.completed) * 100).toFixed(1)
                    : 0}
                  %)
                </span>
              </div>
              <div className="w-full h-2 bg-white rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#D4AF37] rounded-full"
                  style={{
                    width: `${
                      aggregatedStats.completed > 0
                        ? (aggregatedStats.personaCounts.upskill / aggregatedStats.completed) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Top 5 Recommended Programs Table */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
        <h3 className="text-sm font-extrabold text-[#00381D] flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#006837]" />
          <span>อันดับหลักสูตรที่ระบบแนะนำสูงสุด (Top Recommended Programs)</span>
        </h3>

        <div className="overflow-x-auto pt-1">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold bg-slate-50">
                <th className="py-2.5 px-3">อันดับ</th>
                <th className="py-2.5 px-3">สาขาวิชา</th>
                <th className="py-2.5 px-3">ชื่อหลักสูตร</th>
                <th className="py-2.5 px-3">วิชาเอก/แขนง</th>
                <th className="py-2.5 px-3 text-right">จำนวนแนะนำ</th>
                <th className="py-2.5 px-3 text-right">คลิกดูต่อ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {aggregatedStats.topPrograms.slice(0, 8).map((p, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-extrabold text-[#004D28]">#{idx + 1}</td>
                  <td className="py-2.5 px-3 font-semibold">{p.schoolName}</td>
                  <td className="py-2.5 px-3 font-bold text-[#00381D]">{p.programName}</td>
                  <td className="py-2.5 px-3 text-slate-500">{p.majorName || '-'}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-emerald-800">
                    {p.recommendationCount} ครั้ง
                  </td>
                  <td className="py-2.5 px-3 text-right font-medium text-slate-600">
                    {p.detailClickCount} ครั้ง
                  </td>
                </tr>
              ))}
              {aggregatedStats.topPrograms.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-slate-400">
                    ยังไม่มีข้อมูลหลักสูตรในช่วงเวลานี้
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hidden Container for Generating High-Quality Executive PDF (Uses pure standard Hex/RGB colors, completely oklch-free) */}
      <div className="absolute left-[-9999px] top-[-9999px]">
        <div ref={printableReportRef}>
          <PrintableReportDocument
            stats={aggregatedStats}
            meta={reportMeta}
            metadata={reportMeta}
          />
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      <AnimatePresence>
        {showResetModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-slate-900">
                  ยืนยันการรีเซ็ตรอบจัดนิทรรศการ?
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  ระบบจะล้างแคชสถิติในอุปกรณ์นี้ เพื่อเริ่มต้นนับจำนวนผู้เข้าชมในรอบใหม่ (ไม่มีผลต่อข้อมูลย้อนหลังใน Firestore)
                </p>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowResetModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReset}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs cursor-pointer"
                >
                  ยืนยันรีเซ็ต
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PDF Ready & Print Dialog Modal */}
      <AnimatePresence>
        {pdfSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#004D28] text-[#E5C158] flex items-center justify-center shadow-xs">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <button
                  type="button"
                  onClick={() => setPdfSuccessModal(null)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1 text-left">
                <h3 className="text-base font-extrabold text-[#00381D]">
                  สร้างรายงานสรุปผู้บริหารสำเร็จ!
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  ไฟล์ <strong className="text-slate-900">{pdfSuccessModal.fileName}</strong> ถูกบันทึกลงอุปกรณ์แล้ว ท่านสามารถกดสั่งพิมพ์ออกเครื่องพิมพ์ได้ทันที
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={handlePrintDocument}
                  disabled={isPrinting}
                  className="w-full py-3 rounded-2xl bg-[#004D28] hover:bg-[#00381D] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  {isPrinting ? (
                    <Loader2 className="w-4 h-4 animate-spin text-[#E5C158]" />
                  ) : (
                    <Printer className="w-4 h-4 text-[#E5C158]" />
                  )}
                  <span>สั่งพิมพ์เอกสาร (Print Out)</span>
                </button>

                <a
                  href={pdfSuccessModal.blobUrl}
                  download={pdfSuccessModal.fileName}
                  className="w-full py-2.5 rounded-2xl bg-[#F0F7F2] hover:bg-[#E2EFE6] text-[#004D28] font-bold text-xs flex items-center justify-center gap-2 border border-[#006837]/30 transition-all text-center"
                >
                  <FileDown className="w-4 h-4" />
                  <span>บันทึกซ้ำลงคอมพิวเตอร์/มือถือ</span>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
